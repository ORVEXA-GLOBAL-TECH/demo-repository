-- ==============================================================================
-- WIPE ALL TABLES IN SUPABASE (PUBLIC SCHEMA)
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Drop existing public schema and all its objects (tables, views, enums, triggers)
DROP SCHEMA public CASCADE;

-- 2. Re-create clean public schema
CREATE SCHEMA public;

-- 3. Restore default Supabase role permissions for the public schema
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;
