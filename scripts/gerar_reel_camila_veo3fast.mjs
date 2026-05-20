// =====================================================
// REEL CAMILA ESTÉTICA — 22/05/2026 — "Em breve" (silêncio premium)
// Variação E · Técnica A · Categoria 3 (sem texto, sem voz)
// Modelo: Veo 3 Fast via Google AI API direto
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

// ---------- Configuração ----------
// IMPORTANTE: Camila Estética usa estrutura por CAMPANHA no Drive.
// Padrão definido em `G:\...\AGENDA EDITORIAL\_PADRAO-ORGANIZACAO.md`.
// Sempre verificar esse arquivo antes de definir paths para um cliente.
const MODEL = "veo-3.0-fast-generate-001";
const CAMPANHA = "2026-mai-jul_skin-winter";
const MES_PASTA = "2026-05_maio";
const OUTPUT_DIR = `G:\\Meu Drive\\CLIENTES\\CAMILA_ESTETICA\\AGENDA EDITORIAL\\${CAMPANHA}\\03_VIDEOS\\${MES_PASTA}`;
const OUTPUT_FILE = "2026-05-22-reel-silencioso-premium-v1.mp4";

// Nota: generateAudio NÃO é aceito na Gemini API (só na Vertex AI).
// Veo 3 Fast via Gemini gera áudio nativamente quando aplicável; o áudio é
// controlado pela descrição sonora dentro do PROMPT (ver bloco AMBIENT SOUND
// DESIGN abaixo).
const CONFIG = {
  aspectRatio: "9:16",
  durationSeconds: 8,
  resolution: "720p",
};

// ---------- Prompt cinematográfico ----------
// Variação E · Técnica A · DNA Camila White Premium Editorial
const PROMPT = `Cinematic 8-second editorial film, vertical 9:16 aspect ratio.

OPENING (0-3s): Macro close-up of an apothecary crystal bottle, transparent glass with soft golden #D4AF37 metal cap, resting on a Calacatta marble surface. Single window light from the left at golden hour, soft directional shadows, slow camera dolly-in extremely smooth, razor-shallow depth of field.

MIDDLE (3-5s): Slow dissolve to a single crystal water drop falling in ultra slow motion onto a white rose petal lying on cream linen fabric. The drop hits in slow-motion micro splash, refracted light, dewdrops visible, tactile and intimate.

CLOSING (5-8s): Slow lateral pan revealing translucent linen curtain backlit by warm golden window light, soft amber haze, gentle natural fabric movement in invisible breeze.

VISUAL TREATMENT — STRICT:
- Medium-format Hasselblad 100mm f/2.8 macro look, razor-shallow depth of field
- Soft diffused natural window light, 5200-5500K with subtle warmth, single light source
- Cream and white dominant palette, marble whites, transparent crystal
- Whispered pink #FCE4EC barely tinting the linen, soft gold #D4AF37 only on the bottle cap
- Kodak Portra 400 film grain, slight halation, organic analog feel, NOT digital
- Generous negative space, breathing composition, editorial magazine aesthetic
- Mood references: Aman Resorts brand film, La Mer commercial, Augustinus Bader print ad, Byredo product film, Kinfolk magazine

ABSOLUTELY NO TEXT ON SCREEN — no subtitles, no captions, no logos, no watermarks, no typography of any kind.

AMBIENT SOUND DESIGN: Soft minimalist piano notes whispered in the far distance, barely audible, single sustained string drone underneath as a subtle layer, gentle ambient room tone, faint sound of water drop with crystalline resonance during the petal scene, distant linen rustle in the closing. NO voiceover, NO narration, NO spoken word, NO melodic music in the foreground. Mood: Kinfolk magazine audio, Aman Resorts soundscape, refined silence with the faintest musical hint.

NEGATIVE: oversaturated, neon colors, harsh contrast, hot pink, fuchsia, magenta, dark moody atmosphere, gothic, cold blue tones, AI-generated plastic look, digital art aesthetic, fake bokeh, busy composition, cluttered, stock photo cliché, watermark, logo overlay, hard cinematic dramatic lighting, text on screen, narration, spoken voice, loud music, pop music.`;

// =====================================================
// EXECUÇÃO
// =====================================================
async function main() {
  console.log("=== Reel Camila Estética — 22/05/2026 ===");
  console.log(`Modelo: ${MODEL}`);
  console.log(`Resolução: ${CONFIG.resolution} · Duração: ${CONFIG.durationSeconds}s · Ratio: ${CONFIG.aspectRatio}`);
  console.log(`Áudio: nativo (controlado pelo prompt, ~$1,20)`);
  console.log(`Output: ${path.join(OUTPUT_DIR, OUTPUT_FILE)}`);
  console.log("");

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  console.log("⏳ Iniciando geração... (Veo 3 Fast leva 1-3 min)");
  const startTime = Date.now();

  let operation = await ai.models.generateVideos({
    model: MODEL,
    prompt: PROMPT,
    config: CONFIG,
  });

  console.log(`✓ Operation iniciada: ${operation.name || "(sem nome)"}`);

  // Polling com feedback de tempo
  let pollCount = 0;
  while (!operation.done) {
    pollCount++;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    process.stdout.write(`\r⏳ Aguardando... ${elapsed}s (poll #${pollCount})`);
    await new Promise((r) => setTimeout(r, 10_000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  console.log("");
  console.log(`✓ Geração concluída em ${((Date.now() - startTime) / 1000).toFixed(0)}s`);

  if (!operation.response || !operation.response.generatedVideos?.[0]) {
    console.error("❌ Operação retornou sem vídeo:", JSON.stringify(operation, null, 2));
    process.exit(1);
  }

  const generatedVideo = operation.response.generatedVideos[0];
  const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);

  console.log(`⏳ Baixando vídeo para ${outputPath}...`);

  await ai.files.download({
    file: generatedVideo.video,
    downloadPath: outputPath,
  });

  const stats = await fs.stat(outputPath);
  console.log(`✓ Vídeo salvo: ${outputPath}`);
  console.log(`  Tamanho: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log("");
  console.log("=== CONCLUÍDO ===");
}

main().catch((err) => {
  console.error("❌ ERRO:", err);
  if (err.response) {
    console.error("Response:", JSON.stringify(err.response, null, 2));
  }
  process.exit(1);
});
