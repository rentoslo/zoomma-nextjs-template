// Geração de imagens demonstrativas dos UPGRADES DE DESIGN da Zoomma
// Todas com assinatura visual aprovada: LINHA DOURADA VERTICAL 3px LATERAL ESQUERDA
// 9 moods (Aesop/Kinfolk/NYT × 3) + 3 cor-selo + 3 posts respiro = 15 imagens
// Saída: C:\Users\rento\Downloads\teste\upgrades_design\

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
const OUTPUT_DIR = "C:\\Users\\rento\\Downloads\\teste\\upgrades_design";

const NEGATIVE_PROMPT =
  "no symmetry, no perfect geometry, no cartoon, no illustration, no overly saturated colors, no harsh shadows, no plastic textures, no AI artifacts, no stock photo aesthetic, no watermarks, no misspellings, no garbled text, no extra letters, no missing accents";

// ASSINATURA VISUAL: linha dourada vertical 3px na lateral esquerda (todas as imagens)
const ASSINATURA_VISUAL = `IMPORTANT visual signature: a thin solid metallic gold vertical line color hex D4A574 exactly 3 pixels wide running from the very top edge to the very bottom edge of the canvas, positioned at exactly 24 pixels from the left edge, this line must be present and clearly visible without interruption.`;

// =====================================================
// 15 IMAGENS DEMONSTRATIVAS
// =====================================================
const posts = [
  // ========== MOOD A — AESOP/HERMÈS (mármore, sombras dramáticas) ==========
  {
    nome: "mood_aesop_01_skincare",
    descricao: "MOOD AESOP — Frasco skincare em mármore com sombra dura",
    prompt: `Editorial product photography in the style of Aesop and Hermès brand campaigns, single premium amber glass apothecary skincare bottle without any visible label or branding standing alone on a polished white marble surface with subtle gray veining, dramatic single direction hard lateral lighting from the upper-left creating a long crisp sharp-edged shadow stretching diagonally across the marble, the rest of the scene in deep contrasted shadow, the bottle is the only object in the entire frame, shot on Phase One IQ4 with 80mm macro lens at f/5.6, ISO 100, color temperature 4000K with cool neutral tones, color palette of cool white marble, deep charcoal shadow, and warm amber from the bottle, generous negative space everywhere, sophisticated luxury brand campaign aesthetic, museum quality minimalism, subtle natural film grain, aspect ratio 4:5, no people, no text. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "mood_aesop_02_couro",
    descricao: "MOOD AESOP — Livro encadernado em couro + frasco em superfície polida",
    prompt: `Editorial product photography in the style of Aesop and Hermès brand campaigns, a single leather-bound book lying flat on a dark polished walnut wood surface with a small antique brass paperweight resting on top, dramatic single direction hard side lighting from the right creating bold defined shadows, deep moody atmosphere with strong chiaroscuro, the leather is rich tobacco brown with visible texture and aging, shot on Phase One IQ4 with 80mm macro lens at f/5.6, ISO 100, color temperature 3200K warm tungsten tones, color palette of dark walnut brown, rich tobacco leather, antique brass gold, and deep charcoal shadow, generous negative space, sophisticated luxury campaign aesthetic, museum quality minimalism with high contrast, subtle natural film grain, aspect ratio 4:5, no people, no text. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "mood_aesop_03_petalas",
    descricao: "MOOD AESOP — Pinça metálica e pétalas em mármore",
    prompt: `Editorial product photography in the style of Aesop and Hermès brand campaigns, a single polished stainless steel tweezers cosmetic tool laying flat at a slight angle on cool white marble surface with subtle veining, three single dried rose petals arranged elegantly nearby with intentional asymmetric placement, dramatic top-down lighting from above with hard defined shadow, minimal and museum-like composition, shot on Phase One IQ4 with 80mm macro lens at f/8, ISO 100, color temperature 4500K cool daylight, color palette of cool white marble, soft pink dried petals, polished silver metal, and crisp shadow gray, generous negative space, sophisticated luxury beauty campaign aesthetic, subtle film grain, aspect ratio 4:5, no people, no text. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },

  // ========== MOOD B — KINFOLK (overhead, luz natural, terroso quente) ==========
  {
    nome: "mood_kinfolk_01_mesa",
    descricao: "MOOD KINFOLK — Overhead mesa madeira com caderno, café, eucalipto",
    prompt: `Editorial overhead flat lay photography in the style of Kinfolk magazine, top-down view of warm honey-toned reclaimed wood table surface, featuring an open leather-bound journal with handwritten cursive notes (unreadable script), a small white ceramic cup of espresso with delicate crema, a single sprig of dried eucalyptus, a brass pen, and a folded linen napkin in oatmeal color, all arranged with intentional negative space and asymmetric Japanese-influenced composition, soft diffused natural morning light from a single window creating gentle long shadows, shot on Hasselblad H6D with 80mm lens at f/4, ISO 200, color temperature 5000K with warm undertones, color palette of warm honey wood, soft cream linen, sage green from eucalyptus, and warm white ceramic, sophisticated calm minimalist editorial mood, subtle natural film grain, aspect ratio 4:5, no people, no text. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "mood_kinfolk_02_linho",
    descricao: "MOOD KINFOLK — Bancada de linho com chá, pão e flores secas",
    prompt: `Editorial still life photography in the style of Kinfolk magazine, three quarter angle view of a rustic stoneware ceramic teapot in warm sand color with steam gently rising, a small artisan ceramic cup matching the teapot, a torn piece of rustic sourdough bread on a simple linen cloth, and a small bunch of dried wheat stalks arranged casually nearby, all positioned on a worn ivory linen tablecloth covering a wooden surface, soft diffused natural afternoon light from a side window creating gentle warm illumination, shot on Hasselblad H6D with 80mm lens at f/3.5, ISO 250, color temperature 4500K with golden warm tones, color palette of sand beige, warm ivory linen, wheat gold, and ceramic warm white, asymmetric intentional composition with generous negative space, sophisticated slow-living editorial mood, subtle natural film grain, aspect ratio 4:5, no people, no text. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "mood_kinfolk_03_janela",
    descricao: "MOOD KINFOLK — Janela com luz quente, livro aberto, xícara",
    prompt: `Editorial lifestyle photography in the style of Kinfolk magazine, a peaceful window nook scene with a folded oatmeal linen throw, an open hardcover book lying face down on linen cushion, a white ceramic mug with steam rising softly, and a small terra cotta pot with a single eucalyptus branch on the windowsill, soft golden hour late afternoon natural light streaming in from the left creating dreamy warm atmosphere with gentle lens haze, shot on Hasselblad H6D with 50mm lens at f/2.8, ISO 320, color temperature 3200K warm amber tones, color palette of warm honey light, soft oatmeal linen, sage eucalyptus green, and warm white ceramic, sophisticated calm contemplative mood, dreamy depth of field, subtle natural film grain with organic light bloom, aspect ratio 4:5, no people, no text. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },

  // ========== MOOD C — NYT MAGAZINE (natureza morta poética, luz lateral dramática) ==========
  {
    nome: "mood_nyt_01_objeto_unico",
    descricao: "MOOD NYT — Composição com objeto único iluminado lateralmente",
    prompt: `Editorial conceptual still life photography in the style of The New York Times Magazine, a single antique brass compass laying flat at a slight angle on a slate gray textured concrete surface, dramatic hard side lighting from the right creating sharp angular shadow stretching across the surface, mysterious moody atmosphere with deep contrast, the compass is the conceptual focal point representing direction and strategy, shot on Phase One IQ4 with 100mm macro lens at f/8, ISO 100, color temperature 4500K neutral with subtle cool blue undertones, color palette of cool slate gray concrete, deep shadow charcoal, antique brass warm gold, and a single highlight of warm light, generous negative space surrounding the object, sophisticated editorial conceptual photography aesthetic, museum quality, subtle natural film grain, aspect ratio 4:5, no people, no text. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "mood_nyt_02_livros",
    descricao: "MOOD NYT — Livros empilhados + óculos + xícara em luz dramática",
    prompt: `Editorial conceptual still life photography in the style of The New York Times Magazine, a small stack of three vintage hardcover books with weathered spines, a pair of round wire-rim reading glasses resting on top of the stack, and a small white espresso cup on the side, arranged on a dark walnut wood surface, dramatic single direction side lighting from the left creating bold defined shadows and strong chiaroscuro, deep moody atmosphere with shadows occupying half the frame, shot on Phase One IQ4 with 80mm lens at f/5.6, ISO 100, color temperature 3500K warm tungsten, color palette of dark walnut, faded book linen tones (deep blue, oxblood red, sage), aged brass from glasses, and warm shadow tones, intentional editorial composition with generous shadow negative space, sophisticated conceptual editorial aesthetic, museum-quality lighting, subtle natural film grain, aspect ratio 4:5, no people, no text. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "mood_nyt_03_ferramentas",
    descricao: "MOOD NYT — Pinça + recibo + caneta sobre mesa escura",
    prompt: `Editorial conceptual still life photography in the style of The New York Times Magazine, a polished stainless steel cosmetic spatula tool laying at a precise angle, a single folded vintage paper receipt with handwritten numbers partially visible (unreadable script), and a black fountain pen with brass clip arranged on a dark slate gray surface, dramatic side lighting from the right creating sharp angular shadows reaching across the composition, deep moody contemplative atmosphere with strong chiaroscuro, shot on Phase One IQ4 with 100mm macro lens at f/5.6, ISO 100, color temperature 4000K with neutral cool tones, color palette of dark slate gray, aged paper cream, polished silver metal, deep shadow black, and subtle brass warm accent, generous shadow negative space, sophisticated conceptual editorial aesthetic, museum quality lighting, subtle natural film grain, aspect ratio 4:5, no people, no text. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },

  // ========== COR-SELO SURPRESA (Vermelho, Verde, Mostarda) ==========
  {
    nome: "cor_selo_01_vermelho_verdade",
    descricao: "COR-SELO Vermelho terroso — Post de 'Verdade Inconveniente'",
    prompt: `Editorial Instagram poster design, full bleed deep terracotta red background color hex 9B3B2E filling the entire canvas, large bold elegant serif typography (Playfair Display style) in warm off-white color hex F5F3EE centered on the canvas spanning multiple lines, EXACT text reading: line 1 "Seu maior" line 2 "concorrente não é" line 3 "o salão da esquina." line 4 "" line 5 "É a sua falta" line 6 "de posicionamento.", below the headline a thin horizontal warm cream accent line about 60 pixels wide, far at the bottom in tiny letter-spaced uppercase warm off-white text the EXACT phrase "VERDADE INCONVENIENTE", generous negative space, sophisticated bold editorial premium aesthetic, no other graphic elements, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "cor_selo_02_verde_pausa",
    descricao: "COR-SELO Verde floresta — Post de pausa/reflexão",
    prompt: `Editorial Instagram poster design, full bleed deep forest green background color hex 3E5A4F filling the entire canvas, large bold elegant serif typography (Cormorant style) in warm off-white color hex F5F3EE centered on the canvas, EXACT text on three lines: line 1 "Antes de querer" line 2 "crescer mais," line 3 "entenda por que" line 4 "parou de crescer.", below the headline a thin horizontal soft gold accent line color hex D4A574 about 60 pixels wide, generous negative space, sophisticated contemplative editorial aesthetic, no other graphic elements, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "cor_selo_03_mostarda_evento",
    descricao: "COR-SELO Mostarda profunda — Post de oferta/evento especial",
    prompt: `Editorial Instagram poster design, full bleed deep mustard ochre background color hex A67C3E filling the entire canvas, large bold elegant serif typography (Playfair Display style) in deep navy color hex 2B3A4D centered on the canvas spanning multiple lines, EXACT text reading: line 1 "Diagnóstico" line 2 "estratégico." line 3 "" line 4 "Sem custo." line 5 "Sem compromisso.", below the headline a thin horizontal navy accent line about 60 pixels wide, far at the bottom in small letter-spaced uppercase navy text the EXACT phrase "ENVIE DIAGNÓSTICO NO DIRECT", generous negative space, sophisticated editorial premium aesthetic, no other graphic elements, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },

  // ========== POSTS RESPIRO (foto + 0-3 palavras) ==========
  {
    nome: "respiro_01_pausa",
    descricao: "RESPIRO — Café em mesa + palavra 'Pausa.' gigante",
    prompt: `Editorial lifestyle photograph composition, a single white ceramic espresso cup with delicate crema sitting on a warm beige linen cloth on a polished walnut wood surface, soft diffused natural morning light from upper-left creating gentle long shadow, shot on Hasselblad H6D with 80mm lens at f/4, ISO 200, color temperature 4500K warm tones, color palette of warm walnut, soft beige linen, warm white ceramic, and subtle brown shadow, the cup positioned in the lower-right third of the frame, generous empty negative space in the upper-left half. Over the upper-left negative space, a single very large bold elegant serif typography word (Cormorant style) in deep navy color hex 2B3A4D, EXACT single word with period: "Pausa.", flawless legible typography with perfect Portuguese accent on the letter a, no other elements, no logos, sophisticated contemplative editorial aesthetic, museum quality minimalism, subtle natural film grain, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "respiro_02_pensar",
    descricao: "RESPIRO — Mesa vazia em luz dourada + frase curta",
    prompt: `Editorial lifestyle photograph composition, a clean empty round walnut wood table top surface viewed from a slight angle, with only a small dried twig branch lying gently across it, bathed in warm golden hour afternoon light streaming from the right window creating long dramatic shadows, dreamy atmospheric light haze, shot on Hasselblad H6D with 50mm lens at f/2.8, ISO 320, color temperature 3200K warm amber tones, color palette of warm honey walnut, golden light bloom, soft beige shadows, generous empty negative space, the branch positioned in the lower-right third. Over the upper-left negative space, large bold elegant serif typography in deep navy color hex 2B3A4D EXACT text on two lines: line 1 "Pensar é" line 2 "a primeira venda.", flawless legible typography with perfect Portuguese accents, no other elements, no logos, sophisticated contemplative editorial aesthetic, subtle natural film grain with organic light bloom, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },
  {
    nome: "respiro_03_silencio",
    descricao: "RESPIRO — Janela com cortina + 1 palavra",
    prompt: `Editorial lifestyle photograph composition, a soft floor-to-ceiling sheer linen cream curtain gently billowing from a window, with warm late afternoon sunlight filtering through creating soft diffused luminous atmosphere, the curtain occupies the right two thirds of the frame in soft focus, no other objects visible, shot on Hasselblad H6D with 50mm lens at f/2.8, ISO 320, color temperature 3200K warm golden tones, color palette of soft cream linen, warm honey light, gentle ivory shadows, dreamy atmospheric haze, generous empty space on the left. Over the upper-left empty space, a single very large bold elegant serif typography word (Cormorant style) in deep navy color hex 2B3A4D, EXACT single word with period: "Silêncio.", flawless legible typography with perfect Portuguese accent circumflex on the letter e and tilde on the letter i, no other elements, no logos, sophisticated contemplative editorial aesthetic, museum quality minimalism, subtle natural film grain, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEGATIVE_PROMPT}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 Gerando ${posts.length} imagens demonstrativas de UPGRADES via ${MODEL}`);
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
