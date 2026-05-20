# PADRÃO-SKILLS — Mapa de skills para este cliente

> Este arquivo é **herdado por todo cliente** (vem do `_template/`). Ele responde uma pergunta só: **"para o que o usuário acabou de pedir, qual skill devo invocar?"**
>
> Adapte localmente caso este cliente tenha skill-personalizada (ex: Zoomma tem `zoomma-conteudo`, `zoomma-copy`, `zoomma-dossie`). Em geral, o padrão abaixo serve para qualquer cliente.

---

## Regra mestra

**Se existe uma skill específica para o pedido, INVOQUE essa skill.** Não improvise. Só responda "do zero" quando nenhuma skill cobre.

A stack completa está em `CLAUDE.md` raiz, seção *Stack de skills da agência*. Este arquivo é o **atalho operacional** — não duplica explicações, só mapeia.

---

## Mapa: pedido do usuário → skill

### 🧭 Início e gestão de cliente

| Usuário pede… | Use a skill |
|---|---|
| "Vamos cadastrar um cliente novo / configurar [nome] / fazer o briefing" | `agency-client-onboarding` |
| "Crie a agenda do mês / pautas / calendário editorial" | `agenda-editorial` |
| "Resuma quem é esse cliente / qual o contexto" | Leia `00-overview.md` + `01-briefing.md`, não precisa de skill |

### 📈 Estratégia

| Usuário pede… | Use a skill |
|---|---|
| "Planeja a estratégia mensal / trimestral" | `content-strategy` |
| "Estou sem ideia, me ajuda" | `marketing-ideas` ou `bmad-brainstorming` |
| "Vamos lançar um produto novo" | `launch-strategy` |
| "Aplica gatilhos mentais / psicologia / persuasão" | `marketing-psychology` |
| "Cria uma oferta irresistível" | `alex-hormozi-pitch` |
| "Distribui o orçamento de mídia entre canais" | `paid-ads-strategy` |
| "Conta uma história / narrativa para essa campanha" | `bmad-cis-storytelling` |

### 🔍 Pesquisa e tendências

| Usuário pede… | Use a skill |
|---|---|
| "Pesquisa a persona / VOC / o que os clientes dizem" | `customer-research` |
| "Analisa os concorrentes" | `competitor-profiling` |
| "Como nos posicionar vs [concorrente]" | `competitor-alternatives` |
| "Pesquisa o mercado / nicho" | `bmad-market-research` ou `bmad-domain-research` |
| "O que está em tendência social agora" | `social-media-trends-research` |
| "O que as pessoas estão buscando no Google" | `google-trends-research` |

### ✍️ Copy e conteúdo

| Usuário pede… | Use a skill |
|---|---|
| "Escreve copy para [página]" | `copywriting` |
| "Melhora / revisa essa copy" | `copy-editing` |
| "Cria copy para landing/sales page" | `landing-page-copywriter` |
| "Escreve um Reel / Carrossel / Story / post" | `social-content` (✚ pilares de `04-pilares-conteudo.md`) |
| "Cria sequência de e-mails" | `email-sequence` |
| "Escreve um cold e-mail B2B" | `cold-email` |
| "Revisa só a prosa / clareza" | `bmad-editorial-review-prose` |
| "Revisa a estrutura do texto" | `bmad-editorial-review-structure` |

### 🎯 Tráfego pago

| Usuário pede… | Use a skill |
|---|---|
| "Configura / otimiza Meta Ads (Facebook/Instagram)" | `meta-ads` |
| "Configura / otimiza Google Ads" | `google-ads` |
| "Anúncios no TikTok" | `tiktok-ads` |
| "Anúncios B2B / LinkedIn" | `linkedin-ads` |
| "YouTube Ads / TrueView / Bumper" | `youtube-ads` |
| "Gera 20 variações de copy de anúncio" | `ad-creative` |
| "Visão geral PPC / não sei qual canal usar" | `paid-ads` ou `paid-ads-strategy` |

