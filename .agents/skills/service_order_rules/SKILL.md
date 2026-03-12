---
name: service_order_rules
description: Regras de negócio, melhores práticas de mercado e arquitetura para a criação e manutenção do módulo de Ordens de Serviço (OS) no App SuaOficina.
---

# Regras de Negócio: Ordem de Serviço (OS)

Sempre que você (a IA) for solicitada a criar, alterar ou debugar qualquer funcionalidade relacionada a "Ordem de Serviço", "Checklists", "Orçamentos" ou "Atendimento de Veículos", você DEVE seguir as regras listadas neste documento.

Estas métricas e heurísticas são baseadas em práticas consagradas no mercado SaaS para Oficinas Mecânicas.

## 1. Fluxo de Trabalho (Workflow) Padrão
Toda OS deve transitar (ou ter suporte para transitar) nas seguintes etapas lógicas (Funil da OS):

1. **Intake (Recepção/Abertura):**
   - **Campos Obrigatórios:** Abertura não pode ocorrer sem *Placa*, *Quilometragem/Odômetro*, e a Reclamação do Cliente (Concern).
   - O sistema deve facilitar a identificação rápida de clientes retornando para agilizar o processo.

2. **DVI (Digital Vehicle Inspection / Checklist):**
   - O mecânico inspeciona o veículo. Deve haver espaço para anexar fotos/vídeos.
   - O registro do checklist de entrada protege a oficina (registrando arranhões antigos) e ajuda a vender mais (sugerindo preventivas não vistas pelo cliente inicialmente).
   - O diagnóstico técnico (Cause) se junta à reclamação.

3. **Orçamento e Aprovação:**
   - **Separação Fundamental:** O cálculo de preço na OS **NUNCA** deve juntar "Peças" (Parts) e "Mão-de-Obra" (Labor) no mesmo bloco de cálculo invisível. Eles têm impostos, comissões e margens de lucro diferentes.
   - Ao enviar um orçamento para o cliente, o ideal é que ele possa aprovar linha a linha (aprova trocar o óleo, não aprova trocar as palhetas do limpador).
   - A correção proposta (Correction) é detalhada aqui em termos de serviços a executar.

4. **Execução e Controle de Estoque:**
   - O serviço só deve iniciar quando as peças necessárias (quando aplicável) estiverem separadas/reservadas em estoque.
   - A mudança do "Status da OS" deve ser feita para refletir a realidade em tempo real (ex: "Aguardando Peça", "No Elevador", "Pronto").

5. **Faturamento e Pós-Entrega:**
   - Conclusão da OS obrigatoriamente debita o estoque.
   - Idealmente, deve possuir mecanismos (ou tags) para disparar lembretes futuros de retorno (ex: "Troca de óleo em 6 meses").

## 2. Regras de Arquitetura e Estrutura de Dados
Se você for modelar tabelas no banco de dados (Supabase) ou construir rotas no Frontend para manipular Ordem de Serviço, aplique estes princípios de engenharia:

*   **Multitenancy Lógico (Single Database / Shared Schema):**
    *   O SaaS opera com um **único banco de dados** compartilhado entre todas as oficinas. Para garantir o isolamento absoluto de dados, toda tabela relacionada à operação comercial (ex: `ordens_servico`, `os_itens`, `checklists`, `clientes`, `veiculos`) DEVE obrigatoriamente ter a coluna `oficina_id` (ou `tenant_id`).
    *   **Row Level Security (RLS) no Supabase é indiscutível.** Você, a IA, não pode gerar consultas que não garantam que as políticas (Policies) do Supabase filtrem as linhas para que o usuário autenticado só leia, edite e apague registros vinculados à sua própria oficina. Em nenhuma hipótese dados de placa de um carro atendido pela Oficina A podem vazar para a Oficina B.

*   **Auditoria de Aprovações (Transparência Legal):**
    *   Sempre rastreie "quem aprovou o quê" e "quando". Se uma peça extra foi adicionada e o valor final subiu, a aplicação deve suportar registrar se a aprovação foi "Via WhatsApp", "Assinatura Presencial" ou "Link Digital", incluindo o Timestamp. Isso evita processos legais para o dono da oficina.

*   **Precificação Dinâmica:**
    *   Entenda que uma oficina ganha dinheiro na revenda de peças (Margem/Markup). O campo de preços no banco de dados da OS deve conseguir guardar o `custo_unitario_peca` e o `preco_venda_peca`, para que no futuro o Dashboard consiga calcular o lucro exato da OS.

## Como Aplicar Esta Skill
Sempre que desenvolver UI, APIs ou Regras SQL para Ordens de Serviço:
1. Re-leia atentamente o RLS e confira o `oficina_id`.
2. Questione-se: "A UI que estou propondo permite o fluxo rápido de Recepção (Concern, Placa, KM)?"
3. A interface permite separar Mão de Obra de Peças visualmente?
