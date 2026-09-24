import { query } from '../config/db.js';

// In-memory real-time buffer for sub-millisecond querying (max 2,000 items)
const MAX_BUFFER_SIZE = 2000;
let liveLogBuffer = [];
let logIdCounter = 1;

/**
 * Route to Service Name mapping
 */
function getServiceName(url) {
  if (!url) return 'API Gateway';
  if (url.startsWith('/api/auth')) return 'Auth Service';
  if (url.startsWith('/api/tenants')) return 'Tenant Management';
  if (url.startsWith('/api/users')) return 'User & Role IAM';
  if (url.startsWith('/api/system-health')) return 'System Health & Telemetry';
  if (url.startsWith('/api/dcr')) return 'DCR Reporting Engine';
  if (url.startsWith('/api/orders')) return 'Order & Stockist Engine';
  if (url.startsWith('/api/catalog')) return 'Pharma Product Catalog';
  if (url.startsWith('/api/expenses')) return 'Expense Reimbursement';
  if (url.startsWith('/api/tour-plans')) return 'Tour Planning MTP';
  if (url.startsWith('/api/analytics') || url.startsWith('/api/dashboard')) return 'Analytics & BI Engine';
  if (url.startsWith('/api/tracking') || url.startsWith('/api/gps')) return 'GPS & Telemetry';
  if (url.startsWith('/api/notifications')) return 'Push Notification Service';
  if (url.startsWith('/api/upload') || url.startsWith('/api/storage')) return 'Cloud Storage S3';
  if (url.startsWith('/api/billing') || url.startsWith('/api/subscriptions')) return 'Billing & Subscriptions';
  if (url.startsWith('/api/tickets') || url.startsWith('/api/support-tickets')) return 'Support Desk';
  if (url.startsWith('/api/fx-rates')) return 'Multi-Currency FX';
  return 'API Gateway';
}

/**
 * Log a real-time event to memory buffer and persistent PostgreSQL table
 */
export const logEvent = async ({
  level = 'INFO',
  service = 'API Gateway',
  message,
  path = null,
  method = null,
  statusCode = null,
  ipAddress = '127.0.0.1',
  durationMs = 0.00,
  tenantId = 'system',
  details = {}
}) => {
  const timestamp = new Date().toISOString();
  const entry = {
    id: logIdCounter++,
    level: level.toUpperCase(),
    service,
    message,
    path,
    method: method ? method.toUpperCase() : null,
    statusCode: statusCode ? parseInt(statusCode, 10) : null,
    ipAddress: ipAddress || '127.0.0.1',
    durationMs: parseFloat(durationMs || 0),
    tenantId: tenantId || 'system',
    details,
    createdAt: timestamp
  };

  // Add to in-memory live buffer (newest first)
  liveLogBuffer.unshift(entry);
  if (liveLogBuffer.length > MAX_BUFFER_SIZE) {
    liveLogBuffer.pop();
  }

  // Persist asynchronously to PostgreSQL database if table exists
  try {
    query(`
      INSERT INTO platform_backend_logs (
        level, service, message, path, method, status_code, ip_address, duration_ms, tenant_id, details, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      entry.level,
      entry.service,
      entry.message,
      entry.path,
      entry.method,
      entry.statusCode,
      entry.ipAddress,
      entry.durationMs,
      entry.tenantId,
      JSON.stringify(entry.details),
      entry.createdAt
    ]).catch(() => {
      // Table might not be ready or DB temporarily down; memory buffer holds the log
    });
  } catch (err) {
    // Non-blocking
  }

  return entry;
};

/**
 * Record API Call metric for SLA & traffic tracking
 */
export const recordApiMetric = async ({
  endpoint,
  method,
  statusCode,
  latencyMs,
  callerIp = '127.0.0.1',
  tenantId = 'system'
}) => {
  try {
    query(`
      INSERT INTO platform_api_metrics_logs (
        endpoint, method, status_code, latency_ms, caller_ip, tenant_id, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [
      endpoint,
      (method || 'GET').toUpperCase(),
      parseInt(statusCode || 200, 10),
      parseFloat(latencyMs || 0),
      callerIp,
      tenantId
    ]).catch(() => {});
  } catch (err) {
    // Non-blocking
  }
};

/**
 * Express Middleware: Intercepts all requests & responses to log live telemetry
 */
export const telemetryMiddleware = (req, res, next) => {
  const startTime = process.hrtime();
  const callerIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const tenantId = req.headers['x-tenant-id'] || req.headers['x-company-id'] || 'system';

  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const durationMs = parseFloat(((diff[0] * 1e3) + (diff[1] * 1e-6)).toFixed(2));
    const statusCode = res.statusCode;

    // Determine log level based on HTTP status
    let level = 'HTTP';
    if (statusCode >= 500) {
      level = 'ERROR';
    } else if (statusCode >= 400) {
      level = 'WARN';
    }

    const service = getServiceName(req.originalUrl || req.url);
    const message = `${req.method} ${req.originalUrl || req.url} - ${statusCode} (${durationMs}ms)`;

    // Record backend log
    logEvent({
      level,
      service,
      message,
      path: req.originalUrl || req.url,
      method: req.method,
      statusCode,
      ipAddress: Array.isArray(callerIp) ? callerIp[0] : callerIp.toString().replace('::ffff:', ''),
      durationMs,
      tenantId,
      details: {
        userAgent: req.headers['user-agent'] || 'Unknown',
        contentLength: res.get('content-length') || null
      }
    });

    // Record API latency & SLA metric
    if (req.originalUrl && req.originalUrl.startsWith('/api')) {
      // Normalize endpoint path (strip query string)
      const cleanEndpoint = req.originalUrl.split('?')[0];
      recordApiMetric({
        endpoint: cleanEndpoint,
        method: req.method,
        statusCode,
        latencyMs: durationMs,
        callerIp: Array.isArray(callerIp) ? callerIp[0] : callerIp.toString().replace('::ffff:', ''),
        tenantId
      });
    }
  });

  next();
};

