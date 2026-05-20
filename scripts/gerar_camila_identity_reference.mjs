// Identity Reference (Abordagem B) — usa Camila como referência de aparência
// para gerar cenas COMPLETAMENTE NOVAS que não temos fotos dela fazendo
// Fidelidade ao rosto: ~70-85% (compromise vs. liberdade de cenário)
// Saída: C:\Users\rento\Downloads\teste\camila_referencia\identity_reference\

import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

const MODEL = "gemini-3-pro-image-preview";
const OUTPUT_DIR = "C:\\Users\\rento\\Downloads\\teste\\camila_referencia\\identity_reference";
const FOTOS_DIR = "G:\\Meu Drive\\ZOOMMA\\IDENTIDADE VISUAL\\fotos_referencia\\camila";

// Múltiplas fotos da Camila como referência de aparência (3 ângulos diferentes)
const FOTOS_REFERENCIA = ["IMG_3629.jpg", "IMG_3686.jpg", "IMG_3860.jpg"];

const ASSINATURA_VISUAL = `IMPORTANT visual signature: a thin solid metallic gold vertical line color hex D4A574 exactly 1.5 pixels wide at 90 percent opacity, positioned at exactly 28 pixels from the left edge of the canvas, running uninterrupted from the very top edge to the very bottom edge of the image. This is the official Zoomma brand signature.`;

const IDENTITY_INSTRUCTION = `IMPORTANT: I am providing 3 reference photographs of the same woman from different angles. Use these photos as IDENTITY REFERENCE to generate a NEW completely original image of the same woman. Capture her likeness as accurately as possible: she is a Brazilian woman in her mid-30s, with dark wavy shoulder-length brown hair, warm brown eyes, fair-medium skin tone, defined cheekbones, a warm confident smile, and elegant features. The generated image must depict a woman that is recognizably the same person from the references. Do not copy the reference photos directly — generate a new scene, but the person depicted must look like the reference woman.`;

const NEGATIVE_PROMPT =
  "no symmetry, no plastic skin, no cartoon, no illustration, no AI artifacts, no harsh shadows, no stock photo aesthetic, no watermarks, no misspellings, no garbled text, no missing accents, no duplicated text, no repeated words";

