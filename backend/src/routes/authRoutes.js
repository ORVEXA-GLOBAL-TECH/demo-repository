import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query, checkDbHealth } from '../config/db.js';
import { config } from '../config/index.js';
import { verifyAuth, requireRoles } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * Cookie configuration helper
 */
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

/**
 * Helper to sanitize user object (strip password hash & sensitive info)
 */
const sanitizeUser = (user) => {
  const { password_hash, salt, two_factor_secret, recovery_codes, ...safeUser } = user;
  return {
    id: safeUser.id,
    name: `${safeUser.first_name || ''} ${safeUser.last_name || ''}`.trim() || safeUser.email?.split('@')[0],
    firstName: safeUser.first_name,
    lastName: safeUser.last_name,
    email: safeUser.email,
    phone: safeUser.phone,
    countryCode: safeUser.country_code,
    role: safeUser.role,
    isSuperAdmin: safeUser.is_superadmin || safeUser.role === 'SUPER_ADMIN',
    tenantId: safeUser.tenant_id,
    companyName: safeUser.company_name,
    department: safeUser.department,
    designation: safeUser.designation || (safeUser.role === 'SUPER_ADMIN' ? 'Master Platform Super Administrator' : safeUser.role),
    territory: safeUser.territory || 'Global HQ',
    status: safeUser.status,
    avatarUrl: safeUser.avatar_url,
    permissions: safeUser.permissions || [],
    preferences: safeUser.preferences || {},
    allowedPlatforms: safeUser.role === 'SUPER_ADMIN' || safeUser.role === 'COMPANY_ADMIN' 
      ? ['web'] 
      : (safeUser.role === 'MEDICAL_REP' ? ['app', 'web'] : ['web', 'app']),
    lastLoginAt: safeUser.last_login_at,
    createdAt: safeUser.created_at
  };
};

