import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Determine SSL requirements based on environment / connection string
const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

const isCloudPostgres = 
  databaseUrl && (
    databaseUrl.includes('neon.tech') ||
    databaseUrl.includes('supabase.co') ||
    databaseUrl.includes('postgres.database.azure.com') ||
    databaseUrl.includes('rds.amazonaws.com') ||
    databaseUrl.includes('render.com') ||
    databaseUrl.includes('sslmode=require')
  );

const poolConfig = databaseUrl
  ? {
      connectionString: databaseUrl,
      ssl: isCloudPostgres || process.env.PGSSL === 'true' 
        ? { rejectUnauthorized: false } 
        : false,
      max: parseInt(process.env.PG_MAX_POOL || '20', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'alleviare_sfa',
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
      max: parseInt(process.env.PG_MAX_POOL || '20', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

let pool = null;
let isConnected = false;
let lastError = null;

export const initPool = () => {
  if (!pool) {
    try {
      pool = new Pool(poolConfig);

      pool.on('connect', (client) => {
        isConnected = true;
        lastError = null;
      });

      pool.on('error', (err) => {
        console.error('⚠️ [PostgreSQL Pool Error]:', err.message);
        lastError = err.message;
      });
    } catch (err) {
      console.error('⚠️ [PostgreSQL Init Failed]:', err.message);
      lastError = err.message;
    }
  }
  return pool;
};

// Initialize pool eagerly
pool = initPool();

/**
 * Execute a SQL query with parameter bindings
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<pg.QueryResult>}
 */
export const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_SQL === 'true') {
      console.log(`⏱️ [SQL Query] (${duration}ms):`, text, params);
    }
    return res;
  } catch (error) {
    console.error(`❌ [SQL Error] in query: "${text}"`, error.message);
    throw error;
  }
};

/**
 * Acquire a dedicated client for multi-statement ACID transactions
 */
export const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const originalRelease = client.release.bind(client);

  // Set timeout on acquired client to avoid leak
  const timeout = setTimeout(() => {
    console.error('⚠️ A PostgreSQL client has been checked out for more than 5 seconds!');
  }, 5000);

  client.release = () => {
    clearTimeout(timeout);
    return originalRelease();
  };

  return client;
};

/**
 * Run a transaction safely with automatic rollback on error
 * @param {Function} callback - Async function receiving (client)
 */
export const transaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

/**
 * Check PostgreSQL database health, round-trip latency, and pool metrics
 */
export const checkDbHealth = async () => {
  const start = Date.now();
  try {
    const res = await pool.query('SELECT NOW() as server_time, version() as pg_version, current_database() as database_name');
    const latencyMs = Date.now() - start;
    
    // Count active tables
    const tableRes = await pool.query(`
      SELECT count(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    return {
      status: 'CONNECTED',
      latencyMs,
      database: res.rows[0].database_name,
      serverTime: res.rows[0].server_time,
      pgVersion: res.rows[0].pg_version.split(' ')[0] + ' ' + res.rows[0].pg_version.split(' ')[1],
      totalTables: parseInt(tableRes.rows[0].table_count, 10),
      pool: {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
      }
    };
  } catch (error) {
    return {
      status: 'DISCONNECTED',
      latencyMs: Date.now() - start,
      error: error.message,
      configuredUrl: databaseUrl ? `${databaseUrl.split('@')[1] || 'URL Provided'}` : 'localhost:5432'
    };
  }
};

export default {
  query,
  getClient,
  transaction,
  checkDbHealth,
  initPool,
  pool
};
