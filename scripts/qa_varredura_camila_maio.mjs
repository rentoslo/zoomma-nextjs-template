// =====================================================
// QA VARREDURA — Camila Maio 2026
// Roda QA visual em TODAS as imagens da pasta 2026-05_maio
// (priorizando v2/v3 quando existem, fallback v1).
// SÓ DETECTA problemas — não regera. Output: relatório markdown.
// =====================================================

import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { qaImagem } from "./lib/qa_visual.mjs";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  console.error("ERRO: GOOGLE_AI_API_KEY não encontrada em .env");
  process.exit(1);
}

const CAMPANHA = "2026-mai-jul_skin-winter";
const MES_PASTA = "2026-05_maio";
const PASTA = `G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\${CAMPANHA}\\02_IMAGENS\\${MES_PASTA}`;
const FOTOS_DIR = "G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\fotos_avatar";
const FOTOS_REF = [path.join(FOTOS_DIR, "IMG_3677.jpg"), path.join(FOTOS_DIR, "IMG_3690.jpg")];

const PARALLEL_BATCH_SIZE = 4;

// Lista de imagens a verificar — base name (sem versão).
// O script usa a versão MAIS RECENTE disponível (v3 > v2 > v1).
// Imagens com `useAvatar:true` rodam QA com comparação facial.
const targets = [
  // 20/05 carrossel "Outono virou"
  { base: "2026-05-20-carrossel-outono-virou-v1-slide1-capa", textoEsperado: `O outono virou. Sua pele percebeu? 01/07` },
  { base: "2026-05-20-carrossel-outono-virou-v1-slide2-sinal1", textoEsperado: `SINAL 01 — Oleosidade desregulada de um lado, ressecamento do outro. 02/07` },
  { base: "2026-05-20-carrossel-outono-virou-v1-slide3-sinal2", textoEsperado: `SINAL 02 — Manchas que estavam disfarçadas começam a aparecer. 03/07` },
  { base: "2026-05-20-carrossel-outono-virou-v1-slide4-sinal3", textoEsperado: `SINAL 03 — Textura mais áspera ao toque, principalmente nas bochechas. 04/07` },
  { base: "2026-05-20-carrossel-outono-virou-v1-slide5-sinal4", textoEsperado: `SINAL 04 — Viço perdido — aquele aspecto 'apagado' no espelho de manhã. 05/07` },
  { base: "2026-05-20-carrossel-outono-virou-v1-slide6-sinal5", textoEsperado: `SINAL 05 — Olheiras mais marcadas, mesmo dormindo igual. 06/07` },
  { base: "2026-05-20-carrossel-outono-virou-v1-slide7-cta", textoEsperado: `O fim do verão é o sinal. Cada estação pede um cuidado. — CAMILA ESTÉTICA. 07/07` },
  // 22/05 capa reel
  { base: "2026-05-22-capa-reel-silencioso-premium-v1", textoEsperado: `(sem texto — atmosfera silenciosa)`, contextoExtra: "Reel cover silencioso premium — deve NÃO ter texto algum." },
  // 23/05 still-life
  { base: "2026-05-23-still-life-frasco-petala-v1", textoEsperado: `(sem texto — still-life premium)`, contextoExtra: "Cat 3 silêncio premium — deve NÃO ter texto, NÃO mostrar pessoas." },
  // 25/05 carrossel "Dois tipos de mulher" (skipped slide1, 4, 5 — já refeitos)
  { base: "2026-05-25-carrossel-dois-tipos-mulher-v1-slide2-tipo1", textoEsperado: `TIPO 01 — A primeira faz uma sessão quando incomoda muito. Depois espera. Depois faz de novo. 02/07` },
  { base: "2026-05-25-carrossel-dois-tipos-mulher-v1-slide3-tipo2", textoEsperado: `TIPO 02 — A segunda entende a pele como ciclo. Cada estação pede um cuidado. Cada estação constrói o próximo. 03/07` },
  { base: "2026-05-25-carrossel-dois-tipos-mulher-v1-slide6-metodo", textoEsperado: `Não existe pele perfeita. Existe pele cuidada com método. 06/07` },
  { base: "2026-05-25-carrossel-dois-tipos-mulher-v1-slide7-cta", textoEsperado: `Em junho, abrimos a temporada. Comenta 'inverno' pra receber. INVERNO — CAMILA ESTÉTICA. 07/07` },
  // 29/05 carrossel "5 perguntas" (skipped slide4 — já refeito)
  { base: "2026-05-29-carrossel-5perguntas-pele-v1-slide1-capa", textoEsperado: `5 perguntas que sua pele faria pra você se pudesse falar. 01/07` },
  { base: "2026-05-29-carrossel-5perguntas-pele-v1-slide2-p1", textoEsperado: `PERGUNTA 01 — Por que você só lembra de mim quando eu chamo atenção? 02/07` },
  { base: "2026-05-29-carrossel-5perguntas-pele-v1-slide3-p2", textoEsperado: `PERGUNTA 02 — Por que você compra sérum novo, mas nunca me pergunta o que eu preciso? 03/07` },
  { base: "2026-05-29-carrossel-5perguntas-pele-v1-slide5-p4", textoEsperado: `PERGUNTA 04 — Por que você confia em qualquer um que diga 'limpeza de pele'? 05/07` },
  { base: "2026-05-29-carrossel-5perguntas-pele-v1-slide6-p5", textoEsperado: `PERGUNTA 05 — Quando foi a última vez que alguém me olhou de verdade? 06/07` },
  { base: "2026-05-29-carrossel-5perguntas-pele-v1-slide7-cta", textoEsperado: `Talvez seja hora de uma avaliação séria. Em junho, abrimos espaço. INVERNO — CAMILA ESTÉTICA. 07/07` },
  // 31/05 encerramento
  { base: "2026-05-31-post-encerramento-v1", textoEsperado: `Maio acabou. Junho começa diferente. — CAMILA ESTÉTICA` },
];

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function descobrirImagem(base) {
  // tenta v3, v2, v1 — sem versão também
  const baseSemVersao = base.replace(/-v\d+/, "");
  const candidatos = [
    base.replace(/-v\d+/, "-v3"),
    base.replace(/-v\d+/, "-v2"),
    base,
    baseSemVersao,
  ];
  for (const c of candidatos) {
    const p = path.join(PASTA, `${c}.png`);
    try {
      await fs.access(p);
      return { path: p, versao: c.match(/-v(\d+)/)?.[1] || "1" };
    } catch {}
  }
  return null;
}

