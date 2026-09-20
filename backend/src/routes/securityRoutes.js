import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// In-memory default store for platform security policies
let securityPoliciesStore = {
  mfaPolicy: {
    mode: 'MANDATORY_ADMINS', // DISABLED | OPTIONAL | MANDATORY_ADMINS | MANDATORY_ALL
    allowedMethods: ['TOTP', 'SMS', 'EMAIL'],
    gracePeriodDays: 7,
    enforceRememberDeviceDays: 30
  },
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90, // 0 = never
    preventReuseCount: 5
  },
  sessionPolicy: {
    maxConcurrentSessions: 3,
    idleTimeoutMinutes: 60,
    absoluteTimeoutHours: 24,
    rememberMeDays: 30,
    invalidateOnPasswordChange: true
  },
  loginLimits: {
    maxFailedAttempts: 5,
    attemptWindowMinutes: 15
  },
  accountLockout: {
    lockoutType: 'TEMPORARY', // TEMPORARY | PERMANENT_ADMIN_UNLOCK
    lockoutDurationMinutes: 30,
    autoNotifyAdmin: true,
    notifyUserEmail: true
  },
  ipRestrictions: {
    enabled: false,
    enforceForAdminsOnly: true,
    whitelist: ['103.21.144.0/24', '142.250.190.0/24'],
    blacklist: ['185.220.101.5', '45.148.10.0/24']
  },
  deviceRestrictions: {
    enabled: true,
    allowedDeviceTypes: ['DESKTOP', 'MOBILE', 'TABLET'],
    maxDevicesPerUser: 3,
    blockRootedJailbroken: true,
    requireDeviceApproval: false
  },
  suspiciousLoginDetection: {
    enabled: true,
    alertOnNewCountry: true,
    alertOnNewDevice: true,
    impossibleTravelCheck: true,
    autoChallengeOtp: true,
    velocityThresholdKmPerHour: 500
  }
};

// In-memory active sessions store
let activeSessionsStore = [
  {
    sessionId: 'sess_98201',
    userId: 'usr_super_01',
    userName: 'Shiva Kumar (Super Admin)',
    userEmail: 'master.admin@alleviaresfa.com',
    companyName: 'Platform HQ (Global)',
    tenantId: null,
    role: 'SUPER_ADMIN',
    ipAddress: '103.21.144.92',
    deviceInfo: 'Chrome 128.0 (Windows 11 x64)',
    location: 'Mumbai, India 🇮🇳',
    loginTime: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    isCurrentSession: true,
    mfaVerified: true,
    status: 'ACTIVE'
  },
  {
    sessionId: 'sess_98202',
    userId: 'usr_pfizer_adm',
    userName: 'Marcus Vance',
    userEmail: 'admin@pfizer-care.com',
    companyName: 'Pfizer BioPharma Ltd',
    tenantId: 't_pfizer_02',
    role: 'COMPANY_ADMIN',
    ipAddress: '142.250.190.46',
    deviceInfo: 'Edge 128.0 (macOS 14.5 Sonoma)',
    location: 'New York, US 🇺🇸',
    loginTime: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    isCurrentSession: false,
    mfaVerified: true,
    status: 'ACTIVE'
  },
  {
    sessionId: 'sess_98203',
    userId: 'usr_novartis_adm',
    userName: 'Elena Rostova',
    userEmail: 'admin@novartis-pharma.ch',
    companyName: 'Novartis Pharma Global',
    tenantId: 't_novartis_01',
    role: 'COMPANY_ADMIN',
    ipAddress: '194.230.145.22',
    deviceInfo: 'Safari 17.5 (macOS)',
    location: 'Basel, Switzerland 🇨🇭',
    loginTime: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    isCurrentSession: false,
    mfaVerified: true,
    status: 'ACTIVE'
  },
  {
    sessionId: 'sess_98204',
    userId: 'usr_astra_mr',
    userName: 'Rajesh Sharma',
    userEmail: 'rajesh.mr@astrazeneca.com',
    companyName: 'AstraZeneca Healthcare',
    tenantId: 't_astra_03',
    role: 'MEDICAL_REP',
    ipAddress: '49.37.112.80',
    deviceInfo: 'Alleviare Mobile App v2.4 (Android 14)',
    location: 'New Delhi, India 🇮🇳',
    loginTime: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    isCurrentSession: false,
    mfaVerified: false,
    status: 'ACTIVE'
  },
  {
    sessionId: 'sess_98205',
    userId: 'usr_sanofi_mgr',
    userName: 'Jean-Luc Picard',
    userEmail: 'jl.picard@sanofi.fr',
    companyName: 'Sanofi Healthcare Ltd',
    tenantId: 't_sanofi_04',
    role: 'AREA_MANAGER',
    ipAddress: '82.64.18.90',
    deviceInfo: 'Firefox 129.0 (Ubuntu Linux)',
    location: 'Paris, France 🇫🇷',
    loginTime: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    isCurrentSession: false,
    mfaVerified: true,
    status: 'ACTIVE'
  }
];

