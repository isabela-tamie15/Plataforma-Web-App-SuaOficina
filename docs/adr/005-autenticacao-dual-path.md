# ADR-005: Autenticação dual-path (Frontend + Backend)

**Data:** 2026-03  
**Status:** Aceita

## Contexto

O sistema precisa autenticar usuários em dois contextos:

1. **Frontend:** para manter sessão, exibir dados do perfil, e renderizar rotas protegidas
2. **Backend:** para proteger endpoints da API e verificar roles

## Decisão

**Dual-path authentication:**

- **Frontend** usa `supabase.auth.signInWithPassword()` diretamente (anon key) e mantém a sessão via `AuthContext`
- **Backend** recebe o JWT no header `Authorization: Bearer <token>` e valida com `supabaseAdmin.auth.getUser(token)` (service_role key)

```
Frontend                          Backend                          Supabase
   │                                │                                │
   ├──signInWithPassword()─────────────────────────────────────────►│
   │◄──────────────────────────────────────── JWT + session ────────│
   │                                │                                │
   ├── Bearer token ───────────────►│                                │
   │                                ├── getUser(token) ────────────►│
   │                                │◄──── user data ───────────────│
   │                                ├── query profiles ────────────►│
   │◄── response ──────────────────│                                │
```

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| Auth apenas via backend | Ponto único de auth | Mais round-trips, sessão manual no frontend |
| Auth apenas no frontend | Menos código | Backend não pode validar requests |
| Proxy de auth no backend | Controle centralizado | Complexidade, latência adicional |

## Consequências

- **Positivo:** Frontend tem UX fluida (sessão persistida pelo Supabase); Backend valida independentemente
- **Negativo:** Dois pontos de autenticação para manter
- **Trade-off:** A complexidade é aceitável porque ambos usam o mesmo provedor (Supabase Auth)
