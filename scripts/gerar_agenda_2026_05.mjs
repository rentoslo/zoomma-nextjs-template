// Geração da agenda editorial Zoomma — Maio 2026 (18-31)
// 8 posts → 20 imagens (4 carrosséis × 4 slides + 2 Reel covers + 1 única + 1 respiro)
// Modo 1 (preservar pessoa inteira) nos Reels com Renato e Camila
// Output: G:\Meu Drive\ZOOMMA\AGENDA EDITORIAL\2026-05_MAIO\imagens\

import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const API_KEY = process.env.GOOGLE_AI_API_KEY;
const MODEL = "gemini-3-pro-image-preview";
const OUTPUT_DIR = "G:\\Meu Drive\\ZOOMMA\\AGENDA EDITORIAL\\2026-05_MAIO\\imagens";
const FOTOS_DIR = "G:\\Meu Drive\\ZOOMMA\\IDENTIDADE VISUAL\\fotos_referencia";

const ASSINATURA_VISUAL = `IMPORTANT visual signature: a thin solid metallic gold vertical line color hex D4A574 exactly 1.5 pixels wide at 90 percent opacity, positioned at exactly 28 pixels from the left edge of the canvas, running uninterrupted from top to bottom. This is the official Zoomma brand signature.`;

const NEG = `no symmetry, no plastic skin, no airbrushed skin, no AI face artifacts, no CGI, no 3D render, no harsh shadows, no commercial glow, no garbled text, no missing accents, no duplicated text, no repeated words, no watermarks, no HDR, no over-saturation`;

