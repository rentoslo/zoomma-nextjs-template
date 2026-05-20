// =====================================================
// Refaz 2 imagens com novas fotos base escolhidas pelo usuário
//
// slide4-janela → IMG_3812 (sala clínica, lustre, maca, cortina janela)
// post-ancora   → IMG_3877 (uniforme bordô, parede cream, sorriso)
//
// Abordagem overlay (aprendizado da sessão anterior):
// não criar layout de 2 zonas separadas — overlay sobre a foto real.
// =====================================================

import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { qaImagem, logQA } from "./lib/qa_visual.mjs";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  console.error("ERRO: GOOGLE_AI_API_KEY não encontrada");
  process.exit(1);
}

const MODEL = "gemini-3-pro-image-preview";
const CAMPANHA = "2026-mai-jul_skin-winter";
const MES_PASTA = "2026-05_maio";
const OUTPUT_DIR = `G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\${CAMPANHA}\\02_IMAGENS\\${MES_PASTA}`;
const FOTOS_DIR = "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\fotos_avatar";
const MAX_TENTATIVAS = 3;

const TYPO = `Typography PERFECTLY legible, all Portuguese accents intact (á, ã, ç, é, ê, í, ó, ô, õ, ú). NO broken letters, NO doubled letters, NO hyphen-split words. Each line of text appears EXACTLY ONCE — never duplicated.`;

const posts = [
  // -------------------------------------------------------
  // SLIDE 4 CARROSSEL — A JANELA — 25/05
  // IMG_3812: sala clínica, maca, lustre, cortina janela lilás, uniforme preto
  // O contexto de clínica funciona perfeitamente com o tema "janela de tratamentos"
  // -------------------------------------------------------
  {
    nome: "2026-05-25-carrossel-dois-tipos-04-janela",
    seed: 25800,
    fotoInput: "IMG_3812.jpg",
    textoEsperado: "04/07 A JANELA Junho e julho são os meses em que a pele aceita peeling, estímulo, microagulhamento — sem fotossensibilidade do verão.",
    prompt: `Edit this real photo of Dr. Camila Slobodticov in her aesthetic clinic treatment room.

PRESERVE EXACTLY — do NOT alter:
- Her face, expression (smiling, direct eye contact), hair (dark brown wavy), skin tone
- Her black clinic uniform with embroidered name "Camila Slobodticov Estética"
- Her pose (leaning forward, hands resting on the treatment pillow)
- The treatment bed/maca and pillow in the foreground
- The chandelier above
- The two wooden door frames (biombos) on the sides

BACKGROUND ADAPTATION:
- Keep the overall room setting intact
- The curtain/fabric behind her: shift its color from lilac/purple toward a soft warm cream-white or very pale blush — maintain the window backlighting effect (bright soft glow behind the curtain)
- Keep the general clinic atmosphere — refined, premium, spa-like

ADD a frosted glass text overlay in the UPPER PORTION of the image (top 38%):
- Style: translucent frosted glass card, white/cream 80% opacity, rounded corners
- Content:
  [LABEL] "A JANELA" — small uppercase, gold #D4AF37, letter-spaced
  [BODY] Playfair Display italic black text, centered:
    LINE 1: "Junho e julho são os meses em que"
    LINE 2: "a pele aceita peeling, estímulo,"
    LINE 3: "microagulhamento — sem"
    LINE 4: "fotossensibilidade do verão."
  [ACCENT] thin gold #D4AF37 horizontal line below body text

- Slide indicator: small gold "04/07" in the TOP-RIGHT corner of the full image, OUTSIDE the glass card — appears ONLY ONCE

OUTPUT: 4:5 aspect ratio, vertical Instagram carousel slide. Premium editorial clinic aesthetic.
NEGATIVE: different woman, face replaced, text duplicated, slide number repeated, lilac/purple dominant, urban view, illegible text, broken letters
${TYPO}`,
  },

  // -------------------------------------------------------
  // POST ÂNCORA — 30/05
  // IMG_3877: uniforme bordô, sentada, rindo aberto, parede cream/white
  // Espaço generoso à direita → texto sobreposto no lado direito
  // -------------------------------------------------------
  {
    nome: "2026-05-30-post-ancora-dra-janela",
    seed: 30800,
    fotoInput: "IMG_3877.jpg",
    textoEsperado: "Junho abre uma temporada nova na Camila Estética. — DRA. CAMILA",
    prompt: `Edit this real photo of Dr. Camila Slobodticov. She is seated, laughing openly, wearing her professional maroon clinic coat, against a clean cream-white wall.

PRESERVE EXACTLY — do NOT alter:
- Her face, expression (open genuine laugh), hair (dark brown wavy), skin tone
- Her maroon/bordeaux professional clinic coat
- Her seated pose, hands clasped

BACKGROUND ADAPTATION:
- The clean cream wall behind her: warm it up very slightly toward warm ivory #F9F5EF — keep it clean and minimal
- Add a very subtle soft directional light from the upper-left (gentle, warm, not harsh)
- Keep everything clean and uncluttered

CREATE the post text layout directly on the image — place text elements in the UPPER-RIGHT area of the frame (she naturally occupies the left/center):
- In elegant Playfair Display serif italic, soft black #1A1A1A:
  LINE 1: "Junho abre"
  LINE 2: "uma temporada nova"
  LINE 3: "na Camila Estética."
- Below line 3: thin horizontal gold #D4AF37 accent line (about 100px wide)
- Bottom-right corner: small gold uppercase letter-spaced "— DRA. CAMILA"

The text sits directly on the cream wall area to the right of Dr. Camila — no separate panel or box, just elegant type on the clean background. The natural space on the right side of the photo is where the text goes.

OUTPUT: 4:5 vertical Instagram post, premium editorial aesthetic. Warm, welcoming, authoritative.
NEGATIVE: different woman, face replaced, text duplicated, text overlapping her face, illegible text, broken letters, panel box around text (text goes directly on background)
${TYPO}`,
  },
];

