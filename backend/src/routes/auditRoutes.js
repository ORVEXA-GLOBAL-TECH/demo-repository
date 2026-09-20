import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// GET /api/audit-logs - Query platform audit logs
router.get('/audit-logs', async (req, res) => {
  const { limit = 50, action, tenantId } = req.query;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      let queryStr = `
        SELECT a.*, t.name as tenant_name
        FROM platform_audit_logs a
        LEFT JOIN tenants_companies t ON a.tenant_id = t.id
        WHERE 1=1
      `;
      const queryParams = [];

      if (action) {
        queryParams.push(action);
        queryStr += ` AND a.action = $${queryParams.length}`;
      }

      if (tenantId) {
        queryParams.push(tenantId);
        queryStr += ` AND a.tenant_id = $${queryParams.length}`;
      }

      queryParams.push(parseInt(limit, 10) || 50);
      queryStr += ` ORDER BY a.created_at DESC LIMIT $${queryParams.length};`;

      const dbRes = await query(queryStr, queryParams);
      return res.json({ success: true, count: dbRes.rows.length, data: dbRes.rows });
    }

    return res.json({ success: true, count: 0, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/audit-logs - Record an audit log entry
router.post('/audit-logs', async (req, res) => {
  const {
    tenantId,
    actorEmail = 'superadmin@alleviaresfa.com',
    actorRole = 'SUPER_ADMIN',
    action,
    targetEntity,
    entityId,
    details,
    ipAddress,
    userAgent
  } = req.body;

  if (!action || !targetEntity) {
    return res.status(400).json({ success: false, message: 'Action and targetEntity are required.' });
  }

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const insertRes = await query(`
        INSERT INTO platform_audit_logs (
          tenant_id, actor_email, actor_role, action, target_entity, entity_id, details, ip_address, user_agent
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `, [
        tenantId || null,
        actorEmail,
        actorRole,
        action,
        targetEntity,
        entityId || null,
        JSON.stringify(details || {}),
        ipAddress || req.ip || '',
        userAgent || req.headers['user-agent'] || ''
      ]);

      return res.status(201).json({ success: true, data: insertRes.rows[0] });
    }

    return res.status(201).json({ success: true, data: { id: 'temp-log-' + Date.now(), ...req.body } });
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
      await query('UPDATE system_alerts SET is_read = true WHERE id = $1;', [id]);
      return res.json({ success: true, message: 'Alert marked as read.' });
    }
    return res.json({ success: true, message: 'Alert marked as read in demo mode.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/alerts/:id - Delete alert
router.delete('/alerts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      await query('DELETE FROM system_alerts WHERE id = $1;', [id]);
      return res.json({ success: true, message: 'Alert removed.' });
    }
    return res.json({ success: true, message: `Alert ${id} removed.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
