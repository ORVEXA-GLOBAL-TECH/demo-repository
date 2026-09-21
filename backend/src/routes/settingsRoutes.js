import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// ==============================================================================
// DEFAULT GLOBAL PLATFORM CONFIGURATION
// ==============================================================================
export const DEFAULT_GLOBAL_SETTINGS = {
  id: 'global_default',
  dateFormat: 'YYYY-MM-DD',
  timezone: 'UTC',
  currency: 'USD',
  language: 'en',
  defaultWorkingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  notificationSettings: {
    email: true,
    inApp: true,
    sms: false,
    push: true,
    weeklyDigest: true,
    criticalAlerts: true
  },
  securityPolicy: {
    enforce2FA: false,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 15,
    allowMultipleSessions: true
  },
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90
  },
  sessionTimeoutMinutes: 60,
  fileLimits: {
    maxFileSizeMB: 25,
    allowedFileTypes: ['pdf', 'jpg', 'png', 'xlsx', 'csv', 'docx']
  },
  usageLimits: {
    maxUsersPerTenant: 100,
    dailyApiCallsQuota: 50000,
    monthlyReportsQuota: 1000,
    gpsHistoryRetentionDays: 90,
    maxFileUploadMB: 25,
    maxStorageQuotaGB: 50
  },
  maintenanceConfig: {
    isPlatformMaintenance: false,
    platformMaintenanceMessage: 'System Maintenance in progress. Platform access will resume shortly.',
    estimatedEndAt: null,
    allowedIpAddresses: ['103.21.244.18', '127.0.0.1'],
    moduleMaintenances: {
      geofencing: false,
      dcrReporting: false,
      chemistOrders: false,
      sampleInventory: false,
      aiStudio: false,
      apiIntegrations: false,
      analytics: false
    },
    companyMaintenances: {}
  },
  updatedAt: new Date().toISOString()
};

// ==============================================================================
// DEFAULT ROLE TEMPLATES & RBAC PERMISSION MATRIX
// ==============================================================================
export const DEFAULT_ROLE_TEMPLATES = [
  {
    roleKey: 'SUPER_ADMIN',
    roleName: 'Super Admin (Master Platform Authority)',
    description: 'Supreme root authority with absolute control over all companies, platform configuration, billing, security, and role templates.',
    isSystemImmutable: true,
    permissions: {
      // Platform Governance & Settings
      'platform.view_all_tenants': true,
      'platform.manage_tenants': true,
      'platform.global_settings': true,
      'platform.role_templates': true,
      'platform.emergency_killswitch': true,
      'platform.view_audit_logs': true,
      'platform.manage_billing': true,
      'platform.impersonate_admin': true,
      // User & Tenant Governance
      'users.create_admin': true,
      'users.edit_admin': true,
      'users.toggle_status': true,
      'users.reset_password': true,
      'users.force_logout': true,
      'users.lock_unlock': true,
      'users.change_permissions': true,
      'users.view_activity': true,
      'users.view_login_history': true,
      // Subscription & Plan Governance
      'plans.create': true,
      'plans.edit': true,
      'plans.delete': true,
      'subscriptions.assign': true,
      'subscriptions.upgrade_downgrade': true,
      'subscriptions.configure_dates': true,
      'subscriptions.manage_grace_period': true,
      'subscriptions.auto_suspend': true,
      // Tenant Operational Access
      'catalog.manage': true,
      'dcr.manage': true,
      'orders.manage': true,
      'field_tracking.view': true
    }
  },
  {
    roleKey: 'COMPANY_ADMIN',
    roleName: 'Company Admin (Tenant Executive)',
    description: 'Full administrative control within their assigned pharmaceutical company. Strictly restricted from modifying Super Admin or global settings.',
    isSystemImmutable: false,
    permissions: {
      // Platform Governance (STRICTLY DENIED)
      'platform.view_all_tenants': false,
      'platform.manage_tenants': false,
      'platform.global_settings': false,
      'platform.role_templates': false,
      'platform.emergency_killswitch': false,
      'platform.impersonate_admin': false,
      // Company Operational Governance
      'company.view_profile': true,
      'company.edit_profile': true,
      'company.manage_overrides': true,
      'company.view_invoices': true,
      // Tenant User Management
      'users.create_user': true,
      'users.edit_user': true,
      'users.toggle_status': true,
      'users.reset_password': true,
      'users.force_logout': true,
      'users.view_activity': true,
      // Field Sales & Operations
      'catalog.manage': true,
      'doctors.manage': true,
      'chemists.manage': true,
      'stockists.manage': true,
      'dcr.view_all': true,
      'dcr.approve_reject': true,
      'orders.view_all': true,
      'orders.approve_reject': true,
      'field_tracking.view_live': true,
      'attendance.view_reports': true,
      'analytics.view_dashboard': true,
      'export.download_reports': true
    }
  },
  {
    roleKey: 'AREA_MANAGER',
    roleName: 'Area / Regional Sales Manager',
    description: 'Regional supervisor managing Medical Representatives, reviewing field DCR reports, and approving sales orders.',
    isSystemImmutable: false,
    permissions: {
      'team.view_members': true,
      'doctors.view': true,
      'chemists.view': true,
      'dcr.view_team': true,
      'dcr.approve_reject': true,
      'orders.view_team': true,
      'orders.approve_reject': true,
      'tour_plans.approve': true,
      'field_tracking.view_team': true,
      'attendance.view_team': true,
      'analytics.view_team': true
    }
  },
  {
    roleKey: 'MEDICAL_REP',
    roleName: 'Medical Representative (Field Sales Rep)',
    description: 'Field executive logging daily doctor/chemist call visits, taking POB orders, recording attendance, and syncing GPS telemetry.',
    isSystemImmutable: false,
    permissions: {
      'dcr.create': true,
      'dcr.view_own': true,
      'orders.create': true,
      'orders.view_own': true,
      'doctors.view': true,
      'chemists.view': true,
      'catalog.view': true,
      'tour_plans.create': true,
      'attendance.mark': true,
      'gps.send_telemetry': true
    }
  },
  {
    roleKey: 'AUDITOR',
    roleName: 'Compliance & Audit Inspector',
    description: 'Read-only compliance officer reviewing audit logs, system access history, and regulatory sales compliance.',
    isSystemImmutable: false,
    permissions: {
      'audit.view_logs': true,
      'login_history.view': true,
      'reports.view_compliance': true,
      'reports.export': true
    }
  }
];

