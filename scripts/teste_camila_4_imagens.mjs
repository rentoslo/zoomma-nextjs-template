// =====================================================
// TESTE — 4 imagens da Camila Estética (nano-banana-pro)
// 2 image-to-image (Variação A e B + texto)
// 2 referência artística (Skin Ritual Editorial)
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
  "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\IMAGENS\\_testes_2026-05-19";

// ---------- Trechos reutilizáveis ----------
const PRESERVE_IDENTITY = `CRITICAL: preserve the exact identity, facial features, hair, eyes, skin tone, and likeness of Dr. Camila Slobodticov as shown in the input photograph(s) with absolute fidelity. Do not alter her face, eyes, mouth, smile, skin tone, hair color, or any defining feature. She must be unmistakably the same person.`;

const NEGATIVE_PROMPT = `no plastic skin, no over-smoothing, no waxy texture, no symmetrical AI face, no cartoon, no illustration, no 3D render look, no garish saturation, no neon pink, no magenta, no hot pink, no fuchsia, no harsh shadows, no dramatic chiaroscuro, no cold blue tones, no stock photo aesthetic, no watermarks, no logo overlay, no garbled text, no misspellings, no missing accents, no extra fingers, no anatomical errors, no AI artifacts, no facial alteration, no different person`;

const ANTI_AI_REALISM = `photographic realism, real skin texture with visible pores and subtle fine lines, single loose strand of hair near temple, natural light from a single window casting soft directional shadow, subtle film grain like Kodak Portra 400, medium-format depth of field (Hasselblad 85mm f/2.0 look), slightly desaturated cream-and-white tones, editorial magazine aesthetic, NOT digital art, NOT AI-generated look`;

