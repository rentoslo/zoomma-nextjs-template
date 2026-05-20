// =====================================================
// ARTES — CAMILA ESTÉTICA — MAIO 2026 (FASE 0 SKIN WINTER)
// 26 imagens · síncrono paralelo (batches de 4)
// Modelo: gemini-3-pro-image-preview (nano-banana-pro)
// =====================================================
// Output: G:\Meu Drive\CLIENTES\CAMILA_ESTETICA\AGENDA EDITORIAL\
//         2026-mai-jul_skin-winter\02_IMAGENS\2026-05_maio\
//
// Padrão de organização: ver `_PADRAO-ORGANIZACAO.md` no Drive da Camila.
// Identidade visual: ver `clientes/camila-estetica/03-identidade-visual.md`.
//
// ⚠️ DEPRECATED — NÃO USE COMO GABARITO PARA NOVAS GERAÇÕES.
//
// Este script gerou problemas em 6/26 imagens (i2i com a Dra. falhou — modelo
// gerou outra mulher; textos com erros; numeração duplicada; mulher reclinada
// no slide4-p3). Também usa NOMENCLATURA ANTIGA com sufixo `-v1` (não mais usado).
//
// REGRAS ATUAIS (2026-05-20):
//  1. Sem `-v1` no nome — SOBRESCREVER sempre. Padrão de nome em
//     memória `nomenclatura_imagens_padrao` + `_PADRAO-ORGANIZACAO.md`.
//  2. Dra. Camila = i2i modo "ref" com 2 fotos avatar (NÃO edit puro).
//  3. QA visual obrigatório via `lib/qa_visual.mjs` antes de entregar.
//
// Use como GABARITO:
//  - `refazer_v3_camila_maio.mjs` (modo ref + QA com fotos referência)
//  - `refazer_slide1_outono.mjs` (script single, sobrescrita, QA)
//
// Mantido aqui apenas como histórico da iteração de 2026-05-20.
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
const CAMPANHA = "2026-mai-jul_skin-winter";
const MES_PASTA = "2026-05_maio";
const OUTPUT_DIR = `G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\${CAMPANHA}\\02_IMAGENS\\${MES_PASTA}`;
const FOTOS_DIR = "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\fotos_avatar";
const FOTO_AVATAR_VAR_D = "IMG_3677.jpg";
const PARALLEL_BATCH_SIZE = 4;

// =====================================================
// TRECHOS REUTILIZÁVEIS (do 03-identidade-visual.md)
// =====================================================

const DNA_BASE = `white dominant premium aesthetic, elegant translucent glassmorphism layers, soft whispered pink accents, refined editorial sophistication, breathing negative space, delicate airy shadows, premium magazine quality, frosted glass overlays, gentle rose blush touches, polished feminine luxury, silk-soft contrast, controlled vibrancy quiet elegance, photo framed with rounded corners white border, soft diffused natural lighting`;

const NEG = `oversaturated, harsh contrast, neon colors, aggressive pop, saturated pink dominant, heavy pink background, opaque pink walls, hot pink, magenta, fuchsia, cluttered, busy, chaotic, muddy colors, washed out badly, dull, flat boring, low quality, blurry photo, soft focus errors, poor quality, pixelated, noisy, grainy, illegible text, poor typography, unreadable font, garbled text, missing accents, cheap looking, amateur, unprofessional, messy composition, unbalanced, distracting elements, watermark, signature, logo overlay, dark moody background, gothic, dramatic shadows, cold blue tones`;

const PRESERVE_IDENTITY = `CRITICAL: preserve the exact identity, facial features, hair, eyes, skin tone, and likeness of Dr. Camila Slobodticov as shown in the input photograph with absolute fidelity. Do not alter her face, eyes, mouth, smile, skin tone, hair color, or any defining feature. She must be unmistakably the same person.`;

const ANTI_AI_REALISM = `photographic realism, real skin texture with visible pores and subtle fine lines, single loose strand of hair near temple, natural light from a single window casting soft directional shadow, subtle film grain like Kodak Portra 400, medium-format depth of field (Hasselblad 85mm f/2.0 look), slightly desaturated cream-and-white tones, editorial magazine aesthetic, NOT digital art, NOT AI-generated look`;

