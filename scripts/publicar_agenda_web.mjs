#!/usr/bin/env node
/**
 * publicar_agenda_web.mjs — Publica agenda editorial mensal como página web.
 *
 * O QUE FAZ:
 *   1. Lê o CSV `agenda-publicacao-<cliente>-<nomemes>-<ano>.csv` do REPO LOCAL
 *      (`clientes/<slug>/agendas/<YYYY-MM>/`). Use --drive-dir só pra migrar
 *      histórico antigo que ainda está no Drive sob demanda.
 *   2. Lê as subpastas em `entregaveis/` (imagem.png ou 01.png+02.png+... pra carrossel)
 *   3. Upload das mídias pro bucket `agendas-public/<share_token>/` no Supabase Storage
 *   4. Upsert da agenda em `editorial_agendas` (preserva share_token em republicação)
 *   5. Upsert dos items em `editorial_items` (preserva ids → preserva feedbacks vinculados)
 *   6. Dispara notificação Telegram via shared/agenda-editorial/notifier
 *
 * USO:
 *   node scripts/publicar_agenda_web.mjs --cliente delamore --mes 2026-06
 *   node scripts/publicar_agenda_web.mjs --cliente delamore --mes 2026-06 --dry-run
 *   node scripts/publicar_agenda_web.mjs --cliente delamore --mes 2026-06 --drive-dir "G:\\Meu Drive\\..."
 *   node scripts/publicar_agenda_web.mjs --cliente delamore --mes 2026-06 --no-telegram
 *
 * FLAGS:
 *   --cliente <slug>     Slug do cliente (delamore, camila-estetica, zoomma)
 *   --mes <YYYY-MM>      Período da agenda
 *   --titulo "<text>"    Título da agenda (default: "Agenda <Mes> <Ano> — <Cliente>")
 *   --drive-dir <path>   Override: lê do Drive (path da pasta do MÊS) em vez do repo local.
 *                        Use só pra migrar histórico antigo sob demanda.
 *   --dry-run            Mostra o que faria sem aplicar
 *   --no-telegram        Pula notificação Telegram
 *   --app-url <url>      URL base da app (default: NEXT_PUBLIC_APP_URL ou http://localhost:3000)
 *
 * REQUISITOS:
 *   - Migration 022 aplicada
 *   - Cliente já sincronizado: npm run cliente:sync -- --from-disk <slug>
 *   - C:/github/zoomma_automations/.env com SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + TELEGRAM_*
 */

import { readFile, stat, readdir } from 'node:fs/promises'
import { resolve, join, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSupabaseAdmin, getClientIdBySlug } from './lib/supabase_admin.mjs'
import { parseCsv } from './lib/csv_parse.mjs'

const BUCKET = 'agendas-public'
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const MES_PT = {
  '01': { nome: 'janeiro', abr: 'Jan' },
  '02': { nome: 'fevereiro', abr: 'Fev' },
  '03': { nome: 'marco', abr: 'Mar' },
  '04': { nome: 'abril', abr: 'Abr' },
  '05': { nome: 'maio', abr: 'Mai' },
  '06': { nome: 'junho', abr: 'Jun' },
  '07': { nome: 'julho', abr: 'Jul' },
  '08': { nome: 'agosto', abr: 'Ago' },
  '09': { nome: 'setembro', abr: 'Set' },
  '10': { nome: 'outubro', abr: 'Out' },
  '11': { nome: 'novembro', abr: 'Nov' },
  '12': { nome: 'dezembro', abr: 'Dez' },
}

// Default: lê do REPO LOCAL em `clientes/<slug>/agendas/<mes>/`. Esse path é
// onde os scripts geradores escrevem desde a Fase 2 da migração Drive→Supabase
// (2026-05-30). Use --drive-dir só pra migrar histórico antigo sob demanda.
function defaultLocalDir(slug, periodo) {
  return join(REPO_ROOT, 'clientes', slug, 'agendas', periodo)
}

