// Image-to-image edit com fotos REAIS da Camila — preserva rosto 100%
// Aplica: mood Kinfolk + overlay bege com texto + assinatura visual (linha dourada 1.5px)
// Modo: SÍNCRONO (validação inicial do conceito image-to-image)
// Saída: C:\Users\rento\Downloads\teste\camila_referencia\

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
const OUTPUT_DIR = "C:\\Users\\rento\\Downloads\\teste\\camila_referencia";
const FOTOS_DIR = "G:\\Meu Drive\\ZOOMMA\\IDENTIDADE VISUAL\\fotos_referencia\\camila";

const ASSINATURA_VISUAL = `IMPORTANT visual signature that must be present: a thin solid metallic gold vertical line color hex D4A574 exactly 1.5 pixels wide at 90 percent opacity, positioned at exactly 28 pixels from the left edge of the canvas, running uninterrupted from the very top edge to the very bottom edge of the image. This line is the official Zoomma brand signature and must always be visible.`;

const PRESERVE_IDENTITY = `CRITICAL: preserve the exact identity, facial features, hair, expression, and likeness of the woman from the input photograph with absolute fidelity. Do not alter her face, eyes, smile, skin tone, hair color, hair texture, or any defining feature. She must be unmistakably the same person.`;

const NEGATIVE_PROMPT =
  "no symmetry, no plastic skin, no cartoon, no illustration, no AI artifacts, no harsh shadows, no stock photo aesthetic, no watermarks, no misspellings, no garbled text, no missing accents, no facial alteration, no different person";