// In-memory security alerts store
let securityAlertsStore = [
  {
    id: 'SEC-ALT-101',
    alertType: 'SUSPICIOUS_LOGIN_IMPOSSIBLE_TRAVEL',
    severity: 'CRITICAL',
    title: 'Impossible Travel Anomaly Detected',
    description: 'User admin@novartis-pharma.ch authenticated from Basel, Switzerland and 12 minutes later from Singapore (Velocity: 4,800 km/h).',
    ipAddress: '103.1.200.4',
    userEmail: 'admin@novartis-pharma.ch',
    companyName: 'Novartis Pharma Global',
    status: 'UNRESOLVED',
    actionTaken: 'MFA Step-Up Challenge Triggered',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    id: 'SEC-ALT-102',
    alertType: 'BRUTE_FORCE_LOCKOUT',
    severity: 'HIGH',
    title: 'Account Locked: 5 Consecutive Failed Passwords',
    description: 'Account usr_sanofi_99 locked for 30 minutes following repeated password validation failures from IP 185.220.101.5.',
    ipAddress: '185.220.101.5',
    userEmail: 'sales.sanofi@pharma.com',
    companyName: 'Sanofi Healthcare Ltd',
    status: 'UNRESOLVED',
    actionTaken: 'Temporary 30-Minute Account Lockout',
    createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString()
  },
  {
    id: 'SEC-ALT-103',
    alertType: 'BLACKLISTED_IP_BLOCKED',
    severity: 'MEDIUM',
    title: 'Inbound Request from Blacklisted CIDR Blocked',
    description: 'WAF rate-limiter rejected authentication handshake from known proxy IP 45.148.10.14.',
    ipAddress: '45.148.10.14',
    userEmail: 'unknown_probe@scanner.org',
    companyName: 'Platform Perimeter',
    status: 'RESOLVED',
    actionTaken: 'Connection Dropped at Gateway Layer',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  }
];

/**
 * GET /api/security/policies
 * Returns all platform security policies
 */
