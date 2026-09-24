import { query, checkDbHealth } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetDatabase() {
  console.log('⚠️ [CAUTION] Resetting PostgreSQL Database Schema...');
  const health = await checkDbHealth();

  if (health.status !== 'CONNECTED') {
    console.error('❌ Cannot reset database: PostgreSQL is not connected.');
    process.exit(1);
  }

  try {
    console.log('🧹 Dropping public schema CASCADE...');
    await query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    console.log('✅ Schema cleaned.');

    const sqlFiles = ['create_users_table.sql', 'create_tenants_table.sql', 'create_fx_rates_table.sql'];
    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        console.log(`🚀 Re-applying DDL Schema: ${file}`);
        const sql = fs.readFileSync(filePath, 'utf8');
        await query(sql);
      }
    }

    console.log('🎉 Database reset completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Reset failed with error:', err);
    process.exit(1);
  }
}

resetDatabase();
