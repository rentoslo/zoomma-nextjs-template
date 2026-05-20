// TEMPLATE PARAMETRIZADO — Image-to-Image MODO 2 (preservar só cabeça)
// Reutilizável para qualquer pessoa: Renato, Bruno, Camila, Paola
//
// COMO USAR:
//   1. Importe este módulo em um script específico da pessoa (ex: gerar_renato_post.mjs)
//   2. Chame `gerarPostsPessoa({...})` com a configuração da pessoa e as cenas
//   3. Cada cena vira uma imagem com rosto/cabeça preservados da foto base
//
// EXEMPLO:
//   import { gerarPostsPessoa } from "./template_pessoa_head_preserve.mjs";
//
//   await gerarPostsPessoa({
//     pessoa: { nome: "renato", genero: "homem", fotoBase: "_MG_3700.jpg",
//               descricaoFisica: "professional Brazilian man in his 40s with short blond-gray hair, blue eyes, fair skin, warm confident smile" },
//     outputDir: "C:\\Users\\rento\\Downloads\\teste\\renato_referencia",
//     cenas: [
//       { nome: "01_escritorio", cenario: "...", roupa: "...", pose: "...", headline: "...", cta: "..." },
//       ...
//     ]
//   });

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
const FOTOS_BASE_DIR = "G:\\Meu Drive\\ZOOMMA\\IDENTIDADE VISUAL\\fotos_referencia";

const ASSINATURA_VISUAL = `IMPORTANT visual signature that must be present: a thin solid metallic gold vertical line color hex D4A574 exactly 1.5 pixels wide at 90 percent opacity, positioned at exactly 28 pixels from the left edge of the canvas, running uninterrupted from the very top edge to the very bottom edge of the image. This is the official Zoomma brand signature.`;

// ANATOMY CONSISTENCY — corrige o "stitch" entre cabeça preservada e corpo gerado
// Soluciona o "pescoço longo demais" e a sensação de "cabeça colada"
const ANATOMY_CONSISTENCY = `
ANATOMICAL CONSISTENCY (CRITICAL — prevent "floating head" / "long neck" defects):

Head-to-body connection:
- The head MUST connect naturally to the body with proper proportions
- Neck width: approximately 60-70 percent of the head width at jawline (NOT thin, NOT swan-like)
- Neck length: short and natural, about 1/4 of the head's vertical height visible above the collar (NOT elongated)
- The base of the neck must connect smoothly to the trapezius muscles and collarbones
- AVOID swan neck, elongated neck, giraffe neck, floating head, head-pasted-on-body look

Camera angle and perspective consistency:
- The body, shoulders, neck, and torso MUST be in the SAME camera angle and perspective as the head in the reference image
- If the reference head is shot frontally, the body must also be frontal
- If the reference head is at 3/4 angle, the body must follow the same 3/4 rotation
- The eyeline of the reference image must match the framing of the new composition

Lighting consistency:
- The direction, color temperature, and intensity of light on the body, neck, and clothing MUST match exactly the lighting on the face from the reference image
- If light comes from the left on the face, it must come from the left on the body
- Natural shadow under the jaw cast onto the neck (not absent, not exaggerated)

Skin tone continuity:
- The skin tone of the neck, décolletage, hands, and arms MUST match the skin tone of the face from the reference image
- Account for natural skin tone variation: neck slightly lighter than face, hands slightly weathered if outdoor scene
- NO visible color seam or mismatch between face and neck
- Smooth gradient transition with natural shadow integration

Framing specification:
- Generate a MEDIUM SHOT (waist-up framing) or COWBOY SHOT (mid-thigh up) showing the full natural anatomy
- Avoid extreme close-up that would only show head and shoulders awkwardly
- Avoid full body that would shrink the face too much
- The head should occupy approximately 12-18 percent of the total frame height

Pose naturalness:
- Subject's shoulders should be at a natural relaxed angle (NOT military-straight, NOT slumped)
- Slight asymmetry in shoulder height is natural and desired
- Subject's posture must match the head tilt of the reference image (if head is slightly tilted, the neck and shoulders must accommodate that tilt naturally)`;

