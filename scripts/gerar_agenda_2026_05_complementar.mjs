// Geração da agenda complementar Zoomma — Maio 2026 (20/05 a 29/05)
// 4 posts → 10 imagens
//   C1 carrossel 4 slides (4) + C2 imagem única (1) + C3 Reel thumb Renato (1) + C4 carrossel 4 slides (4)
// Modo 1 (preservar pessoa inteira) no Reel C3 com Renato (_MG_3728.jpg — não usada)
// Output: G:\Meu Drive\ZOOMMA\AGENDA EDITORIAL\2026-05_MAIO_complementar\imagens\

import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const API_KEY = process.env.GOOGLE_AI_API_KEY;
const MODEL = "gemini-3-pro-image-preview";
const OUTPUT_DIR = "G:\\Meu Drive\\ZOOMMA\\AGENDA EDITORIAL\\2026-05_MAIO_complementar\\imagens";
const FOTOS_DIR = "G:\\Meu Drive\\ZOOMMA\\IDENTIDADE VISUAL\\fotos_referencia";

const ASSINATURA_VISUAL = `IMPORTANT visual signature: a thin solid metallic gold vertical line color hex D4A574 exactly 1.5 pixels wide at 90 percent opacity, positioned at exactly 28 pixels from the left edge of the canvas, running uninterrupted from top to bottom. This is the official Zoomma brand signature.`;

const NEG = `no symmetry, no plastic skin, no airbrushed skin, no AI face artifacts, no CGI, no 3D render, no harsh shadows, no commercial glow, no garbled text, no missing accents, no duplicated text, no repeated words, no watermarks, no HDR, no over-saturation`;

