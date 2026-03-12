# spec.md — Especificação Técnica Completa | App SuaOficina

---

## 1. Visão Geral

**Nome:** App SuaOficina  
**Tipo:** Aplicação web SaaS (MVP) — mobile planejado para versões futuras  
**Status:** Em desenvolvimento (Fase 1 — Autenticação e Dashboard)

### O que é

Plataforma de gestão digital para pequenas oficinas mecânicas. Substitui controles manuais (cadernos, papéis, anotações) por um sistema digital estruturado, acessível via navegador em desktop e celular.

### Problema que resolve

Pequenas oficinas mecânicas operam com baixo nível de digitalização. O controle via papel é suscetível a:

- Perda ou dano de ordens de serviço
- Falhas humanas no registro
- Dificuldade em localizar histórico de serviços
- Ausência de ferramentas específicas para o setor

### Público-alvo

| Perfil | Quem é | Acesso |
|---|---|---|
| **Super Admin** | Equipe da empresa SuaOficina | Controle total da plataforma, gestão de oficinas, configurações globais |
| **Oficina (Primário)** | Donos, gerentes, mecânicos, atendentes | CRUD completo de clientes, veículos e OS dentro da própria oficina |
| **Cliente (Secundário)** | Clientes das oficinas | Consulta somente-leitura ao histórico de seus veículos |

### Diferencial

Idealizado por profissional com mais de uma década de experiência no setor automotivo, com formação em Administração e Engenharia de Software. Solução pensada de dentro para fora do negócio.

---

## 2. Objetivos e Escopo

### Dentro do escopo — MVP (v1)

- **Super Admin:** cadastro e gestão de oficinas, dashboard geral, configurações globais, gestão de admins
- **Oficina:** cadastro de clientes/veículos, ordens de serviço, checklists, peças/serviços, certificados de garantia, agenda do dia, histórico, lembretes
- **Cliente:** histórico de OS, peças, garantias, checklists, lembretes, busca por oficinas

### Fora do escopo (versões futuras)

- Controle de estoque de peças
- Relatórios de desempenho e indicadores de gestão
- Integração com sistemas financeiros e meios de pagamento
- Notificações automáticas de manutenção preventiva
- Sistema de avaliação de oficinas
- Aplicativo mobile nativo (React Native)

---

## 3. Funcionalidades por Prioridade

### Super Admin

| # | Funcionalidade | Status |
|---|---|---|
| 1 | Login exclusivo com credenciais da empresa | ✅ Implementado |
| 2 | Dashboard geral (métricas consolidadas) | ✅ Implementado (estático) |
| 3 | Cadastro de novas oficinas | ✅ Implementado |
| 4 | Listagem e gestão de oficinas (ativar/desativar) | ✅ Implementado |
| 5 | Visualização de dados por oficina | ❌ Não iniciado |
| 6 | Configurações globais do app | ❌ Não iniciado |
| 7 | Gestão de usuários administradores | ❌ Não iniciado |

### Oficina

| # | Funcionalidade | Status |
|---|---|---|
| 1 | Login de usuários da oficina | ✅ Implementado |
| 2 | Dashboard da oficina | ✅ Implementado (estático) |
| 3 | Cadastro de clientes | ❌ Não iniciado |
| 4 | Cadastro de veículos vinculados ao cliente | ❌ Não iniciado |
| 5 | Abertura de ordens de serviço | ❌ Não iniciado |
| 6 | Agenda do dia (OS por prioridade de entrega) | ❌ Não iniciado |
| 7 | Checklists de inspeção | ❌ Não iniciado |
| 8 | Peças e serviços na OS | ❌ Não iniciado |
| 9 | Certificados de garantia | ❌ Não iniciado |
| 10 | Histórico de OS finalizadas | ❌ Não iniciado |
| 11 | Envio de lembretes de manutenção | ❌ Não iniciado |

### Cliente

| # | Funcionalidade | Status |
|---|---|---|
| 1 | Histórico de OS compartilhadas | ❌ Não iniciado |
| 2 | Visualização de peças instaladas | ❌ Não iniciado |
| 3 | Consulta de certificados de garantia | ❌ Não iniciado |
| 4 | Checklists realizados | ❌ Não iniciado |
| 5 | Recebimento de lembretes | ❌ Não iniciado |
| 6 | Busca por oficinas | ❌ Não iniciado |
| 7 | Abertura de OS independente | ❌ Não iniciado |

---

## 4. Arquitetura Técnica

### Visão geral das camadas