// =====================================================
// 3 POSTS DA CAMILA — image-to-image edit
// =====================================================
const posts = [
  // ---------- POST 1 ----------
  // Foto base: IMG_3860 — Camila em jaleco bordô numa clínica de estética com equipamentos
  // Objetivo: post de autoridade — "profissional da beleza fala com profissional da beleza"
  {
    nome: "01_camila_clinica_autoridade",
    descricao: "Post 1 — Autoridade na clínica (CTA VALOR)",
    fotoBase: "IMG_3860.jpg",
    promptEdicao: `${PRESERVE_IDENTITY}

EDIT THIS PHOTOGRAPH for Instagram with the following changes:

1. Keep the woman exactly as she is — her face, expression, hair, and the bordeaux/burgundy clinical coat must remain identical.

2. Transform the background into a soft, dreamy Kinfolk-magazine-style aesthetic clinic interior: warm honey wood textures softly visible, a green plant blurred in the corner, soft natural light from a side window casting gentle warm shadows. The aesthetic clinic equipment that was in the original photo should be softened, more out of focus, less industrial-looking — turn it into elegant ambient context rather than focal point. Maintain the warm Kinfolk palette: honey wood, soft cream, sage green, warm white.

3. Re-light the scene with soft diffused natural light from the left, color temperature 4500K with warm honey undertones. Add subtle natural film grain. Slight depth of field with creamy bokeh in the background.

4. Recompose so that the woman occupies the right two thirds of the frame, leaving the left third as clean negative space for typography overlay.

5. On the left third negative space, add a translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. On top of this overlay, add large bold elegant serif typography (Playfair Display style) in deep navy color hex 2B3A4D, EXACT text on multiple lines: line 1 "Eu sou" line 2 "profissional" line 3 "da beleza." line 4 "" line 5 "E vou te contar" line 6 "o que ninguém" line 7 "te conta.". Below the headline a thin horizontal gold accent line color hex D4A574, then in smaller clean sans-serif uppercase navy letter-spaced text the EXACT phrase "Envie VALOR no direct.". Typography must be perfectly legible with all Portuguese accents intact.

6. Final aspect ratio 4:5.

7. ${ASSINATURA_VISUAL}

${NEGATIVE_PROMPT}`,
  },

  // ---------- POST 2 ----------
  // Foto base: IMG_3773 — Camila em penteadeira / salão clássico, blusa branca
  // Objetivo: post lifestyle profissional — lado "atendente do salão"
  {
    nome: "02_camila_salao_lifestyle",
    descricao: "Post 2 — Lifestyle no salão (CTA ESTRATÉGIA)",
    fotoBase: "IMG_3773.jpg",
    promptEdicao: `${PRESERVE_IDENTITY}

EDIT THIS PHOTOGRAPH for Instagram with the following changes:

1. Keep the woman exactly as she is — her face, expression, hair, smile, and the white blouse must remain identical. The vintage white styling chair and ornate mirror she is sitting at should also remain present.

2. Apply a soft, warm Kinfolk-magazine color grading to the entire scene: warm honey tones, soft cream, golden afternoon light. Soften the background slightly with gentle depth of field while keeping the salon context clearly visible. The vanity surface and mirror should look more elegant, more editorial, more luxurious — less generic salon.

3. Re-light the scene with soft golden hour natural light from the right, color temperature 3500K with warm amber undertones. Add subtle natural film grain. The light should feel dreamy and contemplative.

4. Recompose if needed so that there is generous negative space at the upper-left area of the frame for typography overlay.

5. On the upper-left negative space, add a translucent warm beige overlay rectangle color hex E8D9CC at 75 percent opacity with soft rounded corners 16 pixels radius. On top of this overlay, add large bold elegant serif typography (Playfair Display style) in deep navy color hex 2B3A4D, EXACT text on multiple lines: line 1 "O que aprendi" line 2 "atendendo" line 3 "no salão," line 4 "" line 5 "virou estratégia.". Below the headline a thin horizontal gold accent line color hex D4A574, then in smaller clean sans-serif uppercase navy letter-spaced text the EXACT phrase "Envie ESTRATÉGIA no direct.". Typography must be perfectly legible with all Portuguese accents intact, especially the tilde on "estratégia".

6. Final aspect ratio 4:5.

7. ${ASSINATURA_VISUAL}

${NEGATIVE_PROMPT}`,
  },

  // ---------- POST 3 ----------
  // Foto base: IMG_3629 — retrato fechado, fundo escuro studio
  // Objetivo: post de posicionamento / "founder card" — Camila em recepção de clínica
  {
    nome: "03_camila_retrato_posicionamento",
    descricao: "Post 3 — Retrato founder em clínica (CTA CRESCER)",
    fotoBase: "IMG_3629.jpg",
    promptEdicao: `${PRESERVE_IDENTITY}

EDIT THIS PHOTOGRAPH for Instagram with the following changes:

1. Keep the woman exactly as she is — her face, expression, smile, hair, makeup, the burgundy/bordeaux sweater, and the medallion necklace must remain identical with absolute fidelity.

2. Replace the dark gray textured studio background completely with a soft, dreamy Kinfolk-magazine-style aesthetic clinic reception interior, completely out of focus in creamy bokeh. The background should show hints of: warm beige walls, a sophisticated treatment bed corner barely visible far behind her, a single statement green plant silhouette, soft pendant lighting, all heavily blurred so the woman remains the absolute focal point. Maintain the warm Kinfolk palette: honey wood, soft cream, sage green, warm white.

3. Re-light the scene with soft golden hour natural light from the left, color temperature 3500K with warm amber undertones. The light on her face must remain flattering and natural — do not change her skin tone or facial lighting. Add subtle natural film grain to the overall image.

4. Recompose so that she occupies the right two thirds of the frame, leaving the left third as clean negative space for typography overlay.

5. On the left third negative space, add a translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. On top of this overlay, add large bold elegant serif typography (Playfair Display style) in deep navy color hex 2B3A4D, EXACT text on multiple lines: line 1 "Marketing" line 2 "para profissional" line 3 "da beleza." line 4 "" line 5 "Por quem" line 6 "entende dos" line 7 "dois lados.". Below the headline a thin horizontal gold accent line color hex D4A574, then in smaller clean sans-serif uppercase navy letter-spaced text the EXACT phrase "Envie CRESCER no direct.". Typography must be perfectly legible with all Portuguese accents intact.

6. Final aspect ratio 4:5.

7. ${ASSINATURA_VISUAL}

${NEGATIVE_PROMPT}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 Image-to-image edit: ${posts.length} posts da Camila via ${MODEL}`);
console.log(`📁 Saída: ${OUTPUT_DIR}\n`);

await fs.mkdir(OUTPUT_DIR, { recursive: true });

const inicio = Date.now();
const resultados = [];

for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  const numero = String(i + 1).padStart(2, "0");
  const arquivo = path.join(OUTPUT_DIR, `${post.nome}.png`);
  const tInicio = Date.now();

  process.stdout.write(`[${numero}/${posts.length}] ${post.descricao} (base: ${post.fotoBase})... `);

  try {
    // Lê a foto de referência e converte pra base64
    const fotoPath = path.join(FOTOS_DIR, post.fotoBase);
    const fotoBytes = await fs.readFile(fotoPath);
    const fotoBase64 = fotoBytes.toString("base64");

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: fotoBase64,
          },
        },
        { text: post.promptEdicao },
      ],
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