// ─── CLI parsing ────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2)
  const flags = {
    cliente: null,
    mes: null,
    titulo: null,
    driveDir: null,
    appUrl: null,
    dryRun: false,
    noTelegram: false,
    help: false,
  }
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--help' || a === '-h') flags.help = true
    else if (a === '--dry-run') flags.dryRun = true
    else if (a === '--no-telegram') flags.noTelegram = true
    else if (a === '--cliente') flags.cliente = args[++i]
    else if (a === '--mes') flags.mes = args[++i]
    else if (a === '--titulo') flags.titulo = args[++i]
    else if (a === '--drive-dir') flags.driveDir = args[++i]
    else if (a === '--app-url') flags.appUrl = args[++i]
    else throw new Error(`Flag desconhecida: ${a}`)
  }
  return flags
}

function printUsage() {
  console.log(`
publicar_agenda_web.mjs — Publica agenda editorial como página web.

USO:
  node scripts/publicar_agenda_web.mjs --cliente <slug> --mes <YYYY-MM> [opcoes]

FLAGS:
  --cliente <slug>       Slug do cliente (obrigatório)
  --mes <YYYY-MM>        Período da agenda (obrigatório)
  --titulo "<text>"      Título customizado (default: gerado automaticamente)
  --drive-dir <path>     Override do path do Drive
  --app-url <url>        URL base da app web
  --dry-run              Não aplica, só mostra o plano
  --no-telegram          Pula notificação Telegram
  --help, -h             Esta mensagem

EXEMPLOS:
  node scripts/publicar_agenda_web.mjs --cliente delamore --mes 2026-06
  node scripts/publicar_agenda_web.mjs --cliente delamore --mes 2026-06 --dry-run
`)
}

// ─── Path resolution ────────────────────────────────────────────────────────

/**
 * Resolve a pasta do mês (que contém o CSV + entregaveis/).
 * Estratégia:
 *   - Se --drive-dir foi passado, usa direto como pasta do mês (override pra migrar histórico).
 *   - Senão, usa `clientes/<slug>/agendas/<mes>/` no repo local.
 */
function resolvePeriodFolder(slug, periodo, driveDirOverride) {
  if (driveDirOverride) return driveDirOverride
  return defaultLocalDir(slug, periodo)
}

function csvFileName(slug, period) {
  const [ano, mm] = period.split('-')
  const mes = MES_PT[mm]?.nome
  if (!mes) throw new Error(`Mês inválido em "${period}" (esperado YYYY-MM)`)
  return `agenda-publicacao-${slug}-${mes}-${ano}.csv`
}

function buildDefaultTitle(clientName, period) {
  const [ano, mm] = period.split('-')
  const abr = MES_PT[mm]?.abr ?? mm
  return `Agenda ${abr}/${ano} — ${clientName}`
}

// ─── Resolução de mídia ─────────────────────────────────────────────────────

/**
 * Resolve, pra um post do CSV, as mídias físicas disponíveis na pasta de entregável.
 *
 * Filesystem é a fonte de verdade — o CSV é apenas ponteiro pra subpasta.
 * Isso permite que o CSV diga "7 slides" mas o disco tenha 6 (cliente removeu
 * 1 depois de feedback) sem quebrar o publicador.
 *
 * Retorna { kind: 'post'|'carrossel'|'reel'|'sem_midia', ... }
 */
