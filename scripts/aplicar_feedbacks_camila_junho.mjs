// =====================================================
// CAMILA ESTÉTICA — APLICAR FEEDBACKS JUNHO 2026
// =====================================================
// Feedback da própria Camila (2026-05-29). Ações aqui:
//
//  TEXTO (regen via Gemini) — slides afetados:
//   01 slide 4 — remover "PEIM" da lista
//   03 slide 1 — novo título "5 protocolos que o inverno pede"
//   05 slide 1 — remover "PEIM" do título capa
//   10 slide 3 — "construir uma pele linda, não só resolver um incômodo pontual"
//   10 slide 4 — "com um pós-procedimento mais confortável" (sem "hipercromia")
//   10 slide 5 — sem "R$197" (vira "Investimento creditado integralmente")
//   13 slide 1 — capa sem "(R$197, creditados integralmente)"
//   13 slide 7 — CTA sem "R$197"
//   17 slide 4 — plural "Existem muitas mulheres que sabiam o que queriam…"
//
//  COMPOSITE SHARP (foto da Camila) — slide:
//   17 slide 6 — foto da Camila preservada + texto sobreposto
//
//  ARQUIVOS REMOVIDOS:
//   02 frame_01.png — i2i da Dra. ficou ruim
//   05 slide 05.png — PEIM não pode ser feito no rosto (remover da campanha)
//   10 slide 06.png — preço INTENSE/PREMIUM (conselho de enfermagem proíbe)
//   11 frame_03.png — i2i da Dra. ficou ruim
//
//  RENOMES (após remoção):
//   05: 06.png → 05.png, 07.png → 06.png  (vira 6 slides)
//   10: 07.png → 06.png  (vira 6 slides)
//
//  LEGENDA.TXT atualizada nos posts:
//   09, 11, 13 (tirar R$197 da legenda)
//   05 (tirar #peim)
//
// Execução:
//   node scripts/aplicar_feedbacks_camila_junho.mjs
// =====================================================

import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  console.error("ERRO: GOOGLE_AI_API_KEY não encontrada em .env");
  process.exit(1);
}

const MODEL = "gemini-3-pro-image-preview";

// Fase 2 da migração Drive → Supabase (2026-05-30): só grava local agora.
const LOCAL_AGENDA_DIR = path.join(
  import.meta.dirname,
  "..",
  "clientes",
  "camila-estetica",
  "agendas",
  "2026-06"
);
const FOTOS_DIR = "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\fotos_avatar";

// =====================================================
// TRECHOS REUTILIZÁVEIS (idênticos ao gerar_camila_junho.mjs)
// =====================================================

const DNA_BASE = `white dominant premium aesthetic, elegant translucent glassmorphism layers, soft whispered pink accents, refined editorial sophistication, breathing negative space, delicate airy shadows, premium magazine quality, frosted glass overlays, gentle rose blush touches, polished feminine luxury, silk-soft contrast, controlled vibrancy quiet elegance, soft diffused natural lighting`;

const NEG = `oversaturated, harsh contrast, neon colors, aggressive pop, saturated pink dominant, heavy pink background, opaque pink walls, hot pink, magenta, fuchsia, cluttered, busy, chaotic, muddy colors, washed out badly, dull, flat boring, low quality, blurry photo, soft focus errors, poor quality, pixelated, noisy, grainy, illegible text, poor typography, unreadable font, garbled text, missing accents, broken letters, doubled letters, hyphen-split words, repeated lines of text, duplicated phrases, cheap looking, amateur, unprofessional, messy composition, unbalanced, distracting elements, watermark, signature, logo overlay, dark moody background, gothic, dramatic shadows, cold blue tones, reclining woman, woman lying down, sensual pose, suggestive pose, intimate setting, bedroom setting, exposed body, open robe, different person, different woman, unknown woman`;

