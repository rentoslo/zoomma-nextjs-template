// =====================================================
// CAMILA ESTÉTICA — JUNHO 2026 · 17 posts no padrão v3
// =====================================================
// Modelo: gemini-3-pro-image-preview (Google AI direto via GOOGLE_AI_API_KEY)
// Aspect ratio: 4:5 para posts/carrosséis · 9:16 para frames de Reels
//
// PADRÃO v3 (2026-05-29):
//   - Cada post numa subpasta própria: entregaveis/NN_AAAA-MM-DD_{tipo}_{tema}/
//     Conteúdo:
//       Post:        imagem.png + legenda.txt + prompt.txt
//       Carrossel:   01.png ... 07.png + legenda.txt + prompt.txt
//       Reel:        frame_01.png ... frame_NN.png + legenda.txt + roteiro.txt + prompt.txt
//                    (capa.png e video.mp4 entram depois, após filmagem/edição)
//   - CSV no raiz da pasta do mês: agenda-publicacao-camila-estetica-junho-2026.csv
//
// Output (Fase 2 da migração Drive → Supabase, 2026-05-30):
//   Local: c:\github\produtor_agendas_editoriais\clientes\camila-estetica\agendas\2026-06\
//   Distribuição ao cliente: link público /a/<token> via `npm run agenda:publicar`
//
// Posts com i2i da Dra. (modo EDIT com foto real):
//   - 02 (03/06) frame 1 → IMG_3677.jpg  (jaleco/camisa branca, janela)
//   - 09 (15/06) post âncora → IMG_3677.jpg
//   - 11 (19/06) frames 1 e 3 → IMG_3677.jpg
//   - 14 (24/06) frame 4 → IMG_3677.jpg (opcional)
//
// Execução:
//   cd scripts
//   node gerar_camila_junho.mjs
//   # ou só uma faixa:
//   SOMENTE_IDS=09,11 node gerar_camila_junho.mjs
// =====================================================

import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { gerarAgendaCsv } from "./lib/agenda_csv.mjs";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  console.error("ERRO: GOOGLE_AI_API_KEY não encontrada em .env");
  process.exit(1);
}

const MODEL = "gemini-3-pro-image-preview";
const PARALLEL_BATCH_SIZE = 4;