// =====================================================
// 4 TESTES
// =====================================================
const testes = [
  // ---------- TESTE 1 — Image-to-image — Variação A (White Premium) ----------
  {
    nome: "01_i2i_VarA_white_premium",
    descricao: "Image-to-image — Variação A White Premium + texto editorial",
    modo: "i2i",
    fotos: ["IMG_3677.jpg"],
    prompt: `${PRESERVE_IDENTITY}

EDIT THIS PHOTOGRAPH into a premium editorial Instagram post for Camila Estética (a high-end aesthetic clinic exclusively for women in Bauru/SP):

1. Keep the woman EXACTLY as she is — face, expression, hair, eyes, smile, makeup must remain identical and recognizable as Dr. Camila Slobodticov.

2. REPLACE the background entirely with a pure white #FFFFFF dominant premium editorial background — airy, breathing negative space, soft diffused natural light from a window, subtle warm cream undertones #FBF7F4 in the corners. Background must feel like a luxury skincare magazine spread (Vogue, Harper's Bazaar) — NOT a clinic, NOT a studio backdrop.

3. ADD a translucent frosted-glass panel (glassmorphism effect): a semi-transparent white rectangle at 75% opacity with subtle backdrop blur, soft rounded corners (24px radius), very soft drop shadow. The panel sits on the right side of the frame, occupying about 40% of the width vertically centered.

4. ON the glass panel, render the following text with elegant typography integrated cleanly into the image:
   - Headline (Playfair Display serif, bold, ~52pt, color #1A1A1A): "Sua pele,"
   - Headline continuation (Playfair Display serif italic, ~52pt, color #D4A5B5): "em primeiro lugar."
   - A thin horizontal accent line color #D4AF37 (soft gold), 1px, ~80px wide, below headline
   - Subline (sans-serif Medium, uppercase, letter-spaced, ~14pt, color #1A1A1A): "AVALIAÇÃO PERSONALIZADA · DRA. CAMILA SLOBODTICOV"
   Typography must be crisp, perfectly legible, with all Portuguese accents intact.

5. Add the photograph framed inside a thick white border with rounded corners (16px radius), centered-left in the composition, occupying ~50% of the frame width. The frame creates a "photo on paper" feel.

6. Soft diffused natural light overall, color temperature 5500K with subtle warmth. Generous negative space.

7. Final aspect ratio 4:5 (Instagram feed).

${ANTI_AI_REALISM}

${NEGATIVE_PROMPT}`,
  },

  // ---------- TESTE 2 — Image-to-image — Variação B (Soft Pink Veil) ----------
  {
    nome: "02_i2i_VarB_soft_pink_veil",
    descricao: "Image-to-image — Variação B Soft Pink Veil + texto editorial",
    modo: "i2i",
    fotos: ["IMG_3722.jpg"],
    prompt: `${PRESERVE_IDENTITY}

EDIT THIS PHOTOGRAPH into a premium editorial Instagram post for Camila Estética:

1. Keep the woman EXACTLY as she is — face, hair, expression, eyes, makeup must remain identical and recognizable as Dr. Camila Slobodticov.

2. REPLACE the background entirely with a soft whispered pink #FCE4EC veil background — a gentle wash, desaturated, almost-white with barely a hint of pink. NEVER saturated pink, NEVER magenta. Imagine a luxury rose petal wash, very lavada, very delicate. Add subtle warm cream highlights #FBF7F4 at the edges.

3. The photograph of the woman should be FRAMED inside a thick white border with rounded corners (20px radius), centered in the upper-half of the composition, occupying about 55% of the frame width.

4. BELOW the framed photograph, render the following text with elegant typography:
   - Headline (Playfair Display serif, regular weight, ~46pt, color #1A1A1A, centered): "Estética facial"
   - Headline second line (Playfair Display serif italic, ~46pt, color #D4A5B5, centered): "exclusiva para mulheres."
   - Below: a tiny soft gold #D4AF37 dot or thin line ornament (5px) as separator
   - Subline (sans-serif Medium, uppercase, letter-spaced 0.15em, ~13pt, color #1A1A1A, centered): "BAURU · ATENDIMENTO PERSONALIZADO"

5. Generous negative space all around. The mood is delicate, feminine, premium-accessible, like a petal floating on white paper.

6. Soft diffused natural light, color temperature 5500K. Add subtle natural film grain. Slightly desaturated palette.

7. Final aspect ratio 4:5 (Instagram feed).

${ANTI_AI_REALISM}

${NEGATIVE_PROMPT}`,
  },

  // ---------- TESTE 3 — Referência artística — Skin Ritual: Botânica calma ----------
  {
    nome: "03_skinritual_botanica_calma",
    descricao: "Referência artística — Skin Ritual Editorial / Botânica calma",
    modo: "ref",
    fotos: ["IMG_3690.jpg", "IMG_3812.jpg"],
    prompt: `${PRESERVE_IDENTITY}

The reference photographs above are ONLY for facial identity — preserve her exact face and recognizable likeness. RECOMPOSE the scene completely as a brand-new editorial photograph for Camila Estética (premium aesthetic clinic in Bauru exclusively for women).

SCENE — "Botanical Stillness":
A serene morning composition. Dr. Camila is seated in three-quarter profile, her face turned slightly toward soft window light coming from the left. She wears a delicate cream silk robe with subtle satin sheen (no logo, no text on garment). Her right hand rests gently near her collarbone, fingers relaxed and natural, with realistic anatomy. Her gaze is contemplative, directed softly toward the lower-left — not at the camera.

ENVIRONMENT:
A minimalist premium spa interior. Behind her, a single tall eucalyptus branch in a clear glass vase, slightly out of focus. To her left, a white peony in soft focus. The background is a clean cream wall #F8F2EC with a hint of natural texture (limewash plaster). Sheer linen curtain edge visible to the far left, allowing a soft beam of warm light to enter.

LIGHT & ATMOSPHERE:
Single window light, color temperature 5200K with subtle warm undertone. Chiaroscuro is soft — gentle highlights on her cheekbone and jawline, very soft shadows on the opposite side. A hint of atmospheric haze (like steam from herbal tea, very subtle).

CAMERA & LENS:
Medium-format aesthetic, Hasselblad 85mm equivalent at f/2.0. Shallow depth of field — her face is tack sharp, the eucalyptus and background are in dreamy creamy bokeh. Slight Kodak Portra 400 film emulation, subtle grain, true-to-life color science.

COMPOSITION:
Vertical 4:5 portrait orientation. She occupies the right two-thirds; generous breathing negative space on the upper-left where soft light falls. No text overlay. Pure editorial photography mood — feels like a page from Kinfolk or Cereal Magazine, NOT a clinical brochure.

MOOD:
Quiet, ritualistic, feminine, contemplative. The "silent ritual" of a woman who has chosen self-care as a daily practice. Premium without being ostentatious. Botanical without being literal.

${ANTI_AI_REALISM}

${NEGATIVE_PROMPT}`,
  },

  // ---------- TESTE 4 — Referência artística — Skin Ritual: Linho e Luz ----------
  {
    nome: "04_skinritual_linho_e_luz",
    descricao: "Referência artística — Skin Ritual Editorial / Linho e Luz",
    modo: "ref",
    fotos: ["IMG_3779.jpg", "IMG_3831.jpg"],
    prompt: `${PRESERVE_IDENTITY}

The reference photographs above are ONLY for facial identity — preserve her exact face and recognizable likeness. RECOMPOSE the scene completely as a brand-new editorial photograph for Camila Estética.

SCENE — "Linen & Light":
A pure editorial portrait. Dr. Camila stands in soft side-light, her body turned in a gentle three-quarter pose toward a tall window with sheer linen curtain. She is in counter-light (light coming from behind-left), the linen curtain diffusing it into a luminous halo around her silhouette. Her face catches a soft rim of warm light along the cheekbone and the bridge of her nose. Eyes lowered slightly, expression serene — almost a half-smile of quiet confidence.

WARDROBE:
A simple, beautifully tailored crisp white linen shirt, top button open. No collar showing logo. No accessories except possibly a delicate thin gold chain barely visible. Hair styled naturally, slightly tousled, a single loose strand near the temple.

ENVIRONMENT:
The room is almost empty — minimalist Belgian-design aesthetic. A textured warm-white wall #FBF7F4. The sheer linen curtain visible to the left, gently caught in soft draft. The floor surface implied but not central (cream travertine or pale oak). A single thin silhouette of a dried wheat stem or olive branch in a tall ceramic vase, far in the background, very out of focus.

LIGHT & ATMOSPHERE:
Late-morning sun through a north-facing window diffused by linen. Color temperature 5500K, slight warm cast 3200K hint near her skin (like the sun is just turning amber). Visible volumetric light rays through the linen (subtle, not theatrical). Air has a soft hazy quality — like a photograph taken at 10am in spring.

CAMERA & LENS:
Medium-format, Hasselblad 100mm equivalent at f/2.2. Depth of field shallow but not extreme — her face perfectly sharp, the curtain and background dissolve into soft cream bokeh. Phase One color science. Subtle Kodak Portra 400 grain.

COMPOSITION:
Vertical 4:5 portrait. She is centered slightly to the right, the window/curtain to her left fills the upper-left third with luminous diffused light. Negative space at top of frame breathes. No text overlay. This is pure photography — magazine editorial spread.

MOOD:
Quiet authority. Feminine, sophisticated, calm. Like a Helmut Newton photograph if Helmut Newton shot Cereal Magazine — soft, elegant, never sterile. The woman is the subject, but the light tells the story.

${ANTI_AI_REALISM}

${NEGATIVE_PROMPT}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 Teste Camila Estética — ${testes.length} imagens via ${MODEL}`);
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
      throw new Error(
        `Resposta sem imagem. Parts: ${JSON.stringify(parts.map((p) => Object.keys(p)))}`
      );
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
