// =====================================================
// HELPER: AGENDA-CSV (padrão v3)
// =====================================================
// Gera o arquivo `agenda-publicacao-<cliente>-<mes>-<ano>.csv` no raiz da
// pasta do mês (no repo local). Esse CSV continua sendo a fonte canônica
// para a ferramenta de auto-postagem (1 linha por post). Schema completo
// está documentado em `clientes/_template/PADRAO-AGENDA-EDITORIAL.md`.
//
// Desde 2026-05-30 (migração Drive→Supabase), o param `driveDir` está
// DEPRECATED. Continua sendo aceito por compat, mas novos scripts não
// devem mais passá-lo — entregáveis sobem pro Supabase via `publicar_agenda_web.mjs`.
//
// API:
//   import { gerarAgendaCsv } from "./lib/agenda_csv.mjs";
//   await gerarAgendaCsv({
//     cliente, mes, ano, outputDir,
//     posts: [...],
//   });
//
// Cada post no array `posts` precisa ter pelo menos:
//   { post_id, data_publicacao, dia_semana, tipo, pilar, tema,
//     legenda, hashtags, imagem_path }
// Campos opcionais com defaults:
//   hora_publicacao, linha_produto, ordem_carrossel, video_path,
//   status (default "a_publicar"), link_drive, observacoes
//
// Formato:
//   UTF-8 com BOM, separador ";", aspas duplas em campos com vírgula/aspas/quebra,
//   newline CRLF (Excel/Google Sheets-friendly).
// =====================================================

import { promises as fs } from "node:fs";
import path from "node:path";

const COLUNAS = [
  "post_id",
  "cliente",
  "data_publicacao",
  "hora_publicacao",
  "dia_semana",
  "tipo",
  "pilar",
  "linha_produto",
  "tema",
  "legenda",
  "primeira_linha",
  "hashtags",
  "imagem_path",
  "ordem_carrossel",
  "video_path",
  "status",
  "link_drive",
  "observacoes",
];

const BOM = "﻿";
const SEP = ";";
const EOL = "\r\n";

/**
 * Escapa um valor para CSV (UTF-8 BOM, separador ;, aspas duplas).
 * - Se contém aspas, vírgula, ponto-e-vírgula ou quebra, envolve em aspas duplas
 *   e duplica aspas internas.
 * - Preserva quebras de linha reais (a ferramenta-leitora deve respeitar RFC 4180).
 */
