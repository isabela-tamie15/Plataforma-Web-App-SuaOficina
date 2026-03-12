# ADR-003: React + Vite para o Frontend

**Data:** 2026-03  
**Status:** Aceita

## Contexto

O frontend precisa ser uma SPA responsiva, com roteamento por perfil, autenticação integrada ao Supabase, e capacidade de evolução para mobile (React Native).

## Decisão

Usar **React 19 + Vite 7** com:

- `react-router-dom` v7 para roteamento
- Vanilla CSS para estilização
- `@supabase/supabase-js` para autenticação direta

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| Next.js | SSR, API routes embutidas | Overhead para SPA; backend separado já existe |
| Vue.js + Vite | Curva de aprendizado menor | Ecossistema menor; React Native requer React |
| Angular | Enterprise-grade | Complexidade excessiva para MVP |

## Consequências

- **Positivo:** Build rápido (Vite), ecossistema React maduro, caminho claro para React Native
- **Negativo:** Sem SSR (SEO limitado) — aceitável pois é um app interno/SaaS
- **Trade-off:** SPA pura é suficiente para o caso de uso (dashboard de gestão)
