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

  const start = Date.now();
  const supabaseMigrationsDir = path.resolve(__dirname, '../../../supabase/migrations');

  try {
    // 1. Run core backend/src/db sql files
    const legacySqlFiles = [
      'create_users_table.sql', 
      'create_tenants_table.sql', 
      'create_fx_rates_table.sql',
      'create_telemetry_and_logs_tables.sql'
    ];

    for (const file of legacySqlFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        console.log(`📖 Executing Core Migration from: ${file}`);
        const sql = fs.readFileSync(filePath, 'utf8');
        await query(sql);
      }
    }

    // 2. Run versioned Supabase migrations in order
    if (fs.existsSync(supabaseMigrationsDir)) {
      const files = fs.readdirSync(supabaseMigrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

      for (const file of files) {
        console.log(`📖 Executing Supabase Versioned Migration: ${file}`);
        const sql = fs.readFileSync(path.join(supabaseMigrationsDir, file), 'utf8');
        await query(sql);
      }
    }

    const duration = Date.now() - start;
    console.log(`🎉 [SUCCESS] All database migrations applied successfully in ${duration}ms!`);

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