```
╔═══════════════════════════════════════════════════════════════╗
║                    CAMADA DE APRESENTAÇÃO                     ║
║                      React + Vite (Web)                       ║
║                                                               ║
║  ┌───────────────┐  ┌────────────────┐  ┌───────────────┐    ║
║  │  SUPER ADMIN  │  │    OFICINA     │  │   CLIENTE     │    ║
║  │ /super-admin  │  │  /oficina      │  │  /cliente     │    ║
║  └───────┬───────┘  └───────┬────────┘  └──────┬────────┘    ║
╚══════════╪══════════════════╪═══════════════════╪════════════╝
           │                  │                   │
╔══════════╪══════════════════╪═══════════════════╪════════════╗
║          └──────────────────┼───────────────────┘            ║
║                             ▼                                 ║
║           CAMADA DE LÓGICA — Node.js + Express                ║
║                                                               ║
║  · Autenticação via Supabase Auth (JWT)                       ║
║  · Controle de acesso por role                                ║
║  · API REST segmentada: /api/admin, /api/oficina, /api/cliente║
╚═════════════════════════════╪════════════════════════════════╝
                              │
╔═════════════════════════════╪════════════════════════════════╗
║                             ▼                                 ║
║              CAMADA DE DADOS — Supabase                       ║
║                                                               ║
║  · PostgreSQL gerenciado                                      ║
║  · Row-Level Security (RLS) com SECURITY DEFINER functions    ║
║  · Supabase Auth — gestão de usuários e sessões               ║
║  · Storage — arquivos (checklists, certificados)              ║
╚══════════════════════════════════════════════════════════════╝
```

### Perfis de acesso (roles)

| Role | Quem | Escopo | Capacidades |
|---|---|---|---|
| `super_admin` | Equipe SuaOficina | Plataforma inteira | Leitura total; cadastro/desativação de oficinas; configurações globais |
| `oficina_admin` | Dono / gerente | Própria oficina | CRUD completo da oficina |
| `oficina_user` | Mecânico / atendente | Própria oficina | Operacional: OS, checklist, clientes, veículos |
| `cliente` | Cliente final | Dados compartilhados | Somente leitura |

### Stack (MVP — Web)

| Camada | Tecnologia | Versão |
|---|---|---|
| Frontend | React + Vite | React 19, Vite 7 |
| Roteamento | react-router-dom | v7 |
| Backend | Node.js + Express | Express 4 |
| Banco de dados | Supabase (PostgreSQL) | — |
| Autenticação | Supabase Auth (JWT) | — |
| API | REST (segmentada por perfil) | — |
| CSS | Vanilla CSS (Design System custom) | — |
| Tipografia | Google Fonts (Inter) | — |

### Estrutura de pastas

```
Plataforma Web App SuaOficina/
├── spec.md
├── context_ai.md
├── docs/
│   ├── architecture.md
│   ├── contributing.md
│   ├── roadmap.md
│   ├── adr/
│   └── contracts/
├── database/
│   └── schema.sql                  ← Schema v1 (oficinas, profiles, RLS)
├── backend/
│   ├── server.js                   ← Entry point Express
│   ├── package.json
│   ├── .env
│   ├── scripts/
│   │   ├── seed.js                 ← Seed de usuários e oficina de teste
│   │   ├── execute-schema.js       ← Executa schema.sql via pg direto
│   │   ├── fix-profile.js          ← Corrige perfis faltantes
│   │   ├── fix-rls.js              ← Corrige RLS (via Supabase client)
│   │   └── fix-rls-pg.js           ← Corrige RLS (via pg direto)
│   └── src/
│       ├── config/
│       │   └── supabase.js         ← Clients supabaseAdmin + supabaseAnon
│       ├── controllers/
│       │   └── authController.js   ← login, me, logout
│       ├── middleware/
│       │   ├── auth.js             ← Verifica JWT + carrega profile
│       │   └── role.js             ← Autorização por role
│       └── routes/
│           └── auth.js             ← POST /login, GET /me, POST /logout
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env
    └── src/
        ├── main.jsx                ← Entry point React
        ├── App.jsx                 ← Rotas, layouts Super Admin e Oficina
        ├── index.css               ← Design System completo (921 linhas)
        ├── lib/
        │   └── supabase.js         ← Client Supabase (anon key)
        ├── contexts/
        │   └── AuthContext.jsx     ← Provider de autenticação global
        ├── components/
        │   ├── ProtectedRoute.jsx  ← Guard de rota por role
        │   └── Layout/
        │       ├── DashboardLayout.jsx
        │       ├── Sidebar.jsx
        │       └── TopBar.jsx
        └── pages/
            ├── super-admin/
            │   ├── Login.jsx
            │   └── Dashboard.jsx
            └── oficina/
                ├── Login.jsx
                └── Dashboard.jsx
```

---

## 5. Modelo de Dados

### Schema atual (Fase 1)

```
profiles (extends auth.users)                oficinas
┌──────────────────────────────┐            ┌──────────────────────────┐
│ id (PK, FK → auth.users)    │            │ id (UUID, PK)            │
│ email (VARCHAR)              │────────────│ nome (VARCHAR)           │
│ nome (VARCHAR)               │ oficina_id │ cnpj (VARCHAR)           │
│ role (user_role ENUM)        │            │ endereco (TEXT)          │
│ oficina_id (FK → oficinas)   │            │ telefone (VARCHAR)       │
│ telefone (VARCHAR)           │            │ email (VARCHAR)          │
│ avatar_url (TEXT)            │            │ responsavel (VARCHAR)    │
│ created_at / updated_at     │            │ status ('ativa'|'inativa')│
└──────────────────────────────┘            │ created_at / updated_at │
                                             └──────────────────────────┘
```