async function resolveMedia(post, entregaveisRoot) {
  const tipo = (post.tipo ?? '').toLowerCase()

  // Resolve a pasta do post: prefere CSV (imagem_path), senão tenta inferir
  let postDir = null
  if (post.imagem_path) {
    // imagem_path pode ser "entregaveis/NN_DATA_TIPO_TEMA/imagem.png" ou com `|` (carrossel v3 antigo)
    const firstPath = post.imagem_path.split('|')[0].trim()
    const subpastaRelativa = firstPath.split('/').slice(0, -1).join('/')
    if (subpastaRelativa) {
      postDir = join(entregaveisRoot, '..', subpastaRelativa)
    }
  }
  if (!postDir) {
    postDir = await guessFolderForPost(post, entregaveisRoot)
  }

  // REEL
  if (tipo === 'reel') {
    if (postDir) {
      const capa = await findCapa(postDir)
      const video = await findVideo(postDir)
      return {
        kind: 'reel',
        capa: capa ? join(postDir, capa) : null,
        video: video ? join(postDir, video) : null,
      }
    }
    return { kind: 'reel', capa: null, video: null }
  }

  // POST / CARROSSEL — listar arquivos NN.png da pasta
  if (!postDir) return { kind: 'sem_midia', files: [] }

  const files = await listMediaFiles(postDir)
  if (files.length === 0) return { kind: 'sem_midia', files: [] }

  // Carrossel: múltiplos NN.png. Post: imagem.png ou 01.png único.
  const carrosselFiles = files
    .filter((f) => /^\d{1,3}\.(png|jpe?g|webp)$/i.test(f))
    .sort()
  const singleImage = files.find((f) => /^imagem\.(png|jpe?g|webp)$/i.test(f))

  // Decide pelo tipo declarado no CSV (mais confiável)
  if (tipo === 'carrossel') {
    if (carrosselFiles.length === 0) return { kind: 'sem_midia', files: [] }
    return {
      kind: 'carrossel',
      files: carrosselFiles.map((f) => join(postDir, f)),
    }
  }

  // POST: prefere imagem.png; fallback pro primeiro NN.png
  if (singleImage) return { kind: 'post', files: [join(postDir, singleImage)] }
  if (carrosselFiles.length > 0) return { kind: 'post', files: [join(postDir, carrosselFiles[0])] }
  return { kind: 'sem_midia', files: [] }
}

async function listMediaFiles(dir) {
  try {
    const entries = await readdir(dir)
    return entries.filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  } catch {
    return []
  }
}

async function guessFolderForPost(post, entregaveisRoot) {
  // Tenta inferir pasta `NN_DATA_TIPO_TEMA` a partir dos campos do post
  const id = String(post.post_id).padStart(2, '0')
  const tema = (post.tema ?? '').trim()
  const tipo = (post.tipo ?? '').trim()
  const data = (post.data_publicacao ?? '').trim()
  if (!data || !tipo) return null
  const expectedPrefix = `${id}_${data}_${tipo}_${tema}`
  try {
    const entries = await readdir(entregaveisRoot, { withFileTypes: true })
    const match = entries.find(
      (e) => e.isDirectory() && (e.name === expectedPrefix || e.name.startsWith(`${id}_${data}_${tipo}_`))
    )
    if (!match) return null
    return join(entregaveisRoot, match.name)
  } catch {
    return null
  }
}

async function findCapa(dir) {
  try {
    const entries = await readdir(dir)
    return entries.find((f) => /^capa\.(png|jpe?g|webp)$/i.test(f)) ?? null
  } catch {
    return null
  }
}

async function findVideo(dir) {
  try {
    const entries = await readdir(dir)
    return entries.find((f) => /\.(mp4|mov|webm)$/i.test(f)) ?? null
  } catch {
    return null
  }
}

// ─── Upload helpers ────────────────────────────────────────────────────────

function mimeFromPath(p) {
  const ext = p.toLowerCase().split('.').pop()
  return (
    {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      webm: 'video/webm',
    }[ext] ?? 'application/octet-stream'
  )
}

/**
 * Faz upload de um arquivo local pro bucket. Retorna URL pública.
 */
async function uploadFile(sb, localPath, storagePath) {
  const buffer = await readFile(localPath)
  const contentType = mimeFromPath(localPath)
  const { error } = await sb.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType, upsert: true, cacheControl: '3600' })
  if (error) {
    throw new Error(`upload ${storagePath}: ${error.message}`)
  }
  const { data } = sb.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

