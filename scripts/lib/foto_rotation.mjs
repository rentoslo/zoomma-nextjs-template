// =====================================================
// Foto Rotation Helper — banco de fotos com rotação
// Re-escaneia a pasta a cada execução
// Prioriza fotos não usadas
// Alerta quando o ciclo completa (pede mais fotos)
// =====================================================
import { promises as fs } from "node:fs";
import path from "node:path";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/**
 * Lê a pasta de fotos ao vivo (rescan a cada execução).
 * @param {string} fotosDir absolute path
 * @returns {Promise<string[]>} filenames ordenados alfabeticamente
 */
export async function scanAvatarFolder(fotosDir) {
  const entries = await fs.readdir(fotosDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && IMAGE_EXTS.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort();
}

/**
 * Carrega o JSON de log de uso. Se não existir, cria estrutura vazia.
 * @param {string} logPath absolute path para foto_usage_log.json
 */
export async function loadUsageLog(logPath) {
  try {
    const raw = await fs.readFile(logPath, "utf-8");
    const parsed = JSON.parse(raw);
    // Defesa contra estruturas antigas/parciais
    if (!parsed.ciclo) parsed.ciclo = 1;
    if (!Array.isArray(parsed.uso)) parsed.uso = [];
    return parsed;
  } catch (err) {
    if (err.code === "ENOENT") {
      return { ciclo: 1, uso: [], criado_em: new Date().toISOString().split("T")[0] };
    }
    throw err;
  }
}

/**
 * Salva o log no disco com indentação.
 */
export async function saveUsageLog(logPath, log) {
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  await fs.writeFile(logPath, JSON.stringify(log, null, 2), "utf-8");
}

/**
 * Seleciona N fotos priorizando as ainda não usadas no ciclo atual.
 * Se acabarem, inicia novo ciclo e sinaliza precisa_mais_fotos.
 *
 * @param {number} count quantas fotos retornar
 * @param {string[]} availableFotos resultado do scanAvatarFolder
 * @param {object} log resultado do loadUsageLog
 * @returns {{
 *   fotos: string[],
 *   ciclo_atual: number,
 *   novas_no_banco: string[],   // fotos que apareceram desde a última execução
 *   precisa_mais_fotos: boolean // true quando o ciclo VAI virar nessa execução
 * }}
 */
export function selectFotos(count, availableFotos, log) {
  const usadasNoCicloAtual = new Set(
    log.uso.filter((u) => u.ciclo === log.ciclo).map((u) => u.foto)
  );

  const todasJaConhecidas = new Set(log.uso.map((u) => u.foto));
  const novas_no_banco = availableFotos.filter((f) => !todasJaConhecidas.has(f));

  const naoUsadasNoCiclo = availableFotos.filter((f) => !usadasNoCicloAtual.has(f));

  let fotos;
  let precisa_mais_fotos = false;

  if (naoUsadasNoCiclo.length >= count) {
    // Suficiente — pega as não usadas (novas primeiro pela ordem natural)
    fotos = naoUsadasNoCiclo.slice(0, count);
  } else {
    // Ciclo vai virar nesta execução
    precisa_mais_fotos = true;
    log.ciclo += 1;
    // Pega todas as não usadas + completa do início do banco se faltar
    const restante = count - naoUsadasNoCiclo.length;
    fotos = [...naoUsadasNoCiclo, ...availableFotos.slice(0, restante)];
  }

  return {
    fotos,
    ciclo_atual: log.ciclo,
    novas_no_banco,
    precisa_mais_fotos,
  };
}

/**
 * Registra que uma foto foi usada num post específico.
 * Mutaciona o log; salvar depois com saveUsageLog.
 */
export function recordUsage(log, foto, postName, scriptName) {
  const hoje = new Date().toISOString().split("T")[0];
  log.uso.push({
    foto,
    ciclo: log.ciclo,
    usada_em: hoje,
    post: postName,
    script: scriptName,
  });
}

/**
 * Status agregado para mostrar ao usuário no início e no fim do script.
 */
export function statusDoBanco(availableFotos, log) {
  const usadasNoCicloAtual = new Set(
    log.uso.filter((u) => u.ciclo === log.ciclo).map((u) => u.foto)
  );
  const disponiveis = availableFotos.length - usadasNoCicloAtual.size;
  return {
    total_no_banco: availableFotos.length,
    usadas_no_ciclo: usadasNoCicloAtual.size,
    disponiveis_no_ciclo: disponiveis,
    ciclo: log.ciclo,
  };
}

/**
 * Imprime cabeçalho de status do banco. Use no início do script.
 */
export function printStatus(status, novas_no_banco = []) {
  console.log(`\n📷 BANCO DE FOTOS — ciclo ${status.ciclo}`);
  console.log(
    `   ${status.total_no_banco} fotos total · ${status.usadas_no_ciclo} usadas · ${status.disponiveis_no_ciclo} disponíveis no ciclo`
  );
  if (novas_no_banco.length > 0) {
    console.log(`   🆕 ${novas_no_banco.length} foto(s) nova(s) detectada(s): ${novas_no_banco.join(", ")}`);
  }
}

/**
 * Imprime alerta quando o ciclo virou. Use no final do script.
 */
export function printAlertaCiclo(precisaMais, novoCiclo) {
  if (!precisaMais) return;
  console.log("\n" + "⚠️ ".repeat(20));
  console.log(`⚠️  CICLO ${novoCiclo - 1} COMPLETO — todas as fotos do banco já foram usadas.`);
  console.log(`⚠️  Iniciei o ciclo ${novoCiclo} reutilizando fotos.`);
  console.log(`⚠️  AÇÃO RECOMENDADA: adicione novas fotos à pasta fotos_avatar/ para variar.`);
  console.log("⚠️ ".repeat(20) + "\n");
}
