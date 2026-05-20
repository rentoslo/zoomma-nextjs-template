// MODO 1 — Image-to-image preservando a pessoa INTEIRA (rosto + corpo + roupa + pose)
// Só edita: fundo, iluminação, color grading, overlay de texto, assinatura visual
// 4 imagens: 2 Renato + 2 Camila

import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const API_KEY = process.env.GOOGLE_AI_API_KEY;
const MODEL = "gemini-3-pro-image-preview";
const OUTPUT_DIR = "C:\\Users\\rento\\Downloads\\teste\\modo1_renato_camila";
const FOTOS_BASE_DIR = "G:\\Meu Drive\\ZOOMMA\\IDENTIDADE VISUAL\\fotos_referencia";

const ASSINATURA_VISUAL = `IMPORTANT: a thin solid metallic gold vertical line color hex D4A574 exactly 1.5 pixels wide at 90 percent opacity, positioned at exactly 28 pixels from the left edge of the canvas, running uninterrupted from the very top edge to the very bottom edge of the image. This is the official Zoomma brand signature.`;

const NEGATIVE_PROMPT =
  "no facial alteration, no different person, no plastic skin, no airbrushed skin, no skin smoothing, no beauty filter, no AI face artifacts, no facial reshaping, no CGI, no 3D render, no over-saturation, no HDR, no commercial glow, no harsh shadows, no symmetry, no garbled text, no missing accents, no duplicated text, no repeated words, no watermarks";

