// Regeração do Post 2 da Camila — texto havia duplicado
// Prompt simplificado para evitar bug de duplicação

import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
const OUTPUT = "C:\\Users\\rento\\Downloads\\teste\\camila_referencia\\02_camila_salao_lifestyle.png";
const FOTO = "G:\\Meu Drive\\ZOOMMA\\IDENTIDADE VISUAL\\fotos_referencia\\camila\\IMG_3773.jpg";

const prompt = `CRITICAL: preserve the exact identity, face, smile, hair, and white blouse of the woman from the input photograph with absolute fidelity. She must be unmistakably the same person. The vintage white styling chair and ornate vanity mirror she is sitting at should also remain in scene.

EDIT THIS PHOTOGRAPH for Instagram with the following changes:

1. Apply a soft warm Kinfolk-magazine color grading to the entire scene: warm honey tones, soft cream, golden afternoon light. Soften the background slightly with gentle depth of field. Salon vanity should feel more editorial luxurious.

2. Re-light with soft golden hour natural light from the right, color temperature 3500K warm amber. Subtle natural film grain. Dreamy contemplative atmosphere.

3. Recompose so that the woman is on the right two thirds, leaving the upper-left third as clean negative space for typography.

4. On the upper-left negative space add ONE single translucent warm beige overlay rectangle, color hex E8D9CC at 75 percent opacity, with soft rounded corners 16 pixels radius. Inside this overlay, render the following typography in deep navy color hex 2B3A4D, in bold elegant serif Playfair Display style. The text must appear EXACTLY ONCE, with no repetition or duplication of any word or line. The exact complete text is:

"O que aprendi atendendo no salão virou estratégia."

Render this as a single block of typography, broken naturally across 3 to 4 lines for visual balance. After the text block, render a thin horizontal gold accent line color hex D4A574, and below that in smaller clean sans-serif uppercase navy with letter-spacing, the exact phrase: "Envie ESTRATÉGIA no direct."

CRITICAL CHECK: do not render the phrase "O que aprendi" twice. The headline must appear only one single time inside the overlay.

5. Final aspect ratio 4:5.

6. IMPORTANT visual signature that must be present: a thin solid metallic gold vertical line color hex D4A574 exactly 1.5 pixels wide at 90 percent opacity, positioned at exactly 28 pixels from the left edge of the canvas, running uninterrupted from the very top edge to the very bottom edge of the image.

Negative prompt: no duplicated text, no repeated words, no symmetry, no plastic skin, no cartoon, no AI artifacts, no harsh shadows, no watermarks, no misspellings, no garbled text, no missing accents, no facial alteration.`;

console.log("Regerando Post 2 (sem duplicação de texto)...");
const t = Date.now();

const fotoBytes = await fs.readFile(FOTO);
const response = await ai.models.generateContent({
  model: "gemini-3-pro-image-preview",
  contents: [
    { inlineData: { mimeType: "image/jpeg", data: fotoBytes.toString("base64") } },
    { text: prompt },
  ],
  config: {
    responseModalities: ["IMAGE"],
    imageConfig: { aspectRatio: "4:5" },
  },
});

const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
if (!part) {
  console.error("Sem imagem na resposta");
  process.exit(1);
}

await fs.writeFile(OUTPUT, Buffer.from(part.inlineData.data, "base64"));
console.log(`✓ Regerado em ${((Date.now() - t) / 1000).toFixed(1)}s → ${OUTPUT}`);