// =====================================================
// 3 CENAS NOVAS COM IDENTIDADE DA CAMILA
// =====================================================
const posts = [
  {
    nome: "B1_camila_cafe_kinfolk",
    descricao: "Identity Ref — Camila em café Kinfolk premium",
    promptCena: `${IDENTITY_INSTRUCTION}

Generate a NEW editorial photograph in the style of Kinfolk magazine of the reference woman in this scene:

She is sitting at a warm honey-toned wooden cafe table in a sophisticated minimalist coffee shop, wearing an elegant cream-colored cashmere sweater, her hair styled naturally with soft waves, looking thoughtfully off-camera to the right with a serene expression. Her right hand is gently holding a small ceramic white espresso cup with delicate crema. On the table in front of her: an open leather-bound journal with handwritten cursive notes (unreadable script), a brass fountain pen, and a small dried eucalyptus branch in a glass vase. Behind her, soft warm Kinfolk-aesthetic cafe interior in dreamy out-of-focus bokeh: warm wood paneling, plants, and a window with golden hour light filtering through.

Shot on Hasselblad H6D with 80mm lens at f/2.8, ISO 320, color temperature 3500K warm golden tones. Subtle natural film grain. Soft natural diffused light from the right window creating gentle warm illumination on her face with flattering soft shadows. Color palette: warm honey wood, cream cashmere, soft beige, sage green, warm white ceramic. Composition: rule of thirds with the woman occupying the right two thirds of the frame, generous negative space on the upper-left for typography overlay.

On the upper-left negative space, add ONE translucent warm beige overlay rectangle color hex E8D9CC at 75 percent opacity with rounded corners 16 pixels. Inside this overlay, render large bold elegant serif typography in deep navy color hex 2B3A4D, the complete exact phrase appearing exactly once (no duplication): "Pensar é a primeira venda.". Below a thin gold accent line color hex D4A574, then smaller uppercase letter-spaced sans-serif navy text: "Envie ESTRATÉGIA no direct.".

Aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },

  {
    nome: "B2_camila_clinica_consultora",
    descricao: "Identity Ref — Camila consultora numa clínica moderna",
    promptCena: `${IDENTITY_INSTRUCTION}

Generate a NEW editorial photograph in the style of Kinfolk magazine of the reference woman in this scene:

She is standing confidently in a modern minimalist aesthetic clinic, wearing a crisp tailored white clinical coat over a soft cream blouse, her hair styled naturally with soft waves, holding an iPad tablet in her left hand at her side, looking directly at the camera with a calm confident professional smile. Behind her, the aesthetic clinic interior in dreamy out-of-focus bokeh: warm beige walls, a sophisticated treatment bed corner with linen drape barely visible far behind, a large statement green plant silhouette, soft pendant lighting, all heavily blurred so she remains the absolute focal point.

Shot on Hasselblad H6D with 85mm lens at f/2, ISO 320, color temperature 3500K warm golden tones. Subtle natural film grain. Soft natural diffused light from a large window on the left creating gentle warm illumination on her face. Color palette: warm honey wood, soft cream linen, sage green, warm white. Composition: rule of thirds with the woman occupying the right two thirds, generous negative space on the upper-left for typography overlay.

On the upper-left negative space, add ONE translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with rounded corners 16 pixels. Inside this overlay, render large bold elegant serif typography in deep navy color hex 2B3A4D, the complete exact phrase appearing exactly once (no duplication): "Sua clínica fatura. Mas cresce?". Below a thin gold accent line color hex D4A574, then smaller uppercase letter-spaced sans-serif navy text: "Envie DIAGNÓSTICO no direct.".

Aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },

  {
    nome: "B3_camila_founder_navy",
    descricao: "Identity Ref — Camila headshot founder fundo navy",
    promptCena: `${IDENTITY_INSTRUCTION}

Generate a NEW editorial founder portrait photograph in the style of premium magazine cover of the reference woman in this scene:

Studio headshot of her looking directly at the camera with a calm confident authoritative expression, slight knowing smile, wearing an elegant simple cream-colored silk blouse with a delicate gold chain necklace, her hair styled naturally with soft waves falling on her shoulders, photographed from chest up. The background is a clean deep navy solid color hex 2B3A4D with very subtle gradient darker at the edges.

Shot on Phase One IQ4 with 80mm portrait lens at f/2.8, ISO 200, color temperature 4500K with warm undertones, professional editorial studio lighting with one soft key light from the left at 45 degrees creating gentle modeling on her face and natural soft shadows, plus a subtle hair light from behind. Photorealistic skin texture with natural pores and natural skin character preserved (no plastic skin, no over-smoothing). Subtle film grain. Color palette: deep navy background, warm cream silk, warm skin tones, gold accent from necklace. Composition: rule of thirds with the subject offset slightly to the right, generous negative space on the upper-left for typography overlay.

On the upper-left negative space, add ONE translucent warm beige overlay rectangle color hex E8D9CC at 80 percent opacity with rounded corners 16 pixels. Inside this overlay, render large bold elegant serif typography in deep navy color hex 2B3A4D, the complete exact phrase appearing exactly once (no duplication): "Marketing para profissional da beleza.". Below a thin gold accent line color hex D4A574, then smaller uppercase letter-spaced sans-serif navy text: "Envie VALOR no direct.".

Aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
console.log(`\n🎨 Identity Reference: ${posts.length} cenas novas com Camila como ref via ${MODEL}`);
console.log(`📁 Saída: ${OUTPUT_DIR}\n`);

await fs.mkdir(OUTPUT_DIR, { recursive: true });

// Carrega as 3 fotos de referência em memória uma vez só
const referencias = [];
for (const fotoNome of FOTOS_REFERENCIA) {
  const fotoPath = path.join(FOTOS_DIR, fotoNome);
  const bytes = await fs.readFile(fotoPath);
  referencias.push({
    inlineData: { mimeType: "image/jpeg", data: bytes.toString("base64") },
  });
}
console.log(`📸 Carregadas ${referencias.length} fotos de referência: ${FOTOS_REFERENCIA.join(", ")}\n`);

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
      contents: [...referencias, { text: post.promptCena }],
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
    resultados.push({ post: post.nome, status: "ok", segundos });
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
