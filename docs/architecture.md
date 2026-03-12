# Visão da Arquitetura — App SuaOficina

---

## Diagrama Geral

```mermaid
graph TB
    subgraph Frontend["Frontend — React + Vite"]
        SA["Super Admin Panel<br/>/super-admin/*"]
        OF["Oficina Panel<br/>/oficina/*"]
        CL["Cliente Panel<br/>/cliente/*"]
        AUTH_CTX["AuthContext<br/>(Supabase Auth)"]
        PR["ProtectedRoute<br/>(role guard)"]
    end

    subgraph Backend["Backend — Node.js + Express"]
        API_AUTH["/api/auth<br/>login | me | logout"]
        MW_AUTH["authMiddleware<br/>(JWT verify)"]
        MW_ROLE["roleMiddleware<br/>(role check)"]
        API_ADMIN["/api/admin/*<br/>[PLANEJADO]"]
        API_OFICINA["/api/oficina/*<br/>[PLANEJADO]"]
        API_CLIENTE["/api/cliente/*<br/>[PLANEJADO]"]
    end

    subgraph Supabase["Supabase (PostgreSQL Gerenciado)"]
        DB["PostgreSQL"]
        SB_AUTH["Supabase Auth<br/>(JWT tokens)"]
        RLS["Row-Level Security<br/>get_my_role()<br/>get_my_oficina_id()"]
        STORAGE["Storage<br/>[PLANEJADO]"]
    end

    SA & OF & CL --> AUTH_CTX
    AUTH_CTX -->|"signInWithPassword<br/>anon key"| SB_AUTH
    SA & OF & CL -->|"Bearer token"| API_AUTH
    API_AUTH --> MW_AUTH
    MW_AUTH -->|"getUser(token)"| SB_AUTH
    MW_AUTH --> MW_ROLE
    MW_ROLE --> API_ADMIN & API_OFICINA & API_CLIENTE
    API_AUTH & API_ADMIN & API_OFICINA & API_CLIENTE -->|"service_role key"| DB
    DB --- RLS
```

---

## Decisões de Design

### 1. Frontend direto no Supabase Auth (dual-path)

O frontend autentica diretamente via Supabase Auth (`signInWithPassword`) e armazena a sessão/token localmente. Para rotas protegidas do backend, o token JWT é enviado no header `Authorization: Bearer <token>`. O backend valida o token com `supabaseAdmin.auth.getUser(token)`.

**Por que:** Simplifica o fluxo de autenticação, permite persistência de sessão automática do Supabase, e o backend autoriza independentemente com o mesmo token.

### 2. Dois clients Supabase no backend

- `supabaseAdmin` — com `service_role_key` para operações administrativas (bypass RLS)
- `supabaseAnon` — com `anon_key` para operações com contexto do usuário

**Por que:** O `service_role` permite CRUD irrestrito (necessário para seed, fix scripts, e operações admin). O `anon_key` permite testar a perspectiva do usuário.

### 3. RLS com SECURITY DEFINER functions

As funções `get_my_role()` e `get_my_oficina_id()` são `SECURITY DEFINER`, consultando `profiles` diretamente sem passar pela RLS. As policies então chamam essas funções.

**Por que:** Evita recursão infinita. Sem `SECURITY DEFINER`, uma policy em `profiles` que consulta `profiles` causa loop.

### 4. CSS Design System monolítico

Todo o CSS está em um único arquivo `index.css` com CSS variables, sem frameworks CSS.

**Por que:** Controle total sobre o design, sem dependências externas, performance superior (sem overhead de framework CSS), e o projeto é pequeno o suficiente para manter tudo em um arquivo.

### 5. Layouts por perfil no App.jsx

Cada perfil (Super Admin, Oficina) tem seu componente de layout que define menu items e renderiza `<Routes>` internas.

**Por que:** Isolamento visual e navegacional entre perfis. Facilita adicionar rotas específicas por perfil sem poluir o roteamento global.

---

## Integrações e Dependências Externas

| Serviço | Uso | Tipo |
|---|---|---|
| **Supabase** | Banco de dados, autenticação, storage (futuro) | BaaS |
| **Google Fonts (Inter)** | Tipografia do design system | CDN |

### Dependências Backend

| Pacote | Uso |
|---|---|
| `express` | Framework HTTP |
| `@supabase/supabase-js` | Client Supabase |
| `cors` | CORS middleware |
| `dotenv` | Variáveis de ambiente |
| `pg` | PostgreSQL client direto (scripts) |
| `bcryptjs` | Hashing (instalado, ainda não usado) |
| `jsonwebtoken` | JWT (instalado, ainda não usado — auth via Supabase) |

### Dependências Frontend

| Pacote | Uso |
|---|---|
| `react` + `react-dom` | Framework UI |
| `react-router-dom` | Roteamento SPA |
| `@supabase/supabase-js` | Client Supabase Auth |
| `vite` + `@vitejs/plugin-react` | Build + dev server |

---

## Variáveis de Ambiente

### Backend (`.env`)

```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### Frontend (`.env`)

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<anon_key>
```
