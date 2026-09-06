-- V1__create_dcr_and_doctor_visits_tables.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS doctor_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mr_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    visit_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checkin_location GEOMETRY(Point, 4326),
    checkout_location GEOMETRY(Point, 4326),
    is_geofence_verified BOOLEAN DEFAULT FALSE,
    duration_minutes INT,
    products_discussed TEXT,
    samples_given TEXT,
    feedback TEXT,
    next_followup_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED', -- PLANNED, IN_PROGRESS, COMPLETED, MISSED, RESCHEDULED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_visits_mr ON doctor_visits(mr_id);
CREATE INDEX IF NOT EXISTS idx_visits_doc ON doctor_visits(doctor_id);
CREATE INDEX IF NOT EXISTS idx_visits_timestamp ON doctor_visits(visit_timestamp);
