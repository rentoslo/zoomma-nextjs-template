---
name: whatsapp-funnel-brazil
description: Use quando o cliente da agência precisar de funil de WhatsApp Brasil — mensagens automáticas, segmentação, recuperação de leads, vendas no DM/WhatsApp. Triggers — "funil whatsapp", "automação whatsapp", "mensagem para lead", "responder lead no zap", "automação no zap", "recuperar lead", "fluxo de venda whatsapp", "ChatGuru", "TakeBlip", "Zapsign", "Botconversa", "campanha no whatsapp", "follow-up whatsapp", "vender no zap". Aplica regras específicas do mercado brasileiro (LGPD, política Meta, abordagem cultural). NÃO use para e-mail (use email-sequence ou cold-email).
metadata:
  version: 1.0.0
---

# WhatsApp Funnel — Brasil

O WhatsApp é o **canal #1 de conversão B2C no Brasil** (>96% dos brasileiros com smartphone usam). Esta skill estrutura fluxos de mensagens que respeitam a cultura brasileira, a LGPD e a política Meta.

> **Regra cultural fundamental:** brasileiro detesta robô que finge ser humano. Sempre identifique quando é automação. Sempre dê opção rápida de falar com pessoa real. Use tom amigável, não corporativo. Áudios funcionam mais que texto longo.

---

## Quando usar

- Cliente da agência quer estruturar atendimento no WhatsApp Business
- Lead chega do Instagram/Anúncio e precisa de fluxo de qualificação no WhatsApp
- Recuperar lead que parou de responder
- Sequência de pós-venda (nutrição, recompra, indicação)
- Disparo de campanha (com lista opt-in legítima)

---

## Stack típico no Brasil

| Categoria | Ferramentas comuns | Quando usar |
|---|---|---|
| **WhatsApp Business App** (grátis) | Próprio Meta | Cliente pequeno, 1 atendente, <50 conversas/dia |
| **WhatsApp Business API** | Z-API, Meta Cloud API, 360Dialog | Cliente médio/grande, automação real, multi-atendente |
| **Plataformas de chatbot/CRM** | TakeBlip, ChatGuru, Botconversa, Manychat (Whatsapp), Zapsign, Huggy, BotMaker | Funis prontos, integração com CRM |
| **Disparadores em massa** | EvolutionAPI, Z-API, Twilio | ⚠️ Risco de ban — só com opt-in robusto |

> **Não recomendar disparador em massa para cliente sem base opt-in.** A Meta bane número rapidamente. Para campanhas, prefira **Click-to-WhatsApp Ads** (anúncio Meta que leva ao zap) — o lead vem com opt-in implícito.

---

## Os 5 fluxos essenciais

### Fluxo 1 — Boas-vindas + qualificação (lead novo do anúncio)

Lead clicou em "Mais informações" no anúncio Meta e abriu conversa.

```
[Mensagem automática, identificada como automação]
Oi! Aqui é a [Nome da assistente] da [Cliente] 👋

Vi que você se interessou pelo [oferta do anúncio].

Pra eu te ajudar do jeito certo, me conta rapidinho:

1️⃣ Você quer pra você ou pra presente?
2️⃣ Em qual região você está?
3️⃣ Quer marcar uma avaliação ou só tirar dúvidas?

(Pode responder com áudio também 😉)
```

**Regras do fluxo 1:**
- Identificar como automação no primeiro contato
- Máximo 3 perguntas por vez
- Sempre oferecer alternativa de áudio (br adora áudio)
- Não pedir dados sensíveis (CPF, endereço completo) no primeiro contato
- Resposta humana em <15 minutos (horário comercial)

### Fluxo 2 — Qualificação e agendamento

Lead respondeu. Agora separar quente vs frio.

**Quente (quer marcar, urgência):**
```
Perfeito! Tenho horário [esta semana / hoje / amanhã].

Olha as opções:
🗓️ [data 1] - [hora]
🗓️ [data 2] - [hora]
🗓️ [data 3] - [hora]

Qual fica melhor?
```

**Morno (quer info, sem urgência):**
```
Beleza! Te mando o material agora:

📎 [link/PDF com tudo]
🎥 [vídeo de 30s da [Cliente] explicando]

Dá uma olhada com calma. Te chamo amanhã às [hora] pra ver se faz sentido pra você, ok?
```

**Frio (só curioso ou objeção forte):**
```
Tranquilo! Fica à vontade.

Se quiser ver o dia-a-dia da [Cliente], me segue no Insta: @[arroba]

E se mudar de ideia, é só chamar aqui 😊
```

### Fluxo 3 — Recuperação de lead inativo (3-7 dias sem resposta)

