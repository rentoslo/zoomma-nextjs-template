// =====================================================
// CAMILA ESTÉTICA — AGENDA EDITORIAL COMPLETA (MAIO + JUNHO + JULHO 2026)
//
// Documento de validação para a cliente. Cada post traz:
//   1. Cabeçalho (data, formato, tema)
//   2. Metadados (pilar, categoria, variação, persona)
//   3. Compliance / restrição (se houver)
//   4. ⭐ LEGENDA PRONTA PRA COPIAR (caption + hashtags consolidados)
//   5. Texto dos slides (carrosséis) — slide a slide
//   6. Roteiro do Reel (fala da Dra.)
//   7. Storyboard / cards / texto na tela
//   8. Briefing visual (mood, luz, lente, mood references)
//
// Output (Fase 1 da migração Drive → Supabase, 2026-05-30):
//   <repo>/clientes/camila-estetica/agendas/AGENDA-EDITORIAL-COMPLETA-mai-jun-jul.{html,pdf}
//
// O cliente passa a consumir pela página pública /a/<token> da ferramenta web.
// HTML/PDF locais ficam como backup/preview de revisão.
// =====================================================

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gerarPdfDoHtml } from "./lib/html_to_pdf.mjs";

const BASE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRIVE_CAMPANHA = String.raw`G:\Meu Drive\CLIENTES\CAMILA_ESTETICA\AGENDA EDITORIAL\2026-mai-jul_skin-winter`;

const CALENDARIOS = [
  {
    mes: "Maio 2026",
    fase: "FASE 0 — Teaser",
    submes: "20-31 de maio · plantar conceito, capturar lista “inverno”",
    md: path.join(DRIVE_CAMPANHA, "01_CALENDARIOS", "2026-05_maio_fase-0-teaser", "00-CALENDARIO-MAIO.md"),
    entregaveisDir: path.join(DRIVE_CAMPANHA, "01_CALENDARIOS", "2026-05_maio_fase-0-teaser", "entregaveis"),
  },
  {
    mes: "Junho 2026",
    fase: "FASES 1 e 2 — Aquecimento + Abertura",
    submes: "01-14 aquecimento · 15-30 abertura oficial do SKIN WINTER",
    md: path.join(DRIVE_CAMPANHA, "01_CALENDARIOS", "2026-06_junho_fase-1-2", "00-CALENDARIO-JUNHO.md"),
    entregaveisDir: path.join(DRIVE_CAMPANHA, "01_CALENDARIOS", "2026-06_junho_fase-1-2", "entregaveis"),
  },
  {
    mes: "Julho 2026",
    fase: "FASES 3 e 4 — Conversão + Fechamento",
    submes: "01-14 conversão (prova social + FAQ) · 15-31 fechamento + lista 2027",
    md: path.join(DRIVE_CAMPANHA, "01_CALENDARIOS", "2026-07_julho_fase-3-4", "00-CALENDARIO-JULHO.md"),
    entregaveisDir: path.join(DRIVE_CAMPANHA, "01_CALENDARIOS", "2026-07_julho_fase-3-4", "entregaveis"),
  },
];

const OUTPUT_REPO = path.join(BASE, "clientes", "camila-estetica", "agendas", "AGENDA-EDITORIAL-COMPLETA-mai-jun-jul.html");

// Identidade visual Camila (White Premium · acento champagne/gold)
const COR_PRIMARIA = "#A68A4F";
const COR_PRIMARIA_ESCURA = "#7A6235";
const COR_TEXTO = "#1A1A1A";
const COR_FUNDO_LEGENDA = "#FAF7F1";
const COR_FUNDO_VISUAL = "#F4F1EB";
const COR_FUNDO_ROTEIRO = "#F8F5EF";
const COR_FUNDO_SLIDES = "#FBF9F4";
const COR_BORDA = "#E8DFC9";
const COR_ALERTA_BG = "#FFF8E1";
const COR_ALERTA_BORDA = "#D4A437";

// =====================================================
// CONVERSOR MD → HTML (focado nas estruturas dos calendários Camila)
// =====================================================

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Aplica formatação inline (bold, italic) num texto JÁ escapado para HTML */
function inlineFmt(esc) {
  // bold **texto**
  esc = esc.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  // italic *texto* (não-greedy, evita capturar pares duplos)
  esc = esc.replace(/(?<![\*\w])\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");
  return esc;
}

/** Normaliza pontuação PT-BR (aspas curvas, em-dash, ellipsis) num texto bruto */
function normalizarPontuacao(texto) {
  return texto
    .replace(/"([^"\n]+)"/g, "“$1”")
    .replace(/---/g, "—")
    .replace(/(?<!-)--(?!-)/g, "—")
    .replace(/\.\.\./g, "…")
    .replace(/ +([,.;:!?])/g, "$1");
}

/**
 * Converte um bloco de markdown da agenda Camila em HTML.
 * Preserva listas, blockquotes e parágrafos. Sem inventar estrutura.
 */
