import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, checkDbHealth } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log('🔄 Checking database connection before running migrations...');
  const health = await checkDbHealth();
  
  if (health.status !== 'CONNECTED') {
    console.error('❌ Failed to connect to PostgreSQL Database:', health.error || 'Unknown Error');
    console.error('💡 Please verify your DATABASE_URL or PGHOST/PGPORT/PGUSER/PGPASSWORD in your .env file.');
    process.exit(1);
  }

  console.log(`✅ Connected to PostgreSQL Database: "${health.database}" (${health.pgVersion})`);
  console.log(`⏱️ Latency: ${health.latencyMs}ms`);

  const schemaPath = path.join(__dirname, 'schema.sql');
  console.log(`📖 Reading SQL Schema from: ${schemaPath}`);
  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('🚀 Executing DDL Schema Migrations...');
  const start = Date.now();

  try {
    await query(sql);
    const duration = Date.now() - start;
    console.log(`🎉 [SUCCESS] Schema migration applied successfully in ${duration}ms!`);

    // Verify created tables
    const tableRes = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\n📊 Created / Verified PostgreSQL Tables:');
    tableRes.rows.forEach((r, idx) => {
      console.log(`   ${idx + 1}. public.${r.table_name}`);
    });
    console.log(`\n✨ Total Tables Verified: ${tableRes.rows.length}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed with error:', err);
    process.exit(1);
  }
}

runMigrations();