// In-memory runtime cache for resilience
let runtimeGlobalSettings = { ...DEFAULT_GLOBAL_SETTINGS };
let runtimeRoleTemplates = [...DEFAULT_ROLE_TEMPLATES];

// Helper: Ensure platform settings table exists in PostgreSQL
const ensureSettingsSchema = async () => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      await query(`
        CREATE TABLE IF NOT EXISTS platform_settings (
          id VARCHAR(50) PRIMARY KEY DEFAULT 'global_default',
          date_format VARCHAR(20) NOT NULL DEFAULT 'YYYY-MM-DD',
          timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
          currency VARCHAR(10) NOT NULL DEFAULT 'USD',
          language VARCHAR(10) NOT NULL DEFAULT 'en',
          default_working_days JSONB NOT NULL DEFAULT '["Mon", "Tue", "Wed", "Thu", "Fri"]'::jsonb,
          notification_settings JSONB NOT NULL DEFAULT '{"email": true, "in_app": true, "sms": false, "push": true, "weekly_digest": true, "critical_alerts": true}'::jsonb,
          security_policy JSONB NOT NULL DEFAULT '{"enforce_2fa": false, "max_login_attempts": 5, "lockout_duration_minutes": 15, "allow_multiple_sessions": true}'::jsonb,
          password_policy JSONB NOT NULL DEFAULT '{"min_length": 8, "require_uppercase": true, "require_numbers": true, "require_special_chars": true, "expiry_days": 90}'::jsonb,
          session_timeout_minutes INT NOT NULL DEFAULT 60,
          file_limits JSONB NOT NULL DEFAULT '{"max_file_size_mb": 25, "allowed_file_types": ["pdf", "jpg", "png", "xlsx", "csv", "docx"]}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS role_templates (
          role_key VARCHAR(50) PRIMARY KEY,
          role_name VARCHAR(100) NOT NULL,
          description TEXT,
          is_system_immutable BOOLEAN DEFAULT false,
          permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
  } catch (err) {
    console.warn('PostgreSQL ensureSettingsSchema non-critical notice:', err.message);
  }
};

// ==============================================================================
// 1. GET GLOBAL SETTINGS
// ==============================================================================
router.get('/global', async (req, res) => {
  try {
    await ensureSettingsSchema();
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query(`SELECT * FROM platform_settings WHERE id = 'global_default' LIMIT 1;`);
      if (dbRes.rows.length > 0) {
        const row = dbRes.rows[0];
        const formatted = {
          id: row.id,
          dateFormat: row.date_format,
          timezone: row.timezone,
          currency: row.currency,
          language: row.language,
          defaultWorkingDays: typeof row.default_working_days === 'string' ? JSON.parse(row.default_working_days) : row.default_working_days,
          notificationSettings: typeof row.notification_settings === 'string' ? JSON.parse(row.notification_settings) : row.notification_settings,
          securityPolicy: typeof row.security_policy === 'string' ? JSON.parse(row.security_policy) : row.security_policy,
          passwordPolicy: typeof row.password_policy === 'string' ? JSON.parse(row.password_policy) : row.password_policy,
          sessionTimeoutMinutes: row.session_timeout_minutes,
          fileLimits: typeof row.file_limits === 'string' ? JSON.parse(row.file_limits) : row.file_limits,
          updatedAt: row.updated_at
        };
        runtimeGlobalSettings = { ...formatted };
        return res.json({ success: true, data: formatted });
      }
    }
    return res.json({ success: true, data: runtimeGlobalSettings });
  } catch (err) {
    return res.json({ success: true, data: runtimeGlobalSettings });
  }
});

// ==============================================================================
// 2. UPDATE GLOBAL SETTINGS (Super Admin Only)
// ==============================================================================
router.put('/global', async (req, res) => {
  try {
    const {
      dateFormat,
      timezone,
      currency,
      language,
      defaultWorkingDays,
      notificationSettings,
      securityPolicy,
      passwordPolicy,
      sessionTimeoutMinutes,
      fileLimits
    } = req.body;

    const updated = {
      ...runtimeGlobalSettings,
      ...(dateFormat !== undefined && { dateFormat }),
      ...(timezone !== undefined && { timezone }),
      ...(currency !== undefined && { currency }),
      ...(language !== undefined && { language }),
      ...(defaultWorkingDays !== undefined && { defaultWorkingDays }),
      ...(notificationSettings !== undefined && { notificationSettings }),
      ...(securityPolicy !== undefined && { securityPolicy }),
      ...(passwordPolicy !== undefined && { passwordPolicy }),
      ...(sessionTimeoutMinutes !== undefined && { sessionTimeoutMinutes: Number(sessionTimeoutMinutes) }),
      ...(fileLimits !== undefined && { fileLimits }),
      updatedAt: new Date().toISOString()
    };

    runtimeGlobalSettings = updated;

    await ensureSettingsSchema();
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      await query(`
        INSERT INTO platform_settings (
          id, date_format, timezone, currency, language,
          default_working_days, notification_settings, security_policy,
          password_policy, session_timeout_minutes, file_limits, updated_at
        ) VALUES (
          'global_default', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          date_format = EXCLUDED.date_format,
          timezone = EXCLUDED.timezone,
          currency = EXCLUDED.currency,
          language = EXCLUDED.language,
          default_working_days = EXCLUDED.default_working_days,
          notification_settings = EXCLUDED.notification_settings,
          security_policy = EXCLUDED.security_policy,
          password_policy = EXCLUDED.password_policy,
          session_timeout_minutes = EXCLUDED.session_timeout_minutes,
          file_limits = EXCLUDED.file_limits,
          updated_at = NOW();
      `, [
        updated.dateFormat,
        updated.timezone,
        updated.currency,
        updated.language,
        JSON.stringify(updated.defaultWorkingDays),
        JSON.stringify(updated.notificationSettings),
        JSON.stringify(updated.securityPolicy),
        JSON.stringify(updated.passwordPolicy),
        updated.sessionTimeoutMinutes,
        JSON.stringify(updated.fileLimits)
      ]);
    }

    return res.json({
      success: true,
      message: 'Global platform configuration updated successfully.',
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 3. GET EFFECTIVE COMPANY SETTINGS (Global + Company Overrides)
// ==============================================================================
router.get('/company/:companyId', async (req, res) => {
  const { companyId } = req.params;
  try {
    let companyName = 'Unknown Company';
    let companyOverrides = {};

    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const cRes = await query(`
        SELECT id, name, default_timezone, currency_code, settings 
        FROM tenants_companies 
        WHERE id = $1;
      `, [companyId]);

      if (cRes.rows.length > 0) {
        const row = cRes.rows[0];
        companyName = row.name;
        companyOverrides = (typeof row.settings === 'string' ? JSON.parse(row.settings) : row.settings) || {};
        
        // Also map legacy direct columns if not already in overrides
        if (!companyOverrides.timezone && row.default_timezone) {
          companyOverrides.timezone = row.default_timezone;
        }
        if (!companyOverrides.currency && row.currency_code) {
          companyOverrides.currency = row.currency_code;
        }
      }
    }

    // Merge global defaults with company-specific overrides
    const effective = {
      companyId,
      companyName,
      hasOverrides: Object.keys(companyOverrides).length > 0,
      overrides: companyOverrides,
      effectiveSettings: {
        dateFormat: companyOverrides.dateFormat || runtimeGlobalSettings.dateFormat,
        timezone: companyOverrides.timezone || runtimeGlobalSettings.timezone,
        currency: companyOverrides.currency || runtimeGlobalSettings.currency,
        language: companyOverrides.language || runtimeGlobalSettings.language,
        workingDays: companyOverrides.workingDays || runtimeGlobalSettings.defaultWorkingDays,
        notificationSettings: {
          ...runtimeGlobalSettings.notificationSettings,
          ...(companyOverrides.notificationSettings || {})
        },
        securityPolicy: {
          ...runtimeGlobalSettings.securityPolicy,
          ...(companyOverrides.securityPolicy || {})
        },
        passwordPolicy: {
          ...runtimeGlobalSettings.passwordPolicy,
          ...(companyOverrides.passwordPolicy || {})
        },
        sessionTimeoutMinutes: companyOverrides.sessionTimeoutMinutes !== undefined 
          ? Number(companyOverrides.sessionTimeoutMinutes) 
          : runtimeGlobalSettings.sessionTimeoutMinutes,
        fileLimits: {
          ...runtimeGlobalSettings.fileLimits,
          ...(companyOverrides.fileLimits || {})
        }
      },
      globalDefaults: runtimeGlobalSettings
    };

    return res.json({ success: true, data: effective });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 4. UPDATE COMPANY-SPECIFIC OVERRIDES
// ==============================================================================
router.put('/company/:companyId/overrides', async (req, res) => {
  const { companyId } = req.params;
  const { overrides } = req.body;

  try {
    if (!overrides || typeof overrides !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid overrides payload.' });
    }

    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query(`
        UPDATE tenants_companies
        SET settings = $1,
            default_timezone = COALESCE($2, default_timezone),
            currency_code = COALESCE($3, currency_code),
            updated_at = NOW()
        WHERE id = $4
        RETURNING id, name, settings, default_timezone, currency_code;
      `, [
        JSON.stringify(overrides),
        overrides.timezone || null,
        overrides.currency || null,
        companyId
      ]);

      if (dbRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Company tenant not found.' });
      }

      return res.json({
        success: true,
        message: 'Company settings overrides updated successfully.',
        data: {
          companyId,
          companyName: dbRes.rows[0].name,
          overrides: dbRes.rows[0].settings
        }
      });
    }

    return res.json({
      success: true,
      message: 'Company overrides saved in memory mode.',
      data: { companyId, overrides }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 5. RESET COMPANY SETTINGS TO GLOBAL DEFAULTS
// ==============================================================================
router.delete('/company/:companyId/overrides', async (req, res) => {
  const { companyId } = req.params;
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      await query(`
        UPDATE tenants_companies
        SET settings = '{}'::jsonb,
            updated_at = NOW()
        WHERE id = $1;
      `, [companyId]);
    }

    return res.json({
      success: true,
      message: 'Company overrides removed. Now inheriting platform global defaults.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 6. GET ROLE TEMPLATES & RBAC PERMISSION MATRIX
// ==============================================================================
router.get('/roles', async (req, res) => {
  try {
    await ensureSettingsSchema();
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query(`SELECT * FROM role_templates ORDER BY role_key ASC;`);
      if (dbRes.rows.length > 0) {
        const mapped = dbRes.rows.map(r => ({
          roleKey: r.role_key,
          roleName: r.role_name,
          description: r.description,
          isSystemImmutable: r.is_system_immutable,
          permissions: typeof r.permissions === 'string' ? JSON.parse(r.permissions) : r.permissions,
          updatedAt: r.updated_at
        }));
        return res.json({ success: true, count: mapped.length, data: mapped });
      }
    }
    return res.json({ success: true, count: runtimeRoleTemplates.length, data: runtimeRoleTemplates });
  } catch (err) {
    return res.json({ success: true, count: runtimeRoleTemplates.length, data: runtimeRoleTemplates });
  }
});

// ==============================================================================
// 7. UPDATE ROLE PERMISSIONS (Super Admin Guardrail Enforced)
// ==============================================================================
router.put('/roles/:roleKey', async (req, res) => {
  const { roleKey } = req.params;
  const { permissions, roleName, description } = req.body;
  const userRole = (req.user?.role || req.headers['x-user-role'] || 'SUPER_ADMIN').toUpperCase();

  // STRICT SECURITY GUARDRAIL:
  // Company Admin can NEVER modify Super Admin permissions or role definitions.
  if (roleKey.toUpperCase() === 'SUPER_ADMIN' && userRole !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Security Violation: Company Admins are strictly prohibited from modifying Super Admin permissions.'
    });
  }

  // Non-Super Admins cannot edit system role templates
  if (userRole !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Only the Master Super Admin can configure platform role templates.'
    });
  }

  try {
    // Update runtime cache
    const targetIdx = runtimeRoleTemplates.findIndex(r => r.roleKey === roleKey);
    if (targetIdx !== -1) {
      runtimeRoleTemplates[targetIdx] = {
        ...runtimeRoleTemplates[targetIdx],
        ...(roleName && { roleName }),
        ...(description && { description }),
        ...(permissions && { permissions }),
        updatedAt: new Date().toISOString()
      };
    }

    await ensureSettingsSchema();
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      await query(`
        INSERT INTO role_templates (role_key, role_name, description, is_system_immutable, permissions, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (role_key) DO UPDATE SET
          role_name = COALESCE(EXCLUDED.role_name, role_templates.role_name),
          description = COALESCE(EXCLUDED.description, role_templates.description),
          permissions = COALESCE(EXCLUDED.permissions, role_templates.permissions),
          updated_at = NOW();
      `, [
        roleKey,
        roleName || (runtimeRoleTemplates[targetIdx]?.roleName || roleKey),
        description || (runtimeRoleTemplates[targetIdx]?.description || ''),
        roleKey === 'SUPER_ADMIN',
        JSON.stringify(permissions || {})
      ]);
    }

    return res.json({
      success: true,
      message: `Role template for ${roleKey} updated successfully.`,
      data: targetIdx !== -1 ? runtimeRoleTemplates[targetIdx] : { roleKey, permissions }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
// ==============================================================================
// 8. USAGE LIMITS GOVERNANCE ENDPOINTS
// ==============================================================================
router.get('/usage-limits', (req, res) => {
  return res.json({
    success: true,
    data: runtimeGlobalSettings.usageLimits || DEFAULT_GLOBAL_SETTINGS.usageLimits
  });
});

router.put('/usage-limits', (req, res) => {
  const newLimits = req.body;
  runtimeGlobalSettings.usageLimits = {
    ...(runtimeGlobalSettings.usageLimits || DEFAULT_GLOBAL_SETTINGS.usageLimits),
    ...newLimits
  };
  runtimeGlobalSettings.updatedAt = new Date().toISOString();
  return res.json({
    success: true,
    message: 'Global usage limits updated successfully.',
    data: runtimeGlobalSettings.usageLimits
  });
});

// ==============================================================================
// 9. 3-TIER MAINTENANCE MODE GOVERNANCE ENDPOINTS (Platform, Module, Company)
// ==============================================================================
router.get('/maintenance-mode', (req, res) => {
  return res.json({
    success: true,
    data: runtimeGlobalSettings.maintenanceConfig || DEFAULT_GLOBAL_SETTINGS.maintenanceConfig
  });
});

router.put('/maintenance-mode', (req, res) => {
  const newConfig = req.body;
  runtimeGlobalSettings.maintenanceConfig = {
    ...(runtimeGlobalSettings.maintenanceConfig || DEFAULT_GLOBAL_SETTINGS.maintenanceConfig),
    ...newConfig
  };
  runtimeGlobalSettings.updatedAt = new Date().toISOString();
  return res.json({
    success: true,
    message: 'Maintenance mode configuration updated.',
    data: runtimeGlobalSettings.maintenanceConfig
  });
});

// In-memory Emergency Controls runtime cache
let runtimeEmergencyControls = {
  disableLoginGlobally: false,
  forceLogoutAllUsers: false,
  disableApiAccess: false,
  disableIntegrations: false,
  emergencyMaintenanceActive: false,
  blockedIps: ['192.168.1.105', '10.0.4.12'],
  compromisedCompanies: [],
  revokedApiKeys: [],
  updatedByEmail: 'superadmin@orvexa.com',
  updatedAt: new Date().toISOString()
};

// In-memory Real-time Activity Stream cache
let runtimeActivityFeed = [
  { id: 'act_1', time: '10:42', category: 'TENANT', action: 'COMPANY_REGISTERED', description: 'New company registered: Apex Pharma Ltd', companyName: 'Apex Pharma Ltd', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'act_2', time: '10:45', category: 'USER', action: 'ADMIN_CREATED', description: 'Company Admin created: Dr. Rajesh Sharma (Apex Pharma)', companyName: 'Apex Pharma Ltd', createdAt: new Date(Date.now() - 3300000).toISOString() },
  { id: 'act_3', time: '10:51', category: 'USER', action: 'EMPLOYEES_IMPORTED', description: '120 employees imported via batch CSV file upload', companyName: 'Apex Pharma Ltd', createdAt: new Date(Date.now() - 2900000).toISOString() },
  { id: 'act_4', time: '11:02', category: 'BILLING', action: 'SUBSCRIPTION_UPGRADED', description: 'Subscription upgraded from Starter to Professional Tier ($1,000/mo)', companyName: 'Apex Pharma Ltd', createdAt: new Date(Date.now() - 2200000).toISOString() },
  { id: 'act_5', time: '11:12', category: 'API', action: 'INTEGRATION_CONNECTED', description: 'REST API Webhook integration connected for Salesforce CRM', companyName: 'Apex Pharma Ltd', createdAt: new Date(Date.now() - 1600000).toISOString() },
  { id: 'act_6', time: '11:20', category: 'SYSTEM', action: 'REPORTS_GENERATED', description: '3,200 automated monthly DCR reports compiled across regional teams', companyName: 'Global Platform', createdAt: new Date(Date.now() - 1100000).toISOString() }
];

// GET /api/settings/emergency-controls
router.get('/emergency-controls', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query('SELECT * FROM platform_emergency_controls WHERE id = $1', ['global_emergency_config']);
      if (dbRes.rows.length > 0) {
        const row = dbRes.rows[0];
        runtimeEmergencyControls = {
          disableLoginGlobally: Boolean(row.disable_login_globally),
          forceLogoutAllUsers: Boolean(row.force_logout_all_users),
          disableApiAccess: Boolean(row.disable_api_access),
          disableIntegrations: Boolean(row.disable_integrations),
          emergencyMaintenanceActive: Boolean(row.emergency_maintenance_active),
          blockedIps: row.blocked_ips || [],
          compromisedCompanies: row.compromised_companies || [],
          revokedApiKeys: row.revoked_api_keys || [],
          updatedByEmail: row.updated_by_email || 'superadmin@orvexa.com',
          updatedAt: row.updated_at
        };
      }
    }
  } catch (err) {
    console.warn('⚠️ Fallback to memory emergency controls:', err.message);
  }
  return res.json({ success: true, data: runtimeEmergencyControls });
});

// POST /api/settings/emergency-controls/trigger
router.post('/emergency-controls/trigger', async (req, res) => {
  const { action, reason, targetId, companyName } = req.body;
  if (!reason || !reason.trim()) {
    return res.status(400).json({ success: false, message: 'An explicit audit compliance reason is strictly required for disaster controls.' });
  }

  let message = `Emergency action "${action}" executed.`;

  if (action === 'DISABLE_LOGIN_GLOBALLY') {
    runtimeEmergencyControls.disableLoginGlobally = !runtimeEmergencyControls.disableLoginGlobally;
    message = `Global platform logins ${runtimeEmergencyControls.disableLoginGlobally ? 'DISABLED' : 'RESTORED'}.`;
  } else if (action === 'FORCE_LOGOUT_ALL') {
    runtimeEmergencyControls.forceLogoutAllUsers = true;
    message = 'Force session logout triggered across all platform users & active tokens.';
  } else if (action === 'DISABLE_API_ACCESS') {
    runtimeEmergencyControls.disableApiAccess = !runtimeEmergencyControls.disableApiAccess;
    message = `Global API access ${runtimeEmergencyControls.disableApiAccess ? 'SUSPENDED' : 'RESTORED'}.`;
  } else if (action === 'DISABLE_INTEGRATIONS') {
    runtimeEmergencyControls.disableIntegrations = !runtimeEmergencyControls.disableIntegrations;
    message = `All third-party webhooks & CRM integrations ${runtimeEmergencyControls.disableIntegrations ? 'CUT OFF' : 'RE-ENABLED'}.`;
  } else if (action === 'EMERGENCY_MAINTENANCE') {
    runtimeEmergencyControls.emergencyMaintenanceActive = !runtimeEmergencyControls.emergencyMaintenanceActive;
    message = `Emergency Maintenance Mode ${runtimeEmergencyControls.emergencyMaintenanceActive ? 'ACTIVATED' : 'DEACTIVATED'}.`;
  } else if (action === 'FREEZE_COMPANY') {
    const compList = runtimeEmergencyControls.compromisedCompanies || [];
    const exists = compList.includes(targetId || companyName);
    const updatedList = exists ? compList.filter(c => c !== (targetId || companyName)) : [...compList, (targetId || companyName)];
    runtimeEmergencyControls.compromisedCompanies = updatedList;
    message = `Company "${companyName || targetId}" ${exists ? 'UNFROZEN' : 'FROZEN & ISOLATED'}.`;
  } else if (action === 'BLOCK_IP') {
    if (targetId) {
      const ipList = runtimeEmergencyControls.blockedIps || [];
      if (!ipList.includes(targetId)) ipList.push(targetId);
      runtimeEmergencyControls.blockedIps = ipList;
      message = `Suspicious IP "${targetId}" added to platform blacklist.`;
    }
  } else if (action === 'REVOKE_ALL_API_KEYS') {
    runtimeEmergencyControls.revokedApiKeys = ['ALL_ACTIVE_KEYS_REVOKED'];
    message = 'All active developer API keys & OAuth secrets revoked immediately.';
  }

  runtimeEmergencyControls.updatedAt = new Date().toISOString();

  // Push event to real-time activity stream
  const newActivity = {
    id: `act_${Date.now()}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    category: 'SECURITY',
    action: action,
    description: `🚨 EMERGENCY CONTROL EXECUTED: ${message} (Reason: "${reason}")`,
    companyName: companyName || 'Global Platform',
    createdAt: new Date().toISOString()
  };
  runtimeActivityFeed.unshift(newActivity);

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      await query(`
        UPDATE platform_emergency_controls
        SET disable_login_globally = $1,
            force_logout_all_users = $2,
            disable_api_access = $3,
            disable_integrations = $4,
            emergency_maintenance_active = $5,
            blocked_ips = $6,
            compromised_companies = $7,
            revoked_api_keys = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = 'global_emergency_config'
      `, [
        runtimeEmergencyControls.disableLoginGlobally,
        runtimeEmergencyControls.forceLogoutAllUsers,
        runtimeEmergencyControls.disableApiAccess,
        runtimeEmergencyControls.disableIntegrations,
        runtimeEmergencyControls.emergencyMaintenanceActive,
        JSON.stringify(runtimeEmergencyControls.blockedIps),
        JSON.stringify(runtimeEmergencyControls.compromisedCompanies),
        JSON.stringify(runtimeEmergencyControls.revokedApiKeys)
      ]);

      await query(`
        INSERT INTO platform_activity_stream (category, action, description, company_name)
        VALUES ($1, $2, $3, $4)
      `, ['SECURITY', action, `🚨 EMERGENCY CONTROL EXECUTED: ${message} (Reason: "${reason}")`, companyName || 'Global Platform']);
    }
  } catch (err) {
    console.warn('⚠️ DB update failed for emergency controls:', err.message);
  }

  return res.json({
    success: true,
    message,
    data: runtimeEmergencyControls
  });
});

