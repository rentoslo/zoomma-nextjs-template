# LEIA ANTES DE CRIAR — Zoomma Next.js Template

> **Leitura obrigatória.** Este template tem uma estrutura e um fluxo de trabalho específicos.
> Seguir os passos abaixo garante que tudo funcione corretamente desde o primeiro dia.

Template base para projetos Next.js da Zoomma. Inclui stack completa, clientes de API prontos e sistema de desenvolvimento guiado por IA (BMad + Spec-Kit).

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | Tailwind CSS + shadcn/ui |
| Banco de dados | Supabase (Postgres + Auth) |
| IA | Anthropic Claude + OpenAI + Google Gemini |
| Imagens / ComfyUI | RunComfy |
| Scraping | Apify |
| Email | Resend |
| Notificações | Telegram Bot |
| Deploy | Vercel |

---

## Iniciando um novo projeto a partir deste template

### Passo 1 — Crie o repositório

**Via GitHub CLI (recomendado):**
```bash
gh repo create nome-do-projeto --template rentoslo/zoomma-nextjs-template --private --clone
cd nome-do-projeto
```

**Ou manualmente:**
```bash
git clone https://github.com/rentoslo/zoomma-nextjs-template.git nome-do-projeto
cd nome-do-projeto
```

---

### Passo 2 — Configure o arquivo mestre de chaves (primeira vez apenas)

Este passo só precisa ser feito uma vez. Cria um arquivo central com suas chaves de API que será reaproveitado em todos os projetos.

Crie o arquivo `C:\Users\SEU_USUARIO\.env.master` com o seguinte conteúdo preenchido com suas chaves reais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-api03-...

# OpenAI (opcional)
OPENAI_API_KEY=sk-proj-...

# Google Gemini
GOOGLE_API_KEY=AIza...

# Apify
APIFY_API_TOKEN=apify_api_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@seudominio.com.br
RESEND_TO_EMAIL=voce@seudominio.com.br

# Telegram Bot
TELEGRAM_BOT_TOKEN=0000000000:AAH...
TELEGRAM_CHAT_ID=0000000000
```

Onde obter cada chave:

| Serviço | URL |
|---|---|
| Supabase | https://supabase.com/dashboard |
| Anthropic | https://console.anthropic.com/settings/keys |
| OpenAI | https://platform.openai.com/api-keys |
| Google Gemini | https://aistudio.google.com/app/apikey |
| Apify | https://console.apify.com/account/integrations |
| Resend | https://resend.com/api-keys |
| Telegram Bot | Abra o Telegram e fale com @BotFather |

---

### Passo 3 — Execute o script de setup

No terminal do projeto (PowerShell):

```powershell
.\setup-projeto.ps1
```

O script vai:
- Copiar suas chaves do `~\.env.master` para `.env.local` automaticamente
- Instalar todas as dependências npm
- Avisar se algo precisar de atenção

---

### Passo 4 — Atualize o CLAUDE.md

Abra o arquivo `CLAUDE.md` e substitua `[NOME DO PROJETO]` pelo nome real do projeto. Adicione contexto relevante: qual o objetivo, quem vai usar, qualquer particularidade.

---

### Passo 5 — Abra no Claude Code e comece a conversar

Abra o projeto no VS Code com a extensão Claude Code ativa e simplesmente comece a conversar:

> "Quero criar um sistema de agendamento para clientes"

O Claude vai te guiar por todo o processo — requisitos, arquitetura, implementação e deploy — usando os frameworks BMad e Spec-Kit que já estão instalados.

Você não precisa conhecer esses frameworks nem chamar nenhum comando especial. Basta conversar.

---

### Passo 6 — Inicie o servidor de desenvolvimento

```bash
npm run dev
# Acesse http://localhost:3000
```

---

## Estrutura de arquivos

```
src/
├── app/                    → Páginas e API Routes
│   ├── layout.tsx          → Layout raiz com fontes configuradas
│   ├── page.tsx            → Página inicial
│   └── globals.css         → Design tokens e estilos globais
├── components/
│   └── ui/                 → shadcn/ui (gerado com: npx shadcn add <component>)
├── lib/
│   ├── supabase/
│   │   ├── client.ts       → Supabase para browser
│   │   └── server.ts       → Supabase para servidor (service role)
│   ├── ai/
│   │   ├── anthropic.ts    → Cliente Anthropic Claude
│   │   └── openai.ts       → Cliente OpenAI GPT
│   ├── google/
│   │   └── client.ts       → Cliente Google Gemini
│   ├── runcomfy/
│   │   └── client.ts       → ComfyUI na nuvem (geração de imagens)
│   ├── apify/
│   │   └── client.ts       → Scraping via Apify
│   ├── resend/
│   │   └── client.ts       → Envio de emails
│   ├── telegram/
│   │   └── client.ts       → Notificações via Telegram
│   └── utils.ts            → Função cn() para Tailwind
└── types/                  → Interfaces TypeScript do projeto
```

---

## Frameworks de desenvolvimento com IA (já instalados)

Este template vem com três frameworks que o Claude usa automaticamente para guiar o desenvolvimento:

| Framework | Para que serve |
|---|---|
| **BMad Method** | Agentes especializados — PM, arquiteto, desenvolvedor, QA |
| **Spec-Kit** | Especificações formais que garantem que o que foi combinado foi entregue |
| **Antigravity Kit** | O mesmo fluxo funcionando no Google Gemini CLI |

Você não precisa interagir com eles diretamente. O Claude os utiliza nos momentos certos.

---

## Como usar os clientes de API

### Supabase
```typescript
import { createServiceClient } from '@/lib/supabase/server'
const supabase = createServiceClient()
const { data } = await supabase.from('tabela').select()
```

### Anthropic Claude
```typescript
import { getAI } from '@/lib/ai/anthropic'
const ai = getAI()
const response = await ai.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Olá!' }],
})
```

### Google Gemini
```typescript
import { getGemini } from '@/lib/google/client'
const genai = getGemini()
const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash' })
const result = await model.generateContent('Sua pergunta aqui')
const text = result.response.text()
```

### Resend (Email)
```typescript
import { sendEmail } from '@/lib/resend/client'
await sendEmail({
  subject: 'Novo lead!',
  html: '<h1>Chegou um novo lead.</h1>',
})
```

### Telegram (Notificações)
```typescript
import { sendTelegram } from '@/lib/telegram/client'
await sendTelegram({ text: '🔔 Novo evento detectado.' })
```

---

## Deploy no Vercel

1. Importe o repositório em https://vercel.com/new
2. Adicione as variáveis de ambiente (copie do `.env.local`)
3. A partir daí, cada `git push` no branch `main` faz deploy automático

---

## Design System

| Token | Cor | Uso |
|---|---|---|
| `#C9A050` | Gold | Cor primária, destaques |
| `#1C1C1E` | Charcoal | Fundo escuro |
| `#FAFAF8` | Off-white | Fundo claro |

Fontes: **Manrope** (títulos) + **Inter** (corpo)

```bash
# Adicionar componentes shadcn/ui
npx shadcn add button
npx shadcn add input
npx shadcn add card
```

---

*Template mantido pela Zoomma*
