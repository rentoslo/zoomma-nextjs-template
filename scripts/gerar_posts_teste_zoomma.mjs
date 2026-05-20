// Geração de posts teste para Zoomma via Gemini 3 Pro Image (Nano Banana Pro)
// Modo: SÍNCRONO (preço cheio) — usar Batch como padrão nas próximas execuções
// Saída: C:\Users\rento\Downloads\teste

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
const OUTPUT_DIR = "C:\\Users\\rento\\Downloads\\teste";

const NEGATIVE_PROMPT =
  "no symmetry, no perfect geometry, no cartoon, no illustration, no overly saturated colors, no harsh shadows, no plastic textures, no AI artifacts, no stock photo aesthetic, no watermarks, no readable text errors";

// =====================================================
// DEFINIÇÃO DOS 12 POSTS TESTE
// =====================================================
const posts = [
  // ---------- TEMPLATE 01 — Tipográfico Bold ----------
  {
    nome: "01a_tipografico_navy",
    template: "T01 — Tipográfico Bold (fundo navy)",
    prompt: `Editorial poster design with deep navy blue background color hex 2B3A4D, large bold elegant serif typography (Playfair Display style) centered in pure white color, exact text reading: "Pare de improvisar. Comece a escalar.", thin horizontal gold accent line (hex D4A574) positioned below the text, generous negative space surrounding the typography, sophisticated minimalist premium poster aesthetic, no other graphic elements, no logos, no symbols, flawless typography rendering, aspect ratio 4:5, square format poster. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "01b_tipografico_offwhite",
    template: "T01 — Tipográfico Bold (fundo off-white)",
    prompt: `Editorial poster design with warm off-white background color hex F5F3EE, large bold elegant serif typography (Cormorant or Playfair Display style) centered in deep navy blue color hex 2B3A4D, exact text reading: "Marketing sem estratégia é desperdício de verba.", thin horizontal gold accent line (hex D4A574) positioned below the text, generous negative space, sophisticated minimalist premium aesthetic, no other graphic elements, no logos, no symbols, flawless typography rendering, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },

  // ---------- TEMPLATE 02 — Pessoa Genérica + Overlay ----------
  {
    nome: "02a_pessoa_homem_office",
    template: "T02 — Pessoa Real + Bloco (homem genérico)",
    prompt: `Editorial photography of a professional Brazilian man in his early 40s, short dark hair with subtle gray, wearing a navy crewneck wool sweater over a white t-shirt, sitting at a clean modern wooden desk in a sophisticated minimalist office space, looking confidently slightly off-camera to the right with a calm authoritative expression, soft natural diffused light entering from a large window on the left side casting gentle shadows, warm wood textures and minimal decor in the slightly blurred background, shot on Fujifilm GFX 50R with 63mm lens at f/2.8, ISO 400, color temperature 5500K with subtle warm undertones, subtle natural film grain, organic shadow play, sophisticated calm and trustworthy mood, rule of thirds composition with subject offset to lower-left third, generous negative space on the upper-right for typography overlay later, no text in image, photorealistic skin texture with natural imperfections, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "02b_pessoa_mulher_clinica",
    template: "T02 — Pessoa Real + Bloco (mulher genérica clínica)",
    prompt: `Editorial photography of a professional Brazilian woman in her mid 30s, dark wavy hair tied loosely, wearing an off-white tailored linen blazer, standing in a sophisticated aesthetic clinic reception area with warm beige walls and a single statement plant, looking directly at camera with a confident warm smile, soft golden hour natural light from large window at 3200K, premium clean aesthetic clinic interior visible softly out of focus behind her, shot on Fujifilm GFX 50R with 85mm lens at f/2, ISO 320, subtle natural film grain, organic depth of field with creamy bokeh, sophisticated welcoming professional mood, rule of thirds composition with subject offset to right side, generous negative space on the upper-left for typography overlay, no text in image, photorealistic skin texture with natural pores and slight imperfections, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },

  // ---------- TEMPLATE 03 — Cena Ambiental (sem pessoas) ----------
  {
    nome: "03a_cena_mesa_cafe",
    template: "T03 — Cena Ambiental (mesa de trabalho)",
    prompt: `Editorial photography of a minimalist warm wooden desk surface viewed from a slightly elevated angle, featuring an open leather-bound journal with handwritten notes partially visible (unreadable cursive script), a sleek black fountain pen resting on the page, a small ceramic cup of espresso with delicate steam rising, and a single dried eucalyptus branch in a clear glass vase, shot on Fujifilm GFX 50R with 63mm lens at f/4, ISO 400, available natural morning light from a window on the left at color temperature 5500K with soft cool undertones balanced by warm wood accents, color palette dominated by warm off-white hex F5F3EE and beige tones with subtle navy hex 2B3A4D contrast from the pen, rule of thirds composition with objects offset to lower-right third, generous negative space in the upper-left for typography overlay, subtle natural film grain, soft natural light falloff, slight depth of field with organic bokeh background, sophisticated calm editorial mood, no people, no readable text, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "03b_cena_janela_premium",
    template: "T03 — Cena Ambiental (janela com elementos premium)",
    prompt: `Editorial photography of a window seat nook in a sophisticated home office, featuring a soft cashmere throw folded neatly on a linen cushion, a folded business newspaper, a porcelain coffee cup with gentle steam rising, and a small brass paperweight catching warm light, all bathed in warm golden afternoon light at color temperature 3200K, shot on Fujifilm GFX 50R with 50mm lens at f/2.8, ISO 320, color palette of warm beige hex E8D9CC, cream hex F5F3EE, soft taupe brown, with one golden accent from the brass object, rule of thirds composition with elements in lower-right third, generous empty space in upper-left for typography overlay, subtle natural film grain, dreamy depth of field with creamy bokeh, organic light bloom from window with soft lens flare, premium editorial aesthetic, no people, no readable text, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },

  // ---------- TEMPLATE 06 — Prova Social / Mockup DM ----------
  {
    nome: "06_prova_social_mockup",
    template: "T06 — Prova Social (mockup de conversa)",
    prompt: `Editorial layout design with warm off-white background color hex F5F3EE with very subtle linen canvas texture at 15% opacity, centered iPhone-style messaging conversation mockup floating elegantly (just the speech bubble area without phone frame or bezels), two minimalist chat bubbles in slightly different soft gray tones with rounded corners, the bubbles should be clearly bubble shapes but contain NO readable text just abstract horizontal lines suggesting text, generous negative space above and below the mockup, single thin gold accent horizontal line hex D4A574 positioned subtly below the mockup, sophisticated minimal editorial design aesthetic, no logos, no readable text anywhere, no people, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },

  // ---------- CARROSSEL 5 SLIDES ----------
  // Tema: "3 erros que matam o crescimento da sua clínica"
  {
    nome: "carrossel_slide1_capa",
    template: "Carrossel Slide 1 — Capa (Template 01 navy)",
    prompt: `Editorial Instagram carousel cover slide design with deep navy blue background color hex 2B3A4D, large bold elegant serif typography (Playfair Display style) in pure white color, exact text reading on three lines: "3 erros que matam o crescimento da sua clínica", a small gold text in the lower right corner hex D4A574 reading "01/05" in a small clean sans-serif, generous negative space, sophisticated minimalist premium carousel cover aesthetic, no other graphic elements, no logos, no symbols, flawless typography rendering, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "carrossel_slide2_erro1",
    template: "Carrossel Slide 2 — Erro 1 (off-white)",
    prompt: `Editorial Instagram carousel content slide design with warm off-white background color hex F5F3EE, an enormous gold-colored numeral "01" in serif font hex D4A574 positioned in the upper-left occupying about 35% of the slide width, below the numeral in deep navy hex 2B3A4D bold serif headline reading "Você acha que o problema é o conteúdo.", and below that a smaller clean sans-serif text in dark gray reading "Mas é a sua estratégia comercial que não converte.", generous negative space on the right side, single thin gold horizontal line below the body text, sophisticated minimalist editorial aesthetic, no logos, flawless typography rendering, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "carrossel_slide3_erro2",
    template: "Carrossel Slide 3 — Erro 2 (off-white)",
    prompt: `Editorial Instagram carousel content slide design with warm off-white background color hex F5F3EE, an enormous gold-colored numeral "02" in serif font hex D4A574 positioned in the upper-left occupying about 35% of the slide width, below the numeral in deep navy hex 2B3A4D bold serif headline reading "Você posta todo dia.", and below that a smaller clean sans-serif text in dark gray reading "Mas posta sem direção. Movimento não é resultado.", generous negative space on the right side, single thin gold horizontal line below the body text, sophisticated minimalist editorial aesthetic, no logos, flawless typography rendering, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "carrossel_slide4_erro3",
    template: "Carrossel Slide 4 — Erro 3 (off-white)",
    prompt: `Editorial Instagram carousel content slide design with warm off-white background color hex F5F3EE, an enormous gold-colored numeral "03" in serif font hex D4A574 positioned in the upper-left occupying about 35% of the slide width, below the numeral in deep navy hex 2B3A4D bold serif headline reading "Você vende seu serviço.", and below that a smaller clean sans-serif text in dark gray reading "Mas não empacotou a solução. Por isso briga por preço.", generous negative space on the right side, single thin gold horizontal line below the body text, sophisticated minimalist editorial aesthetic, no logos, flawless typography rendering, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "carrossel_slide5_cta",
    template: "Carrossel Slide 5 — CTA (navy)",
    prompt: `Editorial Instagram carousel final CTA slide design with deep navy blue background color hex 2B3A4D, centered elegant serif typography in white reading on two lines: "Quer um diagnóstico estratégico?", below a clean rectangular CTA box with thin gold border hex D4A574 containing in bold gold sans-serif the single word: "ESTRATÉGIA", and below the box smaller white sans-serif text reading "Envie essa palavra no direct.", generous negative space, sophisticated minimalist premium aesthetic, no logos, no other elements, flawless typography rendering, aspect ratio 4:5. ${NEGATIVE_PROMPT}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 Gerando ${posts.length} posts teste via ${MODEL}`);
console.log(`📁 Saída: ${OUTPUT_DIR}\n`);

await fs.mkdir(OUTPUT_DIR, { recursive: true });

const inicio = Date.now();
const resultados = [];

for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  const numero = String(i + 1).padStart(2, "0");
  const arquivo = path.join(OUTPUT_DIR, `${numero}_${post.nome}.png`);
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

    // Extrai a primeira parte com inlineData (a imagem)
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