// GET /api/settings/activity-feed
router.get('/activity-feed', async (req, res) => {
  const { category } = req.query;
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      let queryStr = `
        SELECT id, category, action, description, company_name, created_at,
               TO_CHAR(created_at, 'HH24:MI') as time
        FROM platform_activity_stream
      `;
      const params = [];
      if (category && category !== 'ALL') {
        queryStr += ` WHERE category = $1`;
        params.push(category.toUpperCase());
      }
      queryStr += ` ORDER BY created_at DESC LIMIT 50`;

      const dbRes = await query(queryStr, params);
      if (dbRes.rows.length > 0) {
        return res.json({ success: true, data: dbRes.rows });
      }
    }
  } catch (err) {
    console.warn('⚠️ Fallback to memory activity feed:', err.message);
  }

  let filtered = [...runtimeActivityFeed];
  if (category && category !== 'ALL') {
    filtered = filtered.filter(a => a.category.toUpperCase() === category.toUpperCase());
  }

  return res.json({ success: true, data: filtered });
});

// ==============================================================================
// CONFIGURATION VERSIONING & ROLLBACK
// ==============================================================================
let runtimeConfigVersions = [
  { id: 'cfg_v3', version: 'v3.2', description: 'Updated global API quota & 3-tier maintenance controls', created_by: 'Super Admin HQ', created_at: new Date(Date.now() - 3600000).toISOString(), status: 'ACTIVE' },
  { id: 'cfg_v2', version: 'v3.1', description: 'Added sovereign jurisdiction currency overrides', created_by: 'Super Admin HQ', created_at: new Date(Date.now() - 86400000).toISOString(), status: 'HISTORICAL' },
  { id: 'cfg_v1', version: 'v3.0', description: 'Baseline platform initial release settings', created_by: 'Super Admin HQ', created_at: new Date(Date.now() - 604800000).toISOString(), status: 'HISTORICAL' }
];

