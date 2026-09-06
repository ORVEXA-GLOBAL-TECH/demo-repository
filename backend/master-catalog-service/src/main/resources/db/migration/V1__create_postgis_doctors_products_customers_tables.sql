-- V1__create_postgis_doctors_products_customers_tables.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Doctors Table with PostGIS Location Point
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(100),
    hospital_clinic VARCHAR(200),
    phone VARCHAR(20),
    location GEOMETRY(Point, 4326), -- PostGIS WGS84 coordinates
    category VARCHAR(10) DEFAULT 'A', -- A+, A, B, C
    potential VARCHAR(20) DEFAULT 'HIGH', -- HIGH, MEDIUM, LOW
    visit_frequency INT DEFAULT 2,
    assigned_mr_id UUID,
    territory_id UUID,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Spatial GIST Index for high-performance 150m geofence queries
CREATE INDEX IF NOT EXISTS idx_doctors_location ON doctors USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_doctors_mr ON doctors(assigned_mr_id);

-- 2. Products / SKU Catalog Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    generic_name VARCHAR(200),
    composition TEXT,
    category VARCHAR(100) NOT NULL,
    pack_size VARCHAR(50),
    mrp NUMERIC(12, 2) NOT NULL,
    ptr NUMERIC(12, 2),
    pts NUMERIC(12, 2),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- 3. Customers Table (Chemists, Stockists, Hospitals)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Retail Pharmacy, Stockist, Distributor, Hospital, Institution
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(150),
    address TEXT,
    location GEOMETRY(Point, 4326),
    territory_id UUID,
    assigned_mr_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_customers_mr ON customers(assigned_mr_id);
