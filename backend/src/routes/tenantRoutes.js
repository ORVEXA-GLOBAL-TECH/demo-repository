import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';
import { SOVEREIGN_COUNTRIES } from '../db/seed.js';

const router = Router();

// GET /api/sovereign-countries - Returns the 24 sovereign countries with tax/currency/regulatory standards
router.get('/sovereign-countries', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query('SELECT * FROM sovereign_countries ORDER BY name ASC');
      if (dbRes.rows.length > 0) {
        return res.json({ success: true, count: dbRes.rows.length, data: dbRes.rows });
      }
    }
    // Return standard 24 countries registry
    return res.json({ success: true, count: SOVEREIGN_COUNTRIES.length, data: SOVEREIGN_COUNTRIES });
  } catch (err) {
    return res.json({ success: true, count: SOVEREIGN_COUNTRIES.length, data: SOVEREIGN_COUNTRIES });
  }
});

// GET /api/tenants - List all pharma company tenants
router.get('/tenants', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const tenantsRes = await query(`
        SELECT 
          t.*,
          c.name as country_name,
          c.currency_symbol,
          COALESCE((SELECT count(*) FROM users u WHERE u.tenant_id = t.id), 0) as user_count,
          COALESCE((SELECT count(*) FROM users u WHERE u.tenant_id = t.id AND u.role = 'MEDICAL_REP'), 0) as mr_count,
          COALESCE((SELECT count(*) FROM doctors d WHERE d.tenant_id = t.id), 0) as doctor_count
        FROM tenants_companies t
        LEFT JOIN sovereign_countries c ON t.country_code = c.code
        ORDER BY t.created_at DESC;
      `);
      return res.json({ success: true, count: tenantsRes.rows.length, data: tenantsRes.rows });
    }

    return res.json({
      success: true,
      count: 0,
      data: [],
      message: 'PostgreSQL is in offline mode or not seeded yet.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tenants - Provision new pharma tenant
router.post('/tenants', async (req, res) => {
  const {
    name,
    legalName,
    code,
    countryCode,
    timezone,
    currencyCode,
    plan,
    maxMrs,
    maxAdmins,
    maxDoctors,
    maxStorageGb,
    billingCycle,
    monthlyRate,
    contactEmail,
    contactPhone
  } = req.body;

  if (!name || !contactEmail) {
    return res.status(400).json({ success: false, message: 'Company name and contact email are required.' });
  }

  const tenantCode = code || name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const insertRes = await query(`
        INSERT INTO tenants_companies (
          code, name, legal_name, country_code, default_timezone,
          currency_code, plan, max_mrs, max_admins, max_doctors,
          max_storage_gb, billing_cycle, monthly_rate, contact_email, contact_phone
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *;
      `, [
        tenantCode,
        name,
        legalName || name,
        countryCode || 'VN',
        timezone || 'Asia/Ho_Chi_Minh',
        currencyCode || 'VND',
        plan || 'Enterprise',
        maxMrs || 50,
        maxAdmins || 5,
        maxDoctors || 5000,
        maxStorageGb || 50.0,
        billingCycle || 'Monthly',
        monthlyRate || 0.0,
        contactEmail,
        contactPhone || ''
      ]);

      // Write platform audit log
      await query(`
        INSERT INTO platform_audit_logs (
          actor_email, actor_role, action, target_entity, entity_id, details
        )
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'TENANT_PROVISIONED',
        'tenants_companies',
        insertRes.rows[0].id,
        JSON.stringify({ tenantName: name, country: countryCode, plan })
      ]);

      return res.status(201).json({
        success: true,
        message: 'Pharma Company Tenant provisioned successfully!',
        data: insertRes.rows[0]
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Tenant accepted in demo mode (PostgreSQL offline).',
      data: { id: 'temp-' + Date.now(), name, code: tenantCode, countryCode, plan, status: 'Active' }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/tenants/:id/status - Update tenant status (Active, Suspended, Deactivated)
router.put('/tenants/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required.' });
  }

  try {
    const updateRes = await query(`
      UPDATE tenants_companies 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `, [status, id]);

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tenant not found.' });
    }

    return res.json({
      success: true,
      message: `Tenant status updated to "${status}".`,
      data: updateRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
