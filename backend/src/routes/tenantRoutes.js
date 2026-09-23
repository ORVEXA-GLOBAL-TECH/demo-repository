import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query, checkDbHealth } from '../config/db.js';
import { SOVEREIGN_COUNTRIES } from '../db/seed.js';

const router = Router();

// GET /api/sovereign-countries - Returns the sovereign countries
router.get('/sovereign-countries', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query('SELECT * FROM sovereign_countries ORDER BY name ASC');
      if (dbRes.rows.length > 0) {
        return res.json({ success: true, count: dbRes.rows.length, data: dbRes.rows });
      }
    }
    return res.json({ success: true, count: SOVEREIGN_COUNTRIES.length, data: SOVEREIGN_COUNTRIES });
  } catch (err) {
    return res.json({ success: true, count: SOVEREIGN_COUNTRIES.length, data: SOVEREIGN_COUNTRIES });
  }
});

// GET /api/tenants - List all pharma company tenants with aggregated stats
router.get('/tenants', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const tenantsRes = await query(`
        SELECT 
          t.*,
          c.name as country_name,
          c.currency_symbol,
          COALESCE((SELECT count(*) FROM users u WHERE u.tenant_id = t.id), 0)::int as user_count,
          COALESCE((SELECT count(*) FROM users u WHERE u.tenant_id = t.id AND u.role = 'MEDICAL_REP'), 0)::int as mr_count,
          COALESCE((SELECT count(*) FROM users u WHERE u.tenant_id = t.id AND u.role IN ('COMPANY_ADMIN', 'ADMIN')), 0)::int as admin_count,
          COALESCE((SELECT count(*) FROM doctors d WHERE d.tenant_id = t.id), 0)::int as doctor_count
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

// GET /api/tenants/:id - Get single tenant company by ID
router.get('/tenants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query(`
        SELECT 
          t.*,
          c.name as country_name,
          c.currency_symbol,
          COALESCE((SELECT count(*) FROM users u WHERE u.tenant_id = t.id), 0)::int as user_count,
          COALESCE((SELECT count(*) FROM users u WHERE u.tenant_id = t.id AND u.role = 'MEDICAL_REP'), 0)::int as mr_count,
          COALESCE((SELECT count(*) FROM doctors d WHERE d.tenant_id = t.id), 0)::int as doctor_count
        FROM tenants_companies t
        LEFT JOIN sovereign_countries c ON t.country_code = c.code
        WHERE t.id = $1;
      `, [id]);

      if (dbRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Tenant not found.' });
      }

      return res.json({ success: true, data: dbRes.rows[0] });
    }
    return res.status(503).json({ success: false, message: 'Database offline.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tenants - Provision new pharma tenant company + default admin
router.post('/tenants', async (req, res) => {
  const {
    name,
    legalName,
    code,
    industrySegment = 'PHARMACEUTICALS',
    companyType = 'ENTERPRISE',
    taxId = '',
    logoUrl = '',
    faviconUrl = '',
    brandPrimaryColor = '#0284c7',
    websiteUrl = '',
    subdomain = '',
    customDomain = '',
    countryCode = 'IN',
    operatingCountries = ['IN'],
    timezone = 'Asia/Kolkata',
    currencyCode = 'INR',
    dateFormat = 'DD/MM/YYYY',
    fiscalYearStart = 'APRIL',
    complianceFrameworks = ['21_CFR_PART_11', 'GXP', 'ISO_27001'],
    dataResidencyRegion = 'ap-south-1',
    plan = 'STARTER',
    billingCycle = 'Monthly',
    monthlyRate,
    annualContractValue,
    currency = 'USD',
    paymentTerms = 'NET_30',
    poNumber = '',
    status,
    trialStartAt,
    trialEndAt,
    subscriptionStartAt,
    subscriptionEndAt,
    gracePeriodDays = 14,
    autoRenew = true,
    maxUsers = 100,
    maxStorageGb = 25,
    apiRateLimitPerMin = 600,
    contactName,
    contactEmail,
    contactPhone,
    adminName,
    adminPassword,
    mfaEnforced = false,
    sessionTimeoutMinutes = 15,
    ipWhitelist = [],
    auditRetentionYears = 7,
    settings
  } = req.body;

  if (!name || !contactEmail) {
    return res.status(400).json({ success: false, message: 'Company name and contact email are required.' });
  }

  const tenantCode = (code || name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)).toLowerCase();
  const normalizedPlan = (plan || 'STARTER').toUpperCase();
  const isTrial = normalizedPlan === 'FREE_TRIAL' || normalizedPlan === 'TRIAL';

  // Sanitize currencyCode
  const cleanCurrencyCode = currencyCode 
    ? String(currencyCode).split(/[\s/()]/)[0].toUpperCase().slice(0, 5) || 'USD'
    : 'USD';

  let calculatedRate = Number(monthlyRate) || 0;
  if (isTrial) {
    calculatedRate = 0;
  } else if (!calculatedRate) {
    if (normalizedPlan === 'STARTER' || normalizedPlan === 'BASIC') calculatedRate = 100;
    else if (normalizedPlan === 'GROWTH') calculatedRate = 450;
    else if (normalizedPlan === 'PROFESSIONAL' || normalizedPlan === 'PRO') calculatedRate = 1000;
    else if (normalizedPlan === 'ENTERPRISE' || normalizedPlan === 'ENTERPRISE_SOVEREIGN') calculatedRate = 2500;
  }

  const finalStatus = status || (isTrial ? 'Trial' : 'Active');

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const insertRes = await query(`
        INSERT INTO tenants_companies (
          code, name, legal_name, industry_segment, company_type, tax_id,
          logo_url, favicon_url, brand_primary_color, website_url, subdomain, custom_domain,
          country_code, operating_countries, default_timezone, currency_code, date_format, fiscal_year_start,
          compliance_frameworks, data_residency_region, plan, billing_cycle, monthly_rate, annual_contract_value,
          currency, payment_terms, po_number, status, trial_start_at, trial_end_at,
          subscription_start_at, subscription_end_at, grace_period_days, auto_renew,
          max_users, max_storage_gb, api_rate_limit_per_min,
          contact_name, contact_email, contact_phone,
          mfa_enforced, session_timeout_minutes, ip_whitelist, audit_retention_years, settings
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18,
          $19, $20, $21, $22, $23, $24,
          $25, $26, $27, $28, $29, $30,
          $31, $32, $33, $34,
          $35, $36, $37,
          $38, $39, $40,
          $41, $42, $43, $44, $45
        )
        RETURNING *;
      `, [
        tenantCode,
        name,
        legalName || name,
        industrySegment,
        companyType,
        taxId,
        logoUrl,
        faviconUrl,
        brandPrimaryColor,
        websiteUrl,
        subdomain ? subdomain.toLowerCase() : `${tenantCode}.alleviare.com`,
        customDomain || '',
        countryCode ? String(countryCode).slice(0, 3) : 'IN',
        JSON.stringify(operatingCountries || ['IN']),
        timezone || 'Asia/Kolkata',
        cleanCurrencyCode,
        dateFormat,
        fiscalYearStart,
        JSON.stringify(complianceFrameworks || []),
        dataResidencyRegion,
        normalizedPlan,
        billingCycle || 'Monthly',
        calculatedRate,
        annualContractValue || calculatedRate * 12,
        currency,
        paymentTerms,
        poNumber,
        finalStatus,
        trialStartAt || (isTrial ? new Date().toISOString() : null),
        trialEndAt || (isTrial ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null),
        subscriptionStartAt || (!isTrial ? new Date().toISOString() : null),
        subscriptionEndAt || (!isTrial ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null),
        gracePeriodDays,
        autoRenew,
        maxUsers,
        maxStorageGb,
        apiRateLimitPerMin,
        contactName || adminName || 'Company Administrator',
        contactEmail,
        contactPhone || '',
        mfaEnforced,
        sessionTimeoutMinutes,
        JSON.stringify(ipWhitelist || []),
        auditRetentionYears,
        JSON.stringify(settings || {
          modules: {
            mrReporting: true,
            dcr: true,
            tourPlan: true,
            gpsLiveTracking: true,
            doctorManagement: true,
            chemistStockist: true,
            orderManagement: true,
            expenseManagement: true,
            sampleDistribution: false,
            visualAids: true,
            aiAnalytics: normalizedPlan.includes('ENTERPRISE'),
            whatsappAlerts: true,
            offlineSync: true
          }
        })
      ]);

      const newTenant = insertRes.rows[0];

      // Provision default Company Admin user for this tenant
      let adminUserId = null;
      if (adminName || contactEmail) {
        const [firstName, ...lastNameParts] = (adminName || contactName || 'Company Admin').split(' ');
        const initialPassword = adminPassword || 'Admin@1234!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(initialPassword, salt);

        const adminInsert = await query(`
          INSERT INTO users (
            tenant_id, email, password_hash, first_name, last_name, role, status, country_code, company_name, designation
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (email) DO UPDATE 
          SET tenant_id = EXCLUDED.tenant_id, company_name = EXCLUDED.company_name
          RETURNING id;
        `, [
          newTenant.id,
          contactEmail.toLowerCase(),
          hashedPassword,
          firstName || 'Admin',
          lastNameParts.join(' ') || 'User',
          'COMPANY_ADMIN',
          'Active',
          countryCode || 'IN',
          name,
          'Company Master Administrator'
        ]);

        if (adminInsert.rows.length > 0) {
          adminUserId = adminInsert.rows[0].id;
          await query('UPDATE tenants_companies SET admin_user_id = $1 WHERE id = $2', [adminUserId, newTenant.id]);
          newTenant.admin_user_id = adminUserId;
        }
      }

      // Write platform audit log
      try {
        await query(`
          INSERT INTO platform_audit_logs (
            actor_email, actor_role, action, target_entity, entity_id, details
          )
          VALUES ($1, $2, $3, $4, $5, $6);
        `, [
          'superadmin@alleviare.com',
          'SUPER_ADMIN',
          'TENANT_PROVISIONED',
          'tenants_companies',
          newTenant.id,
          JSON.stringify({ tenantName: name, code: tenantCode, country: countryCode, plan: normalizedPlan, monthlyRate: calculatedRate, maxUsers })
        ]);
      } catch (auditErr) {
        console.warn('Audit log write skipped:', auditErr.message);
      }

      return res.status(201).json({
        success: true,
        message: 'Pharma Company Tenant provisioned successfully!',
        data: newTenant
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Tenant provisioned in sovereign demo mode.',
      data: {
        id: 'tc-' + Date.now(),
        name,
        code: tenantCode,
        countryCode,
        plan: normalizedPlan,
        status: finalStatus,
        maxUsers,
        maxStorageGb,
        apiRateLimitPerMin,
        contactEmail
      }
    });
  } catch (err) {
    console.error('Tenant provisioning error:', err);
    res.status(500).json({ success: false, error: err.message });
  }

// PUT /api/tenants/:id - Update tenant company details
router.put('/tenants/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    legalName,
    countryCode,
    timezone,
    currencyCode,
    plan,
    status,
    maxMrs,
    maxAdmins,
    maxDoctors,
    maxStorageGb,
    billingCycle,
    monthlyRate,
    isCustomPricing,
    customRate,
    trialStartAt,
    trialEndAt,
    subscriptionStartAt,
    subscriptionEndAt,
    contactEmail,
    contactPhone,
    settings
  } = req.body;

  const cleanCurrencyCode = currencyCode 
    ? String(currencyCode).split(/[\s/()]/)[0].toUpperCase().slice(0, 5)
    : null;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const updateRes = await query(`
        UPDATE tenants_companies
        SET
          name = COALESCE($1, name),
          legal_name = COALESCE($2, legal_name),
          country_code = COALESCE($3, country_code),
          default_timezone = COALESCE($4, default_timezone),
          currency_code = COALESCE($5, currency_code),
          plan = COALESCE($6, plan),
          status = COALESCE($7, status),
          billing_cycle = COALESCE($8, billing_cycle),
          monthly_rate = COALESCE($9, monthly_rate),
          is_custom_pricing = COALESCE($10, is_custom_pricing),
          custom_rate = COALESCE($11, custom_rate),
          trial_start_at = COALESCE($12, trial_start_at),
          trial_end_at = COALESCE($13, trial_end_at),
          subscription_start_at = COALESCE($14, subscription_start_at),
          subscription_end_at = COALESCE($15, subscription_end_at),
          contact_email = COALESCE($16, contact_email),
          contact_phone = COALESCE($17, contact_phone),
          settings = COALESCE($18, settings),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $19
        RETURNING *;
      `, [
        name,
        legalName,
        countryCode ? String(countryCode).slice(0, 3) : null,
        timezone,
        cleanCurrencyCode,
        plan ? plan.toUpperCase() : null,
        status,
        billingCycle,
        monthlyRate,
        isCustomPricing,
        customRate,
        trialStartAt,
        trialEndAt,
        subscriptionStartAt,
        subscriptionEndAt,
        contactEmail,
        contactPhone,
        settings ? JSON.stringify(settings) : null,
        id
      ]);

      if (updateRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Tenant not found.' });
      }

      // Audit log
      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'TENANT_UPDATED',
        'tenants_companies',
        id,
        JSON.stringify({ updatedFields: req.body })
      ]);

      return res.json({
        success: true,
        message: 'Tenant details updated successfully.',
        data: updateRes.rows[0]
      });
    }

    return res.json({
      success: true,
      message: 'Tenant updated in demo mode.',
      data: { id, ...req.body }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/tenants/:id/status - Update tenant status (Active, Suspended, Deactivated, Trial)
router.patch('/tenants/:id/status', async (req, res) => {
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

    await query(`
      INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      'superadmin@alleviaresfa.com',
      'SUPER_ADMIN',
      'TENANT_STATUS_CHANGED',
      'tenants_companies',
      id,
      JSON.stringify({ newStatus: status })
    ]);

    return res.json({
      success: true,
      message: `Tenant status updated to "${status}".`,
      data: updateRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/tenants/:id - Purge / Delete tenant company and cascade data
router.delete('/tenants/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const getRes = await query('SELECT name FROM tenants_companies WHERE id = $1', [id]);
      const tenantName = getRes.rows[0]?.name || 'Unknown Tenant';

      const delRes = await query('DELETE FROM tenants_companies WHERE id = $1 RETURNING id;', [id]);
      if (delRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Tenant not found.' });
      }

      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'TENANT_PURGED',
        'tenants_companies',
        id,
        JSON.stringify({ tenantName })
      ]);

      return res.json({
        success: true,
        message: `Tenant "${tenantName}" has been permanently purged.`
      });
    }

    return res.json({
      success: true,
      message: `Tenant ${id} deleted in demo mode.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tenants/:id/reset-admin-password - Reset password for company admin
router.post('/tenants/:id/reset-admin-password', async (req, res) => {
  const { id } = req.params;
  const { newPassword, adminEmail } = req.body;

  if (!newPassword) {
    return res.status(400).json({ success: false, message: 'New password is required.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    let updateRes;
    if (adminEmail) {
      updateRes = await query(`
        UPDATE users
        SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
        WHERE tenant_id = $2 AND LOWER(email) = LOWER($3)
        RETURNING id, email, first_name, last_name;
      `, [hashedPassword, id, adminEmail]);
    } else {
      updateRes = await query(`
        UPDATE users
        SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
        WHERE tenant_id = $2 AND role IN ('COMPANY_ADMIN', 'ADMIN')
        RETURNING id, email, first_name, last_name;
      `, [hashedPassword, id]);
    }

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No admin user found for this tenant.' });
    }

    await query(`
      INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      'superadmin@alleviaresfa.com',
      'SUPER_ADMIN',
      'ADMIN_PASSWORD_RESET',
      'users',
      updateRes.rows[0].id,
      JSON.stringify({ tenantId: id, adminEmail: updateRes.rows[0].email })
    ]);

    return res.json({
      success: true,
      message: `Password reset successfully for ${updateRes.rows[0].email}.`,
      data: updateRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tenants/:id/assign-admin - Assign or create root company admin
router.post('/tenants/:id/assign-admin', async (req, res) => {
  const { id } = req.params;
  const { adminName, adminEmail, adminPassword } = req.body;

  if (!adminEmail) {
    return res.status(400).json({ success: false, message: 'Admin email is required.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword || 'Admin@1234!', salt);
    const [firstName, ...lastNameParts] = (adminName || 'Company Admin').split(' ');

    const userRes = await query(`
      INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role, status)
      VALUES ($1, $2, $3, $4, $5, 'COMPANY_ADMIN', 'Active')
      ON CONFLICT (tenant_id, email) DO UPDATE
      SET role = 'COMPANY_ADMIN', status = 'Active', password_hash = EXCLUDED.password_hash, updated_at = CURRENT_TIMESTAMP
      RETURNING id, email, first_name, last_name, role;
    `, [id, adminEmail.toLowerCase().trim(), hashedPassword, firstName || 'Admin', lastNameParts.join(' ') || 'User']);

    await query(`
      UPDATE tenants_companies SET contact_email = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2
    `, [adminEmail.toLowerCase().trim(), id]);

    await query(`
      INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      'superadmin@alleviaresfa.com',
      'SUPER_ADMIN',
      'COMPANY_ADMIN_ASSIGNED',
      'tenants_companies',
      id,
      JSON.stringify({ adminEmail, adminName })
    ]);

    return res.json({
      success: true,
      message: `Company Admin successfully assigned to ${adminEmail}.`,
      data: userRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tenants/:id/extend-subscription - Extend trial or subscription validity by days
router.post('/tenants/:id/extend-subscription', async (req, res) => {
  const { id } = req.params;
  const { additionalDays = 30, reason } = req.body;

  try {
    const tenantRes = await query('SELECT * FROM tenants_companies WHERE id = $1', [id]);
    if (tenantRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tenant not found.' });
    }

    const tenant = tenantRes.rows[0];
    const isTrial = tenant.plan === 'FREE_TRIAL' || tenant.plan === 'TRIAL' || tenant.status === 'Trial';

    let updateRes;
    if (isTrial) {
      const currentEnd = tenant.trial_end_at ? new Date(tenant.trial_end_at) : new Date();
      const newEnd = new Date(Math.max(Date.now(), currentEnd.getTime()) + additionalDays * 24 * 60 * 60 * 1000);
      updateRes = await query(`
        UPDATE tenants_companies
        SET trial_end_at = $1, status = 'Trial', updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
      `, [newEnd.toISOString(), id]);
    } else {
      const currentEnd = tenant.subscription_end_at ? new Date(tenant.subscription_end_at) : new Date();
      const newEnd = new Date(Math.max(Date.now(), currentEnd.getTime()) + additionalDays * 24 * 60 * 60 * 1000);
      updateRes = await query(`
        UPDATE tenants_companies
        SET subscription_end_at = $1, status = 'Active', updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
      `, [newEnd.toISOString(), id]);
    }

    await query(`
      INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      'superadmin@alleviaresfa.com',
      'SUPER_ADMIN',
      'SUBSCRIPTION_EXTENDED',
      'tenants_companies',
      id,
      JSON.stringify({ additionalDays, reason: reason || 'Super Admin extension' })
    ]);

    return res.json({
      success: true,
      message: `Subscription extended by ${additionalDays} days.`,
      data: updateRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tenants/:id/restore - Restore deactivated/suspended tenant to Active
router.post('/tenants/:id/restore', async (req, res) => {
  const { id } = req.params;
  try {
    const updateRes = await query(`
      UPDATE tenants_companies
      SET status = 'Active', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `, [id]);

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tenant not found.' });
    }

    await query(`
      INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      'superadmin@alleviaresfa.com',
      'SUPER_ADMIN',
      'TENANT_RESTORED',
      'tenants_companies',
      id,
      JSON.stringify({ status: 'Active' })
    ]);

    return res.json({
      success: true,
      message: `Tenant "${updateRes.rows[0].name}" successfully restored to Active status.`,
      data: updateRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tenants/:id/impersonate - Issue audited impersonation payload
router.post('/tenants/:id/impersonate', async (req, res) => {
  const { id } = req.params;
  const { reason, adminUserId } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Impersonation Audit Failure: A valid audit reason is required before impersonating a tenant admin (e.g. Support ticket #1234).'
    });
  }

  try {
    const tenantRes = await query('SELECT * FROM tenants_companies WHERE id = $1', [id]);
    const tenant = tenantRes.rows[0] || { id, name: 'Pharma Company', code: 'PHARMA-CODE', contact_email: 'admin@company.com' };

    let adminUser;
    if (adminUserId) {
      const userRes = await query('SELECT id, email, first_name, last_name, role FROM users WHERE id = $1', [adminUserId]);
      adminUser = userRes.rows[0];
    }
    if (!adminUser) {
      const adminRes = await query(`
        SELECT id, email, first_name, last_name, role FROM users 
        WHERE tenant_id = $1 AND role IN ('COMPANY_ADMIN', 'ADMIN') 
        LIMIT 1;
      `, [id]);
      adminUser = adminRes.rows[0] || {
        id: 'mock-admin-' + id,
        email: tenant.contact_email || 'admin@company.com',
        first_name: 'Company',
        last_name: 'Admin',
        role: 'COMPANY_ADMIN'
      };
    }

    const sessionId = 'sess_imp_' + Date.now();
    const sessionStartAt = new Date().toISOString();

    await query(`
      INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      req.user?.email || 'superadmin@orvexa.com',
      'SUPER_ADMIN',
      'IMPERSONATION_STARTED',
      'tenants_companies',
      id,
      JSON.stringify({
        sessionId,
        tenantId: id,
        tenantName: tenant.name,
        impersonatedEmail: adminUser.email,
        impersonatedUserId: adminUser.id,
        reason: reason.trim(),
        startedAt: sessionStartAt
      })
    ]);

    return res.json({
      success: true,
      message: `Audited impersonation session started for ${adminUser.email} (${tenant.name})`,
      data: {
        sessionId,
        startedAt: sessionStartAt,
        reason: reason.trim(),
        tenant: {
          id: tenant.id,
          name: tenant.name,
          code: tenant.code
        },
        adminUser: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.first_name ? `${adminUser.first_name} ${adminUser.last_name || ''}`.trim() : 'Company Admin',
          role: adminUser.role || 'COMPANY_ADMIN',
          company: tenant.name
        },
        impersonationToken: 'imp_' + Buffer.from(`${tenant.id}:${adminUser.email}:${Date.now()}`).toString('base64')
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tenants/:id/impersonate/end - Log impersonation session termination
router.post('/tenants/:id/impersonate/end', async (req, res) => {
  const { id } = req.params;
  const { sessionId, startedAt, durationSeconds, reason } = req.body;

  try {
    const endedAt = new Date().toISOString();
    await query(`
      INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      req.user?.email || 'superadmin@orvexa.com',
      'SUPER_ADMIN',
      'IMPERSONATION_ENDED',
      'tenants_companies',
      id,
      JSON.stringify({
        sessionId,
        tenantId: id,
        startedAt,
        endedAt,
        durationSeconds: durationSeconds || 0,
        reason: reason || 'Session completed'
      })
    ]);

    return res.json({
      success: true,
      message: 'Impersonation session safely closed and audited.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/tenants/:id/usage-limits - Update tenant usage limits overrides
router.put('/tenants/:id/usage-limits', async (req, res) => {
  const { id } = req.params;
  const usageLimits = req.body;

  try {
    const tenantRes = await query('SELECT settings FROM tenants_companies WHERE id = $1', [id]);
    const currentSettings = tenantRes.rows[0]?.settings || {};
    const updatedSettings = { ...currentSettings, usageLimits };

    await query('UPDATE tenants_companies SET settings = $1 WHERE id = $2', [JSON.stringify(updatedSettings), id]);

    return res.json({
      success: true,
      message: 'Tenant usage limits updated successfully.',
      data: usageLimits
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// TENANT ADMIN MANAGEMENT — Full CRUD for per-tenant admin accounts
// ==============================================================================

// GET /api/tenants/:id/admins — List all admin users for a tenant
router.get('/tenants/:id/admins', async (req, res) => {
  const { id } = req.params;
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const adminsRes = await query(`
        SELECT 
          id, tenant_id, first_name, last_name, email, phone, avatar_url,
          role, status, designation, department, permissions, 
          two_factor_enabled, last_login_at, login_count,
          created_at, updated_at
        FROM users
        WHERE tenant_id = $1
          AND role IN ('COMPANY_ADMIN', 'ADMIN', 'MANAGER', 'DIRECTOR', 'ACCOUNTANT', 'SALES_MANAGER', 'SUPERVISOR')
          AND deleted_at IS NULL
        ORDER BY 
          CASE role 
            WHEN 'COMPANY_ADMIN' THEN 1 
            WHEN 'DIRECTOR' THEN 2
            WHEN 'MANAGER' THEN 3
            WHEN 'ADMIN' THEN 4
            ELSE 5 
          END, created_at ASC;
      `, [id]);

      return res.json({ success: true, count: adminsRes.rows.length, data: adminsRes.rows });
    }
    return res.status(503).json({ success: false, message: 'Database offline.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tenants/:id/admins — Create a new admin for the tenant
router.post('/tenants/:id/admins', async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phone = '',
    password,
    role = 'COMPANY_ADMIN',
    designation = '',
    department = '',
    permissions = [],
    avatarUrl = '',
    mfaEnforced = false,
    sendWelcomeEmail = false
  } = req.body;

  if (!email || !firstName) {
    return res.status(400).json({ success: false, message: 'First name and email are required.' });
  }

  try {
    // Verify tenant exists
    const tenantRes = await query('SELECT id, name, country_code FROM tenants_companies WHERE id = $1', [id]);
    if (tenantRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tenant not found.' });
    }
    const tenant = tenantRes.rows[0];

    const rawPassword = password || `Admin@${Math.floor(100000 + Math.random() * 900000)}!`;
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const adminInsert = await query(`
      INSERT INTO users (
        tenant_id, email, password_hash, first_name, last_name,
        phone, avatar_url, role, status, designation, department,
        country_code, company_name, permissions, two_factor_enabled,
        is_verified, territory
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Active', $9, $10, $11, $12, $13, $14, TRUE, 'Corporate HQ')
      ON CONFLICT (email) DO UPDATE
        SET tenant_id = EXCLUDED.tenant_id,
            role = EXCLUDED.role,
            status = 'Active',
            updated_at = CURRENT_TIMESTAMP
      RETURNING id, tenant_id, first_name, last_name, email, role, status, designation, department, created_at;
    `, [
      id,
      email.toLowerCase().trim(),
      hashedPassword,
      firstName.trim(),
      lastName?.trim() || '',
      phone,
      avatarUrl,
      role,
      designation || `${role.replace(/_/g, ' ')} — ${tenant.name}`,
      department || 'Executive Administration',
      tenant.country_code || 'IN',
      tenant.name,
      JSON.stringify(permissions.length > 0 ? permissions : ['TENANT_ACCESS', 'MANAGE_USERS', 'VIEW_REPORTS']),
      mfaEnforced
    ]);

    const newAdmin = adminInsert.rows[0];

    // If this is the first COMPANY_ADMIN, set as primary admin on the tenant
    if (role === 'COMPANY_ADMIN') {
      const existingPrimary = await query(
        'SELECT admin_user_id FROM tenants_companies WHERE id = $1',
        [id]
      );
      if (!existingPrimary.rows[0]?.admin_user_id) {
        await query(
          'UPDATE tenants_companies SET admin_user_id = $1, contact_email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
          [newAdmin.id, email.toLowerCase().trim(), id]
        );
      }
    }

    // Platform audit log
    try {
      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviare.com', 'SUPER_ADMIN', 'TENANT_ADMIN_CREATED',
        'users', newAdmin.id,
        JSON.stringify({ tenantId: id, tenantName: tenant.name, adminEmail: email, role, temporaryPassword: sendWelcomeEmail ? rawPassword : '[REDACTED]' })
      ]);
    } catch (auditErr) { console.warn('Audit log skip:', auditErr.message); }

    return res.status(201).json({
      success: true,
      message: `Admin account created for ${email} in ${tenant.name}.`,
      data: { ...newAdmin, temporaryPassword: sendWelcomeEmail ? rawPassword : undefined }
    });
  } catch (err) {
    console.error('Create tenant admin error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/tenants/:id/admins/:userId — Update a tenant admin's profile or role
router.put('/tenants/:id/admins/:userId', async (req, res) => {
  const { id, userId } = req.params;
  const { firstName, lastName, phone, role, designation, department, permissions, avatarUrl } = req.body;

  try {
    const updateRes = await query(`
      UPDATE users SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        role = COALESCE($4, role),
        designation = COALESCE($5, designation),
        department = COALESCE($6, department),
        permissions = COALESCE($7, permissions),
        avatar_url = COALESCE($8, avatar_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9 AND tenant_id = $10
      RETURNING id, first_name, last_name, email, role, status, designation, department, permissions, avatar_url, updated_at;
    `, [
      firstName, lastName, phone, role, designation, department,
      permissions ? JSON.stringify(permissions) : null,
      avatarUrl, userId, id
    ]);

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin user not found for this tenant.' });
    }

    try {
      await query(`INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details) VALUES ($1,$2,$3,$4,$5,$6);`,
        ['superadmin@alleviare.com', 'SUPER_ADMIN', 'TENANT_ADMIN_UPDATED', 'users', userId, JSON.stringify({ tenantId: id, changes: req.body })]);
    } catch (e) {}

    return res.json({ success: true, message: 'Admin profile updated.', data: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/tenants/:id/admins/:userId/status — Suspend or reactivate a tenant admin
router.patch('/tenants/:id/admins/:userId/status', async (req, res) => {
  const { id, userId } = req.params;
  const { status } = req.body;

  if (!['Active', 'Inactive', 'Suspended'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be Active, Inactive, or Suspended.' });
  }

  try {
    const updateRes = await query(`
      UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND tenant_id = $3
      RETURNING id, email, first_name, last_name, role, status;
    `, [status, userId, id]);

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    try {
      await query(`INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details) VALUES ($1,$2,$3,$4,$5,$6);`,
        ['superadmin@alleviare.com', 'SUPER_ADMIN', `TENANT_ADMIN_${status.toUpperCase()}`, 'users', userId, JSON.stringify({ tenantId: id, newStatus: status })]);
    } catch (e) {}

    return res.json({ success: true, message: `Admin ${status === 'Active' ? 'reactivated' : 'suspended'} successfully.`, data: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tenants/:id/admins/:userId/reset-password — Force-reset a tenant admin's password
router.post('/tenants/:id/admins/:userId/reset-password', async (req, res) => {
  const { id, userId } = req.params;
  const { newPassword } = req.body;

  const rawPassword = newPassword || `Reset@${Math.floor(100000 + Math.random() * 900000)}!`;

  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const updateRes = await query(`
      UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND tenant_id = $3
      RETURNING id, email, first_name, last_name, role;
    `, [hashedPassword, userId, id]);

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    // Invalidate all active sessions for this admin
    try {
      await query(
        `UPDATE user_sessions SET is_active = false, invalidated_reason = 'ADMIN_PASSWORD_RESET' WHERE user_id = $1 AND is_active = true`,
        [userId]
      );
    } catch (e) {}

    try {
      await query(`INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details) VALUES ($1,$2,$3,$4,$5,$6);`,
        ['superadmin@alleviare.com', 'SUPER_ADMIN', 'TENANT_ADMIN_PASSWORD_RESET', 'users', userId, JSON.stringify({ tenantId: id, adminEmail: updateRes.rows[0].email })]);
    } catch (e) {}

    return res.json({
      success: true,
      message: `Password reset for ${updateRes.rows[0].email}. Sessions invalidated.`,
      data: { ...updateRes.rows[0], temporaryPassword: rawPassword }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/tenants/:id/admins/:userId — Remove a tenant admin
router.delete('/tenants/:id/admins/:userId', async (req, res) => {
  const { id, userId } = req.params;

  try {
    // Soft delete — set deleted_at instead of hard delete
    const deleteRes = await query(`
      UPDATE users SET deleted_at = CURRENT_TIMESTAMP, status = 'Inactive', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND tenant_id = $2
      RETURNING id, email, first_name, last_name;
    `, [userId, id]);

    if (deleteRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    // Invalidate all sessions
    try {
      await query(`UPDATE user_sessions SET is_active = false, invalidated_reason = 'ACCOUNT_DELETED' WHERE user_id = $1`, [userId]);
    } catch (e) {}

    // If this was the primary admin, clear the tenant's admin_user_id
    await query(
      `UPDATE tenants_companies SET admin_user_id = NULL WHERE id = $1 AND admin_user_id = $2`,
      [id, userId]
    );

    try {
      await query(`INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details) VALUES ($1,$2,$3,$4,$5,$6);`,
        ['superadmin@alleviare.com', 'SUPER_ADMIN', 'TENANT_ADMIN_REMOVED', 'users', userId, JSON.stringify({ tenantId: id, adminEmail: deleteRes.rows[0].email })]);
    } catch (e) {}

    return res.json({ success: true, message: `Admin ${deleteRes.rows[0].email} removed from tenant.`, data: deleteRes.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