// ==============================================================================
// POST /api/auth/login & /api/auth/superadmin/login
// Live Database Authentication with Strict Single-Session Enforcement
// ==============================================================================
const handleLogin = async (req, res) => {
  const { email, password, platform = 'web' } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Both email address and password are required for authentication.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const dbHealth = await checkDbHealth();

    if (dbHealth.status !== 'CONNECTED') {
      return res.status(503).json({
        success: false,
        message: 'Database service is currently unreachable. Please check PostgreSQL / Supabase connection.'
      });
    }

    // 1. Fetch user from PostgreSQL/Supabase users table
    const userRes = await query(
      `SELECT * FROM public.users WHERE lower(email) = lower($1) LIMIT 1;`,
      [cleanEmail]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user account found with this email.'
      });
    }

    const dbUser = userRes.rows[0];

    // 2. Account Status Check
    if (dbUser.status && dbUser.status.toLowerCase() !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Account is currently ${dbUser.status}. Please contact the administrator.`
      });
    }

    // 3. Strict Bcrypt Password Verification
    if (!dbUser.password_hash) {
      return res.status(401).json({
        success: false,
        message: 'Account password not configured. Please contact the administrator.'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, dbUser.password_hash);

    if (!isPasswordValid) {
      // Increment failed login count
      await query(
        `UPDATE public.users SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1 WHERE id = $1;`,
        [dbUser.id]
      ).catch(() => {});

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    // ==============================================================================
    // 4. CONCURRENT LOGIN TERMINATION (Single Session Enforcement)
    // Any existing active session for this user in other windows/tabs is terminated.
    // ==============================================================================
    const priorSessions = await query(
      `SELECT id FROM public.user_sessions WHERE user_id = $1 AND is_active = TRUE;`,
      [dbUser.id]
    );

    if (priorSessions.rows.length > 0) {
      // Invalidate all prior sessions in the database
      await query(
        `UPDATE public.user_sessions 
         SET is_active = FALSE, invalidated_reason = 'CONCURRENT_LOGIN_DETECTED' 
         WHERE user_id = $1 AND is_active = TRUE;`,
        [dbUser.id]
      );

      // Notify other active tabs/windows via Socket.io in real-time
      const io = req.app.get('io');
      if (io) {
        io.to(`user_${dbUser.id}`).emit('FORCE_LOGOUT', {
          code: 'CONCURRENT_LOGIN_DETECTED',
          message: 'Your account was logged in from another window or device. This session has been terminated.',
          timestamp: new Date().toISOString()
        });
      }
    }

    // 5. Generate New Session & JWT
    const sessionId = crypto.randomUUID();
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const sanitized = sanitizeUser(dbUser);

    const token = jwt.sign(
      {
        id: sanitized.id,
        email: sanitized.email,
        role: sanitized.role,
        isSuperAdmin: sanitized.isSuperAdmin,
        tenantId: sanitized.tenantId,
        sessionId,
        name: sanitized.name,
        allowedPlatforms: sanitized.allowedPlatforms
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // 6. Record New Active Session in public.user_sessions
    await query(
      `INSERT INTO public.user_sessions (
         id, user_id, session_token, ip_address, user_agent, is_active, expires_at
       ) VALUES ($1, $2, $3, $4, $5, TRUE, $6);`,
      [
        sessionId,
        dbUser.id,
        sessionToken,
        req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
        req.headers['user-agent'] || 'Unknown Agent',
        expiresAt
      ]
    );

    // 7. Update User Login Metrics
    await query(
      `UPDATE public.users 
       SET last_login_at = CURRENT_TIMESTAMP, 
           last_login_ip = $1, 
           login_count = COALESCE(login_count, 0) + 1,
           failed_login_attempts = 0 
       WHERE id = $2;`,
      [req.ip || '127.0.0.1', dbUser.id]
    ).catch(() => {});

    // 8. Set HttpOnly Cookie for Secure Session Management
    const cookieOpts = getCookieOptions();
    res.cookie('access_token', token, cookieOpts);
    res.cookie('session_id', sessionId, cookieOpts);

    return res.json({
      success: true,
      message: 'Authentication successful',
      token,
      sessionId,
      user: sanitized
    });
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication: ' + error.message
    });
  }
};

router.post('/login', handleLogin);
router.post('/superadmin/login', handleLogin);

// ==============================================================================
// POST /api/auth/logout
// Explicit Session Logout & Invalidation
// ==============================================================================
router.post('/logout', async (req, res) => {
  let token = req.cookies?.access_token;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      if (decoded.sessionId) {
        await query(
          `UPDATE public.user_sessions 
           SET is_active = FALSE, invalidated_reason = 'USER_LOGOUT' 
           WHERE id = $1;`,
          [decoded.sessionId]
        ).catch(() => {});
      }
    } catch (e) {}
  }

  // Clear cookies
  res.clearCookie('access_token', { httpOnly: true, sameSite: 'lax' });
  res.clearCookie('session_id', { httpOnly: true, sameSite: 'lax' });

  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

// ==============================================================================
// GET /api/auth/me
// Verify Current Session & Return Profile
// ==============================================================================
router.get('/me', verifyAuth, async (req, res) => {
  try {
    const userRes = await query(`SELECT * FROM public.users WHERE id = $1 LIMIT 1;`, [req.user.id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found in database.' });
    }

    const sessionRes = await query(
      `SELECT id, ip_address, user_agent, last_active_at, expires_at 
       FROM public.user_sessions 
       WHERE id = $1 LIMIT 1;`,
      [req.sessionId]
    );

    return res.json({
      success: true,
      user: sanitizeUser(userRes.rows[0]),
      currentSession: sessionRes.rows[0] || null
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ==============================================================================
// GET /api/auth/session-status
// Lightweight endpoint to check if the current window's session is still active
// ==============================================================================
router.get('/session-status', verifyAuth, (req, res) => {
  res.json({
    success: true,
    active: true,
    userId: req.user.id,
    sessionId: req.sessionId
  });
});

// ==============================================================================
// POST /api/auth/change-password
// Update User Password with Bcrypt Hashing
// ==============================================================================
router.post('/change-password', verifyAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
  }

  try {
    const userRes = await query(`SELECT * FROM public.users WHERE id = $1 LIMIT 1;`, [req.user.id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const dbUser = userRes.rows[0];
    if (currentPassword && dbUser.password_hash) {
      const isMatch = await bcrypt.compare(currentPassword, dbUser.password_hash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await query(`UPDATE public.users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2;`, [newHash, req.user.id]);

    res.json({ success: true, message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==============================================================================
// SUPER ADMIN SESSION MANAGEMENT & OVERSIGHT ENDPOINTS
// ==============================================================================

// GET /api/auth/sessions - Super Admin view of all user sessions
router.get('/sessions', verifyAuth, requireRoles('SUPER_ADMIN'), async (req, res) => {
  const { status = 'all', userId, role, search, limit = 100, offset = 0 } = req.query;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status !== 'CONNECTED') {
      return res.status(503).json({ success: false, message: 'Database unreachable.' });
    }

    // 1. Fetch Global Session Metrics
    const metricsRes = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE is_active = TRUE) AS active_sessions_count,
        COUNT(DISTINCT user_id) FILTER (WHERE is_active = TRUE) AS active_users_count,
        COUNT(*) FILTER (WHERE is_active = FALSE) AS revoked_sessions_count,
        COUNT(*) AS total_sessions_count
      FROM public.user_sessions;
    `);

    // 2. Build Filtered Query for Sessions
    let queryStr = `
      SELECT 
        s.id AS session_id,
        s.user_id,
        u.email,
        u.first_name,
        u.last_name,
        (u.first_name || ' ' || u.last_name) AS user_name,
        u.role,
        u.avatar_url,
        u.department,
        u.designation,
        s.ip_address,
        s.user_agent,
        s.device_info,
        s.is_active,
        s.invalidated_reason,
        s.last_active_at,
        s.expires_at,
        s.created_at
      FROM public.user_sessions s
      JOIN public.users u ON s.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status === 'active') {
      params.push(true);
      queryStr += ` AND s.is_active = $${params.length}`;
    } else if (status === 'revoked') {
      params.push(false);
      queryStr += ` AND s.is_active = $${params.length}`;
    }

    if (userId) {
      params.push(userId);
      queryStr += ` AND s.user_id = $${params.length}`;
    }

    if (role && role !== 'ALL') {
      params.push(role);
      queryStr += ` AND u.role = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      queryStr += ` AND (u.email ILIKE $${params.length} OR u.first_name ILIKE $${params.length} OR u.last_name ILIKE $${params.length} OR s.ip_address ILIKE $${params.length})`;
    }

    queryStr += ` ORDER BY s.is_active DESC, s.last_active_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2};`;
    params.push(parseInt(limit, 10) || 100);
    params.push(parseInt(offset, 10) || 0);

    const sessionsRes = await query(queryStr, params);

    return res.json({
      success: true,
      metrics: {
        activeSessions: parseInt(metricsRes.rows[0]?.active_sessions_count || 0, 10),
        activeUsers: parseInt(metricsRes.rows[0]?.active_users_count || 0, 10),
        revokedSessions: parseInt(metricsRes.rows[0]?.revoked_sessions_count || 0, 10),
        totalSessions: parseInt(metricsRes.rows[0]?.total_sessions_count || 0, 10)
      },
      count: sessionsRes.rows.length,
      sessions: sessionsRes.rows
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve sessions: ' + err.message });
  }
});