// ─── Main flow ──────────────────────────────────────────────────────────────

async function main() {
  let flags
  try {
    flags = parseArgs(process.argv)
  } catch (err) {
    console.error('❌', err.message)
    printUsage()
    process.exit(1)
  }

  if (flags.help) {
    printUsage()
    return
  }
  if (!flags.cliente || !flags.mes) {
    console.error('❌ --cliente e --mes são obrigatórios')
    printUsage()
    process.exit(1)
  }

  // 1. Resolve paths
  const periodoFolder = resolvePeriodFolder(flags.cliente, flags.mes, flags.driveDir)
  const csvPath = join(periodoFolder, csvFileName(flags.cliente, flags.mes))
  const entregaveisDir = join(periodoFolder, 'entregaveis')

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📁 Cliente:    ${flags.cliente}`)
  console.log(`📅 Período:    ${flags.mes}`)
  console.log(`📂 Pasta:      ${periodoFolder}`)
  console.log(`📄 CSV:        ${csvPath}`)
  console.log(`📦 Entregáveis: ${entregaveisDir}`)
  console.log(`🔧 Modo:       ${flags.dryRun ? 'DRY-RUN (não aplica)' : 'PRODUÇÃO (aplica)'}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // 2. Valida estrutura
  await ensureFile(csvPath, 'CSV de publicação')
  await ensureDir(entregaveisDir, 'pasta de entregáveis')

  // 3. Resolve cliente no banco
  const client = await getClientIdBySlug(flags.cliente)
  console.log(`✓ Cliente "${client.name}" (id=${client.id.slice(0, 8)}…) encontrado no banco`)

  // 4. Lê e parseia CSV
  const csvContent = await readFile(csvPath, 'utf8')
  const rows = parseCsv(csvContent)
  console.log(`✓ CSV parseado: ${rows.length} posts`)

  // 5. Resolve mídia de cada post
  const plan = []
  for (const row of rows) {
    const media = await resolveMedia(row, entregaveisDir)
    plan.push({ row, media })
  }

  // Resumo do que será feito
  const stats = {
    posts: plan.filter((p) => p.media.kind === 'post').length,
    carrosseis: plan.filter((p) => p.media.kind === 'carrossel').length,
    reels: plan.filter((p) => p.media.kind === 'reel').length,
    sem_midia: plan.filter((p) => p.media.kind === 'sem_midia').length,
  }
  console.log(`  → posts: ${stats.posts}, carrosséis: ${stats.carrosseis}, reels: ${stats.reels}, sem mídia: ${stats.sem_midia}`)

  // 6. Upsert agenda
  const sb = getSupabaseAdmin()
  const titulo = flags.titulo ?? buildDefaultTitle(client.name, flags.mes)

  if (flags.dryRun) {
    console.log('\n[DRY-RUN] Plano de publicação:')
    for (const p of plan) {
      const mediaSummary = describeMedia(p.media)
      console.log(`  · ${String(p.row.post_id).padStart(2, '0')} ${p.row.data_publicacao} ${p.row.tipo}: ${mediaSummary}`)
    }
    console.log(`\n[DRY-RUN] Agenda seria criada/atualizada: "${titulo}"`)
    console.log('[DRY-RUN] Nada foi aplicado. Rode sem --dry-run pra publicar de verdade.')
    return
  }

  console.log(`\n📤 Aplicando: upsert agenda + upload mídias + upsert items…\n`)

  const agenda = await upsertAgenda(sb, {
    client_id: client.id,
    period: flags.mes,
    title: titulo,
  })
  console.log(`✓ Agenda upserted (id=${agenda.id.slice(0, 8)}…, token=${agenda.share_token.slice(0, 8)}…)`)

  // 7. Pra cada post: upload mídia + montar payload do item
  const itemsToUpsert = []
  for (const { row, media } of plan) {
    const ordem = parseInt(row.post_id, 10)
    if (!Number.isFinite(ordem)) {
      console.warn(`  ⚠ post_id inválido em "${row.post_id}", pulando`)
      continue
    }

    const itemPayload = {
      ordem,
      tipo: row.tipo,
      publish_date: row.data_publicacao || null,
      tema: row.tema || null,
      pilar: row.pilar || null,
      legenda: row.legenda || null,
      texto_imagem: null,
      prompt: null,
      images: [],
      video_url: null,
      capa_url: null,
      roteiro: null,
    }

    // Upload mídias
    if (media.kind === 'post' || media.kind === 'carrossel') {
      const urls = []
      for (let i = 0; i < media.files.length; i++) {
        const local = media.files[i]
        await ensureFile(local, `imagem do post ${ordem}`)
        const storagePath = `${agenda.share_token}/${String(ordem).padStart(2, '0')}/${basename(local)}`
        const url = await uploadFile(sb, local, storagePath)
        urls.push({ url, ordem: i + 1, alt: row.tema || null })
        console.log(`  ↑ ${storagePath}`)
      }
      itemPayload.images = urls
    } else if (media.kind === 'reel') {
      if (media.capa) {
        const storagePath = `${agenda.share_token}/${String(ordem).padStart(2, '0')}/capa${getExt(media.capa)}`
        itemPayload.capa_url = await uploadFile(sb, media.capa, storagePath)
        console.log(`  ↑ ${storagePath}`)
      }
      if (media.video) {
        const storagePath = `${agenda.share_token}/${String(ordem).padStart(2, '0')}/video${getExt(media.video)}`
        itemPayload.video_url = await uploadFile(sb, media.video, storagePath)
        console.log(`  ↑ ${storagePath}`)
      }
    }
    // sem_midia: ainda assim cria item, sem mídia (cliente vê apenas legenda)

    itemsToUpsert.push(itemPayload)
  }

  // 8. Upsert items
  await upsertItems(sb, agenda.id, itemsToUpsert)
  console.log(`\n✓ ${itemsToUpsert.length} items upserted`)

  // 9. Notifica Telegram (a menos que --no-telegram)
  const appUrl = flags.appUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000'
  const publicUrl = `${appUrl.replace(/\/$/, '')}/a/${agenda.share_token}`
  console.log(`\n🔗 URL pública: ${publicUrl}`)

  if (!flags.noTelegram) {
    try {
      await sendTelegramAgendaPublished({
        clientName: client.name,
        period: flags.mes,
        title: titulo,
        publicUrl,
      })
      console.log(`✓ Notificação Telegram enviada`)
    } catch (err) {
      console.warn(`⚠ Falha ao notificar Telegram: ${err.message}`)
    }
  }

  console.log('\n✅ Publicação concluída.')
}

