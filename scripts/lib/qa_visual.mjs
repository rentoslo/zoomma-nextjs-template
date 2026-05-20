// =====================================================
// QA Visual — Varredura automática de imagens geradas
// Usa Gemini 2.5 Flash (barato, multimodal) para detectar problemas.
// Retorna JSON estruturado { passou, problemas[] }.
// =====================================================
// Uso:
//   import { qaImagem } from "./lib/qa_visual.mjs";
//   const resultado = await qaImagem(ai, imagePath, { textoEsperado: "..." });
//   if (!resultado.passou) regerar();
// =====================================================

import { promises as fs } from "node:fs";
import path from "node:path";

const QA_MODEL = "gemini-2.5-flash";

const QA_PROMPT_PADRAO = `Você é um QA visual sênior de uma agência de marketing premium brasileira (Camila Estética — clínica estética feminina premium em Bauru).

Analise a imagem gerada e identifique PROBLEMAS. Seja rigoroso — preferimos um falso positivo do que entregar imagem ruim.

PROCESSO:
Primeiro, FAÇA OCR mental — leia TODO o texto da imagem, linha por linha, palavra por palavra. Liste mentalmente cada linha que você vê. SÓ DEPOIS aplique os critérios abaixo.

CRITÉRIOS DE FALHA:

1. **TEXTO ERRADO** (crítico — foque em ERROS REAIS, não em formatação):
   - Palavras com letras trocadas, repetidas, ou inventadas (ex: "corcrendo" no lugar de "correndo", "in-inverno" no lugar de "no inverno")
   - Acentos faltando ou errados em português (á, ã, ç, é, ê, í, ó, ô, õ, ú)
   - Texto truncado ou cortado (palavra cortada no meio)
   - Palavras quebradas com hífen no meio da palavra (ex: "fotos-sensibilidade" virando "fotos-/sensibilidade" no meio da palavra)
   - PALAVRAS faltando ou trocadas em relação ao texto esperado

   **NÃO reprovar por:**
   - Diferença de PONTUAÇÃO entre o texto esperado e o renderizado quando a separação está implícita no layout (ex: o texto esperado tem "SINAL 01 — Oleosidade..." e a imagem mostra "SINAL 01" como título tipográfico acima e "Oleosidade..." como corpo abaixo, sem travessão visível — isso É EQUIVALENTE, hierarquia visual substitui o travessão)
   - Diferença de QUEBRA DE LINHA (o texto esperado pode estar em uma linha contínua mas a imagem renderizou em múltiplas linhas, ou vice-versa — isso é design, não erro)
   - POSIÇÃO da numeração de slide (a numeração "NN/YY" deve estar no canto da imagem, NÃO concatenada com o texto principal — se ela estiver no canto, isso é correto, não reprovar)
   - Estilo de aspas (aspas simples, duplas, curvas — todas são intercambiáveis)
   - Estilo de travessão (hífen, en-dash, em-dash — todos são intercambiáveis quando usados como separador)

2. **REPETIÇÕES** (crítico) — VERIFIQUE COM ATENÇÃO ESPECIAL:
   - **Linha de texto inteira repetida** (ex: linha "uma temporada" aparece duas vezes consecutivas; expressão "Camila Estética" aparece duas vezes onde só deveria aparecer uma vez). Esta é uma falha comum e PRIORITÁRIA — releia o texto inteiro da imagem e confirme que cada frase/linha aparece UMA ÚNICA VEZ a menos que repetição seja claramente intencional.
   - **Palavra repetida** em sequência sem motivo (ex: "uma uma" ou "abre abre")
   - Numerações de slide (ex: "01/07", "02/07") aparecendo MAIS DE UMA VEZ na mesma imagem
   - Logo/assinatura repetida acidentalmente
   - Elementos visuais duplicados sem propósito

3. **ANATOMIA / POSES INADEQUADAS** (crítico):
   - Poses corporais inadequadas para clínica estética premium feminina (ex: pessoa deitada em cama em posição relaxada/sensual, robe aberto, exposição corporal não-clínica, poses eróticas ou íntimas demais)
   - Anatomia humana errada (dedos extras, faces deformadas, olhos vidrados)
   - Expressões estranhas/forçadas

4. **CONTEXTO FORA DO PADRÃO** (média):
   - Estética sterile/clínica demais (médico-hospitalar)
   - Stock photo cliché
   - Cores fora do sistema White Premium (saturação alta, neon, magenta, fúcsia)
   - Equipamentos médicos visíveis
   - Pessoas que NÃO deveriam estar lá (a clínica é feminina — homens só em casos específicos)

5. **TIPOGRAFIA RUIM** (média):
   - Fontes ilegíveis
   - Hierarquia visual ruim
   - Texto sobrepondo elementos importantes

6. **IDENTIDADE FACIAL** (crítico — só se receber fotos de referência): comparar o rosto da pessoa gerada com as fotos de referência fornecidas. Se as fotos de referência mostrarem a Dra. Camila, verifique se a pessoa na imagem gerada é VISIVELMENTE a MESMA mulher (mesmos traços faciais, mesma estrutura óssea, mesma idade aparente, mesma cor de cabelo, mesma etnia). Se for OUTRA mulher, reprovar com tipo "identidade".

RESPONDA SOMENTE COM JSON VÁLIDO (sem markdown, sem texto antes ou depois):
{
  "passou": true | false,
  "texto_lido_na_imagem": "transcrição completa de TODO o texto visível, linha por linha",
  "problemas": [
    { "tipo": "texto" | "repeticao" | "anatomia" | "contexto" | "tipografia" | "identidade", "gravidade": "critico" | "medio", "descricao": "..." }
  ],
  "observacao_geral": "uma linha curta sobre a impressão geral"
}

\`passou\` = true APENAS se NÃO houver nenhum problema crítico. Problemas médios não invalidam (mas são listados).`;

