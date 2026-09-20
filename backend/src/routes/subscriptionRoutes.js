import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// Standard Tier Rates
const TIER_PRICING = {
  FREE_TRIAL: 0,
  TRIAL: 0,
  STARTER: 100,
  BASIC: 100,
  PROFESSIONAL: 1000,
  PRO: 1000,
  ENTERPRISE: 2500,
  CUSTOM: null
};

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
          t.contact_email,
          t.trial_start_at,
          t.trial_end_at,
          t.subscription_start_at,
          t.subscription_end_at,
          t.is_custom_pricing,
          t.custom_rate
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

// GET /api/subscriptions/revenue-metrics - Real-time revenue & telemetry calculation
router.get('/revenue-metrics', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const metricsRes = await query(`
        SELECT 
          COUNT(*) as total_tenants,
          COUNT(CASE WHEN status = 'Active' OR status = 'ACTIVE' THEN 1 END) as active_tenants,
          COUNT(CASE WHEN status = 'Trial' OR status = 'TRIAL' THEN 1 END) as trial_tenants,
          COUNT(CASE WHEN status = 'Suspended' OR status = 'SUSPENDED' THEN 1 END) as suspended_tenants,
          COALESCE(SUM(CASE 
            WHEN status IN ('Active', 'ACTIVE') THEN 
              CASE WHEN is_custom_pricing AND custom_rate > 0 THEN custom_rate ELSE monthly_rate END 
            ELSE 0 
          END), 0) as total_mrr
        FROM tenants_companies;
      `);

      const row = metricsRes.rows[0];
      const mrr = Number(row.total_mrr) || 0;
      const arr = mrr * 12;

      return res.json({
        success: true,
        data: {
          totalTenants: Number(row.total_tenants) || 0,
          activeTenants: Number(row.active_tenants) || 0,
          trialTenants: Number(row.trial_tenants) || 0,
          suspendedTenants: Number(row.suspended_tenants) || 0,
          totalMRR: mrr,
          totalARR: arr,
          calculatedAt: new Date().toISOString()
        }
      });
    }

    return res.json({
      success: true,
      data: {
        totalTenants: 0,
        activeTenants: 0,
        trialTenants: 0,
        suspendedTenants: 0,
        totalMRR: 0,
        totalARR: 0,
        calculatedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/subscriptions - Create / assign subscription plan to tenant
router.post('/', async (req, res) => {
  const {
    tenantId,
    planTier = 'STARTER',
    startDate,
    expiryDate,
    startAt,
    endAt,
    autoRenew,
    invoiceCurrency = 'USD',
    amountBilled,
    customRate,
    isCustomPricing,
    billingInterval = 'Monthly',
    paymentMethod = 'Bank Wire / ACH',
    status
  } = req.body;

  if (!tenantId || !planTier) {
    return res.status(400).json({ success: false, message: 'Tenant ID and plan tier are required.' });
  }

  const normalizedTier = planTier.toUpperCase();
  const isTrial = normalizedTier === 'FREE_TRIAL' || normalizedTier === 'TRIAL';
  const isCustom = normalizedTier === 'CUSTOM' || isCustomPricing;

  let calculatedAmount = 0;
  if (isTrial) {
    calculatedAmount = 0;
  } else if (isCustom) {
    calculatedAmount = customRate !== undefined ? Number(customRate) : (amountBilled !== undefined ? Number(amountBilled) : 0);
  } else if (normalizedTier === 'STARTER' || normalizedTier === 'BASIC') {
    calculatedAmount = 100;
  } else if (normalizedTier === 'PROFESSIONAL' || normalizedTier === 'PRO') {
    calculatedAmount = 1000;
  } else if (normalizedTier === 'ENTERPRISE') {
    calculatedAmount = 2500;
  } else {
    calculatedAmount = Number(amountBilled) || 100;
  }

  const finalStart = startAt || startDate || new Date().toISOString();
  const finalEnd = endAt || expiryDate || (isTrial 
    ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  );

  const finalStatus = status || (isTrial ? 'Trial' : 'Active');

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const insertRes = await query(`
        INSERT INTO tenant_subscriptions (
          tenant_id, plan_tier, status, start_date, expiry_date,
          start_at, end_at, auto_renew, invoice_currency, amount_billed,
          billing_interval, payment_method
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
      `, [
        tenantId,
        normalizedTier,
        finalStatus,
        finalStart.split('T')[0],
        finalEnd.split('T')[0],
        finalStart,
        finalEnd,
        autoRenew !== undefined ? autoRenew : true,
        invoiceCurrency,
        calculatedAmount,
        billingInterval,
        paymentMethod
      ]);

      // Update tenant company record
      await query(`
        UPDATE tenants_companies 
        SET 
          plan = $1,
          status = $2,
          billing_cycle = $3,
          monthly_rate = $4,
          is_custom_pricing = $5,
          custom_rate = $6,
          trial_start_at = CASE WHEN $7 THEN $8::timestamptz ELSE trial_start_at END,
          trial_end_at = CASE WHEN $7 THEN $9::timestamptz ELSE trial_end_at END,
          subscription_start_at = CASE WHEN NOT $7 THEN $8::timestamptz ELSE subscription_start_at END,
          subscription_end_at = CASE WHEN NOT $7 THEN $9::timestamptz ELSE subscription_end_at END,
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = $10;
      `, [
        normalizedTier,
        finalStatus,
        billingInterval,
        calculatedAmount,
        isCustom,
        isCustom ? calculatedAmount : 0,
        isTrial,
        finalStart,
        finalEnd,
        tenantId
      ]);

      // Audit log
      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        isTrial ? 'TRIAL_ASSIGNED' : 'SUBSCRIPTION_ASSIGNED',
        'tenant_subscriptions',
        insertRes.rows[0].id,
        JSON.stringify({ tenantId, planTier: normalizedTier, amountBilled: calculatedAmount, startAt: finalStart, endAt: finalEnd })
      ]);

      return res.status(201).json({
        success: true,
        message: `Plan ${normalizedTier} assigned successfully!`,
        data: insertRes.rows[0]
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Subscription created in demo mode.',
      data: { id: 'temp-sub-' + Date.now(), tenantId, planTier: normalizedTier, amountBilled: calculatedAmount, startAt: finalStart, endAt: finalEnd }
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
    startDate,
    expiryDate,
    startAt,
    endAt,
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
          start_date = COALESCE($3, start_date),
          expiry_date = COALESCE($4, expiry_date),
          start_at = COALESCE($5, start_at),
          end_at = COALESCE($6, end_at),
          auto_renew = COALESCE($7, auto_renew),
          amount_billed = COALESCE($8, amount_billed),
          billing_interval = COALESCE($9, billing_interval),
          payment_method = COALESCE($10, payment_method)
        WHERE id = $11
        RETURNING *;
      `, [
        planTier ? planTier.toUpperCase() : null,
        status,
        startDate,
        expiryDate,
        startAt,
        endAt,
        autoRenew,
        amountBilled !== undefined ? Number(amountBilled) : null,
        billingInterval,
        paymentMethod,
        id
      ]);

      if (updateRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Subscription record not found.' });
      }

      const updatedSub = updateRes.rows[0];

      // Also update tenant company
      await query(`
        UPDATE tenants_companies
        SET
          plan = COALESCE($1, plan),
          status = COALESCE($2, status),
          monthly_rate = COALESCE($3, monthly_rate),
          subscription_end_at = COALESCE($4, subscription_end_at),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $5;
      `, [
        updatedSub.plan_tier,
        updatedSub.status,
        updatedSub.amount_billed,
        updatedSub.end_at,
        updatedSub.tenant_id
      ]);

      return res.json({
        success: true,
        message: 'Subscription updated successfully.',
        data: updatedSub
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
