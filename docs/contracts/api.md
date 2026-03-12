# Contratos de API — App SuaOficina

---

## Base URL

```
http://localhost:3001/api
```

## Autenticação

Rotas protegidas exigem header:

```
Authorization: Bearer <supabase_jwt_token>
```

---

## Auth (`/api/auth`)

### `POST /api/auth/login`

Autentica usuário com email e senha.

**Request:**

```json
{
  "email": "superadmin@suaoficina.com",
  "password": "Super@123"
}
```

**Response 200:**

```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "uuid-do-usuario",
    "email": "superadmin@suaoficina.com",
    "nome": "Admin SuaOficina",
    "role": "super_admin",
    "oficina_id": null
  },
  "session": {
    "access_token": "eyJhbGciOi...",
    "refresh_token": "abc123...",
    "expires_at": 1709913600
  }
}
```

**Erros:**

| Status | Corpo | Quando |
|---|---|---|
| 400 | `{ "error": "Email e senha são obrigatórios" }` | Campos faltantes |
| 401 | `{ "error": "Credenciais inválidas", "details": "..." }` | Email/senha incorretos |
| 404 | `{ "error": "Perfil do usuário não encontrado..." }` | Auth OK mas sem profile |
| 500 | `{ "error": "Erro interno no servidor" }` | Exceção inesperada |

---

### `GET /api/auth/me` 🔒

Retorna dados do usuário autenticado.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "user": {
    "id": "uuid-do-usuario",
    "email": "superadmin@suaoficina.com",
    "nome": "Admin SuaOficina",
    "role": "super_admin",
    "oficina_id": null,
    "avatar_url": null
  }
}
```

**Erros:**

| Status | Corpo | Quando |
|---|---|---|
| 401 | `{ "error": "Token de autenticação não fornecido" }` | Sem header Authorization |
| 401 | `{ "error": "Token inválido ou expirado" }` | JWT inválido |
| 401 | `{ "error": "Perfil do usuário não encontrado" }` | Token OK mas sem profile |

---

### `POST /api/auth/logout` 🔒

Invalida a sessão no servidor (frontend limpa o token local).

**Headers:** `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "message": "Logout realizado com sucesso"
}
```

---

### `GET /api/health`

Health check do servidor.

**Response 200:**

```json
{
  "status": "ok",
  "timestamp": "2026-03-09T19:00:00.000Z"
}
```

---

## Schemas de Dados

### User Role (enum)

```
"super_admin" | "oficina_admin" | "oficina_user" | "cliente"
```

### Oficina

```json
{
  "id": "uuid",
  "nome": "string",
  "cnpj": "string | null",
  "endereco": "string | null",
  "telefone": "string | null",
  "email": "string | null",
  "responsavel": "string | null",
  "status": "ativa | inativa",
  "created_at": "ISO 8601",
  "updated_at": "ISO 8601"
}
```

### Profile

```json
{
  "id": "uuid (= auth.users.id)",
  "email": "string",
  "nome": "string",
  "role": "user_role",
  "oficina_id": "uuid | null",
  "telefone": "string | null",
  "avatar_url": "string | null",
  "created_at": "ISO 8601",
  "updated_at": "ISO 8601"
}
```

---

## Endpoints Planejados

### Admin (`/api/admin`) — Super Admin only

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/admin/oficinas` | Listar todas as oficinas |
| `POST` | `/api/admin/oficinas` | Cadastrar nova oficina |
| `GET` | `/api/admin/oficinas/:id` | Detalhes de uma oficina |
| `PUT` | `/api/admin/oficinas/:id` | Atualizar oficina (incluindo desativar) |
| `GET` | `/api/admin/dashboard` | Métricas consolidadas |
| `GET` | `/api/admin/users` | Listar admins |
| `POST` | `/api/admin/users` | Criar novo admin |

### Oficina (`/api/oficina`) — oficina_admin + oficina_user

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/oficina/clientes` | Listar clientes da oficina |
| `POST` | `/api/oficina/clientes` | Cadastrar cliente |
| `PUT` | `/api/oficina/clientes/:id` | Atualizar cliente |
| `GET` | `/api/oficina/veiculos` | Listar veículos |
| `POST` | `/api/oficina/veiculos` | Cadastrar veículo |
| `GET` | `/api/oficina/os` | Listar ordens de serviço |
| `POST` | `/api/oficina/os` | Abrir nova OS |
| `PUT` | `/api/oficina/os/:id` | Atualizar OS |
| `POST` | `/api/oficina/os/:id/checklist` | Registrar checklist |
| `POST` | `/api/oficina/os/:id/pecas` | Adicionar peças/serviços |
| `POST` | `/api/oficina/os/:id/certificado` | Emitir certificado |
| `GET` | `/api/oficina/agenda` | Agenda do dia |
| `GET` | `/api/oficina/historico` | OS finalizadas |

### Cliente (`/api/cliente`) — cliente only

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/cliente/veiculos` | Meus veículos |
| `GET` | `/api/cliente/os` | Histórico de OS |
| `GET` | `/api/cliente/os/:id` | Detalhes da OS |
| `GET` | `/api/cliente/lembretes` | Lembretes de manutenção |
| `GET` | `/api/cliente/busca-oficinas` | Buscar oficinas |

---

## Middleware Pipeline

```
Request → cors → express.json() → router
  ├── /api/auth/login → authController.login (público)
  ├── /api/auth/me → authMiddleware → authController.me
  ├── /api/admin/* → authMiddleware → roleMiddleware('super_admin') → controller
  ├── /api/oficina/* → authMiddleware → roleMiddleware('oficina_admin','oficina_user') → controller
  └── /api/cliente/* → authMiddleware → roleMiddleware('cliente') → controller
```

## Tratamento de Erros

Formato padrão de erro:

```json
{
  "error": "Mensagem legível para o usuário",
  "details": "Detalhes técnicos (opcional, apenas em dev)"
}
```

Para erros de role:

```json
{
  "error": "Acesso negado. Permissão insuficiente.",
  "requiredRoles": ["super_admin"],
  "userRole": "oficina_admin"
}
```