async function rodarQA(target) {
  const found = await descobrirImagem(target.base);
  if (!found) return { ...target, status: "nao_encontrada" };

  const qa = await qaImagem(ai, found.path, {
    textoEsperado: target.textoEsperado,
    contextoExtra: target.contextoExtra,
    // sem fotosReferencia — essas imagens não usam Dra. (i2i)
  });

  return { ...target, status: qa.passou ? "ok" : "reprovou", versao: found.versao, qa };
}

async function main() {
  console.log("=== QA VARREDURA — Camila Maio 2026 ===");
  console.log(`Pasta: ${PASTA}`);
  console.log(`Total: ${targets.length} imagens · paralelo ${PARALLEL_BATCH_SIZE}\n`);

  const resultados = [];
  for (let i = 0; i < targets.length; i += PARALLEL_BATCH_SIZE) {
    const batch = targets.slice(i, i + PARALLEL_BATCH_SIZE);
    console.log(`▶ Batch ${Math.floor(i / PARALLEL_BATCH_SIZE) + 1}/${Math.ceil(targets.length / PARALLEL_BATCH_SIZE)}`);
    const r = await Promise.all(
      batch.map((t) => rodarQA(t).catch((err) => ({ ...t, status: "erro", erro: err.message })))
    );
    r.forEach((x) => {
      const flag = x.status === "ok" ? "✓" : x.status === "reprovou" ? "✗" : "?";
      console.log(`  ${flag} ${x.base} (v${x.versao || "?"}) — ${x.qa?.observacao_geral || x.erro || "?"}`);
    });
    resultados.push(...r);
  }

  const ok = resultados.filter((r) => r.status === "ok").length;
  const reprovou = resultados.filter((r) => r.status === "reprovou").length;
  const naoEncontradas = resultados.filter((r) => r.status === "nao_encontrada").length;

  console.log("");
  console.log("=== RESUMO ===");
  console.log(`Aprovadas: ${ok}/${targets.length}`);
  console.log(`Reprovadas: ${reprovou}`);
  console.log(`Não encontradas: ${naoEncontradas}`);
  console.log("");

  // Relatório markdown — salvar na raiz do projeto
  const reportPath = path.join(import.meta.dirname, "..", "QA-RELATORIO-CAMILA-MAIO-2026.md");
  let md = `# Relatório QA — Camila Maio 2026\n\n`;
  md += `**Pasta:** \`${PASTA}\`\n\n`;
  md += `**Resumo:** ✅ ${ok} aprovadas · ❌ ${reprovou} reprovadas · ❓ ${naoEncontradas} não encontradas\n\n`;
  md += `---\n\n`;
  for (const r of resultados) {
    const flag = r.status === "ok" ? "✅" : r.status === "reprovou" ? "❌" : r.status === "nao_encontrada" ? "❓" : "⚠️";
    md += `## ${flag} ${r.base} (v${r.versao || "?"})\n\n`;
    if (r.qa?.observacao_geral) md += `> ${r.qa.observacao_geral}\n\n`;
    if (r.qa?.texto_lido_na_imagem) md += `**Texto lido:** ${r.qa.texto_lido_na_imagem}\n\n`;
    if (r.qa?.problemas?.length) {
      md += `**Problemas:**\n`;
      r.qa.problemas.forEach((p) => {
        md += `- \`[${p.gravidade}]\` **${p.tipo}**: ${p.descricao}\n`;
      });
      md += `\n`;
    }
    if (r.erro) md += `**Erro técnico:** ${r.erro}\n\n`;
  }

  await fs.writeFile(reportPath, md, "utf-8");
  console.log(`📄 Relatório salvo em: ${reportPath}`);
}

main().catch((err) => {
  console.error("❌ ERRO FATAL:", err);
  process.exit(1);
});
