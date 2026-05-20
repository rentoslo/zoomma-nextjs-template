---
name: veo3-fast-google-api
description: Use quando o usuário pedir geração de vídeo via Veo 3 Fast através da Google AI API (ou Gemini API). Triggers — "Veo 3 Fast", "gera vídeo Veo", "vídeo do Reels via Veo", "anúncio em vídeo com Veo", "vídeo curto Google", "veo3-fast", "vídeo IA Google", "Reel gerado por IA", "anúncio em vídeo curto", "vídeo vertical para Instagram com IA". Aplica os presets oficiais da agência por formato (Reels 9:16, post 1:1, story 9:16, anúncio quadrado) e cobra ANTES de gerar (custo por segundo). NÃO use para Veo 2 padrão (use veo-use); NÃO use para imagens estáticas (use nano-banana-pro-openrouter).
metadata:
  version: 1.0.0
  requires:
    env:
      - GOOGLE_AI_API_KEY
  primaryEnv: GOOGLE_AI_API_KEY
---

# Veo 3 Fast — Google AI API

Gera vídeos curtos (4-8s) via **Veo 3 Fast** (`veo-3.0-fast-generate-001`) usando a Google AI / Gemini API diretamente — sem RunComfy, sem Vertex AI complexo. Modelo otimizado para velocidade e custo: ideal para Reels, Stories, anúncios curtos e variações em massa.

