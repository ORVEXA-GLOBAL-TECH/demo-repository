import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query, checkDbHealth } from '../config/db.js';
import { users as mockUsers } from '../data/mockStore.js';

const router = Router();

// GET /api/users - List platform users with filtering (role, tenantId, status, search)
router.get('/', async (req, res) => {
  const { role, tenantId, status, search } = req.query;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      let queryStr = `
        SELECT 
          u.id,
          u.tenant_id,
          t.name as company_name,
          t.code as company_code,
          u.email,
          u.first_name,
          u.last_name,
          (u.first_name || ' ' || u.last_name) as name,
          u.role,
          u.territory,
          u.phone,
          u.country_code,
          u.status,
          u.avatar_url,
          u.last_login_at,
          u.created_at,
          u.updated_at
        FROM users u
        LEFT JOIN tenants_companies t ON u.tenant_id = t.id
        WHERE 1=1
      `;
      const queryParams = [];

      if (role && role !== 'ALL') {
        queryParams.push(role);
        queryStr += ` AND u.role = $${queryParams.length}`;
      }

      if (tenantId && tenantId !== 'ALL') {
        queryParams.push(tenantId);
        queryStr += ` AND u.tenant_id = $${queryParams.length}`;
      }

      if (status && status !== 'ALL') {
        queryParams.push(status);
        queryStr += ` AND u.status = $${queryParams.length}`;
      }

      if (search) {
        queryParams.push(`%${search}%`);
        queryStr += ` AND (u.first_name ILIKE $${queryParams.length} OR u.last_name ILIKE $${queryParams.length} OR u.email ILIKE $${queryParams.length})`;
      }

      queryStr += ` ORDER BY u.created_at DESC;`;

      const dbRes = await query(queryStr, queryParams);
      return res.json({ success: true, count: dbRes.rows.length, data: dbRes.rows });
    }

    // Offline mock fallback
    let list = [...mockUsers];
    if (role && role !== 'ALL') {
      list = list.filter(u => u.role === role);
    }
    return res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/users/:id - Get single user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query(`
        SELECT 
          u.id, u.tenant_id, t.name as company_name, u.email,
          u.first_name, u.last_name, u.role, u.territory, u.phone,
          u.country_code, u.status, u.avatar_url, u.last_login_at, u.created_at
        FROM users u
        LEFT JOIN tenants_companies t ON u.tenant_id = t.id
        WHERE u.id = $1;
      `, [id]);

      if (dbRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      return res.json({ success: true, data: dbRes.rows[0] });
    }
    return res.status(503).json({ success: false, message: 'Database offline.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users - Create new platform user
router.post('/', async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    name,
    role,
    tenantId,
    phone,
    territory,
    countryCode,
    status
  } = req.body;

  if (!email || !role) {
    return res.status(400).json({ success: false, message: 'Email and role are required.' });
  }

  const finalFirstName = firstName || (name ? name.split(' ')[0] : 'Platform');
  const finalLastName = lastName || (name ? name.split(' ').slice(1).join(' ') : 'User');
  const userPassword = password || 'User@1234!';

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      // Check existing email in tenant or global
      const existing = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1) AND (tenant_id = $2 OR tenant_id IS NULL)', [email, tenantId || null]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'User with this email already exists in this organization.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userPassword, salt);

      const insertRes = await query(`
        INSERT INTO users (
          tenant_id, email, password_hash, first_name, last_name,
          role, territory, phone, country_code, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, tenant_id, email, first_name, last_name, role, territory, phone, country_code, status, created_at;
      `, [
        tenantId || null,
        email.toLowerCase().trim(),
        hashedPassword,
        finalFirstName,
        finalLastName,
        role,
        territory || 'Default HQ',
        phone || '',
        countryCode || 'IN',
        status || 'Active'
      ]);

      const newUser = insertRes.rows[0];

      // Audit log
      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'USER_CREATED',
        'users',
        newUser.id,
        JSON.stringify({ email: newUser.email, role: newUser.role, tenantId: newUser.tenant_id })
      ]);

      return res.status(201).json({
        success: true,
        message: 'Platform user created successfully.',
        data: newUser
      });
    }

    return res.status(201).json({
      success: true,
      message: 'User created in demo mode.',
      data: { id: 'temp-usr-' + Date.now(), email, role, status: 'Active' }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/users/:id - Update user details
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    email,
    firstName,
    lastName,
    name,
    role,
    tenantId,
    phone,
    territory,
    countryCode,
    status
  } = req.body;

  let fName = firstName;
  let lName = lastName;
  if (name && (!fName || !lName)) {
    const parts = name.split(' ');
    fName = parts[0];
    lName = parts.slice(1).join(' ') || '';
  }

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const updateRes = await query(`
        UPDATE users
        SET
          email = COALESCE($1, email),
          first_name = COALESCE($2, first_name),
          last_name = COALESCE($3, last_name),
          role = COALESCE($4, role),
          tenant_id = COALESCE($5, tenant_id),
          phone = COALESCE($6, phone),
          territory = COALESCE($7, territory),
          country_code = COALESCE($8, country_code),
          status = COALESCE($9, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING id, tenant_id, email, first_name, last_name, role, territory, phone, country_code, status, updated_at;
      `, [
        email ? email.toLowerCase().trim() : null,
        fName,
        lName,
        role,
        tenantId !== undefined ? tenantId : null,
        phone,
        territory,
        countryCode,
        status,
        id
      ]);

      if (updateRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'USER_UPDATED',
        'users',
        id,
        JSON.stringify({ updated: req.body })
      ]);

      return res.json({
        success: true,
        message: 'User updated successfully.',
        data: updateRes.rows[0]
      });
    }

    return res.json({
      success: true,
      message: 'User updated in demo mode.',
      data: { id, ...req.body }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/users/:id/status - Toggle user active/suspended status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required.' });
  }

  try {
    const updateRes = await query(`
      UPDATE users
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, first_name, last_name, role, status;
    `, [status, id]);

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await query(`
      INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      'superadmin@alleviaresfa.com',
      'SUPER_ADMIN',
      'USER_STATUS_CHANGED',
      'users',
      id,
      JSON.stringify({ newStatus: status, email: updateRes.rows[0].email })
    ]);

    return res.json({
      success: true,
      message: `User status set to "${status}".`,
      data: updateRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/users/:id/reset-password - Reset user password
router.patch('/:id/reset-password', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updateRes = await query(`
      UPDATE users
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, first_name, last_name;
    `, [hashedPassword, id]);

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await query(`
      INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [
      'superadmin@alleviaresfa.com',
      'SUPER_ADMIN',
      'USER_PASSWORD_RESET',
      'users',
      id,
      JSON.stringify({ email: updateRes.rows[0].email })
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

// DELETE /api/users/:id - Delete platform user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const getRes = await query('SELECT email, role FROM users WHERE id = $1', [id]);
      if (getRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (getRes.rows[0].role === 'SUPER_ADMIN') {
        return res.status(403).json({ success: false, message: 'Master Super Admin cannot be deleted.' });
      }

      await query('DELETE FROM users WHERE id = $1', [id]);

      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'USER_DELETED',
        'users',
        id,
        JSON.stringify({ deletedEmail: getRes.rows[0].email })
      ]);

      return res.json({
        success: true,
        message: `User ${getRes.rows[0].email} deleted successfully.`
      });
    }

    return res.json({
      success: true,
      message: `User ${id} deleted in demo mode.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
