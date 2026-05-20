// =====================================================
// REFAZER 6 ARTES PROBLEMÁTICAS — Camila Maio 2026
// Aplicar regras validadas em 2026-05-20:
//  - Dra. Camila = i2i modo "ref" com 2 fotos avatar
//  - Texto em PT 100% correto, numeração única
//  - QA visual após cada geração; regera até 2x se falhar
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

// Para Variação D — 2 fotos como referência facial (modo "ref")
const FOTOS_AVATAR_VAR_D = ["IMG_3677.jpg", "IMG_3690.jpg"];

const PARALLEL_BATCH_SIZE = 3; // menor pra QA não saturar
const MAX_TENTATIVAS = 2; // se QA reprovar, regera até N vezes total
const VERSAO = "v2"; // versionar para não sobrescrever os arquivos originais (que ficam como histórico)

// =====================================================
// TRECHOS REUTILIZÁVEIS
// =====================================================

const DNA_BASE = `white dominant premium aesthetic, elegant translucent glassmorphism layers, soft whispered pink accents, refined editorial sophistication, breathing negative space, delicate airy shadows, premium magazine quality, frosted glass overlays, gentle rose blush touches, polished feminine luxury, silk-soft contrast, controlled vibrancy quiet elegance, photo framed with rounded corners white border, soft diffused natural lighting`;

const NEG = `oversaturated, harsh contrast, neon colors, aggressive pop, saturated pink dominant, heavy pink background, opaque pink walls, hot pink, magenta, fuchsia, cluttered, busy, chaotic, muddy colors, washed out badly, dull, flat boring, low quality, blurry photo, soft focus errors, poor quality, pixelated, noisy, grainy, illegible text, poor typography, unreadable font, garbled text, missing accents, broken letters, doubled letters, hyphen-split words, cheap looking, amateur, unprofessional, messy composition, unbalanced, distracting elements, watermark, signature, logo overlay, dark moody background, gothic, dramatic shadows, cold blue tones, reclining woman, woman lying down, sensual pose, suggestive pose, intimate setting, bedroom setting, exposed body, open robe`;

const TYPO_RULES = `Typography must be PERFECTLY legible with all Portuguese accents intact (á, ã, ç, é, ê, í, ó, ô, õ, ú). Crisp clean letter shapes. NO broken letters, NO doubled letters (do not write "ii" or "nn" by accident), NO hyphen-split words in the middle of words. EXACT spelling required. Match the EXACT text provided letter by letter, accent by accent.`;

const NUMERACAO_REGRA = `IMPORTANT: The slide number indicator (e.g. "01/07") must appear ONLY ONCE in the entire image, placed in the top-right corner OUTSIDE any translucent panel. DO NOT repeat the slide number anywhere else. DO NOT place it inside the glassmorphism panel.`;

const VAR_A = `pure white #FFFFFF dominant background airy editorial luxury, translucent frosted glass panel overlay holding text glassmorphism effect subtle blur, photograph framed with rounded corners thick white border premium magazine style, elegant serif typography combined with bold sans-serif headline soft black #1A1A1A, whispered pink #FCE4EC details barely visible, soft diffused natural lighting, refined sophisticated atmosphere, generous negative space, premium editorial feminine, aspect ratio 4:5`;

const VAR_B = `soft whispered pink #FCE4EC veil background gentle wash desaturated, almost-white pink barely tinted, photograph framed with rounded white border centered, white or soft black typography elegant mix serif and bold sans-serif, generous breathing space, delicate feminine premium atmosphere, soft diffused lighting, editorial magazine quality, refined gentle sophistication, no saturation pop, aspect ratio 4:5`;

const PRESERVE_IDENTITY = `CRITICAL: The reference photographs above are ONLY for facial identity reference — preserve the exact face and recognizable likeness of Dr. Camila Slobodticov (the woman shown in both photos). She must be UNMISTAKABLY the same person. Do not invent a new face. Do not alter her facial structure, hair color, hair texture, eyes, mouth, or skin tone. RECOMPOSE the scene completely as a brand-new editorial photograph, but the face MUST be hers.`;

const ANTI_AI_REALISM = `photographic realism, real skin texture with visible pores and subtle fine lines, single loose strand of hair near temple, natural light from a single window casting soft directional shadow, subtle film grain like Kodak Portra 400, medium-format depth of field (Hasselblad 85mm f/2.0 look), slightly desaturated cream-and-white tones, editorial magazine aesthetic, NOT digital art, NOT AI-generated look, NOT plastic skin, NO over-smoothing`;

