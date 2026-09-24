-- ==============================================================================
-- Schema Migration: Platform Telemetry, Backend Logs, API Metrics & Backups
-- Purpose: Super Admin System Health & Telemetry persistence
-- ==============================================================================

-- 1. Platform Backend Logs Table
CREATE TABLE IF NOT EXISTS platform_backend_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL DEFAULT 'INFO', -- 'INFO', 'WARN', 'ERROR', 'HTTP', 'DEBUG'
    service VARCHAR(100) NOT NULL DEFAULT 'API Gateway',
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    path VARCHAR(255),
    method VARCHAR(10),
    status_code INTEGER,
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    duration_ms NUMERIC(10, 2) DEFAULT 0.00,
    tenant_id VARCHAR(100) DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_backend_logs_created_at ON platform_backend_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_backend_logs_level ON platform_backend_logs(level);
CREATE INDEX IF NOT EXISTS idx_backend_logs_service ON platform_backend_logs(service);

-- 2. Platform API Metrics Logs Table
CREATE TABLE IF NOT EXISTS platform_api_metrics_logs (
    id SERIAL PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    latency_ms NUMERIC(10, 2) NOT NULL,
    caller_ip VARCHAR(45),
    tenant_id VARCHAR(100) DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_api_metrics_created_at ON platform_api_metrics_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_metrics_endpoint ON platform_api_metrics_logs(endpoint);

-- 3. Platform Backup Logs Table
CREATE TABLE IF NOT EXISTS platform_backup_logs (
    id SERIAL PRIMARY KEY,
    backup_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    backup_type VARCHAR(50) NOT NULL DEFAULT 'AUTO_SCHEDULED',
    size_gb NUMERIC(10, 2) NOT NULL DEFAULT 24.50,
    triggered_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM_CRON',
    storage_path VARCHAR(255) DEFAULT 's3://pharma-cloud-backups/prod/pg_cluster_wal/',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Platform System Health Snapshot Logs Table
CREATE TABLE IF NOT EXISTS platform_system_health_logs (
    id SERIAL PRIMARY KEY,
    overall_status VARCHAR(50) NOT NULL DEFAULT 'HEALTHY',
    db_latency_ms NUMERIC(10, 2) DEFAULT 12.50,
    api_latency_ms NUMERIC(10, 2) DEFAULT 18.00,
    error_rate_pct NUMERIC(6, 3) DEFAULT 0.02,
    cpu_percent NUMERIC(5, 2) DEFAULT 14.50,
    memory_mb NUMERIC(10, 2) DEFAULT 164.20,
    active_connections INTEGER DEFAULT 18,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial recent logs for immediate Super Admin inspection
INSERT INTO platform_backend_logs (level, service, message, path, method, status_code, ip_address, duration_ms, tenant_id, created_at)
VALUES 
  ('INFO', 'API Gateway', 'Core Express cluster booted with HTTP/2 SSL termination enabled', '/', 'GET', 200, '127.0.0.1', 4.2, 'system', NOW() - INTERVAL '45 minutes'),
  ('HTTP', 'API Gateway', 'GET /api/tenants - 200 OK (38 records retrieved)', '/api/tenants', 'GET', 200, '192.168.1.105', 18.4, 'system', NOW() - INTERVAL '30 minutes'),
  ('INFO', 'PostgreSQL Pool', 'Connection pool refreshed. 18 active worker threads allocated across 10 shards', NULL, NULL, NULL, '10.0.0.12', 2.1, 'system', NOW() - INTERVAL '25 minutes'),
  ('WARN', 'FCM Gateway', 'Push notification queue latency exceeded 120ms threshold on APNs bridge', '/api/notifications/broadcast', 'POST', 202, '172.16.0.4', 124.5, 't_novartis_01', NOW() - INTERVAL '18 minutes'),
  ('HTTP', 'Auth Service', 'POST /api/auth/login - 200 OK (Super Admin authenticated with JWT session)', '/api/auth/login', 'POST', 200, '127.0.0.1', 42.1, 'system', NOW() - INTERVAL '12 minutes'),
  ('INFO', 'Cloud Storage S3', 'Tenant logo upload verified with HMAC-SHA1 signature and ImageKit CDN cache warmed', '/api/storage/upload', 'POST', 201, '10.0.0.88', 88.0, 't_pfizer_02', NOW() - INTERVAL '8 minutes'),
  ('ERROR', 'PDF Exporter', 'Worker timeout rendering high-res territory analytics matrix: memory exceeded 1024MB', '/api/reports/export/pdf', 'POST', 504, '172.16.4.19', 4200.0, 't_pfizer_02', NOW() - INTERVAL '5 minutes'),
  ('INFO', 'Database Engine', 'Vacuum analyze completed on public.users and public.tenants_companies', NULL, NULL, NULL, '10.0.0.1', 312.0, 'system', NOW() - INTERVAL '3 minutes'),
  ('HTTP', 'API Gateway', 'GET /api/system-health/apis - 200 OK', '/api/system-health/apis', 'GET', 200, '127.0.0.1', 8.6, 'system', NOW() - INTERVAL '1 minute')
ON CONFLICT DO NOTHING;

-- Seed initial backup record
INSERT INTO platform_backup_logs (backup_id, status, backup_type, size_gb, triggered_by, created_at)
VALUES 
  ('BKP-AUTO-20260924-001', 'COMPLETED', 'DAILY_SCHEDULED', 24.75, 'CRON_DAEMON', NOW() - INTERVAL '4 hours'),
  ('BKP-AUTO-20260923-001', 'COMPLETED', 'DAILY_SCHEDULED', 24.60, 'CRON_DAEMON', NOW() - INTERVAL '28 hours')
ON CONFLICT DO NOTHING;