/**
 * Query real-time logs (merges database and memory buffer)
 */
export const queryRealTimeLogs = async ({
  level = 'ALL',
  service = 'ALL',
  search = '',
  limit = 100
}) => {
  const maxLimit = parseInt(limit, 10) || 100;
  let dbLogs = [];

  try {
    let queryStr = `
      SELECT 
        id, 
        level, 
        service, 
        message, 
        path, 
        method, 
        status_code as "statusCode", 
        ip_address as "ipAddress", 
        duration_ms as "durationMs", 
        tenant_id as "tenantId", 
        created_at as "createdAt"
      FROM platform_backend_logs 
      WHERE 1=1
    `;
    const params = [];
    let pIdx = 1;

    if (level && level !== 'ALL') {
      queryStr += ` AND level = $${pIdx++}`;
      params.push(level.toUpperCase());
    }
    if (service && service !== 'ALL') {
      queryStr += ` AND service ILIKE $${pIdx++}`;
      params.push(`%${service}%`);
    }
    if (search && search.trim()) {
      queryStr += ` AND (message ILIKE $${pIdx} OR path ILIKE $${pIdx} OR service ILIKE $${pIdx})`;
      params.push(`%${search.trim()}%`);
      pIdx++;
    }

    queryStr += ` ORDER BY created_at DESC LIMIT $${pIdx}`;
    params.push(maxLimit);

    const res = await query(queryStr, params);
    if (res && res.rows) {
      dbLogs = res.rows;
    }
  } catch (err) {
    // If DB is offline, fall back to in-memory buffer
  }

  // Filter in-memory logs
  let memLogs = [...liveLogBuffer];
  if (level && level !== 'ALL') {
    memLogs = memLogs.filter(l => l.level === level.toUpperCase());
  }
  if (service && service !== 'ALL') {
    memLogs = memLogs.filter(l => l.service.toLowerCase().includes(service.toLowerCase()));
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    memLogs = memLogs.filter(l =>
      (l.message && l.message.toLowerCase().includes(q)) ||
      (l.path && l.path.toLowerCase().includes(q)) ||
      (l.service && l.service.toLowerCase().includes(q))
    );
  }

  // If DB returned rows, use DB rows as primary source. Otherwise use memLogs.
  const combinedLogs = dbLogs.length > 0 ? dbLogs : memLogs.slice(0, maxLimit);

  // Compute log summary counts based on current filtered dataset
  const levelCounts = {
    ALL: combinedLogs.length,
    INFO: combinedLogs.filter(l => l.level === 'INFO').length,
    WARN: combinedLogs.filter(l => l.level === 'WARN').length,
    ERROR: combinedLogs.filter(l => l.level === 'ERROR').length,
    HTTP: combinedLogs.filter(l => l.level === 'HTTP').length,
    DEBUG: combinedLogs.filter(l => l.level === 'DEBUG').length
  };

  return {
    count: combinedLogs.length,
    levelCounts,
    logs: combinedLogs
  };
};

/**
 * Clear all live logs (DB + Memory buffer)
 */
export const clearAllLogs = async () => {
  liveLogBuffer = [];
  logIdCounter = 1;
  try {
    await query(`TRUNCATE TABLE platform_backend_logs RESTART IDENTITY CASCADE;`);
    await query(`TRUNCATE TABLE platform_api_metrics_logs RESTART IDENTITY CASCADE;`);
  } catch (err) {
    try {
      await query(`DELETE FROM platform_backend_logs;`);
      await query(`DELETE FROM platform_api_metrics_logs;`);
    } catch (e) {
      // Ignored
    }
  }
  return true;
};