const SOMENTE_IDS = (process.env.SOMENTE_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const REPO_ROOT = path.join(import.meta.dirname, "..");
const LOCAL_AGENDA_DIR = path.join(
  REPO_ROOT,
  "clientes",
  "camila-estetica",
  "agendas",
  "2026-06"
);
// FOTOS_DIR é INPUT — banco de fotos do avatar da Dra. lido no i2i. Mantido no Drive.
const FOTOS_DIR = "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\fotos_avatar";

// =====================================================
// IDENTIDADE VISUAL — trechos reutilizáveis
// =====================================================

const DNA_BASE = `white dominant premium aesthetic, elegant translucent glassmorphism layers, soft whispered pink accents, refined editorial sophistication, breathing negative space, delicate airy shadows, premium magazine quality, frosted glass overlays, gentle rose blush touches, polished feminine luxury, silk-soft contrast, controlled vibrancy quiet elegance, soft diffused natural lighting`;

const NEG = `oversaturated, harsh contrast, neon colors, aggressive pop, saturated pink dominant, heavy pink background, opaque pink walls, hot pink, magenta, fuchsia, cluttered, busy, chaotic, muddy colors, washed out badly, dull, flat boring, low quality, blurry photo, soft focus errors, poor quality, pixelated, noisy, grainy, illegible text, poor typography, unreadable font, garbled text, missing accents, broken letters, doubled letters, hyphen-split words, repeated lines of text, duplicated phrases, cheap looking, amateur, unprofessional, messy composition, unbalanced, distracting elements, watermark, signature, logo overlay, dark moody background, gothic, dramatic shadows, cold blue tones, reclining woman, woman lying down, sensual pose, suggestive pose, intimate setting, bedroom setting, exposed body, open robe, different person, different woman, unknown woman`;

const TYPO_RULES = `Typography must be PERFECTLY legible with all Portuguese accents intact (á, ã, ç, é, ê, í, ó, ô, õ, ú). Crisp clean letter shapes. NO broken letters, NO doubled letters, NO hyphen-split words. EXACT spelling required. CRITICAL: NEVER repeat any line of text — each line appears EXACTLY ONCE, no duplicated lines, no duplicated phrases, no accidental repetition between adjacent lines.`;

const NUMERACAO_RULE = `IMPORTANT: The slide number indicator (e.g. "01/07") must appear ONLY ONCE in the entire image, placed in the top-right corner OUTSIDE any translucent panel.`;

const VAR_A = `pure white #FFFFFF dominant background airy editorial luxury, translucent frosted glass panel overlay holding text glassmorphism effect subtle blur, photograph framed with rounded corners thick white border premium magazine style, elegant serif Playfair Display combined with bold sans-serif headline soft black #1A1A1A, whispered pink #FCE4EC details barely visible, soft diffused natural lighting, refined sophisticated atmosphere, generous negative space, premium editorial feminine, aspect ratio 4:5`;

const VAR_B = `soft whispered pink #FCE4EC veil background gentle wash desaturated, almost-white pink barely tinted, photograph framed with rounded white border centered, white or soft black typography elegant mix serif Playfair Display and bold sans-serif, generous breathing space, delicate feminine premium atmosphere, soft diffused lighting, editorial magazine quality, refined gentle sophistication, no saturation pop, aspect ratio 4:5`;

const VAR_E_STILLLIFE = `Editorial still-life photography composition, apothecary crystal bottle with soft golden #D4AF37 cap, white rose petal, cream linen fabric, Calacatta white marble surface, single window light from the left at golden hour, soft directional shadows with gentle falloff, generous negative space at least 60% empty, medium-format Hasselblad 100mm f/2.8 macro look, razor-shallow depth of field, Kodak Portra 400 film grain subtle, cream and marble white dominant palette, transparent crystal refractions, NO TEXT NO SUBTITLES NO CAPTIONS NO LOGOS NO WATERMARKS, mood references: Aman Resorts campaign, La Mer commercial, Augustinus Bader print ad, Byredo product film, Kinfolk magazine aesthetic, aspect ratio 4:5`;

const ANTI_AI_REALISM = `photographic realism, real skin texture with visible pores and subtle fine lines, single loose strand of hair near temple, natural light from a single window casting soft directional shadow, subtle film grain like Kodak Portra 400, medium-format depth of field (Hasselblad 85mm f/2.0 look), slightly desaturated cream-and-white tones, editorial magazine aesthetic, NOT digital art, NOT AI-generated look, NOT plastic skin, NO over-smoothing`;

// =====================================================
// CALENDÁRIO COMPLETO JUNHO 2026 — 17 posts
// =====================================================

const calendario = [
  // ============================================
  // 01 · 01/06 (Seg) · CARROSSEL "A janela do inverno" · Var A
  // ============================================
  {
    post_id: "01",
    data: "2026-06-01",
    dia_semana: "seg",
    tipo: "carrossel",
    pilar: "P1 Educação",
    tema: "janela-inverno",
    legenda: `A pele responde ao clima antes da gente perceber.

A queda na umidade, a temperatura mais baixa, o sol mais oblíquo. Tudo isso muda o que a pele precisa receber. E a maioria das mulheres só nota quando o ressecamento já se instalou.

Aqui na clínica, junho e julho são os meses em que a pele aceita mais. Aceita peeling, aceita estímulo, aceita reconstrução. É a janela do ano em que faz mais sentido investir em construção.

Em breve, abrimos uma temporada nova. Para quem quer construir, não só resolver.

Comenta "inverno" para ficar por dentro.`,
    hashtags: "#esteticafacial #esteticabauru #cuidadocomapele #gerenciamentodepele #peledeinverno",
    slides: [
      {
        seed: 60101,
        desc: "S1 capa - Junho não é mais frio, é mais inteligente",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel cover for Camila Estética (aesthetic clinic Bauru, female only). Full bleed warm off-white #FBF7F4 background with subtle linen texture. Behind the panel, a soft editorial photograph of a window with sheer linen curtain partially drawn, oblique winter morning sunlight passing through, light haze, slightly desaturated cream tones. Centered translucent frosted glass panel (glassmorphism, 75% opacity, rounded corners). On the panel EXACT text in two lines: line 1 large elegant serif Playfair Display soft black #1A1A1A italic: "Junho não é mais frio."; line 2 below same serif slightly smaller: "Junho é mais inteligente." A thin horizontal gold #D4AF37 accent line about 80px wide between the two lines. Tiny "01/07" gold sans-serif label top-right outside the panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}, no clinical look, no medical equipment.`,
      },
      {
        seed: 60102,
        desc: "S2 - princípio 01 verão defesa",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered translucent frosted glass panel (75% opacity, rounded corners). EXACT text: small uppercase gold #D4AF37 letter-spaced sans-serif "PRINCÍPIO 01" at top of panel; below in elegant Playfair Display serif italic soft black #1A1A1A centered: "No verão, a pele se defende." Below a thin gold accent line. Tiny "02/07" gold sans-serif label top-right outside panel. Subtle warm macro detail behind the glass — abstract skin texture in soft sun. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60103,
        desc: "S3 - princípio 02 inverno se entrega",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "PRINCÍPIO 02" at top; below serif Playfair Display italic soft black #1A1A1A centered: "No inverno, ela se entrega." Thin gold accent line. "03/07" gold label top-right outside panel. Subtle cool editorial backdrop. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60104,
        desc: "S4 - princípio 03 peelings/microag/plasma (sem PEIM - feedback Camila 2026-05-29)",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "PRINCÍPIO 03" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Peelings, microagulhamento" / "e jato de plasma rendem mais agora." Thin gold accent line. "04/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60105,
        desc: "S5 - cada inverno é uma janela",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text in serif Playfair Display italic soft black #1A1A1A large centered, two lines: "Cada inverno" / "é uma janela." Thin gold #D4AF37 accent line between the two lines, about 80px wide. "05/07" gold label top-right outside panel. Subtle warm window-light editorial backdrop behind glass. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60106,
        desc: "S6 - quem entende trata no inverno",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "VERDADE" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Quem entende o ciclo da pele," / "trata no inverno." Thin gold accent line. "06/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60107,
        desc: "S7 CTA - em breve abrimos temporada",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel final CTA slide for Camila Estética. Full bleed pure white #FFFFFF background, very airy. Centered translucent glassmorphism panel. EXACT text in serif Playfair Display soft black #1A1A1A italic centered: "Em breve, abrimos uma temporada nova." Below in smaller sans-serif Inter Regular soft black: "Comenta 'inverno' para ficar por dentro." Below that a clean rectangular CTA badge with thin gold #D4AF37 border (3px) rounded corners (10px), inside the single uppercase bold word "INVERNO" in gold sans-serif letter-spaced. Tiny "— CAMILA ESTÉTICA" gold uppercase letter-spaced signature at very bottom. "07/07" gold label top-right outside panel. Very generous negative space. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
    ],
  },

  // ============================================
  // 02 · 03/06 (Qua) · REEL Dra. "A ciência por trás" · Var A · 9:16
  // Frame 1 (i2i Dra.) REMOVIDO em 2026-05-29 — i2i regenerou face
  // Reel é filmado pela Camila; frames aqui só referência visual
  // ============================================
  {
    post_id: "02",
    data: "2026-06-03",
    dia_semana: "qua",
    tipo: "reel",
    pilar: "P2 Autoridade",
    tema: "ciencia-por-tras",
    legenda: `Tratar a pele no inverno não é estética. É técnica.

A baixa fotossensibilidade do inverno permite o que o verão não permite: estímulo profundo sem risco de hipercromia.

É por isso que cada inverno é uma janela. Em breve, abrimos uma temporada inteira ao redor dela.

Comenta "inverno" para receber primeiro.`,
    hashtags: "#drcamila #esteticafacial #esteticabauru #peledeinverno #fotossensibilidade",
    roteiro: `[Take 1 — Dra. olhando à câmera, tom técnico claro]
"Quando a gente fala em tratar a pele no inverno, não é uma questão estética. É técnica."

[pausa de 1s · cortar para close de mão da Dra. anotando]

[Take 2 — Dra. à câmera]
"No verão, o sol chega quase perpendicular. A pele aumenta a produção de melanina para se proteger."

[pausa de 1s]

"No inverno, o sol é oblíquo. A fotossensibilidade cai."

[cortar para frame ilustrativo de luz oblíqua em janela com cortina de linho]

[Take 3 — Dra. à câmera]
"Isso significa que a pele aceita peeling, estímulo, microagulhamento — sem o risco de hipercromia que existe no verão."

[Take 4 — Dra. em meio sorriso pensativo, olhar 3/4]
"Não é que a pele 'precisa' de cuidado no inverno."
"É que o inverno é quando a pele consegue receber o cuidado certo."

[fim · 2s de plano contemplativo · fade out]`,
    frames: [
      {
        seed: 60302,
        aspectRatio: "9:16",
        desc: "Frame 2 - close mão anotando caderno",
        prompt: `Editorial cinematic close-up photograph for a vertical 9:16 Instagram Reel frame. A feminine hand (warm tan skin tone, manicured neutral nail) holding a fine fountain pen, writing in a leather-bound cream notebook on a marble surface. Depth of field shallow — hand and pen tack sharp, page slightly out of focus. Natural soft window light from the left, slightly desaturated cream tones, Kodak Portra 400 grain, medium-format Hasselblad 100mm f/2.8 look. Real skin texture on the hand, no symmetrical AI hand, no extra fingers. ABSOLUTELY NO TEXT visible on the page (just suggestion of handwriting strokes). Aspect ratio 9:16 vertical. NO TEXT OVERLAY on the image. NEGATIVE: ${NEG}, no extra fingers, no symmetrical AI hand, no plastic skin, no readable writing on the page.`,
      },
      {
        seed: 60303,
        aspectRatio: "9:16",
        desc: "Frame 3 - janela com luz oblíqua",
        prompt: `Editorial cinematic detail photograph for a vertical 9:16 Instagram Reel frame. A tall window with translucent linen curtain partially drawn, oblique winter sunlight at a low angle passing through, visible dust particles in the warm light beam, soft cream limewash walls in the background slightly out of focus. Generous negative space at least 60% of the frame. Slightly desaturated cream-and-warm tones, Kodak Portra 400 film grain, medium-format aesthetic (Hasselblad 100mm f/2.8). Mood: Kinfolk, Aman Resorts, Aesop. Aspect ratio 9:16 vertical. NO TEXT, NO LOGO, NO WATERMARK on the image. NEGATIVE: ${NEG}, no over-processed light, no fake lens flare, no digital art aesthetic.`,
      },
    ],
  },

  // ============================================
  // 03 · 05/06 (Sex) · CARROSSEL "5 protocolos que o inverno pede" · Var B
  // Título atualizado em 2026-05-29 (feedback Camila — não invalidar verão)
  // ============================================
  {
    post_id: "03",
    data: "2026-06-05",
    dia_semana: "sex",
    tipo: "carrossel",
    pilar: "P4 Cuidados",
    tema: "5-protocolos-inverno",
    legenda: `Não é sobre fazer tratamento "porque está frio". É sobre fazer o tratamento que rende mais com baixa fotossensibilidade.

Esses 5 são os que mais pedem o inverno. Em breve, eles compõem o que estamos preparando.

Comenta "inverno" para entrar na lista.`,
    hashtags: "#peelingquimico #microagulhamento #pdrn #esteticabauru #drcamila #peledeinverno",
    slides: [
      {
        seed: 60501,
        desc: "S1 capa - 5 protocolos que o inverno pede",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel cover for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background (almost white with a kiss of pink). Centered an editorial photograph framed with rounded white border thick: a woman receiving a calm aesthetic treatment in soft natural side-light, eyes closed, real skin texture, side profile, slightly desaturated. Above the photo, in serif Playfair Display soft black #1A1A1A italic centered, EXACT text in two lines: "5 protocolos" / "que o inverno pede." A thin gold #D4AF37 accent line below the headline. Tiny "01/07" gold label top-right outside. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}, no plastic skin, no aggressive pink, no medical look.`,
      },
      {
        seed: 60502,
        desc: "S2 - Peeling químico",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "PROTOCOLO 01" at top; below in elegant Playfair Display serif italic soft black #1A1A1A centered: "Peeling químico de média profundidade." Thin gold accent line. "02/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60503,
        desc: "S3 - Microagulhamento drug delivery",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "PROTOCOLO 02" at top; below in serif Playfair Display italic soft black #1A1A1A centered: "Microagulhamento com drug delivery." Thin gold accent line. "03/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60504,
        desc: "S4 - PDRN",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "PROTOCOLO 03" at top; below in serif Playfair Display italic soft black #1A1A1A centered: "PDRN — reparo celular profundo." Thin gold accent line. "04/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60505,
        desc: "S5 - RF microagulhada",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "PROTOCOLO 04" at top; below in serif Playfair Display italic soft black #1A1A1A centered: "RF microagulhada — colágeno por calor." Thin gold accent line. "05/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60506,
        desc: "S6 - Jato de plasma",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "PROTOCOLO 05" at top; below in serif Playfair Display italic soft black #1A1A1A centered: "Jato de plasma — renovação por sublimação." Thin gold accent line. "06/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60507,
        desc: "S7 CTA",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel final CTA slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text in serif Playfair Display soft black #1A1A1A italic medium centered: "Em breve, uma temporada inteira ao redor desses protocolos." Below in smaller sans-serif Inter Regular soft black: "Comenta 'inverno'." Below that a clean rectangular CTA badge with thin gold #D4AF37 border (3px) rounded corners, inside single uppercase bold word "INVERNO" in gold sans-serif letter-spaced. Tiny "— CAMILA ESTÉTICA" gold signature at bottom. "07/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
    ],
  },

  // ============================================
  // 04 · 07/06 (Dom) · POST CAT 3 "Domingo lento" · Var E téc. A · 4:5
  // ============================================
  {
    post_id: "04",
    data: "2026-06-07",
    dia_semana: "dom",
    tipo: "post",
    pilar: "atmosfera",
    tema: "domingo-lento",
    legenda: `Domingo lento.`,
    hashtags: "#esteticabauru #ritualdepele #editorialbeauty",
    seed: 60701,
    prompt: `${VAR_E_STILLLIFE} Editorial still-life: three matte glass cream jars in graduated heights aligned on a light Calacatta cream marble surface, a folded silk cream cloth partially draped beside them, a single ray of golden hour window light from the left, 70% negative space dominating the composition. Medium-format aesthetic (Hasselblad 100mm f/2.8), Kodak Portra 400 grain, slightly desaturated cream-and-white tones, editorial luxury mood (Aman Resorts, La Mer reference). 4:5 vertical composition. ABSOLUTELY NO TEXT, NO LOGO, NO WATERMARK. Pure silent atmosphere. NEGATIVE: ${NEG}, no people, no faces, no body parts, no clinical scene.`,
  },

  // ============================================
  // 05 · 08/06 (Seg) · CARROSSEL "Limpeza/peeling/microag" · Var A · 6 slides
  // Slide PEIM REMOVIDO em 2026-05-29 — PEIM não pode ser feito no rosto (feedback Camila)
  // ============================================
  {
    post_id: "05",
    data: "2026-06-08",
    dia_semana: "seg",
    tipo: "carrossel",
    pilar: "P1 Educação",
    tema: "limpeza-peeling-microag-peim",
    legenda: `Existe muita confusão entre os tratamentos. Cada um tem indicação técnica específica.

O que diferencia uma clínica é saber qual aplicar, em qual ordem, em qual pele. Não é menu. É desenho.

Em breve, abrimos uma temporada inteira de protocolos desenhados.

Comenta "inverno".`,
    hashtags: "#esteticafacial #peeling #microagulhamento #drcamila #esteticabauru",
    slides: [
      {
        seed: 60801,
        desc: "S1 capa - você sabe a diferença? (sem PEIM)",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel cover for Camila Estética. Full bleed warm off-white #FBF7F4 background with subtle linen texture. Centered translucent frosted glass panel (glassmorphism). EXACT text in serif Playfair Display italic soft black #1A1A1A large centered, three lines: "Você sabe a diferença" / "entre limpeza, peeling" / "e microagulhamento?" Thin gold #D4AF37 accent line below the headline. Tiny "01/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60802,
        desc: "S2 - limpeza de pele",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "TRATAMENTO 01" at top; below serif Playfair Display italic soft black #1A1A1A centered: "Limpeza de pele." Below in smaller sans-serif Inter Regular soft black: "Higienização profunda. Manutenção mensal." Thin gold accent line. "02/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60803,
        desc: "S3 - peeling químico",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "TRATAMENTO 02" at top; below serif Playfair Display italic soft black #1A1A1A centered: "Peeling químico." Below in smaller sans-serif Inter Regular soft black: "Ácidos. Renovação celular acelerada." Thin gold accent line. "03/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60804,
        desc: "S4 - microagulhamento",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "TRATAMENTO 03" at top; below serif Playfair Display italic soft black #1A1A1A centered: "Microagulhamento." Below in smaller sans-serif Inter Regular soft black: "Estímulo de colágeno. Atinge a derme." Thin gold accent line. "04/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60806,
        desc: "S5 - cada um resolve coisa diferente",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text in serif Playfair Display italic soft black #1A1A1A large centered, two lines: "Cada um resolve" / "uma coisa diferente." Thin gold #D4AF37 accent line between the two lines, about 80px wide. Below in smaller sans-serif Inter Regular soft black: "Combinados, viram protocolo." "05/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 60807,
        desc: "S6 CTA",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel final CTA slide for Camila Estética. Full bleed pure white #FFFFFF background, very airy. Centered glassmorphism panel. EXACT text in serif Playfair Display soft black #1A1A1A italic medium centered: "Em breve, abrimos uma temporada de protocolos combinados." Below in smaller sans-serif Inter Regular soft black: "Comenta 'inverno'." Below that a clean rectangular CTA badge with thin gold #D4AF37 border (3px) rounded corners, inside single uppercase bold word "INVERNO" in gold sans-serif letter-spaced. Tiny "— CAMILA ESTÉTICA" gold signature at bottom. "06/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
    ],
  },

  // ============================================
  // 06 · 10/06 (Qua) · REEL "3 mitos" 4 fundos · Var B Soft Pink · 9:16
  // (texto será aplicado em edição — só fundos)
  // ============================================
  {
    post_id: "06",
    data: "2026-06-10",
    dia_semana: "qua",
    tipo: "reel",
    pilar: "P4 Cuidados",
    tema: "3-mitos-pele-inverno",
    legenda: `3 mitos que custam caro para quem acredita.

A pele do inverno não é uma pele "no frio". É uma pele com a janela aberta para construção. Quem entende isso, otimiza a estação.

Em breve, abrimos uma temporada ao redor desse princípio.

Comenta "inverno" para receber primeiro.`,
    hashtags: "#cuidadocomapele #esteticabauru #drcamila #peledeinverno #ritualdepele",
    roteiro: `Card 1 — MITO: "Frio resseca a pele, então quanto mais hidratante, melhor."
REVELAÇÃO: "Hidratação sem barreira é gasto. A pele de inverno pede construção de barreira: ceramidas, ácidos graxos. Não só água."

Card 2 — MITO: "No inverno não precisa de protetor solar."
REVELAÇÃO: "O UV continua. E a fotossensibilidade pós-tratamento exige proteção ainda mais consistente. Protetor é o ativo mais importante do inverno."

Card 3 — MITO: "Tratamento no inverno é caro porque está na moda."
REVELAÇÃO: "É no inverno porque a pele responde. Quem trata fora dessa janela costuma pagar em complicação depois."

Trilha: voz over feminina suave + piano leve, mood Aman/Kinfolk. Texto na tela aplicado em edição.`,
    frames: [
      {
        seed: 61001,
        aspectRatio: "9:16",
        desc: "Fundo card 1 - cortina linho dourada",
        prompt: `Clean editorial vertical 9:16 background for an animated text card. Cream-white #FBF7F4 to soft whispered pink #FCE4EC gradient, very subtle, with a sheer translucent linen curtain partially visible at the right edge backlit by warm golden hour light, soft natural film texture, generous negative space, slightly desaturated, Kodak Portra 400 grain, medium-format aesthetic. NO TEXT, NO OVERLAY, just atmosphere. Aspect ratio 9:16 vertical. NEGATIVE: ${NEG}, no busy background, no clutter, no people.`,
      },
      {
        seed: 61002,
        aspectRatio: "9:16",
        desc: "Fundo card 2 - gota d'água",
        prompt: `Editorial vertical 9:16 background frame. Extreme macro of a single perfect water droplet beading on a cream-white silk surface, soft side natural light catching the droplet's edge, slightly desaturated warm tones with a very subtle rose-cream veil, very generous negative space at least 70%, 100mm f/2.8 macro, Kodak Portra 400 grain, editorial luxury (Byredo, Aesop reference). NO TEXT, NO LOGO. Aspect ratio 9:16 vertical. NEGATIVE: ${NEG}, no clutter, no people, no faces.`,
      },
      {
        seed: 61003,
        aspectRatio: "9:16",
        desc: "Fundo card 3 - frasco luz fria",
        prompt: `Editorial vertical 9:16 still-life background. A single apothecary crystal bottle with soft golden cap standing on Calacatta cream marble, cool natural window light from upper left, very generous negative space at least 70%, slightly desaturated cream tones with subtle rose-cream whisper, medium-format aesthetic (Hasselblad 100mm f/2.8), Kodak Portra 400 grain, minimal, contemplative. NO TEXT, NO OVERLAY. Aspect ratio 9:16 vertical. NEGATIVE: ${NEG}, no clutter, no people.`,
      },
      {
        seed: 61004,
        aspectRatio: "9:16",
        desc: "Transição - cortina linho close",
        prompt: `Editorial vertical 9:16 transition frame. Soft close-up detail of a sheer cream linen curtain with warm golden hour light passing through it diagonally, visible woven texture of the linen, fibers catching the light, slightly desaturated cream tones with a subtle rose veil, 100mm f/2.8 macro look, Kodak Portra 400 grain, minimal, contemplative. NO TEXT, NO LOGO. Aspect ratio 9:16 vertical. NEGATIVE: ${NEG}, no people, no faces, no clutter.`,
      },
    ],
  },

  // ============================================
  // 07 · 12/06 (Sex) · CARROSSEL "Gerenciamento de pele" · Var A
  // ============================================
  {
    post_id: "07",
    data: "2026-06-12",
    dia_semana: "sex",
    tipo: "carrossel",
    pilar: "P1 Educação",
    tema: "gerenciamento-de-pele",
    legenda: `A diferença entre tratar e gerenciar a pele é a mesma diferença entre apagar incêndio e construir uma casa.

Tratar é reação. Gerenciar é projeto.

Tratar é uma sessão de cada vez. Gerenciar é um plano que cresce sessão a sessão.

Em 3 dias, abrimos a primeira temporada oficial de gerenciamento na clínica.

Comenta "inverno" para receber o convite antes do feed.`,
    hashtags: "#gerenciamentodepele #esteticafacial #drcamila #esteticabauru #cuidadocomapele",
    slides: [
      {
        seed: 61201,
        desc: "S1 capa - Gerenciamento de pele",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel cover for Camila Estética. Full bleed warm off-white #FBF7F4 background. Behind the panel a soft editorial still-life: a leather-bound notebook open on cream marble with suggestion of handwritten content (no readable text, just elegant stroke marks), a small crystal bottle in the corner, soft natural window light from the left, medium-format depth of field, Kodak Portra 400 grain. Centered translucent frosted glass panel. EXACT text in serif Playfair Display italic soft black #1A1A1A large centered, two lines: "Gerenciamento de pele." / "O que isso significa, de verdade?" Thin gold #D4AF37 accent line below. Tiny "01/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 61202,
        desc: "S2 - tratar vs gerenciar",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "DEFINIÇÃO" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Tratar é resolver." / "Gerenciar é desenhar o caminho." Thin gold accent line between. "02/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 61203,
        desc: "S3 - não é sessão, é plano",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "MÉTODO" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Não é uma sessão por incômodo." / "É um plano que antecipa." Thin gold accent line. "03/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 61204,
        desc: "S4 - componentes",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "COMPONENTES" at top; below serif Playfair Display italic soft black #1A1A1A centered, four short lines stacked: "Avaliação técnica." / "Registro fotográfico." / "Protocolo individual." / "Acompanhamento sessão a sessão." Thin gold accent line. "04/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 61205,
        desc: "S5 - não é pacote, é arquitetura",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text in serif Playfair Display italic soft black #1A1A1A large centered, two lines: "Não é pacote padrão." / "É arquitetura." Thin gold #D4AF37 accent line between, about 80px wide. "05/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 61206,
        desc: "S6 - alívio vs construção",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #D4AF37 letter-spaced "RESULTADO" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Tratar entrega alívio." / "Gerenciar entrega construção." Thin gold accent line between. "06/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 61207,
        desc: "S7 CTA - em 3 dias abrimos",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel final CTA slide for Camila Estética. Full bleed pure white #FFFFFF background, very airy. Centered glassmorphism panel. EXACT text in serif Playfair Display soft black #1A1A1A italic medium centered: "Em 3 dias, abrimos a primeira temporada oficial." Below in smaller sans-serif Inter Regular soft black: "Comenta 'inverno' para receber primeiro." Below that a clean rectangular CTA badge with thin gold #D4AF37 border (3px) rounded corners, inside single uppercase bold word "INVERNO" in gold sans-serif letter-spaced. Tiny "— CAMILA ESTÉTICA" gold signature at bottom. "07/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
    ],
  },

  // ============================================
  // 08 · 14/06 (Dom) · POST CAT 3 "Amanhã" macro linho · Var E téc. C · 4:5
  // ============================================
  {
    post_id: "08",
    data: "2026-06-14",
    dia_semana: "dom",
    tipo: "post",
    pilar: "atmosfera",
    tema: "amanha-macro-linho",
    legenda: `Amanhã.`,
    hashtags: "#esteticabauru #ritualdepele",
    seed: 61401,
    prompt: `Editorial extreme macro photography. Texture of cream linen fabric with warm golden hour light passing through diagonally, visible individual woven threads of the fabric, single fiber catching the light, slightly desaturated warm cream tones, editorial luxury mood (Byredo, Aesop, Aman Resorts reference), 70% negative space dominating the composition, 100mm f/2.8 macro, Kodak Portra 400 film grain. 4:5 vertical composition. Pure texture — no objects, no people. ABSOLUTELY NO TEXT, NO LOGO, NO WATERMARK on the image. NEGATIVE: ${NEG}, no digital pattern, no fake light effects, no AI render aesthetic, no clutter, no people.`,
  },

  // ============================================
  // 09 · 15/06 (Seg) · POST ÂNCORA "SKIN WINTER 2026 começa hoje" · Var D · 4:5
  // ⚠️ CRÍTICO — i2i EDIT com IMG_3677.jpg
  // ============================================
  {
    post_id: "09",
    data: "2026-06-15",
    dia_semana: "seg",
    tipo: "post",
    pilar: "P6 Sazonalidade",
    tema: "skin-winter-2026-revelacao",
    legenda: `Camila Estética abre, pela primeira vez, sua temporada oficial de gerenciamento de pele.

Por 8 semanas, sua pele entra em um ritual desenhado pela Dra. Camila e sai pronta para o verão.

6 sessões. Protocolo individual. Avaliação técnica. Plano de pele por escrito. Acompanhamento.

A avaliação é integralmente creditada se você decidir entrar no programa.

Quem comentou "inverno" em maio já recebeu o convite no direct. Quem ainda não, agora pode comentar abaixo. Abrimos as avaliações esta semana.

O inverno trata. O verão revela.`,
    hashtags: "#skinwinter #skinwinter2026 #gerenciamentodepele #drcamila #esteticabauru #esteticafacial",
    seed: 61501,
    useAvatar: "IMG_3677.jpg",
    prompt: `EDIT THIS EXACT PHOTOGRAPH. KEEP the woman in the input photo PIXEL-IDENTICAL — same face, same hair, same eyes, same expression, same skin tone, same age, same white linen blouse. She must remain unmistakably the same woman (Dr. Camila).

WHAT TO CHANGE (only framing, environment, color grade, and add typography panel):

1. Reframe to a 4:5 vertical editorial portrait. She is positioned in the LOWER-RIGHT 60% of the frame, in 3/4 profile looking slightly off-camera into the soft light, contemplative warm gaze.
2. The cream linen curtain on the left side STAYS visible — leave it exactly as in the original.
3. Remove the laptop, table, mobile phone, and outdoor city view completely. Replace with soft, slightly out-of-focus cream limewash clinic interior wall in the background.
4. The lighting from the right window stays exactly as in the original (golden hour soft direct light from the right).
5. Apply a subtle desaturation toward cream-and-white editorial tones (Vogue/Cereal/Bazaar aesthetic), Kodak Portra 400 grain.

ADD on the UPPER-LEFT 40% of the frame an integrated translucent frosted glass panel (glassmorphism, 70% opacity, rounded corners, gentle drop shadow) containing EXACT text:

Line 1 (large, serif Playfair Display Light, soft black #1A1A1A): "SKIN WINTER 2026"
Thin horizontal gold #A68A4F accent line about 100px wide below the title.
Line 2 (smaller, italic serif, soft dark grey #2C2C2C): "A primeira temporada de gerenciamento de pele da Camila Estética."

The text must be PERFECTLY legible with all Portuguese accents intact (á, ã, ç, é). No broken letters, no doubled letters, no duplicated lines.

At the very BOTTOM-RIGHT corner, a tiny discreet "— CAMILA ESTÉTICA" signature in gold #A68A4F uppercase letter-spaced sans-serif.

CRITICAL: her face, eye expression, smile, hair color, hair length, hair styling, eyebrows, skin tone, age, and white linen blouse MUST be pixel-identical to the source photograph. Do NOT regenerate or smooth the skin. Do NOT change her face structure. The typography panel must NOT cover her face.

${ANTI_AI_REALISM}

Aspect ratio: 4:5 vertical.

NEGATIVE: ${NEG}, different person, different face, regenerated face, smoothed skin, plastic skin, younger woman, blonde hair, light skin, westernized features, laptop visible, table visible, phone visible, outdoor view, text covering her face, garbled text, duplicated lines.`,
  },

  // ============================================
  // 10 · 17/06 (Qua) · CARROSSEL "SKIN WINTER em 7 perguntas" · Var A
  // ============================================
  {
    post_id: "10",
    data: "2026-06-17",
    dia_semana: "qua",
    tipo: "carrossel",
    pilar: "P1 Educação",
    tema: "skin-winter-7-perguntas",
    legenda: `Você perguntou. A gente respondeu.

SKIN WINTER em 7 perguntas. Tudo o que importa para você decidir se faz sentido para sua pele e seu momento.

Comenta "avaliação" para entrar na lista de agendamento.

O inverno trata. O verão revela.`,
    hashtags: "#skinwinter #gerenciamentodepele #drcamila #esteticabauru #faqestetica",
    slides: [
      {
        seed: 61701,
        desc: "S1 capa - SKIN WINTER em 7 perguntas",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel cover for Camila Estética. Full bleed warm off-white #FBF7F4 background with subtle linen texture. Centered translucent frosted glass panel (glassmorphism). EXACT text in serif Playfair Display soft black #1A1A1A centered, two lines: line 1 large italic: "SKIN WINTER,"; line 2 smaller italic: "em 7 perguntas." Thin gold #A68A4F accent line between. Tiny "01/07" gold label top-right outside panel. Tiny "— CAMILA ESTÉTICA" gold signature at the very bottom. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 61702,
        desc: "S2 - o que é",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text on panel: small uppercase gold #A68A4F letter-spaced sans-serif "PERGUNTA 01" at top; below in serif Playfair Display italic soft black #1A1A1A centered, large: "O que é?"; below in smaller sans-serif Inter Regular soft black centered, three short lines: "Programa de 8 semanas." / "6 sessões com protocolo individual." / "Acompanhamento técnico sessão a sessão." Thin gold accent line between question and answer. "02/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 61703,
        desc: "S3 - para quem é (pele linda) — feedback Camila 2026-05-29",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text on panel: small uppercase gold #A68A4F letter-spaced "PERGUNTA 02" at top; below serif Playfair Display italic soft black #1A1A1A centered large: "Para quem é?"; below in smaller sans-serif Inter Regular soft black centered, two lines: "Para mulheres que querem construir uma pele linda," / "não só resolver um incômodo pontual." Thin gold accent line. "03/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 61704,
        desc: "S4 - por que no inverno (pós confortável, sem hipercromia) — feedback Camila",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "PERGUNTA 03" at top; below serif Playfair Display italic soft black #1A1A1A centered large: "Por que é no inverno?"; below in smaller sans-serif Inter Regular soft black centered, two lines: "A baixa fotossensibilidade permite estímulo, peeling," / "microagulhamento e protocolos com pós mais confortável." Thin gold accent line. "04/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 61705,
        desc: "S5 - como começa (sem R$197) — feedback Camila (conselho de enfermagem)",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "PERGUNTA 04" at top; below serif Playfair Display italic soft black #1A1A1A centered large: "Como começa?"; below in smaller sans-serif Inter Regular soft black centered, three short lines: "Pela avaliação Skin Winter." / "45 minutos com plano de pele por escrito." / "Investimento creditado integralmente no fechamento." Thin gold accent line. "05/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      // Slide "Quanto custa o programa?" REMOVIDO em 2026-05-29 — conselho de enfermagem proíbe valor em rede social
      {
        seed: 61707,
        desc: "S6 CTA - quantas vagas + comenta avaliação",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel final CTA slide for Camila Estética. Full bleed pure white #FFFFFF background, very airy. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "PERGUNTA 05 + 06" at top; below serif Playfair Display italic soft black #1A1A1A centered medium: "A agenda da Dra. é limitada."; below in smaller sans-serif Inter Regular soft black centered: "Comenta 'avaliação' para entrar na lista." Below that a clean rectangular CTA badge with thin gold #A68A4F border (3px) rounded corners, inside single uppercase bold word "AVALIAÇÃO" in gold sans-serif letter-spaced. Tiny "— CAMILA ESTÉTICA" gold signature at bottom. "06/06" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
    ],
  },

  // ============================================
  // 11 · 19/06 (Sex) · REEL Dra. "Não é desconto, é desenho" · Var D · 9:16
  // Frame 3 (i2i Dra. perfil) REMOVIDO em 2026-05-29 — i2i regenerou face (feedback Camila)
  // Reel é filmado pela Camila; frames aqui só referência visual
  // ============================================
  {
    post_id: "11",
    data: "2026-06-19",
    dia_semana: "sex",
    tipo: "reel",
    pilar: "P2 Autoridade",
    tema: "nao-desconto-desenho",
    legenda: `Algumas perguntas vão aparecer essa semana.

A primeira: por que não tem desconto?

Porque o programa é desenhado. Não é pacote padrão que cabe desconto. É arquitetura que entrega exatamente o que sua pele precisa.

Avaliações abertas. Investimento creditado integralmente se você entrar no programa.

Comenta "avaliação".`,
    hashtags: "#skinwinter #drcamila #esteticabauru #gerenciamentodepele",
    roteiro: `[Take 1 — Dra. à câmera, olhar firme]
"Algumas pessoas vão me perguntar: por que não tem desconto?"
"Eu vou te responder o que eu respondo na avaliação."

[Take 2 — Dra. à câmera]
"Quando eu desconto um programa, eu tiro alguma coisa de dentro dele. Uma sessão. Um ativo. Um momento de acompanhamento."
"E eu não desenhei esse programa para tirar nada. Eu desenhei para entregar."

[Take 3 — Dra. em 3/4 perfil, olhar contemplativo]
"Então o preço aqui não é número. É forma."
"É a forma exata do que sua pele vai receber em 8 semanas."

[fim · plano contemplativo · trilha discreta]`,
    frames: [
      {
        seed: 61901,
        useAvatar: "IMG_3677.jpg",
        aspectRatio: "9:16",
        desc: "Frame 1 EDIT - Dra. à câmera, olhar firme (Var D)",
        prompt: `EDIT THIS EXACT PHOTOGRAPH. KEEP the woman PIXEL-IDENTICAL — same face, same hair, same expression, same eyes, same skin tone, same age, same white linen blouse. She must remain unmistakably the same woman (Dr. Camila).

WHAT TO CHANGE:
1. Reframe to 9:16 vertical chest-up portrait, her face centered in the upper third.
2. Remove the laptop, table, mobile phone, and outdoor view completely.
3. Replace background with a soft cream limewash clinic interior wall slightly out of focus, with a subtle backlight glow from a window behind her (rim light on her hair). Keep the linen curtain hint visible on the left edge.
4. Apply Variação D editorial color grade: slightly desaturated cream-and-warm-white tones, Kodak Portra 400 grain.
5. The gaze stays direct to camera (as in the original). Add a subtle natural shadow under her jaw for editorial depth.

CRITICAL: face, hair, expression, eye color, skin tone, age, white linen blouse MUST be pixel-identical to source. NO smoothing of skin. NO regeneration of the face.

${ANTI_AI_REALISM}

Aspect ratio: 9:16 vertical. NO TEXT, NO LOGO, NO WATERMARK.

NEGATIVE: ${NEG}, different person, regenerated face, smoothed skin, plastic skin, younger woman, laptop, table, phone, outdoor view.`,
      },
      {
        seed: 61902,
        aspectRatio: "9:16",
        desc: "Frame 2 - mãos segurando 'Plano de Pele'",
        prompt: `Editorial cinematic close-up for a vertical 9:16 Instagram Reel frame. A pair of feminine hands (warm tan skin tone, manicured neutral nails — natural, no extra fingers) holding a printed A5 document titled "PLANO DE PELE" in elegant Playfair Display serif at the top of the page in soft black, with handwritten-style annotations below it (just suggestion of writing, not perfectly readable). Depth of field razor-shallow — the paper edge in focus, hands slightly soft. Natural window light from the left, slightly desaturated cream tones, Kodak Portra 400 grain, medium-format Hasselblad 100mm f/2.8 look. Aspect ratio 9:16 vertical. NEGATIVE: ${NEG}, no extra fingers, no symmetrical AI hand, no plastic skin, no garbled text on the document, no English text.`,
      },
    ],
  },

  // ============================================
  // 12 · 21/06 (Dom) · POST CAT 3 "Pausa" · Var E téc. A · 4:5
  // ============================================
  {
    post_id: "12",
    data: "2026-06-21",
    dia_semana: "dom",
    tipo: "post",
    pilar: "atmosfera",
    tema: "pausa",
    legenda: `Pausa.`,
    hashtags: "#esteticabauru #ritualdepele #editorialbeauty",
    seed: 62101,
    prompt: `${VAR_E_STILLLIFE} Editorial still-life: a single apothecary crystal bottle with soft golden cap positioned on the right side of the frame, a single white rose petal floating mid-air slightly to the left as if caught in soft window draft, a folded cream linen cloth at the bottom of the frame, cool natural window light from the upper left, 70% negative space dominating the composition. Medium-format aesthetic (Hasselblad 100mm f/2.8), Kodak Portra 400 grain, slightly desaturated cream tones, editorial luxury mood (Aman, La Mer reference). 4:5 vertical composition. ABSOLUTELY NO TEXT, NO LOGO, NO WATERMARK. NEGATIVE: ${NEG}, no people, no faces, no clutter, no clinical scene.`,
  },

  // ============================================
  // 13 · 22/06 (Seg) · CARROSSEL "O que você sai sabendo na avaliação" · Var A
  // ============================================
  {
    post_id: "13",
    data: "2026-06-22",
    dia_semana: "seg",
    tipo: "carrossel",
    pilar: "P3 Prova Social",
    tema: "o-que-sai-sabendo-avaliacao",
    legenda: `Não é uma "consulta gratuita para empurrar venda". É uma sessão técnica de 45 minutos onde você sai com diagnóstico claro, protocolo desenhado e plano por escrito.

Mesmo se não fechar o programa, você sai com algo concreto: o caminho da sua pele.

Investimento creditado integralmente se você decidir entrar.

Comenta "avaliação".`,
    hashtags: "#skinwinter #avaliacaoestetica #drcamila #esteticabauru #planodepele",
    slides: [
      {
        seed: 62201,
        desc: "S1 capa - O que você sai sabendo (sem R$197) — feedback Camila",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel cover for Camila Estética. Full bleed warm off-white #FBF7F4 background. Behind the panel a soft editorial still-life: a leather-bound notebook open on cream marble with a printed checklist beside it (no readable text, just suggestion of structure), a small crystal bottle in the corner, soft natural window light from the left, medium-format depth of field, Kodak Portra 400 grain. Centered translucent frosted glass panel. EXACT text in serif Playfair Display soft black #1A1A1A italic centered, two lines: line 1 large: "O que você sai sabendo"; line 2 smaller: "da avaliação Skin Winter." Thin gold #A68A4F accent line below. Tiny "01/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 62202,
        desc: "S2 - tipo de pele técnico",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "01" at top; below serif Playfair Display italic soft black #1A1A1A centered large: "Qual é o seu tipo de pele tecnicamente."; below in smaller sans-serif Inter Regular soft black centered: "Leitura de cada zona do rosto, não só 'oleosa' ou 'seca'." Thin gold accent line. "02/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 62203,
        desc: "S3 - demanda prioritária",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "02" at top; below serif Playfair Display italic soft black #1A1A1A centered large: "Qual é a sua demanda prioritária."; below in smaller sans-serif Inter Regular soft black centered: "O que sua pele está pedindo agora — não o que está na moda." Thin gold accent line. "03/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 62204,
        desc: "S4 - protocolo personalizado",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "03" at top; below serif Playfair Display italic soft black #1A1A1A centered large: "Qual seria o seu protocolo personalizado."; below in smaller sans-serif Inter Regular soft black centered: "6 procedimentos na ordem certa, no espaçamento certo." Thin gold accent line. "04/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 62205,
        desc: "S5 - plano de pele por escrito",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "04" at top; below serif Playfair Display italic soft black #1A1A1A centered large: "Qual é o seu plano de pele por escrito."; below in smaller sans-serif Inter Regular soft black centered: "Entregue impresso e por WhatsApp. Você sai com o caminho na mão." Thin gold accent line. "05/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 62206,
        desc: "S6 - marco zero (registro fotográfico)",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "05" at top; below serif Playfair Display italic soft black #1A1A1A centered large: "Qual é o seu marco zero."; below in smaller sans-serif Inter Regular soft black centered: "Registro fotográfico padronizado em 4 ângulos." Thin gold accent line. "06/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 62207,
        desc: "S7 CTA - 45min comenta avaliação (sem R$197) — feedback Camila",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel final CTA slide for Camila Estética. Full bleed pure white #FFFFFF background, very airy. Centered glassmorphism panel. EXACT text in serif Playfair Display soft black #1A1A1A italic centered medium: "45 minutos. Plano por escrito."; below in smaller sans-serif Inter Regular soft black centered: "Você sai sabendo." Below that a clean rectangular CTA badge with thin gold #A68A4F border (3px) rounded corners, inside single uppercase bold word "AVALIAÇÃO" in gold sans-serif letter-spaced. Tiny "— CAMILA ESTÉTICA" gold signature at bottom. "07/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
    ],
  },

  // ============================================
  // 14 · 24/06 (Qua) · REEL BASTIDOR "A sala da avaliação" · Var A · 9:16 · 5 frames
  // Frame 4 = i2i opcional (Dra. arrumando o cabelo, de costas)
  // ============================================
  {
    post_id: "14",
    data: "2026-06-24",
    dia_semana: "qua",
    tipo: "reel",
    pilar: "P5 Bastidores",
    tema: "bastidor-sala-avaliacao",
    legenda: `A sala onde tudo começa.

A avaliação Skin Winter dura 45 minutos. Tempo suficiente para olhar de verdade.

Comenta "avaliação" para agendar.`,
    hashtags: "#drcamila #esteticabauru #skinwinter #bastidor #clinicabauru",
    roteiro: `Storyboard (sem voz · trilha discreta · texto na tela só nos últimos 3s):

1. Macro: hand posicionando frasco com etiqueta caligráfica na mesa de mármore
2. Top-down: caderno aberto "Plano de Pele" + caneta-tinteiro
3. Wide: cadeira de avaliação em luz natural de janela
4. (Opcional) Dra. de costas, gesto de prender o cabelo, prestes a começar
5. Frame final: mesa pronta esperando

Texto na tela (frame final, ~3s): serif Playfair Display "Onde sua pele é olhada de verdade."`,
    frames: [
      {
        seed: 62401,
        aspectRatio: "9:16",
        desc: "Frame 1 - macro hand frasco etiqueta caligráfica",
        prompt: `Editorial cinematic extreme macro shot for a vertical 9:16 Instagram Reel frame. A feminine hand (warm tan skin tone, manicured neutral nail — natural, no extra fingers) positioning a small apothecary glass bottle with a handwritten calligraphic paper label on a Calacatta cream marble surface. Natural soft window light from the left, razor-shallow depth of field with bottle edge in focus, slightly desaturated cream tones, Kodak Portra 400 grain, medium-format Hasselblad 100mm f/2.8 look. Aspect ratio 9:16 vertical. NO TEXT readable on the label (just suggestion of calligraphy). NEGATIVE: ${NEG}, no plastic skin on hand, no symmetrical AI hand, no extra fingers, no garbled text.`,
      },
      {
        seed: 62402,
        aspectRatio: "9:16",
        desc: "Frame 2 - top-down caderno aberto + caneta-tinteiro",
        prompt: `Editorial top-down photograph for a vertical 9:16 Instagram Reel frame. An open leather-bound cream notebook on Calacatta cream marble surface, page header subtly suggests "Plano de Pele" in elegant serif italic at the top (legible but small, soft black ink), page below mostly blank with delicate handwritten linework, an elegant fountain pen resting beside it, a small crystal apothecary bottle in the corner of the frame, natural soft window light from above-left, slightly desaturated cream tones, Kodak Portra 400 grain. Aspect ratio 9:16 vertical. NEGATIVE: ${NEG}, no garbled text, no fake AI handwriting glitches, no English text.`,
      },
      {
        seed: 62403,
        aspectRatio: "9:16",
        desc: "Frame 3 - wide cadeira avaliação luz janela",
        prompt: `Editorial wide-angle interior photograph for a vertical 9:16 Instagram Reel frame. A soft cream upholstered aesthetic clinic evaluation chair positioned next to a large window with sheer linen curtain, golden hour light entering softly from the side, a folded white cotton towel on the armrest, calm warm clinic interior with cream limewash walls partially visible, slightly desaturated cream-and-warm tones, depth of field medium, Kodak Portra 400 grain. Aspect ratio 9:16 vertical. NO TEXT, NO LOGO. NEGATIVE: ${NEG}, no clinical sterile look, no harsh blue lighting, no medical equipment visible, no people.`,
      },
      {
        seed: 62404,
        useAvatar: "IMG_3677.jpg",
        aspectRatio: "9:16",
        desc: "Frame 4 EDIT (opcional) - Dra. de costas, gesto cabelo",
        prompt: `EDIT THIS EXACT PHOTOGRAPH. KEEP the woman PIXEL-IDENTICAL — same hair, same skin tone, same age, same white linen blouse. She must remain unmistakably Dr. Camila.

WHAT TO CHANGE:
1. Reframe to 9:16 vertical chest-up — show her from BEHIND (back view), with her face NOT visible (the camera sees the back of her head and the upper torso).
2. She is performing the gesture of tucking a loose strand of hair behind her ear with her right hand visible.
3. Remove laptop, table, mobile phone, and outdoor view. Background is the soft cream limewash clinic interior wall slightly out of focus, with the linen curtain visible on the left edge.
4. Natural window light from the left.
5. Variação A editorial color grade — desaturated cream tones, Kodak Portra 400 grain.

CRITICAL: hair color, hair length, skin tone, age, blouse MUST be identical to source. Face is NOT visible in this frame (back view).

${ANTI_AI_REALISM}

Aspect ratio: 9:16 vertical. NO TEXT, NO LOGO, NO WATERMARK.

NEGATIVE: ${NEG}, different person, different hair, laptop, table, phone, outdoor view, face visible.`,
      },
      {
        seed: 62405,
        aspectRatio: "9:16",
        desc: "Frame 5 - top-down mesa pronta esperando",
        prompt: `Editorial overhead-angle photograph for a vertical 9:16 Instagram Reel frame. A serene flat-lay arrangement on Calacatta cream marble: open leather-bound notebook with delicate writing suggestion, an elegant fountain pen, a small crystal apothecary bottle with golden cap, a folded white cotton towel, all arranged in elegant editorial composition with 50% negative space at the top of the frame, natural soft window light from the side, slightly desaturated cream-and-warm tones, Kodak Portra 400 grain, medium-format Hasselblad 100mm f/2.8 look. Aspect ratio 9:16 vertical. NO TEXT, NO LOGO. NEGATIVE: ${NEG}, no people, no clutter, no garish colors.`,
      },
    ],
  },

  // ============================================
  // 15 · 26/06 (Sex) · CARROSSEL "3 sinais Skin Winter" · Var B Soft Pink
  // ============================================
  {
    post_id: "15",
    data: "2026-06-26",
    dia_semana: "sex",
    tipo: "carrossel",
    pilar: "P1 Educação",
    tema: "3-sinais-skin-winter",
    legenda: `Skin Winter não foi pensado para todo mundo. E isso é proposital.

É para quem quer arquitetura, não conserto. Plano, não sessão. Construção, não reação.

Se você se reconheceu, comenta "avaliação".

Se não, sem problema. Cuidar da pele é um caminho longo, com vários ritmos.`,
    hashtags: "#skinwinter #gerenciamentodepele #drcamila #esteticabauru #esteticafacial",
    slides: [
      {
        seed: 62601,
        desc: "S1 capa - 3 sinais",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel cover for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background (almost white). Centered an editorial close-up photograph framed with rounded white border thick: a woman in 3/4 angle with eyes slightly closed, introspective mood, soft natural side-light, real skin texture, side profile (no AI-symmetrical face), slightly desaturated. Above the photo, in serif Playfair Display soft black #1A1A1A italic centered, EXACT text in two lines: "3 sinais que mostram" / "se você é para Skin Winter — ou só para uma sessão." Thin gold #A68A4F accent line below. Tiny "01/07" gold label top-right outside. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}, no plastic skin, no aggressive pink, no medical look.`,
      },
      {
        seed: 62602,
        desc: "S2 - sinal 1 cuida em ondas",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "SINAL 01" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Você cuida da pele em ondas." / "Faz, esquece, faz de novo — e quer sair desse ciclo." Thin gold accent line. "02/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 62603,
        desc: "S3 - sinal 2 pele estagnou",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "SINAL 02" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Você sente que sua pele 'estagnou'." / "Os produtos que usa não fazem mais o que faziam." Thin gold accent line. "03/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 62604,
        desc: "S4 - sinal 3 parecer descansada",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "SINAL 03" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Você não quer 'parecer mais nova'." / "Você quer parecer descansada, viva." Thin gold accent line. "04/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 62605,
        desc: "S5 - se reconheceu, é para você",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text in serif Playfair Display italic soft black #1A1A1A large centered, two lines: "Se você se reconheceu," / "Skin Winter foi pensado para você." Thin gold #A68A4F accent line between, about 80px wide. "05/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 62606,
        desc: "S6 - quando NÃO é para você",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "E SE NÃO?" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Se você quer só uma limpeza ou peeling avulso," / "a clínica tem isso também. Skin Winter é construção." Thin gold accent line. "06/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 62607,
        desc: "S7 CTA - avaliações abertas comenta avaliação",
        prompt: `${DNA_BASE}. ${VAR_B}. Premium editorial Instagram carousel final CTA slide for Camila Estética. Full bleed soft whispered pink #FCE4EC barely tinted background. Centered glassmorphism panel. EXACT text in serif Playfair Display soft black #1A1A1A italic medium centered: "Avaliações abertas."; below in smaller sans-serif Inter Regular soft black centered: "Comenta 'avaliação' para entrar." Below that a clean rectangular CTA badge with thin gold #A68A4F border (3px) rounded corners, inside single uppercase bold word "AVALIAÇÃO" in gold sans-serif letter-spaced. Tiny "— CAMILA ESTÉTICA" gold signature at bottom. "07/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
    ],
  },

  // ============================================
  // 16 · 28/06 (Dom) · POST CAT 3 macro pele · Var E téc. C · 4:5
  // ============================================
  {
    post_id: "16",
    data: "2026-06-28",
    dia_semana: "dom",
    tipo: "post",
    pilar: "atmosfera",
    tema: "pele-responde-calada",
    legenda: `Quando a pele responde, ela responde calada.`,
    hashtags: "#esteticabauru #ritualdepele #peledeinverno",
    seed: 62801,
    prompt: `Editorial extreme macro photography. Close-up of feminine skin surface (cheek area, no face identifiable — just skin) with a single perfect water droplet beading on the surface, soft side natural light catching the droplet edge, visible real pores in the skin texture (NOT smoothed, NOT plastic), slightly desaturated warm cream tones, editorial luxury macro mood (Byredo, Aesop reference), 100mm f/2.8 macro, Kodak Portra 400 film grain. 4:5 vertical composition, 70% negative space dominating. ABSOLUTELY NO TEXT, NO LOGO, NO WATERMARK. NEGATIVE: ${NEG}, no plastic skin, no over-smoothing, no waxy texture, no digital art, no AI render, no face visible, no full body.`,
  },

  // ============================================
  // 17 · 30/06 (Ter) · CARROSSEL "Junho fecha" · Var A
  // ============================================
  {
    post_id: "17",
    data: "2026-06-30",
    dia_semana: "ter",
    tipo: "carrossel",
    pilar: "P6 Sazonalidade",
    tema: "junho-fecha",
    legenda: `Um mês de aprendizado.

Vimos que existe um padrão claro: mulheres em torno dos 40 a 50 anos que querem deixar de "fazer sessões avulsas" e começar a construir pele com método.

Skin Winter virou o nome desse desejo.

A janela do inverno continua em julho. Mas a agenda da Dra. fecha conforme entra. Se você quer participar, comenta "avaliação".`,
    hashtags: "#skinwinter #gerenciamentodepele #drcamila #esteticabauru #junho",
    slides: [
      {
        seed: 63001,
        desc: "S1 capa - Junho fecha, coisas mudaram",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel cover for Camila Estética. Full bleed warm off-white #FBF7F4 background. Behind the panel a soft editorial still-life: an opened paper calendar page partially visible suggesting end of June (no specific dates readable), an elegant fountain pen resting on the page, a small crystal apothecary bottle in the corner, soft natural window light from the left, medium-format depth of field, Kodak Portra 400 grain. Centered translucent frosted glass panel. EXACT text in serif Playfair Display italic soft black #1A1A1A large centered, two lines: "Junho fecha." / "Algumas coisas mudaram aqui." Thin gold #A68A4F accent line below. Tiny "01/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 63002,
        desc: "S2 - abrimos primeira temporada",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "MARCO" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Abrimos a primeira temporada" / "oficial de gerenciamento de pele." Thin gold accent line. "02/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 63003,
        desc: "S3 - recebemos pacientes em avaliação",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "PRIMEIRAS PACIENTES" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Algumas já saíram com plano definido," / "agendamento e primeira sessão na agenda." Thin gold accent line. "03/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 63004,
        desc: "S4 - o nome desse desejo (plural) — feedback Camila 2026-05-29",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text: small uppercase gold #A68A4F letter-spaced "APRENDIZADO" at top; below serif Playfair Display italic soft black #1A1A1A centered, two lines: "Existem muitas mulheres que sabiam o que queriam," / "só não tinham um nome. Skin Winter virou esse nome." Thin gold accent line. "04/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 63005,
        desc: "S5 - julho continua mas agenda fecha",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel content slide for Camila Estética. Full bleed warm off-white #FBF7F4 background. Centered glassmorphism panel. EXACT text in serif Playfair Display italic soft black #1A1A1A large centered, two lines: "Julho continua." / "Mas a agenda da Dra. já está fechando." Thin gold #A68A4F accent line between, about 80px wide. "05/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
      {
        seed: 63006,
        desc: "S6 - essa é a janela (foto Camila) — feedback Camila 2026-05-29",
        useComposite: true,
        composite: {
          fotoAvatar: "IMG_3677.jpg",
          texto: {
            label: "ESTE MÊS",
            paginacao: "06/07",
            linha1: "Se você ainda não",
            linha2: "fez sua avaliação,",
            linha3: "esta é a janela.",
            linha4: "Julho ficará escasso.",
          },
        },
        prompt: `[SKIP — useComposite: true. Slide gerado via composite Sharp (foto Camila preservada). Ver scripts/aplicar_feedbacks_camila_junho.mjs.]`,
      },
      {
        seed: 63007,
        desc: "S7 CTA - comenta avaliação julho",
        prompt: `${DNA_BASE}. ${VAR_A}. Premium editorial Instagram carousel final CTA slide for Camila Estética. Full bleed pure white #FFFFFF background, very airy. Centered glassmorphism panel. EXACT text in serif Playfair Display soft black #1A1A1A italic medium centered: "Comenta 'avaliação' para entrar na agenda de julho." Below that a clean rectangular CTA badge with thin gold #A68A4F border (3px) rounded corners, inside single uppercase bold word "AVALIAÇÃO" in gold sans-serif letter-spaced. Tiny "— CAMILA ESTÉTICA" gold signature at bottom. "07/07" gold label top-right outside panel. ${TYPO_RULES} ${NUMERACAO_RULE} NEGATIVE: ${NEG}.`,
      },
    ],
  },
];

// =====================================================
// HELPERS
// =====================================================

function nomeSubpastaPost(post) {
  return `${post.post_id}_${post.data}_${post.tipo}_${post.tema}`;
}

function caminhoSubpasta(baseDir, post) {
  return path.join(baseDir, "entregaveis", nomeSubpastaPost(post));
}

function imagemPathRelativo(post) {
  const sub = nomeSubpastaPost(post);
  if (post.tipo === "post") return `entregaveis/${sub}/imagem.png`;
  if (post.tipo === "carrossel") {
    const paths = post.slides.map((_, i) => `entregaveis/${sub}/${String(i + 1).padStart(2, "0")}.png`);
    return paths.join("|");
  }
  return ""; // reel: vazio (frames são referência, vídeo entra depois)
}

function ordemCarrossel(post) {
  if (post.tipo !== "carrossel") return "";
  return post.slides.map((_, i) => String(i + 1)).join("|");
}

async function escreverArquivoTexto(arquivoPath, conteudo) {
  await fs.mkdir(path.dirname(arquivoPath), { recursive: true });
  await fs.writeFile(arquivoPath, conteudo, "utf-8");
}

function montarPromptTxt(post) {
  if (post.tipo === "post") {
    return `# Post ${post.post_id} · ${post.data} · ${post.tema}\n# Seed: ${post.seed}\n# useAvatar: ${post.useAvatar ?? "(none)"}\n\n${post.prompt}\n`;
  }
  if (post.tipo === "carrossel") {
    const blocos = post.slides.map((s, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `## Slide ${n} · ${s.desc}\nSeed: ${s.seed}\n\n${s.prompt}\n`;
    });
    return `# Carrossel ${post.post_id} · ${post.data} · ${post.tema}\n\n${blocos.join("\n---\n\n")}`;
  }
  if (post.tipo === "reel") {
    const blocos = post.frames.map((f, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `## Frame ${n} · ${f.desc}\nSeed: ${f.seed}\nAspect: ${f.aspectRatio ?? "9:16"}\nuseAvatar: ${f.useAvatar ?? "(none)"}\n\n${f.prompt}\n`;
    });
    return `# Reel ${post.post_id} · ${post.data} · ${post.tema}\n\n${blocos.join("\n---\n\n")}`;
  }
  return "";
}

// =====================================================
// PREPARO: criar TODAS as subpastas + legenda.txt + prompt.txt + roteiro.txt
// =====================================================

async function prepararSubpastas() {
  console.log("→ Criando subpastas + legenda.txt + prompt.txt (local)...");
  for (const post of calendario) {
    const subLocal = caminhoSubpasta(LOCAL_AGENDA_DIR, post);
    await fs.mkdir(subLocal, { recursive: true });

    const legendaTxt = post.legenda + "\n\n" + (post.hashtags ?? "") + "\n";
    await escreverArquivoTexto(path.join(subLocal, "legenda.txt"), legendaTxt);

    const promptTxt = montarPromptTxt(post);
    if (promptTxt) {
      await escreverArquivoTexto(path.join(subLocal, "prompt.txt"), promptTxt);
    }

    if (post.tipo === "reel" && post.roteiro) {
      await escreverArquivoTexto(path.join(subLocal, "roteiro.txt"), post.roteiro + "\n");
    }
  }
  console.log(`  ✓ ${calendario.length} subpastas preparadas (local).\n`);
}

// =====================================================
// GERAÇÃO DE IMAGEM
// =====================================================

const ai = new GoogleGenAI({ apiKey: API_KEY });
const fotoCache = new Map();

async function carregarFoto(nomeArquivo) {
  if (fotoCache.has(nomeArquivo)) return fotoCache.get(nomeArquivo);
  const p = path.join(FOTOS_DIR, nomeArquivo);
  const bytes = await fs.readFile(p);
  const b64 = bytes.toString("base64");
  fotoCache.set(nomeArquivo, b64);
  console.log(`  ✓ Foto avatar carregada: ${nomeArquivo} (${(bytes.length / 1024).toFixed(0)} KB)`);
  return b64;
}

/**
 * Expande o calendário em uma fila plana de "jobs de imagem".
 * Cada job tem: { post, jobName, seed, prompt, aspectRatio, useAvatar, outRelative }
 */
function montarFilaJobs(posts) {
  const fila = [];
  for (const post of posts) {
    if (post.tipo === "post") {
      fila.push({
        post,
        jobName: `${post.post_id} ${post.tema}`,
        seed: post.seed,
        prompt: post.prompt,
        aspectRatio: post.aspectRatio ?? "4:5",
        useAvatar: post.useAvatar,
        outRelative: "imagem.png",
      });
    } else if (post.tipo === "carrossel") {
      post.slides.forEach((s, i) => {
        const n = String(i + 1).padStart(2, "0");
        fila.push({
          post,
          jobName: `${post.post_id} ${post.tema} · slide ${n}`,
          seed: s.seed,
          prompt: s.prompt,
          aspectRatio: s.aspectRatio ?? "4:5",
          useAvatar: s.useAvatar,
          useComposite: s.useComposite,
          composite: s.composite,
          outRelative: `${n}.png`,
        });
      });
    } else if (post.tipo === "reel") {
      post.frames.forEach((f, i) => {
        const n = String(i + 1).padStart(2, "0");
        fila.push({
          post,
          jobName: `${post.post_id} ${post.tema} · frame ${n}`,
          seed: f.seed,
          prompt: f.prompt,
          aspectRatio: f.aspectRatio ?? "9:16",
          useAvatar: f.useAvatar,
          outRelative: `frame_${n}.png`,
        });
      });
    }
  }
  return fila;
}

async function gerarUmaImagem(job) {
  // Slides com useComposite: true vão pelo composite Sharp (foto avatar preservada + texto SVG).
  // Padrão "preservar foto original" — Gemini i2i regenera face e perde semelhança.
  if (job.useComposite) {
    return await gerarCompositeSharp(job);
  }

  const partes = [];
  if (job.useAvatar) {
    const fotoB64 = await carregarFoto(job.useAvatar);
    partes.push({ inlineData: { data: fotoB64, mimeType: "image/jpeg" } });
  }
  partes.push({ text: job.prompt });

  // Para EDIT mode (com foto-base), NÃO passamos aspectRatio (modelo deriva do input).
  // Para text-to-image puro, passamos aspectRatio.
  const config = {
    responseModalities: ["IMAGE"],
    seed: job.seed,
  };
  if (!job.useAvatar) {
    config.imageConfig = { aspectRatio: job.aspectRatio };
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: partes }],
    config,
  });

  const candidate = response.candidates?.[0];
  if (!candidate) throw new Error("Resposta sem candidates");

  const imagePart = candidate.content?.parts?.find((p) => p.inlineData);
  if (!imagePart) throw new Error("Resposta sem inlineData de imagem");

  const imageBytes = Buffer.from(imagePart.inlineData.data, "base64");

  const subLocal = caminhoSubpasta(LOCAL_AGENDA_DIR, job.post);
  const localPath = path.join(subLocal, job.outRelative);
  await fs.writeFile(localPath, imageBytes);

  return { jobName: job.jobName, size: imageBytes.length };
}

// =====================================================
// COMPOSITE SHARP (foto avatar preservada + texto SVG overlay)
// Usado quando slide.useComposite === true (ex.: post 17 slide 6)
// Padrão: foto-base intacta + painel translúcido no canto superior-esquerdo
// =====================================================

const COMPOSITE_W = 1080;
const COMPOSITE_H = 1350;

function svgPainelComposite({ label, paginacao, linha1, linha2, linha3, linha4 }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${COMPOSITE_W}" height="${COMPOSITE_H}" viewBox="0 0 ${COMPOSITE_W} ${COMPOSITE_H}">
  <defs>
    <filter id="ds" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="10"/>
      <feOffset dx="0" dy="6"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.25"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect x="56" y="60" width="600" height="380" rx="20" ry="20"
        fill="rgba(255,250,243,0.88)"
        stroke="rgba(255,255,255,0.6)" stroke-width="1"
        filter="url(#ds)"/>
  <text x="96" y="115" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#A68A4F">${label}</text>
  <line x1="96" y1="135" x2="220" y2="135" stroke="#A68A4F" stroke-width="2"/>
  <text x="96" y="200" font-family="Playfair Display, Georgia, 'Times New Roman', serif" font-size="32" font-style="italic" fill="#1A1A1A">${linha1}</text>
  <text x="96" y="250" font-family="Playfair Display, Georgia, 'Times New Roman', serif" font-size="32" font-style="italic" fill="#1A1A1A">${linha2}</text>
  <text x="96" y="300" font-family="Playfair Display, Georgia, 'Times New Roman', serif" font-size="32" font-style="italic" fill="#1A1A1A">${linha3}</text>
  <text x="96" y="350" font-family="Playfair Display, Georgia, 'Times New Roman', serif" font-size="32" font-style="italic" fill="#1A1A1A">${linha4}</text>
  <text x="${COMPOSITE_W - 60}" y="100" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="3" text-anchor="end" fill="#A68A4F">${paginacao}</text>
  <text x="${COMPOSITE_W - 60}" y="${COMPOSITE_H - 50}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" letter-spacing="3" text-anchor="end" fill="#A68A4F">— CAMILA ESTÉTICA</text>
</svg>`;
}

async function gerarCompositeSharp(job) {
  const { composite } = job;
  const fotoPath = path.join(FOTOS_DIR, composite.fotoAvatar);
  const fotoBuf = await sharp(fotoPath)
    .resize({ width: COMPOSITE_W, height: COMPOSITE_H, fit: "cover", position: "top" })
    .toBuffer();

  const svg = svgPainelComposite(composite.texto);
  const finalBuf = await sharp(fotoBuf)
    .composite([{ input: Buffer.from(svg, "utf-8"), top: 0, left: 0 }])
    .png({ quality: 95, compressionLevel: 8 })
    .toBuffer();

  const subLocal = caminhoSubpasta(LOCAL_AGENDA_DIR, job.post);
  const localPath = path.join(subLocal, job.outRelative);
  await fs.mkdir(subLocal, { recursive: true });
  await fs.writeFile(localPath, finalBuf);

  return { jobName: `${job.jobName} [composite Sharp]`, size: finalBuf.length };
}

async function gerarImagens() {
  let postsParaGerar = calendario;
  if (SOMENTE_IDS.length > 0) {
    postsParaGerar = calendario.filter((p) => SOMENTE_IDS.includes(p.post_id));
    console.log(`→ Filtro SOMENTE_IDS ativo: ${SOMENTE_IDS.join(", ")} (${postsParaGerar.length} posts)`);
  }

  const fila = montarFilaJobs(postsParaGerar);
  console.log(`→ Gerando ${fila.length} imagens em ${postsParaGerar.length} posts (paralelo em batches de ${PARALLEL_BATCH_SIZE})...\n`);

  // Pre-load avatars
  const avatarsUsados = new Set(
    fila.filter((j) => j.useAvatar).map((j) => j.useAvatar)
  );
  for (const nome of avatarsUsados) {
    await carregarFoto(nome);
  }
  if (avatarsUsados.size > 0) console.log("");

  const resultados = [];
  const inicio = Date.now();

  for (let i = 0; i < fila.length; i += PARALLEL_BATCH_SIZE) {
    const batch = fila.slice(i, i + PARALLEL_BATCH_SIZE);
    const num = Math.floor(i / PARALLEL_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(fila.length / PARALLEL_BATCH_SIZE);
    console.log(`  ▶ Batch ${num}/${totalBatches} (${batch.length} imagens)`);

    const promises = batch.map((job) =>
      gerarUmaImagem(job).catch((err) => ({
        jobName: job.jobName,
        status: "erro",
        erro: err.message || String(err),
      }))
    );

    const batchResults = await Promise.all(promises);
    resultados.push(...batchResults);

    batchResults.forEach((r) => {
      if (r.status === "erro") {
        console.log(`    ❌ ${r.jobName}: ${r.erro}`);
      } else {
        console.log(`    ✓ ${r.jobName} (${(r.size / 1024).toFixed(0)} KB)`);
      }
    });
  }

  const tempo = ((Date.now() - inicio) / 1000).toFixed(0);
  const ok = resultados.filter((r) => r.status !== "erro").length;
  const falhas = resultados.filter((r) => r.status === "erro").length;
  console.log(`\n  Tempo: ${tempo}s · Sucessos: ${ok}/${fila.length} · Falhas: ${falhas}\n`);

  return { ok, falhas, resultados };
}

// =====================================================
// GERAÇÃO DO CSV
// =====================================================

async function gerarCsv() {
  console.log("→ Gerando CSV de publicação (local)...");

  const postsCsv = calendario.map((post) => ({
    post_id: post.post_id,
    data_publicacao: post.data,
    hora_publicacao: "",
    dia_semana: post.dia_semana,
    tipo: post.tipo,
    pilar: post.pilar,
    linha_produto: "",
    tema: post.tema,
    legenda: post.legenda,
    hashtags: post.hashtags ?? "",
    imagem_path: imagemPathRelativo(post),
    ordem_carrossel: ordemCarrossel(post),
    video_path: "",
    status: "a_publicar",
    link_drive: "",
    observacoes:
      post.tipo === "reel"
        ? "Reel — frames de referência geradas (frame_NN.png) para guiar filmagem. Vídeo final por filmagem real/edição. capa.png e video.mp4 a entregar."
        : "",
  }));

  const result = await gerarAgendaCsv({
    cliente: "camila-estetica",
    mes: "06",
    ano: "2026",
    outputDir: LOCAL_AGENDA_DIR,
    posts: postsCsv,
  });

  console.log(`  ✓ Local: ${result.localPath}`);
  console.log(`  Total: ${result.totalPosts} linhas\n`);

  return result;
}

// =====================================================
// MAIN
// =====================================================

async function main() {
  console.log("===========================================================");
  console.log("CAMILA ESTÉTICA · JUNHO 2026 · 17 posts (padrão v3)");
  console.log("===========================================================");
  console.log(`Modelo:        ${MODEL}`);
  console.log(`Posts totais:  ${calendario.length}`);
  console.log(`Local agenda:  ${LOCAL_AGENDA_DIR}`);

  const fila = montarFilaJobs(calendario);
  console.log(`Imagens totais a gerar: ${fila.length}`);
  console.log("===========================================================\n");

  if (SOMENTE_IDS.length === 0) {
    await prepararSubpastas();
  } else {
    console.log("→ Filtro ativo: pulando preparo de subpastas e CSV (já existem).\n");
  }

  const gerou = await gerarImagens();

  if (SOMENTE_IDS.length === 0) {
    await gerarCsv();
  }

  console.log("===========================================================");
  console.log(`✓ FINALIZADO · ${gerou.ok}/${fila.length} imagens geradas`);
  if (gerou.falhas > 0) {
    console.log(`  ⚠ ${gerou.falhas} falha(s) — relance com SOMENTE_IDS=<ids> para reprocessar`);
  }
  console.log("===========================================================");
}

main().catch((err) => {
  console.error("❌ ERRO FATAL:", err);
  process.exit(1);
});