// =====================================================
// TESTE — 5 estilos sofisticados × 2 versões = 10 imagens
// Mesmo post fictício replicado em cada estilo
// Sem Camila / Com Camila estilizada
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
const FOTOS_DIR = "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\fotos_avatar";
const OUTPUT_DIR =
  "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\IMAGENS\\_testes_5estilos_sofisticados_2026-05-19";

// ---------- Post fictício (replicado em todas as 10) ----------
const POST_CONTENT = `THE POST CONTENT TO RENDER ACROSS THE IMAGE (always present, perfectly legible, all Portuguese accents intact):
- HEADLINE (Playfair Display serif, bold, very large, color soft black #1A1A1A): "Sua pele,"
- HEADLINE second line (Playfair Display serif italic, very large, color soft rosé-mauve #B07590): "em primeiro lugar."
- SUBLINE (sans-serif Medium, uppercase, letter-spaced 0.18em, medium size, color soft black #1A1A1A): "AVALIAÇÃO PERSONALIZADA · CAMILA ESTÉTICA"
- CTA (sans-serif Medium, small size, color soft gold #D4AF37): "agende sua avaliação · direct"`;

const IDENTITY_REF = `IDENTITY — the reference photograph shows Dr. Camila Slobodticov. Her features: very dark brown almost black hair shoulder-length wavy, almond-shaped slightly-upturned dark brown eyes, defined arched dark brown eyebrows, warm fair skin with golden undertone, oval face with defined high cheekbones, medium-full lips with fuller lower lip. STYLIZE her per the artistic direction requested, BUT she must remain unmistakably recognizable as the woman in the reference.`;

const NEGATIVE_BASE = `NEGATIVE: no AI-generated look, no plastic skin, no oversaturation, no neon, no magenta, no childlike illustration, no naive cute art, no whimsical flowers, no juvenile aesthetic, no Disney style, no kawaii, no kindergarten art, no Pinterest-DIY look, no garbled text, no misspellings, no missing portuguese accents, no watermark`;