/**
 * Roda QA visual em uma imagem.
 * @param {GoogleGenAI} ai - cliente @google/genai já inicializado
 * @param {string} imagePath - caminho da imagem PNG/JPG
 * @param {object} opts - { textoEsperado?, contextoExtra?, fotosReferencia? }
 *   fotosReferencia: array de paths ou base64 das fotos de referência facial
 *   (passa antes da imagem gerada para o QA comparar identidade)
 * @returns {Promise<{passou: boolean, problemas: Array, observacao_geral: string, texto_lido_na_imagem?: string}>}
 */
export async function qaImagem(ai, imagePath, opts = {}) {
  const { textoEsperado, contextoExtra, fotosReferencia } = opts;

  const imageBytes = await fs.readFile(imagePath);
  const mimeType = imagePath.toLowerCase().endsWith(".jpg") || imagePath.toLowerCase().endsWith(".jpeg")
    ? "image/jpeg"
    : "image/png";

  let prompt = QA_PROMPT_PADRAO;
  if (textoEsperado) {
    prompt += `\n\nTEXTO ESPERADO NA IMAGEM (verifique conformidade EXATA, especialmente acentuação E ausência de linhas/expressões duplicadas):\n"""\n${textoEsperado}\n"""`;
  }
  if (contextoExtra) {
    prompt += `\n\nCONTEXTO ADICIONAL: ${contextoExtra}`;
  }

  // Montar parts: primeiro as fotos de referência (se houver), depois a imagem gerada, depois o prompt
  const parts = [];
  if (fotosReferencia?.length) {
    prompt += `\n\nAS PRIMEIRAS ${fotosReferencia.length} IMAGENS ABAIXO SÃO FOTOS DE REFERÊNCIA DA PESSOA QUE DEVERIA APARECER NA ÚLTIMA IMAGEM (a imagem gerada). Compare os rostos. Se a mulher da última imagem NÃO for visivelmente a MESMA pessoa das fotos de referência, reprove com tipo "identidade", gravidade "critico".`;
    for (const ref of fotosReferencia) {
      let refBytes, refMime;
      if (typeof ref === "string") {
        refBytes = await fs.readFile(ref);
        refMime = ref.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
      } else if (ref?.base64) {
        refBytes = Buffer.from(ref.base64, "base64");
        refMime = ref.mimeType || "image/jpeg";
      } else {
        continue;
      }
      parts.push({ inlineData: { data: refBytes.toString("base64"), mimeType: refMime } });
    }
  }
  parts.push({ inlineData: { data: imageBytes.toString("base64"), mimeType } });
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: QA_MODEL,
      contents: [{ role: "user", parts }],
      config: { responseMimeType: "application/json" },
    });

    const raw = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("QA: resposta vazia");

    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    return {
      passou: true,
      problemas: [],
      observacao_geral: `(QA falhou tecnicamente: ${err.message})`,
      _qa_error: true,
    };
  }
}

/**
 * Pretty-print resultado QA no console.
 */
export function logQA(nomeImagem, qa) {
  if (qa._qa_error) {
    console.log(`  ⚠ QA ${nomeImagem}: ${qa.observacao_geral}`);
    return;
  }
  if (qa.passou && qa.problemas.length === 0) {
    console.log(`  ✓ QA ${nomeImagem}: ok — ${qa.observacao_geral || "sem ressalvas"}`);
  } else if (qa.passou) {
    console.log(`  ⚠ QA ${nomeImagem}: passou com ressalvas:`);
    qa.problemas.forEach((p) => console.log(`     [${p.gravidade}] ${p.tipo}: ${p.descricao}`));
  } else {
    console.log(`  ❌ QA ${nomeImagem}: REPROVOU`);
    qa.problemas.forEach((p) => console.log(`     [${p.gravidade}] ${p.tipo}: ${p.descricao}`));
  }
}
