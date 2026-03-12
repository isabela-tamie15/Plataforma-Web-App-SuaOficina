import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function fixProfiles() {
  console.log('Listing auth users...');
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) { console.error('Error:', error); return; }

  console.log(`Found ${users.length} auth users:`);
  for (const u of users) {
    console.log(`  - ${u.email} (${u.id})`);
    
    // Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', u.id)
      .single();

    if (profile) {
      console.log(`    Profile EXISTS: role=${profile.role}`);
    } else {
      console.log(`    Profile MISSING!`);
      
      // Determine role based on email
      const role = u.email === 'superadmin@suaoficina.com' ? 'super_admin' : 'oficina_admin';
      const nome = u.email === 'superadmin@suaoficina.com' ? 'Admin SuaOficina' : 'João da Silva';
      
      // For oficina_admin, find the oficina
      let oficina_id = null;
      if (role === 'oficina_admin') {
        const { data: oficina } = await supabase
          .from('oficinas')
          .select('id')
          .limit(1)
          .single();
        if (oficina) oficina_id = oficina.id;
      }

      const { data: newProfile, error: insertErr } = await supabase
        .from('profiles')
        .insert({ id: u.id, email: u.email, nome, role, oficina_id })
        .select()
        .single();

      if (insertErr) {
        console.log(`    ERROR creating profile: ${insertErr.message}`);
      } else {
        console.log(`    Profile CREATED: role=${newProfile.role}`);
      }
    }
  }
  console.log('\nDone!');
}

fixProfiles().catch(console.error);
