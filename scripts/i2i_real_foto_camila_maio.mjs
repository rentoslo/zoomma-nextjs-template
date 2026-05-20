// =====================================================
// I2I com fotos REAIS do banco da Camila — 3 imagens de maio
//
// 2026-05-30 post-ancora-dra-janela   → IMG_3677 (janela, blusa branca)
// 2026-05-25 carrossel-dois-tipos-04  → IMG_3677 (mesma base, layout slide)
// 2026-05-27 capa-reel-dra-manifesto  → IMG_3629 (retrato estúdio, troca bg)
//
// Abordagem: foto real como INPUT; Gemini edita fundo e adiciona layout/texto.
// "Sem remoção total de fundo" — apenas adapta para o aesthetic White Premium.
// =====================================================

import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { qaImagem, logQA } from "./lib/qa_visual.mjs";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  console.error("ERRO: GOOGLE_AI_API_KEY não encontrada em .env");
  process.exit(1);
}

const MODEL = "gemini-3-pro-image-preview";
const CAMPANHA = "2026-mai-jul_skin-winter";
const MES_PASTA = "2026-05_maio";
const OUTPUT_DIR = `G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\${CAMPANHA}\\02_IMAGENS\\${MES_PASTA}`;
const FOTOS_DIR = "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\fotos_avatar";
const MAX_TENTATIVAS = 3;

const NEG = `different woman, face replaced, identity changed, extra limbs, distorted hands, watermark, logo overlay, city buildings visible through window, trees through window, MacBook, laptop, phone, smartphone, tablet, medical equipment, clinic equipment, treatment bed, reclining pose, sensual pose, underwear, exposed skin, illegible text, broken letters, doubled letters, repeated text lines, duplicated phrases, oversaturated, harsh contrast, neon colors, dark moody background, heavy vignette`;

const TYPO_RULES = `Typography PERFECTLY legible with all Portuguese accents intact (á, ã, ç, é, ê, í, ó, ô, õ, ú). Crisp clean letter shapes. NO broken letters, NO doubled letters, NO hyphen-split words. EXACT spelling required. CRITICAL: each line of text appears EXACTLY ONCE — no duplication.`;

