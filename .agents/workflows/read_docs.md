---
description: Workflow para a IA ler e compreender toda a documentação do projeto App SuaOficina
---
# Contextualização e Leitura de Documentação - App SuaOficina

Este workflow deve ser acionado sempre que a IA precisar entender o contexto do sistema "App SuaOficina" antes de iniciar qualquer desenvolvimento, análise estrutural ou responder a dúvidas técnicas do usuário.

## Passos para a IA executar:

Você (a IA) deve utilizar suas ferramentas de visualização de arquivos do sistema (`view_file`, `list_dir`, etc.) para ler o conteúdo dos seguintes arquivos, de forma sequencial ou em paralelo:

1. **Leia os Documentos Principais (Raiz do projeto):**
   - Leia arquivo `spec.md` (Especificações técnicas e de produto)
   - Leia arquivo `context_ai.md` (Instruções dedicadas de contexto)

2. **Leia a Documentação Geral (`docs/`):**
   - Leia arquivo `docs/architecture.md` (Definições de arquitetura do sistema)
   - Leia arquivo `docs/roadmap.md` (Visão de futuro e próximos passos)
   - Leia arquivo `docs/contributing.md` (Padrões de desenvolvimento e código)

3. **Leia os Contratos de API (`docs/contracts/`):**
   - Leia arquivo `docs/contracts/api.md`

4. **Leia os Registros de Decisões Arquiteturais (`docs/adr/`):**
   - Liste o diretório `docs/adr/` e leia todos os arquivos `.md` presentes nele (ex: `001-supabase-como-backend.md`, `002-rls-security-definer.md`, `003-react-vite-frontend.md`, `004-vanilla-css-design-system.md`, `005-autenticacao-dual-path.md`).

5. **Leia a documentação do Front-end (`frontend/`):**
   - Leia arquivo `frontend/README.md`

---

## ⚠️ Instruções e Regras Críticas Pós-Leitura:
- **NENHUMA AÇÃO** de modificação de código ou arquitetura deve ser iniciada antes que você conclua a leitura completa destes documentos.
- Baseie **TODAS** as suas respostas estritamente no que está estabelecido nestes documentos (por exemplo, uso de React/Vite/Vanilla CSS no frontend, Supabase com RLS no backend). Não sugira stacks alternativos (como Tailwind, Next.js ou Node.js/Express para API externa) a menos que explicitamente solicitado.
- Assim que concluir a leitura de todas as rotas de arquivos listadas acima, confirme para o usuário com a exata mensagem:
  > "Documentação lida e compreendida com sucesso. Base de conhecimento do App SuaOficina atualizada de acordo com as especificações e ADRs. Como posso ajudar com o projeto hoje?"
