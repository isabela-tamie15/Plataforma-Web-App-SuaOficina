import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // 1. Criar oficina de teste
  console.log('📦 Criando oficina de teste...');
  const { data: oficina, error: oficinaError } = await supabase
    .from('oficinas')
    .insert({
      nome: 'Oficina Teste',
      cnpj: '12.345.678/0001-99',
      endereco: 'Rua das Oficinas, 123 - Centro',
      telefone: '(11) 99999-0000',
      email: 'contato@oficinateste.com',
      responsavel: 'João da Silva',
      status: 'ativa',
    })
    .select()
    .single();

  if (oficinaError) {
    console.error('❌ Erro ao criar oficina:', oficinaError.message);
    // Tentar buscar oficina existente
    const { data: existing } = await supabase
      .from('oficinas')
      .select()
      .eq('cnpj', '12.345.678/0001-99')
      .single();
    if (existing) {
      console.log('✅ Oficina existente encontrada:', existing.nome);
      await createUsers(existing.id);
      return;
    }
    return;
  }

  console.log('✅ Oficina criada:', oficina.nome, '(ID:', oficina.id, ')\n');
  await createUsers(oficina.id);
}

async function createUsers(oficinaId) {
  // 2. Criar Super Admin
  console.log('👤 Criando Super Admin de teste...');
  const { data: superAdminAuth, error: saError } = await supabase.auth.admin.createUser({
    email: 'superadmin@suaoficina.com',
    password: 'Super@123',
    email_confirm: true,
  });

  if (saError) {
    console.error('❌ Erro ao criar Super Admin:', saError.message);
    if (saError.message.includes('already')) {
      console.log('   (usuário já existe, pulando...)');
    }
  } else {
    // Criar perfil
    const { error: saProfileError } = await supabase
      .from('profiles')
      .insert({
        id: superAdminAuth.user.id,
        email: 'superadmin@suaoficina.com',
        nome: 'Admin SuaOficina',
        role: 'super_admin',
        oficina_id: null,
      });

    if (saProfileError) {
      console.error('❌ Erro no perfil do Super Admin:', saProfileError.message);
    } else {
      console.log('✅ Super Admin criado com sucesso!');
      console.log('   📧 Email: superadmin@suaoficina.com');
      console.log('   🔑 Senha: Super@123\n');
    }
  }

  // 3. Criar Oficina Admin
  console.log('👤 Criando Oficina Admin de teste...');
  const { data: oficinaAdminAuth, error: oaError } = await supabase.auth.admin.createUser({
    email: 'oficina@suaoficina.com',
    password: 'Oficina@123',
    email_confirm: true,
  });

  if (oaError) {
    console.error('❌ Erro ao criar Oficina Admin:', oaError.message);
    if (oaError.message.includes('already')) {
      console.log('   (usuário já existe, pulando...)');
    }
  } else {
    // Criar perfil
    const { error: oaProfileError } = await supabase
      .from('profiles')
      .insert({
        id: oficinaAdminAuth.user.id,
        email: 'oficina@suaoficina.com',
        nome: 'João da Silva',
        role: 'oficina_admin',
        oficina_id: oficinaId,
      });

    if (oaProfileError) {
      console.error('❌ Erro no perfil do Oficina Admin:', oaProfileError.message);
    } else {
      console.log('✅ Oficina Admin criado com sucesso!');
      console.log('   📧 Email: oficina@suaoficina.com');
      console.log('   🔑 Senha: Oficina@123\n');
    }
  }

  console.log('🎉 Seed concluído!');
}

seed().catch(console.error);
