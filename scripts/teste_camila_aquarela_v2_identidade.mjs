// =====================================================
// TESTE V2 — 3 posts aquarela densa COM Camila + texto
// Refinamento da V1: identidade facial reforçada
// Camila tem cabelo CASTANHO-ESCURO (quase preto), olhos amendoados, sobrancelhas arqueadas
// IMG_3629 (close-up frontal) usada SEMPRE como primeira referência
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
  "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\IMAGENS\\_testes_aquarela_v2_identidade_2026-05-19";

// ---------- IDENTIDADE FACIAL DETALHADA ----------
const IDENTITY_LOCK = `IDENTITY LOCK — the two reference photographs above show Dr. Camila Slobodticov. CRITICAL: the woman in the watercolor must be UNMISTAKABLY the same person from the photographs. Even though the style is watercolor (not photography), her facial features must remain RECOGNIZABLE.

DR. CAMILA'S SPECIFIC FEATURES (paint these accurately):
- Hair: VERY DARK BROWN, almost black, shoulder-length, naturally wavy with subtle warm honey highlights catching the light. NOT chestnut, NOT light brown, NOT auburn — very dark, near-black with mahogany depth.
- Eyes: dark brown, ALMOND-SHAPED with a slight upward tilt at the outer corners (a distinctive slightly-exotic eye shape).
- Eyebrows: defined, arched, dark brown matching her hair, NOT thin or sparse — they have shape and presence.
- Skin: warm fair complexion with subtle golden undertone, NOT pale-white, NOT olive.
- Face shape: oval with clearly defined high cheekbones, slightly angular jawline.
- Nose: straight medium bridge, gently rounded tip.
- Lips: medium-full, the lower lip slightly fuller than the upper, soft natural curve.
- Expression: warm, confident, intelligent presence. Subtle smile or serene composure.

Render these features in the watercolor — even though the technique is loose washes, the SHAPE of her face, the COLOR of her hair, the SHAPE of her eyes, and the WARMTH of her skin must match the reference photographs.`;

const NEGATIVE_PROMPT = `NEGATIVE: no photorealism, no 3D render, no plastic skin, no glossy CGI, no AI-generated look, no harsh contrast, no oversaturation, no neon colors, no magenta, no hot pink, no fluorescent, no digital vector look, no flat illustrator style, no cartoon, no anime, no anatomical errors, no extra fingers, no garbled text, no misspellings, no missing portuguese accents, no watermark, no logo overlay, no light hair, no blonde, no chestnut hair, no auburn hair, no straight thin lips, no thin sparse eyebrows, no round wide-open eyes, no pale white skin, no different person`;

const WATERCOLOR_TECHNIQUE = `WATERCOLOR TECHNIQUE: true traditional watercolor painted on cotton Arches paper. Wet-on-wet washes with visible bleeding edges. Pigment granulation visible. Soft hard-line where the brush stopped against dry paper. Multiple translucent layers showing through. Intentional pigment splatters add hand-painted authenticity. Visible paper tooth showing through the color. NOT digital — must look like real water on cotton fiber.`;

const ORNAMENT_LAYER = `ORNAMENTAL ART NOUVEAU LAYER (subtle): thin fine warm gold #D4AF37 ink linework on top of the watercolor — a delicate organic curve framing one side, two or three tiny botanical curlicues, one small ornamental star or dot. The gold ink looks HAND-DRAWN with a fine nib pen. Restrained, never overwhelming.`;