router.get('/policies', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      try {
        const dbRes = await query(`
          SELECT security_policy, password_policy, session_timeout_minutes 
          FROM platform_settings 
          WHERE id = 'global_default'
        `);
        if (dbRes.rows.length > 0) {
          const row = dbRes.rows[0];
          const sec = typeof row.security_policy === 'string' ? JSON.parse(row.security_policy) : (row.security_policy || {});
          const pwd = typeof row.password_policy === 'string' ? JSON.parse(row.password_policy) : (row.password_policy || {});

          securityPoliciesStore = {
            ...securityPoliciesStore,
            passwordPolicy: {
              ...securityPoliciesStore.passwordPolicy,
              ...pwd
            },
            sessionPolicy: {
              ...securityPoliciesStore.sessionPolicy,
              idleTimeoutMinutes: row.session_timeout_minutes || 60
            },
            ...sec
          };
        }
      } catch (e) {
        console.warn('DB read platform_settings fallback:', e.message);
      }
    }

    res.json({
      success: true,
      data: securityPoliciesStore,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/security/policies
 * Updates platform security policies
 */
router.put('/policies', async (req, res) => {
  const incoming = req.body;
  try {
    const oldPolicies = { ...securityPoliciesStore };
    securityPoliciesStore = {
      ...securityPoliciesStore,
      ...incoming
    };

    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      try {
        await query(`
          UPDATE platform_settings
          SET security_policy = $1,
              password_policy = $2,
              session_timeout_minutes = $3,
              updated_at = NOW()
          WHERE id = 'global_default'
        `, [
          JSON.stringify(securityPoliciesStore),
          JSON.stringify(securityPoliciesStore.passwordPolicy),
          securityPoliciesStore.sessionPolicy?.idleTimeoutMinutes || 60
        ]);

        // Insert audit log
        await query(`
          INSERT INTO platform_audit_logs (
            actor_email, actor_name, actor_role, action, target_entity,
            old_value, new_value, details
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          'superadmin@alleviaresfa.com',
          'Super Admin',
          'SUPER_ADMIN',
          'SECURITY_POLICIES_UPDATED',
          'Platform Security & Authentication Governance',
          JSON.stringify(oldPolicies),
          JSON.stringify(securityPoliciesStore),
          JSON.stringify({ note: 'Super Admin updated global platform security policies.' })
        ]);
      } catch (dbErr) {
        console.warn('DB update security policies notice:', dbErr.message);
      }
    }

    res.json({
      success: true,
      message: 'Global platform security policies updated and enforced across all tenants.',
      data: securityPoliciesStore
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/security/active-sessions
 * Returns live active user sessions across all companies
 */
router.get('/active-sessions', async (req, res) => {
  const { search, tenantId } = req.query;
  try {
    let list = [...activeSessionsStore];
    if (tenantId && tenantId !== 'ALL') {
      list = list.filter(s => s.tenantId === tenantId);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.userName.toLowerCase().includes(q) ||
        s.userEmail.toLowerCase().includes(q) ||
        s.companyName.toLowerCase().includes(q) ||
        s.ipAddress.includes(q) ||
        s.deviceInfo.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/security/sessions/:id/terminate
 * Terminate a specific active session
 */
router.post('/sessions/:id/terminate', async (req, res) => {
  const { id } = req.params;
  try {
    const session = activeSessionsStore.find(s => s.sessionId === id);
    activeSessionsStore = activeSessionsStore.filter(s => s.sessionId !== id);

    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED' && session?.userId) {
      try {
        await query(`
          UPDATE users 
          SET token_version = token_version + 1 
          WHERE id::text = $1 OR email = $2
        `, [session.userId, session.userEmail]);

        await query(`
          INSERT INTO platform_audit_logs (
            actor_email, actor_name, actor_role, action, target_entity,
            entity_id, old_value, new_value, details
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          'superadmin@alleviaresfa.com',
          'Super Admin',
          'SUPER_ADMIN',
          'SESSION_TERMINATED',
          'Active Session Security',
          id,
          JSON.stringify({ status: 'ACTIVE', sessionId: id }),
          JSON.stringify({ status: 'TERMINATED' }),
          JSON.stringify({ targetUser: session?.userEmail, reason: 'Super Admin terminated session' })
        ]);
      } catch (e) {}
    }

    res.json({
      success: true,
      message: `Active session ${id} terminated successfully. Token invalidated.`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/security/users/:id/force-logout
 * Forces logout on all devices for a given user
 */
router.post('/users/:id/force-logout', async (req, res) => {
  const { id } = req.params;
  try {
    activeSessionsStore = activeSessionsStore.filter(s => s.userId !== id && s.userEmail !== id);

    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      try {
        await query(`
          UPDATE users 
          SET token_version = token_version + 1 
          WHERE id::text = $1 OR email = $2
        `, [id, id]);

        await query(`
          INSERT INTO platform_audit_logs (
            actor_email, actor_name, actor_role, action, target_entity,
            entity_id, old_value, new_value, details
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          'superadmin@alleviaresfa.com',
          'Super Admin',
          'SUPER_ADMIN',
          'USER_FORCE_LOGOUT_ALL_DEVICES',
          'User Security & Tokens',
          id,
          JSON.stringify({ all_sessions: 'ACTIVE' }),
          JSON.stringify({ all_sessions: 'TERMINATED', token_version_incremented: true }),
          JSON.stringify({ target: id, reason: 'Super Admin invoked platform force logout' })
        ]);
      } catch (e) {}
    }

    res.json({
      success: true,
      message: `All sessions revoked and token version incremented for user ${id}.`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/security/sessions/terminate-all
 * Emergency terminate all active sessions across platform (except Super Admin)
 */
router.post('/sessions/terminate-all', async (req, res) => {
  try {
    const count = activeSessionsStore.length - 1;
    activeSessionsStore = activeSessionsStore.filter(s => s.isCurrentSession);

    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      try {
        await query(`UPDATE users SET token_version = token_version + 1 WHERE role != 'SUPER_ADMIN'`);
        await query(`
          INSERT INTO platform_audit_logs (
            actor_email, actor_name, actor_role, action, target_entity,
            old_value, new_value, details
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          'superadmin@alleviaresfa.com',
          'Super Admin',
          'SUPER_ADMIN',
          'GLOBAL_FORCE_LOGOUT_ALL_USERS',
          'Platform Emergency Security',
          JSON.stringify({ status: 'ALL_SESSIONS_ACTIVE' }),
          JSON.stringify({ status: 'ALL_NON_SUPERADMIN_SESSIONS_REVOKED' }),
          JSON.stringify({ terminatedCount: count })
        ]);
      } catch (e) {}
    }

    res.json({
      success: true,
      message: `Emergency global logout executed. Terminated ${count} active tenant sessions.`,
      terminatedCount: count
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/security/alerts
 * Returns platform security alerts
 */
router.get('/alerts', async (req, res) => {
  try {
    res.json({
      success: true,
      count: securityAlertsStore.length,
      data: securityAlertsStore
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/security/alerts/:id/resolve
 * Resolves a security alert
 */
router.post('/alerts/:id/resolve', async (req, res) => {
  const { id } = req.params;
  try {
    securityAlertsStore = securityAlertsStore.map(a =>
      a.id === id ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : a
    );
    res.json({ success: true, message: `Security alert ${id} marked as resolved.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