// PHOTOREALISM BOOST — combate o "ar de IA" que aparece em outputs do Gemini 3 Pro Image
// Aplicado em TODA geração de pessoa por padrão
const PHOTOREALISM_BOOST = `
PHOTOREALISM REQUIREMENTS (CRITICAL — combat AI-look artifacts):

Camera and capture:
- Shot on Canon EOS R5 with RF 85mm f/1.4 L portrait prime lens (NOT medium format, NOT studio camera)
- Aperture f/2.0, shutter 1/200s, ISO 800 (not low ISO — high ISO gives natural noise)
- Adobe RGB color space, processed in Capture One with minimal retouching
- Kodak Portra 400 film emulation with visible authentic film grain structure
- Subtle halation around bright highlights typical of film photography

Skin (extremely important):
- Photorealistic skin texture with visible natural pores across face
- Visible fine lines around eyes and mouth (laugh lines, natural aging)
- Subtle uneven skin tone with slight redness on cheeks and tip of nose
- Natural skin oil shine on forehead and nose (T-zone reflection)
- Small natural skin imperfections preserved (faint freckle, small mark, fine vein)
- ZERO airbrushing, ZERO smoothing, ZERO beauty filter
- Skin is photojournalistic, not advertising-perfect

Eyes:
- Naturally slightly tired eyes (not magazine-perfect)
- Subtle single catchlight from the available light source (not multiple studio strobe catchlights)
- Slight redness in inner corners of eyes (natural)
- Asymmetric eyelid shape (eyes never perfectly symmetric in real people)
- Natural pupil dilation matching the ambient light
- NO glassy eyes, NO hyperreal eye shine

Hair:
- Natural flyaway hairs visible at edges
- Slight frizz showing real hair texture (not photoshopped perfection)
- Individual strands not perfectly groomed
- Asymmetric hair fall (one side different from the other)
- NO computer-generated perfect hair

Pose and expression:
- Candid documentary moment, subject caught mid-thought or mid-gesture
- Slightly asymmetric body posture (real people are never perfectly symmetric)
- Natural micro-expression (not posed smile)
- Slight imperfection in pose: shoulders not perfectly level, head slight tilt

Clothing:
- Natural fabric wrinkles and creases from real wear
- Slightly imperfect drape, not perfectly ironed
- Subtle lint, fabric texture visible
- Lived-in clothing, not display-store-new

Lighting:
- Available natural light only, NO studio strobes, NO ring lights, NO commercial setup
- Mixed color temperature creating subtle natural color cast
- Imperfect shadow distribution (some areas slightly under-exposed)
- Natural highlight rolloff on skin
- Soft natural shadow detail in dark areas

Composition:
- Documentary editorial style (Peter Lindbergh or Annie Leibovitz natural portraiture aesthetic)
- Slightly imperfect framing — not perfectly centered, not perfectly rule-of-thirds either
- Hint of motion in background or subject
- Natural depth of field with organic bokeh (not synthetic blur)

Post-processing:
- Minimal retouching, photojournalism style
- Color grading reminiscent of Kodak Portra 400 film
- Subtle film grain visible throughout
- Slight chromatic aberration at edges of frame
- NO HDR, NO over-saturation, NO commercial advertising glow

This image should be indistinguishable from a real editorial photograph shot by a professional documentary photographer using a Canon EOS R5 with 85mm prime lens and minimal post-processing.`;

const NEGATIVE_PROMPT =
  "no symmetry, no plastic skin, no porcelain skin, no airbrushed skin, no skin smoothing, no beauty filter, no Instagram filter, no AI face artifacts, no perfect dentition, no glassy eyes, no hyperreal eye shine, no over-saturated highlights, no perfect symmetry, no studio strobes, no ring light, no commercial advertising look, no hyperreal, no CGI, no 3D render, no octane render, no Unreal Engine render, no cartoon, no illustration, no AI artifacts, no harsh shadows, no stock photo aesthetic, no watermarks, no misspellings, no garbled text, no missing accents, no facial alteration, no different person, no duplicated text, no repeated words, no HDR, no over-saturation, no commercial glow, no swan neck, no elongated neck, no giraffe neck, no floating head, no head pasted on body, no anatomical mismatch, no disproportionate neck, no thin neck, no skin tone seam between face and neck, no lighting mismatch between head and body, no perspective mismatch";

/**
 * Constrói o prompt de edição preservando cabeça e regenerando o resto
 */