// ─── Upsert helpers (espelham shared/agenda-editorial em .mjs) ─────────────

async function upsertAgenda(sb, { client_id, period, title }) {
  // Tenta achar existente
  const { data: existing, error: selErr } = await sb
    .from('editorial_agendas')
    .select('*')
    .eq('client_id', client_id)
    .eq('period', period)
    .maybeSingle()
  if (selErr) throw new Error(`upsertAgenda(select): ${selErr.message}`)

  if (existing) {
    const { data, error } = await sb
      .from('editorial_agendas')
      .update({ title })
      .eq('id', existing.id)
      .select('*')
      .single()
    if (error || !data) throw new Error(`upsertAgenda(update): ${error?.message}`)
    return data
  }

  const { data, error } = await sb
    .from('editorial_agendas')
    .insert({ client_id, period, title })
    .select('*')
    .single()
  if (error || !data) throw new Error(`upsertAgenda(insert): ${error?.message}`)
  return data
}

async function upsertItems(sb, agendaId, items) {
  const { data: existing, error: selErr } = await sb
    .from('editorial_items')
    .select('id, ordem')
    .eq('agenda_id', agendaId)
  if (selErr) throw new Error(`upsertItems(select): ${selErr.message}`)

  const byOrdem = new Map((existing ?? []).map((i) => [i.ordem, i.id]))

  for (const it of items) {
    const patch = {
      tipo: it.tipo,
      publish_date: it.publish_date,
      tema: it.tema,
      pilar: it.pilar,
      legenda: it.legenda,
      texto_imagem: it.texto_imagem,
      prompt: it.prompt,
      images: it.images,
      video_url: it.video_url,
      capa_url: it.capa_url,
      roteiro: it.roteiro,
    }
    const existingId = byOrdem.get(it.ordem)
    if (existingId) {
      const { error } = await sb.from('editorial_items').update(patch).eq('id', existingId)
      if (error) throw new Error(`upsertItems(update ordem=${it.ordem}): ${error.message}`)
    } else {
      const { error } = await sb
        .from('editorial_items')
        .insert({ agenda_id: agendaId, ordem: it.ordem, ...patch })
      if (error) throw new Error(`upsertItems(insert ordem=${it.ordem}): ${error.message}`)
    }
  }
}

