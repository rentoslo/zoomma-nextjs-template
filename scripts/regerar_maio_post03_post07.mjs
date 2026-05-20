// Regeração de 2 imagens da agenda Maio 2026:
// - post03_qua20_carrossel_slide1_capa: bug de texto duplicado ("Sua DM Sua DM enche")
// - post07_qua27_reel_thumb: headline suavizada + remover marca "Hooke" do equipamento
// Sobrescreve os arquivos existentes.

import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
const MODEL = "gemini-3-pro-image-preview";
const OUTPUT_DIR = "G:\\Meu Drive\\ZOOMMA\\AGENDA EDITORIAL\\2026-05_MAIO\\imagens";
const FOTOS_DIR = "G:\\Meu Drive\\ZOOMMA\\IDENTIDADE VISUAL\\fotos_referencia";

const ASSINATURA = `IMPORTANT visual signature: a thin solid metallic gold vertical line color hex D4A574 exactly 1.5 pixels wide at 90 percent opacity, positioned at exactly 28 pixels from the left edge of the canvas, running uninterrupted from top to bottom.`;

const NEG = `no symmetry, no plastic skin, no airbrushed skin, no AI artifacts, no CGI, no harsh shadows, no commercial glow, no garbled text, no missing accents, no duplicated text, no repeated words, no watermarks, no readable brand names or logos on equipment, no commercial product branding`;

const posts = [
  // Post 3 slide 1 — bug corrigido
  {
    nome: "post03_qua20_carrossel_slide1_capa",
    desc: "Post 3 Slide 1 capa (REGERAR — bug texto)",
    prompt: `Editorial Instagram carousel cover slide design. Full bleed deep navy blue background color hex 2B3A4D.

Render the following exact headline in large bold Playfair Display serif typography in pure white color, centered on the canvas. The text must appear EXACTLY ONCE with no duplication of any word. Render naturally broken across 2 lines:

"Sua DM enche. Sua agenda não."

CRITICAL: do NOT repeat "Sua DM" twice. The phrase "Sua DM" must appear only one single time. Render the headline as one complete clean block.

Below the headline, render a thin horizontal gold accent line color hex D4A574 about 80 pixels wide.

Below the line, render in small italic sans-serif soft gold the EXACT phrase "O problema não é tráfego. É processo.".

In the lower right corner, render in small clean sans-serif soft gold the exact text "01/04".

At the very bottom centered, render in tiny letter-spaced uppercase gold the exact word "ZOOMMA".

Generous negative space, sophisticated minimalist premium poster aesthetic, no logos, no other graphic elements. Flawless legible typography with perfect Portuguese accents on "não".

${ASSINATURA}

Aspect ratio 4:5.

${NEG}`,
  },

  // Post 7 — headline suavizada + remover marca Hooke
  {
    nome: "post07_qua27_reel_thumb",
    desc: "Post 7 Reel Camila (REGERAR — suavizar + sem marca Hooke)",
    fotoBase: { pasta: "camila", arquivo: "IMG_3835.jpg" },
    prompt: `CRITICAL PRESERVATION: keep the woman from the input photograph EXACTLY as she is — preserve with absolute fidelity her face, expression, warm smile, hair, eyes, the black professional uniform, her standing posture, hand position, and pose. Do not alter her identity, body or pose. She must be unmistakably the same person.

EDIT the following:

1. SCENE: keep the aesthetic clinic/treatment room ambient from the original photograph. Elevate to sophisticated Kinfolk-magazine aesthetic — warm undertones on walls, refined editorial mood. Keep the crystal chandelier visible. Soften the curtain with golden hour light.

2. EQUIPMENT — VERY IMPORTANT: she is holding aesthetic equipment in the original photo. Keep her hands and the equipment shape, BUT make sure the equipment does NOT show any visible brand name, logo, model number, or readable text. The equipment should look like a generic neutral premium aesthetic device — completely unbranded. If there is any brand name "Hooke" or any other readable text visible on the equipment in the reference, REMOVE it completely. The equipment is just a clean unbranded shape.

3. COLOR GRADING: apply warm Kinfolk magazine grading — warm honey tones, soft cream highlights, color temperature 3800K with warm amber. Subtle natural Kodak Portra 400 film grain. Natural skin tone preservation on her face.

4. OVERLAY: in the upper-left negative space, add ONE translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. Inside this overlay, render in deep navy hex 2B3A4D using bold elegant Playfair Display serif typography, EXACT text appearing ONLY ONCE no duplication, naturally broken across 2 lines:

"Não é que você seja caro. É que o valor não tá claro."

Below the headline a thin horizontal gold accent line hex D4A574. Below in smaller sans-serif italic dark gray EXACT text "E eu vou te explicar a diferença.". At bottom in small clean sans-serif uppercase navy with letter-spacing EXACT text "Envie VALOR no direct.". Typography perfectly legible with all Portuguese accents intact.

5. ${ASSINATURA}

6. Aspect ratio 4:5.

${NEG}`,
  },
];

console.log(`\n🔄 Regerando ${posts.length} imagens da agenda Maio 2026`);
console.log(`📁 Sobrescrevendo em: ${OUTPUT_DIR}\n`);

const inicio = Date.now();
for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  const arquivo = path.join(OUTPUT_DIR, `${post.nome}.png`);
  const t = Date.now();
  process.stdout.write(`[${i + 1}/${posts.length}] ${post.desc}... `);

  try {
    let contents;
    if (post.fotoBase) {
      const fotoPath = path.join(FOTOS_DIR, post.fotoBase.pasta, post.fotoBase.arquivo);
      const fotoBytes = await fs.readFile(fotoPath);
      contents = [
        { inlineData: { mimeType: "image/jpeg", data: fotoBytes.toString("base64") } },
        { text: post.prompt },
      ];
    } else {
      contents = post.prompt;
    }

    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "4:5" } },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData?.data);
    if (!imagePart) throw new Error("Sem imagem na resposta");

    await fs.writeFile(arquivo, Buffer.from(imagePart.inlineData.data, "base64"));
    console.log(`✓ (${((Date.now() - t) / 1000).toFixed(1)}s)`);
  } catch (err) {
    console.log(`✗ ERRO: ${err.message}`);
  }
}

console.log(`\n⏱  Total: ${((Date.now() - inicio) / 1000).toFixed(1)}s\n`);
