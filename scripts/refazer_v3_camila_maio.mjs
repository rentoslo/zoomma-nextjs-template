// =====================================================
// REFAZER v3 — 2 imagens problemáticas restantes
// 30/05 post âncora janela: texto "uma temporada" duplicado
// 25/05 slide4 janela:      i2i falhou (mulher diferente da Dra.)
//
// QA aprimorado (2026-05-20):
//  - Detecta duplicação de linha/expressão
//  - Compara identidade facial com fotos de referência
// =====================================================

import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { qaImagem, logQA } from "./lib/qa_visual.mjs";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  console.error("ERRO: GOOGLE_AI_API_KEY não encontrada em .env");
  process.exit(1);
}

const MODEL = "gemini-3-pro-image-preview";
const CAMPANHA = "2026-mai-jul_skin-winter";
const MES_PASTA = "2026-05_maio";
const OUTPUT_DIR = `G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\${CAMPANHA}\\02_IMAGENS\\${MES_PASTA}`;
const FOTOS_DIR = "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\fotos_avatar";
const FOTOS_AVATAR_VAR_D = ["IMG_3677.jpg", "IMG_3690.jpg"];
const PARALLEL_BATCH_SIZE = 2;
const MAX_TENTATIVAS = 3; // mais agressivo agora — alvo mais difícil
const VERSAO = "v3";

// =====================================================
// TRECHOS REUTILIZÁVEIS (mesmos do refazer original)
// =====================================================

const DNA_BASE = `white dominant premium aesthetic, elegant translucent glassmorphism layers, soft whispered pink accents, refined editorial sophistication, breathing negative space, delicate airy shadows, premium magazine quality, frosted glass overlays, gentle rose blush touches, polished feminine luxury, silk-soft contrast, controlled vibrancy quiet elegance, photo framed with rounded corners white border, soft diffused natural lighting`;

const NEG = `oversaturated, harsh contrast, neon colors, aggressive pop, saturated pink dominant, heavy pink background, opaque pink walls, hot pink, magenta, fuchsia, cluttered, busy, chaotic, muddy colors, washed out badly, dull, flat boring, low quality, blurry photo, soft focus errors, poor quality, pixelated, noisy, grainy, illegible text, poor typography, unreadable font, garbled text, missing accents, broken letters, doubled letters, hyphen-split words, repeated lines of text, duplicated phrases, cheap looking, amateur, unprofessional, messy composition, unbalanced, distracting elements, watermark, signature, logo overlay, dark moody background, gothic, dramatic shadows, cold blue tones, reclining woman, woman lying down, sensual pose, suggestive pose, intimate setting, bedroom setting, exposed body, open robe, different person, different woman, unknown woman`;

const TYPO_RULES = `Typography must be PERFECTLY legible with all Portuguese accents intact (á, ã, ç, é, ê, í, ó, ô, õ, ú). Crisp clean letter shapes. NO broken letters, NO doubled letters, NO hyphen-split words. EXACT spelling required. CRITICAL: NEVER repeat any line of text. Each line of text appears EXACTLY ONCE — no duplicated lines, no duplicated phrases, no accidental repetition between adjacent lines.`;

const NUMERACAO_REGRA = `IMPORTANT: The slide number indicator (e.g. "04/07") must appear ONLY ONCE in the entire image, placed in the top-right corner OUTSIDE any translucent panel. DO NOT repeat the slide number anywhere else.`;

const VAR_A = `pure white #FFFFFF dominant background airy editorial luxury, translucent frosted glass panel overlay holding text glassmorphism effect subtle blur, photograph framed with rounded corners thick white border premium magazine style, elegant serif typography combined with bold sans-serif headline soft black #1A1A1A, whispered pink #FCE4EC details barely visible, soft diffused natural lighting, refined sophisticated atmosphere, generous negative space, premium editorial feminine, aspect ratio 4:5`;

const PRESERVE_IDENTITY = `CRITICAL — IDENTITY PRESERVATION: The reference photographs above show Dr. Camila Slobodticov — a Brazilian woman in her late 30s/40s with mid-length DARK BROWN/BLACK wavy hair, warm tan skin tone, prominent dark expressive eyes with arched eyebrows, full lips, oval face shape. The woman in the OUTPUT image MUST be UNMISTAKABLY this exact same person — same face structure, same hair color (dark brown/black, NOT blonde, NOT light brown), same skin tone (warm tan, NOT pale), same age (late 30s/40s, NOT young 20s), same Brazilian appearance. DO NOT generate a different woman. DO NOT make her younger, lighter-skinned, or blonde. DO NOT westernize her features. RECOMPOSE the scene completely but the PERSON IS THE SAME woman from the reference photos.`;

const ANTI_AI_REALISM = `photographic realism, real skin texture with visible pores and subtle fine lines, single loose strand of hair near temple, natural light from a single window casting soft directional shadow, subtle film grain like Kodak Portra 400, medium-format depth of field (Hasselblad 85mm f/2.0 look), slightly desaturated cream-and-white tones, editorial magazine aesthetic, NOT digital art, NOT AI-generated look, NOT plastic skin, NO over-smoothing`;

