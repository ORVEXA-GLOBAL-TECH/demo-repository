import jwt from 'jsonwebtoken';
import { query, checkDbHealth } from '../config/db.js';
import { config } from '../config/index.js';

/**
 * Enterprise Authentication Middleware with Single-Session & Cookie Enforcement
 * Prevents concurrent logins across multiple tabs/windows/devices.
 */
export const verifyAuth = async (req, res, next) => {
  // 1. Extract Token from Cookies OR Authorization Header
  let token = null;

  if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'AUTH_REQUIRED',
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    // 2. Verify JWT signature
    const decoded = jwt.verify(token, config.jwtSecret);
    const dbHealth = await checkDbHealth();

    // 3. If Database is connected and token has a sessionId, enforce strict single-session check
    if (dbHealth.status === 'CONNECTED' && decoded.sessionId) {
      const sessionRes = await query(
        `SELECT id, user_id, is_active, invalidated_reason, expires_at 
         FROM public.user_sessions 
         WHERE id = $1 LIMIT 1;`,
        [decoded.sessionId]
      );

      // If session does not exist or has been terminated by another window's login
      if (sessionRes.rows.length === 0 || !sessionRes.rows[0].is_active) {
        // Clear all auth cookies immediately
        res.clearCookie('access_token', { httpOnly: true, sameSite: 'lax' });
        res.clearCookie('session_id', { httpOnly: true, sameSite: 'lax' });

        const reason = sessionRes.rows[0]?.invalidated_reason;
        const message = reason === 'CONCURRENT_LOGIN_DETECTED'
          ? 'Your session was closed because your account was logged in from another window or device.'
          : 'Your session is no longer active. Please log in again.';

        return res.status(401).json({
          success: false,
          code: 'SESSION_TERMINATED',
          reason: reason || 'SESSION_REVOKED',
          message
        });
      }

      const activeSession = sessionRes.rows[0];

      // Check if session has expired
      if (new Date(activeSession.expires_at) < new Date()) {
        await query(`UPDATE public.user_sessions SET is_active = FALSE, invalidated_reason = 'EXPIRED' WHERE id = $1;`, [decoded.sessionId]);
        res.clearCookie('access_token', { httpOnly: true, sameSite: 'lax' });
        res.clearCookie('session_id', { httpOnly: true, sameSite: 'lax' });

        return res.status(401).json({
          success: false,
          code: 'SESSION_EXPIRED',
          message: 'Your session has expired. Please log in again.'
        });
      }

      // Update last active timestamp asynchronously
      query(`UPDATE public.user_sessions SET last_active_at = CURRENT_TIMESTAMP WHERE id = $1;`, [decoded.sessionId]).catch(() => {});
    }

    // Attach decoded user and session metadata to request object
    req.user = decoded;
    req.sessionId = decoded.sessionId;
    next();
  } catch (err) {
    res.clearCookie('access_token', { httpOnly: true, sameSite: 'lax' });
    res.clearCookie('session_id', { httpOnly: true, sameSite: 'lax' });

    return res.status(401).json({
      success: false,
      code: 'INVALID_TOKEN',
      message: 'Session verification failed or token is invalid: ' + err.message
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Guard
 * @param  {...string} allowedRoles - e.g. 'SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'
 */
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userRole = (req.user.role || '').toUpperCase();
    const isSuperAdmin = req.user.isSuperAdmin || userRole === 'SUPER_ADMIN';

    if (isSuperAdmin) {
      return next(); // Super Admin has universal access
    }

    const authorized = allowedRoles.map(r => r.toUpperCase()).includes(userRole);
    if (!authorized) {
      return res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Current role: ${userRole}`
      });
    }

    next();
  };
};

export default {
  verifyAuth,
  requireRoles
};
