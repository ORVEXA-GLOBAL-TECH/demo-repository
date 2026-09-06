-- V1__create_users_and_territories_tables.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Territories Table
CREATE TABLE IF NOT EXISTS territories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    region VARCHAR(100) NOT NULL, -- North, South, West, East, Central
    zone VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL, -- SUPER_ADMIN, ADMIN, DIRECTOR, MANAGER, SALES_MANAGER, SALES_SUPERVISOR, ACCOUNTS, MR
    reporting_manager_id UUID REFERENCES users(id),
    territory_id UUID REFERENCES territories(id),
    department VARCHAR(100),
    designation VARCHAR(100),
    device_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_manager ON users(reporting_manager_id);
CREATE INDEX IF NOT EXISTS idx_users_territory ON users(territory_id);