function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  const needsQuote = /[",;\r\n]/.test(str);
  if (!needsQuote) return str;
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Extrai a primeira linha não vazia de uma legenda (hook).
 */
function primeiraLinha(legenda) {
  if (!legenda) return "";
  const linhas = String(legenda).split(/\r?\n/);
  for (const linha of linhas) {
    const limpa = linha.trim();
    if (limpa) return limpa;
  }
  return "";
}

/**
 * Normaliza um post antes de virar linha do CSV.
 * Aplica defaults razoáveis e calcula `primeira_linha` automaticamente.
 */
function normalizarPost(post, cliente) {
  const out = {
    post_id: String(post.post_id ?? "").padStart(2, "0"),
    cliente: post.cliente ?? cliente,
    data_publicacao: post.data_publicacao ?? "",
    hora_publicacao: post.hora_publicacao ?? "",
    dia_semana: post.dia_semana ?? "",
    tipo: post.tipo ?? "post",
    pilar: post.pilar ?? "",
    linha_produto: post.linha_produto ?? "",
    tema: post.tema ?? "",
    legenda: post.legenda ?? "",
    primeira_linha: post.primeira_linha ?? primeiraLinha(post.legenda),
    hashtags: post.hashtags ?? "",
    imagem_path: post.imagem_path ?? "",
    ordem_carrossel: post.ordem_carrossel ?? "",
    video_path: post.video_path ?? "",
    status: post.status ?? "a_publicar",
    link_drive: post.link_drive ?? "",
    observacoes: post.observacoes ?? "",
  };
  return out;
}

/**
 * Gera o conteúdo CSV completo (cabeçalho + linhas).
 */
export function buildCsvContent({ cliente, posts }) {
  const linhas = [COLUNAS.join(SEP)];

  for (const post of posts) {
    const norm = normalizarPost(post, cliente);
    const linha = COLUNAS.map((col) => csvEscape(norm[col])).join(SEP);
    linhas.push(linha);
  }

  return BOM + linhas.join(EOL) + EOL;
}

/**
 * Escreve o CSV no repo local. `driveDir` é DEPRECATED desde 2026-05-30 (migração
 * Drive→Supabase) — ainda aceito por compat com scripts legados, mas novo código
 * não deve usar.
 *
 * @param {Object} opts
 * @param {string} opts.cliente — slug do cliente (delamore, camila-estetica, ...)
 * @param {string} opts.mes — `MM` (`06`)
 * @param {string} opts.ano — `AAAA` (`2026`)
 * @param {string} opts.outputDir — caminho absoluto da pasta do mês no repo
 * @param {string} [opts.driveDir] — DEPRECATED, não usar em código novo
 * @param {Array} opts.posts — lista de posts (ver header deste arquivo)
 * @returns {Promise<{ localPath: string, drivePath?: string, totalPosts: number }>}
 */
export async function gerarAgendaCsv({
  cliente,
  mes,
  ano,
  outputDir,
  driveDir,
  posts,
}) {
  if (!cliente) throw new Error("gerarAgendaCsv: 'cliente' é obrigatório");
  if (!mes || !ano) throw new Error("gerarAgendaCsv: 'mes' e 'ano' são obrigatórios");
  if (!outputDir) throw new Error("gerarAgendaCsv: 'outputDir' é obrigatório");
  if (!Array.isArray(posts) || posts.length === 0)
    throw new Error("gerarAgendaCsv: 'posts' precisa ser um array não vazio");

  const mesPad = String(mes).padStart(2, "0");
  const nomeMes = nomeMesPt(mesPad);
  const nomeArquivo = `agenda-publicacao-${cliente}-${nomeMes}-${ano}.csv`;

  const csvContent = buildCsvContent({ cliente, posts });

  await fs.mkdir(outputDir, { recursive: true });
  const localPath = path.join(outputDir, nomeArquivo);
  await fs.writeFile(localPath, csvContent, "utf-8");

  let drivePath;
  if (driveDir) {
    await fs.mkdir(driveDir, { recursive: true });
    drivePath = path.join(driveDir, nomeArquivo);
    await fs.writeFile(drivePath, csvContent, "utf-8");
  }

  return { localPath, drivePath, totalPosts: posts.length };
}

function nomeMesPt(mm) {
  const mapa = {
    "01": "janeiro",
    "02": "fevereiro",
    "03": "marco",
    "04": "abril",
    "05": "maio",
    "06": "junho",
    "07": "julho",
    "08": "agosto",
    "09": "setembro",
    "10": "outubro",
    "11": "novembro",
    "12": "dezembro",
  };
  return mapa[mm] ?? mm;
}

/**
 * Util para o caller: monta o caminho relativo padrão de uma subpasta de entregável v3.
 * Útil ao preencher o campo `imagem_path` do CSV.
 *
 * Exemplo:
 *   entregavelPath({ post_id: 1, data: "2026-06-01", tipo: "post", tema: "bastidores-fabrica" })
 *   → "entregaveis/01_2026-06-01_post_bastidores-fabrica"
 */
export function entregavelPath({ post_id, data, tipo, tema }) {
  const id = String(post_id).padStart(2, "0");
  return `entregaveis/${id}_${data}_${tipo}_${tema}`;
}

/**
 * Util para o caller: monta os paths de TODOS os slides de um carrossel,
 * juntando-os com "|" como esperado pelo CSV.
 */
export function carrosselPaths(subpastaRelativa, totalSlides) {
  const paths = [];
  for (let i = 1; i <= totalSlides; i++) {
    const num = String(i).padStart(2, "0");
    paths.push(`${subpastaRelativa}/${num}.png`);
  }
  return paths.join("|");
}

/**
 * Util para o caller: monta a string `ordem_carrossel` (`1|2|3|...`).
 */
export function carrosselOrdem(totalSlides) {
  return Array.from({ length: totalSlides }, (_, i) => i + 1).join("|");
}