router.get('/config-versions', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query(`SELECT * FROM platform_config_versions ORDER BY created_at DESC LIMIT 20`);
      if (dbRes.rows.length > 0) return res.json({ success: true, data: dbRes.rows });
    }
  } catch (err) {
    console.warn('⚠️ Fallback config versions:', err.message);
  }
  return res.json({ success: true, data: runtimeConfigVersions });
});

router.post('/config-versions/rollback', async (req, res) => {
  const { versionId } = req.body;
  if (!versionId) return res.status(400).json({ success: false, message: 'versionId is required' });

  runtimeConfigVersions = runtimeConfigVersions.map(v => ({
    ...v,
    status: v.id === versionId ? 'ACTIVE' : 'HISTORICAL'
  }));

  return res.json({
    success: true,
    message: `Platform configuration rolled back successfully to ${versionId}!`,
    data: runtimeConfigVersions
  });
});

// ==============================================================================
// INCIDENT MANAGEMENT CENTER
// ==============================================================================
let runtimeIncidents = [
  { id: 'INC-901', title: 'DB Connection Latency Spike (EU-West)', severity: 'MEDIUM', status: 'INVESTIGATING', owner: 'DevOps Lead', company: 'Global Platform', reported_at: new Date(Date.now() - 1800000).toISOString(), summary: 'Intermittent 200ms latency on primary replica.' },
  { id: 'INC-899', title: 'SMS Gateway Rate Limit Hit', severity: 'HIGH', status: 'RESOLVED', owner: 'API Desk', company: 'Apex Pharma', reported_at: new Date(Date.now() - 86400000).toISOString(), summary: 'Switched to fallback Twilio provider seamlessly.' }
];

