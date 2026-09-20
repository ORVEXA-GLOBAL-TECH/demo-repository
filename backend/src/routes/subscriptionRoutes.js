import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// Standard Tier Rates Default Reference
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

// In-Memory Fallback Plans Store
let IN_MEMORY_PLANS = [
  {
    id: '00000000-0000-0000-0000-000000000101',
    code: 'FREE_TRIAL',
    name: 'Free Trial / Demo',
    description: 'Pilot evaluation with full feature access for a configurable trial period.',
    tier: 'FREE_TRIAL',
    price_monthly: 0,
    price_yearly: 0,
    trial_days: 14,
    grace_period_days: 7,
    features: ['Unlimited Users & Admins', 'Field DCR & GPS Tracking', 'Chemist & Doctor Directories', 'Configurable Start & End Dates', 'Full Analytics Suite'],
    is_active: true,
    is_custom: false,
    created_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000102',
    code: 'STARTER',
    name: 'Starter Tier',
    description: 'Entry-level pharma distribution for growing teams and regional distributors.',
    tier: 'STARTER',
    price_monthly: 100,
    price_yearly: 1000,
    trial_days: 14,
    grace_period_days: 7,
    features: ['Unlimited Field Users & Admins', 'Core MR Daily Call Reports', 'Chemist Order Booking (POB)', 'Product Catalog & Samples', 'Email Support'],
    is_active: true,
    is_custom: false,
    created_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000103',
    code: 'PROFESSIONAL',
    name: 'Professional Tier',
    description: 'Complete operational powerhouse for regional pharma manufacturers.',
    tier: 'PROFESSIONAL',
    price_monthly: 1000,
    price_yearly: 10000,
    trial_days: 14,
    grace_period_days: 7,
    features: ['Unlimited Field Reps & Managers', 'Tour Plans (MTP) & Approvals', 'TA / DA Smart Expense Claims', 'Statutory Payroll & Compliance', 'Live Geo-Tracking & Hierarchy'],
    is_active: true,
    is_custom: false,
    created_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000104',
    code: 'ENTERPRISE',
    name: 'Enterprise Tier',
    description: 'For multinational pharmaceutical conglomerates requiring sovereign multi-region compliance.',
    tier: 'ENTERPRISE',
    price_monthly: 2500,
    price_yearly: 25000,
    trial_days: 30,
    grace_period_days: 14,
    features: ['Unlimited Field Reps & Executive GMs', 'Multi-Country Sovereign Isolation', 'AI Prescription OCR & Studio', 'Automated SAP/Oracle ERP Sync', '24/7 Dedicated SLA Support'],
    is_active: true,
    is_custom: false,
    created_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000105',
    code: 'CUSTOM',
    name: 'Custom Enterprise Tier',
    description: 'Tailored contract terms, bespoke pricing, and custom SLAs as per client requirements.',
    tier: 'CUSTOM',
    price_monthly: 0,
    price_yearly: 0,
    trial_days: 14,
    grace_period_days: 14,
    features: ['Unlimited Users & Custom Limits', 'Custom USD Rate & Contract Terms', 'Flexible Billing Schedules', 'Bespoke ERP Integration & On-Premises Option', 'Dedicated Solutions Architect'],
    is_active: true,
    is_custom: true,
    created_at: new Date().toISOString()
  }
];

// ============================================================================
// 1. PLANS MANAGEMENT (CREATE, READ, UPDATE, DELETE)
// ============================================================================

