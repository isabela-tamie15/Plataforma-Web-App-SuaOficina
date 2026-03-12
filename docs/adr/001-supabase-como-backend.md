# ADR-001: Supabase como camada de dados e autenticação

**Data:** 2026-03  
**Status:** Aceita

## Contexto

O projeto precisa de banco de dados PostgreSQL, autenticação de usuários com JWT, controle de acesso por roles e, futuramente, storage de arquivos. A equipe é pequena e busca produtividade.

## Decisão

Usar **Supabase** como BaaS (Backend as a Service), aproveitando:

- PostgreSQL gerenciado com RLS nativo
- Supabase Auth com JWT para autenticação
- Storage para arquivos futuros (checklists, certificados)

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| Firebase | Ecossistema maduro, Firestore | NoSQL, não relacional, vendor lock-in |
| PostgreSQL auto-hospedado | Controle total | Overhead de infra, manutenção |
| Auth0 + PostgreSQL separado | Auth robusto | Complexidade, custo adicional |

## Consequências

- **Positivo:** Setup rápido, RLS nativo, Auth integrado, free tier generoso
- **Negativo:** Dependência do Supabase, limitações de customização do Auth
- **Trade-off:** Menos controle sobre infra, mas velocidade de desenvolvimento compensa para MVP