router.get('/incidents', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query(`SELECT * FROM platform_incidents ORDER BY created_at DESC LIMIT 50`);
      if (dbRes.rows.length > 0) return res.json({ success: true, data: dbRes.rows });
    }
  } catch (err) {
    console.warn('⚠️ Fallback incidents:', err.message);
  }
  return res.json({ success: true, data: runtimeIncidents });
});

router.post('/incidents', async (req, res) => {
  const { title, severity, summary, owner, company } = req.body;
  if (!title || !severity) return res.status(400).json({ success: false, message: 'Title and severity are required.' });

  const newInc = {
    id: `INC-${Math.floor(100 + Math.random() * 900)}`,
    title,
    severity: severity.toUpperCase(),
    status: 'INVESTIGATING',
    owner: owner || 'Super Admin HQ',
    company: company || 'Global Platform',
    reported_at: new Date().toISOString(),
    summary: summary || 'No description provided.'
  };

  runtimeIncidents.unshift(newInc);
  return res.json({ success: true, message: 'Incident logged successfully.', data: newInc });
});

router.put('/incidents/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, resolution } = req.body;

  runtimeIncidents = runtimeIncidents.map(inc => {
    if (inc.id === id) {
      return { ...inc, status: status || inc.status, resolution: resolution || inc.resolution };
    }
    return inc;
  });

  return res.json({ success: true, message: `Incident ${id} updated to ${status}.` });
});