// =====================================================
// EXECUÇÃO COM QA
// =====================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

async function gerar(post, seed) {
  const fotoPath = path.join(FOTOS_DIR, post.fotoInput);
  const fotoBytes = await fs.readFile(fotoPath);
  const fotoBase64 = fotoBytes.toString("base64");

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [
      { inlineData: { data: fotoBase64, mimeType: "image/jpeg" } },
      { text: post.prompt },
    ]}],
    config: { responseModalities: ["IMAGE"], seed },
  });

  const candidate = response.candidates?.[0];
  if (!candidate) throw new Error("Sem candidates");
  const imagePart = candidate.content?.parts?.find((p) => p.inlineData);
  if (!imagePart) throw new Error("Sem inlineData");
  return Buffer.from(imagePart.inlineData.data, "base64");
}

async function gerarComQA(post) {
  const fotosRefPaths = [path.join(FOTOS_DIR, post.fotoInput)];
  let seed = post.seed;

  for (let t = 1; t <= MAX_TENTATIVAS; t++) {
    process.stdout.write(`  [${post.nome}] tentativa ${t}/${MAX_TENTATIVAS} (seed=${seed})... `);

    const bytes = await gerar(post, seed);
    const outputPath = path.join(OUTPUT_DIR, `${post.nome}.png`);
    await fs.writeFile(outputPath, bytes);
    process.stdout.write(`gerada (${(bytes.length / 1024).toFixed(0)} KB). QA... `);

    const qa = await qaImagem(ai, outputPath, {
      textoEsperado: post.textoEsperado,
      fotosReferencia: fotosRefPaths,
    });

    if (qa.passou) {
      console.log(`✓ passou`);
      logQA(post.nome, qa);
      return { nome: post.nome, status: "ok", tentativas: t };
    }

    console.log(`reprovou`);
    if (qa.problemas?.length) {
      qa.problemas.forEach((p) => console.log(`     [${p.gravidade}] ${p.tipo}: ${p.descricao}`));
    }
    if (t < MAX_TENTATIVAS) seed += 1000;
  }

  return { nome: post.nome, status: "qa_falhou", tentativas: MAX_TENTATIVAS };
}

async function main() {
  console.log("=== Refaz 2 imagens com novas fotos escolhidas ===");
  console.log(`slide4-janela → IMG_3812.jpg`);
  console.log(`post-ancora   → IMG_3877.jpg`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const inicio = Date.now();
  const resultados = [];

  for (const post of posts) {
    console.log(`▶ ${post.nome} (foto: ${post.fotoInput})`);
    const r = await gerarComQA(post).catch((err) => ({
      nome: post.nome, status: "erro", erro: err.message,
    }));
    resultados.push(r);
    if (r.erro) console.log(`  ❌ ${r.erro}`);
    console.log("");
  }

  const s = ((Date.now() - inicio) / 1000).toFixed(0);
  const ok = resultados.filter((r) => r.status === "ok").length;
  console.log(`=== RESUMO: ${ok}/2 em ${s}s ===`);
  resultados.forEach((r) => {
    console.log(`  ${r.status === "ok" ? "✓" : "✗"} ${r.nome}: ${r.status}`);
  });
}

main().catch((err) => {
  console.error("❌ ERRO FATAL:", err);
  process.exit(1);
});
