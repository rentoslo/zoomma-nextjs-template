// =====================================================
// TESTE — 3 posts aquarela densa COM Camila + texto editorial
// Refinamento a partir do 02b (aquarela botânica delicada)
// Mais densidade, mais botânica, textos de Instagram integrados
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
  "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\IMAGENS\\_testes_aquarela_densa_2026-05-19";

// ---------- Trechos reutilizáveis ----------
const IDENTITY_REFERENCE = `The two reference photographs above show Dr. Camila Slobodticov — use them ONLY to capture her facial identity: her face shape, eye spacing, nose curve, lip shape, hair color (warm chestnut brown), hair length (shoulder-length), and skin tone. The output must be a WATERCOLOR ILLUSTRATION (NOT a photograph), but she must remain RECOGNIZABLE as the same woman. Her face is painted as soft watercolor washes — not drawn in detail, but capturing her essential likeness.`;

const NEGATIVE_PROMPT = `NEGATIVE: no photorealism, no 3D render, no plastic skin, no glossy CGI, no AI-generated look, no harsh contrast, no oversaturation, no neon colors, no magenta, no hot pink, no fluorescent, no digital vector look, no flat illustrator style, no cartoon, no anime, no anatomical errors, no extra fingers, no garbled text, no misspellings, no missing portuguese accents, no watermark, no logo overlay`;

const WATERCOLOR_TECHNIQUE = `WATERCOLOR TECHNIQUE: true traditional watercolor painted on cotton Arches paper. Wet-on-wet washes with visible bleeding edges where pigment flows into wet paper. Pigment granulation visible (real granular watercolor pigment, not digital brush). Soft hard-line where the brush stopped against dry paper. Multiple translucent layers showing through each other. Tiny intentional pigment splatters and natural specks add hand-painted authenticity. Visible paper tooth (the texture of cotton paper) showing through the color. NOT digital watercolor brush effect — must look like real water on fiber.`;

const ORNAMENT_LAYER = `ORNAMENTAL ART NOUVEAU LAYER (subtle, NOT maximalist): thin fine warm gold #D4AF37 ink linework added on top of the watercolor — a delicate organic curve framing one side of the composition, two or three tiny botanical curlicues, one small ornamental star or dot. The gold ink should look HAND-DRAWN with a fine nib pen, not vector. Restrained — only a few gold elements per composition, never overwhelming the watercolor.`;