// GET /api/subscriptions/plans (or /api/plans) - List all plans with subscriber metrics
router.get('/plans', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      // Ensure subscription_plans table exists
      await query(`
        CREATE TABLE IF NOT EXISTS subscription_plans (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          code VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          tier VARCHAR(50) NOT NULL DEFAULT 'STARTER',
          price_monthly NUMERIC(12,2) NOT NULL DEFAULT 100.00,
          price_yearly NUMERIC(12,2) DEFAULT 1000.00,
          trial_days INT DEFAULT 14,
          grace_period_days INT DEFAULT 7,
          features JSONB DEFAULT '[]'::jsonb,
          is_active BOOLEAN DEFAULT true,
          is_custom BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `).catch(() => {});

      // Check if table is empty and seed if needed
      const countRes = await query(`SELECT COUNT(*) FROM subscription_plans;`).catch(() => ({ rows: [{ count: '0' }] }));
      if (Number(countRes.rows[0]?.count) === 0) {
        for (const p of IN_MEMORY_PLANS) {
          await query(`
            INSERT INTO subscription_plans (id, code, name, description, tier, price_monthly, price_yearly, trial_days, grace_period_days, features, is_active, is_custom)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (code) DO NOTHING;
          `, [
            p.id, p.code, p.name, p.description, p.tier, p.price_monthly, p.price_yearly,
            p.trial_days, p.grace_period_days, JSON.stringify(p.features), p.is_active, p.is_custom
          ]).catch(() => {});
        }
      }

      // Query plans joined with live active company counts
      const plansRes = await query(`
        SELECT 
          p.*,
          COALESCE(sub_counts.subscriber_count, 0)::int as subscriber_count
        FROM subscription_plans p
        LEFT JOIN (
          SELECT plan, COUNT(*) as subscriber_count
          FROM tenants_companies
          GROUP BY plan
        ) sub_counts ON UPPER(p.code) = UPPER(sub_counts.plan) OR UPPER(p.tier) = UPPER(sub_counts.plan)
        ORDER BY p.price_monthly ASC, p.created_at ASC;
      `);

      return res.json({
        success: true,
        count: plansRes.rows.length,
        data: plansRes.rows
      });
    }

    return res.json({
      success: true,
      count: IN_MEMORY_PLANS.length,
      data: IN_MEMORY_PLANS
    });
  } catch (err) {
    console.error('Error fetching plans:', err);
    return res.json({
      success: true,
      count: IN_MEMORY_PLANS.length,
      data: IN_MEMORY_PLANS
    });
  }
});

