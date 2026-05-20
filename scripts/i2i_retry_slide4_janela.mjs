// =====================================================
// Retry slide4-janela com abordagem simplificada:
// Em vez de layout 2 zonas separadas, usa a foto real
// e adiciona OVERLAY de texto no topo (não recorta nem recompõe).
// Evita duplicação de imagem/texto que ocorreu antes.
// =====================================================

import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { qaImagem, logQA } from "./lib/qa_visual.mjs";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) { console.error("ERRO: GOOGLE_AI_API_KEY não encontrada"); process.exit(1); }

const MODEL = "gemini-3-pro-image-preview";
const CAMPANHA = "2026-mai-jul_skin-winter";
const MES_PASTA = "2026-05_maio";
const OUTPUT_DIR = `G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\${CAMPANHA}\\02_IMAGENS\\${MES_PASTA}`;
const FOTOS_DIR = "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\fotos_avatar";
const OUTPUT_FILE = "2026-05-25-carrossel-dois-tipos-04-janela.png";
const MAX_TENTATIVAS = 4;

const ai = new GoogleGenAI({ apiKey: API_KEY });

const prompts = [
  // Tentativa A: overlay simples no topo da foto real
  `Edit this real photo of Dr. Camila Slobodticov. This is a single image edit.

STEP 1 — Background edits (do NOT change Dr. Camila herself):
- Remove the MacBook / laptop and any phone from the scene
- Replace the urban outdoor view through the window with soft warm golden-hour light diffused through linen curtain (no buildings, no trees)
- Keep the window frame and white/linen curtain

STEP 2 — Add ONE frosted glass text panel as an OVERLAY at the TOP of the image:
- Place the panel over the top 40% of the image (translucent frosted white, 80% opacity, rounded corners)
- On this panel, add text:
  - Small uppercase gold #D4AF37 letter-spaced label: "A JANELA"
  - Below in Playfair Display serif italic soft black #1A1A1A:
    LINE 1: "Junho e julho são os meses em que"
    LINE 2: "a pele aceita peeling, estímulo,"
    LINE 3: "microagulhamento — sem"
    LINE 4: "fotossensibilidade do verão."
  - Thin gold #D4AF37 horizontal accent line below text

STEP 3 — Add slide indicator:
- Top-right corner (OUTSIDE the glass panel): small gold "04/07" — appears ONLY ONCE

IMPORTANT — what NOT to do:
- Do NOT create a second separate photo section
- Do NOT show Dr. Camila in two places
- Do NOT duplicate any text
- Do NOT add any framing/border around her — the glass panel is the only overlay
- Keep the aspect ratio 4:5 (crop if needed)

NEGATIVE: different woman, face replaced, duplicate image, text repeated twice, MacBook, phone, city view through window, trees visible, illegible text, broken letters`,

  // Tentativa B: phrasing alternativa com ênfase diferente
  `You are editing a photograph. The input is a real photo of Dr. Camila Slobodticov.

Make these SPECIFIC edits to the photo:
1. Remove the laptop/MacBook — fill that area naturally with the table surface and environment
2. Remove any phone visible
3. Through the window, replace the outdoor view with soft warm golden diffused light — the curtain stays, the outdoor landscape becomes a warm ethereal glow (no identifiable objects outside)

Then ADD a text graphic overlay on top of the photo:
- Position: upper 38% of the image, horizontally centered
- Style: frosted glass card (glassmorphism: semi-transparent white/cream, rounded corners, slight blur)
- Content of the card:
  [LABEL] "A JANELA" — small, uppercase, gold #D4AF37, letter-spaced
  [BODY] Playfair Display italic black text:
    "Junho e julho são os meses em que"
    "a pele aceita peeling, estímulo,"
    "microagulhamento — sem"
    "fotossensibilidade do verão."
  [ACCENT] thin gold horizontal line below body text

Also add: small gold "04/07" in the top-right corner of the full image (not inside the glass card).

The photo shows ONE single person (Dr. Camila). Do NOT split the image or duplicate any elements. Output: 4:5 vertical.`,
];

async function tentar(prompt, seed, fotoBase64) {
  const partes = [
    { inlineData: { data: fotoBase64, mimeType: "image/jpeg" } },
    { text: prompt },
  ];
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: partes }],
    config: { responseModalities: ["IMAGE"], seed },
  });
  const candidate = response.candidates?.[0];
  if (!candidate) throw new Error("Sem candidates");
  const imagePart = candidate.content?.parts?.find((p) => p.inlineData);
  if (!imagePart) throw new Error("Sem inlineData");
  return Buffer.from(imagePart.inlineData.data, "base64");
}

async function main() {
  console.log("=== Retry slide4-janela (overlay simples) ===\n");

  const fotoPath = path.join(FOTOS_DIR, "IMG_3677.jpg");
  const fotoBytes = await fs.readFile(fotoPath);
  const fotoBase64 = fotoBytes.toString("base64");
  const fotosRefPaths = [fotoPath];

  const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);

  const textoEsperado = "04/07 A JANELA Junho e julho são os meses em que a pele aceita peeling, estímulo, microagulhamento — sem fotossensibilidade do verão.";

  for (let t = 1; t <= MAX_TENTATIVAS; t++) {
    const prompt = prompts[Math.min(t - 1, prompts.length - 1)];
    const seed = 25700 + t * 500;
    process.stdout.write(`  Tentativa ${t}/${MAX_TENTATIVAS} (seed=${seed}, prompt=${t <= prompts.length ? "A" : "B"})... `);

    const imageBytes = await tentar(prompt, seed, fotoBase64);
    await fs.writeFile(outputPath, imageBytes);
    process.stdout.write(`gerada (${(imageBytes.length / 1024).toFixed(0)} KB). QA... `);

    const qa = await qaImagem(ai, outputPath, {
      textoEsperado,
      fotosReferencia: fotosRefPaths,
    });

    if (qa.passou) {
      console.log(`✓ passou`);
      logQA(OUTPUT_FILE, qa);
      console.log("\n✓ SUCESSO");
      return;
    }

    console.log(`reprovou`);
    if (qa.problemas?.length) {
      qa.problemas.forEach((p) => console.log(`     [${p.gravidade}] ${p.tipo}: ${p.descricao}`));
    }
  }

  console.log("\n⚠ Não passou QA após todas as tentativas. Arquivo salvo (última geração).");
}

main().catch((err) => {
  console.error("❌ ERRO FATAL:", err);
  process.exit(1);
});
