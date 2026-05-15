# Arquitetura — Ecossistema Unificado Zoomma

**Status:** Aprovado para implementação  
**Data:** 2026-05-14  
**Autor:** Winston (System Architect)  
**Revisão:** Zoomma_Dev

---

## Visão geral

Um único banco de dados Supabase serve dois aplicativos com responsabilidades distintas:

```
Um único Supabase
│
├── zoomma_automations  (painel interno — chave admin, vê tudo)
│   └── Zoomma: gerencia clientes, briefing, marca, IA, knowledge base
│
└── zbeautysystem       (SaaS — chave anon + Auth, vê só o seu)
    └── Salão: profissionais, agenda, clientes finais, serviços
```

**Regra de ouro:** `zbeautysystem` NUNCA usa a chave de serviço (service_role_key). O RLS do Supabase garante o isolamento. `zoomma_automations` usa a chave admin e enxerga tudo — exatamente como hoje.

---

## Decisão 1 — Multi-profissional: tabela `professionals`

O salão pode ter um ou vários profissionais, cada um com seu próprio login. Por isso, o vínculo com o Supabase Auth NÃO fica em `clients` — fica em uma tabela intermediária.

```
clients (o salão = tenant)
  └── professionals (as pessoas que trabalham lá, cada uma com login)
        └── appointments (quem atendeu o quê)
```

### Schema

```sql
CREATE TABLE professionals (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  auth_user_id  uuid REFERENCES auth.users(id) UNIQUE,
  name          text NOT NULL,
  email         text,
  phone         text,
  role          text DEFAULT 'professional'
                CHECK (role IN ('owner', 'professional', 'receptionist')),
  active        boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);
```

**Por que `role`?**  
O dono (owner) pode gerenciar configurações e ver relatórios consolidados. Profissional vê só sua agenda. Recepcionista gerencia agenda de todos. Para o MVP, o app verifica o role — não precisamos de RLS separado por role ainda.

---

## Decisão 2 — Tabelas do SaaS

Todas com `tenant_id` para isolamento multi-tenant.

```sql
-- Clientes finais do salão (pacientes, clientes da esteticista)
CREATE TABLE patient_profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name        text NOT NULL,
  phone       text,
  email       text,
  birth_date  date,
  notes       text,
  created_at  timestamptz DEFAULT now()
);

-- Serviços/procedimentos que o salão oferece
CREATE TABLE salon_services (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name             text NOT NULL,
  duration_minutes int,
  price            numeric(10,2),
  category         text,
  active           boolean DEFAULT true,
  created_at       timestamptz DEFAULT now()
);

-- Agendamentos
CREATE TABLE appointments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  patient_id       uuid REFERENCES patient_profiles(id),
  service_id       uuid REFERENCES salon_services(id),
  professional_id  uuid REFERENCES professionals(id),
  scheduled_at     timestamptz NOT NULL,
  duration_minutes int,
  status           text DEFAULT 'scheduled'
                   CHECK (status IN ('scheduled','confirmed','completed','cancelled','no_show')),
  notes            text,
  created_at       timestamptz DEFAULT now()
);
```

---

## Decisão 3 — Subscriptions (planos e feature flags)

Uma tabela própria, já preparada para integração com Stripe no futuro.

```sql
CREATE TABLE subscriptions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id               uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
  plan                    text NOT NULL DEFAULT 'starter'
                          CHECK (plan IN ('starter', 'pro', 'enterprise')),
  status                  text NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'trialing', 'cancelled', 'past_due')),
  trial_ends_at           timestamptz,
  current_period_end      timestamptz,
  -- overrides por tenant (null = usa os padrões do plano)
  feature_overrides       jsonb DEFAULT '{}',
  -- preparado para Stripe (preenchido quando integrar)
  stripe_subscription_id  text,
  stripe_customer_id      text,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);
```

### O que cada plano inclui (padrão)

| Feature key         | Starter | Pro |
|---------------------|---------|-----|
| `agenda`            | ✅      | ✅  |
| `patient_profiles`  | ✅      | ✅  |
| `salon_services`   | ✅      | ✅  |
| `brand_library`     | ❌      | ✅  |
| `knowledge_base`    | ❌      | ✅  |
| `ai_agents`         | ❌      | ✅  |

### Como o app verifica o plano

```ts
const PLAN_FEATURES: Record<string, string[]> = {
  starter: ['agenda', 'patient_profiles', 'salon_services'],
  pro:     ['agenda', 'patient_profiles', 'salon_services',
             'brand_library', 'knowledge_base', 'ai_agents'],
}

function hasFeature(subscription: Subscription, feature: string): boolean {
  // Override por tenant tem prioridade (útil para trials parciais)
  if (subscription.feature_overrides?.[feature] !== undefined) {
    return Boolean(subscription.feature_overrides[feature])
  }
  return PLAN_FEATURES[subscription.plan]?.includes(feature) ?? false
}
```

O `feature_overrides` permite dar acesso a uma feature específica para um cliente no plano Starter sem precisar mudar o plano — útil para trials e exceções comerciais.

---

## Decisão 4 — RLS (isolamento por tenant)

### Função auxiliar (base de tudo)

