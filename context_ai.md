# context_ai.md — Contexto Compacto para IAs | App SuaOficina

---

## Resumo do Projeto

**App SuaOficina** é um SaaS web de gestão para pequenas oficinas mecânicas. Três perfis de acesso: **Super Admin** (equipe SuaOficina — gerencia a plataforma), **Oficina** (donos/mecânicos — gerencia clientes, veículos e ordens de serviço), **Cliente** (consulta histórico de seus veículos). O MVP é web-only. Mobile (React Native) é planejado para versões futuras.

---

## Stack Atual

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite 7, react-router-dom v7and vanilla CSS |
| Backend | Node.js + Express 4 (ES Modules) |
| Banco | Supabase (PostgreSQL gerenciado + Auth + RLS) |
| Auth | Supabase Auth com JWT, roles via tabela `profiles` |

---

## Estrutura do Projeto

```
/backend        → API Express (server.js → src/{config,controllers,middleware,routes})
/frontend       → React SPA (Vite, src/{pages,components,contexts,lib})
/database       → schema.sql (tabelas oficinas, profiles, enum user_role, RLS policies)
/spec.md        → Especificação técnica completa
/context_ai.md  → Este arquivo
/docs/          → Documentação técnica expandida
```

---

## Estado Atual (Fase 1)

### ✅ Implementado
- Autenticação completa (login/logout/me) via Supabase Auth + JWT
- RLS com funções `SECURITY DEFINER` (get_my_role, get_my_oficina_id)
- Tabelas: `oficinas`, `profiles` com políticas RLS
- Painel Super Admin: login + dashboard (estático) + CRUD de oficinas e UX de formulário
- Painel Oficina: login + dashboard (estático, sem dados reais)
- Layouts: Sidebar, TopBar, ProtectedRoute por role
- Design System: dark mode, Inter font, CSS variables, animações

### ❌ Não implementado
- CRUD de clientes, veículos, OS
- Tabelas: clientes, veículos, ordens_servico, checklists, pecas_servicos, certificados_garantia
- Versão cliente
- Funcionalidades operacionais (agenda, histórico, lembretes)

---

## Como eu penso e trabalho

- Desenvolvimento iterativo por fases (Fase 1: auth → Fase 2: CRUD oficinas → ...)
- Backend primeiro: schema → API → frontend
- Validação dupla: frontend (UX) + backend (segurança)
- Código em português para entidades de negócio, em inglês para construções técnicas
- CSS num único arquivo (`index.css`) com design system por variáveis

---

## Regras que a IA deve sempre respeitar

1. **Nunca expor credenciais** — `.env` nunca vai para Git; usar variáveis de ambiente
2. **Manter a estrutura de pastas** — controllers, middleware, routes no backend; pages, components, contexts no frontend
3. **RLS é obrigatório** — toda tabela nova deve ter RLS habilitado com policies adequadas
4. **Roles são fixos** — `super_admin`, `oficina_admin`, `oficina_user`, `cliente` definidos no enum `user_role`
5. **Histórico é imutável** — OS finalizadas não podem ser editadas
6. **Checklist é obrigatório** — toda OS precisa de checklist na abertura
7. **Isolamento por oficina** — dados de oficina A nunca visíveis para oficina B (exceto Super Admin)
8. **ES Modules** — usar `import/export`, não `require/module.exports`
9. **Supabase Admin client** — usar `supabaseAdmin` (service_role) apenas no backend, nunca no frontend
10. **Frontend usa anon key** — `supabase` client do frontend usa apenas a chave pública
11. **Nomenclatura** — entidades em português singular: `cliente`, `veiculo`, `ordem_servico`
12. **IDs como UUID** — usar `gen_random_uuid()` do PostgreSQL
13. **Não criar dependências desnecessárias** — o projeto usa vanilla CSS, não instalar Tailwind/Bootstrap