> **Antes da primeira geração**, garanta que `GOOGLE_AI_API_KEY` está em `.env` (obter em [aistudio.google.com](https://aistudio.google.com/app/apikey)). Veo 3 Fast também precisa de Tier 1 ou superior na API.

---

## Regra de execução (INVIOLÁVEL)

1. **Identifique o cliente.** Leia `clientes/<cliente>/03-identidade-visual.md` antes de qualquer prompt — o estilo visual do cliente é parte do prompt.
2. **Descubra o padrão de saída do cliente ANTES de gravar onde quer que seja.** Os clientes da agência geralmente têm pasta de entrega no Google Drive com estrutura própria (campanhas, subpastas numeradas). Ordem de busca:
   - Procurar `_PADRAO-ORGANIZACAO.md` no Drive do cliente (ex: `G:\Meu Drive\CLIENTES\<CLIENTE>\AGENDA EDITORIAL\_PADRAO-ORGANIZACAO.md`)
   - Procurar referências de path em `clientes/<cliente>/03-identidade-visual.md` ou no playbook da campanha em curso
   - Se houver dúvida, **PERGUNTAR ao usuário onde salvar**. Não inventar pasta — perder vídeo no caminho errado custa tempo + dinheiro (mover arquivos grandes no Drive não é trivial).
3. **Sempre informe o custo estimado ANTES de gerar** (ver tabela abaixo). Vídeo é caro; nada deve ser gerado sem o usuário confirmar.
4. **Use um preset de formato** (Reel, Story, post-1:1, anúncio-9:16). Nunca gere "no que sair" — definir formato + duração + som antes.
5. **Salve dentro da pasta da campanha/ação correta do cliente.** Nada solto na raiz, nada em pasta genérica. Para a Camila Estética o padrão é `<DRIVE>/<CLIENTE>/AGENDA EDITORIAL/<AAAA-periodo>_<nome-campanha>/03_VIDEOS/<AAAA-MM>_<mes>/`. Para outros clientes, descobrir o padrão antes (ver passo 2).

---

## Custo estimado (Veo 3 Fast — Gemini API)

| Modelo | Custo aprox. | Notas |
|---|---|---|
| **Veo 3 Fast** (áudio nativo) | ~$0,15 / s | Vídeo 8s ≈ $1,20. Áudio sempre vem incluído via Gemini API |
| Veo 3 (padrão, qualidade alta) | ~$0,40 / s | Mais caro, mais qualidade |

> Preços podem mudar — confirmar em [ai.google.dev/pricing](https://ai.google.dev/pricing) ao primeiro uso. Atualizar este bloco quando mudar.

> ⚠️ **IMPORTANTE — Gemini API vs Vertex AI:** o flag `generateAudio` **NÃO é aceito** na Gemini API (Google AI Studio direto, SDK `@google/genai`). É exclusivo da Vertex AI. Na Gemini API, o **áudio é nativo** e **controlado pelo PROMPT** — descreva a sonoridade dentro de um bloco "AMBIENT SOUND DESIGN" no próprio prompt (ver exemplos abaixo).

---

## Presets de formato (use UM)

> Áudio é nativo na Gemini API. Para o vídeo sair **silencioso/ambiente**, descreva isso explicitamente no PROMPT (ver bloco AMBIENT SOUND DESIGN abaixo). Não há flag `generateAudio`.

### Preset A — Reel/Story 9:16, 8s
```
aspectRatio: 9:16
durationSeconds: 8
resolution: 720p   # ou 1080p (mais caro)
```
Para: capa de Reel, abertura de Story, anúncio vertical no Stories/Reels.

### Preset B — Anúncio quadrado 1:1, 6s
```
aspectRatio: 1:1
durationSeconds: 6
resolution: 720p
```
Para: anúncio in-feed Instagram, anúncio Meta no carrossel, criativo de teste.

### Preset C — Anúncio horizontal 16:9, 8s
```
aspectRatio: 16:9
durationSeconds: 8
resolution: 720p
```
Para: pré-roll YouTube, anúncio web display, vídeo de site.

### Preset D — Variações rápidas (teste de hipótese)
```
aspectRatio: 9:16
durationSeconds: 4
resolution: 720p
```
4 segundos é o mais barato (~$0,60). Use para gerar 3-5 variações rápidas e escolher o melhor antes de fazer a versão final em 8s.

---

## Como chamar (Node.js — padrão deste workspace)

> **Stack deste workspace é Node.js + `@google/genai`** (não Python). Todos os scripts em `scripts/` seguem padrão `.mjs` ES modules. Use Python só se for projeto novo isolado.

SDK já instalado em `scripts/package.json` (`@google/genai ^1.0.0` + `dotenv ^16.4.5`). Script de referência: [`scripts/gerar_reel_camila_veo3fast.mjs`](../../../scripts/gerar_reel_camila_veo3fast.mjs).

Estrutura mínima:

```js
import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

let operation = await ai.models.generateVideos({
  model: "veo-3.0-fast-generate-001",
  prompt: "...",                 // descrição visual + AMBIENT SOUND DESIGN
  config: {
    aspectRatio: "9:16",
    durationSeconds: 8,
    resolution: "720p",
    // ❌ NÃO incluir generateAudio — quebra na Gemini API
  },
});

// Veo é async: polling 10s
while (!operation.done) {
  await new Promise((r) => setTimeout(r, 10_000));
  operation = await ai.operations.getVideosOperation({ operation });
}

const generatedVideo = operation.response.generatedVideos[0];
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await ai.files.download({
  file: generatedVideo.video,
  downloadPath: outputPath,
});
```

Para image-to-video, adicionar `image: { imageBytes: <base64>, mimeType: "image/jpeg" }` no body.

---

## Como estruturar o prompt (regras Veo)

Veo entende prompts cinematográficos em **inglês ou português**. Inglês costuma render melhor. Use sempre estas 6 camadas:

1. **Câmera / Ângulo** — close-up, medium shot, drone, dutch angle, POV
2. **Sujeito + Ação** — quem aparece, fazendo o quê
3. **Cenário** — onde, com que objetos, contexto
4. **Iluminação** — golden hour, soft window light, neon night, studio
5. **Estilo / Atmosfera** — cinematic, documentary, anime, hyperreal, dreamlike
6. **Movimento de câmera** — slow pan, dolly in, locked off, handheld

Exemplo bom:
> *"Cinematic close-up, hands gently applying a golden serum to luminous skin, soft window light at golden hour, slow camera dolly in, white premium aesthetic, silent atmosphere, shallow depth of field, 35mm film grain."*

Para áudio no Veo 3 (Gemini API), **inclua um bloco AMBIENT SOUND DESIGN** no prompt — é assim que se controla o áudio (não há flag):

> *"AMBIENT SOUND DESIGN: Soft minimalist piano notes whispered in the far distance, barely audible, single sustained string drone underneath, gentle ambient room tone. NO voiceover, NO narration, NO melodic music in the foreground. Mood: Kinfolk magazine audio, Aman Resorts soundscape."*

Para vídeo **silencioso/ambiente puro**:

> *"AMBIENT SOUND DESIGN: Pure ambient room tone only, no music, no voiceover, no narration. Optional: faint natural sound matching the scene (water drop, fabric rustle, distant breath of wind)."*

---

## Quando NÃO usar Veo 3 Fast

- **Qualidade máxima** para campanha headline → use **Veo 3 padrão** (3x mais caro mas mais polido)
- **Imagens estáticas** → use **nano-banana-pro-openrouter** (Gemini 3 Pro Image)
- **Edição/extensão de vídeo existente** → use `veo-use` (suporta extend e inpainting)
- **Avatar falante** → use `agentspace-so/ai-avatar-video` (HeyGen-style) ou Synthesia
- **Vídeo longo (>8s contínuos)** → gere segmentos e edite externamente

---

## Integração com fluxo da agência

Quando o usuário pedir "vídeo para Reel da [cliente]":

1. Lê `clientes/<cliente>/03-identidade-visual.md` → extrai paleta, estilo
2. Lê `clientes/<cliente>/agendas/AAAA-MM/<post>.md` → extrai conceito da peça
3. Constrói prompt cinematográfico com as 6 camadas + estilo do cliente
4. Apresenta ao usuário: **prompt + preset + custo estimado** → pede aprovação
5. Após "ok", roda `scripts/veo3_fast.py`
6. Salva em `clientes/<cliente>/criativos/videos/`
7. Reporta caminho do arquivo

---

## Tabu

- Não gerar vídeo sem confirmar custo
- Não usar para conteúdo médico-prescritivo (compliance — clínicas estéticas têm regras específicas)
- Não gerar vídeo de "antes/depois" com pessoas reais que não autorizaram (LGPD)
- Não usar Veo 3 Fast para campanha de marca-mãe (use Veo 3 padrão)