function construirPromptPreservarCabeca({ pessoa, cena }) {
  const sujeito = pessoa.genero === "mulher" ? "the woman" : "the man";

  return `CRITICAL HEAD PRESERVATION: preserve EXACTLY the face, head, hair, hairstyle, makeup, skin tone, eyes, smile, and expression of ${sujeito} from the input reference photograph. ${pessoa.descricaoFisica}. The face and head must remain absolutely identical to the reference — same features, same expression, same lighting on the face.

EDIT THIS PHOTOGRAPH for Instagram with the following changes:

1. PRESERVE: the head, face, hair, and expression of ${sujeito} exactly as in the reference image.

2. REGENERATE everything else completely:
   - CLOTHING: ${cena.roupa}
   - POSE: ${cena.pose}
   - BODY: natural body posture matching the new pose
   - SCENE/BACKGROUND: ${cena.cenario}

3. Apply Kinfolk magazine style color grading: warm honey tones, soft cream, golden afternoon light, color temperature ${cena.colorTemp || "3500K with warm amber undertones"}. Subtle natural film grain. Dreamy contemplative atmosphere.

4. Re-light the scene with soft natural diffused light from ${cena.iluminacao || "the left side"} creating gentle warm illumination. Keep the lighting on the face flattering and natural — do not alter face skin tone or facial highlights.

5. Composition: rule of thirds with ${sujeute(sujeito)} occupying the ${cena.posicaoFrame || "right two thirds"} of the frame, leaving the ${cena.posicaoOverlay || "upper-left"} negative space clean for typography overlay. Use a MEDIUM SHOT framing (waist-up) to ensure proper anatomical proportions between head, neck, and body.

${ANATOMY_CONSISTENCY}

${PHOTOREALISM_BOOST}

6. On the ${cena.posicaoOverlay || "upper-left"} negative space, add ONE single translucent warm beige overlay rectangle, color hex E8D9CC at 78 percent opacity, with soft rounded corners 16 pixels radius. Inside this overlay, render in deep navy color hex 2B3A4D using bold elegant serif Playfair Display style, the following exact text appearing EXACTLY ONCE with no duplication or repetition: "${cena.headline}". Below the headline render a thin horizontal gold accent line color hex D4A574. Below that line, render in smaller clean sans-serif uppercase navy with letter-spacing, the exact phrase: "Envie ${cena.cta} no direct.". All typography must be perfectly legible with all Portuguese accents intact.

7. Final aspect ratio 4:5.

8. ${ASSINATURA_VISUAL}

${NEGATIVE_PROMPT}`;
}

function sujeute(s) { return s; } // placeholder pra possível pluralização futura

/**
 * Gera os posts da pessoa
 */
export async function gerarPostsPessoa({ pessoa, outputDir, cenas }) {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const fotoBasePath = path.join(FOTOS_BASE_DIR, pessoa.nome, pessoa.fotoBase);

  console.log(`\n🎨 Gerando ${cenas.length} posts de ${pessoa.nome.toUpperCase()} (Head Preserve) via ${MODEL}`);
  console.log(`📸 Foto base: ${pessoa.fotoBase}`);
  console.log(`📁 Saída: ${outputDir}\n`);

  await fs.mkdir(outputDir, { recursive: true });

  // Carrega a foto base uma única vez
  const fotoBytes = await fs.readFile(fotoBasePath);
  const fotoBase64 = fotoBytes.toString("base64");
  const fotoInput = {
    inlineData: { mimeType: "image/jpeg", data: fotoBase64 },
  };

  const inicio = Date.now();
  const resultados = [];

  for (let i = 0; i < cenas.length; i++) {
    const cena = cenas[i];
    const numero = String(i + 1).padStart(2, "0");
    const arquivo = path.join(outputDir, `${pessoa.nome}_${cena.nome}.png`);
    const tInicio = Date.now();

    process.stdout.write(`[${numero}/${cenas.length}] ${cena.descricao || cena.nome}... `);

    try {
      const prompt = construirPromptPreservarCabeca({ pessoa, cena });

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [fotoInput, { text: prompt }],
        config: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: "4:5" },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((p) => p.inlineData?.data);

      if (!imagePart) {
        throw new Error(`Resposta sem imagem. Parts: ${JSON.stringify(parts.map((p) => Object.keys(p)))}`);
      }

      const buffer = Buffer.from(imagePart.inlineData.data, "base64");
      await fs.writeFile(arquivo, buffer);

      const segundos = ((Date.now() - tInicio) / 1000).toFixed(1);
      console.log(`✓ (${segundos}s)`);
      resultados.push({ cena: cena.nome, status: "ok", arquivo, segundos });
    } catch (err) {
      console.log(`✗ ERRO: ${err.message}`);
      resultados.push({ cena: cena.nome, status: "erro", erro: err.message });
    }
  }

  const totalSegundos = ((Date.now() - inicio) / 1000).toFixed(1);
  const sucessos = resultados.filter((r) => r.status === "ok").length;
  const falhas = resultados.filter((r) => r.status === "erro").length;

  console.log(`\n${"=".repeat(60)}`);
  console.log(`✅ ${sucessos} sucessos · ✗ ${falhas} falhas · ⏱  ${totalSegundos}s total`);
  console.log(`📁 Arquivos em: ${outputDir}`);
  console.log(`${"=".repeat(60)}\n`);

  if (falhas > 0) {
    console.log("Falhas:");
    for (const r of resultados.filter((r) => r.status === "erro")) {
      console.log(`  - ${r.cena}: ${r.erro}`);
    }
  }

  return resultados;
}
