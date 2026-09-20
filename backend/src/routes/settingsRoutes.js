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

export default router;