const posts = [
  // ---------- POST 1: Renato (em pé) — trocar fundo de corredor para escritório Kinfolk ----------
  {
    nome: "01_renato_corredor_para_escritorio",
    descricao: "Renato em pé — trocar corredor por escritório Kinfolk + overlay",
    pasta: "renato",
    fotoBase: "_MG_3700.jpg",
    prompt: `CRITICAL PRESERVATION: keep the man from the input photograph EXACTLY as he is — preserve with absolute fidelity his face, expression, smile, hair, eyes, the black polo shirt, his entire body proportions, posture, hand position, and pose. Do not alter his identity, his clothing, his body or any anatomical feature. He must be unmistakably the same person in the same pose wearing the same outfit.

EDIT ONLY the following:

1. BACKGROUND: replace the original neutral corridor background with a sophisticated minimalist Kinfolk-magazine-style office interior — warm honey wood paneling on the wall behind him, soft natural daylight from a large floor-to-ceiling window on the left, a single fiddle-leaf fig plant in a terracotta pot in the deep background, a blurred wooden desk with papers far behind him. The new background should be in soft depth-of-field (slight bokeh) so that he remains the absolute focal point. Maintain natural perspective and scale matching his original standing position.

2. COLOR GRADING: apply warm Kinfolk magazine color grading to the overall image — warm honey tones, soft cream highlights, golden afternoon undertones, color temperature shifted to approximately 4500K with warm amber. Add subtle natural film grain reminiscent of Kodak Portra 400 film. The light on him should now appear to come softly from the left window, with natural skin tone preservation.

3. OVERLAY: in the upper-left negative space of the new composition, add ONE translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. Inside this overlay, render in deep navy color hex 2B3A4D using bold elegant Playfair Display serif typography, the EXACT text appearing only ONCE, no duplication: "A Zoomma não vende marketing. Constrói crescimento.". Below the headline render a thin horizontal gold accent line color hex D4A574. Below that line render in smaller clean sans-serif uppercase navy with letter-spacing the EXACT phrase: "Envie CRESCER no direct.". Typography must be perfectly legible with all Portuguese accents intact (notice the ã in "não" and the ó in "Constrói").

4. ${ASSINATURA_VISUAL}

5. Final aspect ratio 4:5.

${NEGATIVE_PROMPT}`,
  },

  // ---------- POST 2: Renato (sentado mesa laptop) — manter cenário, aplicar Kinfolk + overlay ----------
  {
    nome: "02_renato_homeoffice_kinfolk",
    descricao: "Renato no home office — manter cena, aplicar Kinfolk + overlay",
    pasta: "renato",
    fotoBase: "_MG_3733.jpg",
    prompt: `CRITICAL PRESERVATION: keep the man from the input photograph EXACTLY as he is — preserve with absolute fidelity his face, expression, calm confident smile, hair, eyes, the black polo shirt, his entire body, posture sitting at the desk, his hand on the laptop, the laptop itself, and the desk setup. Do not alter his identity, clothing, body or pose. He must be unmistakably the same person in the exact same position.

EDIT ONLY the following:

1. SCENE REFINEMENT: keep the home office scene from the original photograph but elevate it to a more sophisticated Kinfolk-magazine aesthetic — soften the background slightly with gentle depth-of-field, refine the desk surroundings with subtle warm wood tones, the orchid plant and personal touches should look more elegant and editorial. Do not remove the laptop or desk — keep all the original work-environment elements.

2. COLOR GRADING: apply warm Kinfolk magazine color grading — warm honey tones, soft cream highlights, golden afternoon undertones, color temperature shifted to approximately 4500K with warm amber. Add subtle natural film grain reminiscent of Kodak Portra 400 film. The lighting becomes softer and more dreamy, with natural skin tone preservation on his face.

3. OVERLAY: in the upper-left negative space, add ONE translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. Inside this overlay, render in deep navy color hex 2B3A4D using bold elegant Playfair Display serif typography, the EXACT text appearing only ONCE, no duplication: "Estratégia é o que separa quem cresce de quem só posta.". Below the headline render a thin horizontal gold accent line color hex D4A574. Below that line render in smaller clean sans-serif uppercase navy with letter-spacing the EXACT phrase: "Envie ESTRATÉGIA no direct.". Typography must be perfectly legible with all Portuguese accents intact (notice the é in "estratégia" and ó in "só").

4. ${ASSINATURA_VISUAL}

5. Final aspect ratio 4:5 — crop/recompose if needed to fit portrait orientation while keeping him as the focal point.

${NEGATIVE_PROMPT}`,
  },

  // ---------- POST 3: Camila (jaleco bordô na clínica) — manter cena, suavizar/Kinfolk + overlay ----------
  {
    nome: "03_camila_clinica_autoridade",
    descricao: "Camila no jaleco em clínica — manter cena, suavizar + overlay",
    pasta: "camila",
    fotoBase: "IMG_3860.jpg",
    prompt: `CRITICAL PRESERVATION: keep the woman from the input photograph EXACTLY as she is — preserve with absolute fidelity her face, expression, warm smile, hair, eyes, the bordeaux/burgundy clinical coat she is wearing, her entire body, standing posture, and pose. Do not alter her identity, clothing, body or pose. She must be unmistakably the same person in the same clinical coat in the same standing position.

EDIT ONLY the following:

1. SCENE REFINEMENT: keep the aesthetic clinic environment from the original photograph but elevate it to a sophisticated Kinfolk-magazine aesthetic — soften the aesthetic equipment in the background with gentle depth-of-field so it becomes elegant ambient context instead of industrial focal point. Soften the visible equipment edges. The curtains and wall textures should look more refined and editorial. Add a hint of a single green plant in the deep blurred background if there is space. Keep the bordeaux clinical coat she is wearing exactly as it is.

2. COLOR GRADING: apply warm Kinfolk magazine color grading — warm honey tones, soft cream highlights, golden afternoon undertones, color temperature approximately 3800K with warm amber. Add subtle natural film grain reminiscent of Kodak Portra 400 film. The lighting becomes softer and more dreamy, but natural skin tone preservation is critical on her face.

3. OVERLAY: in the upper-left negative space (recompose if needed to create clean space for overlay), add ONE translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. Inside this overlay, render in deep navy color hex 2B3A4D using bold elegant Playfair Display serif typography, the EXACT text appearing only ONCE, no duplication: "Eu sou profissional da beleza. E vou te contar o que ninguém te conta.". Below the headline render a thin horizontal gold accent line color hex D4A574. Below that line render in smaller clean sans-serif uppercase navy with letter-spacing the EXACT phrase: "Envie VALOR no direct.". Typography must be perfectly legible with all Portuguese accents intact (notice the é in "é" and the é in "ninguém").

4. ${ASSINATURA_VISUAL}

5. Final aspect ratio 4:5.

${NEGATIVE_PROMPT}`,
  },

  // ---------- POST 4: Camila (penteadeira salão) — manter cena, Kinfolk + overlay ----------
  {
    nome: "04_camila_salao_lifestyle",
    descricao: "Camila na penteadeira do salão — manter cena, Kinfolk + overlay",
    pasta: "camila",
    fotoBase: "IMG_3773.jpg",
    prompt: `CRITICAL PRESERVATION: keep the woman from the input photograph EXACTLY as she is — preserve with absolute fidelity her face, expression, warm smile, hair, eyes, the white blouse she is wearing, her entire body, sitting posture on the vintage white chair next to the ornate vanity mirror, hand resting on the vanity, and pose. Do not alter her identity, clothing, body, hair, jewelry, or pose. She must be unmistakably the same person in the same outfit sitting in the same position at the same vanity.

EDIT ONLY the following:

1. SCENE REFINEMENT: keep the salon/vanity environment from the original photograph but elevate it to a sophisticated Kinfolk-magazine aesthetic — soften the background details with gentle depth-of-field, refine the salon vanity to feel more editorial and luxurious. Keep the ornate mirror and vintage white chair as they are. The salon space should feel more like a refined editorial setting rather than a generic salon.

2. COLOR GRADING: apply warm Kinfolk magazine color grading — warm honey tones, soft cream highlights, golden afternoon light streaming in, color temperature approximately 3500K with warm amber tones. Add subtle natural film grain reminiscent of Kodak Portra 400 film. Dreamy contemplative atmosphere, with natural skin tone preservation on her face.

3. OVERLAY: in the upper-left negative space (recompose if needed to create clean space for overlay), add ONE translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. Inside this overlay, render in deep navy color hex 2B3A4D using bold elegant Playfair Display serif typography, the EXACT text appearing only ONCE, no duplication: "O que aprendi atendendo no salão virou estratégia.". Below the headline render a thin horizontal gold accent line color hex D4A574. Below that line render in smaller clean sans-serif uppercase navy with letter-spacing the EXACT phrase: "Envie ESTRATÉGIA no direct.". Typography must be perfectly legible with all Portuguese accents intact (notice the ã in "salão" and é in "estratégia").

4. ${ASSINATURA_VISUAL}

5. Final aspect ratio 4:5.

${NEGATIVE_PROMPT}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 Modo 1 (preservar pessoa inteira): ${posts.length} imagens via ${MODEL}`);
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
    const fotoPath = path.join(FOTOS_BASE_DIR, post.pasta, post.fotoBase);
    const fotoBytes = await fs.readFile(fotoPath);

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        { inlineData: { mimeType: "image/jpeg", data: fotoBytes.toString("base64") } },
        { text: post.prompt },
      ],
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: "4:5" },
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData?.data);
    if (!imagePart) throw new Error("Resposta sem imagem");

    await fs.writeFile(arquivo, Buffer.from(imagePart.inlineData.data, "base64"));

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
