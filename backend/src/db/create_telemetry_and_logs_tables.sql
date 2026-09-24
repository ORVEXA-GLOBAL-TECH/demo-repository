-- ==============================================================================
-- Schema Migration: Platform Telemetry, Backend Logs, API Metrics & Backups
-- Purpose: Super Admin System Health & Telemetry persistence (Clean Schema)
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
    size_gb NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    triggered_by VARCHAR(100) NOT NULL DEFAULT 'SUPER_ADMIN',
    storage_path VARCHAR(255) DEFAULT 's3://pharma-cloud-backups/prod/pg_cluster_wal/',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_backup_logs_created_at ON platform_backup_logs(created_at DESC);

-- 4. Platform System Health Snapshot Logs Table
CREATE TABLE IF NOT EXISTS platform_system_health_logs (
    id SERIAL PRIMARY KEY,
    overall_status VARCHAR(50) NOT NULL DEFAULT 'HEALTHY',
    db_latency_ms NUMERIC(10, 2) DEFAULT 0.00,
    api_latency_ms NUMERIC(10, 2) DEFAULT 0.00,
    error_rate_pct NUMERIC(6, 3) DEFAULT 0.00,
    cpu_percent NUMERIC(5, 2) DEFAULT 0.00,
    memory_mb NUMERIC(10, 2) DEFAULT 0.00,
    active_connections INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_health_logs_created_at ON platform_system_health_logs(created_at DESC);