```sql
-- Retorna o tenant_id do profissional logado
CREATE OR REPLACE FUNCTION my_tenant_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT tenant_id FROM professionals WHERE auth_user_id = auth.uid()
$$;
```

### Políticas (mesmo padrão em todas as tabelas do SaaS)

```sql
-- professionals
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_only" ON professionals
  USING (tenant_id = my_tenant_id());

-- patient_profiles
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_only" ON patient_profiles
  USING (tenant_id = my_tenant_id());

-- salon_services
ALTER TABLE salon_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_only" ON salon_services
  USING (tenant_id = my_tenant_id());

-- appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_only" ON appointments
  USING (tenant_id = my_tenant_id());

-- subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_only" ON subscriptions
  USING (tenant_id = my_tenant_id());
```

`zoomma_automations` usa `service_role_key` → RLS é ignorado automaticamente → Zoomma vê tudo. Zero mudança no comportamento atual.

---

## Decisão 5 — Fluxo de onboarding (invite-only)

```
1. Zoomma adiciona cliente no zoomma_automations (já feito hoje)
   → cria registro em `clients`

2. Zoomma clica "Gerar convite" na página do cliente
   → chama Supabase Admin API: supabase.auth.admin.inviteUserByEmail(email)
   → o dono do salão recebe email com link

3. Dono clica no link → cria senha → entra no zbeautysystem

4. No primeiro acesso, o app detecta que não existe entrada em `professionals`
   → cria automaticamente:
      INSERT INTO professionals (tenant_id, auth_user_id, name, email, role)
      VALUES (<client_id_do_convite>, auth.uid(), ..., 'owner')

5. Dono pode então convidar funcionários pelo app
   → mesmo fluxo, mas com role = 'professional'
```

**Como o app sabe qual `client_id` usar no passo 4?**  
O convite é gerado com metadata: `supabase.auth.admin.inviteUserByEmail(email, { data: { tenant_id: client.id } })`. O `auth.users.raw_user_meta_data` guarda esse valor e o app lê no primeiro acesso.

---

## Decisão 6 — Coexistência dos dois apps

| | zoomma_automations | zbeautysystem |
|---|---|---|
| Chave Supabase | `service_role_key` (admin) | `anon_key` (público) |
| Auth | sem login (interno) | Supabase Auth (cada profissional) |
| RLS | ignorado (vê tudo) | ativo (vê só o seu) |
| Tabelas que usa | clients, briefings, brand_library, knowledge_articles, decision_inbox, tasks | professionals, patient_profiles, salon_services, appointments, subscriptions |
| Tabelas compartilhadas | clients, brand_library, knowledge_articles | clients (read-only via my_tenant_id) |

---

## Mapa de tabelas completo (banco unificado)

```
── Existentes (zoomma_automations) ──────────────────────────
  clients              → tenants (salões/esteticistas)
  briefings            → briefing do cliente para a Zoomma
  brand_library        → blocos de identidade de marca
  knowledge_articles   → base de conhecimento de beleza
  brand_knowledge_links → links marca ↔ conhecimento
  decision_inbox       → caixa de validação humana
  tasks                → comunicação entre agentes
  users                → usuários internos da Zoomma

── Novas (zbeautysystem) ────────────────────────────────────
  professionals        → profissionais do salão (login)
  patient_profiles     → clientes finais do salão
  salon_services      → serviços/procedimentos oferecidos
  appointments         → agendamentos
  subscriptions        → plano e feature flags por tenant
```

---

## Passos de implementação (em ordem)

### Passo 1 — Migration SQL (zoomma_automations/supabase/migrations/)
Criar arquivo `004_zbeautysystem_unificacao.sql` com:
- Tabela `professionals`
- Tabela `patient_profiles`
- Tabela `salon_services`
- Tabela `appointments`
- Tabela `subscriptions`
- Função `my_tenant_id()`
- Políticas RLS em todas as tabelas novas

### Passo 2 — Variáveis de ambiente no zbeautysystem
Substituir `.env.local` do `zbeautysystem` para apontar ao Supabase do `zoomma_automations`:
```env
NEXT_PUBLIC_SUPABASE_URL=<mesma URL do zoomma_automations>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<mesma anon_key do zoomma_automations>
```

### Passo 3 — Cliente Supabase no zbeautysystem
Adaptar `src/lib/supabase.ts` para usar o padrão SSR do `@supabase/ssr` (igual ao zoomma_automations). O projeto já tem `@supabase/ssr` na dependência.

### Passo 4 — Botão "Gerar convite" no zoomma_automations
Na página `/clientes/[id]`, adicionar botão que chama a Admin API do Supabase para enviar invite por email.

### Passo 5 — Middleware de primeiro acesso no zbeautysystem
Detectar usuário sem entrada em `professionals` e criar automaticamente com `role = 'owner'` usando o `tenant_id` do metadata do convite.

---

## O que NÃO fazer agora

- Não implementar self-service signup (invite-only é suficiente para MVP)
- Não integrar Stripe (campos já estão na tabela, implementar depois)
- Não criar RLS por role dentro do tenant (app-level é suficiente para MVP)
- Não mesclar os repositórios (dois repos separados é a decisão correta)
