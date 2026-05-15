# Setup da Unificação zbeautysystem ↔ zoomma_automations

Este documento lista os **passos manuais** que você precisa executar para terminar a unificação. O código já foi gerado — falta a configuração do ambiente.

---

## Passo 1 — Rodar a migration no Supabase

A migration `005_zbeautysystem_unificacao.sql` cria as tabelas do SaaS, a função `my_tenant_id()`, RLS, função de bootstrap e trigger de subscription padrão.

**Opção A — Supabase CLI (recomendada):**
```bash
cd C:\github\zoomma_automations
supabase db push
```

**Opção B — SQL Editor do Supabase (manual):**
1. Abre o projeto `zoomma_automations` no [supabase.com/dashboard](https://supabase.com/dashboard)
2. Vai em **SQL Editor** → **New query**
3. Cola o conteúdo de `supabase/migrations/005_zbeautysystem_unificacao.sql`
4. Clica **Run**

**Validação:** depois de rodar, executa no SQL Editor para confirmar:
```sql
select table_name from information_schema.tables
where table_schema = 'public'
  and table_name in ('professionals','patient_profiles','salon_services','appointments','subscriptions');
-- Deve retornar 5 linhas

select count(*) from subscriptions;
-- Deve ser igual ao número de clientes existentes (backfill rodou)
```

---

## Passo 2 — Apontar zbeautysystem para o Supabase unificado

**No arquivo `C:\github\zbeautysystem\.env.local`:**

Copia os valores das mesmas chaves que estão em `C:\github\zoomma_automations\controller\.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=<mesma URL do zoomma_automations>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<mesma anon_key do zoomma_automations>
```

⚠️ **Não copia o `SUPABASE_SERVICE_ROLE_KEY`** — o zbeautysystem NUNCA pode ter essa chave. Se acidentalmente colocar, a segurança multi-tenant via RLS perde efeito.

---

## Passo 3 — Configurar URL de redirect no Supabase Auth

O convite (magic link) precisa saber para onde redirecionar o usuário.

1. No painel do Supabase do projeto unificado: **Authentication** → **URL Configuration**
2. Em **Site URL**, coloca a URL do zbeautysystem (ex: `https://zbeautysystem.vercel.app` em produção ou `http://localhost:3000` em dev)
3. Em **Redirect URLs**, adiciona:
   - `http://localhost:3000/auth/callback` (dev)
   - `https://<seu-dominio-zbeautysystem>/auth/callback` (produção)

---

## Passo 4 — Adicionar `ZBEAUTYSYSTEM_URL` no zoomma_automations

Para que o endpoint de convite saiba onde mandar o usuário depois do magic link:

**No arquivo `C:\github\zoomma_automations\controller\.env.local`:**
```env
ZBEAUTYSYSTEM_URL=http://localhost:3000   # ou a URL de produção do SaaS
```

E na Vercel, em **Settings → Environment Variables**, adiciona a mesma variável.

---

## Passo 5 — Testar o fluxo end-to-end

1. **No `zoomma_automations`** (`npm run dev` no controller):
   - Acessa `/clientes/<id>` de um cliente real
   - Clica em **"Gerar convite (SaaS)"**
   - Coloca um e-mail teste, escolhe papel **Dono**, envia

2. **No e-mail do convidado**:
   - Chega um e-mail do Supabase com link "Accept the invite"
   - Clica no link
   - É redirecionado para `<zbeautysystem>/auth/callback?code=...`
   - O callback troca o código por sessão, chama `bootstrap_professional_from_invite()` e redireciona para `/dashboard`

3. **No SQL Editor do Supabase**, valida:
   ```sql
   select id, tenant_id, auth_user_id, name, email, role from professionals
   where email = '<email-do-teste>';
   -- Deve retornar 1 linha com role = 'owner'
   ```

---

## ⚠️ O que ainda quebra (próxima iteração)

Os arquivos abaixo no `zbeautysystem` referenciam tabelas/colunas do schema antigo (português) e vão **quebrar** quando o usuário acessar essas telas. **Não foi escopo desta implementação** corrigi-las — elas precisam ser refatoradas para o schema unificado em uma próxima rodada.

| Página | Tabela/coluna antiga | Tabela/coluna nova |
|---|---|---|
| `src/app/dashboard/agenda/page.tsx` | `agendamentos` | `appointments` |
| `src/app/dashboard/agenda/AgendaModal.tsx` | `clientes_finais` | `patient_profiles` |
| `src/app/dashboard/agenda/AgendaModal.tsx` | `procedimentos` (`duracao_minutos`, `ativo`) | `salon_services` (`duration_minutes`, `active`) |
| `src/app/dashboard/clientes/page.tsx` | `clientes_finais` (`nome`, `telefone`, `data_nascimento`, `genero`) | `patient_profiles` (`name`, `phone`, `birth_date`, ⚠️ sem `genero`) |
| `src/app/dashboard/procedimentos/page.tsx` | `procedimentos` (`nome`, `preco`, `duracao_minutos`, `ativo`) | `salon_services` (`name`, `price`, `duration_minutes`, `active`) |
| Todas usam `cliente_sistema_id` | `cliente_sistema_id` | `tenant_id` |

**Gaps de schema notados:**
- Coluna `genero` em pacientes — não está no schema novo. Decidir se adicionar.
- Coluna `deleted_at` em pacientes — não está no schema novo (o antigo usava soft delete).

**Estratégia recomendada:** refatorar uma página por vez, começando por `clientes/page.tsx` (mais usada). Cada refatoração vira um commit isolado.

---

## Resumo do que foi entregue

### `zoomma_automations`
- ✅ Migration `005_zbeautysystem_unificacao.sql` — 5 tabelas + RLS + bootstrap + trigger
- ✅ API route `POST /api/clients/[id]/invite` — gera convite Supabase Auth
- ✅ Botão **"Gerar convite (SaaS)"** na página `/clientes/[id]`
- ✅ Variável `ZBEAUTYSYSTEM_URL` esperada no `.env.local`

### `zbeautysystem`
- ✅ `src/lib/auth-context.tsx` refatorado para schema unificado (clients, professionals, subscriptions) + helper `hasFeature()`
- ✅ `src/app/auth/callback/route.ts` — recebe magic link, chama bootstrap, redireciona
- ✅ `src/middleware.ts` — middleware root que libera `/auth/callback` da checagem de sessão
- ✅ `src/app/(auth)/login/page.tsx` — refatorado para invite-only (sem signup)

### Documentos
- ✅ `docs/zbeautysystem-unificacao-arquitetura.md` — decisões arquiteturais
- ✅ `docs/zbeautysystem-unificacao-setup.md` — este passo a passo
