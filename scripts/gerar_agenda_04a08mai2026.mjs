// Geração da agenda editorial Zoomma — Semana 04-08/maio/2026
// Aplica o NOVO PADRÃO VISUAL (templates 01, 03, 04 + sinalização de nicho + anti-IA)
// Ignora os prompts originais da agenda — usa o sistema definido em 03b
// Modo: SÍNCRONO (preview pra validar estética; próximas em Batch)
// Saída: C:\Users\rento\Downloads\teste\agenda_04a08mai2026\

import { GoogleGenAI } from "@google/genai";
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
const OUTPUT_DIR = "C:\\Users\\rento\\Downloads\\teste\\agenda_04a08mai2026";

const NEGATIVE_PROMPT =
  "no symmetry, no perfect geometry, no cartoon, no illustration, no overly saturated colors, no harsh shadows, no plastic textures, no AI artifacts, no stock photo aesthetic, no watermarks, no misspellings, no garbled text, no extra letters, no missing accents, no broken accents on Portuguese characters";

// =====================================================
// 13 IMAGENS DA AGENDA (mantém copy original; aplica padrão visual novo)
// =====================================================
const posts = [
  // ========== POST 1 — SEGUNDA 04/05 — POSICIONAMENTO (Carrossel 3 slides) ==========
  {
    nome: "post1_slide1_capa",
    descricao: "Post 1 (Seg) — Slide 1 Capa — Posicionamento",
    prompt: `Editorial Instagram carousel cover slide design, full bleed deep navy blue background color hex 2B3A4D, large bold elegant serif typography (Playfair Display style) in pure white color centered on the canvas spanning multiple lines, EXACT text reading: line 1 "Você não tem" line 2 "problema de cliente." line 3 "" line 4 "Você tem problema" line 5 "de posicionamento.", thin horizontal gold accent line color hex D4A574 about 80 pixels wide centered below the headline, in the lower right corner in small clean sans-serif gold text the exact phrase "01/03", far at the bottom centered in tiny sans-serif gold uppercase letters spaced with letter spacing the exact word "ZOOMMA", generous negative space, sophisticated minimalist premium aesthetic, no other graphic elements, no logos, no symbols, flawless legible typography with perfect Portuguese accents on the words "você", aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "post1_slide2_conteudo",
    descricao: "Post 1 (Seg) — Slide 2 Conteúdo — Posicionamento define tudo",
    prompt: `Editorial Instagram carousel content slide design, full bleed warm off-white background color hex F5F3EE, large bold elegant serif typography in deep navy hex 2B3A4D positioned in the upper third left-aligned with margin, EXACT headline text on two lines: "Posicionamento" line 2 "define tudo.", below the headline a thin horizontal gold accent line color hex D4A574, below that in clean sans-serif Montserrat-style dark gray color hex 4A4A4A, regular body text left-aligned reading EXACT text on multiple lines: line 1 "Quando o negócio não cresce," line 2 "a culpa vai pro marketing." line 3 "" line 4 "Mas o problema quase sempre" line 5 "está antes disso.", then a blank line, then in slightly larger dark navy semi-bold serif EXACT text: "Posicionamento define:", then three list items in sans-serif with gold arrows in front of each, EXACT text: line 1 "→ Quem você atrai" line 2 "→ O que essas pessoas pagam" line 3 "→ Por quanto tempo elas ficam", in lower right corner small gold text "02/03", generous negative space on the right, sophisticated editorial premium aesthetic, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "post1_slide3_cta",
    descricao: "Post 1 (Seg) — Slide 3 CTA — Manda ESTRATÉGIA",
    prompt: `Editorial Instagram carousel final CTA slide design, full bleed deep navy blue background color hex 2B3A4D, large bold elegant serif typography in pure white centered, EXACT text on two lines: line 1 "Quer saber onde está" line 2 "o seu gargalo real?", below in generous space a clean rectangular CTA badge with thin gold border color hex D4A574 about 4 pixels thick and rounded corners 12 pixels, inside the badge centered the EXACT single uppercase bold word "ESTRATÉGIA" in gold sans-serif with letter spacing, below the badge in small white sans-serif EXACT text "Envie essa palavra no direct.", in lower right corner small gold text "03/03", at the very bottom tiny gold uppercase letter-spaced "ZOOMMA", generous negative space, sophisticated minimalist premium aesthetic, no other graphic elements, no logos, flawless legible typography with perfect Portuguese accents and tilde, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },

  // ========== POST 2 — TERÇA 05/05 — REEL THUMBNAIL — VALOR PERCEBIDO ==========
  {
    nome: "post2_reels_thumbnail",
    descricao: "Post 2 (Ter) — Reel Thumbnail — Valor Percebido (cena nichada)",
    prompt: `Editorial Instagram Reels thumbnail design, photograph composition with a sophisticated salon reception area completely out of focus in the soft creamy bokeh background showing hints of an elegant styling chair silhouette and warm pendant lighting plus a green plant blur, foreground completely empty allowing for text overlay, shot on Fujifilm GFX 50R with 85mm lens at f/2, ISO 320, warm golden hour lighting at color temperature 3200K, color palette warm peachy beige hex E8D9CC and off-white dominant with creamy soft brown bokeh from the background salon, dreamy organic depth of field, sophisticated editorial mood. Over the entire foreground a translucent warm beige overlay rectangle color hex E8D9CC at 65 percent opacity with soft rounded corners 16 pixels radius covering 75 percent of the canvas leaving some bokeh visible at edges. On top of this overlay large bold elegant serif typography in deep navy hex 2B3A4D positioned upper-center, EXACT text on three lines: line 1 "O concorrente" line 2 "cobra menos e está" line 3 "sempre cheio.", below in slightly smaller serif navy italic the EXACT text "E agora?", below the headline a thin horizontal gold accent line color hex D4A574, below the line in clean sans-serif small text dark gray the EXACT phrase "A resposta não é abaixar o preço.", at the bottom in small uppercase letter-spaced gold text the EXACT phrase "Envie VALOR no direct.", flawless legible typography with perfect Portuguese accents, no people visible in image, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },

  // ========== POST 3 — QUARTA 06/05 — AQUISIÇÃO (Carrossel 4 slides) ==========
  {
    nome: "post3_slide1_capa",
    descricao: "Post 3 (Qua) — Slide 1 Capa — Instagram lindo mas não traz clientes",
    prompt: `Editorial Instagram carousel cover slide design, full bleed deep navy blue background color hex 2B3A4D, large bold elegant serif typography (Playfair Display style) in pure white color centered on the canvas spanning multiple lines, EXACT text reading: line 1 "Seu Instagram" line 2 "está lindo." line 3 "" line 4 "Mas não está" line 5 "trazendo clientes.", below the headline a thin horizontal gold accent line color hex D4A574 about 80 pixels wide centered, below the line in small clean sans-serif soft gold italic the EXACT text "O problema não é a estética. É a estratégia.", in the lower right corner in small clean sans-serif gold text the exact phrase "01/04", at the bottom tiny gold uppercase letter-spaced "ZOOMMA", generous negative space, sophisticated minimalist premium aesthetic, no other graphic elements, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "post3_slide2_porque",
    descricao: "Post 3 (Qua) — Slide 2 — Por que isso acontece",
    prompt: `Editorial Instagram carousel content slide design, full bleed warm off-white background color hex F5F3EE, large bold elegant serif typography in deep navy hex 2B3A4D positioned in the upper third left-aligned with margin, EXACT headline text on two lines: line 1 "Por que isso" line 2 "acontece?", below the headline a thin horizontal gold accent line color hex D4A574, below that in clean sans-serif Montserrat-style regular dark gray color hex 4A4A4A, left-aligned body text reading EXACT text on multiple lines: line 1 "Conteúdo bonito sem" line 2 "estratégia é vaidade digital.", then a blank line, then EXACT text: line 1 "O Instagram precisa funcionar" line 2 "como um sistema de aquisição," line 3 "não como um álbum de fotos.", in lower right corner small gold text "02/04", generous negative space on the right, sophisticated editorial premium aesthetic, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "post3_slide3_oque_muda",
    descricao: "Post 3 (Qua) — Slide 3 — O que muda com estratégia (lista)",
    prompt: `Editorial Instagram carousel content slide design, full bleed warm off-white background color hex F5F3EE, large bold elegant serif typography in deep navy hex 2B3A4D positioned in the upper third left-aligned with margin, EXACT headline text on two lines: line 1 "O que muda com" line 2 "estratégia:", below the headline a thin horizontal gold accent line color hex D4A574, below that a four-item list with gold colored arrows hex D4A574 in front of each item in clean sans-serif Montserrat-style regular dark gray hex 4A4A4A, EXACT text per line: line 1 "→ Posts com propósito claro" line 2 "→ CTA que move para o próximo passo" line 3 "→ Conteúdo que qualifica antes de vender" line 4 "→ Consistência que constrói autoridade", in lower right corner small gold text "03/04", generous negative space on the right, sophisticated editorial premium aesthetic, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "post3_slide4_cta",
    descricao: "Post 3 (Qua) — Slide 4 CTA — Manda CRESCER",
    prompt: `Editorial Instagram carousel final CTA slide design, full bleed deep navy blue background color hex 2B3A4D, large bold elegant serif typography in pure white centered, EXACT text on three lines: line 1 "Quer transformar" line 2 "seu Instagram em uma fonte" line 3 "previsível de clientes?", below in generous space a clean rectangular CTA badge with thin gold border color hex D4A574 about 4 pixels thick and rounded corners 12 pixels, inside the badge centered the EXACT single uppercase bold word "CRESCER" in gold sans-serif with letter spacing, below the badge in small white sans-serif EXACT text "Envie essa palavra no direct.", in lower right corner small gold text "04/04", at the very bottom tiny gold uppercase letter-spaced "ZOOMMA", generous negative space, sophisticated minimalist premium aesthetic, no other graphic elements, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },

  // ========== POST 4 — QUINTA 07/05 — REEL THUMBNAIL — CONVERSÃO (variação C minimalista) ==========
  {
    nome: "post4_reels_thumbnail",
    descricao: "Post 4 (Qui) — Reel Thumbnail — Conversão (minimalista)",
    prompt: `Editorial Instagram Reels thumbnail design with maximum negative space minimalist aesthetic, full bleed warm off-white background color hex F5F3EE with very subtle hint of warm beige in the corners, large bold elegant serif typography (Playfair Display style) in deep navy hex 2B3A4D positioned upper-left aligned spanning multiple lines, EXACT text on three lines: line 1 "Ela perguntou" line 2 "o preço." line 3 "" line 4 "Você respondeu." line 5 "" line 6 "Ela sumiu.", in the lower right third in small italic serif dark forest green hex 3E5A4F the EXACT short phrase "O problema não foi o preço.", in the lower right corner a single tiny gold accent dot color hex D4A574, generous empty negative space throughout the canvas creating airy clean composition, ultra minimalist sophisticated editorial aesthetic, no logos, no additional graphic elements, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },

  // ========== POST 5 — SEXTA 08/05 — OFERTA (Carrossel 4 slides) ==========
  {
    nome: "post5_slide1_capa",
    descricao: "Post 5 (Sex) — Slide 1 Capa — Você não é caro",
    prompt: `Editorial Instagram carousel cover slide design, full bleed warm off-white background color hex F5F3EE, large bold elegant serif typography (Playfair Display style) in deep navy hex 2B3A4D centered on the canvas spanning multiple lines, EXACT text reading: line 1 "Você não é caro." line 2 "" line 3 "Você não está" line 4 "comunicando o valor" line 5 "do jeito certo.", below the headline a thin horizontal gold accent line color hex D4A574 about 80 pixels wide centered, in the lower right corner in small clean sans-serif gold text the exact phrase "01/04", at the bottom tiny gold uppercase letter-spaced "ZOOMMA", generous negative space, sophisticated minimalist premium aesthetic, no other graphic elements, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "post5_slide2_compra",
    descricao: "Post 5 (Sex) — Slide 2 — O que sua cliente compra",
    prompt: `Editorial Instagram carousel content slide design, full bleed warm off-white background color hex F5F3EE, large bold elegant serif typography in deep navy hex 2B3A4D positioned in the upper third left-aligned with margin, EXACT headline text on two lines: line 1 "O que sua cliente" line 2 "compra de verdade?", below the headline a thin horizontal gold accent line color hex D4A574, below that in clean sans-serif Montserrat-style regular dark gray color hex 4A4A4A, left-aligned body text reading EXACT text: "Ela não compra o procedimento.", then EXACT text "Ela compra:", then a four-item list with gold colored arrows hex D4A574 in front of each item, EXACT text per line: line 1 "→ O resultado que vai ter" line 2 "→ A segurança de boas mãos" line 3 "→ A experiência do atendimento" line 4 "→ A transformação que vai sentir", in lower right corner small gold text "02/04", generous negative space, sophisticated editorial premium aesthetic, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "post5_slide3_como_comunicar",
    descricao: "Post 5 (Sex) — Slide 3 — Como comunicar valor antes do preço",
    prompt: `Editorial Instagram carousel content slide design, full bleed warm off-white background color hex F5F3EE, large bold elegant serif typography in deep navy hex 2B3A4D positioned in the upper third left-aligned with margin, EXACT headline text on two lines: line 1 "Como comunicar valor" line 2 "antes do preço:", below the headline a thin horizontal gold accent line color hex D4A574, below that a four-item list with gold colored arrows hex D4A574 in front of each item in clean sans-serif Montserrat-style regular dark gray hex 4A4A4A, EXACT text per line: line 1 "→ Mostre o processo com autoridade" line 2 "→ Compartilhe histórias reais" line 3 "→ Explique sua técnica diferente" line 4 "→ Posicione seus diferenciais", in lower right corner small gold text "03/04", generous negative space, sophisticated editorial premium aesthetic, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "post5_slide4_cta",
    descricao: "Post 5 (Sex) — Slide 4 CTA — Manda VALOR",
    prompt: `Editorial Instagram carousel final CTA slide design, full bleed deep navy blue background color hex 2B3A4D, large bold elegant serif typography in pure white centered, EXACT text on two lines: line 1 "Quer construir uma oferta" line 2 "que justifica o seu valor?", below in generous space a clean rectangular CTA badge with thin gold border color hex D4A574 about 4 pixels thick and rounded corners 12 pixels, inside the badge centered the EXACT single uppercase bold word "VALOR" in gold sans-serif with letter spacing, below the badge in small white sans-serif EXACT text "Envie essa palavra no direct.", in lower right corner small gold text "04/04", at the very bottom tiny gold uppercase letter-spaced "ZOOMMA", generous negative space, sophisticated minimalist premium aesthetic, no other graphic elements, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 Gerando ${posts.length} imagens da agenda 04-08/mai/2026 via ${MODEL}`);
console.log(`📁 Saída: ${OUTPUT_DIR}\n`);

await fs.mkdir(OUTPUT_DIR, { recursive: true });

const inicio = Date.now();
const resultados = [];

for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  const numero = String(i + 1).padStart(2, "0");
  const arquivo = path.join(OUTPUT_DIR, `${post.nome}.png`);
  const tInicio = Date.now();

  process.stdout.write(`[${numero}/${posts.length}] ${post.descricao}... `);

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: post.prompt,
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: "4:5" },
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData?.data);

    if (!imagePart) {
      throw new Error(
        `Resposta sem imagem. Parts: ${JSON.stringify(
          parts.map((p) => Object.keys(p))
        )}`
      );
    }

    const buffer = Buffer.from(imagePart.inlineData.data, "base64");
    await fs.writeFile(arquivo, buffer);

    const segundos = ((Date.now() - tInicio) / 1000).toFixed(1);
    console.log(`✓ (${segundos}s)`);
    resultados.push({ post: post.nome, status: "ok", arquivo, segundos });
  } catch (err) {
    console.log(`✗ ERRO: ${err.message}`);
    resultados.push({ post: post.nome, status: "erro", erro: err.message });
  }
}

const totalSegundos = ((Date.now() - inicio) / 1000).toFixed(1);
const sucessos = resultados.filter((r) => r.status === "ok").length;
const falhas = resultados.filter((r) => r.status === "erro").length;

console.log(`\n${"=".repeat(60)}`);
console.log(`✅ ${sucessos} sucessos · ✗ ${falhas} falhas · ⏱  ${totalSegundos}s total`);
console.log(`📁 Arquivos em: ${OUTPUT_DIR}`);
console.log(`${"=".repeat(60)}\n`);

if (falhas > 0) {
  console.log("Falhas:");
  for (const r of resultados.filter((r) => r.status === "erro")) {
    console.log(`  - ${r.post}: ${r.erro}`);
  }
}