const TYPO_RULES = `Typography must be PERFECTLY legible with all Portuguese accents intact (á, ã, ç, é, ê, í, ó, ô, õ, ú). Crisp clean letter shapes. NO broken letters, NO doubled letters, NO hyphen-split words. EXACT spelling required. CRITICAL: NEVER repeat any line of text — each line appears EXACTLY ONCE, no duplicated lines, no duplicated phrases, no accidental repetition between adjacent lines.`;

const NUMERACAO_RULE = `IMPORTANT: The slide number indicator (e.g. "01/07") must appear ONLY ONCE in the entire image, placed in the top-right corner OUTSIDE any translucent panel.`;

const VAR_A = `pure white #FFFFFF dominant background airy editorial luxury, translucent frosted glass panel overlay holding text glassmorphism effect subtle blur, photograph framed with rounded corners thick white border premium magazine style, elegant serif Playfair Display combined with bold sans-serif headline soft black #1A1A1A, whispered pink #FCE4EC details barely visible, soft diffused natural lighting, refined sophisticated atmosphere, generous negative space, premium editorial feminine, aspect ratio 4:5`;

const VAR_B = `soft whispered pink #FCE4EC veil background gentle wash desaturated, almost-white pink barely tinted, photograph framed with rounded white border centered, white or soft black typography elegant mix serif Playfair Display and bold sans-serif, generous breathing space, delicate feminine premium atmosphere, soft diffused lighting, editorial magazine quality, refined gentle sophistication, no saturation pop, aspect ratio 4:5`;

// =====================================================
// REGENERAÇÕES VIA GEMINI (slides com texto novo)
// Cada item: { post, slideNum (1-based), tema, seed, prompt }
// =====================================================

