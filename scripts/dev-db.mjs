// Development PostgreSQL (embedded) with the repo migrations applied. NOT for production.
//   cd scripts && npm install embedded-postgres pg && node dev-db.mjs
// Environment: DEV_DB_PASSWORD (required), DEV_DB_PORT (default 54330), DEV_DB_SEED=true to load supabase/seed/dev_seed.sql
import EmbeddedPostgres from 'embedded-postgres';
import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const password = process.env.DEV_DB_PASSWORD;
if (!password) throw new Error('Set DEV_DB_PASSWORD');
const port = Number(process.env.DEV_DB_PORT ?? 54330);
const dataDir = path.join(root, '.tools/dev-db-data');

const server = new EmbeddedPostgres({
  databaseDir: dataDir, user: 'postgres', password, port, persistent: true,
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
});
const fresh = !fs.existsSync(path.join(dataDir, 'PG_VERSION'));
if (fresh) await server.initialise();
await server.start();

if (fresh) {
  await server.createDatabase('alleviare');
  const c = new pg.Client({ connectionString: `postgresql://postgres:${encodeURIComponent(password)}@localhost:${port}/alleviare` });
  await c.connect();
  await c.query(fs.readFileSync(path.join(root, 'supabase/local/supabase_stubs.sql'), 'utf8'));
  const dir = path.join(root, 'supabase/migrations');
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.sql')).sort()) {
    await c.query(fs.readFileSync(path.join(dir, f), 'utf8'));
  }
  if (process.env.DEV_DB_SEED === 'true') await c.query(fs.readFileSync(path.join(root, 'supabase/seed/dev_seed.sql'), 'utf8'));
  await c.end();
  console.log('migrations applied');
}
console.log(`PostgreSQL ready: jdbc:postgresql://localhost:${port}/alleviare (user postgres)`);
setInterval(() => {}, 1 << 30);
