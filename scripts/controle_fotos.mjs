// Módulo utilitário — controle de uso de fotos de referência
// Verifica o que existe nas pastas vs o que está registrado em controle_uso_fotos.md
// Exporta funções para listar fotos disponíveis, detectar novas, escolher próxima

import { promises as fs } from "node:fs";
import path from "node:path";

const FOTOS_BASE_DIR = "G:\\Meu Drive\\ZOOMMA\\IDENTIDADE VISUAL\\fotos_referencia";
const CONTROLE_PATH =
  "c:\\github\\produtor_agendas_editoriais\\clientes\\zoomma\\controle_uso_fotos.md";

/**
 * Lista as fotos atuais da pasta de uma pessoa
 */
export async function listarFotosPessoa(pessoa) {
  const pastaPath = path.join(FOTOS_BASE_DIR, pessoa);
  try {
    const arquivos = await fs.readdir(pastaPath);
    return arquivos
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort();
  } catch (err) {
    return [];
  }
}

/**
 * Faz inventário de TODAS as pessoas e retorna diff vs controle
 */
export async function inventarioCompleto() {
  const pessoas = ["renato", "camila", "bruno", "paola"];
  const inventario = {};

  for (const pessoa of pessoas) {
    const fotos = await listarFotosPessoa(pessoa);
    inventario[pessoa] = {
      total: fotos.length,
      fotos: fotos,
    };
  }

  return inventario;
}

/**
 * Lê o controle de uso e extrai quais fotos já foram usadas
 * Retorna estrutura: { renato: ["IMG_X.jpg", ...], camila: [...], ... }
 */
export async function lerFotosUsadas() {
  try {
    const conteudo = await fs.readFile(CONTROLE_PATH, "utf-8");
    const usadas = { renato: [], camila: [], bruno: [], paola: [] };

    // Parsing simples — busca menções de "IMG_*.jpg" ou "_MG_*.jpg" nas tabelas
    const regex = /(IMG_\d+\.jpg|_MG_\d+\.jpg)/g;
    const matches = [...conteudo.matchAll(regex)];
    const todasMencoes = matches.map((m) => m[1]);

    // Heurística: olha o contexto da tabela pra atribuir à pessoa correta
    // Por enquanto: lista todas as fotos mencionadas (sem distinção rigorosa)
    // Refinar quando o controle ficar mais estruturado
    for (const foto of todasMencoes) {
      if (foto.startsWith("_MG_")) {
        if (!usadas.renato.includes(foto)) usadas.renato.push(foto);
      } else if (foto.startsWith("IMG_")) {
        // IMG_ pode ser Camila ou outras — por ora atribui à Camila (única com IMG_)
        if (!usadas.camila.includes(foto)) usadas.camila.push(foto);
      }
    }

    return usadas;
  } catch (err) {
    return { renato: [], camila: [], bruno: [], paola: [] };
  }
}

/**
 * Identifica fotos novas (presentes na pasta mas não registradas no controle)
 */
export async function detectarFotosNovas() {
  const inventario = await inventarioCompleto();
  const usadas = await lerFotosUsadas();

  const novas = {};
  for (const pessoa of Object.keys(inventario)) {
    const fotosPasta = inventario[pessoa].fotos;
    const fotosUsadasOuRegistradas = usadas[pessoa] || [];

    novas[pessoa] = fotosPasta.filter(
      (f) => !fotosUsadasOuRegistradas.includes(f)
    );
  }

  return { inventario, usadas, novas };
}

/**
 * Escolhe a próxima foto a usar (prioriza não usadas; rotaciona se todas usadas)
 */
export async function escolherProximaFoto(pessoa, preferencias = {}) {
  const { inventario, usadas } = await detectarFotosNovas();
  const fotosPasta = inventario[pessoa]?.fotos ?? [];
  const fotosUsadas = usadas[pessoa] ?? [];

  if (fotosPasta.length === 0) {
    throw new Error(`Nenhuma foto encontrada na pasta de ${pessoa}`);
  }

  // 1ª opção: foto preferida (se informada) e não usada
  if (preferencias.preferida && fotosPasta.includes(preferencias.preferida)) {
    return preferencias.preferida;
  }

  // 2ª opção: alguma foto ainda não usada
  const naoUsadas = fotosPasta.filter((f) => !fotosUsadas.includes(f));
  if (naoUsadas.length > 0) {
    return naoUsadas[0]; // primeira não usada
  }

  // 3ª opção: rotação — usa a menos recentemente usada (por ordem alfabética como proxy)
  return fotosPasta[0];
}

/**
 * Imprime relatório do inventário atual (uso CLI)
 */
export async function imprimirRelatorio() {
  const { inventario, usadas, novas } = await detectarFotosNovas();

  console.log("\n📸 INVENTÁRIO DE FOTOS DE REFERÊNCIA — ZOOMMA");
  console.log("=".repeat(60));

  for (const pessoa of ["renato", "camila", "bruno", "paola"]) {
    const total = inventario[pessoa]?.total ?? 0;
    const usadasCount = usadas[pessoa]?.length ?? 0;
    const novasCount = novas[pessoa]?.length ?? 0;

    console.log(`\n👤 ${pessoa.toUpperCase()}`);
    console.log(`   Total na pasta: ${total}`);
    console.log(`   Já usadas: ${usadasCount}`);
    console.log(`   Não usadas ainda: ${novasCount}`);

    if (novasCount > 0 && novasCount <= 10) {
      console.log(`   Disponíveis: ${novas[pessoa].join(", ")}`);
    } else if (novasCount > 10) {
      console.log(`   (${novasCount} fotos disponíveis — não listadas)`);
    }
  }

  console.log("\n" + "=".repeat(60));
}

// Se executado direto via CLI, imprime relatório
const argv1 = process.argv[1]?.replace(/\\/g, "/") ?? "";
const metaUrl = import.meta.url.replace(/^file:\/+/, "").replace(/\\/g, "/");
if (metaUrl.toLowerCase() === argv1.toLowerCase()) {
  await imprimirRelatorio();
}
