-- V1__create_expenses_and_reimbursements_tables.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL,
    category VARCHAR(50) NOT NULL, -- Fuel & Travel, Food & DA, Accommodation, Miscellaneous
    amount NUMERIC(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    description TEXT,
    km_driven INT,
    receipt_url TEXT,
    ocr_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED', -- SUBMITTED, SUPERVISOR_APPROVED, ACCOUNTS_APPROVED, REIMBURSED, REJECTED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_expenses_emp ON expenses(employee_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
