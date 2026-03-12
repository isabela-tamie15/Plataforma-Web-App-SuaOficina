import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(url, anonKey);

async function test() {
  console.log('Logging in as oficina...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'oficina@suaoficina.com',
    password: 'Oficina@123',
  });
  if (error) {
    console.error('Login error:', error);
    return;
  }
  console.log('Login success, user ID:', data.user.id);
  console.log('Fetching profile...');
  
  const profileFetch = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
  console.log('Profile fetch result:', profileFetch);
}

test();