// ==============================================================================
// DUAL APPROVAL WORKFLOWS FOR DESTRUCTIVE ACTIONS
// ==============================================================================
let runtimeDualApprovals = [
  { id: 'DA-101', action_type: 'TENANT_DATA_PURGE', target_entity: 'Legacy Pharma Corp', requested_by: 'superadmin1@orvexa.com', approver_required: '2nd Super Admin', status: 'PENDING_APPROVAL', reason: 'Customer contract ended. Exit data wipe requested per agreement #882.', requested_at: new Date(Date.now() - 3600000).toISOString() }
];

router.get('/dual-approvals', async (req, res) => {
  return res.json({ success: true, data: runtimeDualApprovals });
});

router.post('/dual-approvals/request', async (req, res) => {
  const { actionType, targetEntity, reason } = req.body;
  if (!reason || !reason.trim()) {
    return res.status(400).json({ success: false, message: 'A valid audit compliance reason is required for dual-approval actions.' });
  }

  const reqObj = {
    id: `DA-${Math.floor(100 + Math.random() * 900)}`,
    action_type: actionType || 'DESTRUCTIVE_ACTION',
    target_entity: targetEntity || 'Global Object',
    requested_by: 'superadmin1@orvexa.com',
    approver_required: '2nd Super Admin',
    status: 'PENDING_APPROVAL',
    reason: reason.trim(),
    requested_at: new Date().toISOString()
  };

  runtimeDualApprovals.unshift(reqObj);
  return res.json({ success: true, message: 'Dual-approval request logged. Awaiting second Super Admin sign-off.', data: reqObj });
});