const POSE_FEMININA_PREMIUM = `WOMAN POSE GUIDANCE: She must be photographed in a poised, contemplative, DIGNIFIED manner — seated upright OR standing OR head-and-shoulders portrait. ABSOLUTELY NOT lying down, NOT reclining, NOT on a bed, NOT in bedroom setting, NOT sensual, NOT intimate. Wardrobe ALWAYS covered (closed blouse, linen shirt, robe fully closed up to the collarbone). Context: clinic/studio/window setting only. Mood: professional, serene, editorial.`;

// =====================================================
// 6 IMAGENS A REFAZER
// =====================================================
const posts = [
  // 1. 25/05 SLIDE 1 CAPA — "01/07" duplicado, corrigir
  {
    nome: `2026-05-25-carrossel-dois-tipos-mulher-${VERSAO}-slide1-capa`,
    seed: 25511,
    desc: "25/05 slide 1 capa - corrigir numeração duplicada",
    useAvatar: false,
    textoEsperado: `Existem dois tipos de mulher que cuidam da pele.`,
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel cover slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered translucent frosted glass panel (glassmorphism, 75% opacity, soft rounded corners, gentle drop shadow).

ON the glass panel render EXACT text in elegant Playfair Display serif, two lines stacked, centered:
- Line 1 large soft black #1A1A1A: "Existem dois tipos"
- Line 2 same size: "de" then SOFT MUTED PINK #D4A5B5 word "mulher" then back to soft black #1A1A1A " que"
- Line 3 same style soft black #1A1A1A: "cuidam da pele."
A thin gold #D4AF37 accent line about 80px wide centered below the text.

${NUMERACAO_REGRA} The slide number "01/07" appears ONLY in the top-right corner of the canvas, in small gold #D4AF37 sans-serif, OUTSIDE and ABOVE the glass panel. Do NOT repeat it inside the panel.

Subtle split visual hint in the background: left half slightly cooler tone, right half slightly warmer tone — a soft whisper, not literal.

${TYPO_RULES}

NEGATIVE: ${NEG}, no duplicate "01/07", no repeated slide number, no number inside panel.`,
  },

  // 2. 25/05 SLIDE 4 - JANELA — adicionar Dra. Camila i2i (NOVO i2i)
  {
    nome: `2026-05-25-carrossel-dois-tipos-mulher-${VERSAO}-slide4-janela`,
    seed: 25514,
    desc: "25/05 slide 4 janela - agora com Dra. Camila i2i",
    useAvatar: true,
    textoEsperado: `Junho e julho são os meses em que a pele aceita peeling, estímulo, microagulhamento — sem fotossensibilidade do verão.`,
    prompt: `${PRESERVE_IDENTITY}

RECOMPOSE the scene as a 4:5 editorial Instagram carousel content slide for Camila Estética (premium aesthetic clinic in Bauru, women only).

LAYOUT:
- Full bleed warm off-white #FBF7F4 background, very airy.
- Upper half of the frame: centered translucent frosted glass panel (glassmorphism, 75% opacity, soft rounded corners). EXACT text on the panel:
  * Small uppercase gold #D4AF37 letter-spaced sans-serif label at top: "A JANELA"
  * Below in elegant Playfair Display serif italic soft black #1A1A1A, centered, 4 lines: "Junho e julho são os meses em que" / "a pele aceita peeling, estímulo," / "microagulhamento — sem" / "fotossensibilidade do verão."
  * Thin gold #D4AF37 accent line about 100px wide below text.

- Lower half of the frame: editorial photograph framed with rounded white border showing Dr. Camila in 3/4 profile pose by a window with sheer linen curtain, natural golden window light from the left, contemplative gaze off-camera, wearing a crisp white linen shirt fully buttoned. Generous space breathing. ${POSE_FEMININA_PREMIUM}

${NUMERACAO_REGRA} The slide number "04/07" appears ONLY in the top-right corner, in small gold sans-serif, OUTSIDE the panel.

${ANTI_AI_REALISM}

${TYPO_RULES}

NEGATIVE: ${NEG}, no smile to camera, no medical equipment, no bed, no reclining.`,
  },

  // 3. 25/05 SLIDE 5 RESULTADO — texto quebrado, refazer
  {
    nome: `2026-05-25-carrossel-dois-tipos-mulher-${VERSAO}-slide5-resultado`,
    seed: 25515,
    desc: "25/05 slide 5 - texto correto sem 'in-inverno' nem 'corcrendo'",
    useAvatar: false,
    textoEsperado: `Quem trata no inverno chega no verão com pele preparada. Quem espera, chega correndo.`,
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered translucent frosted glass panel (glassmorphism, soft rounded corners).

EXACT text rendered on the glass panel:
- Small uppercase gold #D4AF37 letter-spaced sans-serif at top: "O RESULTADO"
- Below in elegant Playfair Display serif italic soft black #1A1A1A, centered, 3 lines stacked:
  * Line 1: "Quem trata no inverno chega"
  * Line 2: "no verão com pele preparada."
  * Line 3: "Quem espera, chega correndo."
- Thin gold #D4AF37 accent line about 80px wide below text.

CRITICAL TEXT INSTRUCTIONS:
- Write EXACTLY "no inverno" (NOT "in-inverno", NOT "ininverno", NOT "no in-")
- Write EXACTLY "correndo" (NOT "corcrendo", NOT "correrndo", NOT "correndo" with extra letters)
- Write EXACTLY "verão" with the accent ã
- Letters must be clean, no doubled consonants, no broken syllables

${NUMERACAO_REGRA} The slide number "05/07" appears ONLY in the top-right corner OUTSIDE the panel.

${TYPO_RULES}

NEGATIVE: ${NEG}, no "in-inverno", no "corcrendo", no broken words, no hyphenated word splits in the middle of words.`,
  },

  // 4. 27/05 CAPA REEL DRA. MANIFESTO — i2i modo "ref" com 2 fotos
  {
    nome: `2026-05-27-capa-reel-dra-manifesto-${VERSAO}`,
    seed: 27511,
    desc: "27/05 capa Reel Dra. - i2i ref 2 fotos modo recompose",
    useAvatar: true,
    textoEsperado: `MANIFESTO — Existem dois tipos de cliente. — DRA. CAMILA`,
    prompt: `${PRESERVE_IDENTITY}

RECOMPOSE the scene as a vertical 9:16 Instagram Reel cover for Camila Estética (premium aesthetic clinic in Bauru, women only).

SCENE — "The Manifesto":
Dr. Camila stands in the lower-left half of the vertical frame in a contemplative 3/4 pose, slight side angle, gaze directed softly off-camera (NOT looking at the lens, NOT smiling broadly — quiet, dignified, almost reflective expression). She wears a crisp white linen shirt fully buttoned, natural draping, no logo on garment.

ENVIRONMENT:
Clinic interior with limewash cream-white walls #FBF7F4, soft directional warm window light from the left at golden hour, a tall sheer linen curtain backlit casting gentle warm shadows. Subtle haze in the air. Slight detail of a small white peony in a ceramic vase on a marble surface to the far right edge.

TEXT INTEGRATION on the upper-right portion of the frame, EXACT text:
- Top: small uppercase gold #D4AF37 letter-spaced sans-serif: "MANIFESTO"
- Below in large elegant Playfair Display serif italic soft black #1A1A1A, stacked in 3 lines: "Existem" / "dois tipos" / "de cliente."
- Below a thin gold #D4AF37 accent line about 100px wide.
- Far bottom-right: tiny gold uppercase letter-spaced sans-serif signature: "— DRA. CAMILA"

CAMERA & LENS: Medium-format Hasselblad 100mm equivalent at f/2.0. Shallow depth of field — her face tack sharp, background dissolves into soft cream bokeh. Phase One color science.

COLOR GRADE: Slightly desaturated cream-and-white with gold-warm undertone, Kodak Portra 400 vibe.

MOOD: Quiet authority. Kinfolk magazine meets Aman Resorts brand film. NOT sterile clinical. NOT smiling to camera.

${POSE_FEMININA_PREMIUM}

${ANTI_AI_REALISM}

${TYPO_RULES}

NEGATIVE: ${NEG}, no clinical signage, no medical equipment, no broad smile, no eye-contact with camera, no other person in frame, no different woman (must be Dr. Camila from reference photos).`,
  },

  // 5. 29/05 SLIDE 4 P3 — refazer SEM mulher reclinada
  {
    nome: `2026-05-29-carrossel-5perguntas-pele-${VERSAO}-slide4-p3`,
    seed: 29514,
    desc: "29/05 slide 4 - sem mulher deitada, texto correto",
    useAvatar: false,
    textoEsperado: `PERGUNTA 03 — Por que você espera o verão pra correr atrás do que poderia ter feito no inverno?`,
    prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background (almost white with a kiss of pink).

CENTERED COMPOSITION:
- Upper portion: editorial soft-focus photograph framed with rounded white border thick. The photo shows a CLOSE-UP STILL-LIFE detail (NOT a person in frame) — for example: warm golden window light hitting a cream linen pillow on a clean cream surface, or a soft macro detail of cream silk fabric in soft afternoon light, or a vase of dried wheat stems by a window. NO HUMAN FIGURE in the photograph. NO bed, NO bedroom, NO reclining body.
- Below the photo, EXACT text:
  * Small uppercase gold #D4AF37 letter-spaced sans-serif at top: "PERGUNTA 03"
  * Below in elegant Playfair Display serif italic soft black #1A1A1A, centered, 3 lines: "Por que você espera o verão" / "pra correr atrás do que" / "poderia ter feito no inverno?"
  * Thin gold #D4AF37 accent line below text.

CRITICAL TEXT: write EXACTLY "do que" (NOT "do qu", NOT "do qu poderia"), EXACTLY "ter feito" (NOT "a ter feito"), EXACTLY "verão" with accent, EXACTLY "inverno?" with the question mark.

${NUMERACAO_REGRA} The slide number "04/07" appears ONLY in the top-right corner OUTSIDE the panel.

${TYPO_RULES}

NEGATIVE: ${NEG}, NO WOMAN IN THE PHOTO (still-life only this slide), no bed, no bedroom, no reclining figure, no robe, no sensual scene, no exposed body.`,
  },

  // 6. 30/05 POST ÂNCORA DRA. JANELA — i2i modo "ref" com 2 fotos
  {
    nome: `2026-05-30-post-ancora-dra-janela-${VERSAO}`,
    seed: 30511,
    desc: "30/05 post âncora Dra. - i2i ref 2 fotos modo recompose",
    useAvatar: true,
    textoEsperado: `Junho abre uma temporada nova na Camila Estética. — DRA. CAMILA`,
    prompt: `${PRESERVE_IDENTITY}

RECOMPOSE the scene as a 4:5 vertical Instagram anchor post for Camila Estética (premium aesthetic clinic in Bauru, women only).

SCENE — "Window Manifesto":
Dr. Camila stands in the LEFT half of the frame, in 3/4 profile angle, gaze turned softly toward a window on her left (looking off-camera, contemplative, slight downward angle of the eyes, calm dignified expression — NOT smiling, NOT looking at camera). She wears a crisp white linen shirt with natural soft drape, fully buttoned, no logo.

ENVIRONMENT:
She stands beside a tall window with a translucent linen curtain backlit by warm golden-hour light from outside. Clinic interior cream-white #FBF7F4 limewash walls, soft directional warm shadows. On a small marble shelf to her right side: a single fresh white peony in a simple ceramic vase. Generous negative space on the right side.

TEXT INTEGRATION on the RIGHT portion of the frame, EXACT text:
- Large elegant Playfair Display serif italic soft black #1A1A1A, stacked in 3 lines:
  * Line 1: "Junho abre"
  * Line 2: "uma temporada nova"
  * Line 3: "na Camila Estética."
- Below a thin horizontal gold #D4AF37 accent line about 120px wide.
- At the very bottom-right: tiny gold uppercase letter-spaced signature "— DRA. CAMILA"

CRITICAL TEXT: "Estética" must have the acute accent on the first E (É) and on the I (í). The accent marks must be clearly visible.

CAMERA & LENS: Medium-format Hasselblad 100mm equivalent at f/2.2. Shallow DoF, her face tack sharp, background dreamy cream bokeh. Phase One color science.

COLOR GRADE: Slightly desaturated cream-and-white with gold-warm undertone. Kodak Portra 400. NO saturation pop. NO clinical sterile white.

MOOD: Quiet authority, contemplative. Kinfolk magazine meets Aman Resorts brand film.

${POSE_FEMININA_PREMIUM}

${ANTI_AI_REALISM}

${TYPO_RULES}

NEGATIVE: ${NEG}, no smile to camera, no clinical signage, no equipment, no different woman (must be Dr. Camila from reference photos).`,
  },
];

// =====================================================
// EXECUÇÃO
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

async function gerarComQA(post, fotosBase64) {
  let tentativa = 0;
  let ultimoQA = null;
  let ultimoBytes = null;
  let seedAtual = post.seed;

  while (tentativa < MAX_TENTATIVAS) {
    tentativa++;
    const postTentativa = { ...post, seed: seedAtual };
    process.stdout.write(`  [${post.nome}] tentativa ${tentativa}/${MAX_TENTATIVAS} (seed=${seedAtual})... `);

    const imageBytes = await gerarUm(postTentativa, fotosBase64);
    const tmpPath = path.join(OUTPUT_DIR, `${post.nome}.png`);
    await fs.writeFile(tmpPath, imageBytes);

    process.stdout.write(`gerada (${(imageBytes.length / 1024).toFixed(0)} KB). QA... `);

    const qa = await qaImagem(ai, tmpPath, {
      textoEsperado: post.textoEsperado,
    });

    ultimoQA = qa;
    ultimoBytes = imageBytes;

    if (qa.passou) {
      console.log(`✓ passou`);
      logQA(post.nome, qa);
      return { nome: post.nome, status: "ok", qa, tentativas: tentativa };
    }

    console.log(`reprovou (tentativa ${tentativa})`);
    logQA(post.nome, qa);

    if (tentativa < MAX_TENTATIVAS) {
      seedAtual += 1000;
    }
  }

  // Esgotou tentativas — mantém última geração no disco mas marca como falha-QA
  return {
    nome: post.nome,
    status: "qa_falhou",
    qa: ultimoQA,
    tentativas: tentativa,
  };
}

async function main() {
  console.log("=== REFAZER artes Camila Maio 2026 (com QA visual) ===");
  console.log(`Modelo gerador: ${MODEL}`);
  console.log(`Modelo QA: gemini-2.5-flash`);
  console.log(`Total: ${posts.length} imagens · paralelo ${PARALLEL_BATCH_SIZE} · max ${MAX_TENTATIVAS} tentativas`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log("");

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Pre-load fotos avatar
  const fotosBase64 = [];
  for (const nome of FOTOS_AVATAR_VAR_D) {
    const bytes = await fs.readFile(path.join(FOTOS_DIR, nome));
    fotosBase64.push(bytes.toString("base64"));
    console.log(`✓ Foto avatar ${nome} (${(bytes.length / 1024).toFixed(0)} KB)`);
  }
  console.log("");

  const inicio = Date.now();
  const resultados = [];

  for (let i = 0; i < posts.length; i += PARALLEL_BATCH_SIZE) {
    const batch = posts.slice(i, i + PARALLEL_BATCH_SIZE);
    const batchNum = Math.floor(i / PARALLEL_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(posts.length / PARALLEL_BATCH_SIZE);
    console.log(`▶ Batch ${batchNum}/${totalBatches}`);

    const promises = batch.map((p) =>
      gerarComQA(p, fotosBase64).catch((err) => ({
        nome: p.nome,
        status: "erro",
        erro: err.message || String(err),
      }))
    );

    const r = await Promise.all(promises);
    resultados.push(...r);
  }

  const totalSeg = ((Date.now() - inicio) / 1000).toFixed(0);
  const okQA = resultados.filter((r) => r.status === "ok").length;
  const falhouQA = resultados.filter((r) => r.status === "qa_falhou").length;
  const erros = resultados.filter((r) => r.status === "erro").length;

  console.log("");
  console.log("=== RESUMO ===");
  console.log(`Tempo: ${totalSeg}s`);
  console.log(`Passaram QA: ${okQA}/${posts.length}`);
  console.log(`Reprovaram QA (entregues mesmo assim, revisar manual): ${falhouQA}`);
  console.log(`Erros técnicos: ${erros}`);
  resultados.forEach((r) => {
    if (r.status === "qa_falhou") {
      console.log(`  ⚠ ${r.nome}: QA reprovou após ${r.tentativas} tentativas — revisar`);
    } else if (r.status === "erro") {
      console.log(`  ❌ ${r.nome}: ${r.erro}`);
    }
  });
}

main().catch((err) => {
  console.error("❌ ERRO FATAL:", err);
  process.exit(1);
});