// =====================================================
// 3 POSTS
// =====================================================
const posts = [
  // ---------------------
  // POST ÂNCORA — 30/05
  // Split layout: esquerda = foto Dra. janela (img real), direita = texto
  // ---------------------
  {
    nome: "2026-05-30-post-ancora-dra-janela",
    seed: 30601,
    fotoInput: "IMG_3677.jpg",
    textoEsperado: "Junho abre uma temporada nova na Camila Estética. — DRA. CAMILA",
    prompt: `This is an image-to-image edit. The input photo shows Dr. Camila Slobodticov.

PRESERVE EXACTLY — do NOT alter:
- Her face, expression (natural smile, relaxed), hair (dark brown wavy mid-length)
- Her warm tan skin tone
- Her white linen blouse and pose

REMOVE these specific objects from the scene:
- The MacBook / laptop on the table in front of her
- Any phone or smartphone visible
- The outdoor urban/green landscape visible through the window — replace that view with a soft warm golden-hour blur (backlit linen curtain, no identifiable outdoor elements)

BACKGROUND ADAPTATION (not full removal):
- The window frame and sheer linen/white curtain remain
- The outdoor view becomes a diffused warm golden light behind the curtain — ethereal, soft, NO trees, NO buildings
- Wall behind her: cream-white #FBF7F4 limewash

CREATE 4:5 VERTICAL POST LAYOUT:
LEFT 58% of canvas: Dr. Camila with the adapted background, positioned slightly left-of-center. Frame her photo section with a thin rounded-corner white border (premium editorial magazine photo treatment).
RIGHT 42% of canvas: Solid soft cream #FAFAF8 background — clean white space.

TEXT on the right panel — centered vertically in the upper-right area:
Font: elegant Playfair Display serif italic, soft black #1A1A1A, size proportional to the 4:5 canvas
LINE 1: "Junho abre"
LINE 2: "uma temporada nova"
LINE 3: "na Camila Estética."

Below the 3rd line: thin horizontal gold #D4AF37 accent line (approximately 120px wide).
At the very bottom-right corner of the right panel: small gold uppercase letter-spaced signature "— DRA. CAMILA"

QUALITY: Premium editorial photography feel, magazine quality. Soft diffused natural light. 4:5 aspect ratio.
NEGATIVE: ${NEG}
${TYPO_RULES}`,
  },

  // ---------------------
  // CARROSSEL SLIDE 4 — 25/05
  // Upper half: glass panel with text "A JANELA"
  // Lower half: framed photo of Dra. by window
  // ---------------------
  {
    nome: "2026-05-25-carrossel-dois-tipos-04-janela",
    seed: 25604,
    fotoInput: "IMG_3677.jpg",
    textoEsperado: "04/07 A JANELA Junho e julho são os meses em que a pele aceita peeling, estímulo, microagulhamento — sem fotossensibilidade do verão.",
    prompt: `This is an image-to-image edit for a 4:5 Instagram carousel slide. The input photo shows Dr. Camila Slobodticov.

PRESERVE EXACTLY — do NOT alter:
- Her face, expression, hair (dark brown wavy), skin tone, white blouse
- Her pose near the window

REMOVE from the scene:
- The MacBook / laptop and any phone
- The urban/outdoor view through the window → replace with soft warm golden-hour light diffused through linen curtain (no buildings, no trees visible)

CREATE 4:5 VERTICAL CAROUSEL SLIDE with TWO STACKED ZONES:

UPPER ZONE (top 42% of canvas):
A translucent frosted glass panel (glassmorphism: white/cream, 80% opacity, rounded corners, subtle blur) over warm off-white #FBF7F4 background.
On this panel:
  - Small uppercase gold #D4AF37 letter-spaced sans-serif: "A JANELA"
  - Below in Playfair Display serif italic soft black #1A1A1A, centered, 4 lines:
    LINE 1: "Junho e julho são os meses em que"
    LINE 2: "a pele aceita peeling, estímulo,"
    LINE 3: "microagulhamento — sem"
    LINE 4: "fotossensibilidade do verão."
  - Thin gold #D4AF37 horizontal accent line below text

SLIDE NUMBER: small gold "04/07" placed ONLY in the top-right corner of the canvas, OUTSIDE the glass panel, NOT repeated anywhere else.

LOWER ZONE (bottom 58% of canvas):
The edited photograph of Dr. Camila — show her from shoulders/bust upward, by the window with adapted golden light (MacBook removed). Frame this photo section with a thick rounded white border (premium magazine style). The photo sits on a cream #FBF7F4 base.

OUTPUT: Premium editorial carousel slide, 4:5 aspect ratio.
NEGATIVE: ${NEG}, duplicate slide number, "04/07" appearing more than once
${TYPO_RULES}`,
  },

  // ---------------------
  // CAPA REEL MANIFESTO — 27/05
  // Retrato de estúdio, troca fundo escuro por cream/white premium
  // 9:16 vertical (capa de Reel)
  // ---------------------
  {
    nome: "2026-05-27-capa-reel-dra-manifesto",
    seed: 27601,
    fotoInput: "IMG_3629.jpg",
    textoEsperado: "MANIFESTO Existem dois tipos de cliente. — DRA. CAMILA",
    prompt: `This is an image-to-image edit for a 9:16 vertical Instagram Reel cover. The input photo shows Dr. Camila Slobodticov in a studio portrait.

PRESERVE EXACTLY — do NOT alter:
- Her face, expression, eye makeup, hair (dark brown wavy, full professional styling)
- Her pose (3/4 angle, confident eye contact)
- Her necklace
- Her body position and wardrobe silhouette

BACKGROUND ADAPTATION (not full removal):
- Replace the dark/textured studio background with a rich warm cream-ivory gradient: warm off-white #FBF7F4 at center, fading softly to ivory #F5EDE0 at the edges
- Add a very subtle, barely perceptible soft vignette at the extreme edges only
- Overall mood: confident, authoritative, editorial — bright and premium

CREATE 9:16 VERTICAL REEL COVER LAYOUT:
- Dr. Camila occupies the LOWER 60% of the frame, centered, from bust upward
- The UPPER 40% is generous clean cream #FBF7F4 space for text

TEXT OVERLAY in the upper area:
  Small uppercase gold #D4AF37 letter-spaced sans-serif label: "MANIFESTO"
  Below in large Playfair Display serif italic soft black #1A1A1A:
  LINE 1: "Existem dois"
  LINE 2: "tipos de cliente."
  Thin gold #D4AF37 accent line below (100px wide)
  Small gold uppercase letter-spaced: "— DRA. CAMILA"

QUALITY: High-end editorial portrait, magazine cover quality. Soft warm studio lighting. Confident, authoritative mood. 9:16 aspect ratio.
NEGATIVE: ${NEG}, dark background, gothic atmosphere, heavy vignette, cold blue tones
${TYPO_RULES}`,
  },
];

