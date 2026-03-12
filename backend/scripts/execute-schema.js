import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = 'postgresql://postgres:IKzaorMN82oLrb4G@db.tpbzmzzcsfgbvroamcgu.supabase.co:5432/postgres';

async function executeSchema() {
  console.log('🗄️  Conectando ao banco de dados Supabase...\n');

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados!\n');

    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📜 Executando schema SQL...\n');
    await client.query(schemaSql);
    console.log('✅ Schema executado com sucesso!\n');

    // Verify
    const tablesResult = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name IN ('oficinas', 'profiles')
      ORDER BY table_name;
    `);
    console.log('📋 Tabelas criadas:', tablesResult.rows.map(r => r.table_name).join(', '));

    const policiesResult = await client.query(`
      SELECT policyname, tablename FROM pg_policies
      WHERE tablename IN ('oficinas', 'profiles') ORDER BY tablename, policyname;
    `);
    console.log('🔒 RLS Policies:', policiesResult.rows.length, 'policies criadas');
    policiesResult.rows.forEach(p => console.log(`   - ${p.tablename}: ${p.policyname}`));

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

executeSchema().catch(console.error);