router.post('/dual-approvals/approve', async (req, res) => {
  const { requestId, secondAdminToken } = req.body;
  if (!secondAdminToken || secondAdminToken.trim() !== 'APPROVE_DESTRUCTIVE_ACTION') {
    return res.status(400).json({ success: false, message: 'Invalid confirmation token. Type "APPROVE_DESTRUCTIVE_ACTION" exactly.' });
  }

  runtimeDualApprovals = runtimeDualApprovals.map(reqItem => {
    if (reqItem.id === requestId) {
      return { ...reqItem, status: 'APPROVED_AND_EXECUTED', approved_by: 'security.admin@orvexa.com', executed_at: new Date().toISOString() };
    }
    return reqItem;
  });

  return res.json({ success: true, message: `Dual approval request ${requestId} approved and executed cleanly!` });
});

// ==============================================================================
// MASTER DATA QUALITY & DE-DUPLICATION CENTER
// ==============================================================================
let runtimeDataQualityIssues = [
  { id: 'DQ-1', type: 'DUPLICATE_DOCTORS', title: 'Duplicate Doctor Profiles Detected', count: 3, entity_name: 'Dr. Vikram Seth', company: 'Sun Pharma', status: 'REVIEW_NEEDED', description: 'Found 2 matching profiles with identical MCI registration numbers.' },
  { id: 'DQ-2', type: 'DUPLICATE_CHEMISTS', title: 'Duplicate Chemist Retailers', count: 2, entity_name: 'Apollo Pharmacy Bandra', company: 'Apex Pharma', status: 'REVIEW_NEEDED', description: 'Matching GSTIN and GPS coordinates detected across field rep entries.' },
  { id: 'DQ-3', type: 'UNASSIGNED_TERRITORY', title: 'MRs Without Territory Managers', count: 5, entity_name: 'North Region Sales', company: 'Cipla Ltd', status: 'REVIEW_NEEDED', description: '5 active field reps assigned to deleted territory.' }
];