### 🛒 Vendas e CRM

| Usuário pede… | Use a skill |
|---|---|
| "Cria material de vendas / pitch deck / one-pager" | `sales-enablement` |
| "Configura iscas digitais / lead magnet" | `lead-magnets` |
| "Define preço / estrutura de planos" | `pricing-strategy` |
| "Automação no CRM (HubSpot / Pipedrive / Salesforce)" | `crm-automation` |
| "Fluxo de WhatsApp / vender no zap" | `whatsapp-funnel-brazil` ⭐ |

### 🎨 Imagem (estática)

> ⚠️ **REGRAS CRÍTICAS DA CAMILA ESTÉTICA** (aprendizado 2026-05-20 — ver [memória](../../../../C:/Users/rento/.claude/projects/c--github-produtor-agendas-editoriais/memory/camila_imagens_regras_criticas.md)):
>
> 1. **Imagem com a Dra. Camila → SEMPRE i2i modo "ref" com 2 fotos avatar.** Generation pura ALUCINA pessoa diferente. Usar 2 fotos de `G:\Meu Drive\CLIENTES\CAMILA_ESTETICA\fotos_avatar\` + linguagem *"reference photographs above are ONLY for facial identity — RECOMPOSE the scene completely"*.
> 2. **Textos em PT 100% corretos.** Acentos completos, sem palavras quebradas, sem letras duplicadas. Numerações ("01/07") **uma única vez** no canto, NUNCA dentro do painel.
> 3. **QA visual obrigatório.** Após gerar, rodar `scripts/lib/qa_visual.mjs` para detectar erros de texto, repetições, anatomia inadequada. Se reprovar, regerar com seed+1000 (até 2 tentativas).
> 4. **Mulher em mockups nunca em cama / pose sensual / reclinada.** Wardrobe sempre fechado. Contexto clínica/estúdio/janela. Veja `POSE_FEMININA_PREMIUM` em `refazer_artes_camila_maio.mjs` como gabarito.

| Usuário pede… | Use a skill |
|---|---|
| "Gera imagem para a Camila" (qualidade alta, sem a Dra.) | `nano-banana-pro-openrouter` ou script local em `scripts/` |
| "Gera imagem com a Dra. Camila" | ⚠️ Script local em `scripts/` com **i2i modo ref + 2 fotos avatar** (ver `refazer_artes_camila_maio.mjs` como gabarito). NUNCA generation pura. |
| "Gera variação rápida / teste de prompt" | `nano-banana-2` |
| "Edita / muda fundo / mantém pessoa" | `nano-banana-edit` |
| "Pôster / PDF / arte estática complexa" | `canvas-design` |
| "Mockup de tela / landing / interface" | `frontend-design` |

> **Sempre** carregue o **Prompt-base** de `03-identidade-visual.md` antes de chamar. Sem exceção (Regra 4 do CLAUDE.md raiz).

### 🎬 Vídeo

> ⚠️ **REGRA ESPECÍFICA DA CAMILA ESTÉTICA:** nem todo Reel é gerado aqui. Antes de pegar a skill de vídeo, consulte [`REELS-ORIGEM.md`](REELS-ORIGEM.md). Resumo:
>
> - 🤖 **Veo aqui** SÓ para: Categoria 3 · Variação E (silêncio premium, atmosférico, still-life, sem pessoa identificável)
> - 🎥 **Camila grava** TUDO que tem: rosto da Dra., cliente real, antes/depois, bastidor, fala, autoridade
>
> Se o Reel tem qualquer pessoa identificável, **NÃO use Veo** — em vez disso, gere um **briefing de filmagem** e salve em `criativos/videos/_briefings_filmagem/`.

| Usuário pede… | Use a skill |
|---|---|
| "Gera um Reel silencioso / atmosférico / still-life" (Cat 3 · Var E) | `veo3-fast-google-api` ⭐ |
| "Gera um Reel com a Dra. Camila" | ❌ **NÃO** — preparar briefing de filmagem (Camila grava) |
| "Gera um Reel com cliente / antes-depois" | ❌ **NÃO** — preparar briefing (filmagem real, autorização) |
| "Pipeline complexo com Veo (image-to-video, extension)" | `veo-build` |
| "Como prompto um Veo 3.1?" | `veo3-prompter` |
| "Roteiro / direção geral de vídeo" | `social-content` (roteiro) + `video` (orientação) |

### 🎨 Sistema visual / branding

| Usuário pede… | Use a skill |
|---|---|
| "Define o sistema visual / paleta / tipografia" | `brand-visual-generator` |
| "Aplica a identidade da marca em [peça]" | `brand-guidelines` |

### 📊 SEO, CRO, Analytics

| Usuário pede… | Use a skill |
|---|---|
| "Auditoria SEO do site" | `seo-audit` |
| "Por que minha página não converte / melhora a conversão" | `cro` |
| "Cria um popup / banner de captura" | `popups` |
| "Configura tracking / GA4 / GTM" | `analytics` |
| "Faz um teste A/B disso" | `ab-testing` |

---

## Regra de combinação

Algumas tarefas exigem **encadear** skills. Padrão recomendado:

### Padrão A — Agenda editorial mensal completa
1. `agenda-editorial` → puxar pautas
2. `social-content` → escrever roteiros/legendas
3. `nano-banana-pro-openrouter` → gerar capas/imagens
4. `veo3-fast-google-api` → gerar Reels animados (quando aplicável)
5. Salvar tudo em `agendas/AAAA-MM/`

### Padrão B — Campanha de mídia paga nova
1. `customer-research` → confirmar persona
2. `paid-ads-strategy` → definir mix de canais e orçamento
3. `alex-hormozi-pitch` → estruturar a oferta
4. `landing-page-copywriter` → criar página de captura
5. `meta-ads` / `google-ads` / etc. → configurar campanhas
6. `ad-creative` → gerar 10-20 variações de copy
7. `nano-banana-pro-openrouter` + `veo3-fast-google-api` → criativos
8. `analytics` + `ab-testing` → instrumentar e testar

### Padrão C — Lançamento de produto
1. `launch-strategy` → planejar fases
2. `competitor-profiling` → mapear concorrentes
3. `alex-hormozi-pitch` → desenhar oferta
4. `pricing-strategy` → definir preço
5. `landing-page-copywriter` → página de pré-venda
6. `email-sequence` → nutrição
7. `whatsapp-funnel-brazil` → conversão final
8. `paid-ads-strategy` + canais específicos → tráfego

### Padrão D — Conteúdo orgânico semanal
1. `google-trends-research` + `social-media-trends-research` → temas quentes
2. `social-content` → 3-5 peças
3. `nano-banana-pro-openrouter` → capas
4. `bmad-editorial-review-prose` → revisão final

---

## O que NÃO fazer

- ❌ Misturar tom-de-voz ou pilares deste cliente com outro
- ❌ Ignorar `03-identidade-visual.md` em prompt de imagem ou vídeo
- ❌ Gerar vídeo (Veo) sem confirmar custo com o usuário antes
- ❌ Salvar entregáveis fora de `agendas/AAAA-MM/` ou `criativos/`
- ❌ Inventar dados, números, depoimentos ou histórias do cliente (regra anti-alucinação)
- ❌ "Reproduzir do zero" um processo que tem skill — sempre invocar a skill primeiro

---

## Quando uma skill nova for instalada

1. Adicionar 1 linha na tabela correspondente acima
2. Verificar se o `CLAUDE.md` raiz também precisa ser atualizado (seção *Stack de skills da agência*)
3. Se for skill de canal totalmente novo (ex: Pinterest Ads, Spotify Ads), criar nova categoria

---

## Quando uma skill não cobre o pedido

1. Tentar `find-skills` para descobrir se existe skill externa
2. Se não existe, considerar criar com `skill-creator`
3. Se for tarefa rara/one-off, fazer manualmente sem skill (último recurso)
