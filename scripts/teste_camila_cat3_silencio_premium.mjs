// =====================================================
// TESTE — Categoria 3 (Silêncio Premium)
// 6 imagens sem texto · 3 técnicas (A still-life · B óleo · C macro)
// 2 cenas por técnica
// Usa helper de rotação para fotos da Camila quando necessário
// =====================================================
import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import {
  scanAvatarFolder,
  loadUsageLog,
  saveUsageLog,
  selectFotos,
  recordUsage,
  statusDoBanco,
  printStatus,
  printAlertaCiclo,
} from "./lib/foto_rotation.mjs";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  console.error("ERRO: GOOGLE_AI_API_KEY não encontrada em .env");
  process.exit(1);
}

const MODEL = "gemini-3-pro-image-preview";
const FOTOS_DIR = "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\fotos_avatar";
const LOG_PATH = path.join(
  import.meta.dirname,
  "..",
  "clientes",
  "camila-estetica",
  "assets",
  "foto_usage_log.json"
);
const OUTPUT_DIR =
  "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\IMAGENS\\_testes_cat3_silencio_premium_2026-05-19";

const SCRIPT_NAME = "teste_camila_cat3_silencio_premium.mjs";

const IDENTITY_REF = `IDENTITY — the reference photograph shows Dr. Camila Slobodticov. Her features: very dark brown almost black hair shoulder-length wavy, almond-shaped slightly-upturned dark brown eyes, defined arched dark brown eyebrows, warm fair skin with golden undertone, oval face with high cheekbones, medium-full lips. STYLIZE her per the artistic direction, BUT she must remain unmistakably recognizable.`;

const NEGATIVE_BASE = `NEGATIVE: no text, no typography, no headline, no captions, no watermark, no logo, no childlike illustration, no whimsical floral pattern, no cute aesthetic, no Pinterest-DIY look, no oversaturation, no neon, no magenta, no hot pink, no kindergarten art, no garish color, no different person if a reference photo is provided`;

// =====================================================
// RESOLVER FOTOS DA CAMILA (image-to-image para 2 das 6)
// =====================================================
const availableFotos = await scanAvatarFolder(FOTOS_DIR);
const log = await loadUsageLog(LOG_PATH);
const status = statusDoBanco(availableFotos, log);
const selection = selectFotos(2, availableFotos, log);
printStatus(status, selection.novas_no_banco);

const [FOTO_OLEO_RETRATO, FOTO_MACRO_PELE] = selection.fotos;
console.log(`   📸 Selecionadas para esta execução: ${selection.fotos.join(", ")}\n`);

