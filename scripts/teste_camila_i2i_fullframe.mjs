// =====================================================
// TESTE — 3 posts image-to-image FULL-FRAME (sem polaroid)
// Camila ocupa o canvas inteiro edge-to-edge
// Texto sobre painéis glassmorphism translúcidos
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
  "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\IMAGENS\\_testes_i2i_fullframe_2026-05-19";

const PRESERVE_IDENTITY = `CRITICAL: preserve the exact identity, facial features, hair (very dark brown almost black, shoulder-length, naturally wavy), almond-shaped slightly upturned dark brown eyes, defined arched eyebrows, warm fair skin with golden undertone, oval face with high cheekbones, lips and smile of Dr. Camila Slobodticov as shown in the input photograph. Do not alter her face. She must be unmistakably the same person.`;

const NO_FRAME_RULE = `CRITICAL COMPOSITION RULE — NO INNER PHOTO FRAME: the photograph must occupy the ENTIRE canvas edge-to-edge. ABSOLUTELY NO white border around the photo, NO rounded photo frame, NO polaroid effect, NO inner rectangle containing the image. The woman fills the frame fully as if this were a true full-bleed editorial magazine cover. Background extends to all four canvas edges seamlessly.`;

const NEGATIVE_PROMPT = `NEGATIVE: no inner photo frame, no white border around photo, no polaroid frame, no rounded photo container, no photo-within-photo composition, no scrapbook effect, no photo card aesthetic, no plastic skin, no over-smoothing, no waxy texture, no AI-generated look, no harsh contrast, no oversaturated colors, no neon pink, no magenta, no hot pink, no fluorescent, no cold blue tones, no garbled text, no misspellings, no missing portuguese accents, no watermark, no logo overlay, no anatomical errors, no different person, no facial alteration`;

