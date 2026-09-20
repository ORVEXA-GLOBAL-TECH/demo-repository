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
    contactPhone,
    adminName,
    adminPassword,
    settings
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
          max_storage_gb, billing_cycle, monthly_rate, contact_email, contact_phone, settings
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
        contactPhone || '',
        JSON.stringify(settings || {
          modules: {
            mrReporting: true,
            dcr: true,
            attendance: true,
            doctorManagement: true,
            chemistManagement: true,
            expense: true,
            gpsTracking: true,
            targetManagement: true,
            orderManagement: true,
            sampleManagement: false,
            analytics: true,
            aiStudio: plan === 'Enterprise' || plan === 'ENTERPRISE'
          }
        })
      ]);

      const newTenant = insertRes.rows[0];

      // Provision default Company Admin user for this tenant if provided
      if (adminName || contactEmail) {
        const [firstName, ...lastNameParts] = (adminName || 'Company Admin').split(' ');
        const initialPassword = adminPassword || 'Admin@1234!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(initialPassword, salt);

        await query(`
          INSERT INTO users (
            tenant_id, email, password_hash, first_name, last_name, role, status, country_code
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING;
        `, [
          newTenant.id,
          contactEmail.toLowerCase(),
          hashedPassword,
          firstName || 'Admin',
          lastNameParts.join(' ') || 'User',
          'COMPANY_ADMIN',
          'Active',
          countryCode || 'VN'
        ]);
      }

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
        newTenant.id,
        JSON.stringify({ tenantName: name, code: tenantCode, country: countryCode, plan })
      ]);

      return res.status(201).json({
        success: true,
        message: 'Pharma Company Tenant provisioned successfully!',
        data: newTenant
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
    contactEmail,
    contactPhone,
    settings
  } = req.body;

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
          max_mrs = COALESCE($8, max_mrs),
          max_admins = COALESCE($9, max_admins),
          max_doctors = COALESCE($10, max_doctors),
          max_storage_gb = COALESCE($11, max_storage_gb),
          billing_cycle = COALESCE($12, billing_cycle),
          monthly_rate = COALESCE($13, monthly_rate),
          contact_email = COALESCE($14, contact_email),
          contact_phone = COALESCE($15, contact_phone),
          settings = COALESCE($16, settings),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $17
        RETURNING *;
      `, [
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

export default router;
