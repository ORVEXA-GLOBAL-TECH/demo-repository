-- ==============================================================================
-- 🚀 ORVEXA / ALLEVIARE PLATFORM ENHANCEMENTS & GLOBAL CONFIGURATION MIGRATION
-- Safe & Idempotent SQL Migration (Can be run multiple times without errors)
-- Run this in your Supabase SQL Editor or PostgreSQL Console
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PLATFORM GLOBAL CONFIGURATION (platform_settings)
-- ==============================================================================
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

-- Seed global settings if not existing
INSERT INTO platform_settings (
    id, date_format, timezone, currency, language, default_working_days, session_timeout_minutes
) VALUES (
    'global_default', 'YYYY-MM-DD', 'UTC', 'USD', 'en', '["Mon", "Tue", "Wed", "Thu", "Fri"]'::jsonb, 60
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 3. RBAC ROLE TEMPLATES & PERMISSIONS MATRIX (role_templates)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS role_templates (
    role_key VARCHAR(50) PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_immutable BOOLEAN DEFAULT false,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Standard Platform Role Templates
INSERT INTO role_templates (role_key, role_name, description, is_system_immutable, permissions)
VALUES 
(
    'SUPER_ADMIN',
    'Super Admin (Master Platform Authority)',
    'Supreme root authority with absolute control over all companies, platform configuration, billing, security, and role templates.',
    true,
    '{"platform.view_all_tenants": true, "platform.manage_tenants": true, "platform.global_settings": true, "platform.role_templates": true, "platform.emergency_killswitch": true, "platform.view_audit_logs": true, "platform.manage_billing": true, "platform.impersonate_admin": true, "users.create_admin": true, "users.edit_admin": true, "users.toggle_status": true, "users.reset_password": true, "users.force_logout": true, "users.lock_unlock": true, "users.change_permissions": true, "plans.create": true, "plans.edit": true, "plans.delete": true, "subscriptions.assign": true, "subscriptions.upgrade_downgrade": true}'::jsonb
),
(
    'COMPANY_ADMIN',
    'Company Admin (Tenant Executive)',
    'Full administrative control within their assigned pharmaceutical company. Strictly restricted from modifying Super Admin or global settings.',
    false,
    '{"company.view_profile": true, "company.edit_profile": true, "company.manage_overrides": true, "company.view_invoices": true, "users.create_user": true, "users.edit_user": true, "users.toggle_status": true, "catalog.manage": true, "doctors.manage": true, "chemists.manage": true, "dcr.view_all": true, "orders.view_all": true, "field_tracking.view_live": true, "platform.global_settings": false, "platform.role_templates": false}'::jsonb
),
(
    'AREA_MANAGER',
    'Area / Regional Sales Manager',
    'Regional supervisor managing Medical Representatives, reviewing field DCR reports, and approving sales orders.',
    false,
    '{"team.view_members": true, "doctors.view": true, "chemists.view": true, "dcr.view_team": true, "dcr.approve_reject": true, "orders.view_team": true, "orders.approve_reject": true, "field_tracking.view_team": true}'::jsonb
),
(
    'MEDICAL_REP',
    'Medical Representative (Field Sales Rep)',
    'Field executive logging daily doctor/chemist call visits, taking POB orders, recording attendance, and syncing GPS telemetry.',
    false,
    '{"dcr.create": true, "dcr.view_own": true, "orders.create": true, "orders.view_own": true, "doctors.view": true, "chemists.view": true, "catalog.view": true, "attendance.mark": true, "gps.send_telemetry": true}'::jsonb
),
(
    'AUDITOR',
    'Compliance & Audit Inspector',
    'Read-only compliance officer reviewing audit logs, system access history, and regulatory sales compliance.',
    false,
    '{"audit.view_logs": true, "login_history.view": true, "reports.view_compliance": true, "reports.export": true}'::jsonb
)
ON CONFLICT (role_key) DO NOTHING;

-- ==============================================================================
-- 4. ENHANCE USERS TABLE (Security & Session Controls)
-- ==============================================================================
ALTER TABLE IF EXISTS users 
    ADD COLUMN IF NOT EXISTS token_version INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS lock_reason TEXT,
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"manage_users": true, "manage_products": true, "manage_orders": true, "manage_doctors": true, "manage_dcr": true, "view_analytics": true, "export_data": true, "manage_settings": true}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_users_token_version ON users(id, token_version);
CREATE INDEX IF NOT EXISTS idx_users_is_locked ON users(is_locked);

-- ==============================================================================
-- 5. ENHANCE TENANTS_COMPANIES TABLE (Overrides & Lifecycle)
-- ==============================================================================
ALTER TABLE IF EXISTS tenants_companies 
    ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS default_timezone VARCHAR(64) DEFAULT 'UTC',
    ADD COLUMN IF NOT EXISTS currency_code VARCHAR(20) DEFAULT 'USD',
    ADD COLUMN IF NOT EXISTS trial_start_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS trial_end_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS subscription_start_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS subscription_end_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS grace_period_days INT DEFAULT 7,
    ADD COLUMN IF NOT EXISTS auto_suspend_after_grace BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS last_renewed_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS renewal_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_custom_pricing BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS custom_rate NUMERIC(12,2) DEFAULT 0.00;

-- ==============================================================================
-- 6. ADMIN LOGIN HISTORY & DEVICE TELEMETRY (admin_login_history)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS admin_login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(64),
    device_info VARCHAR(255),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'SUCCESS',
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON admin_login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_email ON admin_login_history(email);
CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON admin_login_history(created_at DESC);

-- ==============================================================================
-- 7. PLATFORM GLOBAL AUDIT LOGS (8-Dimensional Tracking: Who, Company, Action, Date/Time, IP, Device, Old/New Value)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(255),
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL DEFAULT 'SUPER_ADMIN',
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    ip_address VARCHAR(64),
    device_info VARCHAR(255),
    user_agent TEXT,
    old_value JSONB,
    new_value JSONB,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS platform_audit_logs 
    ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS actor_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS device_info VARCHAR(255),
    ADD COLUMN IF NOT EXISTS old_value JSONB,
    ADD COLUMN IF NOT EXISTS new_value JSONB;

CREATE INDEX IF NOT EXISTS idx_audit_tenant_time ON platform_audit_logs(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON platform_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_actor_email ON platform_audit_logs(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_ip_address ON platform_audit_logs(ip_address);

-- ==============================================================================
-- 8. SAAS SUBSCRIPTION PLANS (subscription_plans)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    tier VARCHAR(50) NOT NULL,
    price_monthly NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    price_yearly NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    trial_days INT NOT NULL DEFAULT 14,
    grace_period_days INT NOT NULL DEFAULT 7,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Core Subscription Plans
INSERT INTO subscription_plans (code, name, description, tier, price_monthly, price_yearly, trial_days, grace_period_days, features, is_active, is_custom)
VALUES
('FREE_TRIAL', '14-Day Full Access Trial', 'Zero upfront cost trial with all features enabled.', 'FREE_TRIAL', 0.00, 0.00, 14, 7, '["Unlimited Field Users", "Chemist Order Booking", "MR Daily Call Reports", "Product Catalog Access"]'::jsonb, true, false),
('STARTER', 'Starter Pharma Growth Plan', 'Entry tier for single-country field operations.', 'STARTER', 100.00, 1000.00, 14, 7, '["Unlimited Field Users", "Chemist Order Booking", "MR Daily Call Reports", "Standard GPS Tracking"]'::jsonb, true, false),
('PROFESSIONAL', 'Professional Enterprise Scale Plan', 'Advanced multi-territory tracking and analytics.', 'PROFESSIONAL', 1000.00, 10000.00, 14, 7, '["Unlimited Field Users", "AI Route Optimization", "Doctor Call Telemetry", "Priority API Access", "Custom Analytics Export"]'::jsonb, true, false),
('ENTERPRISE', 'Sovereign Global Enterprise Plan', 'Multi-national pharma tier with full compliance audit.', 'ENTERPRISE', 2500.00, 25000.00, 30, 14, '["Dedicated Sovereign Database", "Global FX & Tax Compliance", "Unlimited Admins & Users", "24/7 Dedicated SLA Support", "Full Impersonation Audit Trail"]'::jsonb, true, false),
('CUSTOM', 'Custom Sovereign Tier', 'Bespoke enterprise contract with custom negotiated rate.', 'CUSTOM', 0.00, 0.00, 14, 7, '["Custom Terms", "Tailored Feature Modules", "Enterprise Custom SLA"]'::jsonb, true, true)
ON CONFLICT (code) DO NOTHING;

-- ==============================================================================
-- 8. PLATFORM BACKUP LOGS & SNAPSHOT HISTORY (platform_backup_logs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_backup_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED', -- COMPLETED | IN_PROGRESS | FAILED
    backup_type VARCHAR(50) NOT NULL DEFAULT 'AUTOMATED_DAILY', -- AUTOMATED_DAILY | MANUAL_SNAPSHOT
    size_gb NUMERIC(10,2) NOT NULL DEFAULT 24.80,
    storage_target VARCHAR(255) DEFAULT 'Geo-Redundant Cloud Vault (Multi-Region S3)',
    encryption_mode VARCHAR(50) DEFAULT 'AES-256-GCM',
    retention_days INT DEFAULT 30,
    triggered_by VARCHAR(255) DEFAULT 'SYSTEM_CRON',
    details JSONB DEFAULT '{"checksum": "sha256:8f4c2e...", "regions": ["us-east-1", "eu-central-1"]}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_backup_logs_created_at ON platform_backup_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_backup_logs_status ON platform_backup_logs(status);

-- Seed initial backup record
INSERT INTO platform_backup_logs (backup_id, status, backup_type, size_gb, triggered_by)
VALUES ('BKP-SNAP-INIT-01', 'COMPLETED', 'AUTOMATED_DAILY', 24.80, 'SYSTEM_CRON')
ON CONFLICT (backup_id) DO NOTHING;

-- ==============================================================================
-- 9. BACKGROUND QUEUE JOBS & DEAD-LETTER QUEUE (background_queue_jobs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS background_queue_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_code VARCHAR(100) NOT NULL,
    queue_name VARCHAR(100) NOT NULL,
    task_description TEXT NOT NULL,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE SET NULL,
    recipient VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED', -- PENDING | PROCESSING | COMPLETED | FAILED
    error_message TEXT,
    attempts INT DEFAULT 1,
    max_attempts INT DEFAULT 3,
    payload JSONB DEFAULT '{}'::jsonb,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    failed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_queue_jobs_queue_status ON background_queue_jobs(queue_name, status);
CREATE INDEX IF NOT EXISTS idx_queue_jobs_failed ON background_queue_jobs(status, failed_at DESC);

-- ==============================================================================
-- 10. SYSTEM HEALTH & DIAGNOSTIC AUDIT LOGS (platform_system_health_logs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_system_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    overall_status VARCHAR(50) NOT NULL DEFAULT 'HEALTHY',
    db_latency_ms INT DEFAULT 22,
    api_latency_ms INT DEFAULT 18,
    error_rate_pct NUMERIC(6,4) DEFAULT 0.0200,
    services_status JSONB DEFAULT '{"api": "Healthy", "database": "Healthy", "storage": "Healthy", "auth": "Healthy", "notifications": "Healthy", "maps_gps": "Healthy", "email": "Healthy", "sms": "Healthy", "background_jobs": "Healthy"}'::jsonb,
    telemetry_snapshot JSONB DEFAULT '{}'::jsonb,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_health_logs_checked_at ON platform_system_health_logs(checked_at DESC);

-- ==============================================================================
-- 11. PLATFORM ACTIVE SESSIONS & REAL-TIME SECURITY (platform_active_sessions)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_active_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'MEDICAL_REP',
    ip_address VARCHAR(64) NOT NULL,
    device_info VARCHAR(255),
    device_type VARCHAR(50) DEFAULT 'DESKTOP', -- DESKTOP | MOBILE | TABLET
    location VARCHAR(255),
    mfa_verified BOOLEAN DEFAULT false,
    is_current_session BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE | TERMINATED | EXPIRED
    login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON platform_active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_tenant_id ON platform_active_sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON platform_active_sessions(status);

-- ==============================================================================
-- 12. PLATFORM SECURITY THREAT ALERTS (platform_security_threat_alerts)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_security_threat_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_code VARCHAR(100) UNIQUE NOT NULL,
    alert_type VARCHAR(100) NOT NULL, -- SUSPICIOUS_LOGIN_IMPOSSIBLE_TRAVEL | BRUTE_FORCE_LOCKOUT | BLACKLISTED_IP_BLOCKED | DEVICE_TAMPERED
    severity VARCHAR(50) NOT NULL DEFAULT 'HIGH', -- CRITICAL | HIGH | MEDIUM | LOW
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(64),
    user_email VARCHAR(255),
    company_name VARCHAR(255),
    action_taken VARCHAR(255),
    status VARCHAR(50) DEFAULT 'UNRESOLVED', -- UNRESOLVED | RESOLVED | DISMISSED
    resolved_by VARCHAR(255),
    resolved_at TIMESTAMP WITH TIME ZONE,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_threat_alerts_status ON platform_security_threat_alerts(status);
CREATE INDEX IF NOT EXISTS idx_threat_alerts_severity ON platform_security_threat_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_threat_alerts_created_at ON platform_security_threat_alerts(created_at DESC);

-- ==============================================================================
-- 13. COMPANY DATA EXPORTS & ARCHIVES (company_data_exports & archives)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS company_data_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    export_code VARCHAR(100) UNIQUE NOT NULL,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    data_scope VARCHAR(100) NOT NULL DEFAULT 'FULL_INSTANCE', -- FULL_INSTANCE | DCR_ORDERS | CLINICAL_GEO | AUDIT_COMPLIANCE
    format VARCHAR(20) NOT NULL DEFAULT 'ZIP_JSON', -- ZIP_JSON | CSV_BUNDLE | ENCRYPTED_TAR_GZ
    status VARCHAR(50) NOT NULL DEFAULT 'READY', -- PENDING | PROCESSING | READY | EXPIRED | FAILED
    file_size_mb NUMERIC(10,2) DEFAULT 45.20,
    download_url TEXT,
    download_expires_at TIMESTAMP WITH TIME ZONE,
    requested_by VARCHAR(255) NOT NULL,
    encryption_mode VARCHAR(50) DEFAULT 'AES-256',
    checksum VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company_data_archives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    archive_code VARCHAR(100) UNIQUE NOT NULL,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    storage_tier VARCHAR(50) NOT NULL DEFAULT 'GLACIER_DEEP_COLD', -- GLACIER_FLEXIBLE | GLACIER_DEEP_COLD | SOVEREIGN_ISOLATED_VAULT
    archive_reason VARCHAR(255) NOT NULL DEFAULT 'ANNUAL_COMPLIANCE_ARCHIVE',
    status VARCHAR(50) NOT NULL DEFAULT 'ARCHIVED', -- ARCHIVED | RESTORING | ACCESSIBLE | PURGED
    archive_size_gb NUMERIC(10,2) DEFAULT 12.40,
    archived_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 14. DATA RETENTION POLICIES (data_retention_policies)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS data_retention_policies (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    retention_days INT NOT NULL,
    auto_purge BOOLEAN DEFAULT true,
    archive_before_purge BOOLEAN DEFAULT true,
    legal_hold_exempt BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 15. DATA RESTORE & DELETION REQUESTS (data_restore_requests & data_deletion_requests)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS data_restore_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code VARCHAR(100) UNIQUE NOT NULL,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    backup_snapshot_id VARCHAR(100) NOT NULL,
    point_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT NOT NULL,
    target_environment VARCHAR(50) NOT NULL DEFAULT 'STAGING_SANDBOX', -- STAGING_SANDBOX | PRODUCTION_OVERWRITE | ISOLATED_AUDIT_CONTAINER
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL', -- PENDING_APPROVAL | APPROVED | RESTORING | COMPLETED | REJECTED
    requested_by VARCHAR(255) NOT NULL,
    reviewed_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS data_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code VARCHAR(100) UNIQUE NOT NULL,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    deletion_type VARCHAR(50) NOT NULL DEFAULT 'GDPR_RIGHT_TO_BE_FORGOTTEN', -- GDPR_RIGHT_TO_BE_FORGOTTEN | FULL_TENANT_OFFBOARDING | SELECTIVE_PURGE
    scope VARCHAR(100) NOT NULL DEFAULT 'DCR_GPS_AND_PERSONAL_DATA',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_CONFIRMATION', -- PENDING_CONFIRMATION | SCHEDULED_PURGE | PURGED | REJECTED
    verification_token VARCHAR(100) NOT NULL DEFAULT 'CONFIRM_PURGE',
    safety_grace_days INT DEFAULT 7,
    requested_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================================================
-- 16. API MANAGEMENT: KEYS, CLIENTS, WEBHOOKS, FAILED REQUESTS, INTEGRATIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(50) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE SET NULL,
    company_name VARCHAR(255) DEFAULT 'Global Platform Core',
    tier VARCHAR(50) DEFAULT 'ENTERPRISE', -- BASIC | PRO | ENTERPRISE | UNLIMITED
    scopes JSONB DEFAULT '["read:dcr", "write:orders", "read:inventory", "read:analytics"]'::jsonb,
    rate_limit_rpm INT DEFAULT 1200,
    daily_quota INT DEFAULT 500000,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE | SUSPENDED | REVOKED
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platform_api_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(255) NOT NULL,
    client_id VARCHAR(100) UNIQUE NOT NULL,
    client_secret_hash VARCHAR(255) NOT NULL,
    client_type VARCHAR(50) DEFAULT 'ENTERPRISE_ERP', -- ENTERPRISE_ERP | THIRD_PARTY_CRM | WAREHOUSE_LOGISTICS | ANALYTICS_PIPELINE
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE SET NULL,
    company_name VARCHAR(255) DEFAULT 'Global Platform Core',
    grant_types JSONB DEFAULT '["client_credentials", "authorization_code"]'::jsonb,
    redirect_uris JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platform_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_name VARCHAR(255) NOT NULL,
    target_url TEXT NOT NULL,
    events JSONB DEFAULT '["order.created", "order.approved", "dcr.submitted", "user.lockout"]'::jsonb,
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE SET NULL,
    company_name VARCHAR(255) DEFAULT 'Global Platform Core',
    secret_key VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE | PAUSED | FAILING
    consecutive_failures INT DEFAULT 0,
    last_delivery_status INT DEFAULT 200,
    last_delivery_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platform_api_failed_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(100) UNIQUE NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    http_method VARCHAR(20) NOT NULL,
    status_code INT NOT NULL,
    client_id VARCHAR(100),
    company_name VARCHAR(255),
    error_reason TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(64),
    retry_count INT DEFAULT 0,
    resolved BOOLEAN DEFAULT false,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 17. NOTIFICATION MANAGEMENT & GLOBAL ANNOUNCEMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_global_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_code VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- MAINTENANCE | NEW_FEATURE | SECURITY | VERSION_UPDATE | PLATFORM_POLICY | TERMS_UPDATE
    category VARCHAR(100) DEFAULT 'GENERAL',
    priority VARCHAR(20) NOT NULL DEFAULT 'INFO', -- INFO | WARNING | CRITICAL | URGENT
    content TEXT NOT NULL,
    summary VARCHAR(500),
    target_audience VARCHAR(50) NOT NULL DEFAULT 'ALL_COMPANIES', -- ALL_COMPANIES | SPECIFIC_TENANTS | ADMINS_ONLY | FIELD_REPS_ONLY
    target_tenant_ids JSONB DEFAULT '[]'::jsonb,
    target_roles JSONB DEFAULT '[]'::jsonb,
    channels JSONB DEFAULT '["IN_APP_BANNER", "POPUP_MODAL"]'::jsonb, -- IN_APP_BANNER | POPUP_MODAL | EMAIL_BROADCAST | PUSH_NOTIFICATION
    is_pinned_banner BOOLEAN DEFAULT false,
    requires_acknowledgment BOOLEAN DEFAULT false,
    action_cta_text VARCHAR(100),
    action_cta_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED', -- DRAFT | SCHEDULED | PUBLISHED | ARCHIVED
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    total_sent INT DEFAULT 0,
    total_read INT DEFAULT 0,
    total_acknowledged INT DEFAULT 0,
    created_by VARCHAR(255) NOT NULL DEFAULT 'master.superadmin@orvexa.com',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_announcements_type ON platform_global_announcements(type);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON platform_global_announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON platform_global_announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned ON platform_global_announcements(is_pinned_banner);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON platform_global_announcements(created_at DESC);

CREATE TABLE IF NOT EXISTS announcement_acknowledgments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES platform_global_announcements(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    role VARCHAR(50),
    tenant_id UUID REFERENCES tenants_companies(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    ip_address VARCHAR(64),
    user_agent TEXT,
    acknowledged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_announcement_user UNIQUE (announcement_id, user_email)
);

CREATE INDEX IF NOT EXISTS idx_ack_announcement ON announcement_acknowledgments(announcement_id);
CREATE INDEX IF NOT EXISTS idx_ack_tenant ON announcement_acknowledgments(tenant_id);

-- ==============================================================================
-- 18. GRANT ACCESS & DISABLE RLS FOR FRONTEND/SUPABASE COMPATIBILITY
-- ==============================================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, postgres, service_role;

ALTER TABLE IF EXISTS platform_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS role_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_login_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscription_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_backup_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS background_queue_jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_system_health_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_active_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_security_threat_alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS company_data_exports DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS company_data_archives DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS data_retention_policies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS data_restore_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS data_deletion_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_api_keys DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_api_clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_webhooks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_api_failed_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platform_global_announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS announcement_acknowledgments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tenants_companies DISABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 19. VERIFICATION QUERY OUTPUT
-- ==============================================================================
SELECT '🎉 Database successfully updated with all Global Configuration, RBAC, User Management, System Health, Security Governance, Data Management, API Management, and Global Notification Announcement schemas!' as migration_status;



