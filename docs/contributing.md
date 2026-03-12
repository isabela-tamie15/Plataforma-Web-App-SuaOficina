# Guia de Contribuição — App SuaOficina

---

## Pré-requisitos

- **Node.js** ≥ 18
- **npm** ≥ 9
- Conta e projeto no **Supabase** (com schema aplicado)
- **Git**

---

## Setup do Projeto

### 1. Clonar o repositório

```bash
git clone <url-do-repositório>
cd "Plataforma Web App SuaOficina"
```

### 2. Configurar variáveis de ambiente

**Backend** — criar `backend/.env`:

```env
SUPABASE_URL=https://<seu-project>.supabase.co
SUPABASE_ANON_KEY=<sua-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<sua-service-role-key>
FRONTEND_URL=http://localhost:5173
PORT=3001
```

**Frontend** — criar `frontend/.env`:

```env
VITE_SUPABASE_URL=https://<seu-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<sua-anon-key>
```

### 3. Instalar dependências

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Preparar o banco de dados

Executar o schema no Supabase SQL Editor (copiar `database/schema.sql`) ou via script:

```bash
cd backend
node scripts/execute-schema.js
```

### 5. Popular dados de teste (seed)

```bash
cd backend
npm run seed
```

Cria:
- **Super Admin:** `superadmin@suaoficina.com` / `Super@123`
- **Oficina Admin:** `oficina@suaoficina.com` / `Oficina@123`
- Oficina de teste vinculada

### 6. Rodar o projeto

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

Roda na porta 3001 com hot-reload (`node --watch`).

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Roda na porta 5173 (Vite dev server).

### 7. Acesso

- Super Admin: `http://localhost:5173/super-admin/login`
- Oficina: `http://localhost:5173/oficina/login`

---

## Fluxo de Trabalho

### Branches

| Branch | Propósito |
|---|---|
| `main` | Produção estável |
| `develop` | Integração de features |
| `feature/<nome>` | Nova funcionalidade |
| `fix/<nome>` | Correção de bug |
| `docs/<nome>` | Documentação |

### Convenção de commits

Formato: `tipo(escopo): descrição`

```
feat(oficina): adicionar CRUD de clientes
fix(auth): corrigir token expirado não redirecionando
docs(spec): atualizar modelo de dados
refactor(backend): extrair validações para middleware
```

Tipos: `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`

### Pull Requests

1. Criar branch `feature/<nome>` a partir de `develop`
2. Implementar a mudança
3. Testar localmente (backend + frontend)
4. Abrir PR para `develop` com descrição clara
5. Solicitar code review

---

## Checklist Antes de Subir Código

- [ ] Código roda sem erros (`npm run dev` em ambos)
- [ ] Novas tabelas têm RLS habilitado com policies adequadas
- [ ] Validação dupla: frontend (UX) + backend (segurança)
- [ ] Variáveis de ambiente NÃO estão hardcoded no código
- [ ] Nomes de entidades seguem a convenção (português singular)
- [ ] Componentes React em `.jsx`, CSS em `index.css`
- [ ] Endpoints seguem o padrão de rotas segmentadas (`/api/admin/*`, `/api/oficina/*`, `/api/cliente/*`)
- [ ] Arquivo `.env` NÃO está sendo commitado

---

## Scripts Úteis

| Script | Comando | Onde |
|---|---|---|
| Dev backend | `npm run dev` | `/backend` |
| Dev frontend | `npm run dev` | `/frontend` |
| Seed | `npm run seed` | `/backend` |
| Executar schema | `node scripts/execute-schema.js` | `/backend` |
| Corrigir profiles | `node scripts/fix-profile.js` | `/backend` |
| Corrigir RLS | `node scripts/fix-rls-pg.js` | `/backend` |
| Build frontend | `npm run build` | `/frontend` |
| Lint frontend | `npm run lint` | `/frontend` |
