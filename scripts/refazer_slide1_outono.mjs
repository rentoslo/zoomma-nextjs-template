// =====================================================
// REFAZER ÚNICO — 20/05 carrossel outono slide 1 (capa)
// Bug original: numeração "01/07" duplicada
// Nomenclatura final (sem versão, sobrescreve sempre):
//   2026-05-20-carrossel-outono-01-capa.png
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

const MAX_TENTATIVAS = 3;

const DNA_BASE = `white dominant premium aesthetic, elegant translucent glassmorphism layers, soft whispered pink accents, refined editorial sophistication, breathing negative space, premium magazine quality, frosted glass overlays, polished feminine luxury, soft diffused natural lighting`;

const NEG = `oversaturated, harsh contrast, neon colors, magenta, fuchsia, hot pink, busy composition, cluttered, garbled text, missing accents, broken letters, doubled letters, hyphen-split words, duplicated text, repeated slide number, repeated NN/07, repeated 01/07, watermark, signature, logo overlay, dark moody, cold blue tones`;

const TYPO_RULES = `Typography must be PERFECTLY legible with all Portuguese accents intact (á, ã, ç, é, ê, í, ó, ô, õ, ú). Crisp clean letter shapes. NO broken letters, NO doubled letters, NO hyphen-split words.`;

const VAR_A = `pure white #FFFFFF dominant background airy editorial luxury, translucent frosted glass panel overlay holding text glassmorphism effect subtle blur, elegant serif typography combined with bold sans-serif headline soft black #1A1A1A, whispered pink #FCE4EC details barely visible, soft diffused natural lighting, refined sophisticated atmosphere, generous negative space, premium editorial feminine, aspect ratio 4:5`;

const post = {
  nome: "2026-05-20-carrossel-outono-01-capa",
  seed: 12345,
  textoEsperado: `O outono virou. Sua pele percebeu? 01/07`,
  prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel cover for Camila Estética (premium aesthetic clinic for women in Bauru, Brazil). Full bleed warm off-white #FBF7F4 background.

CENTERED CONTENT:
A translucent frosted glass panel (glassmorphism, 75% opacity, soft rounded corners, gentle drop shadow). ON the panel render EXACT text:
- Line 1 large elegant Playfair Display serif soft black #1A1A1A: "O outono virou."
- Line 2 below in smaller sans-serif Inter Medium soft black #1A1A1A: "Sua pele percebeu?"
- Thin horizontal gold #D4AF37 accent line about 80px wide below the text

CRITICAL — SLIDE NUMBER:
The slide number "01/07" appears ONLY ONE TIME in the entire image, in the TOP-RIGHT CORNER of the canvas, OUTSIDE the glass panel, in small gold #D4AF37 sans-serif letter-spaced. DO NOT place "01/07" anywhere else. DO NOT repeat it inside or near the glass panel. Only ONE instance of "01/07" total.

Background subtle macro editorial photograph hint: soft feminine skin with golden window light, lightly desaturated cream tones — visible behind the glass panel as soft texture, NOT as a centered photo.

${TYPO_RULES}

NEGATIVE: ${NEG}, no medical equipment, no clinical look, no duplicated slide number, no second "01/07" anywhere.`,
};

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function gerarUm(p) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: p.prompt }] }],
    config: { responseModalities: ["IMAGE"], seed: p.seed },
  });
  const candidate = response.candidates?.[0];
  if (!candidate) throw new Error("Sem candidates");
  const imagePart = candidate.content?.parts?.find((x) => x.inlineData);
  if (!imagePart) throw new Error("Sem inlineData");
  return Buffer.from(imagePart.inlineData.data, "base64");
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const outputPath = path.join(OUTPUT_DIR, `${post.nome}.png`);

  console.log(`=== Refazer slide 1 capa carrossel outono ===`);
  console.log(`Output (será sobrescrito se existir): ${outputPath}\n`);

  let seedAtual = post.seed;
  for (let t = 1; t <= MAX_TENTATIVAS; t++) {
    process.stdout.write(`Tentativa ${t}/${MAX_TENTATIVAS} (seed=${seedAtual})... `);
    const bytes = await gerarUm({ ...post, seed: seedAtual });
    await fs.writeFile(outputPath, bytes); // sobrescreve sempre
    process.stdout.write(`gerada (${(bytes.length / 1024).toFixed(0)} KB). QA... `);

    const qa = await qaImagem(ai, outputPath, { textoEsperado: post.textoEsperado });
    if (qa.passou) {
      console.log(`✓ passou`);
      logQA(post.nome, qa);
      console.log(`\nSalvo em: ${outputPath}`);
      return;
    }
    console.log(`reprovou`);
    logQA(post.nome, qa);
    if (t < MAX_TENTATIVAS) seedAtual += 1000;
  }
  console.log(`\n⚠ Esgotou tentativas — última versão salva mesmo assim em ${outputPath}`);
}

main().catch((err) => {
  console.error("❌ ERRO:", err);
  process.exit(1);
});
