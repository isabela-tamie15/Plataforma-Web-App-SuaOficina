import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Extract host from SUPABASE_URL
const url = new URL(process.env.SUPABASE_URL);
const projectRef = url.hostname.split('.')[0];

const client = new pg.Client({
  host: `db.${projectRef}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ssl: { rejectUnauthorized: false },
});

async function fixRLS() {
  await client.connect();
  console.log('✅ Conectado ao PostgreSQL\n');

  const statements = [
    // 1. Create SECURITY DEFINER function to get role without RLS
    `CREATE OR REPLACE FUNCTION public.get_my_role()
     RETURNS text
     LANGUAGE sql
     STABLE
     SECURITY DEFINER
     SET search_path = public
     AS $$
       SELECT role::text FROM public.profiles WHERE id = auth.uid();
     $$`,

    // 2. Create SECURITY DEFINER function to get oficina_id without RLS
    `CREATE OR REPLACE FUNCTION public.get_my_oficina_id()
     RETURNS UUID
     LANGUAGE sql
     STABLE
     SECURITY DEFINER
     SET search_path = public
     AS $$
       SELECT oficina_id FROM public.profiles WHERE id = auth.uid();
     $$`,

    // 3. Drop old profiles policies
    `DROP POLICY IF EXISTS "super_admin_read_all_profiles" ON profiles`,
    `DROP POLICY IF EXISTS "user_read_own_profile" ON profiles`,
    `DROP POLICY IF EXISTS "super_admin_insert_profiles" ON profiles`,
    `DROP POLICY IF EXISTS "super_admin_update_profiles" ON profiles`,
    `DROP POLICY IF EXISTS "user_update_own_profile" ON profiles`,

    // 4. Recreate profiles policies using helper function (no recursion!)
    `CREATE POLICY "user_read_own_profile" ON profiles
       FOR SELECT USING (id = auth.uid())`,

    `CREATE POLICY "super_admin_read_all_profiles" ON profiles
       FOR SELECT USING (public.get_my_role() = 'super_admin')`,

    `CREATE POLICY "super_admin_insert_profiles" ON profiles
       FOR INSERT WITH CHECK (public.get_my_role() = 'super_admin')`,

    `CREATE POLICY "super_admin_update_profiles" ON profiles
       FOR UPDATE USING (public.get_my_role() = 'super_admin')`,

    `CREATE POLICY "user_update_own_profile" ON profiles
       FOR UPDATE USING (id = auth.uid())`,

    // 5. Drop and recreate oficinas policies
    `DROP POLICY IF EXISTS "super_admin_read_all_oficinas" ON oficinas`,
    `DROP POLICY IF EXISTS "oficina_user_read_own" ON oficinas`,
    `DROP POLICY IF EXISTS "super_admin_insert_oficinas" ON oficinas`,
    `DROP POLICY IF EXISTS "super_admin_update_oficinas" ON oficinas`,

    `CREATE POLICY "super_admin_read_all_oficinas" ON oficinas
       FOR SELECT USING (public.get_my_role() = 'super_admin')`,

    `CREATE POLICY "oficina_user_read_own" ON oficinas
       FOR SELECT USING (id = public.get_my_oficina_id())`,

    `CREATE POLICY "super_admin_insert_oficinas" ON oficinas
       FOR INSERT WITH CHECK (public.get_my_role() = 'super_admin')`,

    `CREATE POLICY "super_admin_update_oficinas" ON oficinas
       FOR UPDATE USING (public.get_my_role() = 'super_admin')`,
  ];

  for (let i = 0; i < statements.length; i++) {
    try {
      await client.query(statements[i]);
      const label = statements[i].trim().substring(0, 65).replace(/\n/g, ' ');
      console.log(`  ✅ (${i + 1}/${statements.length}) ${label}...`);
    } catch (err) {
      console.error(`  ❌ (${i + 1}/${statements.length}) ERRO: ${err.message}`);
    }
  }

  await client.end();
  console.log('\n🎉 RLS corrigido! O login deve funcionar agora.');
  console.log('\n📧 Super Admin: superadmin@suaoficina.com');
  console.log('🔑 Senha: Super@123');
}

fixRLS().catch(err => {
  console.error('Erro fatal:', err.message);
  client.end();
});