// ─── Telegram (mínimo — espelha shared/telegram em .mjs) ───────────────────

async function sendTelegramAgendaPublished({ clientName, period, title, publicUrl }) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) throw new Error('TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID ausente')

  const [ano, mm] = period.split('-')
  const periodLabel = `${MES_PT[mm]?.abr ?? mm}/${ano}`

  const clientMsg =
    `Oi! A agenda de ${periodLabel} está pronta 💚\n\n` +
    `Confere aqui: ${publicUrl}\n\n` +
    `Você pode escrever observações em cada post — eu recebo na hora assim que você salvar. ` +
    `Quando terminar de revisar tudo, me avisa que eu ajusto e te aviso quando estiver pronto.`

  const text =
    `✅ *Agenda publicada* — ${escapeMd(clientName)}\n` +
    `📅 ${escapeMd(periodLabel)}  ·  📝 ${escapeMd(title)}\n\n` +
    `🔗 ${escapeMd(publicUrl)}\n\n` +
    `*Mensagem pronta pra cliente:*\n` +
    '```\n' +
    clientMsg +
    '\n```'

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: Number(chatId),
      text,
      parse_mode: 'MarkdownV2',
    }),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Telegram HTTP ${res.status}: ${detail}`)
  }
}

function escapeMd(text) {
  return String(text ?? '').replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1')
}

// ─── Utilities ──────────────────────────────────────────────────────────────

async function ensureFile(path, label) {
  try {
    const s = await stat(path)
    if (!s.isFile()) throw new Error()
  } catch {
    throw new Error(`${label} não encontrado: ${path}`)
  }
}

async function ensureDir(path, label) {
  try {
    const s = await stat(path)
    if (!s.isDirectory()) throw new Error()
  } catch {
    throw new Error(`${label} não encontrada: ${path}`)
  }
}

function getExt(p) {
  const m = /\.[^.]+$/.exec(p)
  return m ? m[0] : ''
}

function describeMedia(media) {
  if (media.kind === 'post') return `1 imagem (${basename(media.files[0])})`
  if (media.kind === 'carrossel') return `${media.files.length} slides`
  if (media.kind === 'reel') {
    const parts = []
    if (media.capa) parts.push(`capa(${basename(media.capa)})`)
    if (media.video) parts.push(`video(${basename(media.video)})`)
    return parts.length ? parts.join(' + ') : '(sem mídia ainda)'
  }
  return '(sem mídia)'
}

main().catch((err) => {
  console.error('\n💥', err.message)
  if (process.env.DEBUG) console.error(err.stack)
  process.exit(1)
})