**Enum `user_role`:** `super_admin` | `oficina_admin` | `oficina_user` | `cliente`

### Entidades planejadas (próximas fases)

```
Cliente (1) ──── (N) Veículo
Veículo  (1) ──── (N) Ordem de Serviço
Ordem de Serviço (1) ──── (1) Checklist
Ordem de Serviço (1) ──── (N) Peças e Serviços
Ordem de Serviço (1) ──── (N) Certificados de Garantia
```

| Entidade | Campos-chave |
|---|---|
| **Cliente** | nome, telefone, email, CPF/CNPJ, endereço, data_cadastro |
| **Veículo** | placa, marca, modelo, ano, motor, km_atual, combustível, cliente_id |
| **Ordem de Serviço** | numero_os, data_abertura, previsão_entrega, status (aberta/em_andamento/finalizada), descrição, valor_total, veiculo_id |
| **Checklist** | data, itens_verificados, condição, observações, os_id |
| **Peças/Serviços** | nome, quantidade, valor_unitário, valor_total, os_id |
| **Certificado Garantia** | peça, data_instalação, prazo_garantia, fornecedor, os_id |

---

## 6. Fluxos de Usuário

### Fluxo 1 — Super Admin: onboarding de oficina

```
Login → Dashboard → Oficinas → Nova Oficina
→ Preenche dados + credenciais → Salva
→ Oficina criada com status "ativa" → Acesso imediato
```

### Fluxo 2 — Super Admin: monitoramento

```
Dashboard geral → Navega para oficina (leitura)
→ Pode desativar oficina (perde acesso, dados preservados)
→ Configurações globais → Refletem em todas as oficinas
```

### Fluxo 3 — Oficina: atendimento completo

```
Login → Dashboard/Agenda → Novo atendimento:
  1. Cadastra cliente (se novo)
  2. Cadastra veículo (se novo) → vincula ao cliente
  3. Abre OS → descrição, previsão, observações
  4. Checklist obrigatório na abertura
  5. Registra peças/serviços durante execução
  6. [Opcional] Emite certificado de garantia
  7. Finaliza OS → move para Histórico (imutável)
  8. [Opcional] Envia lembrete de manutenção
```

### Fluxo 4 — Cliente: consulta

```
Login → Meus veículos → Histórico de OS
→ Detalhes: peças, checklist, certificados
→ Recebe lembretes → [Opcional] Busca outras oficinas
```

---

## 7. Regras de Negócio

### Super Admin
- Único perfil que cadastra e desativa oficinas
- Oficina desativada perde acesso; dados preservados
- Visibilidade total, sem edição operacional
- Configurações globais aplicam imediatamente
- Deve existir ao menos 1 super_admin ativo

### Oficina
- Cliente pode ter N veículos
- OS vinculada a veículo específico (e consequentemente a cliente)
- Agenda do Dia: apenas OS `aberta` ou `em_andamento`
- OS finalizada → Histórico (imutável, não editável)
- Checklist obrigatório na abertura de OS
- Certificados vinculados à OS da peça
- Número da OS sequencial e único por oficina

### Cliente
- Acesso apenas ao histórico compartilhado pela oficina
- Lembretes recebidos passivamente

---

## 8. Requisitos Não Funcionais

| Requisito | Descrição |
|---|---|
| Usabilidade | Interface simples para profissionais sem perfil técnico |
| Disponibilidade | Acesso contínuo sem janelas de manutenção |
| Segurança | Dados sensíveis (CPF, CNPJ) protegidos; RLS no banco |
| Performance | Listagens e histórico com acesso rápido |
| Responsividade | Web desktop e mobile (CSS responsivo) |

---

## 9. Convenções e Padrões

### Nomenclatura
- Entidades no singular em português: `cliente`, `veiculo`, `ordem_servico`
- Campos de data: `ISO 8601 (YYYY-MM-DD)`
- Status de OS: enum `aberta` | `em_andamento` | `finalizada`
- IDs: UUIDs (Supabase `gen_random_uuid()`)

### Código
- **ES Modules** (`"type": "module"` em ambos package.json)
- Frontend: componentes `.jsx`, CSS em arquivo único (`index.css`)
- Backend: controllers, middleware, routes em pastas separadas
- Validação dupla: frontend (UX) + backend (segurança)
- Versionamento com Git

### Fluxo de desenvolvimento

1. Modelagem e criação do banco no Supabase (com roles e RLS)
2. Desenvolvimento do backend (API Node.js + Express)
3. Desenvolvimento do painel Super Admin (React)
4. Desenvolvimento da versão Oficina (React)
5. Testes e validação com usuários reais
6. Desenvolvimento da versão Cliente
7. Mobile (React Native) — futuro