// =====================================================
// 10 IMAGENS — MAIO COMPLEMENTAR
// =====================================================
const posts = [
  // ====================================================
  // POST C1 · QUA 20/05 · Carrossel · Seu posicionamento em 1 frase
  // ====================================================
  {
    nome: "postC1_qua20_carrossel_slide1_capa",
    desc: "C1 Slide 1 capa - posicionamento em 1 frase",
    prompt: `Editorial Instagram carousel cover slide, full bleed deep navy blue background color hex 2B3A4D, large bold elegant Playfair Display serif typography in pure white centered, EXACT text appearing ONLY ONCE no duplication, on 3 lines: line 1 "Seu posicionamento" line 2 "em 1 frase.", below a thin horizontal gold accent line hex D4A574 about 80 pixels wide, below in small clean sans-serif soft gold italic the EXACT text "Se você precisa de 3 parágrafos pra explicar, ainda não tem.", in lower right small gold "01/04", at very bottom tiny gold uppercase letter-spaced "ZOOMMA", generous negative space, sophisticated minimalist aesthetic, no logos, flawless legible typography with perfect Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "postC1_qua20_carrossel_slide2_formula",
    desc: "C1 Slide 2 - a fórmula que cabe num cartão",
    prompt: `Editorial Instagram carousel content slide, full bleed warm off-white background hex F5F3EE, large bold serif Playfair Display typography in deep navy hex 2B3A4D upper third left-aligned EXACT text on 2 lines: line 1 "A fórmula que" line 2 "cabe num cartão.", thin gold accent line hex D4A574 below headline, then in clean sans-serif Montserrat regular dark gray hex 4A4A4A left-aligned body EXACT text on its own line in italic: "Eu ajudo [QUEM] a conseguir [O QUÊ] sem [O QUE ELA TEME].", then blank line then EXACT text "Exemplos:", then a 3-item list with gold arrows hex D4A574 in clean sans-serif dark gray, EXACT text per line: line 1 "→ Ajudo mulheres acima de 35 a ter pele firme sem cirurgia." line 2 "→ Ajudo noivas a chegarem radiantes ao casamento sem dieta drástica." line 3 "→ Ajudo executivas a manterem cabelo saudável sem perder hora no salão toda semana.", in lower right small gold "02/04", generous negative space right, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "postC1_qua20_carrossel_slide3_porque",
    desc: "C1 Slide 3 - por que essa frase muda tudo",
    prompt: `Editorial Instagram carousel content slide, full bleed warm off-white background hex F5F3EE, large bold serif typography in deep navy hex 2B3A4D upper third left-aligned EXACT text on 2 lines: line 1 "Por que essa frase" line 2 "muda tudo:", thin gold accent line hex D4A574 below, then a 4-item list with gold arrows hex D4A574 in clean sans-serif regular dark gray hex 4A4A4A, EXACT text per line: line 1 "→ Filtra cliente errada antes do contato" line 2 "→ Justifica preço (não atende qualquer um)" line 3 "→ Vira base de anúncio, bio, abertura de conversa" line 4 "→ Cliente certa se reconhece e pergunta direto", then blank line then in italic dark gray EXACT text "Sem essa frase, sua comunicação fica pra qualquer pessoa — ou seja, pra ninguém.", in lower right small gold "03/04", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "postC1_qua20_carrossel_slide4_cta",
    desc: "C1 Slide 4 CTA - VALOR",
    prompt: `Editorial Instagram carousel final CTA slide, full bleed deep navy hex 2B3A4D, large bold serif Playfair Display typography in pure white centered EXACT text on 3 lines: line 1 "Quer ajuda" line 2 "pra escrever" line 3 "a sua frase?", below generous space a clean rectangular CTA badge with thin gold border hex D4A574 about 4 pixels thick rounded corners 12 pixels, inside the badge centered single uppercase bold word "VALOR" in gold sans-serif letter-spaced, below the badge in small white sans-serif EXACT text "Envie essa palavra no direct.", in lower right small gold "04/04", at very bottom tiny gold uppercase letter-spaced "ZOOMMA", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },

  // ====================================================
  // POST C2 · SEX 22/05 · Imagem única · Quanto investir em marketing por mês
  // ====================================================
  {
    nome: "postC2_sex22_imagem-unica",
    desc: "C2 imagem única - quanto investir em marketing (Kinfolk)",
    prompt: `Editorial photography overhead view of a warm wooden desk surface in Kinfolk magazine style, featuring a slim minimalist calculator (vintage cream-colored), an open leather-bound journal with handwritten cursive notes partially visible (unreadable script), a small white ceramic cup of espresso, a brass fountain pen resting on the page, and a single sprig of dried eucalyptus in a clear glass vase, shot on Canon EOS R5 with 85mm f/1.4 lens at f/2.8, ISO 800, Kodak Portra 400 film emulation with visible film grain, available natural morning light from window on left at 4500K, warm honey wood tones and soft cream linen, sophisticated calm contemplative editorial mood, generous empty negative space in upper-left for typography overlay. Composition: objects in lower-right two thirds, clean empty space upper-left. Subtle natural film halation. No people.

Overlaid in the upper-left negative space, add ONE translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. Inside this overlay, render in deep navy hex 2B3A4D using bold elegant Playfair Display serif typography, EXACT text appearing only ONCE no duplication, on 3 lines: line 1 "Quanto investir" line 2 "em marketing" line 3 "por mês?". Below the headline a thin horizontal gold accent line hex D4A574. Below the line in smaller serif italic navy EXACT text on 2 lines: line 1 "A resposta tem faixa." line 2 "Não tem número mágico.". At bottom in small clean sans-serif uppercase navy with letter-spacing EXACT text "Envie NÚMEROS no direct.". Typography perfectly legible with all Portuguese accents intact.

${ASSINATURA_VISUAL}

Aspect ratio 4:5.

${NEG}`,
  },

  // ====================================================
  // POST C3 · TER 26/05 · Reel Renato (Modo 1) - Delegar 100% é perder o leme
  // ====================================================
  {
    nome: "postC3_ter26_reel_thumb",
    desc: "C3 Reel thumbnail - Renato Modo 1 (foto _MG_3728 ainda não usada)",
    fotoBase: { pasta: "renato", arquivo: "_MG_3728.jpg" },
    prompt: `CRITICAL PRESERVATION: keep the man from the input photograph EXACTLY as he is — preserve with absolute fidelity his face, expression, hair, eyes, his complete outfit (every garment exactly as it appears), his entire body, posture, and pose. Do not alter his identity, clothing, body or pose. He must be unmistakably the same person in the same outfit.

EDIT ONLY the following:

1. BACKGROUND: replace whatever original background existed with a sophisticated Kinfolk-magazine-style home office aesthetic — warm honey wood paneling behind him softly out of focus, large floor-to-ceiling window on the left with soft natural daylight, a single green plant blurred in the corner, subtle bookshelf hint, all in dreamy depth of field. He remains absolute focal point. Match perspective and scale to his pose.

2. COLOR GRADING: apply warm Kinfolk magazine color grading — warm honey tones, golden afternoon undertones, color temperature 4500K with warm amber. Subtle natural Kodak Portra 400 film grain with visible texture. Natural skin tone preservation critical — keep pores visible, do not airbrush.

3. OVERLAY: in the upper-left negative space, add ONE translucent warm beige overlay rectangle color hex E8D9CC at 78 percent opacity with soft rounded corners 16 pixels radius. Inside this overlay, render in deep navy hex 2B3A4D using bold elegant Playfair Display serif typography, EXACT text appearing ONLY ONCE no duplication, on 3 lines: line 1 "Delegar 100%" line 2 "o marketing" line 3 "é perder o leme.". Below the headline a thin horizontal gold accent line hex D4A574. Below in smaller sans-serif italic dark gray EXACT text on 1 line "(E quem te fala isso é uma agência.)". At bottom in small clean sans-serif uppercase navy with letter-spacing EXACT text "Envie ESTRATÉGIA no direct.". Typography perfectly legible with all Portuguese accents intact.

4. ${ASSINATURA_VISUAL}

5. Aspect ratio 4:5.

${NEG}`,
  },

  // ====================================================
  // POST C4 · SEX 29/05 · Carrossel · Como cobrar caro sem soar arrogante
  // ====================================================
  {
    nome: "postC4_sex29_carrossel_slide1_capa",
    desc: "C4 Slide 1 capa - cobrar caro sem soar arrogante",
    prompt: `Editorial Instagram carousel cover slide, full bleed deep navy hex 2B3A4D, large bold Playfair Display serif typography in pure white centered EXACT text appearing ONLY ONCE no duplication, on 3 lines: line 1 "Como cobrar caro" line 2 "sem soar" line 3 "arrogante.", below thin gold accent line hex D4A574 80px wide, below in small soft gold sans-serif italic EXACT text "A diferença está em UMA palavra que você troca.", in lower right small gold "01/04", at very bottom tiny gold uppercase "ZOOMMA", generous negative space, sophisticated minimalist aesthetic, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "postC4_sex29_carrossel_slide2_arrogancia_autoridade",
    desc: "C4 Slide 2 - arrogância x autoridade",
    prompt: `Editorial Instagram carousel content slide, full bleed warm off-white hex F5F3EE, large bold serif typography in deep navy hex 2B3A4D upper third left-aligned EXACT text on 1 line "Arrogância x autoridade.", thin gold accent line hex D4A574 below, then in clean sans-serif regular dark gray hex 4A4A4A EXACT text in bold "Arrogante diz:", then on next line in italic EXACT text in quote: "Eu sou a melhor. Cobro porque mereço.", then blank line then in bold EXACT text "Autoridade diz:", then on next lines in italic EXACT text on 2 lines: line 1 "Esse é o trabalho que entrego." line 2 "Esse é o investimento que ele exige.", then blank line then in italic regular EXACT text on 2 lines: line 1 "A primeira centra em VOCÊ." line 2 "A segunda centra no TRABALHO.", in lower right small gold "02/04", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "postC4_sex29_carrossel_slide3_3trocas",
    desc: "C4 Slide 3 - 3 trocas que mudam a percepção",
    prompt: `Editorial Instagram carousel content slide, full bleed warm off-white hex F5F3EE, large bold serif typography in deep navy hex 2B3A4D upper third left-aligned EXACT text on 2 lines: line 1 "3 trocas que" line 2 "mudam a percepção:", thin gold accent line hex D4A574 below, then a 3-item list with gold arrows hex D4A574 in clean sans-serif regular dark gray hex 4A4A4A, EXACT text per line: line 1 "→ Meu serviço é caro → Esse é o investimento desse trabalho" line 2 "→ Eu cobro mais que o mercado → Trabalho com um padrão diferente" line 3 "→ Tenho 10 anos de experiência → Esse cuidado vem de 10 anos olhando casos parecidos", then blank line then in italic dark gray EXACT text on 2 lines: line 1 "Não fala de você." line 2 "Fala do que você entrega.", in lower right small gold "03/04", generous negative space, no logos, flawless typography with Portuguese accents, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
  {
    nome: "postC4_sex29_carrossel_slide4_cta",
    desc: "C4 Slide 4 CTA - DIAGNÓSTICO",
    prompt: `Editorial Instagram carousel final CTA slide, full bleed deep navy hex 2B3A4D, large bold serif Playfair Display typography in pure white centered EXACT text on 3 lines: line 1 "Quer um diagnóstico" line 2 "da comunicação" line 3 "da sua clínica?", below generous space a clean rectangular CTA badge with thin gold border hex D4A574 about 4 pixels thick rounded corners 12 pixels, inside the badge centered single uppercase bold word "DIAGNÓSTICO" in gold sans-serif letter-spaced, below the badge in small white sans-serif EXACT text "Envie essa palavra no direct.", in lower right small gold "04/04", at very bottom tiny gold uppercase letter-spaced "ZOOMMA", generous negative space, no logos, flawless typography with Portuguese accents and tilde, aspect ratio 4:5. ${ASSINATURA_VISUAL} ${NEG}`,
  },
];

// =====================================================
// EXECUÇÃO
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

console.log(`\n🎨 Gerando ${posts.length} imagens — Agenda Maio Complementar via ${MODEL}`);
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