// =====================================================
// EXECUÇÃO COM QA
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

async function gerarI2I(post, seedOverride) {
  const seed = seedOverride ?? post.seed;
  const fotoPath = path.join(FOTOS_DIR, post.fotoInput);
  const fotoBytes = await fs.readFile(fotoPath);
  const fotoBase64 = fotoBytes.toString("base64");

  const partes = [
    { inlineData: { data: fotoBase64, mimeType: "image/jpeg" } },
    { text: post.prompt },
  ];

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: partes }],
    config: { responseModalities: ["IMAGE"], seed },
  });

  const candidate = response.candidates?.[0];
  if (!candidate) throw new Error("Sem candidates");
  const imagePart = candidate.content?.parts?.find((p) => p.inlineData);
  if (!imagePart) throw new Error("Sem inlineData de imagem");

  return Buffer.from(imagePart.inlineData.data, "base64");
}

async function gerarComQA(post) {
  const fotosRefPaths = [path.join(FOTOS_DIR, post.fotoInput)];
  let seedAtual = post.seed;

  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    process.stdout.write(
      `  [${post.nome}] tentativa ${tentativa}/${MAX_TENTATIVAS} (seed=${seedAtual})... `
    );

    const imageBytes = await gerarI2I(post, seedAtual);
    const outputPath = path.join(OUTPUT_DIR, `${post.nome}.png`);
    await fs.writeFile(outputPath, imageBytes); // sempre sobrescreve
    process.stdout.write(`gerada (${(imageBytes.length / 1024).toFixed(0)} KB). QA+identidade... `);

    const qa = await qaImagem(ai, outputPath, {
      textoEsperado: post.textoEsperado,
      fotosReferencia: fotosRefPaths,
    });

    if (qa.passou) {
      console.log(`✓ passou`);
      logQA(post.nome, qa);
      return { nome: post.nome, status: "ok", qa, tentativas: tentativa };
    }

    console.log(`reprovou`);
    logQA(post.nome, qa);
    if (qa.problemas?.length) {
      qa.problemas.forEach((p) =>
        console.log(`     [${p.gravidade}] ${p.tipo}: ${p.descricao}`)
      );
    }
    if (tentativa < MAX_TENTATIVAS) seedAtual += 1000;
  }

  return { nome: post.nome, status: "qa_falhou", tentativas: MAX_TENTATIVAS };
}

async function main() {
  console.log("=== I2I com fotos REAIS do banco da Camila — 3 imagens ===");
  console.log(`Modelo: ${MODEL}`);
  console.log(`Fotos input: IMG_3677.jpg (janela) + IMG_3629.jpg (manifesto)`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Verificar que as fotos existem
  for (const foto of ["IMG_3677.jpg", "IMG_3629.jpg"]) {
    const p = path.join(FOTOS_DIR, foto);
    await fs.access(p);
    console.log(`✓ Foto encontrada: ${foto}`);
  }
  console.log("");

  const inicio = Date.now();
  const resultados = [];

  // Sequencial para não sobrecarregar com fotos pesadas
  for (const post of posts) {
    console.log(`▶ ${post.nome} (foto: ${post.fotoInput})`);
    const result = await gerarComQA(post).catch((err) => ({
      nome: post.nome,
      status: "erro",
      erro: err.message || String(err),
    }));
    resultados.push(result);
    if (result.erro) console.log(`  ❌ Erro: ${result.erro}`);
    console.log("");
  }

  const totalSeg = ((Date.now() - inicio) / 1000).toFixed(0);
  const ok = resultados.filter((r) => r.status === "ok").length;
  const falha = resultados.filter((r) => r.status !== "ok").length;

  console.log("=== RESUMO ===");
  console.log(`Tempo: ${totalSeg}s · OK: ${ok}/3 · Falhas: ${falha}`);
  resultados.forEach((r) => {
    const icon = r.status === "ok" ? "✓" : "✗";
    console.log(`  ${icon} ${r.nome}: ${r.status} (${r.tentativas ?? "-"} tentativas)`);
  });
}

main().catch((err) => {
  console.error("❌ ERRO FATAL:", err);
  process.exit(1);
});
