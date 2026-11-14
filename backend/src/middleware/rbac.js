// Lightweight JWT + permission guards for the field-force routes.
// (verifyAuth additionally enforces single-session rows in public.user_sessions;
// these guards only need the signed token, so they also work for directory logins.)
import { readUser } from '../data/repo.js';
import { ROLE_PERMISSIONS_MAP } from '../routes/authRoutes.js';

// Roles that exist only in the PostgreSQL users table, mapped to the permission sets above.
const ROLE_ALIASES = {
  COMPANY_ADMIN: 'ADMIN', TENANT_ADMIN: 'ADMIN',
  MEDICAL_REP: 'MR', FIELD_MR: 'MR',
  AREA_MANAGER: 'MANAGER', REGIONAL_MANAGER: 'MANAGER',
  SUPERVISOR: 'MR_SUPERVISOR'
};

export const effectiveRole = (user) => ROLE_ALIASES[user?.role] || user?.role;

export const permissionsOf = (user) => {
  const role = effectiveRole(user);
  if (role === 'SUPER_ADMIN') return ['*'];
  return ROLE_PERMISSIONS_MAP[role] || user?.permissions || [];
};

export const requireLogin = (req, res, next) => {
  const user = readUser(req);
  if (!user) {
    return res.status(401).json({ success: false, code: 'AUTH_REQUIRED', message: 'Please sign in to continue.' });
  }
  req.user = user;
  next();
};

export const requirePermission = (...codes) => (req, res, next) => {
  requireLogin(req, res, () => {
    const perms = permissionsOf(req.user);
    if (perms.includes('*') || codes.some((c) => perms.includes(c))) return next();
    return res.status(403).json({
      success: false,
      code: 'FORBIDDEN',
      message: `Your role (${req.user.role}) is not permitted to perform this action.`
    });
  });
};

/** MRs only ever see their own records; every other role sees the whole company. */
export const isOwnRecordsOnly = (user) => effectiveRole(user) === 'MR';

/** Mock-data equivalent of the SQL scoping: filter a list down to the signed-in MR's records. */
export const ownOnly = (req, list) =>
  isOwnRecordsOnly(req.user) ? list.filter((r) => r.mrName === req.user.name) : list;