function mdToHtml(md) {
  if (!md || !md.trim()) return "";
  md = normalizarPontuacao(md);

  const linhas = md.split("\n");
  const out = [];
  let i = 0;

  while (i < linhas.length) {
    const linha = linhas[i];

    // Linha em branco
    if (!linha.trim()) {
      i++;
      continue;
    }

    // Blockquote (uma ou mais linhas começando com >)
    if (linha.startsWith(">")) {
      const buf = [];
      while (i < linhas.length && linhas[i].startsWith(">")) {
        buf.push(linhas[i].replace(/^>\s?/, ""));
        i++;
      }
      const conteudo = buf.join("\n").trim();
      out.push(`<blockquote>${inlineFmt(escHtml(conteudo)).replace(/\n/g, "<br>")}</blockquote>`);
      continue;
    }

    // Lista (linhas começando com - ou *)
    if (/^[-*]\s+/.test(linha)) {
      const items = [];
      while (i < linhas.length && /^[-*]\s+/.test(linhas[i])) {
        items.push(linhas[i].replace(/^[-*]\s+/, "").trim());
        i++;
      }
      const lis = items.map((it) => `<li>${inlineFmt(escHtml(it))}</li>`).join("");
      out.push(`<ul>${lis}</ul>`);
      continue;
    }

    // Lista numerada (1. 2. 3.)
    if (/^\d+\.\s+/.test(linha)) {
      const items = [];
      while (i < linhas.length && /^\d+\.\s+/.test(linhas[i])) {
        items.push(linhas[i].replace(/^\d+\.\s+/, "").trim());
        i++;
      }
      const lis = items.map((it) => `<li>${inlineFmt(escHtml(it))}</li>`).join("");
      out.push(`<ol>${lis}</ol>`);
      continue;
    }

    // Parágrafo normal (ou label inline)
    out.push(`<p>${inlineFmt(escHtml(linha.trim()))}</p>`);
    i++;
  }

  return out.join("\n");
}

// =====================================================
// PARSER · separa cada post em seções nomeadas
// =====================================================