// =====================================================
// 20 IMAGENS — MAIO 2026
// =====================================================
const posts = [
  // ====================================================
  // POST 1 · SEG 18/05 · Carrossel · Sua clínica não cresce no improviso
  // ====================================================
  {
    nome: "post01_seg18_carrossel_slide1_capa",
    desc: "Post 1 Slide 1 capa - navy tipográfico",
    prompt: `Editorial Instagram carousel cover slide, full bleed deep navy blue background color hex 2B3A4D, large bold elegant Playfair Display serif typography in pure white centered, EXACT text on 3 lines: line 1 "Sua clínica de estética" line 2 "não cresce" line 3 "no improviso.", below a thin horizontal gold accent line hex D4A574 about 80 pixels wide, below in small clean sans-serif soft gold italic the EXACT text "Marketing sem estratégia é despesa, não investimento.", in lower right small gold "01/04", at very bottom tiny gold uppercase letter-spaced "ZOOMMA", generous negative space, sophisticated minimalist aesthetic, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "post01_seg18_carrossel_slide2_movimento",
    desc: "Post 1 Slide 2 - o que parece marketing mas é movimento",
    prompt: `Editorial Instagram carousel content slide, full bleed warm off-white background hex F5F3EE, large bold serif Playfair Display typography in deep navy hex 2B3A4D upper third left-aligned EXACT text on 2 lines: line 1 "O que parece" line 2 "marketing, mas é só movimento.", thin gold accent line hex D4A574 below headline, then in clean sans-serif Montserrat regular dark gray hex 4A4A4A left-aligned body EXACT text with arrows: line 1 "→ Postar todo dia ≠ estratégia." line 2 "→ Anunciar sem objetivo ≠ aquisição." line 3 "→ Promoção recorrente ≠ vendas." then blank line then EXACT text "Tudo isso é movimento. Resultado é outra coisa.", in lower right small gold "02/04", generous negative space right, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "post01_seg18_carrossel_slide3_3perguntas",
    desc: "Post 1 Slide 3 - 3 perguntas da estratégia",
    prompt: `Editorial Instagram carousel content slide, full bleed warm off-white background hex F5F3EE, large bold serif typography in deep navy hex 2B3A4D upper third left-aligned EXACT text on 2 lines: line 1 "Estratégia começa" line 2 "com 3 perguntas:", thin gold accent line hex D4A574 below, then a 3-item list with gold arrows hex D4A574, in clean sans-serif regular dark gray hex 4A4A4A, EXACT text per line: line 1 "→ Pra quem você vende, exatamente?" line 2 "→ Por que essa pessoa escolheria você?" line 3 "→ Qual o caminho até ela contratar?", then blank line then in small italic dark gray EXACT text "Sem clareza nas três, marketing vira despesa.", in lower right small gold "03/04", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "post01_seg18_carrossel_slide4_cta",
    desc: "Post 1 Slide 4 CTA - ESTRATÉGIA",
    prompt: `Editorial Instagram carousel final CTA slide, full bleed deep navy hex 2B3A4D, large bold serif Playfair Display typography in pure white centered EXACT text on 3 lines: line 1 "Quer descobrir" line 2 "onde está" line 3 "o seu gargalo real?", below generous space a clean rectangular CTA badge with thin gold border hex D4A574 about 4 pixels thick rounded corners 12 pixels, inside the badge centered single uppercase bold word "ESTRATÉGIA" in gold sans-serif letter-spaced, below the badge in small white sans-serif EXACT text "Envie essa palavra no direct.", in lower right small gold "04/04", at very bottom tiny gold uppercase letter-spaced "ZOOMMA", generous negative space, no logos, flawless typography with Portuguese accents and tilde, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },

  // ====================================================
  // POST 2 · TER 19/05 · Reel Renato - Procedimento vs Transformação
  // ====================================================
  {
    nome: "post02_ter19_reel_thumb",
    desc: "Post 2 Reel thumbnail - Renato (Modo 1)",
    fotoBase: { pasta: "renato", arquivo: "_MG_3742.jpg" },
    prompt: `CRITICAL PRESERVATION: keep the man from the input photograph EXACTLY as he is — preserve with absolute fidelity his face, expression, hair, eyes, the gray graphic t-shirt with colorful lightbulb design, his entire body, standing posture with hand in pocket, and pose. Do not alter his identity, clothing, body or pose.

EDIT ONLY the following:

1. BACKGROUND: replace the original neutral white background with a sophisticated Kinfolk-magazine-style aesthetic — warm honey wood paneling behind him softly out of focus, large floor-to-ceiling window on the left with soft natural daylight, a single green plant blurred in the corner, all in dreamy depth of field. He remains absolute focal point. Match perspective and scale to his standing pose.

2. COLOR GRADING: apply warm Kinfolk magazine color grading — warm honey tones, golden afternoon undertones, color temperature 4500K with warm amber. Subtle natural Kodak Portra 400 film grain. Skin tone preservation critical.

3. OVERLAY: in the upper-left negative space, add ONE translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. Inside this overlay, render in deep navy hex 2B3A4D using bold elegant Playfair Display serif typography, EXACT text appearing ONLY ONCE no duplication, on 3 lines: line 1 "Você vende" line 2 "procedimento." line 3 "" line 4 "Sua concorrente" line 5 "vende transformação.". Below the headline a thin horizontal gold accent line hex D4A574. Below in smaller sans-serif italic dark gray EXACT text "E adivinha quem cobra mais.". At bottom in small clean sans-serif uppercase navy with letter-spacing EXACT text "Envie VALOR no direct.". Typography perfectly legible with all Portuguese accents intact.

4. ${ASSINATURA_VISUAL}

5. Aspect ratio 4:5.

${NEG}`,
  },

  // ====================================================
  // POST 3 · QUA 20/05 · Carrossel · Sua DM enche. Sua agenda não
  // ====================================================
  {
    nome: "post03_qua20_carrossel_slide1_capa",
    desc: "Post 3 Slide 1 capa - DM enche agenda não",
    prompt: `Editorial Instagram carousel cover slide, full bleed deep navy hex 2B3A4D, large bold Playfair Display serif typography in pure white centered EXACT text on 3 lines: line 1 "Sua DM enche." line 2 "" line 3 "Sua agenda não.", below thin gold accent line hex D4A574 80px wide, below in small soft gold sans-serif italic EXACT text "O problema não é tráfego. É processo.", in lower right small gold "01/04", at very bottom tiny gold uppercase "ZOOMMA", generous negative space, sophisticated minimalist aesthetic, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "post03_qua20_carrossel_slide2_onde_morre",
    desc: "Post 3 Slide 2 - onde a venda morre",
    prompt: `Editorial Instagram carousel content slide, full bleed warm off-white hex F5F3EE, large bold serif typography in deep navy hex 2B3A4D upper third left-aligned EXACT text "Onde a venda morre.", thin gold accent line hex D4A574 below, then in clean sans-serif regular dark gray hex 4A4A4A left-aligned body EXACT text in dialogue format: line 1 "Cliente:" line 2 in italic "Oi, quanto custa?" line 3 "Você:" line 4 in italic "R$ XXX." line 5 "Cliente:" line 6 in italic "[silêncio]", then blank line then EXACT text "Esse é o ponto exato onde você transforma uma potencial cliente em uma cotação. E cotação vira comparação.", in lower right small gold "02/04", generous negative space right, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "post03_qua20_carrossel_slide3_processo",
    desc: "Post 3 Slide 3 - o que muda com processo",
    prompt: `Editorial Instagram carousel content slide, full bleed warm off-white hex F5F3EE, large bold serif typography in deep navy hex 2B3A4D upper third left-aligned EXACT text on 2 lines: line 1 "O que muda" line 2 "com processo:", thin gold accent line hex D4A574 below, then a 4-item list with gold arrows hex D4A574 in clean sans-serif dark gray hex 4A4A4A, EXACT text: line 1 "→ A conversa começa antes do preço." line 2 "→ Você qualifica antes de cotar." line 3 "→ O follow-up não pressiona. Acompanha." line 4 "→ A cliente sente que está sendo cuidada.", in lower right small gold "03/04", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "post03_qua20_carrossel_slide4_cta",
    desc: "Post 3 Slide 4 CTA - CONVERTER",
    prompt: `Editorial Instagram carousel final CTA slide, full bleed deep navy hex 2B3A4D, large bold serif typography in pure white centered EXACT text on 3 lines: line 1 "Quer o script" line 2 "que usamos" line 3 "com os nossos clientes?", below CTA badge with thin gold border hex D4A574 4px rounded 12px, inside badge centered uppercase bold word "CONVERTER" in gold letter-spaced, below in small white sans-serif EXACT text "Envie essa palavra no direct.", in lower right small gold "04/04", at very bottom tiny gold uppercase "ZOOMMA", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },

  // ====================================================
  // POST 4 · SEX 22/05 · Imagem única · 3 sinais de crescimento real
  // ====================================================
  {
    nome: "post04_sex22_unica_3sinais",
    desc: "Post 4 imagem única - 3 sinais de crescimento (Kinfolk + texto)",
    prompt: `Editorial photography overhead view of a warm wooden desk surface in Kinfolk magazine style, featuring an open leather-bound journal with handwritten cursive notes partially visible (unreadable script), a small white ceramic cup of espresso, a brass fountain pen resting on the page, and a single sprig of dried eucalyptus in a clear glass vase, shot on Canon EOS R5 with 85mm f/1.4 lens at f/2.8, ISO 800, Kodak Portra 400 film emulation with visible film grain, available natural morning light from window on left at 4500K, warm honey wood tones and soft cream linen, sophisticated calm contemplative editorial mood, generous empty negative space in upper-left for typography overlay. Composition: objects in lower-right two thirds, clean empty space upper-left. Subtle natural film halation. No people.

Overlaid in the upper-left negative space, add ONE translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. Inside this overlay, render in deep navy hex 2B3A4D using bold elegant Playfair Display serif typography, EXACT text appearing only ONCE no duplication, on 4 lines: line 1 "3 sinais de que" line 2 "uma clínica cresce" line 3 "de verdade." line 4 "" line 5 in smaller italic "(E não só dá movimento.)". Below the headline a thin horizontal gold accent line hex D4A574. Below the line in small clean sans-serif uppercase navy with letter-spacing EXACT text "Envie DIAGNÓSTICO no direct.". Typography perfectly legible with all Portuguese accents intact.

${ASSINATURA_VISUAL}

Aspect ratio 4:5.

${NEG}`,
  },

  // ====================================================
  // POST 5 · SEG 25/05 · Post Respiro · Pausa.
  // ====================================================
  {
    nome: "post05_seg25_respiro_pausa",
    desc: "Post 5 respiro - Pausa.",
    prompt: `Editorial Kinfolk magazine style photography, a single white ceramic espresso cup sitting on a warm beige linen cloth on a polished walnut wood surface, soft diffused natural morning light from upper-left creating gentle long shadow, shot on Canon EOS R5 with 85mm f/1.4 lens at f/2.8, ISO 800, Kodak Portra 400 film emulation with visible film grain and subtle halation, color temperature 4500K warm tones, color palette warm walnut, soft beige linen, warm white ceramic, subtle brown shadow, the cup positioned in the lower-right third of the frame, generous empty negative space upper-left half. Sophisticated contemplative editorial mood, museum quality minimalism. No people, no objects other than the cup and linen.

Over the upper-left negative space, a single very large bold elegant serif typography word in deep navy hex 2B3A4D, EXACT single word with period: "Pausa.". No other text. No overlay rectangle. Just the word floating in the negative space.

${ASSINATURA_VISUAL}

Aspect ratio 4:5.

${NEG}`,
  },

  // ====================================================
  // POST 6 · TER 26/05 · Carrossel · Indicação é começo. Não é estratégia.
  // ====================================================
  {
    nome: "post06_ter26_carrossel_slide1_capa",
    desc: "Post 6 Slide 1 capa - indicação é começo",
    prompt: `Editorial Instagram carousel cover slide, full bleed deep navy hex 2B3A4D, large bold Playfair Display serif typography in pure white centered EXACT text on 3 lines: line 1 "Indicação" line 2 "é começo." line 3 "" line 4 "Não é estratégia.", below thin gold accent line hex D4A574 80px, below in small soft gold sans-serif italic EXACT text "Negócio que cresce na sorte não cresce duas vezes.", in lower right small gold "01/04", at very bottom tiny gold uppercase "ZOOMMA", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "post06_ter26_carrossel_slide2_porque",
    desc: "Post 6 Slide 2 - por que indicação não escala",
    prompt: `Editorial Instagram carousel content slide, full bleed warm off-white hex F5F3EE, large bold serif typography in deep navy hex 2B3A4D upper third left-aligned EXACT text on 2 lines: line 1 "Por que indicação" line 2 "não escala?", thin gold accent line hex D4A574 below, then in clean sans-serif regular dark gray hex 4A4A4A EXACT text "A indicação depende:", then a 3-item list with gold arrows hex D4A574, EXACT text per line: line 1 "→ De um cliente satisfeito (você não controla)" line 2 "→ Que se lembre de você na hora certa (você não controla)" line 3 "→ Que tenha alguém precisando (você não controla)", then in italic dark gray EXACT text "Indicação é resultado. Não é fonte.", in lower right small gold "02/04", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "post06_ter26_carrossel_slide3_previsivel",
    desc: "Post 6 Slide 3 - aquisição previsível",
    prompt: `Editorial Instagram carousel content slide, full bleed warm off-white hex F5F3EE, large bold serif typography in deep navy hex 2B3A4D upper third left-aligned EXACT text on 2 lines: line 1 "Aquisição previsível" line 2 "é outra coisa:", thin gold accent line hex D4A574 below, then a 4-item list with gold arrows hex D4A574 in clean sans-serif dark gray hex 4A4A4A, EXACT text per line: line 1 "→ Você sabe quantos leads chegam por semana." line 2 "→ Você sabe quanto cada lead custa." line 3 "→ Você sabe a taxa de conversão até o agendamento." line 4 "→ Você sabe quanto pode investir pra duplicar.", then in italic dark gray EXACT text "Sem isso, todo mês é uma aposta.", in lower right small gold "03/04", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "post06_ter26_carrossel_slide4_cta",
    desc: "Post 6 Slide 4 CTA - CRESCER",
    prompt: `Editorial Instagram carousel final CTA slide, full bleed deep navy hex 2B3A4D, large bold serif typography in pure white centered EXACT text on 2 lines: line 1 "Quer parar de" line 2 "depender da sorte?", below CTA badge with thin gold border hex D4A574 4px rounded 12px, inside badge centered uppercase bold word "CRESCER" in gold letter-spaced, below in small white sans-serif EXACT text "Envie essa palavra no direct.", in lower right small gold "04/04", at very bottom tiny gold uppercase "ZOOMMA", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },

  // ====================================================
  // POST 7 · QUA 27/05 · Reel Camila - Você não é caro. É mal apresentado.
  // ====================================================
  {
    nome: "post07_qua27_reel_thumb",
    desc: "Post 7 Reel thumbnail - Camila profissional da beleza (Modo 1)",
    fotoBase: { pasta: "camila", arquivo: "IMG_3835.jpg" },
    prompt: `CRITICAL PRESERVATION: keep the woman from the input photograph EXACTLY as she is — preserve with absolute fidelity her face, expression, warm smile, hair, eyes, the black professional uniform with embroidered logo, her standing posture holding aesthetic equipment, and pose. Do not alter her identity, clothing, body or pose. She must be unmistakably the same person in the same outfit holding the same equipment.

EDIT ONLY the following:

1. SCENE REFINEMENT: keep the aesthetic clinic/treatment room from the original photograph but elevate to sophisticated Kinfolk-magazine aesthetic — soften the clinical white walls slightly with subtle warm undertones, refine the equipment (Hooke) to look more elegant and editorial, keep the crystal chandelier visible, soften the curtain with golden hour light suggestion. Keep the equipment she is holding intact.

2. COLOR GRADING: apply warm Kinfolk magazine grading — warm honey tones, soft cream highlights, golden afternoon undertones, color temperature shifted to approximately 3800K with warm amber. Subtle natural Kodak Portra 400 film grain. Natural skin tone preservation critical on her face.

3. OVERLAY: in the upper-left negative space, add ONE translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. Inside this overlay, render in deep navy hex 2B3A4D using bold elegant Playfair Display serif typography, EXACT text appearing ONLY ONCE no duplication, on 3 lines: line 1 "Você não é caro." line 2 "" line 3 "Você é mal apresentado.". Below the headline a thin horizontal gold accent line hex D4A574. Below in smaller sans-serif italic dark gray EXACT text "E eu vou te explicar a diferença.". At bottom in small clean sans-serif uppercase navy with letter-spacing EXACT text "Envie VALOR no direct.". Typography perfectly legible with all Portuguese accents intact.

4. ${ASSINATURA_VISUAL}

5. Aspect ratio 4:5.

${NEG}`,
  },

  // ====================================================
  // POST 8 · SEX 29/05 · Carrossel · Você sabe o CAC do seu salão?
  // ====================================================
  {
    nome: "post08_sex29_carrossel_slide1_capa",
    desc: "Post 8 Slide 1 capa - CAC do salão",
    prompt: `Editorial Instagram carousel cover slide, full bleed deep navy hex 2B3A4D, large bold Playfair Display serif typography in pure white centered EXACT text on 2 lines: line 1 "Você sabe" line 2 "o CAC do seu salão?", below thin gold accent line hex D4A574 80px, below in small soft gold sans-serif italic EXACT text "Não? Por isso o lucro some.", in lower right small gold "01/04", at very bottom tiny gold uppercase "ZOOMMA", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "post08_sex29_carrossel_slide2_oque_cac",
    desc: "Post 8 Slide 2 - o que é CAC",
    prompt: `Editorial Instagram carousel content slide, full bleed warm off-white hex F5F3EE, large bold serif typography in deep navy hex 2B3A4D upper third left-aligned EXACT text "O que é CAC.", thin gold accent line hex D4A574 below, then in clean sans-serif regular dark gray hex 4A4A4A left-aligned EXACT text in large size "CAC = Custo de Aquisição de Cliente.", then blank line then in regular size EXACT text "É quanto você gasta — em ads, equipe, tempo, ferramentas — pra trazer 1 cliente novo.", then blank line then EXACT text "Sem esse número, você não sabe se está lucrando com cada cliente novo ou pagando pra ele entrar.", in lower right small gold "02/04", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "post08_sex29_carrossel_slide3_calcular",
    desc: "Post 8 Slide 3 - como calcular CAC",
    prompt: `Editorial Instagram carousel content slide, full bleed warm off-white hex F5F3EE, large bold serif typography in deep navy hex 2B3A4D upper third left-aligned EXACT text on 2 lines: line 1 "Como calcular" line 2 "(versão simples):", thin gold accent line hex D4A574 below, then a 4-item list with gold arrows hex D4A574 in clean sans-serif dark gray hex 4A4A4A, EXACT text per line: line 1 "→ Some tudo que gastou em marketing no mês" line 2 "→ Some o salário proporcional da equipe que atende lead" line 3 "→ Divida pelo número de clientes NOVOS no mês" line 4 "→ Esse é o seu CAC", then in italic dark gray EXACT text "Compare com o ticket médio. Se CAC > metade do ticket, você tem um problema.", in lower right small gold "03/04", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "post08_sex29_carrossel_slide4_cta",
    desc: "Post 8 Slide 4 CTA - NÚMEROS",
    prompt: `Editorial Instagram carousel final CTA slide, full bleed deep navy hex 2B3A4D, large bold serif typography in pure white centered EXACT text on 3 lines: line 1 "Quer aprender a olhar" line 2 "os números certos" line 3 "da sua clínica?", below CTA badge with thin gold border hex D4A574 4px rounded 12px, inside badge centered uppercase bold word "NÚMEROS" in gold letter-spaced, below in small white sans-serif EXACT text "Envie essa palavra no direct.", in lower right small gold "04/04", at very bottom tiny gold uppercase "ZOOMMA", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 Gerando ${posts.length} imagens — Agenda Maio 2026 via ${MODEL}`);
console.log(`📁 Saída: ${OUTPUT_DIR}\n`);

await fs.mkdir(OUTPUT_DIR, { recursive: true });

const inicio = Date.now();
const resultados = [];

for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  const numero = String(i + 1).padStart(2, "0");
  const arquivo = path.join(OUTPUT_DIR, `${post.nome}.png`);
  const tInicio = Date.now();

  process.stdout.write(`[${numero}/${posts.length}] ${post.desc}... `);

  try {
    let contents;
    if (post.fotoBase) {
      const fotoPath = path.join(FOTOS_DIR, post.fotoBase.pasta, post.fotoBase.arquivo);
      const fotoBytes = await fs.readFile(fotoPath);
      contents = [
        { inlineData: { mimeType: "image/jpeg", data: fotoBytes.toString("base64") } },
        { text: post.prompt },
      ];
    } else {
      contents = post.prompt;
    }

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
    if (!imagePart) throw new Error("Sem imagem na resposta");

    await fs.writeFile(arquivo, Buffer.from(imagePart.inlineData.data, "base64"));

    const segundos = ((Date.now() - tInicio) / 1000).toFixed(1);
    console.log(`✓ (${segundos}s)`);
    resultados.push({ post: post.nome, status: "ok", segundos });
  } catch (err) {
    console.log(`✗ ERRO: ${err.message}`);
    resultados.push({ post: post.nome, status: "erro", erro: err.message });
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
    console.log(`  - ${r.post}: ${r.erro}`);
  }
}