const regens = [
  // Post 01 (01/06) carrossel "A janela do inverno" — slide 4 (sem PEIM)
  {
    post: "01",
    data: "2026-06-01",
    tipo: "carrossel",
    tema: "janela-inverno",
    slideNum: 4,
    seed: 60104,
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "PRINCÍPIO 03" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Peelings, microagulhamento" / "e jato de plasma rendem mais agora." Thin gold accent line. "04/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
  },

  // Post 03 (05/06) carrossel "5 protocolos…" — slide 1 (novo título)
  {
    post: "03",
    data: "2026-06-05",
    tipo: "carrossel",
    tema: "5-protocolos-inverno",
    slideNum: 1,
    seed: 60501,
    prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel cover for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background (almost white with a kiss of pink). Centered an editorial photograph framed with rounded white border thick: a woman receiving a calm aesthetic treatment in soft natural side-light, eyes closed, real skin texture, side profile, slightly desaturated. Above the photo, in serif Playfair Display soft black #1A1A1A italic centered, EXACT text in two lines: "5 protocolos" / "que o inverno pede." A thin gold #D4AF37 accent line below the headline. Tiny "01/07" gold label top-right outside. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}, no plastic skin, no aggressive pink, no medical look.`,
  },

  // Post 05 (08/06) carrossel "Limpeza/peeling/microag" — slide 1 (sem PEIM)
  {
    post: "05",
    data: "2026-06-08",
    tipo: "carrossel",
    tema: "limpeza-peeling-microag-peim",
    slideNum: 1,
    seed: 60801,
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel cover for Camila Estética. Full bleed warm off-white #FBF7F4 background with subtle linen texture. Centered translucent frosted glass panel (glassmorphism). EXACT text in serif Playfair Display italic soft black #1A1A1A large centered, three lines: "Você sabe a diferença" / "entre limpeza, peeling" / "e microagulhamento?" Thin gold #D4AF37 accent line below the headline. Tiny "01/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
  },

  // Post 10 (17/06) — slide 3 (pele linda)
  {
    post: "10",
    data: "2026-06-17",
    tipo: "carrossel",
    tema: "skin-winter-7-perguntas",
    slideNum: 3,
    seed: 61703,
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text on panel: small uppercase gold #A68A4F letter-spaced "PERGUNTA 02" at top; below serif Playfair Display italic soft black #1A1A1A centered large: "Para quem é?"; below in smaller sans-serif Inter Regular soft black centered, two lines: "Para mulheres que querem construir uma pele linda," / "não só resolver um incômodo pontual." Thin gold accent line. "03/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
  },

  // Post 10 (17/06) — slide 4 (pós-procedimento confortável, sem hipercromia)
  {
    post: "10",
    data: "2026-06-17",
    tipo: "carrossel",
    tema: "skin-winter-7-perguntas",
    slideNum: 4,
    seed: 61704,
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "PERGUNTA 03" at top; below serif Playfair Display italic soft black #1A1A1A centered large: "Por que é no inverno?"; below in smaller sans-serif Inter Regular soft black centered, two lines: "A baixa fotossensibilidade permite estímulo, peeling," / "microagulhamento e protocolos com pós mais confortável." Thin gold accent line. "04/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
  },

  // Post 10 (17/06) — slide 5 (sem R$197)
  {
    post: "10",
    data: "2026-06-17",
    tipo: "carrossel",
    tema: "skin-winter-7-perguntas",
    slideNum: 5,
    seed: 61705,
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "PERGUNTA 04" at top; below serif Playfair Display italic soft black #1A1A1A centered large: "Como começa?"; below in smaller sans-serif Inter Regular soft black centered, three short lines: "Pela avaliação Skin Winter." / "45 minutos com plano de pele por escrito." / "Investimento creditado integralmente no fechamento." Thin gold accent line. "05/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
  },

  // Post 13 (22/06) — slide 1 capa (sem R$197)
  {
    post: "13",
    data: "2026-06-22",
    tipo: "carrossel",
    tema: "o-que-sai-sabendo-avaliacao",
    slideNum: 1,
    seed: 62201,
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel cover for Camila Estética. Full bleed warm off-white #FBF7F4 background. Behind the panel a soft editorial still-life: a leather-bound notebook open on cream marble with a printed checklist beside it (no readable text, just suggestion of structure), a small crystal bottle in the corner, soft natural window light from the left, medium-format depth of field, Kodak Portra 400 grain. Centered translucent frosted glass panel. EXACT text in serif Playfair Display soft black #1A1A1A italic centered, two lines: line 1 large: "O que você sai sabendo"; line 2 smaller: "da avaliação Skin Winter." Thin gold #A68A4F accent line below. Tiny "01/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
  },

  // Post 13 (22/06) — slide 7 CTA (sem R$197)
  {
    post: "13",
    data: "2026-06-22",
    tipo: "carrossel",
    tema: "o-que-sai-sabendo-avaliacao",
    slideNum: 7,
    seed: 62207,
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel final CTA slide for Camila Estética. Full bleed pure white #FFFFFF background, very airy. Centered glassmorphism panel. EXACT text in serif Playfair Display soft black #1A1A1A italic centered medium: "45 minutos. Plano por escrito."; below in smaller sans-serif Inter Regular soft black centered: "Você sai sabendo." Below that a clean rectangular CTA badge with thin gold #A68A4F border (3px) rounded corners, inside single uppercase bold word "AVALIAÇÃO" in gold sans-serif letter-spaced. Tiny "— CAMILA ESTÉTICA" gold signature at bottom. "07/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
  },

  // Post 17 (30/06) — slide 4 (plural)
  {
    post: "17",
    data: "2026-06-30",
    tipo: "carrossel",
    tema: "junho-fecha",
    slideNum: 4,
    seed: 63004,
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "APRENDIZADO" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Existem muitas mulheres que sabiam o que queriam," / "só não tinham um nome. Skin Winter virou esse nome." Thin gold accent line. "04/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
  },
];

// =====================================================
// ARQUIVOS A DELETAR (Drive + Local)
// =====================================================

