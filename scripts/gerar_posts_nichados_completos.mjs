// Geração de posts NICHADOS COMPLETOS para Zoomma — texto integrado na imagem
// Modo: SÍNCRONO (preview rápido pra validar conceito)
// Saída: C:\Users\rento\Downloads\teste\nichados\

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
const OUTPUT_DIR = "C:\\Users\\rento\\Downloads\\teste\\nichados";

const NEGATIVE_PROMPT =
  "no symmetry, no perfect geometry, no cartoon, no illustration, no overly saturated colors, no harsh shadows, no plastic textures, no AI artifacts, no stock photo aesthetic, no watermarks, no misspellings, no garbled text, no extra letters, no missing accents, no Latin abbreviations";

// =====================================================
// 6 POSTS COMPLETOS COM TEXTO NICHADO
// =====================================================
const posts = [
  // ========== T01 NICHADO — TIPOGRÁFICO ==========
  {
    nome: "01_t01_navy_clinica",
    template: "T01 Nichado — Navy / 'Sua clínica não cresce no improviso'",
    prompt: `Editorial Instagram poster design, full bleed deep navy blue background hex 2B3A4D, large bold elegant serif typography in pure white centered on the canvas spanning three lines with line break, EXACT text reading: line 1 "Sua clínica" line 2 "de estética não cresce" line 3 "no improviso.", below the headline a single thin horizontal gold accent line color hex D4A574 about 80 pixels wide, far below at the bottom centered in small clean sans-serif white text the exact phrase "Envie ESTRATÉGIA no direct.", generous negative space between elements, sophisticated minimalist premium poster aesthetic, no other graphic elements, no logos, no symbols, flawless legible typography rendering with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "02_t01_offwhite_harmonizacao",
    template: "T01 Nichado — Off-white / 'Marketing não vende harmonização'",
    prompt: `Editorial Instagram poster design, full bleed warm off-white background hex F5F3EE, large bold elegant serif typography in deep navy blue hex 2B3A4D centered on the canvas spanning three lines with line break, EXACT text reading: line 1 "Marketing não" line 2 "vende harmonização." line 3 "Estratégia sim.", below the headline a single thin horizontal gold accent line color hex D4A574 about 80 pixels wide, far below at the bottom centered in small clean sans-serif dark gray text the exact phrase "Envie VALOR no direct.", generous negative space between elements, sophisticated minimalist premium poster aesthetic, no other graphic elements, no logos, no symbols, flawless legible typography rendering with perfect Portuguese accents and special characters, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },

  // ========== T03 NICHADO COM OBJETO + TEXTO ==========
  {
    nome: "03_t03_mesa_skincare",
    template: "T03 Nichado — Mesa com frasco de skincare + texto sobreposto",
    prompt: `Editorial photography overhead view of a minimalist warm wooden desk surface, featuring an open leather-bound journal with handwritten cursive notes partially visible (unreadable script), a sleek black fountain pen resting on the page, a small premium amber glass skincare bottle without visible label or brand markings positioned to the side, and a single dried eucalyptus branch in a clear glass vase, shot on Fujifilm GFX 50R with 63mm lens at f/4, ISO 400, available natural morning light from a window on the left at color temperature 5500K, color palette dominated by warm off-white hex F5F3EE and beige tones, composition with objects in the lower-right two thirds of the frame leaving the upper-left third clean and empty, sophisticated calm editorial mood, subtle natural film grain, no people. Overlaid on the upper-left negative space, large bold serif typography in deep navy color hex 2B3A4D reading on two lines EXACT text "Antes de mais um lançamento," next line "faça o diagnóstico.", below the headline in smaller clean sans-serif dark gray text the EXACT phrase "Envie DIAGNÓSTICO no direct.", flawless legible typography rendering with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "04_t03_bancada_estetica",
    template: "T03 Nichado — Bancada com objetos de estética + texto",
    prompt: `Editorial photography close-up overhead view of an organized marble surface in a sophisticated home office, featuring an open notebook with a handwritten financial calculation in cursive (unreadable script with arrow symbols), a polished stainless steel professional cosmetic spatula resting next to the notebook, a small ceramic cup of espresso, and a folded printed business chart partially visible, shot on Fujifilm GFX 50R with 63mm lens at f/4, ISO 320, soft natural light from a window on the left at color temperature 5500K with warm undertones, color palette warm off-white hex F5F3EE and beige with subtle navy accents, composition with objects offset to lower-right leaving upper-left empty negative space, sophisticated editorial mood, no people. Overlaid on the upper-left, large bold serif typography in deep navy color hex 2B3A4D reading on two lines EXACT text "Você não tem problema" next line "de fluxo.", below in smaller serif italic dark gray EXACT text "Tem problema de conversão.", at the bottom in small clean sans-serif uppercase dark gray EXACT text "Envie CONVERTER no direct.", flawless legible typography rendering with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },

  // ========== T03 NICHADO COM CENÁRIO DE CLÍNICA AO FUNDO ==========
  {
    nome: "05_t03_clinica_fundo",
    template: "T03 Nichado — Recepção de clínica desfocada ao fundo + texto",
    prompt: `Editorial photography of a foreground featuring a small ceramic vase with a single dried branch and a folded printed report on a clean light wood surface, with a sophisticated aesthetic clinic reception completely out of focus in the soft creamy bokeh background showing hints of a treatment bed corner, soft pendant lighting and a large green plant silhouette, shot on Fujifilm GFX 50R with 85mm lens at f/2, ISO 320, color temperature 3200K warm golden hour light, color palette warm beige hex E8D9CC and off-white hex F5F3EE with creamy soft brown bokeh, composition with foreground objects in lower-right third leaving upper-left negative space, sophisticated calm professional editorial mood, subtle natural film grain, dreamy organic depth of field, no people visible. Overlaid in the upper-left negative space, large bold elegant serif typography in deep navy color hex 2B3A4D reading on two lines EXACT text "Sua clínica fatura." next line "Mas cresce?", below in smaller clean sans-serif dark gray uppercase EXACT text "Envie ESTRATÉGIA no direct.", flawless legible typography rendering with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },

  // ========== T02 NICHADO — PESSOA EM CLÍNICA ==========
  {
    nome: "06_t02_mulher_recepcao",
    template: "T02 Nichado — Mulher profissional em recepção de clínica + overlay",
    prompt: `Editorial photography of a professional Brazilian woman in her mid 30s, dark wavy hair loosely tied back, wearing a soft cream-colored tailored linen blazer, standing confidently in the elegant reception area of a sophisticated aesthetic clinic, warm beige walls and a single statement green plant softly visible in the background, a treatment bed corner barely visible far behind her completely out of focus, looking directly at camera with calm authoritative warm smile, soft golden hour natural light at color temperature 3200K from large window, shot on Fujifilm GFX 50R with 85mm lens at f/2, ISO 320, subtle natural film grain, organic creamy bokeh, sophisticated welcoming professional mood, photorealistic skin texture with natural pores and natural imperfections, composition with subject offset to the right half of the frame, the left half of the frame should be covered by a translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. On top of this overlay on the left half, large bold elegant serif typography in deep navy hex 2B3A4D reading on three lines EXACT text "Empresários" next line "da beleza não" next line "precisam de mais marketing.", below in smaller serif italic navy EXACT text "Precisam de gestão.", at the bottom in small uppercase clean sans-serif navy EXACT text "Envie CRESCER no direct.", flawless legible typography rendering with perfect Portuguese accents, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 Gerando ${posts.length} posts NICHADOS completos via ${MODEL}`);
console.log(`📁 Saída: ${OUTPUT_DIR}\n`);

await fs.mkdir(OUTPUT_DIR, { recursive: true });

const inicio = Date.now();
const resultados = [];

for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  const numero = String(i + 1).padStart(2, "0");
  const arquivo = path.join(OUTPUT_DIR, `${post.nome}.png`);
  const tInicio = Date.now();

  process.stdout.write(`[${numero}/${posts.length}] ${post.template}... `);

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
        `Resposta sem imagem. Parts recebidos: ${JSON.stringify(
          parts.map((p) => Object.keys(p))
        )}`
      );
    }

    const buffer = Buffer.from(imagePart.inlineData.data, "base64");
    await fs.writeFile(arquivo, buffer);

    const segundos = ((Date.now() - tInicio) / 1000).toFixed(1);
    console.log(`✓ (${segundos}s) → ${path.basename(arquivo)}`);
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