// Prompts-base de variação
const VAR_A = `pure white #FFFFFF dominant background airy editorial luxury, translucent frosted glass panel overlay holding text glassmorphism effect subtle blur, photograph framed with rounded corners thick white border premium magazine style, elegant serif typography combined with bold sans-serif headline soft black #1A1A1A, whispered pink #FCE4EC details barely visible, soft diffused natural lighting, refined sophisticated atmosphere, generous negative space, premium editorial feminine, aspect ratio 4:5`;

const VAR_B = `soft whispered pink #FCE4EC veil background gentle wash desaturated, almost-white pink barely tinted, photograph framed with rounded white border centered, white or soft black typography elegant mix serif and bold sans-serif, generous breathing space, delicate feminine premium atmosphere, soft diffused lighting, editorial magazine quality, refined gentle sophistication, no saturation pop, aspect ratio 4:5`;

const VAR_E_STILLLIFE = `Editorial still-life photography composition, apothecary crystal bottle with soft golden #D4AF37 cap, white rose petal, cream linen fabric, Calacatta white marble surface, single window light from the left at golden hour, soft directional shadows with gentle falloff, generous negative space at least 60% empty, medium-format Hasselblad 100mm f/2.8 macro look, razor-shallow depth of field, Kodak Portra 400 film grain subtle, cream and marble white dominant palette, transparent crystal refractions, NO TEXT NO SUBTITLES NO CAPTIONS NO LOGOS NO WATERMARKS, mood references: Aman Resorts campaign, La Mer commercial, Augustinus Bader print ad, Byredo product film, Kinfolk magazine aesthetic, aspect ratio 4:5`;

const TYPOGRAPHY_NOTE = `Typography must be perfectly legible with all Portuguese accents intact (á, ã, ç, é, ê, í, ó, ô, õ, ú). Use Playfair Display serif for emotional headlines and Inter or Montserrat sans-serif for body text. Crisp clean letter shapes, no distortion.`;