// =====================================================
// 10 IMAGENS
// =====================================================
const testes = [
  // ═══════════════════════════════════════════════
  // ESTILO 1 — EDITORIAL MAGAZINE MINIMAL
  // (Kinfolk · The Gentlewoman · Cereal)
  // ═══════════════════════════════════════════════
  {
    nome: "01a_editorial_minimal_SEM",
    descricao: "Estilo 1 · Editorial Minimal · SEM Camila",
    foto: null,
    prompt: `Create a sophisticated editorial magazine cover layout in the style of Kinfolk, The Gentlewoman, and Cereal Magazine — adult, premium, restrained.

LAYOUT: Vertical 4:5. The composition is a high-end magazine spread. The HEADLINE typography is the protagonist — extremely large editorial serif, occupying the upper-two-thirds of the canvas with generous breathing space. A small editorial photograph of a single object lives in the lower-left quadrant: a hand-cut crystal apothecary bottle holding clear water, standing on a soft cream linen surface, shot in soft natural window light with deep shadow falloff (cinematic stillness).

PALETTE: off-white paper #FBF7F4 base, soft black #1A1A1A typography, soft rosé-mauve #B07590 italic accent, single thread of soft gold #D4AF37 for CTA. Cream-and-shadow photography only.

PAPER: subtle uncoated cream paper texture visible throughout — like a luxury magazine printed on quality stock.

${POST_CONTENT}

The headline "Sua pele, em primeiro lugar." spans the upper half. The subline sits between the headline and the object photograph. The CTA sits in the lower-right corner.

STYLE EMPHASIS: Adult, sophisticated, restrained. Not whimsical. Not floral. Editorial magazine quality only. No illustration — only refined typography and a single photographic object.

${NEGATIVE_BASE}`,
  },
  {
    nome: "01b_editorial_minimal_COM",
    descricao: "Estilo 1 · Editorial Minimal · COM Camila estilizada",
    foto: "IMG_3629.jpg",
    prompt: `${IDENTITY_REF}

Create a sophisticated editorial magazine COVER layout in the style of Kinfolk, The Gentlewoman, and Cereal Magazine — adult, premium, restrained.

LAYOUT: Vertical 4:5. Edge-to-edge full-bleed editorial photograph of Dr. Camila — but stylized as a fine art editorial portrait: she is shown shoulders-up in soft three-quarter view against an off-white #FBF7F4 backdrop with subtle warm cream gradient. She wears a simple cream silk camisole or unbranded white. Soft diffused natural light from the left, slight shadow falloff. Eyes serene, faint composed smile. The photograph has a slight subtle film grain, slightly desaturated, magazine cover quality.

OVERLAID TYPOGRAPHY (anchored editorial-magazine-cover style): the very large headline serif sits boldly OVER the image in the upper-third with strong presence — like a magazine masthead. The headline can overlap her hair softly. Subline sits in the right margin vertically letter-spaced. CTA in the lower-right.

PALETTE: off-white, soft black, soft rosé-mauve italic, soft gold accent.

${POST_CONTENT}

STYLE EMPHASIS: Magazine cover quality — Vogue, Harper's Bazaar level sophistication. The typography is hero. Camila is the editorial subject. Adult, restrained, premium.

${NEGATIVE_BASE}, no inner photo frame, no polaroid, no childlike illustration`,
  },

  // ═══════════════════════════════════════════════
  // ESTILO 2 — ART DECO PREMIUM
  // (Cartier · Boucheron · Erté revisitado)
  // ═══════════════════════════════════════════════
  {
    nome: "02a_artdeco_premium_SEM",
    descricao: "Estilo 2 · Art Deco Premium · SEM Camila",
    foto: null,
    prompt: `Create a sophisticated Art Deco premium poster — adult luxury aesthetic in the spirit of Cartier and Boucheron jewelry house advertising.

LAYOUT: Vertical 4:5. Composition framed by a refined Art Deco geometric border in soft gold #D4AF37 fine line — a stepped pyramid motif at top and bottom, slender vertical fluted lines on the sides, a delicate sunburst medallion at the very top center. Background is a textured aged ivory paper #FBF4E8 with subtle warm cream gradient and almost imperceptible marbling pattern.

CENTER COMPOSITION: a single elegant Art Deco illustrated motif — a stylized peacock feather rendered in fine gold linework, OR an oval gold cameo frame containing a tiny ornamental flourish. Restrained, never busy.

TYPOGRAPHY: Bodoni or Didot serif (very high-contrast classic serif) for the headline. The headline "Sua pele, em primeiro lugar." occupies the upper-center under the sunburst medallion. Subline sits along the bottom geometric border in fine sans-serif letter-spaced. CTA tiny at very bottom in gold.

PALETTE: aged ivory #FBF4E8 background, soft black #1A1A1A typography, soft rosé-mauve #B07590 italic accent for the italic word, deep gold #D4AF37 for ornament and gold typography. Possibly hint of soft burgundy #6B2737 in micro detail.

STYLE EMPHASIS: Luxury jewelry house advertising of the 1920s-30s revisited for today. Refined geometric ornament. Bodoni serif clarity. Adult, atemporal, never ornate-to-the-point-of-busy.

${NEGATIVE_BASE}, no plastic CGI gold, no neon gold, no busy maximalism`,
  },
  {
    nome: "02b_artdeco_premium_COM",
    descricao: "Estilo 2 · Art Deco Premium · COM Camila estilizada",
    foto: "IMG_3629.jpg",
    prompt: `${IDENTITY_REF}

Create a sophisticated Art Deco premium portrait poster — adult luxury aesthetic in the spirit of Cartier, Erté, and Tamara de Lempicka modernized.

LAYOUT: Vertical 4:5. Background is a deep textured aged ivory paper #FBF4E8 with warm cream gradient and subtle marbling. The poster is framed by a refined Art Deco geometric border in soft gold #D4AF37 fine line — stepped pyramid motif at top and bottom, slender fluted lines on the sides.

PORTRAIT (center): Dr. Camila rendered as a stylized 1920s Art Deco-style portrait painting — her face and shoulders, in three-quarter view, painted with refined planar shapes (not realism, not photograph) suggestive of Tamara de Lempicka's geometric portraiture but feminine and soft. Her very dark brown hair becomes a sculpted geometric wave shape. Her almond eyes and arched eyebrows are clearly her — UNMISTAKABLY RECOGNIZABLE. She wears a suggested cream silk wrap with a single deco gold pin at the shoulder. Subtle warm skin tone with golden undertone.

ORNAMENT: a delicate gold sunburst medallion at the top above her head (small, halo-like). A small gold cameo flourish at the bottom-center holding the tiny CTA text. Restrained ornament.

TYPOGRAPHY: Bodoni or Didot serif. Headline placed in the upper area integrated with the deco frame.

PALETTE: aged ivory #FBF4E8, soft black #1A1A1A, soft rosé-mauve #B07590 italic, deep gold #D4AF37 ornament/CTA, warm skin tone, very dark brown #3A2A20 hair, hint of burgundy #6B2737 micro detail.

${POST_CONTENT}

STYLE EMPHASIS: A modernized Art Deco portrait painting — adult, luxury, never costume-y. Lempicka-meets-Cartier. Refined, sculptural, atemporal.

${NEGATIVE_BASE}, no costume look, no Halloween art deco, no cartoonish flapper`,
  },

  // ═══════════════════════════════════════════════
  // ESTILO 3 — FINE ART PRETO-E-BRANCO
  // (Helmut Newton · Peter Lindbergh · Vogue Italia)
  // ═══════════════════════════════════════════════
  {
    nome: "03a_finearts_PB_SEM",
    descricao: "Estilo 3 · Fine Art P&B · SEM Camila",
    foto: null,
    prompt: `Create a sophisticated black-and-white fine art editorial composition in the spirit of Helmut Newton, Peter Lindbergh, and Vogue Italia covers — adult, premium, cinematic.

LAYOUT: Vertical 4:5. Edge-to-edge fine art black-and-white photograph of an evocative composition: a single elegant woman's hand (manicured, ringless except one thin gold band) emerging from a soft white silk fabric, gently touching her own cheek/jawline that disappears into deep shadow on the upper-right edge — only the gesture is visible, the face is implied beyond the frame. The lighting is dramatic but soft — single window source, sharp falloff into deep blacks.

PALETTE: pure black-and-white photography with ONE single chromatic accent — the gold band on the finger is the only color (warm gold #D4AF37). The italic word in the headline is the other color accent — soft rosé-mauve #B07590. Everything else is monochrome with deep blacks and luminous whites.

TYPOGRAPHY: Headline is overlay typography — bold serif (Playfair) sitting in the upper-left over the dark area. White or off-white headline against black, italic accent in rosé-mauve. Subline below in letter-spaced sans uppercase. CTA in soft gold in lower-right.

STYLE EMPHASIS: Magazine fine art photography — Vogue Italia editorial spread quality. Dramatic but elegant. Adult, cinematic, never staged-looking. The composition tells a story.

${POST_CONTENT}

${NEGATIVE_BASE}, no overprocessed B&W, no fake film effect, no infrared`,
  },
  {
    nome: "03b_finearts_PB_COM",
    descricao: "Estilo 3 · Fine Art P&B · COM Camila estilizada",
    foto: "IMG_3629.jpg",
    prompt: `${IDENTITY_REF}

Create a sophisticated black-and-white fine art editorial portrait in the spirit of Peter Lindbergh and Vogue Italia — adult, cinematic, premium.

LAYOUT: Vertical 4:5. Edge-to-edge fine art black-and-white photograph of Dr. Camila — three-quarter profile, head slightly turned away from camera, eyes lowered in contemplation. She wears a simple white linen shirt with open collar. Dramatic but soft lighting from the left — single window source creating sculptural light on her cheekbone and jawline, the right side of her face falling into deep luminous shadow. Her very dark brown hair flows naturally over her shoulder. Her almond eyes and arched eyebrows clearly recognizable as her. Skin tone rendered in luminous grayscale — no color in the photograph itself.

ACCENT (the only color in the image): the italic part of the headline "em primeiro lugar." is rendered in soft rosé-mauve #B07590 (the only chromatic moment). And the small CTA in soft gold #D4AF37.

TYPOGRAPHY: Headline overlay in the lower-third or right-margin — bold Playfair serif in off-white against the dark area of the photograph, italic in rosé-mauve. Subline in white letter-spaced sans uppercase. CTA in gold lower-right corner.

STYLE EMPHASIS: Peter Lindbergh-quality B&W editorial portrait. Adult, sophisticated, never glamour-cheesy. The model is the subject, the light tells the story. Magazine cover gravitas.

${POST_CONTENT}

${NEGATIVE_BASE}, no harsh AI-style B&W, no fake film grain, no different person`,
  },

  // ═══════════════════════════════════════════════
  // ESTILO 4 — SCULPTURE & MARBLE EDITORIAL
  // (Museu clássico, Hermès, atemporal)
  // ═══════════════════════════════════════════════
  {
    nome: "04a_marble_sculpture_SEM",
    descricao: "Estilo 4 · Sculpture & Marble · SEM Camila",
    foto: null,
    prompt: `Create a sophisticated museum-quality editorial composition — adult, atemporal, classical luxury in the spirit of Hermès campaigns and contemporary museum publications.

LAYOUT: Vertical 4:5. The composition shows a fragment of classical marble sculpture (a graceful curve of a sculpted female neck and collarbone, or an elegant fragment of a sculpted hand resting) photographed against a textured Calacatta marble wall background. Soft museum-quality directional lighting reveals the marble's veining and the sculpture's volume. The composition is editorial, contemplative, very Hermès-ad-2020s.

PALETTE: warm Calacatta marble background (white-cream with subtle gray veining), soft black #1A1A1A for typography, soft rosé-mauve #B07590 italic accent, deep gold #D4AF37 for CTA and a single thin underline detail. Marble is the dominant texture.

TYPOGRAPHY: Headline in classical Roman serif (Trajan or Cinzel feel) — large, refined, centered or upper-positioned. Italic accent in rosé-mauve. Subline in letter-spaced classical sans. CTA tiny in gold.

STYLE EMPHASIS: Museum publication / Hermès campaign quality. Classical, atemporal, weighted with cultural gravitas. The fragment of sculpture is the only "subject" — it gives the composition emotional resonance without being figurative-realist. Adult, refined, never costume-classical.

${POST_CONTENT}

${NEGATIVE_BASE}, no fake plastic marble, no kitsch column-and-pillar, no Las Vegas pseudo-classical`,
  },
  {
    nome: "04b_marble_sculpture_COM",
    descricao: "Estilo 4 · Sculpture & Marble · COM Camila estilizada",
    foto: "IMG_3629.jpg",
    prompt: `${IDENTITY_REF}

Create a sophisticated museum-quality editorial composition — adult, atemporal, classical luxury.

LAYOUT: Vertical 4:5. Dr. Camila is rendered as a contemporary classical marble bust — her likeness preserved (face shape, very dark hair sculpted into a flowing classical wave, almond eyes, arched brows, full lips, recognizable as her) but transformed into a hyper-refined classical sculpture. The "bust" is photographed against a textured Calacatta marble wall background with soft museum-quality directional lighting. She is shown from collarbone up, in three-quarter view, eyes calmly closed or downcast in serene composure (a classical sculpture posture).

The sculpture itself is rendered in WARM IVORY MARBLE — not cold white, but cream marble with subtle pink-warm undertone like Carrara statuary marble. The sculpture has gentle hand-carved imperfection that signals it's real stone, not plastic.

ACCENT: a single thin gold #D4AF37 ornament — perhaps a delicate gold leaf laurel resting on her shoulder, or a thin gold pin. The marble is the protagonist.

TYPOGRAPHY: Headline in classical Roman serif (Trajan/Cinzel feel) overlay in the upper-third or right-margin, soft black with rosé-mauve italic accent. Subline in classical sans letter-spaced. CTA tiny in gold.

PALETTE: warm Calacatta marble background, warm ivory marble sculpture #F3E5D2 with subtle pink undertones, soft black #1A1A1A typography, rosé-mauve #B07590 italic, gold #D4AF37 accents.

${POST_CONTENT}

STYLE EMPHASIS: A modernized neoclassical bust — Hermès campaign meets museum publication. Adult, atemporal, never costume-classical. The sculpture must be CLEARLY recognizable as Dr. Camila despite the stylization.

${NEGATIVE_BASE}, no plastic mannequin, no Greek myth costume, no Las Vegas pseudo-classical, no different person`,
  },

  // ═══════════════════════════════════════════════
  // ESTILO 5 — BRUTALIST EDITORIAL BOLD
  // (MoMA · Bottega Veneta · catálogo arte contemporânea)
  // ═══════════════════════════════════════════════
  {
    nome: "05a_brutalist_bold_SEM",
    descricao: "Estilo 5 · Brutalist Editorial Bold · SEM Camila",
    foto: null,
    prompt: `Create a sophisticated brutalist-editorial typographic composition — adult, serious, in the spirit of MoMA exhibition posters and Bottega Veneta brand publications.

LAYOUT: Vertical 4:5. TYPOGRAPHY IS THE ABSOLUTE PROTAGONIST. The headline "Sua pele, em primeiro lugar." occupies almost the entire upper two-thirds of the canvas — set in an extremely large geometric serif (like a giant Pangram Sans, GT Super, or Söhne Breit), tightly tracked, with the italic part of the headline in rosé-mauve sitting deliberately lower on a new line creating intentional asymmetric hierarchy.

The lower-third is anchored by a clean horizontal grid: subline on the left, CTA on the right, a single thin horizontal hairline gold rule between them. A small subtle warm-cream texture (recycled paper / uncoated stock) visible throughout the background.

PALETTE: warm bone paper #F3EBE0 background with subtle texture, soft black #1A1A1A typography (90% of the visual weight), soft rosé-mauve #B07590 italic accent (5% of weight), single line of gold #D4AF37 for hairline rule and CTA (5%).

A subtle hand-numbered "Nº 01" in tiny letter-spaced sans uppercase in the top-right corner gives editorial weight (issue number feel). A small black dot or hairline mark anchoring the upper-left.

STYLE EMPHASIS: Adult, serious, museum publication / fashion brand editorial quality. The typography is the artwork. No illustration, no photography — pure type design. Bottega Veneta brand book level of refinement.

${POST_CONTENT}

${NEGATIVE_BASE}, no childish bold, no comic sans, no playful type, no decorative type`,
  },
  {
    nome: "05b_brutalist_bold_COM",
    descricao: "Estilo 5 · Brutalist Editorial Bold · COM Camila estilizada",
    foto: "IMG_3629.jpg",
    prompt: `${IDENTITY_REF}

Create a sophisticated brutalist-editorial composition — adult, serious, MoMA-meets-Bottega-Veneta.

LAYOUT: Vertical 4:5. The canvas is split into a deliberate editorial grid: TWO-THIRDS is occupied by GIGANTIC editorial typography on the left (rotated 90 degrees vertically or stacked horizontally with extreme size hierarchy) — the headline "Sua pele, em primeiro lugar." in an extremely large geometric serif (GT Super / Söhne Breit feel), the italic portion in rosé-mauve. ONE-THIRD on the right is a tightly-cropped contemporary fashion-editorial portrait of Dr. Camila — extreme close-up of her face turned slightly away, in subtle desaturated warm tone with high editorial control, only part of her face visible (perhaps just from the cheekbone to the temple, with her dark hair as soft background). The crop is intentionally extreme — Bottega Veneta campaign style.

The photograph is full-bleed inside its third — runs edge-to-edge of that third with no inner frame. The typography third is on bone paper texture #F3EBE0.

Subline runs along the very bottom of the canvas in clean letter-spaced sans. CTA in gold in the lower corner.

PALETTE: warm bone paper #F3EBE0 for type area, soft black #1A1A1A typography, rosé-mauve #B07590 italic accent, gold #D4AF37 for thin rule and CTA, the photograph desaturated warm with very dark brown hair clearly visible.

${POST_CONTENT}

STYLE EMPHASIS: Adult, serious, fashion brand publication quality. The typography and the extreme-cropped photograph are equal partners. Bottega Veneta brand book level. The Camila portion must show her recognizable features (almond eye, arched brow, dark hair, skin tone).

${NEGATIVE_BASE}, no childish design, no full-face portrait, no different person`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 5 Estilos Sofisticados — ${testes.length} imagens via ${MODEL}`);
console.log(`📁 Saída: ${OUTPUT_DIR}\n`);

await fs.mkdir(OUTPUT_DIR, { recursive: true });

const inicio = Date.now();
const resultados = [];

for (let i = 0; i < testes.length; i++) {
  const teste = testes[i];
  const numero = String(i + 1).padStart(2, "0");
  const arquivo = path.join(OUTPUT_DIR, `${teste.nome}.png`);
  const tInicio = Date.now();

  process.stdout.write(
    `[${numero}/${testes.length}] ${teste.descricao}${teste.foto ? ` (foto: ${teste.foto})` : ""} ... `
  );

  try {
    const contents = [];
    if (teste.foto) {
      const fotoPath = path.join(FOTOS_DIR, teste.foto);
      const fotoBytes = await fs.readFile(fotoPath);
      contents.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: fotoBytes.toString("base64"),
        },
      });
    }
    contents.push({ text: teste.prompt });

    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
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