const deletes = [
  { post: "02", tema: "ciencia-por-tras", tipo: "reel", data: "2026-06-03", arquivo: "frame_01.png", motivo: "i2i Dra. regenerou face (não parece a Camila)" },
  { post: "05", tema: "limpeza-peeling-microag-peim", tipo: "carrossel", data: "2026-06-08", arquivo: "05.png", motivo: "slide PEIM — PEIM não pode ser feito no rosto" },
  { post: "10", tema: "skin-winter-7-perguntas", tipo: "carrossel", data: "2026-06-17", arquivo: "06.png", motivo: "slide preço — conselho de enfermagem proíbe valor em rede social" },
  { post: "11", tema: "nao-desconto-desenho", tipo: "reel", data: "2026-06-19", arquivo: "frame_03.png", motivo: "i2i Dra. regenerou face (não parece a Camila)" },
];

// =====================================================
// RENOMES (Drive + Local) — após deletar acima
// =====================================================

const renames = [
  // Post 05: 06→05, 07→06 (vira 6 slides)
  { post: "05", tema: "limpeza-peeling-microag-peim", tipo: "carrossel", data: "2026-06-08", de: "06.png", para: "05.png" },
  { post: "05", tema: "limpeza-peeling-microag-peim", tipo: "carrossel", data: "2026-06-08", de: "07.png", para: "06.png" },
  // Post 10: 07→06 (vira 6 slides)
  { post: "10", tema: "skin-winter-7-perguntas", tipo: "carrossel", data: "2026-06-17", de: "07.png", para: "06.png" },
];

// =====================================================
// LEGENDAS atualizadas (Drive + Local)
// =====================================================

const legendas = [
  {
    post: "05",
    data: "2026-06-08",
    tipo: "carrossel",
    tema: "limpeza-peeling-microag-peim",
    conteudo: `Existe muita confusão entre os tratamentos. Cada um tem indicação técnica específica.

O que diferencia uma clínica é saber qual aplicar, em qual ordem, em qual pele. Não é menu. É desenho.

Em breve, abrimos uma temporada inteira de protocolos desenhados.

Comenta "inverno".

#esteticafacial #peeling #microagulhamento #drcamila #esteticabauru
`,
  },
  {
    post: "09",
    data: "2026-06-15",
    tipo: "post",
    tema: "skin-winter-2026-revelacao",
    conteudo: `Camila Estética abre, pela primeira vez, sua temporada oficial de gerenciamento de pele.

Por 8 semanas, sua pele entra em um ritual desenhado pela Dra. Camila e sai pronta para o verão.

6 sessões. Protocolo individual. Avaliação técnica. Plano de pele por escrito. Acompanhamento.

A avaliação é integralmente creditada se você decidir entrar no programa.

Quem comentou "inverno" em maio já recebeu o convite no direct. Quem ainda não, agora pode comentar abaixo. Abrimos as avaliações esta semana.

O inverno trata. O verão revela.

#skinwinter #skinwinter2026 #gerenciamentodepele #drcamila #esteticabauru #esteticafacial
`,
  },
  {
    post: "11",
    data: "2026-06-19",
    tipo: "reel",
    tema: "nao-desconto-desenho",
    conteudo: `Algumas perguntas vão aparecer essa semana.

A primeira: por que não tem desconto?

Porque o programa é desenhado. Não é pacote padrão que cabe desconto. É arquitetura que entrega exatamente o que sua pele precisa.

Avaliações abertas. Investimento creditado integralmente se você entrar no programa.

Comenta "avaliação".

#skinwinter #drcamila #esteticabauru #gerenciamentodepele
`,
  },
  {
    post: "13",
    data: "2026-06-22",
    tipo: "carrossel",
    tema: "o-que-sai-sabendo-avaliacao",
    conteudo: `Não é uma "consulta gratuita para empurrar venda". É uma sessão técnica de 45 minutos onde você sai com diagnóstico claro, protocolo desenhado e plano por escrito.

Mesmo se não fechar o programa, você sai com algo concreto: o caminho da sua pele.

Investimento creditado integralmente se você decidir entrar.

Comenta "avaliação".

#skinwinter #avaliacaoestetica #drcamila #esteticabauru #planodepele
`,
  },
];

