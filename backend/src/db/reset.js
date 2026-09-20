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

    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    console.log('🚀 Re-applying DDL Schema...');
    await query(sql);

    console.log('🎉 Database reset completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Reset failed with error:', err);
    process.exit(1);
  }
}

resetDatabase();