const POSE_FEMININA_PREMIUM = `WOMAN POSE GUIDANCE: She must be photographed in a poised, contemplative, DIGNIFIED manner — seated upright OR standing OR head-and-shoulders portrait. ABSOLUTELY NOT lying down, NOT reclining, NOT on a bed, NOT in bedroom setting. Wardrobe ALWAYS covered (closed blouse, linen shirt, robe fully closed up to the collarbone). Mood: professional, serene, editorial.`;

// =====================================================
// 2 IMAGENS A REFAZER
// =====================================================
const posts = [
  // 30/05 post âncora — Dra. + texto SEM duplicação
  {
    nome: `2026-05-30-post-ancora-dra-janela-${VERSAO}`,
    seed: 30521,
    desc: "30/05 post âncora Dra. - texto sem duplicação",
    useAvatar: true,
    textoEsperado: `Junho abre uma temporada nova na Camila Estética. — DRA. CAMILA`,
    prompt: `${PRESERVE_IDENTITY}

RECOMPOSE the scene as a 4:5 vertical Instagram anchor post for Camila Estética (premium aesthetic clinic in Bauru, women only).

SCENE — "Window Manifesto":
Dr. Camila stands in the LEFT half of the frame in 3/4 profile angle, gaze softly turned toward a window on her left (looking off-camera, contemplative, slight downward angle, calm dignified expression — NOT smiling, NOT looking at camera). She wears a crisp white linen shirt with natural soft drape, fully buttoned, no logo.

ENVIRONMENT:
Tall window with translucent linen curtain backlit by warm golden-hour light. Clinic interior cream-white #FBF7F4 limewash walls. Small marble shelf to her right side with a single fresh white peony in a ceramic vase. Generous negative space on the right side.

TEXT INTEGRATION on the RIGHT portion of the frame — EXACT text in elegant Playfair Display serif italic soft black #1A1A1A, stacked in EXACTLY 3 LINES (no more, no less):

LINE 1: "Junho abre"
LINE 2: "uma temporada nova"
LINE 3: "na Camila Estética."

CRITICAL: each line above appears EXACTLY ONCE. Do NOT write "uma temporada" twice. Do NOT repeat any line. The headline has exactly 3 lines total. Count the lines before placing them.

Below the 3rd line, a thin horizontal gold #D4AF37 accent line about 120px wide.

At the very bottom-right: tiny gold uppercase letter-spaced signature "— DRA. CAMILA"

CRITICAL TEXT: "Estética" must have acute accent on the first E (É) and on the I (í).

CAMERA & LENS: Medium-format Hasselblad 100mm at f/2.2. Shallow DoF, face tack sharp. Kodak Portra 400. NO saturation pop.

${POSE_FEMININA_PREMIUM}

${ANTI_AI_REALISM}

${TYPO_RULES}

NEGATIVE: ${NEG}, no smile to camera, no clinical signage, no equipment, no duplicated text lines, no repeated phrases, no different woman.`,
  },

  // 25/05 slide4-janela — i2i com identidade preservada
  {
    nome: `2026-05-25-carrossel-dois-tipos-mulher-${VERSAO}-slide4-janela`,
    seed: 25524,
    desc: "25/05 slide 4 janela - i2i com Dra. corretamente",
    useAvatar: true,
    textoEsperado: `A JANELA — Junho e julho são os meses em que a pele aceita peeling, estímulo, microagulhamento — sem fotossensibilidade do verão.`,
    prompt: `${PRESERVE_IDENTITY}

RECOMPOSE the scene as a 4:5 editorial Instagram carousel content slide for Camila Estética (premium aesthetic clinic in Bauru, women only).

LAYOUT (two zones, vertical 4:5 frame divided horizontally):

UPPER HALF — TEXT PANEL:
A translucent frosted glass panel (glassmorphism, 75% opacity, rounded corners) over a warm off-white #FBF7F4 background. On the panel, EXACT text:
- Small uppercase gold #D4AF37 letter-spaced sans-serif at top: "A JANELA"
- Below in elegant Playfair Display serif italic soft black #1A1A1A, centered, 4 lines:
  LINE 1: "Junho e julho são os meses em que"
  LINE 2: "a pele aceita peeling, estímulo,"
  LINE 3: "microagulhamento — sem"
  LINE 4: "fotossensibilidade do verão."
- Thin gold #D4AF37 accent line about 100px wide below text.

LOWER HALF — DRA. PHOTO:
An editorial photograph (framed with rounded white border, thick) showing Dr. Camila in 3/4 profile pose by a window with sheer linen curtain, soft golden window light, contemplative gaze off-camera, wearing a crisp white linen shirt fully buttoned. Generous space breathing. The Dra. MUST be visibly the woman from the reference photos — same dark hair, warm tan skin, same age, same Brazilian features. ${POSE_FEMININA_PREMIUM}

${NUMERACAO_REGRA} Slide number "04/07" appears ONLY in the top-right corner of the canvas, in small gold sans-serif, OUTSIDE the glass panel.

${ANTI_AI_REALISM}

${TYPO_RULES}

NEGATIVE: ${NEG}, no smile to camera, no medical equipment, no bed, no reclining, no different woman, no blonde hair, no younger woman, no westernized features.`,
  },
];