// =====================================================
// HELPERS
// =====================================================

function subpasta(post) {
  return `${post.post}_${post.data}_${post.tipo}_${post.tema}`;
}

function caminhoLocal(post) {
  return path.join(LOCAL_AGENDA_DIR, "entregaveis", subpasta(post));
}

function nomeArquivoSlide(num) {
  return `${String(num).padStart(2, "0")}.png`;
}

async function tentarRemover(filePath) {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") return false;
    throw err;
  }
}

async function tentarRenomear(de, para) {
  try {
    await fs.rename(de, para);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") return false;
    throw err;
  }
}

// =====================================================
// GERAÇÃO DE IMAGEM via Gemini 3 Pro Image
// =====================================================

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function gerarImagemGemini({ prompt, seed, aspectRatio = "4:5" }) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseModalities: ["IMAGE"],
      seed,
      imageConfig: { aspectRatio },
    },
  });

  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  for (const p of parts) {
    const inlineData = p.inlineData ?? p.inline_data;
    if (inlineData?.data) {
      return Buffer.from(inlineData.data, "base64");
    }
  }
  throw new Error("Gemini não retornou imagem");
}

// =====================================================
// COMPOSITE SHARP para post 17 slide 6 (foto Camila + texto)
// =====================================================

const W = 1080;
const H = 1350;