function parseCalendario(raw) {
  const blocos = raw.split(/\n(?=### \d{2}\/\d{2}\s*\()/);
  const posts = [];

  for (const bloco of blocos.slice(1)) {
    const tituloMatch = bloco.match(/^### (\d{2}\/\d{2}\s*\([^)]+\)\s*—\s*[^\n]+)/);
    if (!tituloMatch) continue;
    const tituloCompleto = tituloMatch[1].trim();

    const dataMatch = tituloCompleto.match(/^(\d{2}\/\d{2})\s*\(([^)]+)\)\s*—\s*(.+)/);
    const data = dataMatch?.[1] ?? "";
    const dia = dataMatch?.[2]?.trim() ?? "";
    const tituloLimpo = dataMatch?.[3]?.trim() ?? tituloCompleto;

    // Body = tudo após o título até o próximo "###" ou "---" final
    const bodyMatch = bloco.match(/^### [^\n]+\n([\s\S]*?)(?=\n## (?!#)|\n## $|$)/);
    const body = bodyMatch ? bodyMatch[1] : bloco.replace(/^### [^\n]+\n/, "");

    // Meta (linha que começa com **Pilar:**)
    const metaMatch = body.match(/\*\*Pilar:\*\*[^\n]+/);
    const metaLinha = metaMatch ? metaMatch[0].replace(/\*\*/g, "").trim() : "";

    // Compliance (linha de blockquote logo após meta, OU bloco "> **Compliance:**")
    const compliance = extrairCompliance(body);

    // Caption
    const captionRaw = extrairSecao(body, "Caption(?:\\s*\\([^)]+\\))?");
    const caption = captionRaw ? limparCaption(captionRaw) : "";

    // Hashtags
    const hashMatch = body.match(/\*\*Hashtags:\*\*\s*([^\n]+)/);
    const hashtags = hashMatch ? hashMatch[1].trim() : "";

    // Slides (todas as seções **Slide N (...)** ou **Slide N — ...:** ou **Slide N:**)
    const slides = extrairSlides(body);

    // Roteiro (Reels com fala da Dra.)
    const roteiroMatch = body.match(/\*\*Roteiro[^*\n]*:\*\*\s*([\s\S]*?)(?=\n\*\*[A-ZÁ-Ú]|\n---|\n## |$)/);
    const roteiro = roteiroMatch ? roteiroMatch[1].trim() : "";

    // Cards de Reel "3 mitos" (e similar): blocos **Card N — MITO:** + **REVELAÇÃO:**
    const cards = extrairCards(body);

    // Storyboard
    const storyboardMatch = body.match(/\*\*Storyboard[^*\n]*:\*\*\s*([\s\S]*?)(?=\n\*\*[A-ZÁ-Ú]|\n---|\n## |$)/);
    const storyboard = storyboardMatch ? storyboardMatch[1].trim() : "";

    // Texto na tela
    const textoTelaMatch = body.match(/\*\*Texto na tela[^*\n]*:\*\*\s*([\s\S]*?)(?=\n\*\*[A-ZÁ-Ú]|\n---|\n## |$)/);
    const textoTela = textoTelaMatch ? textoTelaMatch[1].trim() : "";

    // Texto na imagem (post âncora)
    const textoImagemMatch = body.match(/\*\*Texto na imagem[^*\n]*:\*\*\s*([\s\S]*?)(?=\n\*\*[A-ZÁ-Ú]|\n---|\n## |$)/);
    const textoImagem = textoImagemMatch ? textoImagemMatch[1].trim() : "";

    // Briefing visual / Imagem (single)
    let briefingVisual = extrairSecao(body, "Briefing visual");
    if (!briefingVisual) briefingVisual = extrairSecao(body, "Imagem\\s*\\([^)]+\\)");

    // Trilha (Reels)
    const trilhaMatch = body.match(/\*\*Trilha:\*\*\s*([^\n]+)/);
    const trilha = trilhaMatch ? trilhaMatch[1].trim() : "";

    // Inferência do formato
    const formato = inferirFormato(tituloLimpo);

    posts.push({
      data, dia, tituloLimpo, formato,
      metaLinha, compliance,
      slides, roteiro, cards, storyboard, textoTela, textoImagem,
      briefingVisual, trilha,
      caption, hashtags,
    });
  }

  return posts;
}

function extrairCompliance(body) {
  // Bloco "> **Compliance:** ..." de uma ou mais linhas começando com >
  const m = body.match(/\n>\s*\*\*Compliance:\*\*([\s\S]*?)(?=\n\n|\n\*\*[A-ZÁ-Ú])/);
  if (!m) return "";
  return m[1].split("\n").map((l) => l.replace(/^>\s?/, "")).join(" ").replace(/\s+/g, " ").trim();
}

function extrairSecao(body, secaoRegex) {
  const re = new RegExp(`\\*\\*${secaoRegex}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*[A-ZÁ-Úa-zá-ú0-9][^*\\n]{0,40}?:\\*\\*|\\n---|\\n## |$)`, "i");
  const m = body.match(re);
  return m ? m[1].trim() : "";
}

function extrairSlides(body) {
  // Captura todas as ocorrências de **Slide N (...):**, **Slide N — XYZ:** ou **Slide N:**
  const re = /\*\*Slide\s+(\d+)([^:*]*?):\*\*([\s\S]*?)(?=\n\*\*Slide\s+\d+[^:*]*?:\*\*|\n\*\*[A-ZÁ-Ú][^*\n]{0,40}?:\*\*|\n---|\n## |$)/g;
  const slides = [];
  let m;
  while ((m = re.exec(body))) {
    const numero = m[1];
    const sufixo = m[2].trim().replace(/^—\s*/, "").replace(/^\(|\)$/g, "").trim();
    const conteudo = m[3].trim();
    slides.push({ numero, sufixo, conteudo });
  }
  return slides;
}

function extrairCards(body) {
  // **Card N — MITO:** ... **REVELAÇÃO:** ...
  const re = /\*\*Card\s+(\d+)\s*—\s*MITO:\*\*([\s\S]*?)\*\*REVELAÇÃO:\*\*([\s\S]*?)(?=\n\*\*Card\s+\d+\s*—\s*MITO:\*\*|\n\*\*[A-ZÁ-Ú][^*\n]{0,40}?:\*\*|\n---|\n## |$)/g;
  const cards = [];
  let m;
  while ((m = re.exec(body))) {
    cards.push({
      numero: m[1],
      mito: m[2].trim(),
      revelacao: m[3].trim(),
    });
  }
  return cards;
}

function inferirFormato(titulo) {
  const t = titulo.toLowerCase();
  if (t.includes("post âncora") || t.includes("post ancora")) return "Post Âncora";
  if (t.includes("carrossel")) return "Carrossel";
  if (t.includes("reel dra")) return "Reel — Dra. Camila";
  if (t.includes("reel bastidor")) return "Reel — Bastidor";
  if (t.includes("reel faq")) return "Reel — FAQ";
  if (t.includes("reel silencioso")) return "Reel silencioso premium";
  if (t.includes("reel")) return "Reel";
  if (t.includes("cat 3")) return "Post Cat 3 (silêncio premium)";
  if (t.includes("post estático") || t.includes("post estatico")) return "Post estático";
  return "Post";
}

function limparCaption(raw) {
  let texto = raw
    .split("\n")
    .map((l) => l.replace(/^>\s?/, ""))
    .join("\n")
    .trim();
  texto = texto.replace(/\*\*([^*\n]+)\*\*/g, "$1");
  texto = texto.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "$1");
  texto = normalizarPontuacao(texto);
  texto = texto.replace(/\n{3,}/g, "\n\n");
  return texto.trim();
}

// =====================================================
// MÍDIA · resolve subpasta do post em entregaveis/ e embute em base64
// =====================================================

async function listarSubpastas(entregaveisDir) {
  try {
    const entries = await fs.readdir(entregaveisDir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
  } catch {
    return [];
  }
}

async function lerComoBase64(filePath) {
  try {
    const buf = await fs.readFile(filePath);
    return buf.toString("base64");
  } catch {
    return null;
  }
}

/**
 * Procura a subpasta NN_* dentro de entregaveis/ e devolve a mídia embutida.
 * Retorno: { tipo, imagens: [{ alt, base64 }] } ou null.
 *  - tipo "post":      [{ alt, base64 }] (1 imagem.png)
 *  - tipo "carrossel": [{ alt, base64 }] (N slides 01.png, 02.png, ...)
 *  - tipo "reel":      [{ alt, base64 }] (capa.png e/ou frame_NN.png)
 */
async function resolverMidiaPost(postIndex1based, subpastas, entregaveisDir) {
  if (!entregaveisDir || subpastas.length === 0) return null;
  const postNum = String(postIndex1based).padStart(2, "0");
  const subpastaNome = subpastas.find((s) => s.startsWith(`${postNum}_`));
  if (!subpastaNome) return null;

  const tipoMatch = subpastaNome.match(/^\d{2}_\d{4}-\d{2}-\d{2}_(post|carrossel|reel)_/);
  const tipo = tipoMatch ? tipoMatch[1] : "post";

  const subpastaDir = path.join(entregaveisDir, subpastaNome);
  const files = await fs.readdir(subpastaDir).catch(() => []);

  const imagens = [];

  if (tipo === "carrossel") {
    const slides = files.filter((f) => /^\d{2}\.png$/i.test(f)).sort();
    for (const slide of slides) {
      const b64 = await lerComoBase64(path.join(subpastaDir, slide));
      if (b64) imagens.push({ alt: `Slide ${slide.replace(".png", "")}`, base64: b64 });
    }
  } else if (tipo === "reel") {
    if (files.includes("capa.png")) {
      const b64 = await lerComoBase64(path.join(subpastaDir, "capa.png"));
      if (b64) imagens.push({ alt: "Capa do Reel", base64: b64 });
    }
    const frames = files.filter((f) => /^frame_\d{2}\.png$/i.test(f)).sort();
    for (const frame of frames) {
      const b64 = await lerComoBase64(path.join(subpastaDir, frame));
      if (b64) imagens.push({ alt: `Frame ${frame.replace("frame_", "").replace(".png", "")}`, base64: b64 });
    }
  } else {
    // tipo "post"
    if (files.includes("imagem.png")) {
      const b64 = await lerComoBase64(path.join(subpastaDir, "imagem.png"));
      if (b64) imagens.push({ alt: "Imagem do post", base64: b64 });
    }
  }

  return { tipo, imagens, subpastaNome };
}

/**
 * Renderiza o bloco de mídia em HTML (1 imagem, mini-carrossel ou placeholder).
 */
function renderMidia(midia) {
  if (!midia) {
    return `<div class="midia-placeholder">🎨 imagem ainda não gerada — entregáveis pendentes deste mês</div>`;
  }

  if (midia.imagens.length === 0) {
    if (midia.tipo === "reel") {
      return `<div class="midia-placeholder">🎬 Reel — frames de referência pendentes</div>`;
    }
    return `<div class="midia-placeholder">🎨 imagem ainda não gerada</div>`;
  }

  if (midia.imagens.length === 1) {
    const klass = midia.tipo === "reel" ? "midia-single midia-reel" : "midia-single";
    const badge = midia.tipo === "reel" ? `<div class="reel-badge">🎬 frame de referência</div>` : "";
    return `<div class="${klass}">
      <img src="data:image/png;base64,${midia.imagens[0].base64}" alt="${escHtml(midia.imagens[0].alt)}" loading="lazy">
      ${badge}
    </div>`;
  }

  // múltiplas imagens: mini-carrossel horizontal scroll
  const slides = midia.imagens
    .map(
      (img, i) => `
        <figure class="carrossel-slide ${midia.tipo === "reel" ? "carrossel-slide-reel" : ""}">
          <img src="data:image/png;base64,${img.base64}" alt="${escHtml(img.alt)}" loading="lazy">
          <figcaption>${i + 1} / ${midia.imagens.length}</figcaption>
        </figure>`
    )
    .join("");
  const tituloMidia =
    midia.tipo === "carrossel"
      ? `🖼️ Carrossel — ${midia.imagens.length} slides`
      : `🎬 Reel — ${midia.imagens.length} frames de referência`;
  return `<div class="midia-titulo">${tituloMidia}</div><div class="carrossel-wrap">${slides}</div>`;
}

// =====================================================
// RENDER · cada post como um card de validação completo
// =====================================================

function renderPost(post, midia) {
  const partes = [];

  // Header
  partes.push(`<div class="post-header">
    <div class="post-data-bloco">
      <span class="post-data">${escHtml(post.data)}</span>
      <span class="post-dia">${escHtml(post.dia)}</span>
    </div>
    <div class="post-titulo-bloco">
      <span class="post-formato">${escHtml(post.formato)}</span>
      <h3 class="post-titulo">${escHtml(post.tituloLimpo)}</h3>
    </div>
  </div>`);

  // Metadados
  if (post.metaLinha) {
    partes.push(`<div class="post-meta">${escHtml(post.metaLinha)}</div>`);
  }

  // Compliance
  if (post.compliance) {
    partes.push(`<div class="alerta-compliance"><strong>Compliance:</strong> ${escHtml(post.compliance)}</div>`);
  }

  // 🖼️ Mídia gerada (imagem/carrossel/frames do Reel)
  partes.push(renderMidia(midia));

  // ⭐ Legenda pronta pra copiar (DESTAQUE)
  const blocoCopiar = [post.caption, post.hashtags].filter(Boolean).join("\n\n");
  if (blocoCopiar) {
    partes.push(`
<div class="secao secao-legenda">
  <div class="secao-titulo">⭐ Legenda — pronta para copiar e colar</div>
  <div class="legenda-box">${escHtml(blocoCopiar)}</div>
</div>`);
  }

  // Texto da imagem (post âncora)
  if (post.textoImagem) {
    partes.push(`
<div class="secao">
  <div class="secao-titulo">Texto da imagem</div>
  <div class="imagem-texto-box">${mdToHtml(post.textoImagem)}</div>
</div>`);
  }

  // Slides (carrosséis)
  if (post.slides.length > 0) {
    const lis = post.slides
      .map((s) => {
        const sub = s.sufixo ? ` <span class="slide-sufixo">— ${escHtml(s.sufixo)}</span>` : "";
        return `<li><div class="slide-titulo">Slide ${escHtml(s.numero)}${sub}</div><div class="slide-conteudo">${mdToHtml(s.conteudo)}</div></li>`;
      })
      .join("");
    partes.push(`
<div class="secao">
  <div class="secao-titulo">Texto dos slides (${post.slides.length} slides)</div>
  <ol class="slides-list">${lis}</ol>
</div>`);
  }

  // Roteiro do Reel (fala da Dra.)
  if (post.roteiro) {
    partes.push(`
<div class="secao">
  <div class="secao-titulo">Roteiro do Reel — fala da Dra.</div>
  <div class="roteiro-box">${mdToHtml(post.roteiro)}</div>
</div>`);
  }

  // Cards (Reel "3 mitos")
  if (post.cards.length > 0) {
    const cardsHtml = post.cards
      .map(
        (c) => `
<div class="card-mito">
  <div class="card-numero">Card ${escHtml(c.numero)}</div>
  <div class="card-mito-linha"><span class="card-rotulo">Mito:</span> ${inlineFmt(escHtml(normalizarPontuacao(c.mito.replace(/^[*"]+|[*"]+$/g, ""))))}</div>
  <div class="card-revelacao-linha"><span class="card-rotulo">Revelação:</span> ${inlineFmt(escHtml(normalizarPontuacao(c.revelacao.replace(/^[*"]+|[*"]+$/g, ""))))}</div>
</div>`,
      )
      .join("");
    partes.push(`
<div class="secao">
  <div class="secao-titulo">Cards do Reel (mito + revelação)</div>
  ${cardsHtml}
</div>`);
  }

  // Storyboard
  if (post.storyboard) {
    partes.push(`
<div class="secao">
  <div class="secao-titulo">Storyboard</div>
  <div class="storyboard-box">${mdToHtml(post.storyboard)}</div>
</div>`);
  }

  // Texto na tela
  if (post.textoTela) {
    partes.push(`
<div class="secao">
  <div class="secao-titulo">Texto na tela</div>
  <div class="texto-tela-box">${mdToHtml(post.textoTela)}</div>
</div>`);
  }

  // Briefing visual
  if (post.briefingVisual) {
    partes.push(`
<div class="secao">
  <div class="secao-titulo">Briefing visual</div>
  <div class="visual-box">${mdToHtml(post.briefingVisual)}</div>
</div>`);
  }

  // Trilha
  if (post.trilha) {
    partes.push(`<div class="trilha"><strong>Trilha:</strong> ${escHtml(post.trilha)}</div>`);
  }

  return `<article class="post-card">${partes.join("\n")}</article>`;
}

function renderMes({ mes, fase, submes, posts, midias }) {
  return `
<section class="mes-secao">
  <header class="mes-header">
    <h2 class="mes-titulo">${escHtml(mes)}</h2>
    <div class="mes-fase">${escHtml(fase)}</div>
    <div class="mes-sub">${escHtml(submes)}</div>
    <div class="mes-total">${posts.length} posts no feed</div>
  </header>
  ${posts.map((p, i) => renderPost(p, midias[i])).join("\n")}
</section>`;
}

function montarHtml(mesesRender, totalPosts) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Camila Estética · Agenda Editorial SKIN WINTER 2026 (Maio · Junho · Julho)</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 14px;
      line-height: 1.7;
      color: ${COR_TEXTO};
      background: #ffffff;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 32px 60px;
    }
    h1 {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 32px;
      font-weight: 400;
      letter-spacing: -0.01em;
      margin: 0 0 4px 0;
    }
    .doc-sub {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: ${COR_PRIMARIA};
      margin-bottom: 4px;
    }
    .doc-cliente {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
      color: #888;
      margin-bottom: 28px;
    }
    .intro {
      background: ${COR_FUNDO_LEGENDA};
      border-left: 3px solid ${COR_PRIMARIA};
      padding: 16px 20px;
      margin-bottom: 40px;
      border-radius: 0 6px 6px 0;
      font-size: 13.5px;
      line-height: 1.7;
    }
    .intro strong { color: ${COR_PRIMARIA_ESCURA}; }
    .intro ul { margin: 8px 0 0 18px; padding: 0; }
    .intro li { margin: 4px 0; }
    .intro .legend { display: inline-block; background: ${COR_PRIMARIA}; color: white; padding: 0 6px; border-radius: 3px; font-size: 11px; }

    .mes-secao { margin-top: 48px; }
    .mes-header {
      border-bottom: 2px solid ${COR_PRIMARIA};
      padding-bottom: 12px;
      margin-bottom: 24px;
    }
    .mes-titulo {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 26px;
      font-weight: 400;
      margin: 0;
    }
    .mes-fase {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${COR_PRIMARIA};
      margin-top: 4px;
    }
    .mes-sub {
      font-family: Georgia, serif;
      font-size: 14px;
      color: #666;
      font-style: italic;
      margin-top: 4px;
    }
    .mes-total {
      font-family: Arial, sans-serif;
      font-size: 11px;
      color: #999;
      margin-top: 6px;
    }

    .post-card {
      background: #fff;
      border: 1px solid ${COR_BORDA};
      border-left: 4px solid ${COR_PRIMARIA};
      border-radius: 6px;
      padding: 22px 26px;
      margin-bottom: 28px;
      page-break-inside: avoid;
    }

    .post-header {
      display: flex;
      gap: 18px;
      align-items: flex-start;
      margin-bottom: 4px;
      padding-bottom: 10px;
      border-bottom: 1px dashed ${COR_BORDA};
    }
    .post-data-bloco {
      flex: 0 0 auto;
      text-align: center;
      min-width: 70px;
      padding-top: 2px;
    }
    .post-data {
      display: block;
      font-family: "Playfair Display", Georgia, serif;
      font-size: 22px;
      font-weight: bold;
      color: ${COR_PRIMARIA};
      line-height: 1;
    }
    .post-dia {
      display: block;
      font-family: Arial, sans-serif;
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #888;
      margin-top: 4px;
    }
    .post-titulo-bloco {
      flex: 1;
    }
    .post-formato {
      display: inline-block;
      background: ${COR_PRIMARIA};
      color: #fff;
      font-family: Arial, sans-serif;
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 3px;
      margin-bottom: 4px;
    }
    .post-titulo {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 17px;
      font-weight: 400;
      margin: 2px 0 0 0;
      color: ${COR_TEXTO};
      line-height: 1.35;
    }

    .post-meta {
      font-family: Arial, sans-serif;
      font-size: 11px;
      letter-spacing: 0.04em;
      color: #888;
      margin: 8px 0 14px 0;
      text-transform: uppercase;
    }

    .alerta-compliance {
      background: ${COR_ALERTA_BG};
      border: 1px solid ${COR_ALERTA_BORDA};
      border-radius: 4px;
      padding: 8px 14px;
      font-size: 12.5px;
      color: #6B4F0F;
      margin-bottom: 14px;
      font-family: Arial, sans-serif;
    }

    .secao { margin-top: 16px; }
    .secao-titulo {
      font-family: Arial, sans-serif;
      font-size: 10.5px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: ${COR_PRIMARIA_ESCURA};
      margin-bottom: 6px;
      font-weight: bold;
    }

    .secao-legenda .secao-titulo {
      color: ${COR_PRIMARIA};
      font-size: 11px;
    }
    .legenda-box {
      background: ${COR_FUNDO_LEGENDA};
      border: 1px solid ${COR_BORDA};
      border-radius: 5px;
      padding: 16px 20px;
      white-space: pre-wrap;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 14px;
      line-height: 1.75;
      color: ${COR_TEXTO};
    }

    .slides-list {
      list-style: none;
      padding: 0;
      margin: 0;
      background: ${COR_FUNDO_SLIDES};
      border: 1px solid ${COR_BORDA};
      border-radius: 5px;
      overflow: hidden;
    }
    .slides-list li {
      padding: 12px 16px;
      border-bottom: 1px solid ${COR_BORDA};
    }
    .slides-list li:last-child { border-bottom: none; }
    .slide-titulo {
      font-family: Arial, sans-serif;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${COR_PRIMARIA_ESCURA};
      margin-bottom: 4px;
    }
    .slide-sufixo {
      font-weight: normal;
      color: #888;
      text-transform: none;
      letter-spacing: 0;
      font-style: italic;
    }
    .slide-conteudo {
      font-family: Georgia, serif;
      font-size: 13.5px;
      line-height: 1.65;
      color: ${COR_TEXTO};
    }
    .slide-conteudo p { margin: 0 0 4px 0; }
    .slide-conteudo blockquote {
      margin: 4px 0;
      padding-left: 12px;
      border-left: 2px solid ${COR_PRIMARIA};
      font-style: italic;
      color: #444;
    }
    .slide-conteudo ul { margin: 4px 0 4px 20px; padding: 0; }
    .slide-conteudo li { margin: 2px 0; }

    .roteiro-box,
    .storyboard-box,
    .texto-tela-box,
    .imagem-texto-box {
      background: ${COR_FUNDO_ROTEIRO};
      border: 1px solid ${COR_BORDA};
      border-radius: 5px;
      padding: 14px 18px;
      font-family: Georgia, serif;
      font-size: 13.5px;
      line-height: 1.7;
      color: ${COR_TEXTO};
    }
    .roteiro-box blockquote,
    .storyboard-box blockquote,
    .texto-tela-box blockquote,
    .imagem-texto-box blockquote {
      margin: 4px 0;
      padding-left: 14px;
      border-left: 3px solid ${COR_PRIMARIA};
      font-style: italic;
      color: #333;
    }
    .roteiro-box p,
    .storyboard-box p,
    .texto-tela-box p,
    .imagem-texto-box p {
      margin: 4px 0;
    }
    .roteiro-box ol, .storyboard-box ol { margin: 4px 0 4px 22px; padding: 0; }
    .roteiro-box ul, .storyboard-box ul { margin: 4px 0 4px 22px; padding: 0; }

    .imagem-texto-box {
      background: #FCFAF5;
      font-family: "Playfair Display", Georgia, serif;
      font-size: 15px;
    }

    .visual-box {
      background: ${COR_FUNDO_VISUAL};
      border: 1px solid ${COR_BORDA};
      border-radius: 5px;
      padding: 12px 16px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12.5px;
      line-height: 1.65;
      color: #555;
    }
    .visual-box ul { margin: 0 0 0 18px; padding: 0; }
    .visual-box li { margin: 3px 0; }
    .visual-box p { margin: 2px 0; }
    .visual-box strong { color: ${COR_PRIMARIA_ESCURA}; }

    .card-mito {
      background: ${COR_FUNDO_ROTEIRO};
      border: 1px solid ${COR_BORDA};
      border-radius: 5px;
      padding: 12px 16px;
      margin-bottom: 8px;
    }
    .card-numero {
      font-family: Arial, sans-serif;
      font-size: 11px;
      font-weight: bold;
      color: ${COR_PRIMARIA};
      letter-spacing: 0.1em;
      margin-bottom: 6px;
    }
    .card-mito-linha,
    .card-revelacao-linha {
      font-family: Georgia, serif;
      font-size: 13.5px;
      line-height: 1.65;
      margin: 4px 0;
    }
    .card-rotulo {
      font-family: Arial, sans-serif;
      font-size: 10.5px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${COR_PRIMARIA_ESCURA};
      margin-right: 4px;
    }

    .trilha {
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: #777;
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px dashed ${COR_BORDA};
    }
    .trilha strong { color: ${COR_PRIMARIA_ESCURA}; }

    .rodape {
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 11px;
      color: #999;
      margin-top: 60px;
      padding-top: 24px;
      border-top: 1px solid ${COR_BORDA};
    }

    /* --- Mídia: imagem do post, carrossel, frames de Reel --- */
    .midia-titulo {
      font-family: Arial, sans-serif;
      font-size: 10.5px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: ${COR_PRIMARIA_ESCURA};
      margin: 14px 0 6px;
      font-weight: bold;
    }
    .midia-single {
      margin: 10px 0 16px;
      border-radius: 8px;
      overflow: hidden;
      background: #f4f4f4;
      position: relative;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      max-width: 480px;
    }
    .midia-single img {
      display: block;
      width: 100%;
      height: auto;
      background: #fff;
    }
    .midia-reel {
      border: 2px solid ${COR_PRIMARIA};
      max-width: 320px;
    }
    .reel-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: ${COR_PRIMARIA};
      color: #fff;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 10.5px;
      font-weight: bold;
      letter-spacing: 0.04em;
    }
    .midia-placeholder {
      margin: 10px 0 16px;
      padding: 20px 16px;
      background: ${COR_FUNDO_VISUAL};
      border: 2px dashed ${COR_BORDA};
      border-radius: 8px;
      text-align: center;
      color: #888;
      font-size: 13px;
      font-style: italic;
      font-family: Georgia, serif;
    }
    .carrossel-wrap {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding: 6px 2px 14px;
      margin: 4px 0 16px;
      -webkit-overflow-scrolling: touch;
      scroll-snap-type: x mandatory;
    }
    .carrossel-slide {
      flex: 0 0 auto;
      width: 240px;
      scroll-snap-align: start;
      border-radius: 8px;
      overflow: hidden;
      background: #f4f4f4;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      position: relative;
    }
    .carrossel-slide-reel {
      width: 180px;
      border: 1px solid ${COR_PRIMARIA};
    }
    .carrossel-slide img {
      display: block;
      width: 100%;
      height: auto;
      background: #fff;
    }
    .carrossel-slide figcaption {
      position: absolute;
      bottom: 6px;
      right: 6px;
      background: rgba(0,0,0,0.65);
      color: #fff;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 10.5px;
      font-weight: bold;
    }

    @media print {
      body { padding: 20px; }
      .post-card { box-shadow: none; page-break-inside: avoid; break-inside: avoid; }
      .midia-single, .midia-placeholder, .carrossel-wrap { page-break-inside: avoid; break-inside: avoid; }
      .carrossel-wrap {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
        overflow: visible;
      }
      .carrossel-slide, .carrossel-slide-reel { width: 100%; }
      .midia-single img { max-height: 60vh; object-fit: contain; }
    }
    @page { size: A4; margin: 14mm 12mm; }
  </style>
</head>
<body>
  <div class="doc-sub">Agenda Editorial</div>
  <h1>Camila Estética</h1>
  <div class="doc-cliente">SKIN WINTER 2026 · campanha de 10 semanas · ${totalPosts} posts no feed</div>

  <div class="intro">
    <strong>O que este documento contém.</strong> A agenda completa da campanha SKIN WINTER (Maio → Julho 2026). Cada post traz, na ordem:
    <ul>
      <li>Cabeçalho com data, formato e tema</li>
      <li>Metadados estratégicos (pilar / categoria / variação / persona)</li>
      <li><span class="legend">★</span> Legenda finalizada pronta para copiar e colar no Instagram (texto + hashtags em sequência)</li>
      <li>Texto dos slides (carrosséis) — slide a slide</li>
      <li>Roteiro do Reel (fala da Dra.), cards, storyboard e texto na tela quando aplicável</li>
      <li>Briefing visual (luz, lente, mood, referências) para a produção das imagens</li>
    </ul>
  </div>

  ${mesesRender}

  <div class="rodape">Gerado em ${new Date().toLocaleDateString("pt-BR")} · AGENDA-EDITORIAL-COMPLETA-mai-jun-jul.html · Camila Estética</div>
</body>
</html>`;
}

// =====================================================
// EXECUÇÃO
// =====================================================

async function main() {
  console.log("=== Camila Estética · AGENDA EDITORIAL COMPLETA (mai+jun+jul) ===\n");

  let totalPosts = 0;
  let totalImagens = 0;
  const mesesData = [];
  for (const cal of CALENDARIOS) {
    const raw = await fs.readFile(cal.md, "utf-8");
    const posts = parseCalendario(raw);
    totalPosts += posts.length;

    // Resolve mídia (imagens em base64) de cada post a partir de entregaveis/
    const subpastas = await listarSubpastas(cal.entregaveisDir);
    const midias = [];
    let comImagem = 0;
    for (let i = 0; i < posts.length; i++) {
      const midia = await resolverMidiaPost(i + 1, subpastas, cal.entregaveisDir);
      midias.push(midia);
      if (midia && midia.imagens.length > 0) {
        comImagem++;
        totalImagens += midia.imagens.length;
      }
    }
    console.log(`  ${cal.mes}: ${posts.length} posts · ${comImagem} com mídia embutida`);
    mesesData.push({ mes: cal.mes, fase: cal.fase, submes: cal.submes, posts, midias });
  }

  const html = montarHtml(mesesData.map(renderMes).join("\n"), totalPosts);

  await fs.mkdir(path.dirname(OUTPUT_REPO), { recursive: true });
  await fs.writeFile(OUTPUT_REPO, html, "utf-8");
  const statHtml = await fs.stat(OUTPUT_REPO);
  console.log(`  ✓ HTML: ${OUTPUT_REPO} (${(statHtml.size / 1024 / 1024).toFixed(1)} MB)`);

  // PDF local para revisão/backup; entregável oficial vira o link público /a/<token>
  console.log("\n→ Gerando PDF (Puppeteer)…");
  const pdfPath = OUTPUT_REPO.replace(/\.html$/i, ".pdf");
  const { sizeBytes } = await gerarPdfDoHtml({ inputHtml: OUTPUT_REPO, outputPdf: pdfPath });
  console.log(`  ✓ PDF:  ${pdfPath} (${(sizeBytes / 1024 / 1024).toFixed(1)} MB)`);

  console.log(`\nTotal: ${totalPosts} posts · ${totalImagens} imagens embutidas em base64`);
  console.log(`Entregável ao cliente: link público /a/<token> da ferramenta web.`);
  console.log(`HTML/PDF locais servem como backup e preview de revisão.\n`);
}

main().catch((err) => {
  console.error("❌ ERRO:", err);
  process.exit(1);
});
