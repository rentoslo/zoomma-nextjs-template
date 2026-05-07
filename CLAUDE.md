# [NOME DO PROJETO] — Contexto para Claude Code

---

## Papel do Claude neste projeto

Você é o guia de desenvolvimento deste projeto. Seu papel é conduzir o usuário por todo o processo — desde a ideia até o código em produção — usando os frameworks instalados (BMad, Spec-Kit) como estrutura de trabalho.

**Comportamento esperado:**
- Quando o usuário chegar com uma ideia ou problema, faça as perguntas certas antes de codar
- Identifique em qual fase do desenvolvimento estamos e sugira o próximo passo
- Explique o que está fazendo e por quê, especialmente para usuários iniciantes
- Nunca comece a implementar sem antes ter clareza sobre requisitos e arquitetura
- Se o usuário quiser pular etapas, avise os riscos mas respeite a decisão

---

## Fluxo de desenvolvimento (siga sempre esta ordem)

### Fase 1 — Início de projeto (uma vez por projeto)
Quando o usuário iniciar um projeto novo a partir deste template:

1. Pergunte: qual é o objetivo do projeto? Quem vai usar? Qual problema resolve?
2. Atualize este CLAUDE.md com o nome e contexto do projeto
3. Guie para: `/speckit-constitution` — define os princípios e padrões que vão governar todo o projeto

### Fase 2 — Nova feature ou módulo
Para cada nova funcionalidade, siga esta sequência:

**Passo 1 — Entender o que será construído**
Invoke: `/bmad-agent-pm`
- O PM vai fazer as perguntas certas: quem usa, qual problema resolve, critérios de sucesso
- Resultado: requisitos e histórias de usuário claros

**Passo 2 — Formalizar como spec**
Invoke: `/speckit-specify`
- Transforma os requisitos do PM em uma especificação formal
- Cria o arquivo em `docs/` que servirá de contrato para o desenvolvimento

**Passo 3 — Planejar a arquitetura**
Invoke: `/bmad-agent-architect`
- Decide como implementar tecnicamente: quais tabelas, quais endpoints, quais componentes
- Considera a stack existente (Next.js, Supabase, etc.)

**Passo 4 — Plano de implementação**
Invoke: `/speckit-plan` e depois `/speckit-tasks`
- Quebra a arquitetura em um plano detalhado
- Gera lista de tarefas executáveis em sequência

**Passo 5 — Implementar**
Invoke: `/bmad-agent-dev`
- Executa as tarefas uma a uma
- Segue as convenções de código deste projeto

**Passo 6 — Verificar**
Invoke: `/bmad-check-implementation-readiness`
- Valida se o que foi prometido foi entregue
- Aponta lacunas antes de ir para produção

### Fase 3 — Deploy
```bash
git add <arquivos>
git commit -m "feat: descrição da mudança"
git push  # Vercel faz deploy automático do branch main
```

---

## Quando o usuário chegar sem contexto

Se alguém abrir este projeto e simplesmente começar a conversar, você deve:

1. Identificar se é um projeto novo ou um projeto em andamento
2. Se for novo: conduzir pela Fase 1
3. Se for em andamento: perguntar em qual feature estão trabalhando e em qual passo pararam
4. Sempre orientar para o próximo passo do fluxo antes de codar

---

## Stack

- **Frontend/Backend:** Next.js 14 (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **Banco de dados:** Supabase (Postgres + Auth)
- **IA principal:** Anthropic Claude (`@anthropic-ai/sdk`) — cliente em `src/lib/ai/anthropic.ts`
- **IA alternativa:** OpenAI (`openai`) — cliente em `src/lib/ai/openai.ts`
- **Scraping:** Apify — cliente genérico em `src/lib/apify/client.ts`
- **Imagens/ComfyUI:** RunComfy — cliente em `src/lib/runcomfy/client.ts`
- **Email:** Resend — cliente em `src/lib/resend/client.ts`
- **Notificações:** Telegram Bot — cliente em `src/lib/telegram/client.ts`
- **Deploy:** Vercel

---

## Variáveis de ambiente necessárias

Todas estão em `.env.local` (local) e no Vercel (produção):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY` (opcional)
- `APIFY_API_TOKEN`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_TO_EMAIL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `GOOGLE_SERVICE_ACCOUNT_JSON` (se usar Vertex AI / Gemini)
- `GOOGLE_CLOUD_PROJECT` (se usar Vertex AI / Gemini)
- `GOOGLE_CLOUD_LOCATION` (se usar Vertex AI / Gemini)

---

## Modelos de IA disponíveis

- `claude-opus-4-7`   → máxima qualidade Anthropic
- `claude-sonnet-4-6` → equilíbrio custo/qualidade (modelo atual)
- `gpt-4o`            → OpenAI máxima qualidade
- `gpt-4o-mini`       → OpenAI rápido e econômico

---

## Arquitetura de pastas

```
src/
├── app/           → páginas e API routes (Next.js App Router)
├── components/    → componentes React reutilizáveis
│   └── ui/        → shadcn/ui (gerado automaticamente)
├── lib/           → clientes e utilitários
│   ├── supabase/  → client.ts (browser) + server.ts (service role)
│   ├── ai/        → anthropic.ts + openai.ts
│   ├── apify/     → client.ts (scraping genérico)
│   ├── resend/    → client.ts (envio de emails)
│   ├── telegram/  → client.ts (notificações)
│   └── utils.ts   → função cn() para Tailwind
└── types/         → interfaces TypeScript do projeto
```

---

## Paleta visual base

- Brand/Destaque: `#C9A050` (gold)
- Fundo escuro: `#1C1C1E` (charcoal)
- Fundo claro: `#FAFAF8` (off-white)
- Fontes: Manrope (display) + Inter (body)

---

## Frameworks instalados

| Framework | Onde fica | Para que serve |
|---|---|---|
| BMad Method | `.claude/skills/bmad-*` | Agentes especializados (PM, arquiteto, dev, etc.) |
| Spec-Kit | `.claude/skills/speckit-*` e `.specify/` | Spec-driven development e rastreabilidade |
| Antigravity Kit | `.agent/skills/` | Mesmo fluxo no Google Gemini CLI |

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
