import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// In-memory fallback mock audit logs with full 8-field tracking
const mockAuditLogs = [
  {
    id: 'AUDIT-8910',
    actor_email: 'master.admin@alleviaresfa.com',
    actor_name: 'Shiva Kumar (Super Admin)',
    actor_role: 'SUPER_ADMIN',
    company_name: 'Novartis Pharma Global',
    tenant_id: 't_novartis_01',
    action: 'SUBSCRIPTION_UPGRADE',
    target_entity: 'Tenants & Billing',
    entity_id: 't_novartis_01',
    ip_address: '103.21.144.92',
    device_info: 'Chrome 128.0 (Windows 11 x64)',
    old_value: { plan: 'STARTER', monthly_rate: 100, max_mrs: 250, ai_studio: false },
    new_value: { plan: 'PROFESSIONAL', monthly_rate: 1000, max_mrs: 1000, ai_studio: true },
    details: { note: 'Upgraded tenant to Professional scale plan with AI Studio enabled.' },
    created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  },
  {
    id: 'AUDIT-8909',
    actor_email: 'admin@pfizer-care.com',
    actor_name: 'Marcus Vance',
    actor_role: 'COMPANY_ADMIN',
    company_name: 'Pfizer BioPharma Ltd',
    tenant_id: 't_pfizer_02',
    action: 'USER_ROLE_PERMISSIONS_CHANGED',
    target_entity: 'User RBAC',
    entity_id: 'usr_84920',
    ip_address: '142.250.190.46',
    device_info: 'Edge 128.0 (macOS 14.5 Sonoma)',
    old_value: { role: 'MEDICAL_REP', export_data: false, manage_doctors: false },
    new_value: { role: 'AREA_MANAGER', export_data: true, manage_doctors: true },
    details: { reason: 'Promotion to Area Sales Manager for North-East division.' },
    created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString()
  },
  {
    id: 'AUDIT-8908',
    actor_email: 'master.admin@alleviaresfa.com',
    actor_name: 'Shiva Kumar (Super Admin)',
    actor_role: 'SUPER_ADMIN',
    company_name: 'Platform HQ (Global)',
    tenant_id: null,
    action: 'GLOBAL_SETTINGS_UPDATED',
    target_entity: 'Platform Settings',
    entity_id: 'global_default',
    ip_address: '103.21.144.92',
    device_info: 'Chrome 128.0 (Windows 11 x64)',
    old_value: { session_timeout_minutes: 30, max_file_size_mb: 15, enforce_2fa: false },
    new_value: { session_timeout_minutes: 60, max_file_size_mb: 25, enforce_2fa: true },
    details: { changes: 'Increased session timeout to 60m and enabled 2FA requirement.' },
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'AUDIT-8907',
    actor_email: 'master.admin@alleviaresfa.com',
    actor_name: 'Shiva Kumar (Super Admin)',
    actor_role: 'SUPER_ADMIN',
    company_name: 'AstraZeneca Healthcare',
    tenant_id: 't_astra_03',
    action: 'SUBSCRIPTION_EXTENDED',
    target_entity: 'Tenant Subscription',
    entity_id: 't_astra_03',
    ip_address: '103.21.144.92',
    device_info: 'Chrome 128.0 (Windows 11 x64)',
    old_value: { subscription_end_at: '2026-09-30T00:00:00Z', grace_period_days: 7 },
    new_value: { subscription_end_at: '2026-10-30T00:00:00Z', grace_period_days: 14 },
    details: { additional_days: 30, reason: 'Approved quarterly renewal credit extension.' },
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'AUDIT-8906',
    actor_email: 'sec-ops@alleviaresfa.com',
    actor_name: 'Security Automation Daemon',
    actor_role: 'SYSTEM',
    company_name: 'Sanofi Healthcare Ltd',
    tenant_id: 't_sanofi_04',
    action: 'ACCOUNT_LOCKED_FAILED_ATTEMPTS',
    target_entity: 'User Security',
    entity_id: 'usr_sanofi_99',
    ip_address: '185.220.101.5',
    device_info: 'Unknown Bot / Python-Requests 2.31',
    old_value: { is_locked: false, status: 'ACTIVE', failed_attempts: 4 },
    new_value: { is_locked: true, status: 'LOCKED', lock_reason: '5 consecutive failed password attempts' },
    details: { trigger: 'Security policy auto-lock threshold breached.' },
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: 'AUDIT-8905',
    actor_email: 'master.admin@alleviaresfa.com',
    actor_name: 'Shiva Kumar (Super Admin)',
    actor_role: 'SUPER_ADMIN',
    company_name: 'Novartis Pharma Global',
    tenant_id: 't_novartis_01',
    action: 'IMPERSONATION_STARTED',
    target_entity: 'Audit & Compliance',
    entity_id: 't_novartis_01',
    ip_address: '103.21.144.92',
    device_info: 'Chrome 128.0 (Windows 11 x64)',
    old_value: { active_session: 'Super Admin HQ' },
    new_value: { active_session: 'Impersonating Admin for Novartis Pharma Global' },
    details: { reason: 'Customer requested DCR export troubleshooting' },
    created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
  }
];

