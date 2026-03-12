import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function fixRLS() {
  console.log('🔧 Corrigindo RLS policies com recursão infinita...\n');

  // Step 1: Create a SECURITY DEFINER function to get user role without triggering RLS
  console.log('1. Criando função get_my_role() com SECURITY DEFINER...');
  const { error: fnError } = await supabase.rpc('', {}).catch(() => ({}));
  
  // We need to run raw SQL. Use supabase.rpc or the SQL endpoint.
  // Since we have service_role_key, we can use the pg REST API to run SQL via rpc.
  // But the simplest approach is to use the Supabase Management API or run SQL directly.
  
  // Let's use the postgres connection via the REST API's rpc
  // Actually, the best way is to create the function via SQL
  
  const sqlStatements = [
    // 1. Create helper function that bypasses RLS
    `CREATE OR REPLACE FUNCTION public.get_my_role()
     RETURNS user_role
     LANGUAGE sql
     STABLE
     SECURITY DEFINER
     SET search_path = public
     AS $$
       SELECT role FROM public.profiles WHERE id = auth.uid();
     $$;`,

    // 2. Create helper function for oficina_id
    `CREATE OR REPLACE FUNCTION public.get_my_oficina_id()
     RETURNS UUID
     LANGUAGE sql
     STABLE
     SECURITY DEFINER
     SET search_path = public
     AS $$
       SELECT oficina_id FROM public.profiles WHERE id = auth.uid();
     $$;`,

    // 3. Drop old profiles policies
    `DROP POLICY IF EXISTS "super_admin_read_all_profiles" ON profiles;`,
    `DROP POLICY IF EXISTS "user_read_own_profile" ON profiles;`,
    `DROP POLICY IF EXISTS "super_admin_insert_profiles" ON profiles;`,
    `DROP POLICY IF EXISTS "super_admin_update_profiles" ON profiles;`,
    `DROP POLICY IF EXISTS "user_update_own_profile" ON profiles;`,

    // 4. Recreate profiles policies using the helper function
    `CREATE POLICY "super_admin_read_all_profiles" ON profiles
       FOR SELECT
       USING (public.get_my_role() = 'super_admin');`,

    `CREATE POLICY "user_read_own_profile" ON profiles
       FOR SELECT
       USING (id = auth.uid());`,

    `CREATE POLICY "super_admin_insert_profiles" ON profiles
       FOR INSERT
       WITH CHECK (public.get_my_role() = 'super_admin');`,

    `CREATE POLICY "super_admin_update_profiles" ON profiles
       FOR UPDATE
       USING (public.get_my_role() = 'super_admin');`,

    `CREATE POLICY "user_update_own_profile" ON profiles
       FOR UPDATE
       USING (id = auth.uid());`,

    // 5. Drop and recreate oficinas policies using the helper function
    `DROP POLICY IF EXISTS "super_admin_read_all_oficinas" ON oficinas;`,
    `DROP POLICY IF EXISTS "oficina_user_read_own" ON oficinas;`,
    `DROP POLICY IF EXISTS "super_admin_insert_oficinas" ON oficinas;`,
    `DROP POLICY IF EXISTS "super_admin_update_oficinas" ON oficinas;`,

    `CREATE POLICY "super_admin_read_all_oficinas" ON oficinas
       FOR SELECT
       USING (public.get_my_role() = 'super_admin');`,

    `CREATE POLICY "oficina_user_read_own" ON oficinas
       FOR SELECT
       USING (id = public.get_my_oficina_id());`,

    `CREATE POLICY "super_admin_insert_oficinas" ON oficinas
       FOR INSERT
       WITH CHECK (public.get_my_role() = 'super_admin');`,

    `CREATE POLICY "super_admin_update_oficinas" ON oficinas
       FOR UPDATE
       USING (public.get_my_role() = 'super_admin');`,
  ];

  // Execute each statement
  for (let i = 0; i < sqlStatements.length; i++) {
    const sql = sqlStatements[i];
    const shortDesc = sql.trim().substring(0, 60) + '...';
    
    const { error } = await supabase.rpc('exec_sql', { sql_text: sql });
    
    if (error) {
      // If exec_sql doesn't exist, we need an alternative approach
      console.error(`   ❌ Erro ao executar SQL (${i+1}): ${error.message}`);
      if (i === 0) {
        console.log('\n⚠️  A função exec_sql não existe. Você precisa executar o SQL diretamente no Supabase SQL Editor.');
        console.log('\nCopie e cole o seguinte SQL no SQL Editor do Supabase:\n');
        console.log('------- INÍCIO DO SQL -------\n');
        console.log(sqlStatements.join('\n\n'));
        console.log('\n------- FIM DO SQL -------');
        return;
      }
    } else {
      console.log(`   ✅ (${i+1}/${sqlStatements.length}) OK`);
    }
  }

  console.log('\n🎉 RLS corrigido com sucesso!');
}

fixRLS().catch(console.error);
