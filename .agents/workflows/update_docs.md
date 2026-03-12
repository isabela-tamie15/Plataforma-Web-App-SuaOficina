---
description: Workflow para a IA atualizar a documentação do projeto App SuaOficina após mudanças relevantes
---
# Atualização de Documentação - App SuaOficina

Este workflow deve ser acionado sempre que uma nova feature for concluída, ocorrer uma mudança de arquitetura, alteração de regras de negócio, ou qualquer outro fator que exija a atualização da base de conhecimento do sistema.

## Passos para a IA executar:

Você (a IA) deve avaliar as mudanças recentes que foram implementadas no projeto e atualizar a documentação existente ou criar novos documentos conforme a necessidade. Siga este processo estruturado:

1. **Mapeamento do que mudou:**
   - Analise o que acabou de ser implementado (nova funcionalidade, alteração no banco de dados, novo endpoint, mudança de UI/UX, decisões técnicas relevantes).

2. **Atualização dos Documentos Principais:**
   - Edite `spec.md`: Atualize as especificações técnicas, escopo de funcionalidades e regras de negócio relacionadas com a nova implementação.
   - Edite `context_ai.md`: Se houver novos direcionamentos ou restrições que IAs devam obedecer daqui em diante, adicione-os aqui.

3. **Atualização da Arquitetura e Decisões:**
   - Edite `docs/architecture.md`: Se componentes do sistema, fluxos de dados ou infraestrutura mudaram, reflita essas alterações.
   - Crie um novo ADR em `docs/adr/`: Se foi tomada uma decisão arquitetural ou técnica importante durante o desenvolvimento (ex: mudança de biblioteca, novo padrão), crie um arquivo seguindo o padrão numérico sequencial (`006-nome-da-decisao.md`).

4. **Atualização de Contratos e APIs:**
   - Edite `docs/contracts/api.md`: Adicione, remova ou modifique endpoints, payloads e estruturas de retorno afetados por sua implementação.

5. **Manutenção do Workflow de Leitura (`read_docs.md`):**
   - **MUITO IMPORTANTE:** Se você criou *novos* arquivos de documentação (como novos ADRs que devem ser lidos explicitamente, ou novos guias), você **DEVE** editar o arquivo `.agents/workflows/read_docs.md` para incluir esses novos arquivos na lista de leitura obrigatória. Isso garante que a IA sempre terá o contexto mais atualizado em novos chats.

6. **Outras atualizações aplicáveis:**
   - Atualize `docs/roadmap.md` marcando a feature desenvolvida como concluída, se aplicável.
   - Atualize `frontend/README.md` ou `docs/contributing.md` caso o ambiente de desenvolvimento, scripts ou padrões de código tenham mudado.

---

## ⚠️ Instruções e Regras Críticas Pós-Atualização:
- Mantenha a documentação técnica, concisa e orientada aos padrões definidos inicialmente (Vite, React, Vanilla CSS, Supabase).
- Não gere informações redundantes em múltiplos arquivos. Use referências cruzadas (`link`) quando um documento precisar apontar para outro.
- Assim que concluir as alterações, informe ao usuário através de um resumo claro e objetivo quais arquivos específicos foram atualizados e o que foi alterado em cada um deles.