// POST /api/subscriptions/plans - Create a new plan
router.post('/plans', async (req, res) => {
  const {
    code,
    name,
    description = '',
    tier = 'STARTER',
    priceMonthly = 100,
    priceYearly = 1000,
    trialDays = 14,
    gracePeriodDays = 7,
    features = [],
    isActive = true,
    isCustom = false
  } = req.body;

  if (!code || !name) {
    return res.status(400).json({ success: false, message: 'Plan code and name are required.' });
  }

  const normalizedCode = code.toUpperCase().replace(/\s+/g, '_');

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const insertRes = await query(`
        INSERT INTO subscription_plans (
          code, name, description, tier, price_monthly, price_yearly, trial_days, grace_period_days, features, is_active, is_custom
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `, [
        normalizedCode,
        name,
        description,
        tier.toUpperCase(),
        Number(priceMonthly) || 0,
        Number(priceYearly) || 0,
        Number(trialDays) || 14,
        Number(gracePeriodDays) || 7,
        JSON.stringify(Array.isArray(features) ? features : []),
        isActive !== undefined ? isActive : true,
        isCustom || false
      ]);

      // Audit Log
      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'PLAN_CREATED',
        'subscription_plans',
        insertRes.rows[0].id,
        JSON.stringify({ code: normalizedCode, name, priceMonthly, priceYearly, tier })
      ]).catch(() => {});

      return res.status(201).json({
        success: true,
        message: `Plan "${name}" created successfully.`,
        data: insertRes.rows[0]
      });
    }

    const newPlan = {
      id: 'plan-' + Date.now(),
      code: normalizedCode,
      name,
      description,
      tier: tier.toUpperCase(),
      price_monthly: Number(priceMonthly) || 0,
      price_yearly: Number(priceYearly) || 0,
      trial_days: Number(trialDays) || 14,
      grace_period_days: Number(gracePeriodDays) || 7,
      features: Array.isArray(features) ? features : [],
      is_active: isActive !== undefined ? isActive : true,
      is_custom: isCustom || false,
      created_at: new Date().toISOString()
    };
    IN_MEMORY_PLANS.push(newPlan);

    return res.status(201).json({
      success: true,
      message: `Plan "${name}" created in demo mode.`,
      data: newPlan
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/subscriptions/plans/:id - Edit an existing plan
router.put('/plans/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    tier,
    priceMonthly,
    priceYearly,
    trialDays,
    gracePeriodDays,
    features,
    isActive,
    isCustom
  } = req.body;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const updateRes = await query(`
        UPDATE subscription_plans
        SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          tier = COALESCE($3, tier),
          price_monthly = COALESCE($4, price_monthly),
          price_yearly = COALESCE($5, price_yearly),
          trial_days = COALESCE($6, trial_days),
          grace_period_days = COALESCE($7, grace_period_days),
          features = CASE WHEN $8::jsonb IS NOT NULL THEN $8::jsonb ELSE features END,
          is_active = COALESCE($9, is_active),
          is_custom = COALESCE($10, is_custom),
          updated_at = CURRENT_TIMESTAMP
        WHERE id::text = $11 OR code = $11
        RETURNING *;
      `, [
        name,
        description,
        tier ? tier.toUpperCase() : null,
        priceMonthly !== undefined ? Number(priceMonthly) : null,
        priceYearly !== undefined ? Number(priceYearly) : null,
        trialDays !== undefined ? Number(trialDays) : null,
        gracePeriodDays !== undefined ? Number(gracePeriodDays) : null,
        features ? JSON.stringify(features) : null,
        isActive,
        isCustom,
        id
      ]);

      if (updateRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Plan not found.' });
      }

      // Audit Log
      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'PLAN_UPDATED',
        'subscription_plans',
        id,
        JSON.stringify({ name, priceMonthly, priceYearly, tier, trialDays, gracePeriodDays })
      ]).catch(() => {});

      return res.json({
        success: true,
        message: `Plan updated successfully.`,
        data: updateRes.rows[0]
      });
    }

    const planIdx = IN_MEMORY_PLANS.findIndex(p => p.id === id || p.code === id);
    if (planIdx !== -1) {
      IN_MEMORY_PLANS[planIdx] = {
        ...IN_MEMORY_PLANS[planIdx],
        name: name || IN_MEMORY_PLANS[planIdx].name,
        description: description !== undefined ? description : IN_MEMORY_PLANS[planIdx].description,
        tier: tier ? tier.toUpperCase() : IN_MEMORY_PLANS[planIdx].tier,
        price_monthly: priceMonthly !== undefined ? Number(priceMonthly) : IN_MEMORY_PLANS[planIdx].price_monthly,
        price_yearly: priceYearly !== undefined ? Number(priceYearly) : IN_MEMORY_PLANS[planIdx].price_yearly,
        trial_days: trialDays !== undefined ? Number(trialDays) : IN_MEMORY_PLANS[planIdx].trial_days,
        grace_period_days: gracePeriodDays !== undefined ? Number(gracePeriodDays) : IN_MEMORY_PLANS[planIdx].grace_period_days,
        features: features || IN_MEMORY_PLANS[planIdx].features,
        is_active: isActive !== undefined ? isActive : IN_MEMORY_PLANS[planIdx].is_active,
        is_custom: isCustom !== undefined ? isCustom : IN_MEMORY_PLANS[planIdx].is_custom
      };
      return res.json({
        success: true,
        message: 'Plan updated in demo mode.',
        data: IN_MEMORY_PLANS[planIdx]
      });
    }

    return res.status(404).json({ success: false, message: 'Plan not found.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/subscriptions/plans/:id - Delete a plan
router.delete('/plans/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      // First check if any active company is assigned to this plan
      const checkRes = await query(`
        SELECT COUNT(*) as company_count FROM tenants_companies 
        WHERE plan = $1 OR plan IN (SELECT code FROM subscription_plans WHERE id::text = $1);
      `, [id]).catch(() => ({ rows: [{ company_count: 0 }] }));

      const count = Number(checkRes.rows[0]?.company_count) || 0;
      if (count > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete plan: ${count} company tenant(s) are currently enrolled. Please reassign them first or deactivate the plan.`
        });
      }

      const delRes = await query(`DELETE FROM subscription_plans WHERE id::text = $1 OR code = $1 RETURNING *;`, [id]);
      if (delRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Plan not found.' });
      }

      // Audit Log
      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'PLAN_DELETED',
        'subscription_plans',
        id,
        JSON.stringify({ deletedPlan: delRes.rows[0].code })
      ]).catch(() => {});

      return res.json({ success: true, message: `Plan "${delRes.rows[0].name}" deleted successfully.` });
    }

    IN_MEMORY_PLANS = IN_MEMORY_PLANS.filter(p => p.id !== id && p.code !== id);
    return res.json({ success: true, message: `Plan ${id} deleted in demo mode.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 2. TENANT SUBSCRIPTIONS & LIFECYCLE CONTROLS
// ============================================================================

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
          t.grace_period_days,
          t.auto_suspend_after_grace,
          t.last_renewed_at,
          t.renewal_count,
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
    trialPeriodDays,
    gracePeriodDays = 7,
    autoSuspendAfterGrace = true,
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

  const trialDays = Number(trialPeriodDays) || 14;
  const finalStart = startAt || startDate || new Date().toISOString();
  const finalEnd = endAt || expiryDate || (isTrial 
    ? new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString()
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
          billing_interval, payment_method, grace_period_days, auto_suspend_after_grace, is_trial
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
        paymentMethod,
        Number(gracePeriodDays) || 7,
        autoSuspendAfterGrace !== undefined ? autoSuspendAfterGrace : true,
        isTrial
      ]).catch(async () => {
        // Fallback without extra columns if not migrated yet
        return await query(`
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
      });

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
          grace_period_days = COALESCE($10, grace_period_days),
          auto_suspend_after_grace = COALESCE($11, auto_suspend_after_grace),
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = $12;
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
        Number(gracePeriodDays) || 7,
        autoSuspendAfterGrace !== undefined ? autoSuspendAfterGrace : true,
        tenantId
      ]).catch(async () => {
        // Fallback update
        await query(`
          UPDATE tenants_companies 
          SET 
            plan = $1,
            status = $2,
            monthly_rate = $3,
            updated_at = CURRENT_TIMESTAMP 
          WHERE id = $4;
        `, [normalizedTier, finalStatus, calculatedAmount, tenantId]);
      });

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
        JSON.stringify({ tenantId, planTier: normalizedTier, amountBilled: calculatedAmount, startAt: finalStart, endAt: finalEnd, gracePeriodDays })
      ]).catch(() => {});

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

// POST /api/subscriptions/upgrade-downgrade - Upgrade or Downgrade Tenant Plan
router.post('/upgrade-downgrade', async (req, res) => {
  const {
    tenantId,
    newPlanTier,
    actionType = 'UPGRADE', // 'UPGRADE' or 'DOWNGRADE'
    customRate,
    isCustomPricing,
    billingInterval = 'Monthly',
    effectiveImmediate = true,
    reason = 'Super Admin subscription tier modification'
  } = req.body;

  if (!tenantId || !newPlanTier) {
    return res.status(400).json({ success: false, message: 'Tenant ID and new plan tier are required.' });
  }

  const normalizedTier = newPlanTier.toUpperCase();
  const isTrial = normalizedTier === 'FREE_TRIAL' || normalizedTier === 'TRIAL';
  const isCustom = normalizedTier === 'CUSTOM' || isCustomPricing;

  let calculatedAmount = 0;
  if (isTrial) calculatedAmount = 0;
  else if (isCustom) calculatedAmount = Number(customRate) || 0;
  else if (normalizedTier === 'STARTER' || normalizedTier === 'BASIC') calculatedAmount = 100;
  else if (normalizedTier === 'PROFESSIONAL' || normalizedTier === 'PRO') calculatedAmount = 1000;
  else if (normalizedTier === 'ENTERPRISE') calculatedAmount = 2500;
  else calculatedAmount = 100;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      // Get current tenant info
      const tenantRes = await query(`SELECT * FROM tenants_companies WHERE id = $1;`, [tenantId]);
      if (tenantRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Tenant company not found.' });
      }

      const prevPlan = tenantRes.rows[0].plan;

      // Update company record
      await query(`
        UPDATE tenants_companies
        SET
          plan = $1,
          monthly_rate = $2,
          is_custom_pricing = $3,
          custom_rate = $4,
          billing_cycle = $5,
          status = CASE WHEN $6 THEN 'Trial' ELSE 'Active' END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7;
      `, [
        normalizedTier,
        calculatedAmount,
        isCustom,
        isCustom ? calculatedAmount : 0,
        billingInterval,
        isTrial,
        tenantId
      ]);

      // Record new subscription entry
      await query(`
        INSERT INTO tenant_subscriptions (
          tenant_id, plan_tier, status, start_date, expiry_date,
          start_at, end_at, auto_renew, invoice_currency, amount_billed,
          billing_interval, payment_method, is_trial
        )
        VALUES ($1, $2, 'Active', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year',
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 year', true, 'USD', $3, $4, 'Admin Upgrade', $5)
        RETURNING *;
      `, [tenantId, normalizedTier, calculatedAmount, billingInterval, isTrial]).catch(() => {});

      // Audit Log
      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        actionType === 'UPGRADE' ? 'PLAN_UPGRADED' : 'PLAN_DOWNGRADED',
        'tenants_companies',
        tenantId,
        JSON.stringify({
          previousPlan: prevPlan,
          newPlan: normalizedTier,
          newMonthlyRate: calculatedAmount,
          actionType,
          reason
        })
      ]).catch(() => {});

      return res.json({
        success: true,
        message: `Successfully ${actionType.toLowerCase()}d company to ${normalizedTier} ($${calculatedAmount}/mo).`,
        data: {
          tenantId,
          previousPlan: prevPlan,
          newPlan: normalizedTier,
          monthlyRate: calculatedAmount
        }
      });
    }

    return res.json({
      success: true,
      message: `Tenant ${actionType.toLowerCase()}d to ${normalizedTier} in demo mode.`,
      data: { tenantId, plan: normalizedTier, monthlyRate: calculatedAmount }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/subscriptions/renew - Renew company subscription
router.post('/renew', async (req, res) => {
  const {
    tenantId,
    durationMonths = 12,
    additionalDays,
    newExpiryDate,
    amountBilled,
    notes = 'Super Admin manual subscription renewal'
  } = req.body;

  if (!tenantId) {
    return res.status(400).json({ success: false, message: 'Tenant ID is required.' });
  }

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const tenantRes = await query(`SELECT * FROM tenants_companies WHERE id = $1;`, [tenantId]);
      if (tenantRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Tenant company not found.' });
      }

      const tenant = tenantRes.rows[0];
      let newEnd;

      if (newExpiryDate) {
        newEnd = new Date(newExpiryDate);
      } else if (additionalDays) {
        const base = tenant.subscription_end_at ? new Date(tenant.subscription_end_at) : new Date();
        newEnd = new Date(base.getTime() + Number(additionalDays) * 24 * 60 * 60 * 1000);
      } else {
        const base = tenant.subscription_end_at ? new Date(tenant.subscription_end_at) : new Date();
        newEnd = new Date(base.setMonth(base.getMonth() + (Number(durationMonths) || 12)));
      }

      const billed = amountBilled !== undefined ? Number(amountBilled) : (Number(tenant.monthly_rate) * (Number(durationMonths) || 12));

      // Update tenant status & dates
      await query(`
        UPDATE tenants_companies
        SET
          subscription_end_at = $1,
          status = 'Active',
          last_renewed_at = CURRENT_TIMESTAMP,
          renewal_count = COALESCE(renewal_count, 0) + 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2;
      `, [newEnd.toISOString(), tenantId]).catch(async () => {
        await query(`
          UPDATE tenants_companies
          SET subscription_end_at = $1, status = 'Active', updated_at = CURRENT_TIMESTAMP
          WHERE id = $2;
        `, [newEnd.toISOString(), tenantId]);
      });

      // Insert subscription renewal ledger entry
      await query(`
        INSERT INTO tenant_subscriptions (
          tenant_id, plan_tier, status, start_date, expiry_date,
          start_at, end_at, auto_renew, invoice_currency, amount_billed,
          billing_interval, payment_method, renewed_at
        )
        VALUES ($1, $2, 'Active', CURRENT_DATE, $3, CURRENT_TIMESTAMP, $4, true, 'USD', $5, 'Annual Renewal', 'Super Admin Override', CURRENT_TIMESTAMP)
        RETURNING *;
      `, [tenantId, tenant.plan, newEnd.toISOString().split('T')[0], newEnd.toISOString(), billed]).catch(() => {});

      // Audit Log
      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'SUBSCRIPTION_RENEWED',
        'tenants_companies',
        tenantId,
        JSON.stringify({ tenantName: tenant.name, newExpiryDate: newEnd.toISOString(), billed, notes })
      ]).catch(() => {});

      return res.json({
        success: true,
        message: `Subscription successfully renewed for "${tenant.name}" until ${newEnd.toISOString().split('T')[0]}!`,
        data: {
          tenantId,
          newExpiryDate: newEnd.toISOString(),
          status: 'Active'
        }
      });
    }

    return res.json({
      success: true,
      message: 'Subscription renewed in demo mode.',
      data: { tenantId, status: 'Active', newExpiryDate: newExpiryDate || new Date(Date.now() + 365*24*60*60*1000).toISOString() }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/subscriptions/configure-dates - Granular Subscription & Trial Dates / Grace Period Control
router.post('/configure-dates', async (req, res) => {
  const {
    tenantId,
    trialStartAt,
    trialEndAt,
    subscriptionStartAt,
    subscriptionEndAt,
    gracePeriodDays,
    autoSuspendAfterGrace,
    planTier,
    status
  } = req.body;

  if (!tenantId) {
    return res.status(400).json({ success: false, message: 'Tenant ID is required.' });
  }

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const updateRes = await query(`
        UPDATE tenants_companies
        SET
          trial_start_at = COALESCE($1, trial_start_at),
          trial_end_at = COALESCE($2, trial_end_at),
          subscription_start_at = COALESCE($3, subscription_start_at),
          subscription_end_at = COALESCE($4, subscription_end_at),
          grace_period_days = COALESCE($5, grace_period_days),
          auto_suspend_after_grace = COALESCE($6, auto_suspend_after_grace),
          plan = COALESCE($7, plan),
          status = COALESCE($8, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *;
      `, [
        trialStartAt,
        trialEndAt,
        subscriptionStartAt,
        subscriptionEndAt,
        gracePeriodDays !== undefined ? Number(gracePeriodDays) : null,
        autoSuspendAfterGrace,
        planTier ? planTier.toUpperCase() : null,
        status,
        tenantId
      ]).catch(async () => {
        return await query(`
          UPDATE tenants_companies
          SET
            subscription_start_at = COALESCE($1, subscription_start_at),
            subscription_end_at = COALESCE($2, subscription_end_at),
            status = COALESCE($3, status),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $4
          RETURNING *;
        `, [subscriptionStartAt, subscriptionEndAt, status, tenantId]);
      });

      if (updateRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Tenant company not found.' });
      }

      // Audit Log
      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'SUBSCRIPTION_DATES_CONFIGURED',
        'tenants_companies',
        tenantId,
        JSON.stringify({ trialStartAt, trialEndAt, subscriptionStartAt, subscriptionEndAt, gracePeriodDays, autoSuspendAfterGrace })
      ]).catch(() => {});

      return res.json({
        success: true,
        message: 'Subscription dates & grace policy updated successfully.',
        data: updateRes.rows[0]
      });
    }

    return res.json({
      success: true,
      message: 'Subscription dates configured in demo mode.',
      data: { tenantId, ...req.body }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/subscriptions/process-expiries - Auto Suspend Expired Subscriptions After Grace Period
router.post('/process-expiries', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      // Find and suspend companies whose subscription/trial + grace period has expired
      const expiredRes = await query(`
        UPDATE tenants_companies
        SET
          status = 'SUSPENDED',
          updated_at = CURRENT_TIMESTAMP
        WHERE 
          status IN ('Active', 'ACTIVE', 'Trial', 'TRIAL')
          AND COALESCE(auto_suspend_after_grace, true) = true
          AND (
            (status IN ('Active', 'ACTIVE') AND subscription_end_at IS NOT NULL AND (subscription_end_at + (COALESCE(grace_period_days, 7) || ' days')::interval) < NOW())
            OR
            (status IN ('Trial', 'TRIAL') AND trial_end_at IS NOT NULL AND (trial_end_at + (COALESCE(grace_period_days, 7) || ' days')::interval) < NOW())
          )
        RETURNING id, name, code, plan, status, subscription_end_at, trial_end_at, grace_period_days;
      `).catch(async () => {
        // Fallback simple expiry check
        return await query(`
          UPDATE tenants_companies
          SET status = 'SUSPENDED', updated_at = CURRENT_TIMESTAMP
          WHERE status IN ('Active', 'Trial') AND subscription_end_at IS NOT NULL AND subscription_end_at < NOW()
          RETURNING id, name, code, plan, status, subscription_end_at;
        `);
      });

      const suspendedCount = expiredRes.rows.length;

      if (suspendedCount > 0) {
        for (const company of expiredRes.rows) {
          await query(`
            INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
            VALUES ($1, $2, $3, $4, $5, $6);
          `, [
            'system@alleviaresfa.com',
            'SYSTEM_SCHEDULER',
            'AUTO_SUSPEND_AFTER_EXPIRY',
            'tenants_companies',
            company.id,
            JSON.stringify({ companyName: company.name, plan: company.plan, expiredAt: company.subscription_end_at || company.trial_end_at })
          ]).catch(() => {});
        }
      }

      return res.json({
        success: true,
        message: `Processed subscription expiries. ${suspendedCount} expired account(s) automatically suspended.`,
        suspendedCount,
        suspendedCompanies: expiredRes.rows
      });
    }

    return res.json({
      success: true,
      message: 'Processed subscription expiries in demo mode.',
      suspendedCount: 0,
      suspendedCompanies: []
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
    paymentMethod,
    gracePeriodDays,
    autoSuspendAfterGrace
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
          payment_method = COALESCE($10, payment_method),
          grace_period_days = COALESCE($11, grace_period_days),
          auto_suspend_after_grace = COALESCE($12, auto_suspend_after_grace)
        WHERE id = $13
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
        gracePeriodDays !== undefined ? Number(gracePeriodDays) : null,
        autoSuspendAfterGrace,
        id
      ]).catch(async () => {
        return await query(`
          UPDATE tenant_subscriptions
          SET
            plan_tier = COALESCE($1, plan_tier),
            status = COALESCE($2, status),
            amount_billed = COALESCE($3, amount_billed)
          WHERE id = $4
          RETURNING *;
        `, [planTier ? planTier.toUpperCase() : null, status, amountBilled !== undefined ? Number(amountBilled) : null, id]);
      });

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
      ]).catch(() => {});

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
