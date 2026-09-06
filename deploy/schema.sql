-- =========================================================
-- ALLEVIARE PHARMA PLATFORM DATABASE INITIALIZATION
-- Compatible with Neon.tech / Supabase / Azure PostgreSQL
-- =========================================================

-- Enable PostGIS Extension for Geofencing & Doctor coordinates
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Users & RBAC Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL, -- SUPER_ADMIN, ADMIN, DIRECTOR, MANAGER, ACCOUNTANT, SALES_MANAGER, SALES_SUPERVISOR, MR
    reporting_manager_id UUID,
    territory_id UUID,
    department VARCHAR(100),
    designation VARCHAR(100),
    device_id VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Territories & Geofencing Zones
CREATE TABLE IF NOT EXISTS territories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    region VARCHAR(100),
    state VARCHAR(100),
    headquarters VARCHAR(100),
    polygon_boundary GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seed Accounts for Testing & First Login
-- Default password for all seed accounts: Alleviare@123
INSERT INTO users (username, email, password, full_name, phone, role, department, designation)
VALUES 
    -- Super Admin (Exclusive to Super Admin Portal)
    ('superadmin', 'superadmin@alleviare.com', '$2a$10$wU0M76hI7Q6G7hK8iZlhx.B8oKqjYI7B2jM9L4rS.e1gM0D1lKqyK', 'Master Super Administrator', '+919999900001', 'SUPER_ADMIN', 'Executive IT', 'Global Platform Administrator'),
    
    -- Staff Roles (Unified Staff Portal & Mobile App)
    ('director', 'director@alleviare.com', '$2a$10$wU0M76hI7Q6G7hK8iZlhx.B8oKqjYI7B2jM9L4rS.e1gM0D1lKqyK', 'Dr. Ramesh Director', '+919999900002', 'DIRECTOR', 'Executive Leadership', 'Managing Director'),
    ('admin', 'admin@alleviare.com', '$2a$10$wU0M76hI7Q6G7hK8iZlhx.B8oKqjYI7B2jM9L4rS.e1gM0D1lKqyK', 'Suresh Admin', '+919999900003', 'ADMIN', 'Operations', 'System Administrator'),
    ('accountant', 'accounts@alleviare.com', '$2a$10$wU0M76hI7Q6G7hK8iZlhx.B8oKqjYI7B2jM9L4rS.e1gM0D1lKqyK', 'Priya Accounts', '+919999900004', 'ACCOUNTANT', 'Finance & Audit', 'Senior Accounts Manager'),
    ('manager', 'manager@alleviare.com', '$2a$10$wU0M76hI7Q6G7hK8iZlhx.B8oKqjYI7B2jM9L4rS.e1gM0D1lKqyK', 'Rajesh Zonal Manager', '+919999900005', 'MANAGER', 'Sales & Marketing', 'Zonal Business Manager'),
    ('salesmanager', 'salesmanager@alleviare.com', '$2a$10$wU0M76hI7Q6G7hK8iZlhx.B8oKqjYI7B2jM9L4rS.e1gM0D1lKqyK', 'Amit Sales Manager', '+919999900006', 'SALES_MANAGER', 'Sales Operations', 'Area Sales Manager'),
    ('salessupervisor', 'salessupervisor@alleviare.com', '$2a$10$wU0M76hI7Q6G7hK8iZlhx.B8oKqjYI7B2jM9L4rS.e1gM0D1lKqyK', 'Vikram Supervisor', '+919999900007', 'SALES_SUPERVISOR', 'Field Operations', 'Field Sales Supervisor'),
    
    -- Medical / Marketing Representative (Mobile App + Web Portal)
    ('mr_rahul', 'mr_rahul@alleviare.com', '$2a$10$wU0M76hI7Q6G7hK8iZlhx.B8oKqjYI7B2jM9L4rS.e1gM0D1lKqyK', 'Rahul Field MR', '+919999900008', 'MR', 'Field Sales', 'Medical Representative')
ON CONFLICT (username) DO NOTHING;