// =====================================================
// 3 POSTS AQUARELA DENSA + CAMILA + TEXTO
// =====================================================
const testes = [
  // ─────────────────────────────────────────────
  // POST 1 — "Sua pele, em primeiro lugar"
  // Pilar: Educação (CTA avaliação)
  // ─────────────────────────────────────────────
  {
    nome: "01_aquarela_sua_pele_primeiro_lugar",
    descricao: "Post 1 — Sua pele, em primeiro lugar (CTA avaliação)",
    fotos: ["IMG_3690.jpg", "IMG_3812.jpg"],
    prompt: `${IDENTITY_REFERENCE}

CREATE a dense, layered, editorial watercolor illustration for an Instagram post by Camila Estética (premium aesthetic clinic in Bauru, exclusively for women).

SCENE: Dr. Camila is painted in three-quarter view, visible from collarbone up. Her face is rendered in soft cream watercolor washes — eyes gently closed in calm contemplation, slight peaceful smile, her right hand softly raised near her collarbone in a gesture of self-care. Her hair flows in a single confident wash of warm chestnut brown with visible water-pigment movement. She wears a suggested cream silk camisole (just soft wash hints at the neckline).

DENSE BOTANICAL LAYER (this is critical — the previous test was too sparse): surround her with abundant trailing botanicals: three full eucalyptus stems with rounded silver-sage leaves wrapping around her left side and reaching above her head, two large white peonies in soft pink blush bloom at her right (one near her shoulder, one lower near her hand), several smaller wildflower sprigs and tiny round leaves scattered through the composition, a few loose pétals falling. The botanicals OVERLAP HER softly (a leaf in front of her shoulder, a peony petal touching her hair) — she is EMBEDDED in the garden, not standing in front of it. Multiple watercolor layers visible — leaves on top of leaves, washes overlapping with bleeding edges.

PALETTE STRICTLY: cream paper #FBF7F4 background with visible paper tooth, soft chestnut #B89070 (hair, loose wash), barely-tinted skin wash, sage-green #B5C5B0 (eucalyptus leaves), whisper pink #FCE4EC and soft rosé #F8D7DE (peony petals), tiny touches of soft terracotta #C4906E for warm depth in shadows, warm gold #D4AF37 (ornamental linework only). Several intentional pigment splatters in soft rosé and sage.

TYPOGRAPHY INTEGRATED ON THE WATERCOLOR (painted clean over a slightly clearer area in the upper-left third):
- Headline serif (Playfair Display style, bold, ~58pt, color soft black #1A1A1A): "Sua pele,"
- Headline second line (Playfair Display italic, ~58pt, color soft rosé-mauve #B07590): "em primeiro lugar."
- Below: a thin hand-drawn horizontal gold line #D4AF37, ~80px wide
- Subline (sans-serif Medium, uppercase, letter-spaced 0.15em, ~12pt, color #1A1A1A): "AVALIAÇÃO PERSONALIZADA · DRA. CAMILA SLOBODTICOV"
- Tiny line below in same sans, ~10pt, gold #D4AF37: "CAMILA ESTÉTICA · BAURU"

All Portuguese accents must be perfect. Text must be perfectly legible.

${ORNAMENT_LAYER}

COMPOSITION: Vertical 4:5 (Instagram feed). Camila occupies the right half, botanicals fill around her and crawl into the negative space on the left. Text sits in the upper-left where the watercolor is slightly more open. Generous overall density but with a clear visual hierarchy: text → face → botanicals.

${WATERCOLOR_TECHNIQUE}

${NEGATIVE_PROMPT}`,
  },

  // ─────────────────────────────────────────────
  // POST 2 — "O ritual que sua pele pede"
  // Pilar: Cuidados / Autoridade
  // ─────────────────────────────────────────────
  {
    nome: "02_aquarela_ritual_que_sua_pele_pede",
    descricao: "Post 2 — O ritual que sua pele pede (autoridade)",
    fotos: ["IMG_3779.jpg", "IMG_3722.jpg"],
    prompt: `${IDENTITY_REFERENCE}

CREATE a dense, layered, editorial watercolor illustration for an Instagram post by Camila Estética.

SCENE: Dr. Camila is painted in a soft side profile — her face turned to the right in serene contemplation, eyes half-closed in a gentle gesture. She is holding a single small white peony stem delicately near her face (the flower at temple level, her hand softly cradling the stem at her chest level). Her cheekbone catches a soft cream highlight from imaginary morning light. Her hair flows in a long single wash of warm chestnut brown, slightly tousled, with a few loose strands rendered as fine wet pigment lines. She wears a suggested white linen shirt with open collar — just hints of fabric washes.

DENSE BOTANICAL LAYER (richer than before): an abundant botanical arrangement surrounds her — a tall eucalyptus branch arches over the top of the composition with silver-sage round leaves trailing down, a cluster of three peonies in full bloom (one white, two pale pink) fills the lower-right corner, sprigs of small dried lavender stems vertical at the left, scattered fallen petals across the canvas. Several tiny leaves overlap her hair and shoulder. The composition feels like she's emerging from a luxurious herbarium.

PALETTE STRICTLY: cream paper #FBF7F4 with paper tooth, soft chestnut #B89070 (hair), barely-tinted skin wash, sage-green #B5C5B0 (eucalyptus), whisper pink #FCE4EC and warm rosé #F8D7DE (peonies), muted lavender-gray #C8B6C9 (lavender stems), warm gold #D4AF37 (ornament linework). A few rosé and sage pigment splatters add hand-painted authenticity.

TYPOGRAPHY INTEGRATED ON THE WATERCOLOR (painted in the upper-right area where the composition has a small clearer pocket):
- Headline serif (Playfair Display style, regular weight, ~52pt, color soft black #1A1A1A): "O ritual"
- Headline second line (Playfair Display italic, ~52pt, color soft rosé-mauve #B07590): "que sua pele pede."
- A small hand-drawn gold ornament (a tiny curl) below the headline
- Subline (sans-serif Medium, uppercase, letter-spaced 0.15em, ~11pt, color #1A1A1A): "ESTÉTICA FACIAL EXCLUSIVA · BAURU"
- Tiny line in gold sans, ~9pt: "agende sua avaliação · direct"

All Portuguese accents perfect. Text crisp and legible.

${ORNAMENT_LAYER}

COMPOSITION: Vertical 4:5. Camila is centered slightly to the left, the peony at her temple becomes a focal point. Botanicals form a soft arch over the top of the composition and cluster at the lower-right. Text fits in the upper-right small clear zone.

${WATERCOLOR_TECHNIQUE}

${NEGATIVE_PROMPT}`,
  },

  // ─────────────────────────────────────────────
  // POST 3 — "Naturalidade é uma escolha"
  // Pilar: Manifesto / Autoridade da marca
  // ─────────────────────────────────────────────
  {
    nome: "03_aquarela_naturalidade_e_escolha",
    descricao: "Post 3 — Naturalidade é uma escolha (manifesto da marca)",
    fotos: ["IMG_3677.jpg", "IMG_3831.jpg"],
    prompt: `${IDENTITY_REFERENCE}

CREATE a dense, layered, editorial watercolor illustration for an Instagram post by Camila Estética — this post is the brand manifesto.

SCENE: Dr. Camila is painted in three-quarter view from the chest up, her gaze directed softly downward-left in quiet confidence (not at the camera, eyes half-lidded in calm). Her chin is slightly lifted in dignified composure. Her hand is suggested at her chest-level, fingers softly relaxed. She wears a suggested white linen physician's coat with open collar — soft cream washes hint at fabric folds. Her hair flows long in a confident chestnut wash, with one loose strand crossing her temple.

DENSE BOTANICAL LAYER (the richest of the three — this is the manifesto post): a generous editorial frame of botanicals wraps the entire composition like a vintage botanical illustration plate — eucalyptus branches arch over the top creating a soft canopy, a cluster of four peonies in mixed white and pale rosé blooms across the lower portion, small dried wheat stems and dried wildflowers fill the side gaps, a few intentional fallen petals scattered across the canvas, two or three tiny butterflies suggested as the loosest watercolor washes (just soft pigment hints, not detailed). The whole composition feels like an antique illuminated manuscript page reimagined.

PALETTE STRICTLY: cream paper #FBF7F4, soft chestnut #B89070 (hair), barely-tinted warm cream skin wash with rosé blush hints on cheekbone, sage-green #B5C5B0 (eucalyptus), whisper pink #FCE4EC and warm rosé #F8D7DE (peonies), muted ochre #D9C290 (dried wheat), warm gold #D4AF37 (ornamental linework — denser here than in other posts but still restrained), a hint of muted lavender #C8B6C9. Granulation visible in pigments. Several intentional splatters.

ORNAMENTAL LAYER (richer for the manifesto post): a delicate Art Nouveau-style thin gold linework frame — a half-arch at the top center forming a soft halo behind her, two organic curves growing along the sides, a small ornamental ribbon-scroll detail at the bottom-center holding the small tagline text. Restrained, elegant, NEVER busy.

TYPOGRAPHY INTEGRATED ON THE WATERCOLOR:
- Top center, just above her head, in tiny letter-spaced sans-serif uppercase (~10pt) gold #D4AF37: "CAMILA · ESTÉTICA"
- Headline below the figure in the lower-third clear zone, large serif (Playfair Display, bold, ~62pt, centered, color soft black #1A1A1A): "Naturalidade"
- Headline second line just below (Playfair Display italic, ~62pt, centered, color soft rosé-mauve #B07590): "é uma escolha."
- Below that, the small gold ribbon-scroll holds a tiny line in italic serif (~12pt, color #1A1A1A): "estética facial · feita com tempo"
- At the very bottom, very small letter-spaced sans uppercase (~9pt, color #1A1A1A): "DRA. CAMILA SLOBODTICOV · BAURU"

All Portuguese accents perfect. Text crisp and elegant. Hierarchy: NATURALIDADE is the largest visual element after the figure.

COMPOSITION: Vertical 4:5. Camila is centered in the upper two-thirds, framed by the gold halo arch and the botanical canopy. Text occupies a clear zone in the lower third with the gold ribbon-scroll detail. The composition is symmetric-leaning, ritualistic, like an illuminated manuscript page reimagined as a contemporary brand poster.

${WATERCOLOR_TECHNIQUE}

${NEGATIVE_PROMPT}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 Aquarela densa + Camila — ${testes.length} posts via ${MODEL}`);
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