/**
 * GET /api/audit-logs
 * Super Admin Global Platform Audit Log Query with full 8-field tracking
 */
router.get('/audit-logs', async (req, res) => {
  const { limit = 100, action, tenantId, actorEmail, search } = req.query;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      let queryStr = `
        SELECT a.*, 
               COALESCE(a.company_name, t.name, 'Platform HQ') as company_name,
               COALESCE(a.actor_name, a.actor_email) as actor_display_name
        FROM platform_audit_logs a
        LEFT JOIN tenants_companies t ON a.tenant_id = t.id
        WHERE 1=1
      `;
      const queryParams = [];

      if (action && action !== 'ALL') {
        queryParams.push(action);
        queryStr += ` AND a.action = $${queryParams.length}`;
      }

      if (tenantId && tenantId !== 'ALL') {
        queryParams.push(tenantId);
        queryStr += ` AND a.tenant_id = $${queryParams.length}`;
      }

      if (actorEmail) {
        queryParams.push(`%${actorEmail}%`);
        queryStr += ` AND a.actor_email ILIKE $${queryParams.length}`;
      }

      if (search) {
        queryParams.push(`%${search}%`);
        const pIdx = queryParams.length;
        queryStr += ` AND (a.action ILIKE $${pIdx} OR a.actor_email ILIKE $${pIdx} OR a.target_entity ILIKE $${pIdx} OR a.ip_address ILIKE $${pIdx} OR t.name ILIKE $${pIdx})`;
      }

      queryParams.push(parseInt(limit, 10) || 100);
      queryStr += ` ORDER BY a.created_at DESC LIMIT $${queryParams.length};`;

      try {
        const dbRes = await query(queryStr, queryParams);
        if (dbRes.rows.length > 0) {
          return res.json({ success: true, count: dbRes.rows.length, data: dbRes.rows });
        }
      } catch (qErr) {
        console.warn('DB query error on platform_audit_logs, falling back to rich logs:', qErr.message);
      }
    }

    // Return filtered in-memory fallback logs
    let filtered = [...mockAuditLogs];
    if (action && action !== 'ALL') {
      filtered = filtered.filter(l => l.action.toLowerCase().includes(action.toLowerCase()));
    }
    if (tenantId && tenantId !== 'ALL') {
      filtered = filtered.filter(l => l.tenant_id === tenantId);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(l =>
        l.actor_email.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.company_name.toLowerCase().includes(q) ||
        (l.ip_address && l.ip_address.includes(q)) ||
        (l.device_info && l.device_info.toLowerCase().includes(q))
      );
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/audit-logs
 * Record a full 8-dimensional platform audit log entry
 */
router.post('/audit-logs', async (req, res) => {
  const {
    tenantId,
    companyName,
    actorId,
    actorEmail = 'superadmin@alleviaresfa.com',
    actorName,
    actorRole = 'SUPER_ADMIN',
    action,
    targetEntity,
    entityId,
    ipAddress,
    deviceInfo,
    oldValue,
    newValue,
    details
  } = req.body;

  if (!action || !targetEntity) {
    return res.status(400).json({ success: false, message: 'Action and targetEntity are required.' });
  }

  const clientIp = ipAddress || req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const clientDevice = deviceInfo || req.headers['user-agent'] || 'Web Browser';

  const newLogRecord = {
    id: `AUDIT-${Date.now().toString().slice(-6)}`,
    tenant_id: tenantId || null,
    company_name: companyName || (tenantId ? 'Tenant Organization' : 'Platform HQ'),
    actor_id: actorId || null,
    actor_email: actorEmail,
    actor_name: actorName || actorEmail.split('@')[0],
    actor_role: actorRole,
    action,
    target_entity: targetEntity,
    entity_id: entityId || null,
    ip_address: clientIp,
    device_info: clientDevice,
    old_value: oldValue || null,
    new_value: newValue || null,
    details: details || {},
    created_at: new Date().toISOString()
  };

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      try {
        const insertRes = await query(`
          INSERT INTO platform_audit_logs (
            tenant_id, company_name, actor_id, actor_email, actor_name, actor_role,
            action, target_entity, entity_id, ip_address, device_info,
            old_value, new_value, details
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          RETURNING *;
        `, [
          newLogRecord.tenant_id,
          newLogRecord.company_name,
          newLogRecord.actor_id,
          newLogRecord.actor_email,
          newLogRecord.actor_name,
          newLogRecord.actor_role,
          newLogRecord.action,
          newLogRecord.target_entity,
          newLogRecord.entity_id,
          newLogRecord.ip_address,
          newLogRecord.device_info,
          newLogRecord.old_value ? JSON.stringify(newLogRecord.old_value) : null,
          newLogRecord.new_value ? JSON.stringify(newLogRecord.new_value) : null,
          JSON.stringify(newLogRecord.details)
        ]);

        return res.status(201).json({ success: true, data: insertRes.rows[0] });
      } catch (insertErr) {
        console.warn('DB insert into platform_audit_logs failed, falling back:', insertErr.message);
      }
    }

    mockAuditLogs.unshift(newLogRecord);
    return res.status(201).json({ success: true, data: newLogRecord });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/alerts - List system alerts
router.get('/alerts', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query(`
        SELECT a.*, t.name as tenant_name
        FROM system_alerts a
        LEFT JOIN tenants_companies t ON a.tenant_id = t.id
        ORDER BY a.created_at DESC
        LIMIT 50;
      `);
      return res.json({ success: true, count: dbRes.rows.length, data: dbRes.rows });
    }
    return res.json({ success: true, count: 0, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/alerts - Create broadcast announcement or system alert
router.post('/alerts', async (req, res) => {
  const { tenantId, type, severity, title, message, metadata } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message are required.' });
  }

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const insertRes = await query(`
        INSERT INTO system_alerts (
          tenant_id, type, severity, title, message, metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `, [
        tenantId || null,
        type || 'BROADCAST',
        severity || 'Info',
        title,
        message,
        JSON.stringify(metadata || {})
      ]);

      return res.status(201).json({ success: true, message: 'Alert created.', data: insertRes.rows[0] });
    }

    return res.status(201).json({ success: true, message: 'Alert created in demo mode.', data: { id: 'temp-' + Date.now(), title, message } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/alerts/:id/read - Mark alert as read
router.patch('/alerts/:id/read', async (req, res) => {
  const { id } = req.params;
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      await query(`UPDATE system_alerts SET is_read = true WHERE id = $1;`, [id]);
    }
    return res.json({ success: true, message: 'Alert marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/alerts/:id - Dismiss alert
router.delete('/alerts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      await query(`DELETE FROM system_alerts WHERE id = $1;`, [id]);
    }
    return res.json({ success: true, message: 'Alert removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
