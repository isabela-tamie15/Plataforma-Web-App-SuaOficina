-- ============================================
-- SuaOficina — Schema v1 (Fase 1)
-- Executar no Supabase SQL Editor
-- ============================================

-- 1. Enum de roles
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'oficina_admin',
  'oficina_user',
  'cliente'
);

-- 2. Tabela de oficinas
CREATE TABLE oficinas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(20),
  endereco TEXT,
  telefone VARCHAR(20),
  email VARCHAR(255),
  responsavel VARCHAR(255),
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'inativa')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de perfis (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'cliente',
  oficina_id UUID REFERENCES oficinas(id) ON DELETE SET NULL,
  telefone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Índices
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_oficina ON profiles(oficina_id);
CREATE INDEX idx_oficinas_status ON oficinas(status);

-- 5. RLS — Habilitar
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE oficinas ENABLE ROW LEVEL SECURITY;

-- 5.1. Funções auxiliares SECURITY DEFINER (evitam recursão infinita nas policies)
-- Essas funções consultam profiles sem passar pela RLS
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_my_oficina_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT oficina_id FROM public.profiles WHERE id = auth.uid();
$$;

-- 6. RLS Policies — profiles
-- Usuário pode ver o próprio perfil
CREATE POLICY "user_read_own_profile" ON profiles
  FOR SELECT
  USING (id = auth.uid());

-- Super admin pode ver todos os perfis
CREATE POLICY "super_admin_read_all_profiles" ON profiles
  FOR SELECT
  USING (public.get_my_role() = 'super_admin');

-- Super admin pode inserir perfis
CREATE POLICY "super_admin_insert_profiles" ON profiles
  FOR INSERT
  WITH CHECK (public.get_my_role() = 'super_admin');

-- Super admin pode atualizar perfis
CREATE POLICY "super_admin_update_profiles" ON profiles
  FOR UPDATE
  USING (public.get_my_role() = 'super_admin');

-- Usuário pode atualizar o próprio perfil
CREATE POLICY "user_update_own_profile" ON profiles
  FOR UPDATE
  USING (id = auth.uid());

-- 7. RLS Policies — oficinas
-- Super admin pode ver todas as oficinas
CREATE POLICY "super_admin_read_all_oficinas" ON oficinas
  FOR SELECT
  USING (public.get_my_role() = 'super_admin');

-- Usuários de oficina podem ver sua própria oficina
CREATE POLICY "oficina_user_read_own" ON oficinas
  FOR SELECT
  USING (id = public.get_my_oficina_id());

-- Super admin pode inserir oficinas
CREATE POLICY "super_admin_insert_oficinas" ON oficinas
  FOR INSERT
  WITH CHECK (public.get_my_role() = 'super_admin');

-- Super admin pode atualizar oficinas
CREATE POLICY "super_admin_update_oficinas" ON oficinas
  FOR UPDATE
  USING (public.get_my_role() = 'super_admin');

-- 8. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_oficinas_updated
  BEFORE UPDATE ON oficinas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