// =====================================================
// 3 POSTS (mesmas headlines da V1, identidade reforçada)
// =====================================================
const testes = [
  // ─────────────────────────────────────────────
  // POST 1 — "Sua pele, em primeiro lugar"
  // ─────────────────────────────────────────────
  {
    nome: "01_aquarela_v2_sua_pele_primeiro_lugar",
    descricao: "Post 1 — Sua pele, em primeiro lugar (V2 identidade)",
    fotos: ["IMG_3629.jpg", "IMG_3690.jpg"],
    prompt: `${IDENTITY_LOCK}

CREATE a dense, layered, editorial watercolor illustration for an Instagram post by Camila Estética (premium aesthetic clinic in Bauru, exclusively for women).

SCENE: Dr. Camila is painted in three-quarter view, visible from collarbone up. Her face is rendered in soft cream watercolor washes — eyes gently closed or half-lidded in serene contemplation, a faint warm smile playing on her lips, her right hand softly raised near her collarbone in a gesture of self-care. Her DARK BROWN ALMOST-BLACK hair flows in confident washes with subtle honey-brown highlights catching imagined light, shoulder-length and wavy. Her ARCHED DARK eyebrows and ALMOND eyes (suggested but recognizably hers) are visible. She wears a suggested cream silk camisole (just soft wash hints at the neckline).

DENSE BOTANICAL LAYER: surround her with abundant trailing botanicals — three full eucalyptus stems with rounded silver-sage leaves wrapping around her left side and reaching above her head, two large white peonies in soft pink blush bloom at her right (one near her shoulder, one lower near her hand), several smaller wildflower sprigs and tiny round leaves scattered through the composition, a few loose petals falling. The botanicals OVERLAP HER softly. Multiple watercolor layers visible.

PALETTE STRICTLY: cream paper #FBF7F4 background with paper tooth, very dark brown hair #3A2A20 with honey highlights #B89070, warm fair skin wash with golden undertone, sage-green #B5C5B0 (eucalyptus), whisper pink #FCE4EC and soft rosé #F8D7DE (peony petals), soft terracotta #C4906E for warm depth, warm gold #D4AF37 (ornamental linework). Pigment splatters in rosé and sage.

TYPOGRAPHY (clean over slightly clearer area, upper-left third):
- Headline serif (Playfair Display bold, ~58pt, color soft black #1A1A1A): "Sua pele,"
- Headline second line (Playfair Display italic, ~58pt, color soft rosé-mauve #B07590): "em primeiro lugar."
- Thin hand-drawn horizontal gold line #D4AF37, ~80px wide
- Subline (sans-serif Medium, uppercase, letter-spaced 0.15em, ~12pt, color #1A1A1A): "AVALIAÇÃO PERSONALIZADA · DRA. CAMILA SLOBODTICOV"
- Tiny line in gold #D4AF37 sans, ~10pt: "CAMILA ESTÉTICA · BAURU"

All Portuguese accents perfect.

${ORNAMENT_LAYER}

COMPOSITION: Vertical 4:5. Camila occupies the right half, botanicals fill around her crawling left into negative space. Text sits in the upper-left.

${WATERCOLOR_TECHNIQUE}

${NEGATIVE_PROMPT}`,
  },

  // ─────────────────────────────────────────────
  // POST 2 — "O ritual que sua pele pede"
  // ─────────────────────────────────────────────
  {
    nome: "02_aquarela_v2_ritual_que_sua_pele_pede",
    descricao: "Post 2 — O ritual que sua pele pede (V2 identidade)",
    fotos: ["IMG_3629.jpg", "IMG_3677.jpg"],
    prompt: `${IDENTITY_LOCK}

CREATE a dense, layered, editorial watercolor illustration for an Instagram post by Camila Estética.

SCENE: Dr. Camila is painted in a soft side three-quarter — her face turned to the right in serene contemplation, eyes half-closed in a gentle gesture, a quiet whisper of a smile. She is holding a single small white peony stem delicately near her face (the flower at temple level, her hand softly cradling the stem at her chest level). Her cheekbone catches a soft cream highlight. Her VERY DARK BROWN ALMOST-BLACK hair flows in a long single wash with subtle warm honey highlights, slightly tousled and wavy, with a few loose strands rendered as fine wet pigment lines. Her ARCHED DARK eyebrows and ALMOND-SHAPED eyes (the distinctive slight upward tilt) are visible. She wears a suggested white linen shirt with open collar.

DENSE BOTANICAL LAYER: an abundant arrangement — a tall eucalyptus branch arches over the top with silver-sage round leaves trailing down, a cluster of three peonies in full bloom (one white, two pale pink) fills the lower-right corner, sprigs of small dried lavender stems vertical at the left, scattered fallen petals across the canvas. Several tiny leaves overlap her hair and shoulder.

PALETTE STRICTLY: cream paper #FBF7F4, very dark brown hair #3A2A20 with honey highlights #B89070, warm fair skin wash with golden undertone, sage-green #B5C5B0 (eucalyptus), whisper pink #FCE4EC and warm rosé #F8D7DE (peonies), muted lavender-gray #C8B6C9 (lavender stems), warm gold #D4AF37 (ornament). Rosé and sage pigment splatters.

TYPOGRAPHY (upper-right area, small clearer pocket):
- Headline serif (Playfair Display regular, ~52pt, color soft black #1A1A1A): "O ritual"
- Headline second line (Playfair Display italic, ~52pt, color soft rosé-mauve #B07590): "que sua pele pede."
- Small hand-drawn gold ornament curl below the headline
- Subline (sans-serif Medium, uppercase, letter-spaced 0.15em, ~11pt, color #1A1A1A): "ESTÉTICA FACIAL EXCLUSIVA · BAURU"
- Tiny line in gold sans, ~9pt: "agende sua avaliação · direct"

All Portuguese accents perfect.

${ORNAMENT_LAYER}

COMPOSITION: Vertical 4:5. Camila centered slightly to the left, peony at temple as focal point. Botanicals arch over top and cluster at lower-right. Text in upper-right clear zone.

${WATERCOLOR_TECHNIQUE}

${NEGATIVE_PROMPT}`,
  },

  // ─────────────────────────────────────────────
  // POST 3 — "Naturalidade é uma escolha"
  // ─────────────────────────────────────────────
  {
    nome: "03_aquarela_v2_naturalidade_e_escolha",
    descricao: "Post 3 — Naturalidade é uma escolha (V2 identidade)",
    fotos: ["IMG_3629.jpg", "IMG_3812.jpg"],
    prompt: `${IDENTITY_LOCK}

CREATE a dense, layered, editorial watercolor illustration for the brand manifesto Instagram post by Camila Estética.

SCENE: Dr. Camila is painted in three-quarter view from the chest up, her gaze directed softly downward-left in quiet confidence, eyes half-lidded in calm composure (NOT looking at camera). Her chin slightly lifted in dignified presence. Her hand is suggested at chest-level, fingers softly relaxed. She wears a suggested white linen physician's coat with open collar — soft cream washes hint at fabric folds. Her VERY DARK BROWN ALMOST-BLACK hair flows long in a confident wash, shoulder-length wavy with honey highlights, one loose strand crossing her temple. Her ARCHED DARK eyebrows and ALMOND-SHAPED slightly upturned eyes are clearly visible — her face must look UNMISTAKABLY like Dr. Camila from the references.

DENSE BOTANICAL LAYER (richest of the three — manifesto post): a generous editorial frame of botanicals wraps the composition like a vintage botanical plate — eucalyptus branches arch over the top creating a soft canopy, a cluster of four peonies in mixed white and pale rosé blooms across the lower portion, small dried wheat stems and dried wildflowers fill side gaps, intentional fallen petals scattered, two or three suggested butterflies as loose pigment washes (not detailed).

PALETTE STRICTLY: cream paper #FBF7F4, very dark brown hair #3A2A20 with honey highlights, warm fair skin wash with golden undertone, rosé blush hints on cheekbone, sage-green #B5C5B0 (eucalyptus), whisper pink #FCE4EC and warm rosé #F8D7DE (peonies), muted ochre #D9C290 (dried wheat), warm gold #D4AF37 (ornamental linework — denser here), a hint of muted lavender #C8B6C9. Granulation visible, intentional splatters.

ORNAMENTAL LAYER (richer for manifesto): delicate Art Nouveau-style thin gold linework frame — a half-arch at the top center forming a soft halo behind her, two organic curves growing along the sides, a small ornamental ribbon-scroll detail at the bottom-center holding small tagline text.

TYPOGRAPHY:
- Top center, just above her head, tiny letter-spaced sans-serif uppercase (~10pt) gold #D4AF37: "CAMILA · ESTÉTICA"
- Headline below the figure (lower-third clear zone), large serif (Playfair Display bold, ~62pt, centered, color soft black #1A1A1A): "Naturalidade"
- Headline second line (Playfair Display italic, ~62pt, centered, color soft rosé-mauve #B07590): "é uma escolha."
- Below, small gold ribbon-scroll holds tiny italic serif (~12pt, color #1A1A1A): "estética facial · feita com tempo"
- At the very bottom, very small letter-spaced sans uppercase (~9pt, color #1A1A1A): "DRA. CAMILA SLOBODTICOV · BAURU"

All Portuguese accents perfect.

COMPOSITION: Vertical 4:5. Camila centered in upper two-thirds, framed by gold halo arch and botanical canopy. Text in lower third with gold ribbon-scroll. Symmetric-leaning, ritualistic, like an illuminated manuscript page reimagined as contemporary brand poster.

${WATERCOLOR_TECHNIQUE}

${NEGATIVE_PROMPT}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 Aquarela V2 (identidade reforçada) — ${testes.length} posts via ${MODEL}`);
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
    `[${numero}/${testes.length}] ${teste.descricao}\n  fotos: ${teste.fotos.join(", ")} ... `
  );

  try {
    const contents = [];
    for (const foto of teste.fotos) {
      const fotoPath = path.join(FOTOS_DIR, foto);
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
