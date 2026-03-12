# Roadmap — App SuaOficina

---

## ✅ Fase 1 — Fundação (Concluída)

- [x] Schema do banco de dados (tabelas `oficinas`, `profiles`, enum `user_role`)
- [x] RLS com policies para `profiles` e `oficinas`
- [x] Funções `SECURITY DEFINER` (`get_my_role`, `get_my_oficina_id`)
- [x] Backend Express com API de autenticação (`/api/auth/login`, `/me`, `/logout`)
- [x] Middleware de autenticação (JWT via Supabase)
- [x] Middleware de autorização por role
- [x] Frontend React + Vite com roteamento por perfil
- [x] AuthContext com persistência de sessão
- [x] ProtectedRoute com guard por role
- [x] Login Super Admin com dashboard estático
- [x] Login Oficina com dashboard estático
- [x] Layout: Sidebar + TopBar responsivos
- [x] Design System CSS: dark mode, animações, Inter font
- [x] Scripts utilitários: seed, execute-schema, fix-profile, fix-rls

---

## 🔨 Fase 2 — CRUD Super Admin (Em Planejamento)

- [ ] API: endpoints CRUD para oficinas (`/api/admin/oficinas`)
- [ ] Tabela: listagem de oficinas com busca e filtros
- [ ] Formulário: cadastro de nova oficina + criação de credenciais
- [ ] Ação: ativar/desativar oficina
- [ ] Dashboard: métricas reais da plataforma (contagem de oficinas, OS, clientes)
- [ ] Gestão de usuários admin (`/api/admin/users`)
- [ ] [PREENCHER] Configurações globais do sistema

---

## 📋 Fase 3 — Versão Oficina (Planejada)

- [ ] Schema: tabelas `clientes`, `veiculos`
- [ ] API: CRUD de clientes (`/api/oficina/clientes`)
- [ ] API: CRUD de veículos vinculados a clientes (`/api/oficina/veiculos`)
- [ ] Frontend: listagem, cadastro e edição de clientes
- [ ] Frontend: listagem, cadastro e edição de veículos
- [ ] RLS: policies para isolamento por oficina

---

## 📋 Fase 4 — Ordens de Serviço (Planejada)

- [ ] Schema: tabelas `ordens_servico`, `checklists`, `pecas_servicos`, `certificados_garantia`
- [ ] API: CRUD de ordens de serviço (`/api/oficina/os`)
- [ ] Frontend: abertura de OS com checklist obrigatório
- [ ] Frontend: registro de peças e serviços na OS
- [ ] Frontend: emissão de certificados de garantia
- [ ] Agenda do Dia: OS abertas ordenadas por prioridade de entrega
- [ ] Histórico: OS finalizadas (imutáveis)
- [ ] Número sequencial da OS por oficina

---

## 📋 Fase 5 — Versão Cliente (Planejada)

- [ ] Schema: tabela `lembretes`
- [ ] Frontend: painel do cliente (`/cliente`)
- [ ] Histórico de OS compartilhadas (somente leitura)
- [ ] Visualização de peças instaladas e certificados
- [ ] Consulta de checklists realizados
- [ ] Recebimento de lembretes de manutenção
- [ ] Busca por oficinas que usam o app
- [ ] [PREENCHER] Autenticação do cliente (flow de cadastro/acesso)

---

## 🔮 Futuro (Pós-MVP)

- [ ] Aplicativo mobile (React Native)
- [ ] Controle de estoque de peças
- [ ] Relatórios de desempenho e indicadores de gestão
- [ ] Integração com sistemas financeiros e meios de pagamento
- [ ] Notificações automáticas de manutenção preventiva
- [ ] Sistema de avaliação de oficinas
- [ ] [PREENCHER] Hospedagem definitiva (Vercel, Railway, etc.)