// =====================================================
// EXECUÇÃO COM QA + IDENTIDADE
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

async function gerarUm(post, fotosBase64) {
  const partes = [];
  if (post.useAvatar && fotosBase64?.length) {
    fotosBase64.forEach((b64) => {
      partes.push({ inlineData: { data: b64, mimeType: "image/jpeg" } });
    });
  }
  partes.push({ text: post.prompt });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: partes }],
    config: { responseModalities: ["IMAGE"], seed: post.seed },
  });

  const candidate = response.candidates?.[0];
  if (!candidate) throw new Error("Sem candidates");
  const imagePart = candidate.content?.parts?.find((p) => p.inlineData);
  if (!imagePart) throw new Error("Sem inlineData de imagem");

  return Buffer.from(imagePart.inlineData.data, "base64");
}

async function gerarComQA(post, fotosBase64, fotosRefPaths) {
  let tentativa = 0;
  let ultimoQA = null;
  let seedAtual = post.seed;

  while (tentativa < MAX_TENTATIVAS) {
    tentativa++;
    const postT = { ...post, seed: seedAtual };
    process.stdout.write(`  [${post.nome}] tentativa ${tentativa}/${MAX_TENTATIVAS} (seed=${seedAtual})... `);

    const imageBytes = await gerarUm(postT, fotosBase64);
    const tmpPath = path.join(OUTPUT_DIR, `${post.nome}.png`);
    await fs.writeFile(tmpPath, imageBytes);
    process.stdout.write(`gerada (${(imageBytes.length / 1024).toFixed(0)} KB). QA + identidade... `);

    const qa = await qaImagem(ai, tmpPath, {
      textoEsperado: post.textoEsperado,
      fotosReferencia: post.useAvatar ? fotosRefPaths : undefined,
    });

    ultimoQA = qa;

    if (qa.passou) {
      console.log(`✓ passou`);
      logQA(post.nome, qa);
      return { nome: post.nome, status: "ok", qa, tentativas: tentativa };
    }

    console.log(`reprovou`);
    logQA(post.nome, qa);
    if (tentativa < MAX_TENTATIVAS) seedAtual += 1000;
  }

  return { nome: post.nome, status: "qa_falhou", qa: ultimoQA, tentativas: tentativa };
}

async function main() {
  console.log("=== REFAZER v3 — 2 imagens problema (QA aprimorado) ===");
  console.log(`Modelo: ${MODEL} · QA: gemini-2.5-flash (com fotos referência)`);
  console.log(`Max tentativas: ${MAX_TENTATIVAS}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Pre-load fotos avatar (paths para QA, bytes para geração)
  const fotosBase64 = [];
  const fotosRefPaths = [];
  for (const nome of FOTOS_AVATAR_VAR_D) {
    const p = path.join(FOTOS_DIR, nome);
    const bytes = await fs.readFile(p);
    fotosBase64.push(bytes.toString("base64"));
    fotosRefPaths.push(p);
    console.log(`✓ Foto ${nome} (${(bytes.length / 1024).toFixed(0)} KB)`);
  }
  console.log("");

  const inicio = Date.now();
  const resultados = [];

  for (let i = 0; i < posts.length; i += PARALLEL_BATCH_SIZE) {
    const batch = posts.slice(i, i + PARALLEL_BATCH_SIZE);
    console.log(`▶ Batch ${Math.floor(i / PARALLEL_BATCH_SIZE) + 1}`);
    const promises = batch.map((p) =>
      gerarComQA(p, fotosBase64, fotosRefPaths).catch((err) => ({
        nome: p.nome, status: "erro", erro: err.message || String(err),
      }))
    );
    resultados.push(...(await Promise.all(promises)));
  }

  const totalSeg = ((Date.now() - inicio) / 1000).toFixed(0);
  const ok = resultados.filter((r) => r.status === "ok").length;
  const falha = resultados.filter((r) => r.status !== "ok").length;

  console.log("");
  console.log("=== RESUMO ===");
  console.log(`Tempo: ${totalSeg}s · OK: ${ok}/${posts.length} · Falhas: ${falha}`);
  resultados.forEach((r) => {
    if (r.status !== "ok") {
      console.log(`  ⚠ ${r.nome}: ${r.status} (${r.tentativas || 0} tentativas)`);
      if (r.qa?.problemas) {
        r.qa.problemas.forEach((p) =>
          console.log(`     [${p.gravidade}] ${p.tipo}: ${p.descricao}`)
        );
      }
    }
  });
}

main().catch((err) => {
  console.error("❌ ERRO FATAL:", err);
  process.exit(1);
});