// =====================================================
// 26 IMAGENS
// =====================================================
const posts = [
  // ============================================
  // 20/05 (Qua) — CARROSSEL "Outono virou" — 7 slides, Variação A
  // Seed sequencial 12345-12351 (mesma identidade visual entre slides)
  // ============================================
  {
    nome: "2026-05-20-carrossel-outono-virou-v1-slide1-capa",
    seed: 12345,
    desc: "20/05 Slide 1 capa - 'O outono virou'",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel cover for an aesthetic clinic in Brazil (Camila Estética). Full bleed warm off-white #FBF7F4 background. In the center, a translucent frosted glass panel (glassmorphism, 75% opacity, soft rounded corners, gentle drop shadow). On the panel render EXACT text in two lines: line 1 large elegant serif Playfair Display in deep soft black #1A1A1A "O outono virou."; line 2 below in smaller sans-serif Inter Medium soft black #1A1A1A "Sua pele percebeu?". Below the text a thin horizontal gold #D4AF37 accent line about 80px wide. In top-right corner a subtle "01/07" small gold sans-serif label. Behind the glass panel, an editorial soft macro photograph of feminine skin with golden window light, lightly desaturated cream tones, framed with rounded corners thick white border. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}, no body parts up close, no clinical look, no medical equipment.`,
  },
  {
    nome: "2026-05-20-carrossel-outono-virou-v1-slide2-sinal1",
    seed: 12346,
    desc: "20/05 Slide 2 - sinal 1 oleosidade/ressecamento",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered translucent frosted glass panel (75% opacity, rounded corners). On the panel render EXACT text in two parts: small uppercase sans-serif label in soft gold #D4AF37 letter-spaced "SINAL 01" at top; below, large elegant serif Playfair Display italic in soft black #1A1A1A: "Oleosidade desregulada de um lado, ressecamento do outro." Below text a thin gold accent line. In top-right small "02/07" gold label. Behind glass, subtle macro editorial detail of skin texture in warm soft light. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}, no medical close-up, no clinical scene.`,
  },
  {
    nome: "2026-05-20-carrossel-outono-virou-v1-slide3-sinal2",
    seed: 12347,
    desc: "20/05 Slide 3 - sinal 2 manchas",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered translucent frosted glass panel. EXACT text: small uppercase gold #D4AF37 letter-spaced label "SINAL 02" at top; below large serif Playfair Display italic soft black #1A1A1A: "Manchas que estavam disfarçadas começam a aparecer." Thin gold accent line below. Small "03/07" gold label top-right. Subtle warm macro editorial photograph behind glass. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}, no clinical, no medical.`,
  },
  {
    nome: "2026-05-20-carrossel-outono-virou-v1-slide4-sinal3",
    seed: 12348,
    desc: "20/05 Slide 4 - sinal 3 textura",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "SINAL 03" at top; below serif Playfair Display italic soft black #1A1A1A: "Textura mais áspera ao toque, principalmente nas bochechas." Thin gold accent line. "04/07" gold label top-right. Warm macro editorial detail behind glass. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-20-carrossel-outono-virou-v1-slide5-sinal4",
    seed: 12349,
    desc: "20/05 Slide 5 - sinal 4 viço perdido",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "SINAL 04" at top; below serif Playfair Display italic soft black #1A1A1A: "Viço perdido — aquele aspecto 'apagado' no espelho de manhã." Thin gold accent line. "05/07" gold label top-right. Warm macro detail behind glass. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-20-carrossel-outono-virou-v1-slide6-sinal5",
    seed: 12350,
    desc: "20/05 Slide 6 - sinal 5 olheiras",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "SINAL 05" at top; below serif Playfair Display italic soft black #1A1A1A: "Olheiras mais marcadas, mesmo dormindo igual." Thin gold accent line. "06/07" gold label top-right. Warm macro detail behind glass. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-20-carrossel-outono-virou-v1-slide7-cta",
    seed: 12351,
    desc: "20/05 Slide 7 CTA - 'O fim do verão é o sinal'",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel final slide for Camila Estética. Full bleed pure white #FFFFFF background, very airy. Centered translucent frosted glass panel. EXACT text in serif Playfair Display soft black #1A1A1A medium size, italic, centered: "O fim do verão é o sinal. Cada estação pede um cuidado." Below in tiny uppercase gold #D4AF37 letter-spaced sans-serif: "— CAMILA ESTÉTICA". Thin gold accent line above the signature. "07/07" gold label top-right. Very generous negative space. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },

  // ============================================
  // 22/05 (Sex) — CAPA REEL silencioso (Variação E)
  // 9:16 cover sem texto
  // ============================================
  {
    nome: "2026-05-22-capa-reel-silencioso-premium-v1",
    seed: 22501,
    desc: "22/05 Capa Reel silêncio premium (Var E)",
    prompt: `${VAR_E_STILLLIFE} Vertical 9:16 aspect ratio composition for Instagram Reel cover. A single apothecary crystal bottle with soft golden cap stands on white Calacatta marble surface, a single white rose petal lies beside it, a translucent linen curtain hint visible in the soft background blur, single warm window light from the upper left casting gentle directional shadow, generous negative space about 65% of the frame, mood: refined silence, Aman Resorts brand film aesthetic, Augustinus Bader print campaign quality. ABSOLUTELY NO TEXT, NO TITLE, NO SUBTITLE, NO CAPTION, NO LOGO, NO WATERMARK on the image. Pure atmosphere. NEGATIVE: ${NEG}, no people, no faces, no body parts.`,
  },

  // ============================================
  // 23/05 (Sáb) — Post Cat 3 still-life (Variação E)
  // 4:5 sem texto
  // ============================================
  {
    nome: "2026-05-23-still-life-frasco-petala-v1",
    seed: 23501,
    desc: "23/05 Post Cat 3 still-life - frasco + pétala + linho",
    prompt: `${VAR_E_STILLLIFE} Editorial still-life: an amber crystal apothecary bottle with soft golden cap on white Calacatta marble, a single white rose petal in mid-fall captured at the moment of landing, a folded cream linen napkin to the right, a soft warm light beam coming from a window on the left, generous negative space at least 60% empty, refined apothecary aesthetic, mood: La Mer skincare print campaign, Aman Resorts. ABSOLUTELY NO TEXT, NO SUBTITLE, NO LOGO. Pure silent atmosphere. NEGATIVE: ${NEG}, no people, no faces, no clinical, no medical.`,
  },

  // ============================================
  // 25/05 (Seg) — CARROSSEL "Dois tipos de mulher" — 7 slides, Variação A
  // Seed sequencial 25501-25507
  // ============================================
  {
    nome: "2026-05-25-carrossel-dois-tipos-mulher-v1-slide1-capa",
    seed: 25501,
    desc: "25/05 Slide 1 capa - 'Dois tipos de mulher'",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel cover for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered translucent frosted glass panel (glassmorphism). EXACT text in two lines: line 1 large serif Playfair Display soft black #1A1A1A "Existem dois tipos"; line 2 below same style with soft pink #D4A5B5 emphasis "de mulher que cuidam da pele." Below text a thin gold #D4AF37 accent line. Tiny "01/07" gold label top-right. Subtle split visual hint: left half slightly cooler tone, right half slightly warmer tone — a visual whisper, not literal. Generous negative space. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-25-carrossel-dois-tipos-mulher-v1-slide2-tipo1",
    seed: 25502,
    desc: "25/05 Slide 2 - tipo 1 reage",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Glassmorphism panel centered. EXACT text: small uppercase gold #D4AF37 letter-spaced "TIPO 01" at top; below serif Playfair Display italic soft black #1A1A1A: "A primeira faz uma sessão quando incomoda muito. Depois espera. Depois faz de novo." Thin gold accent line. "02/07" gold label top-right. Subtle warm editorial photograph behind glass. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-25-carrossel-dois-tipos-mulher-v1-slide3-tipo2",
    seed: 25503,
    desc: "25/05 Slide 3 - tipo 2 cuida em ciclo",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Glassmorphism panel centered. EXACT text: small uppercase gold #D4AF37 letter-spaced "TIPO 02" at top; below serif Playfair Display italic soft black #1A1A1A: "A segunda entende a pele como ciclo. Cada estação pede um cuidado. Cada estação constrói o próximo." Thin gold accent line. "03/07" gold label top-right. Subtle editorial photograph behind glass. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-25-carrossel-dois-tipos-mulher-v1-slide4-janela",
    seed: 25504,
    desc: "25/05 Slide 4 - junho e julho são janela",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "A JANELA" at top; below serif Playfair Display italic soft black #1A1A1A: "Junho e julho são os meses em que a pele aceita peeling, estímulo, microagulhamento — sem fotossensibilidade do verão." Thin gold accent line. "04/07" gold label top-right. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-25-carrossel-dois-tipos-mulher-v1-slide5-resultado",
    seed: 25505,
    desc: "25/05 Slide 5 - quem trata no inverno",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "O RESULTADO" at top; below serif Playfair Display italic soft black #1A1A1A: "Quem trata no inverno chega no verão com pele preparada. Quem espera, chega correndo." Thin gold accent line. "05/07" gold label top-right. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-25-carrossel-dois-tipos-mulher-v1-slide6-metodo",
    seed: 25506,
    desc: "25/05 Slide 6 - existe pele cuidada com método",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Glassmorphism panel. EXACT text in serif Playfair Display soft black #1A1A1A italic large, centered: "Não existe pele perfeita." Below in smaller same serif: "Existe pele cuidada com método." A thin gold #D4AF37 accent line between the two lines. "06/07" gold label top-right. Very airy composition. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-25-carrossel-dois-tipos-mulher-v1-slide7-cta",
    seed: 25507,
    desc: "25/05 Slide 7 CTA - 'Comenta inverno'",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel final CTA slide for Camila Estética. Full bleed pure white #FFFFFF background, very airy. Centered glassmorphism panel. EXACT text in serif Playfair Display soft black #1A1A1A medium centered: "Em junho, abrimos a temporada." Below smaller sans-serif Inter Regular soft black: "Comenta 'inverno' pra receber." Below that, a clean rectangular CTA badge with thin gold #D4AF37 border (3px) rounded corners (10px), inside the badge the single uppercase bold word "INVERNO" in gold sans-serif letter-spaced. "07/07" gold label top-right. Tiny "— CAMILA ESTÉTICA" gold signature at bottom. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },

  // ============================================
  // 27/05 (Qua) — CAPA REEL Dra. Camila manifesto (Variação D, i2i)
  // 9:16 cover com Dra. + tipografia serif
  // ============================================
  {
    nome: "2026-05-27-capa-reel-dra-manifesto-v1",
    seed: 27501,
    useAvatar: true,
    desc: "27/05 Capa Reel Dra. manifesto (Var D, i2i)",
    prompt: `${PRESERVE_IDENTITY}

EDIT THIS PHOTOGRAPH into a vertical 9:16 Instagram Reel cover for Camila Estética (high-end aesthetic clinic in Bauru/SP, female only).

1. PRESERVE the woman from the input photograph EXACTLY — face, eyes, hair, expression must be unmistakably Dr. Camila Slobodticov. Place her in the lower-left portion of the vertical frame, in a 3/4 contemplative pose, slight side angle, gaze off-camera (NOT looking at lens), wearing a white linen shirt with natural drape.

2. REPLACE the background with an editorial cream-white #FBF7F4 interior clinic ambiance: soft single window light from the left at golden hour, a sheer translucent linen curtain backlit casting soft warm shadows, slight haze in the air, Aesop apothecary brand film aesthetic. Generous negative space on the right side of the frame.

3. ON the upper-right portion of the image, integrated cleanly, render EXACT text:
   - Top small uppercase gold #D4AF37 letter-spaced sans-serif: "MANIFESTO"
   - Below large elegant Playfair Display serif italic soft black #1A1A1A in 3 lines stacked: line 1 "Existem", line 2 "dois tipos", line 3 "de cliente."
   - Below all text, a thin horizontal gold #D4AF37 accent line about 100px wide
   - Tiny bottom signature in gold uppercase sans-serif letter-spaced: "— DRA. CAMILA"

4. ${ANTI_AI_REALISM}

5. Color grade: slightly desaturated cream-and-white, soft warm tones, NO saturated colors, NO clinical lighting, NO sterile medical look. Editorial magazine aesthetic, Kinfolk meets Aman Resorts.

${TYPOGRAPHY_NOTE}

NEGATIVE: ${NEG}, no smile to camera, no medical equipment, no clinic signage, no aggressive contrast.`,
  },

  // ============================================
  // 29/05 (Sex) — CARROSSEL "5 perguntas" — 7 slides, Variação B (Soft Pink)
  // Seed sequencial 29501-29507
  // ============================================
  {
    nome: "2026-05-29-carrossel-5perguntas-pele-v1-slide1-capa",
    seed: 29501,
    desc: "29/05 Slide 1 capa - '5 perguntas que sua pele faria'",
    prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel cover for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background (almost white with a kiss of pink). Centered an editorial photograph framed with rounded white border thick: a woman with eyes closed in soft natural light, peaceful expression, cream linen behind. Above the photo, in serif Playfair Display soft black #1A1A1A italic centered EXACT text: "5 perguntas que sua pele faria pra você se pudesse falar." A thin gold #D4AF37 accent line below the headline. Tiny "01/07" gold label top-right. Generous breathing space. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}, no saturation pop, no aggressive pink, no medical look.`,
  },
  {
    nome: "2026-05-29-carrossel-5perguntas-pele-v1-slide2-p1",
    seed: 29502,
    desc: "29/05 Slide 2 - pergunta 1 chamar atenção",
    prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered an editorial soft-focus photograph (detail of feminine skin or hands at rest) framed with rounded white border. Above the photo, EXACT text: small uppercase gold #D4AF37 letter-spaced "PERGUNTA 01"; below in serif Playfair Display italic soft black #1A1A1A centered: "Por que você só lembra de mim quando eu chamo atenção?" Thin gold accent line. "02/07" gold label top-right. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-29-carrossel-5perguntas-pele-v1-slide3-p2",
    seed: 29503,
    desc: "29/05 Slide 3 - pergunta 2 sérum novo",
    prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered editorial photograph framed with rounded white border (still-life of skincare bottles cream-toned, NOT branded). EXACT text: small uppercase gold #D4AF37 letter-spaced "PERGUNTA 02"; below in serif Playfair Display italic soft black #1A1A1A centered: "Por que você compra sérum novo, mas nunca me pergunta o que eu preciso?" Thin gold accent line. "03/07" gold label top-right. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-29-carrossel-5perguntas-pele-v1-slide4-p3",
    seed: 29504,
    desc: "29/05 Slide 4 - pergunta 3 esperar o verão",
    prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered editorial photograph framed with rounded white border (soft warm window-light scene). EXACT text: small uppercase gold #D4AF37 letter-spaced "PERGUNTA 03"; below in serif Playfair Display italic soft black #1A1A1A centered: "Por que você espera o verão pra correr atrás do que poderia ter feito no inverno?" Thin gold accent line. "04/07" gold label top-right. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-29-carrossel-5perguntas-pele-v1-slide5-p4",
    seed: 29505,
    desc: "29/05 Slide 5 - pergunta 4 limpeza de pele qualquer",
    prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered editorial photograph framed with rounded white border. EXACT text: small uppercase gold #D4AF37 letter-spaced "PERGUNTA 04"; below in serif Playfair Display italic soft black #1A1A1A centered: "Por que você confia em qualquer um que diga 'limpeza de pele'?" Thin gold accent line. "05/07" gold label top-right. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-29-carrossel-5perguntas-pele-v1-slide6-p5",
    seed: 29506,
    desc: "29/05 Slide 6 - pergunta 5 olhar de verdade",
    prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered editorial photograph framed with rounded white border (delicate close-up of feminine eye area in soft natural light, NOT close-up of an actual eye - softer abstract feel). EXACT text: small uppercase gold #D4AF37 letter-spaced "PERGUNTA 05"; below in serif Playfair Display italic soft black #1A1A1A centered: "Quando foi a última vez que alguém me olhou de verdade?" Thin gold accent line. "06/07" gold label top-right. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
  {
    nome: "2026-05-29-carrossel-5perguntas-pele-v1-slide7-cta",
    seed: 29507,
    desc: "29/05 Slide 7 CTA - 'Comenta inverno'",
    prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel final CTA slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text in serif Playfair Display soft black #1A1A1A medium italic centered: "Talvez seja hora de uma avaliação séria." Below in smaller sans-serif Inter Regular soft black: "Em junho, abrimos espaço." Below that, a clean rectangular CTA badge with thin gold #D4AF37 border (3px) rounded corners, inside single uppercase bold word "INVERNO" in gold sans-serif letter-spaced. "07/07" gold label top-right. Tiny "— CAMILA ESTÉTICA" gold signature at bottom. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },

  // ============================================
  // 30/05 (Sáb) — POST ÂNCORA Dra. olhando pela janela (Variação D, i2i)
  // 4:5 single post + tipografia serif manifesto
  // ============================================
  {
    nome: "2026-05-30-post-ancora-dra-janela-v1",
    seed: 30501,
    useAvatar: true,
    desc: "30/05 Post âncora Dra. janela (Var D, i2i)",
    prompt: `${PRESERVE_IDENTITY}

EDIT THIS PHOTOGRAPH into a 4:5 vertical Instagram anchor post for Camila Estética (premium aesthetic clinic, female only).

1. PRESERVE the woman from the input photograph EXACTLY — face, eyes, hair, expression must be unmistakably Dr. Camila Slobodticov. Recompose her in the LEFT half of the frame, 3/4 profile angle, looking out a window (gaze off-camera, away from lens), contemplative serene expression, slight downward gaze, wearing a white linen shirt with natural soft drape.

2. SET design: she stands beside a tall window with translucent linen curtain backlit by warm golden-hour light from outside. The clinic interior is cream-white #FBF7F4, limewash walls, soft directional shadow. To her right side a small detail of a fresh white peony in a simple ceramic vase on a marble shelf. Generous negative space on the right side of the frame.

3. ON the right portion of the image, integrated with the negative space, render EXACT text in serif Playfair Display large soft black #1A1A1A italic stacked in 3 lines: line 1 "Junho abre", line 2 "uma temporada nova", line 3 "na Camila Estética." Below the text a thin horizontal gold #D4AF37 accent line about 120px wide. Tiny "— DRA. CAMILA" gold uppercase letter-spaced signature at very bottom right.

4. ${ANTI_AI_REALISM}

5. Color grade: slightly desaturated cream-and-white-with-gold-warm-tint, Kodak Portra 400 vibe, NO saturation pop, NO clinical white, NO sterile feel. Mood: Kinfolk magazine, Aman Resorts brand film, Augustinus Bader print campaign.

${TYPOGRAPHY_NOTE}

NEGATIVE: ${NEG}, no smile to camera, no clinical signage, no medical equipment, no aggressive contrast, no fake bokeh.`,
  },

  // ============================================
  // 31/05 (Dom) — Post encerramento (Variação A)
  // ============================================
  {
    nome: "2026-05-31-post-encerramento-v1",
    seed: 31501,
    desc: "31/05 Post encerramento - 'Maio acabou. Junho começa diferente.'",
    prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram single post for Camila Estética. Full bleed pure white #FFFFFF background, very airy. Centered translucent frosted glass panel (glassmorphism, very subtle). EXACT text stacked centered:
- Top line large serif Playfair Display soft black #1A1A1A: "Maio acabou."
- Middle line same serif soft pink #D4A5B5 italic slightly smaller: "Junho começa diferente."
- A thin gold #D4AF37 accent line between the two lines, about 80px wide centered.
- At very bottom in tiny uppercase gold sans-serif letter-spaced: "— CAMILA ESTÉTICA"
Very generous negative space, breathing composition, editorial magazine quality. ${TYPOGRAPHY_NOTE} NEGATIVE: ${NEG}.`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

async function gerarUmPost(post, fotoBase64) {
  const partes = [];
  if (post.useAvatar && fotoBase64) {
    partes.push({
      inlineData: { data: fotoBase64, mimeType: "image/jpeg" },
    });
  }
  partes.push({ text: post.prompt });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: partes }],
    config: {
      responseModalities: ["IMAGE"],
      seed: post.seed,
    },
  });

  // Extrair imagem da resposta
  const candidate = response.candidates?.[0];
  if (!candidate) throw new Error("Resposta sem candidates");

  const imagePart = candidate.content?.parts?.find((p) => p.inlineData);
  if (!imagePart) throw new Error("Resposta sem inlineData de imagem");

  const imageBytes = Buffer.from(imagePart.inlineData.data, "base64");
  const outputPath = path.join(OUTPUT_DIR, `${post.nome}.png`);
  await fs.writeFile(outputPath, imageBytes);

  return { nome: post.nome, path: outputPath, status: "ok", size: imageBytes.length };
}

async function main() {
  console.log("=== Artes Camila Estética — Maio 2026 ===");
  console.log(`Modelo: ${MODEL}`);
  console.log(`Total: ${posts.length} imagens (síncrono paralelo, batches de ${PARALLEL_BATCH_SIZE})`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Foto avatar Var D: ${FOTO_AVATAR_VAR_D}`);
  console.log("");

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Pre-load foto avatar uma única vez
  const fotoPath = path.join(FOTOS_DIR, FOTO_AVATAR_VAR_D);
  const fotoBytes = await fs.readFile(fotoPath);
  const fotoBase64 = fotoBytes.toString("base64");
  console.log(`✓ Foto avatar carregada (${(fotoBytes.length / 1024).toFixed(0)} KB)`);
  console.log("");

  const inicio = Date.now();
  const resultados = [];

  // Executa em batches paralelos
  for (let i = 0; i < posts.length; i += PARALLEL_BATCH_SIZE) {
    const batch = posts.slice(i, i + PARALLEL_BATCH_SIZE);
    const batchNum = Math.floor(i / PARALLEL_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(posts.length / PARALLEL_BATCH_SIZE);
    console.log(`▶ Batch ${batchNum}/${totalBatches}: ${batch.map((p) => p.nome).join(", ")}`);

    const promises = batch.map((p) =>
      gerarUmPost(p, fotoBase64).catch((err) => ({
        nome: p.nome,
        status: "erro",
        erro: err.message || String(err),
      }))
    );

    const batchResults = await Promise.all(promises);
    resultados.push(...batchResults);

    batchResults.forEach((r) => {
      if (r.status === "ok") {
        console.log(`  ✓ ${r.nome} (${(r.size / 1024).toFixed(0)} KB)`);
      } else {
        console.log(`  ❌ ${r.nome}: ${r.erro}`);
      }
    });
  }

  const totalSeg = ((Date.now() - inicio) / 1000).toFixed(0);
  const sucessos = resultados.filter((r) => r.status === "ok").length;
  const falhas = resultados.filter((r) => r.status === "erro").length;

  console.log("");
  console.log("=== RESUMO ===");
  console.log(`Tempo total: ${totalSeg}s`);
  console.log(`Sucessos: ${sucessos}/${posts.length}`);
  if (falhas > 0) {
    console.log(`Falhas: ${falhas}`);
    resultados
      .filter((r) => r.status === "erro")
      .forEach((r) => console.log(`  - ${r.nome}: ${r.erro}`));
  }
  console.log(`Pasta: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("❌ ERRO FATAL:", err);
  process.exit(1);
});