// =====================================================
// 3 POSTS FULL-FRAME
// =====================================================
const testes = [
  // ─────────────────────────────────────────────
  // POST 1 — Variação A White Premium full-bleed
  // ─────────────────────────────────────────────
  {
    nome: "01_i2i_fullframe_VarA_sua_pele_merece_tempo",
    descricao: "Post 1 — VarA White Premium · Sua pele, merece tempo",
    fotoBase: "IMG_3629.jpg",
    prompt: `${PRESERVE_IDENTITY}

EDIT THIS PHOTOGRAPH into a premium editorial Instagram post for Camila Estética (high-end aesthetic clinic exclusively for women in Bauru/SP):

1. Keep Dr. Camila exactly as she is — her face, expression, hair, eyes, smile, makeup, the burgundy/bordeaux sweater and gold medallion necklace must remain identical and unmistakably her.

2. REPLACE the dark studio background completely with a pure white #FFFFFF dominant premium editorial environment with subtle warm cream undertones #FBF7F4 — airy, breathing, with soft diffused natural light coming gently from the upper-left as if from a large window. Add subtle atmospheric haze, a hint of out-of-focus pale botanical silhouette (eucalyptus shadow) on the far right edge. The background must feel like a luxury skincare magazine spread — NOT a clinic, NOT a studio.

3. ${NO_FRAME_RULE}

4. ADD a translucent frosted-glass panel (glassmorphism) sitting on the LEFT SIDE of the composition occupying about 38% of the width vertically centered — a semi-transparent white rectangle at 72% opacity with subtle backdrop blur, soft rounded corners (28px radius), and very soft drop shadow. The panel is THE container for typography — it floats on top of the full-bleed photograph.

5. ON the glass panel, render the following text with elegant typography integrated perfectly:
   - Headline 1 (Playfair Display serif, bold, ~56pt, color soft black #1A1A1A): "Sua pele,"
   - Headline 2 (Playfair Display serif italic, ~56pt, color soft rosé-mauve #B07590): "merece tempo."
   - A thin horizontal accent line color soft gold #D4AF37, 1px, ~70px wide, just below the headline
   - Subline (sans-serif Medium, uppercase, letter-spaced 0.18em, ~12pt, color #1A1A1A): "AVALIAÇÃO PERSONALIZADA"
   - Tiny line below in same sans, ~10pt, color soft gold #D4AF37: "CAMILA ESTÉTICA · BAURU"
   All Portuguese accents perfect.

6. Color temperature soft 5500K with subtle warmth. Generous negative space inside the photograph around the typography panel.

7. Final aspect ratio 4:5 (Instagram feed). Full-bleed photograph — image extends to all four canvas edges.

${NEGATIVE_PROMPT}`,
  },

  // ─────────────────────────────────────────────
  // POST 2 — Variação B Soft Pink Veil full-bleed
  // ─────────────────────────────────────────────
  {
    nome: "02_i2i_fullframe_VarB_cada_mulher_sua_pele",
    descricao: "Post 2 — VarB Soft Pink Veil · Cada mulher, sua pele",
    fotoBase: "IMG_3690.jpg",
    prompt: `${PRESERVE_IDENTITY}

EDIT THIS PHOTOGRAPH into a premium editorial Instagram post for Camila Estética:

1. Keep Dr. Camila exactly as she is — her face, hair (very dark brown almost black, wavy, shoulder-length), expression, almond-shaped eyes, smile, and the white blouse must remain identical and unmistakably her. The cream tufted sofa context can stay subtly present but soften it.

2. REPLACE the wall background with a soft whispered pink #FCE4EC and rosé pétala #F8D7DE veil — a very gentle wash, desaturated, almost-white with barely a hint of pink. NEVER saturated, NEVER magenta. Add a hint of warm cream #FBF7F4 atmosphere in the upper-third like soft window light bleeding in. Optionally add a few suggested soft-focus white peony petals scattered in the negative space (very subtle, almost dissolving into the background).

3. ${NO_FRAME_RULE}

4. ADD a translucent frosted-glass panel (glassmorphism) sitting at the BOTTOM-RIGHT of the composition occupying about 45% of the width and ~32% of the height — a semi-transparent white rectangle at 70% opacity with subtle backdrop blur, soft rounded corners (24px radius), very soft drop shadow. The panel is the container for typography.

5. ON the glass panel, render the following text with elegant typography integrated perfectly:
   - Headline 1 (Playfair Display serif, regular weight, ~50pt, color soft black #1A1A1A): "Cada mulher,"
   - Headline 2 (Playfair Display serif italic, ~50pt, color soft rosé-mauve #B07590): "sua própria pele."
   - A small soft-gold #D4AF37 ornamental dot or thin curl after the headline
   - Subline (sans-serif Medium, uppercase, letter-spaced 0.18em, ~12pt, color #1A1A1A): "ESTÉTICA FACIAL EXCLUSIVA · BAURU"
   - Tiny line below in soft gold #D4AF37 sans, ~10pt: "vem pelo direct"
   All Portuguese accents perfect.

6. Color temperature 5500K with slight warmth, delicate atmospheric haze.

7. Final aspect ratio 4:5 (Instagram feed). Full-bleed photograph — image extends to all four canvas edges, NO inner frame.

${NEGATIVE_PROMPT}`,
  },

  // ─────────────────────────────────────────────
  // POST 3 — Variação A premium luxo + acento dourado
  // ─────────────────────────────────────────────
  {
    nome: "03_i2i_fullframe_VarA_estetica_sem_pressa",
    descricao: "Post 3 — VarA Premium · Estética facial, sem pressa",
    fotoBase: "IMG_3677.jpg",
    prompt: `${PRESERVE_IDENTITY}

EDIT THIS PHOTOGRAPH into a premium editorial Instagram post for Camila Estética (authority/manifesto post):

1. Keep Dr. Camila exactly as she is — her face, expression, hair (very dark brown wavy, shoulder-length), almond eyes, smile, and the white linen blouse must remain identical and unmistakably her. The window with sheer linen curtain to her left should stay as elegant context but slightly softened.

2. ENHANCE the background — keep the sheer linen curtain and soft window light but transform the right side (where the laptop and table are in the original) into a clean premium environment: a soft warm cream #FBF7F4 wall blending with the curtain light, a hint of out-of-focus eucalyptus or small white peony silhouette in the corner. Remove the laptop, smartphone and table — replace with breathing premium space. Maintain the warm natural light coming from the left through the linen.

3. ${NO_FRAME_RULE}

4. ADD a translucent frosted-glass panel (glassmorphism) sitting along the BOTTOM edge of the composition spanning ~85% of the width and ~26% of the height — a semi-transparent white rectangle at 68% opacity with subtle backdrop blur, soft rounded corners (20px radius), very soft drop shadow. The panel is the typography container, anchored at the bottom like a editorial magazine subtitle bar.

5. ON the glass panel, render the following text with elegant typography integrated perfectly, centered horizontally:
   - Tiny line at top of panel in soft gold #D4AF37 sans-serif uppercase letter-spaced 0.2em (~10pt): "CAMILA · ESTÉTICA"
   - Headline 1 (Playfair Display serif, bold, ~50pt, color soft black #1A1A1A): "Estética facial,"
   - Headline 2 (Playfair Display serif italic, ~50pt, color soft rosé-mauve #B07590): "sem pressa."
   - A thin horizontal soft gold #D4AF37 line, 1px, ~120px wide centered
   - Subline (sans-serif Medium, ~11pt, color #1A1A1A): "9 anos cuidando da pele feminina"
   - Tiny line in sans uppercase, letter-spaced 0.2em, ~9pt, color soft gold #D4AF37: "DRA. CAMILA SLOBODTICOV · BAURU"
   All Portuguese accents perfect.

6. ALSO add a small refined ornamental detail in the upper-right corner of the photograph: a tiny soft gold #D4AF37 thin Art Nouveau curl (just a hand-drawn fine curve, very small, ornamental). Restrained.

7. Color temperature warm 5200K, soft natural diffused light, slight haze.

8. Final aspect ratio 4:5 (Instagram feed). Full-bleed photograph — image extends to all four canvas edges.

${NEGATIVE_PROMPT}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 i2i Full-frame Camila — ${testes.length} posts via ${MODEL}`);
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
    `[${numero}/${testes.length}] ${teste.descricao}\n  foto: ${teste.fotoBase} ... `
  );

  try {
    const fotoPath = path.join(FOTOS_DIR, teste.fotoBase);
    const fotoBytes = await fs.readFile(fotoPath);
    const fotoBase64 = fotoBytes.toString("base64");

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: fotoBase64,
          },
        },
        { text: teste.prompt },
      ],
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
