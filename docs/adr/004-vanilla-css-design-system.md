# ADR-004: Vanilla CSS com Design System por variáveis

**Data:** 2026-03  
**Status:** Aceita

## Contexto

O frontend precisa de um design system consistente (dark mode, cores, tipografia, espaçamentos) sem adicionar complexidade de build.

## Decisão

Usar **Vanilla CSS** com CSS Custom Properties (variáveis) em um único arquivo `index.css` (~920 linhas), organizado por seções:

- Variables (cores, espaçamentos, tipografia, sombras)
- Reset & Base
- Animations
- Componentes (Login, Sidebar, TopBar, Dashboard, Stats)
- Responsive

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| Tailwind CSS | Rápido para prototipar | Dependência extra, classes longas, menos controle |
| Styled Components | CSS-in-JS, escopo local | Runtime overhead, complexidade |
| CSS Modules | Escopo local | Fragmentação de arquivos CSS |

## Consequências

- **Positivo:** Zero dependências de CSS; controle total do design; performance ótima; dark mode nativo
- **Negativo:** Arquivo pode crescer demais; sem escopo local (colisão de nomes possível)
- **Mitigação:** Nomes de classe seguem padrão BEM-like (`login-page--admin`, `stat-card`)
