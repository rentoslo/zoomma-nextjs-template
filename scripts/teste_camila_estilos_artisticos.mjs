// =====================================================
// TESTE — 10 imagens artísticas (5 estilos × 2 cenas)
// Camila Estética / nano-banana-pro
// Saída: AGENDA EDITORIAL/IMAGENS/_testes_artisticos_2026-05-19
// =====================================================
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
const OUTPUT_DIR =
  "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\IMAGENS\\_testes_artisticos_2026-05-19";

// ---------- Negativos universais (anti-realismo / anti-foto) ----------
const NEGATIVE = `NEGATIVE: no photorealism, no 3D render, no realistic photography, no plastic skin, no AI-generated look, no glossy CGI, no Instagram filter aesthetic, no oversaturation, no neon colors, no harsh contrast, no watermarks, no logo overlay, no anatomical errors`;

// =====================================================
// 5 ESTILOS × 2 CENAS = 10 IMAGENS
// =====================================================
const testes = [
  // ═══════════════════════════════════════════════
  // ESTILO 1 — GOUACHE CONTEMPORÂNEO EDITORIAL
  // Referências: Cecilia Castelli, Charlotte Trounce, Matisse late-period
  // ═══════════════════════════════════════════════
  {
    nome: "01a_gouache_mulher_perfil",
    descricao: "Gouache · Cena 1a: mulher em perfil tocando o rosto",
    prompt: `A contemporary gouache illustration in the editorial style of Cecilia Castelli and Charlotte Trounce, painted on textured cream Arches watercolor paper. The composition shows a stylized young woman in three-quarter profile, her hand resting softly on her cheek in a contemplative gesture. The figure is rendered with flat opaque gouache shapes — no realism, no rendering, no shading gradient. Visible confident brushstrokes leave texture marks. Her hair is a single confident shape in soft chestnut. Her face is simplified to essential planes: cheek, jaw, eyelid as flat shapes.

PALETTE STRICTLY LIMITED TO: off-white #FBF7F4 background, rose petal #F8D7DE for skin, nude #F5E8E0 for highlights, soft terracotta #C4906E for shadows, warm gold #D4AF37 for tiny accents (earring, single thin line). Visible paper grain texture throughout.

COMPOSITION: Vertical 4:5. Generous negative space on the left side. The figure occupies the right two-thirds, painted with confidence and looseness. Tiny ornamental brush detail (a single eucalyptus leaf or curved line) in soft sage green on the lower-left.

STYLE EMPHASIS: Painted by a human illustrator with a real brush. Visible texture of opaque gouache paint. Imperfect edges. Hand-made authentic feel. Magazine editorial spread quality (think Kinfolk, The Gentlewoman, Cereal).

${NEGATIVE}`,
  },
  {
    nome: "01b_gouache_natureza_morta",
    descricao: "Gouache · Cena 1b: natureza-morta com peônia e vidro",
    prompt: `A contemporary gouache still-life illustration in the editorial style of Cecilia Castelli and Charlotte Trounce, painted on textured cream Arches paper. The composition shows a quiet still-life: a tall clear glass with water and a single white peony stem with two delicate leaves, beside a folded soft linen napkin in pale rosé, and a small ceramic bowl in nude tone. All objects rendered as flat opaque gouache shapes with visible brushstrokes — no realism, no photographic detail, no 3D rendering.

PALETTE STRICTLY LIMITED TO: off-white #FBF7F4 background, soft rosé #F8D7DE for accents, nude tone #F5E8E0 for ceramic, soft sage green #B5C5B0 for leaves, warm gold #D4AF37 for one thin painted line as accent, soft terracotta #C4906E for cast shadow shapes. Visible paper grain throughout.

COMPOSITION: Vertical 4:5. Objects arranged loosely on the lower half of the canvas, generous negative breathing space at the top. The objects are slightly oversized for the canvas, like an editorial magazine still-life painting.

STYLE EMPHASIS: Hand-painted gouache. Visible imperfect brushstrokes. Flat opaque color blocking. Paper texture visible. Painterly authenticity — the kind of illustration that hangs framed on a gallery wall.

${NEGATIVE}`,
  },

  // ═══════════════════════════════════════════════
  // ESTILO 2 — AQUARELA BOTÂNICA DELICADA
  // Referências: Lulu DK, Marcello Velho, herbarium watercolors
  // ═══════════════════════════════════════════════
  {
    nome: "02a_aquarela_botanica_eucalipto",
    descricao: "Aquarela · Cena 2a: eucalipto + peônia botânico",
    prompt: `A delicate watercolor botanical illustration in the style of Lulu DK and contemporary herbarium watercolors. The composition shows a loose botanical arrangement: a long eucalyptus stem with rounded silver-green leaves trailing diagonally, and a single fully-bloomed white peony at the center-bottom with soft pink-blushed petals. The watercolor technique uses wet-on-wet washes with visible bleeding edges, pigment pools where the wash dried, and translucent layers showing through.

PALETTE: cream paper #FBF7F4 base, sage-green watercolor #B5C5B0 for eucalyptus leaves, whisper pink #FCE4EC blush on peony petals, soft warm gold #D4AF37 painted on one tiny stem detail, very pale terracotta wash for subtle stem shadows. The pigments must look REAL watercolor — granulation visible, bleeding edges, soft hard-line where the brush stopped.

COMPOSITION: Vertical 4:5. Generous white negative space — the botanical occupies maybe 60% of the canvas, the rest is breathing white paper. Two tiny intentional pigment splatters (small natural specks) as authentic watercolor "imperfections."

STYLE EMPHASIS: True traditional watercolor on cotton paper, NOT digital watercolor brush effect. Visible paper tooth. Pigment behaves like real water on fiber. Delicate, breathing, contemplative — like a page from a luxurious botanical journal.

${NEGATIVE}`,
  },
  {
    nome: "02b_aquarela_silhueta_entre_folhas",
    descricao: "Aquarela · Cena 2b: silhueta feminina entre folhagens",
    prompt: `A delicate watercolor illustration in the style of Lulu DK and contemporary editorial watercolorists. The composition shows the soft silhouette of a woman from the shoulders up, her face shown in soft three-quarter profile suggested rather than drawn (only the curve of her cheek, the line of her jaw, eyelid closed in calm). She is surrounded by trailing watercolor botanical elements: eucalyptus leaves and peony branches that frame her like she is emerging from a garden.

WATERCOLOR TECHNIQUE: wet-on-wet washes, bleeding edges, pigment granulation, visible cotton paper texture. The figure is painted as loose washes — her skin is barely-tinted soft cream, her hair is a single confident wash of warm chestnut that bleeds at the edges.

PALETTE: cream paper #FBF7F4, very pale skin wash, soft chestnut #B89070 hair (loose wash), sage green #B5C5B0 leaves, whisper pink #FCE4EC for one peony, warm gold #D4AF37 painted only on one tiny detail (an earring shape, a thread).

COMPOSITION: Vertical 4:5. The figure is centered slightly to the right, the botanicals frame the left and top. Negative space at the bottom-right breathes. Tiny pigment splatters add hand-painted authenticity.

STYLE EMPHASIS: Real traditional watercolor — NOT digital. The face is SUGGESTED, not drawn in detail. Loose, breathing, poetic — like an illustration in a feminine literary magazine.

${NEGATIVE}`,
  },

  // ═══════════════════════════════════════════════
  // ESTILO 3 — LINHA CONTÍNUA + MANCHA CROMÁTICA
  // Referências: Matisse "Tableaux Bleus", Picasso line drawings, Quentin Monge
  // ═══════════════════════════════════════════════
  {
    nome: "03a_linha_rosto_feminino",
    descricao: "Linha + Mancha · Cena 3a: rosto feminino em linha contínua",
    prompt: `A minimalist editorial illustration in the single-line continuous drawing style of Picasso and the visual language of Matisse "Plumes Bleues," made by contemporary illustrator Quentin Monge. The composition shows a stylized woman's face in three-quarter view, drawn with ONE continuous unbroken black ink line — the line traces her hair, her forehead, her eye (a single curved closed shape), her nose (one curve), her lips, her chin, her neck, and her shoulder. The line is fine but confident, hand-drawn quality with subtle variation in pressure.

CRITICAL: The line is drawn ONCE, continuous, without lifting the pen. No shading. No hatching. No interior fill. The face is reduced to its essential gesture.

BACKGROUND: pure white #FFFFFF paper. Behind the line drawing, a single irregular organic shape of soft watercolor wash in whisper pink #F8D7DE — positioned offset from the line, as if the wash was painted first and the line drawn slightly off-register. The wash has soft bleeding edges.

ACCENT: a single tiny shape in warm gold #D4AF37 (a small circle as an earring, OR a thin straight line as accent).

PALETTE STRICTLY: white #FFFFFF + soft black #1A1A1A ink line + rose petal wash #F8D7DE + tiny gold #D4AF37. NO OTHER COLORS.

COMPOSITION: Vertical 4:5. The drawing occupies the center-right of the canvas with generous white negative space all around.

STYLE EMPHASIS: Hand-drawn ink + watercolor wash. Authentic French Parisian fashion editorial. NOT digital vector — the line must have human imperfection.

${NEGATIVE}`,
  },
  {
    nome: "03b_linha_mao_tocando_rosto",
    descricao: "Linha + Mancha · Cena 3b: mão tocando o rosto",
    prompt: `A minimalist single-line continuous drawing in the style of Picasso and Matisse, made by contemporary illustrator Quentin Monge. The composition shows a stylized woman's hand gently touching her own cheek — a tender contemplative gesture. Drawn with ONE continuous unbroken black ink line that traces: the wrist, the back of the hand, four fingers (one curl, three straight elegant fingers), the thumb resting on the cheek, then continuing into the curve of the jaw, the chin, the lips suggestion, the closed eyelid, the eyebrow, and ending at the hairline.

CRITICAL: One continuous line, no lifting. Fine but confident, with subtle variation in pressure. No shading. No hatching. No fills.

BACKGROUND: pure white #FFFFFF paper. Behind/beneath the line drawing, an organic free-form wash shape in warm gold #D4AF37 (very transparent, about 30% opacity) — positioned offset to the left like the wash was painted first.

ACCENT: a tiny soft pink #F8D7DE wash as a second offset shape (a small irregular oval) lower-right of the composition.

PALETTE STRICTLY: white #FFFFFF background + soft black #1A1A1A line + gold wash #D4AF37 + tiny pink #F8D7DE. NO OTHER COLORS.

COMPOSITION: Vertical 4:5. Drawing occupies center-left, gold wash spans diagonally behind. Bottom-right has negative space for visual rest.

STYLE EMPHASIS: Authentic hand-made ink and wash. French chic fashion editorial. NOT digital vector. The line must have human breath in it.

${NEGATIVE}`,
  },

  // ═══════════════════════════════════════════════
  // ESTILO 4 — RISOGRAPH BOUTIQUE
  // Referências: Tokyo riso studios, boutique zines, art posters
  // ═══════════════════════════════════════════════
  {
    nome: "04a_riso_poster_floral",
    descricao: "Risograph · Cena 4a: pôster floral com tipografia",
    prompt: `A risograph-printed boutique art poster in the style of independent Tokyo riso studios. The composition shows a single oversized abstract bloom (suggesting a peony or rose) filling 60% of the frame, rendered in flat geometric shapes with slight registration offset where the layers don't align perfectly — the signature riso "misregistration" charm.

PRINTING TECHNIQUE EMULATION: exactly 3 ink layers visible — (1) soft fluor pink #F5C5D4 for petal mass, (2) bone cream #F3EBE0 as paper base, (3) warm gold #D4AF37 for thin outline and one accent shape. Each layer has visible riso grain — tiny dots, slight smudging, organic ink texture. NO black ink. The colors are slightly muted as real riso ink prints.

TYPOGRAPHY: At the bottom-third, the word "RITUAL" rendered in a bold geometric sans-serif typeface (think Druk or Söhne), letter-spaced, in gold #D4AF37 — printed on top of the pink layer so it appears slightly offset and grain-textured. Below in much smaller type: "camila estética · bauru" in same gold, lowercase.

COMPOSITION: Vertical 4:5. Square-bracketed poster composition. Generous bone-cream background showing the paper. The bloom is offset slightly to the right.

STYLE EMPHASIS: Authentic risograph print — 3-color limit, visible grain, intentional misregistration, paper texture showing. Independent boutique zine aesthetic. Collectible art print quality.

${NEGATIVE}`,
  },
  {
    nome: "04b_riso_silhueta_janela",
    descricao: "Risograph · Cena 4b: silhueta feminina em janela",
    prompt: `A risograph-printed boutique art poster in the style of independent Tokyo riso studios. The composition shows a geometric silhouette of a woman standing in front of a tall arched window, her face in soft profile turned toward the light. She is rendered as flat shapes — no realistic detail, just essential planes. The sun outside the window is a perfect gold circle. A single tall plant (eucalyptus stem) silhouette to her left.

PRINTING TECHNIQUE EMULATION: exactly 3 ink layers — (1) soft fluor pink #F5C5D4 as background wash (the sky through the window, the wall behind her), (2) bone cream #F3EBE0 as paper base where it shows through, (3) warm gold #D4AF37 for the sun, her contour, and one accent. Slight misregistration between layers. Visible riso grain and ink texture throughout. NO black ink. Slightly muted real-riso colors.

COMPOSITION: Vertical 4:5. Window arch shape occupies the upper-left. The woman is centered-right, her silhouette quietly turning toward the light. Geometric, calm, almost art-deco-meets-riso.

TYPOGRAPHY (optional small detail): at the bottom-right, a tiny gold "·" dot and the year "2026" letter-spaced in geometric sans — barely visible, like a printer's mark.

STYLE EMPHASIS: Real risograph print — 3 colors max, grain, slight offset, paper showing. Independent boutique poster shop aesthetic.

${NEGATIVE}`,
  },

  // ═══════════════════════════════════════════════
  // ESTILO 5 — PASTEL SECO NOUVEAU
  // Referências: Alphonse Mucha modernizado, Cassandre, Erté revisitado
  // ═══════════════════════════════════════════════
  {
    nome: "05a_pastel_mucha_modernizado",
    descricao: "Pastel Nouveau · Cena 5a: retrato art nouveau",
    prompt: `A dry pastel chalk illustration in the contemporary revival of Alphonse Mucha's Art Nouveau style, modernized with restraint and Japanese minimalism (think Cassandre + Erté made by a contemporary illustrator). The composition shows a stylized woman in three-quarter profile, her hair flowing in a single sculpted wave (Mucha-style but reduced), surrounded by a delicate frame of fine Art Nouveau ornamental linework in gold — only the suggestion of a frame, not the full Mucha-frame, perhaps an arch at the top and a thin gold line continuing.

PASTEL TECHNIQUE: visible chalk grain on Canson Mi-Teintes textured paper. Soft blended areas where the pastel has been smudged with finger. Visible paper tooth coming through the color. NOT smooth digital airbrush — REAL dry pastel chalk texture.

PALETTE: cream paper background #FBF7F4 with visible paper texture, skin tone in warm pastel #F5E8E0, hair in soft chestnut pastel #B89070, lips and cheek blush in rosé #F8D7DE, dress/garment suggestion in soft sage green #B5C5B0 OR cream, ornamental linework in fine warm gold #D4AF37. Background has hints of soft champagne #F3EBE0 atmosphere.

ORNAMENT: thin gold Art Nouveau linework — a single curved arch behind her head suggesting a halo, two thin organic curves like growing tendrils, one small ornamental floret. Restrained, not maximalist. Modern Mucha, not 1900 Mucha.

COMPOSITION: Vertical 4:5. The figure centered. Negative cream space top and bottom breathes. Whole image has the feel of an art print framed in a feminine boudoir.

STYLE EMPHASIS: Real dry pastel chalk on textured paper. Hand-made authentic. Contemporary Art Nouveau revival — feminine, ornamental, timeless. NOT a digital filter.

${NEGATIVE}`,
  },
  {
    nome: "05b_pastel_ornamental_peonia",
    descricao: "Pastel Nouveau · Cena 5b: composição ornamental com peônia",
    prompt: `A dry pastel chalk illustration in the contemporary Art Nouveau revival style — Alphonse Mucha modernized with Japanese minimalism. The composition shows an ornamental still-life: a single oversized peony in soft bloom at the center, surrounded by thin gold Art Nouveau ornamental linework that frames the composition (an organic arch and curved tendrils growing around the flower). Below the peony, a thin gold ribbon-like curve carries hand-lettered cursive text "rituel" in delicate small script.

PASTEL TECHNIQUE: visible chalk grain on Canson Mi-Teintes textured paper. The peony is rendered in soft blended pastel — petals as light layered chalk strokes with visible texture, slight smudging at edges where pastel meets pastel. NOT digital — must look like real chalk.

PALETTE: cream paper background #FBF7F4 (paper texture visible), peony petals in soft rosé #F8D7DE and whisper pink #FCE4EC, peony center in champagne #F3EBE0, leaves in muted sage #B5C5B0, ornamental linework and lettering in fine warm gold #D4AF37. Subtle background atmosphere with hints of warm cream.

ORNAMENT: thin gold Art Nouveau curves frame the composition — an organic arch at top, tendrils sprouting at the sides, a delicate ribbon scroll at the bottom. Restrained ornament, not maximalist. Symmetrical-leaning composition.

COMPOSITION: Vertical 4:5. The peony is centered, the gold ornament frames it. Symmetric, ritualistic, calm. Like a feminine illuminated manuscript page or a perfume bottle label expanded.

STYLE EMPHASIS: Authentic dry pastel chalk on Canson paper. Contemporary Mucha revival. Feminine, ornamental, calm. Atemporal premium feel.

${NEGATIVE}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 Teste 5 Estilos Artísticos — ${testes.length} imagens via ${MODEL}`);
console.log(`📁 Saída: ${OUTPUT_DIR}\n`);

await fs.mkdir(OUTPUT_DIR, { recursive: true });

const inicio = Date.now();
const resultados = [];

for (let i = 0; i < testes.length; i++) {
  const teste = testes[i];
  const numero = String(i + 1).padStart(2, "0");
  const arquivo = path.join(OUTPUT_DIR, `${teste.nome}.png`);
  const tInicio = Date.now();

  process.stdout.write(`[${numero}/${testes.length}] ${teste.descricao} ... `);

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ text: teste.prompt }],
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: "4:5" },
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData?.data);

    if (!imagePart) {
      throw new Error(`Resposta sem imagem.`);
    }

    const buffer = Buffer.from(imagePart.inlineData.data, "base64");
    await fs.writeFile(arquivo, buffer);

    const segundos = ((Date.now() - tInicio) / 1000).toFixed(1);
    console.log(`✓ (${segundos}s)`);
    resultados.push({ nome: teste.nome, status: "ok", arquivo, segundos });
  } catch (err) {
    console.log(`✗ ERRO: ${err.message}`);
    resultados.push({ nome: teste.nome, status: "erro", erro: err.message });
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
    console.log(`  - ${r.nome}: ${r.erro}`);
  }
}