// POST /api/auth/sessions/:sessionId/revoke - Super Admin revoke a single session
router.post('/sessions/:sessionId/revoke', verifyAuth, requireRoles('SUPER_ADMIN'), async (req, res) => {
  const { sessionId } = req.params;

  try {
    const sessionRes = await query(
      `SELECT id, user_id, is_active FROM public.user_sessions WHERE id = $1 LIMIT 1;`,
      [sessionId]
    );

    if (sessionRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const session = sessionRes.rows[0];

    // Invalidate session in database
    await query(
      `UPDATE public.user_sessions 
       SET is_active = FALSE, invalidated_reason = 'ADMIN_REVOKED' 
       WHERE id = $1;`,
      [sessionId]
    );

    // Instant Realtime Notification to force logout on client window
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${session.user_id}`).emit('FORCE_LOGOUT', {
        code: 'ADMIN_REVOKED',
        sessionId: session.id,
        message: 'Your session has been terminated by the Super Administrator.',
        timestamp: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      message: 'User session has been revoked immediately.',
      sessionId
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/users/:userId/revoke-all-sessions - Super Admin revoke ALL sessions of a specific user
router.post('/users/:userId/revoke-all-sessions', verifyAuth, requireRoles('SUPER_ADMIN'), async (req, res) => {
  const { userId } = req.params;

  try {
    const revokedRes = await query(
      `UPDATE public.user_sessions 
       SET is_active = FALSE, invalidated_reason = 'ADMIN_REVOKED' 
       WHERE user_id = $1 AND is_active = TRUE 
       RETURNING id;`,
      [userId]
    );

    const revokedCount = revokedRes.rows.length;

    // Instant Realtime Notification
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${userId}`).emit('FORCE_LOGOUT', {
        code: 'ADMIN_REVOKED',
        message: 'All active sessions for your account have been terminated by the Super Administrator.',
        timestamp: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      message: `Terminated ${revokedCount} active session(s) for user.`,
      revokedCount
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/sessions/revoke-all-others - Super Admin emergency kill switch (all other sessions)
router.post('/sessions/revoke-all-others', verifyAuth, requireRoles('SUPER_ADMIN'), async (req, res) => {
  try {
    const currentSessionId = req.sessionId;

    const revokedRes = await query(
      `UPDATE public.user_sessions 
       SET is_active = FALSE, invalidated_reason = 'ADMIN_BULK_REVOKED' 
       WHERE id != $1 AND is_active = TRUE 
       RETURNING id, user_id;`,
      [currentSessionId]
    );

    const io = req.app.get('io');
    if (io) {
      // Group unique users to broadcast
      const userIds = [...new Set(revokedRes.rows.map(r => r.user_id))];
      userIds.forEach(uid => {
        io.to(`user_${uid}`).emit('FORCE_LOGOUT', {
          code: 'ADMIN_BULK_REVOKED',
          message: 'All platform sessions have been reset by the Super Administrator.',
          timestamp: new Date().toISOString()
        });
      });
    }

    return res.json({
      success: true,
      message: `Successfully revoked ${revokedRes.rows.length} other session(s).`,
      revokedCount: revokedRes.rows.length
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