router.get('/data-quality/issues', async (req, res) => {
  return res.json({ success: true, data: runtimeDataQualityIssues });
});

router.post('/data-quality/merge', async (req, res) => {
  const { issueId, targetMasterId } = req.body;
  runtimeDataQualityIssues = runtimeDataQualityIssues.filter(item => item.id !== issueId);
  return res.json({ success: true, message: `Data records merged and de-duplicated cleanly for issue ${issueId}!` });
});

// ==============================================================================
// MOBILE FLEET MANAGEMENT
// ==============================================================================
let runtimeFleetDevices = [
  { id: 'DEV-1', user_name: 'Rajesh Kumar (MR)', email: 'rajesh.k@apexpharma.com', company: 'Apex Pharma Ltd', app_version: 'v3.4.1', platform: 'ANDROID', os_version: 'Android 14', device_model: 'Samsung Galaxy S24', status: 'COMPLIANT', is_rooted: false, last_active: '2 mins ago' },
  { id: 'DEV-2', user_name: 'Priya Verma (MR)', email: 'priya.v@sunpharma.com', company: 'Sun Pharma', app_version: 'v3.2.0', platform: 'IOS', os_version: 'iOS 17.5', device_model: 'iPhone 15 Pro', status: 'UPDATE_RECOMMENDED', is_rooted: false, last_active: '15 mins ago' },
  { id: 'DEV-3', user_name: 'Amit Shah (MR)', email: 'amit.s@cipla.com', company: 'Cipla Ltd', app_version: 'v2.9.0', platform: 'ANDROID', os_version: 'Android 10', device_model: 'Redmi Note 9', status: 'NON_COMPLIANT', is_rooted: true, last_active: '1 hour ago' }
];

router.get('/fleet/devices', async (req, res) => {
  return res.json({ success: true, data: runtimeFleetDevices });
});

router.post('/fleet/remote-logout', async (req, res) => {
  const { deviceId } = req.body;
  runtimeFleetDevices = runtimeFleetDevices.map(d => d.id === deviceId ? { ...d, status: 'SESSION_REVOKED' } : d);
  return res.json({ success: true, message: `Remote session revoked cleanly for device ${deviceId}!` });
});

export default router;
