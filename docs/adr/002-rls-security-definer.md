# ADR-002: RLS com funções SECURITY DEFINER

**Data:** 2026-03  
**Status:** Aceita

## Contexto

As RLS policies na tabela `profiles` precisam consultar o role do usuário atual. Porém, como o role está em `profiles` e a policy é em `profiles`, uma query como `SELECT role FROM profiles WHERE id = auth.uid()` dentro de uma policy causa **recursão infinita** — a policy tenta ler `profiles` que aciona a mesma policy.

## Decisão

Criar funções auxiliares com `SECURITY DEFINER`:

```sql
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$;
```

Essas funções executam com os privilégios do **criador** (superuser), bypassando RLS. As policies usam `public.get_my_role()` em vez de consultar `profiles` diretamente.

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| Role no JWT custom claims | Sem recursão, rápido | Complexo de manter, requer refresh quando role muda |
| Tabela separada para roles | Sem recursão | Redundância de dados, sincronização |
| Desabilitar RLS em profiles | Simples | Inseguro, expõe dados |

## Consequências

- **Positivo:** Resolve a recursão; policies ficam limpas e legíveis
- **Negativo:** Funções `SECURITY DEFINER` bypassam RLS (risco se mal escritas)
- **Mitigação:** `SET search_path = public` evita injeção de schema; funções são simples e auditáveis