// =====================================================
// 6 IMAGENS — sem texto, atmosfera pura
// =====================================================
const testes = [
  // ═══════════════════════════════════════════════
  // TÉCNICA A — EDITORIAL STILL-LIFE FOTOGRÁFICO
  // Aman / La Mer / Augustinus Bader vibes
  // ═══════════════════════════════════════════════
  {
    nome: "A1_stilllife_frasco_seda",
    tecnica: "A · Editorial Still-Life",
    descricao: "A1 · Frasco de cristal em superfície de seda creme",
    foto: null,
    prompt: `An ultra-premium editorial still-life photograph in the style of Aman resorts and Augustinus Bader campaigns — pure atmosphere, no text, no message.

SUBJECT: a single hand-cut crystal apothecary bottle (small, refined, no label) holding clear water. A single droplet hangs at the bottom of the bottle as if just falling. The bottle rests on a soft folded cream silk cloth that catches subtle warm shadow. Beside the bottle, a single fallen white peony petal, barely overlapping the silk.

LIGHT: soft directional natural window light from the left, color temperature 5200K with subtle warm cream tone. Sharp falloff into delicate shadow on the right. Slight atmospheric haze in the negative space (premium ambient air).

CAMERA: medium-format aesthetic, Hasselblad 100mm equivalent at f/2.8. Tack-sharp focus on the crystal facets catching light, depth of field falls off behind into creamy bokeh. Slight film grain, slightly desaturated palette. Cinematic stillness.

PALETTE: cream off-white #FBF7F4 background, deep silk shadow #E8DDD2, transparent crystal with cold-warm reflections, single hint of warm gold #D4AF37 on the water droplet (catching imaginary sunlight). Subtle, very subtle.

COMPOSITION: vertical 4:5. The bottle is centered slightly to the right with generous negative space on the left where light enters. Cinematic composition — every element placed with editorial intention. NO TEXT. NO LOGO. NO WATERMARK.

STYLE EMPHASIS: pure atmosphere, brand-quiet, premium hotel-spa campaign quality. The image whispers, it does not announce.

${NEGATIVE_BASE}`,
  },
  {
    nome: "A2_stilllife_petala_marmore",
    tecnica: "A · Editorial Still-Life",
    descricao: "A2 · Pétala caindo sobre mármore",
    foto: null,
    prompt: `An ultra-premium editorial still-life photograph in the spirit of Hermès and La Mer campaigns — pure atmosphere, no text.

SUBJECT: a single white peony petal caught mid-fall, frozen by the camera, hovering inches above a polished Calacatta marble surface. The petal is slightly tilted, catching directional light. The marble's natural veining (cream-and-soft-gray) is visible below, soft and warm. A few tiny water droplets scattered on the marble around where the petal will land.

LIGHT: high-key soft directional natural light from the upper-left, color temperature 5500K with warmth. The petal casts a delicate diffuse shadow on the marble. Slight atmospheric haze in the air.

CAMERA: medium-format aesthetic, 100mm equivalent at f/4. The petal is tack sharp, the marble extends slightly out of focus to the edges. Cinematic, slow-motion-feel. Slight film grain. Slightly desaturated.

PALETTE: warm Calacatta marble (cream-and-pale-gray with subtle gold-tinted veining), single white peony petal with whisper-pink blush at the edge, water droplets catching tiny light reflections. Restrained — no other colors.

COMPOSITION: vertical 4:5. The petal occupies the upper-center. The marble surface extends to the bottom of the frame. Generous breathing space. NO TEXT. NO LOGO.

STYLE EMPHASIS: Hermès-meets-La-Mer campaign. The image is a single perfect moment — beauty of the instant. Editorial fine art.

${NEGATIVE_BASE}`,
  },

  // ═══════════════════════════════════════════════
  // TÉCNICA B — PINTURA À ÓLEO EDITORIAL
  // (alternativa adulta à aquarela — peso de museu)
  // Vermeer, Jenny Saville suavizada, Lucian Freud light
  // ═══════════════════════════════════════════════
  {
    nome: "B1_oleo_retrato_camila",
    tecnica: "B · Pintura à Óleo",
    descricao: `B1 · Retrato à óleo da Camila (ref: ${FOTO_OLEO_RETRATO})`,
    foto: FOTO_OLEO_RETRATO,
    prompt: `${IDENTITY_REF}

Create a fine art OIL PAINTING portrait in the contemporary editorial style of Jenny Saville (softened) and Vermeer's "Girl with a Pearl Earring" — adult, museum-quality, NOT illustration, NOT watercolor.

SUBJECT: Dr. Camila in three-quarter view, looking softly away from the viewer, eyes lowered in serene composure. Her face captures her UNMISTAKABLE likeness: very dark brown almost-black hair sweeping naturally over one shoulder, defined arched dark eyebrows, almond-shaped slightly-upturned eyes (closed or half-lidded), full lips in soft natural color, oval face with high cheekbones, warm fair skin with golden undertone. She wears a soft cream-white silk wrap suggested in flowing visible brushstrokes (no logo, no detail).

PAINTING TECHNIQUE: real oil paint on linen canvas. VISIBLE BRUSHSTROKES — you can see the painter's hand, the build-up of impasto on her cheekbone highlight, the soft glazes on the skin, the thicker strokes on her hair. The painting style is Vermeer-warm with Jenny Saville's contemporary planarity (but softer, more flattering). The canvas texture is barely visible.

LIGHT: classic Vermeer side-light from the left, warm 4500K, gentle falloff into deep shadow on the right side of her face. The shadow side has subtle reflected warmth (no pure black). Hint of glow on the cheekbone.

PALETTE: dark warm background (deep umber #3D2C20 fading into chocolate shadow), warm fair skin tones with rosé undertones in the highlights and amber undertones in the shadows, very dark brown almost-black hair #2A1810 with subtle warm honey reflections, soft cream silk #E8DDD2, a single hint of muted rosé #B07590 on the lips.

COMPOSITION: vertical 4:5. She occupies the central-upper two-thirds. The dark warm background frames her like a Dutch Golden Age portrait. NO TEXT.

STYLE EMPHASIS: real oil painting, museum quality, contemporary classical. The painting style says "this is art that hangs framed on a wall" — not Instagram filter, not watercolor, not illustration. Adult, atemporal, deeply premium.

${NEGATIVE_BASE}, no watercolor, no flat illustration, no cartoon, no AI smoothness, no plastic skin`,
  },
  {
    nome: "B2_oleo_natureza_morta_peonia",
    tecnica: "B · Pintura à Óleo",
    descricao: "B2 · Natureza-morta à óleo · peônia em cristal",
    foto: null,
    prompt: `Create a fine art OIL PAINTING still-life in the contemporary classical style of Dutch Golden Age (Vermeer, Heda) reimagined with restraint — adult, museum-quality, NOT illustration, NOT watercolor.

SUBJECT: a single white peony with soft pink-blushed petals in full bloom, resting in a tall clear hand-cut crystal vase on a dark warm wood surface. Beside the vase, a single fallen petal and a small folded cream linen napkin. The composition is contemplative, restrained — Dutch still-life refined for today.

PAINTING TECHNIQUE: real oil paint on linen canvas. VISIBLE BRUSHSTROKES — heavy impasto on the peony's bright highlights, soft glazes on the petals' shadowed sides, thicker strokes on the linen, refined gloss on the crystal vase showing through with translucent paint layers. Slight canvas texture.

LIGHT: classic side-light from the upper-left, warm 4500K. The peony catches a bright highlight that reads as luxurious. Sharp falloff into deep shadow on the right. Drama is restrained — not theatrical, just classical.

PALETTE: deep warm background (dark umber #3D2C20 to chocolate shadow), warm wood surface tones #5C4030, white peony with whisper-pink blush #FCE4EC and soft rosé center #F8D7DE, crystal vase reflecting warm highlights, cream linen #E8DDD2. A single tiny gold reflection on the crystal where light catches.

COMPOSITION: vertical 4:5. The vase + peony occupy the central vertical axis, the linen sits in the lower-right, the fallen petal at the lower-left. Classical golden-ratio arrangement.

STYLE EMPHASIS: a Dutch master still-life as if painted today — restrained, museum-quality, adult. The painting style says "art that belongs in a serious collection". NO TEXT.

${NEGATIVE_BASE}, no watercolor, no flat illustration, no cartoon`,
  },

  // ═══════════════════════════════════════════════
  // TÉCNICA C — MACRO FOTOGRÁFICO (close abstrato)
  // Byredo / Aesop / editorial científico-belo
  // ═══════════════════════════════════════════════
  {
    nome: "C1_macro_pele_gota",
    tecnica: "C · Macro Fotográfico",
    descricao: `C1 · Macro de pele com gota d'água (ref: ${FOTO_MACRO_PELE})`,
    foto: FOTO_MACRO_PELE,
    prompt: `The reference photograph is used ONLY for skin tone reference — extract Dr. Camila's warm fair skin with golden undertone as the COLOR REFERENCE only. The output is NOT a portrait — it is an extreme macro abstract.

Create an ultra-premium MACRO PHOTOGRAPH in the editorial style of Byredo and Aesop campaigns — pure atmosphere, no text, no face visible.

SUBJECT: an extreme macro close-up of a portion of soft warm fair skin (collarbone, neck, or shoulder area, ABSTRACTED — no recognizable body part visible, just texture). A single perfectly round water droplet rests on the skin, catching directional light and creating a tiny lens that refracts the warm tone behind it. Around the droplet, a few finer water beads scatter. The skin shows realistic delicate texture (fine pores, soft natural sheen, occasional barely-visible vellus hair) — NOT smoothed, NOT plastic.

LIGHT: soft directional natural light, color temperature 5200K with golden undertone. The water droplet catches a sharp little highlight. Sharp falloff into soft warm shadow.

CAMERA: macro lens 100mm at f/2.8. The water droplet is tack sharp. The skin extends out of focus into creamy warm bokeh at the edges. Slight film grain.

PALETTE: warm fair skin tones #F5E8E0 to #E8D9CC, transparent water with cool-warm refraction, golden warm undertone throughout. Very monochromatic — restrained.

COMPOSITION: vertical 4:5. The water droplet is centered slightly to the right. The skin texture extends to all edges. Abstract — no recognizable feature. NO TEXT.

STYLE EMPHASIS: ultra-premium beauty campaign macro — Byredo, Aesop, La Mer quality. The image is intimate but not figurative. Editorial fine art.

${NEGATIVE_BASE}, no recognizable face, no plastic skin, no oversmoothed skin, no portrait, no eyes, no different texture`,
  },
  {
    nome: "C2_macro_linho_dourado",
    tecnica: "C · Macro Fotográfico",
    descricao: "C2 · Macro de tecido linho com fio dourado",
    foto: null,
    prompt: `Create an ultra-premium MACRO PHOTOGRAPH in the editorial style of Hermès and Bottega Veneta campaigns — pure atmosphere, no text.

SUBJECT: an extreme macro close-up of natural soft cream linen fabric in a subtle ripple, with a single fine warm gold thread woven through it (catching a delicate highlight). The linen has visible weave texture, slight natural irregularity, soft slubs. The gold thread is delicate, almost imperceptible at first, but catches the eye where the light hits it.

LIGHT: soft directional natural light from the upper-left, color temperature 5300K. The gold thread catches a small bright highlight. The linen creates soft micro-shadows in its weave.

CAMERA: macro lens 100mm at f/2.8. The gold thread is tack sharp. The linen extends out of focus at the edges into creamy soft bokeh. Slight film grain.

PALETTE: warm cream linen #FBF7F4 with subtle ivory undertones, fine warm gold thread #D4AF37 catching highlights. Restrained, refined, almost monochromatic.

COMPOSITION: vertical 4:5. The gold thread runs diagonally across the upper-third of the frame. The linen weave fills the rest. Abstract editorial composition. NO TEXT.

STYLE EMPHASIS: ultra-premium luxury house campaign — Hermès, Bottega Veneta quality. The image is a luxurious detail moment. Editorial fine art.

${NEGATIVE_BASE}, no logo, no embroidered text`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`🎨 Categoria 3 — Silêncio Premium · ${testes.length} imagens via ${MODEL}`);
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

    // Registrar uso da foto (só se foi usada de fato)
    if (teste.foto) {
      recordUsage(log, teste.foto, teste.nome, SCRIPT_NAME);
    }
  } catch (err) {
    console.log(`✗ ERRO: ${err.message}`);
    resultados.push({ nome: teste.nome, status: "erro", erro: err.message });
  }
}

// Salvar log atualizado
await saveUsageLog(LOG_PATH, log);

const totalSegundos = ((Date.now() - inicio) / 1000).toFixed(1);
const sucessos = resultados.filter((r) => r.status === "ok").length;
const falhas = resultados.filter((r) => r.status === "erro").length;

console.log(`\n${"=".repeat(60)}`);
console.log(`✅ ${sucessos} sucessos · ✗ ${falhas} falhas · ⏱  ${totalSegundos}s total`);
console.log(`📁 Arquivos em: ${OUTPUT_DIR}`);
console.log(`${"=".repeat(60)}`);

// Status final do banco
const statusFinal = statusDoBanco(availableFotos, log);
console.log(`\n📷 BANCO APÓS EXECUÇÃO`);
console.log(
  `   ${statusFinal.total_no_banco} fotos total · ${statusFinal.usadas_no_ciclo} usadas no ciclo ${statusFinal.ciclo} · ${statusFinal.disponiveis_no_ciclo} disponíveis`
);

printAlertaCiclo(selection.precisa_mais_fotos, selection.ciclo_atual);
