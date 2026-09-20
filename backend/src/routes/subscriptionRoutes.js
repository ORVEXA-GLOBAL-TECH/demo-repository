import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// GET /api/subscriptions - List all tenant subscriptions
router.get('/', async (req, res) => {
  const { tenantId, status } = req.query;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      let queryStr = `
        SELECT 
          s.*,
          t.name as tenant_name,
          t.code as tenant_code,
          t.country_code,
          t.contact_email
        FROM tenant_subscriptions s
        JOIN tenants_companies t ON s.tenant_id = t.id
        WHERE 1=1
      `;
      const queryParams = [];

      if (tenantId) {
        queryParams.push(tenantId);
        queryStr += ` AND s.tenant_id = $${queryParams.length}`;
      }

      if (status) {
        queryParams.push(status);
        queryStr += ` AND s.status = $${queryParams.length}`;
      }

      queryStr += ` ORDER BY s.created_at DESC;`;

      const dbRes = await query(queryStr, queryParams);
      return res.json({ success: true, count: dbRes.rows.length, data: dbRes.rows });
    }

    return res.json({ success: true, count: 0, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/subscriptions - Create / assign subscription plan to tenant
router.post('/', async (req, res) => {
  const {
    tenantId,
    planTier,
    startDate,
    expiryDate,
    autoRenew,
    invoiceCurrency,
    amountBilled,
    billingInterval,
    paymentMethod,
    status
  } = req.body;

  if (!tenantId || !planTier) {
    return res.status(400).json({ success: false, message: 'Tenant ID and plan tier are required.' });
  }

  const start = startDate || new Date().toISOString().split('T')[0];
  const expiry = expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const insertRes = await query(`
        INSERT INTO tenant_subscriptions (
          tenant_id, plan_tier, status, start_date, expiry_date,
          auto_renew, invoice_currency, amount_billed, billing_interval, payment_method
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `, [
        tenantId,
        planTier,
        status || 'Active',
        start,
        expiry,
        autoRenew !== undefined ? autoRenew : true,
        invoiceCurrency || 'USD',
        amountBilled || 0.00,
        billingInterval || 'Monthly',
        paymentMethod || 'Bank Wire / ACH'
      ]);

      // Update tenant plan
      await query('UPDATE tenants_companies SET plan = $1, billing_cycle = $2, monthly_rate = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4', [
        planTier,
        billingInterval || 'Monthly',
        amountBilled || 0.00,
        tenantId
      ]);

      // Audit log
      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'SUBSCRIPTION_ASSIGNED',
        'tenant_subscriptions',
        insertRes.rows[0].id,
        JSON.stringify({ tenantId, planTier, amountBilled })
      ]);

      return res.status(201).json({
        success: true,
        message: 'Subscription plan created and assigned.',
        data: insertRes.rows[0]
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Subscription created in demo mode.',
      data: { id: 'temp-sub-' + Date.now(), tenantId, planTier }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/subscriptions/:id - Update subscription
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    planTier,
    status,
    expiryDate,
    autoRenew,
    amountBilled,
    billingInterval,
    paymentMethod
  } = req.body;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const updateRes = await query(`
        UPDATE tenant_subscriptions
        SET
          plan_tier = COALESCE($1, plan_tier),
          status = COALESCE($2, status),
          expiry_date = COALESCE($3, expiry_date),
          auto_renew = COALESCE($4, auto_renew),
          amount_billed = COALESCE($5, amount_billed),
          billing_interval = COALESCE($6, billing_interval),
          payment_method = COALESCE($7, payment_method)
        WHERE id = $8
        RETURNING *;
      `, [
        planTier,
        status,
        expiryDate,
        autoRenew,
        amountBilled,
        billingInterval,
        paymentMethod,
        id
      ]);

      if (updateRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Subscription record not found.' });
      }

      return res.json({
        success: true,
        message: 'Subscription updated successfully.',
        data: updateRes.rows[0]
      });
    }

    return res.json({
      success: true,
      message: 'Subscription updated in demo mode.',
      data: { id, ...req.body }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/subscriptions/:id - Delete subscription record
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const delRes = await query('DELETE FROM tenant_subscriptions WHERE id = $1 RETURNING id;', [id]);
      if (delRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Subscription not found.' });
      }
      return res.json({ success: true, message: 'Subscription removed.' });
    }
    return res.json({ success: true, message: `Subscription ${id} deleted in demo mode.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
