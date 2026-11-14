// Shared plumbing for DB-first routes: connectivity check, tenant/employee
// resolution and the "database first, mock fallback" dispatcher.
import jwt from 'jsonwebtoken';
import { query, checkDbHealth } from '../config/db.js';
import { config } from '../config/index.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v) => typeof v === 'string' && UUID_RE.test(v);

// ---- connectivity (cached so every request does not run a health query) ----
const HEALTH_TTL_MS = 10_000;
let health = { ok: false, at: 0 };

export async function dbReady() {
  if (Date.now() - health.at < HEALTH_TTL_MS) return health.ok;
  const res = await checkDbHealth();
  health = { ok: res.status === 'CONNECTED', at: Date.now() };
  return health.ok;
}

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Postgres codes meaning "schema not migrated yet" -> behave as if DB offline.
const SCHEMA_MISSING = new Set(['42P01', '42703']);

/**
 * Run `db(ctx)` when PostgreSQL is reachable and migrated, otherwise `mock()`.
 * Both return `{ status?, body }`. Real DB errors surface as 5xx/4xx, they are
 * never silently swallowed by the mock.
 */
export async function dual(req, res, { db, mock }) {
  try {
    if (await dbReady()) {
      try {
        const ctx = await resolveContext(req);
        if (ctx) {
          const out = await db(ctx);
          return res.status(out.status || 200).json(out.body);
        }
      } catch (err) {
        if (!SCHEMA_MISSING.has(err.code)) throw err;
        console.warn(`⚠️ [repo] schema not migrated (${err.code}); using mock data. Run \`npm run db:migrate\`.`);
      }
    }
    const out = await mock();
    return res.status(out.status || 200).json(out.body);
  } catch (err) {
    const status = err.status || (err.code === '23503' ? 409 : err.code === '23505' ? 409 : 500);
    return res.status(status).json({ success: false, error: err.message, message: err.message });
  }
}

// ---- request context -------------------------------------------------------
export function readUser(req) {
  if (req.user) return req.user;
  let token = req.cookies?.access_token;
  const auth = req.headers.authorization;
  if (!token && auth?.startsWith('Bearer ')) token = auth.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    return null;
  }
}

const empName = `(e.first_name || ' ' || e.last_name)`;
export const EMPLOYEE_NAME_SQL = empName;

/**
 * Resolve { companyId, employee, identified }.
 *  - employee comes from the JWT email, else an explicit employee UUID in the
 *    request (`mrId`), else (writes only) a name match / first active employee.
 *  - `identified` is true only for the first two (a real, requested identity).
 */
export async function resolveContext(req) {
  const user = readUser(req);
  const body = req.body || {};
  const q = req.query || {};
  let employee = null;
  let identified = false;

  if (user?.email) {
    const r = await query(
      `SELECT * FROM public.employees WHERE lower(email) = lower($1) LIMIT 1`, [user.email]);
    employee = r.rows[0] || null;
    identified = !!employee;
  }

  let companyId = employee?.company_id || null;
  const hinted = req.headers['x-company-id'] || q.companyId;
  if (!companyId && isUuid(hinted)) companyId = hinted;
  if (!companyId) {
    const r = await query(`SELECT id FROM public.companies WHERE status <> 'ARCHIVED' ORDER BY created_at LIMIT 1`);
    companyId = r.rows[0]?.id || null;
  }
  if (!companyId) return null;

  const explicit = body.mrId || q.mrId;
  if (!employee && isUuid(explicit)) {
    const r = await query(`SELECT * FROM public.employees WHERE id = $1 AND company_id = $2`, [explicit, companyId]);
    employee = r.rows[0] || null;
    identified = !!employee;
  }

  // MRs are scoped to their own records (see middleware/rbac.js).
  const ownOnly = user && ['MR', 'MEDICAL_REP', 'FIELD_MR'].includes(user.role);
  return {
    companyId,
    user,
    employee,
    identified,
    scopeEmployeeId: ownOnly && employee ? employee.id : null,
    // Lazily pick someone for writes when the caller did not identify themselves.
    async actingEmployee() {
      if (employee) return employee;
      const name = body.mrName || q.mrName;
      let r = { rows: [] };
      if (name) {
        r = await query(
          `SELECT * FROM public.employees e WHERE company_id = $1 AND lower(${empName}) = lower($2) LIMIT 1`,
          [companyId, name]);
      }
      if (!r.rows[0]) {
        r = await query(
          `SELECT * FROM public.employees WHERE company_id = $1 AND status = 'ACTIVE' ORDER BY created_at LIMIT 1`,
          [companyId]);
      }
      if (!r.rows[0]) throw new HttpError(400, 'No employee record found for this company');
      employee = r.rows[0];
      return employee;
    }
  };
}

// ---- small helpers ---------------------------------------------------------
export const slug = (s) =>
  String(s || '').trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'GENERAL';

export const num = (v, d = 0) => (v === undefined || v === null || v === '' || Number.isNaN(Number(v)) ? d : Number(v));

/** Split `data` into [coreFields, metadata] given the core keys a table stores in columns. */
export function splitMetadata(data, coreKeys) {
  const meta = {};
  for (const [k, v] of Object.entries(data || {})) {
    if (k === 'id' || coreKeys.includes(k)) continue;
    meta[k] = v;
  }
  return meta;
}

/** Find-or-create a lookup row by (company_id, <col>) and return its id. */
export async function ensureLookup(client, table, companyId, col, value, extra = {}) {
  if (!value) return null;
  const found = await client.query(
    `SELECT id FROM public.${table} WHERE company_id = $1 AND lower(${col}) = lower($2) LIMIT 1`,
    [companyId, value]);
  if (found.rows[0]) return found.rows[0].id;
  const cols = ['company_id', col, ...Object.keys(extra)];
  const vals = [companyId, value, ...Object.values(extra)];
  const ins = await client.query(
    `INSERT INTO public.${table} (${cols.join(',')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(',')})
     ON CONFLICT DO NOTHING RETURNING id`, vals);
  if (ins.rows[0]) return ins.rows[0].id;
  const again = await client.query(
    `SELECT id FROM public.${table} WHERE company_id = $1 AND lower(${col}) = lower($2) LIMIT 1`,
    [companyId, value]);
  return again.rows[0]?.id || null;
}

export { query };