function svgPainelTexto(texto) {
  // Painel no canto superior-esquerdo, NÃO cobre o rosto
  // (mesma técnica do post 09 que ficou aprovado)
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="ds" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="10"/>
      <feOffset dx="0" dy="6"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.25"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Painel translúcido -->
  <rect x="56" y="60" width="600" height="380" rx="20" ry="20"
        fill="rgba(255,250,243,0.88)"
        stroke="rgba(255,255,255,0.6)" stroke-width="1"
        filter="url(#ds)"/>

  <!-- Label "ESTE MÊS" -->
  <text x="96" y="115"
        font-family="Arial, Helvetica, sans-serif"
        font-size="14"
        font-weight="700"
        letter-spacing="4"
        fill="#A68A4F">ESTE MÊS</text>

  <!-- Linha gold -->
  <line x1="96" y1="135" x2="220" y2="135"
        stroke="#A68A4F" stroke-width="2"/>

  <!-- Texto principal em italic serif -->
  <text x="96" y="200"
        font-family="Playfair Display, Georgia, 'Times New Roman', serif"
        font-size="32"
        font-style="italic"
        fill="#1A1A1A">${texto.linha1}</text>
  <text x="96" y="250"
        font-family="Playfair Display, Georgia, 'Times New Roman', serif"
        font-size="32"
        font-style="italic"
        fill="#1A1A1A">${texto.linha2}</text>
  <text x="96" y="300"
        font-family="Playfair Display, Georgia, 'Times New Roman', serif"
        font-size="32"
        font-style="italic"
        fill="#1A1A1A">${texto.linha3}</text>
  <text x="96" y="350"
        font-family="Playfair Display, Georgia, 'Times New Roman', serif"
        font-size="32"
        font-style="italic"
        fill="#1A1A1A">${texto.linha4}</text>

  <!-- Selo paginação canto superior direito -->
  <text x="${W - 60}" y="100"
        font-family="Arial, Helvetica, sans-serif"
        font-size="14"
        font-weight="700"
        letter-spacing="3"
        text-anchor="end"
        fill="#A68A4F">06/07</text>

  <!-- Assinatura canto inferior direito -->
  <text x="${W - 60}" y="${H - 50}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="20"
        font-weight="600"
        letter-spacing="3"
        text-anchor="end"
        fill="#A68A4F">— CAMILA ESTÉTICA</text>
</svg>`;
}

async function compor17slide6() {
  console.log("\n→ Compose post 17 slide 6 (foto Camila preservada)…");
  const fotoOriginal = path.join(FOTOS_DIR, "IMG_3677.jpg");

  // Carrega + crop 4:5 mantendo rosto
  const fotoBuf = await sharp(fotoOriginal)
    .resize({ width: W, height: H, fit: "cover", position: "top" })
    .toBuffer();

  const texto = {
    linha1: "Se você ainda não",
    linha2: "fez sua avaliação,",
    linha3: "esta é a janela.",
    linha4: "Julho ficará escasso.",
  };
  const svg = svgPainelTexto(texto);
  const finalBuf = await sharp(fotoBuf)
    .composite([{ input: Buffer.from(svg, "utf-8"), top: 0, left: 0 }])
    .png({ quality: 95, compressionLevel: 8 })
    .toBuffer();

  const fakePostObj = {
    post: "17",
    data: "2026-06-30",
    tipo: "carrossel",
    tema: "junho-fecha",
  };
  const local = path.join(caminhoLocal(fakePostObj), "06.png");
  await fs.mkdir(path.dirname(local), { recursive: true });
  await fs.writeFile(local, finalBuf);
  console.log(`  ✓ ${local} (${(finalBuf.length / 1024).toFixed(0)} KB)`);
}

// =====================================================
// PIPELINE PRINCIPAL
// =====================================================

async function main() {
  console.log("=== Camila Estética · APLICAR FEEDBACKS JUNHO 2026 ===\n");

  // ---------- 1. REGENERAÇÕES via Gemini ----------
  console.log(`→ Regen via Gemini: ${regens.length} slides`);
  for (const item of regens) {
    console.log(`  ${item.post}-s${item.slideNum} (${item.tema})…`);
    try {
      const buf = await gerarImagemGemini({
        prompt: item.prompt,
        seed: item.seed,
        aspectRatio: "4:5",
      });
      const arq = nomeArquivoSlide(item.slideNum);
      const local = path.join(caminhoLocal(item), arq);
      await fs.mkdir(path.dirname(local), { recursive: true });
      await fs.writeFile(local, buf);
      console.log(`     ✓ ${arq} (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.error(`     ❌ FALHA: ${err.message}`);
    }
  }

  // ---------- 2. COMPOSITE Sharp para 17-s6 ----------
  await compor17slide6();

  // ---------- 3. DELETES ----------
  console.log(`\n→ Deletes: ${deletes.length} arquivos`);
  for (const item of deletes) {
    const local = path.join(caminhoLocal(item), item.arquivo);
    const okL = await tentarRemover(local);
    console.log(`  ${item.post}/${item.arquivo} [${okL ? "✓" : "—"}] ${item.motivo}`);
  }

  // ---------- 4. RENAMES ----------
  console.log(`\n→ Renames: ${renames.length} arquivos`);
  for (const item of renames) {
    const deLocal = path.join(caminhoLocal(item), item.de);
    const paraLocal = path.join(caminhoLocal(item), item.para);
    const okL = await tentarRenomear(deLocal, paraLocal);
    console.log(`  ${item.post}: ${item.de} → ${item.para} [${okL ? "✓" : "—"}]`);
  }

  // ---------- 5. LEGENDAS ----------
  console.log(`\n→ Legendas atualizadas: ${legendas.length} posts`);
  for (const item of legendas) {
    const local = path.join(caminhoLocal(item), "legenda.txt");
    await fs.mkdir(path.dirname(local), { recursive: true });
    await fs.writeFile(local, item.conteudo, "utf-8");
    console.log(`  ✓ ${item.post} (${item.tema})`);
  }

  console.log("\n=== Feedbacks aplicados ===");
  console.log("Próximo passo: rodar gerar_html_copys_camila.mjs para atualizar HTML+PDF\n");
}

main().catch((err) => {
  console.error("❌ ERRO:", err);
  process.exit(1);
});