**Dia 3:**
```
Oi [Nome]! Tudo bem?

Lembrei de você 😊 Vi que a gente conversou semana passada sobre [oferta].

Ainda tá em dúvida ou já resolveu? Posso ajudar com algo?
```

**Dia 7 (último toque):**
```
Oi [Nome], aqui é a [Atendente] da [Cliente] novamente.

Esse é meu último toque pra não te encher 😅

Se quiser dar uma segunda olhada, [oferta de baixo atrito — kit, brinde, condição especial limitada].

Caso prefira ficar de fora, sem problema — desejo sucesso!
```

**Regra:** máximo 2 toques de recuperação. Mais que isso vira spam e a pessoa bloqueia.

### Fluxo 4 — Pós-venda (24h após primeiro serviço/compra)

```
Oi [Nome]! Aqui é a [Atendente] 💗

Como você se sentiu com o [serviço/produto]? Tô curiosa pra saber 😊

(Sua opinião sincera me ajuda demais a melhorar)
```

**Se resposta positiva:**
- Pedir review/depoimento (Google Business, Insta)
- Oferecer programa de indicação se houver
- Marcar próxima visita se aplicável

**Se resposta neutra/negativa:**
- Escutar SEM defender o cliente
- Encaminhar para humano resolver
- Não tentar virar venda agora

### Fluxo 5 — Reativação (cliente sumiu por 60-90 dias)

```
Oi [Nome]! Quanto tempo 🥰

Estava aqui passando o catálogo de [novidade da temporada / serviço novo] e lembrei de você.

[Foto/preview da novidade]

Quer dar uma olhada? Tem condição especial pra quem é cliente da casa esse mês 😊
```

---

## Princípios de copy WhatsApp Brasil

| ✅ Faz | ❌ Não faz |
|---|---|
| Frases curtas, parágrafos de 1-2 linhas | Bloco de texto corrido |
| Emoji para humanizar (1-3 por msg) | 10 emojis na mesma frase |
| Áudio quando dá (30-60s, nunca >2min) | Áudio de 5 minutos |
| "Oi [Nome]" personalizado | "Prezado cliente" |
| Pergunta com 2-3 opções claras | Pergunta aberta vaga |
| Foto/print real do produto/serviço | Stock photo genérica |
| Tom de amigo prestativo | Tom de robô corporativo |
| Resposta humana em <15min | Demorar horas / não responder |

---

## LGPD e compliance

- **Opt-in explícito** em qualquer lista de disparo (ex: "Quero receber promoções via WhatsApp" no formulário)
- **Sempre oferecer "PARE"** em campanhas de massa
- **Não compartilhar telefone** entre clientes / com terceiros
- **Política de retenção** — dados de lead devem ter prazo (90/180 dias)
- **Click-to-WhatsApp Ads** dão opt-in implícito (a pessoa iniciou o contato)
- **Listas compradas** = ban garantido + risco jurídico. **Nunca recomendar.**

---

## Métricas que importam

| Métrica | Bom benchmark Brasil |
|---|---|
| Taxa de resposta (lead novo) | >70% |
| Tempo médio de primeira resposta | <15 min (humano) / <30s (bot) |
| Conversão lead → agendamento | 30-50% (varia por nicho) |
| Conversão agendamento → venda | 50-80% |
| Taxa de bloqueio em campanha | <2% (acima disso = problema de copy ou frequência) |
| LTV via WhatsApp vs canal isolado | +20-40% típico |

---

## Integração com fluxo da agência

Quando o usuário pedir "funil WhatsApp para [cliente]":

1. Lê `clientes/<cliente>/02-tom-de-voz.md` → adapta as mensagens à voz do cliente
2. Lê `clientes/<cliente>/05-publico-alvo.md` → adapta as perguntas e CTAs à persona
3. Estrutura os 5 fluxos personalizados
4. Salva em `clientes/<cliente>/criativos/whatsapp/fluxos.md`
5. Se aplicável, escreve textos para ChatGuru/Botconversa em formato estruturado (gatilhos + respostas)
6. Sugere métricas que o cliente deve acompanhar

---

## Tabu

- ❌ Disparo em massa para lista comprada/raspada
- ❌ Bot que finge ser humano sem deixar claro
- ❌ Mais de 2 toques de recuperação no mesmo lead
- ❌ Vender no pós-venda de 24h (esperar pelo menos 7 dias para reabordagem comercial)
- ❌ Áudio de mais de 2 minutos
- ❌ Pedir dados sensíveis (CPF, endereço, dados de cartão) no zap — pode ser phishing aos olhos do lead
- ❌ Copiar fluxo de um cliente em outro sem adaptar tom-de-voz
