-- V2__seed_initial_users_and_territories.sql

-- 1. Seed Territories
INSERT INTO territories (id, code, name, region, zone) VALUES
('11111111-1111-1111-1111-111111111101', 'TER-MUM-C', 'Mumbai Central', 'West', 'West Zone'),
('11111111-1111-1111-1111-111111111102', 'TER-MUM-S', 'Mumbai South', 'West', 'West Zone'),
('11111111-1111-1111-1111-111111111103', 'TER-PUN-S', 'Pune South', 'West', 'West Zone'),
('11111111-1111-1111-1111-111111111104', 'TER-DEL-N', 'Delhi North', 'North', 'North Zone'),
('11111111-1111-1111-1111-111111111105', 'TER-BLR-E', 'Bengaluru East', 'South', 'South Zone')
ON CONFLICT (code) DO NOTHING;

-- 2. Seed Default Users (Passwords encrypted or BCrypt 'Alleviare@123')
INSERT INTO users (id, username, email, password, full_name, phone, role, department, designation, territory_id) VALUES
('22222222-2222-2222-2222-222222222201', 'superadmin', 'superadmin@alleviare.com', '$2a$10$wN3eHk8U1x.M0k8S9G6VeeQ2F1M9O5L2X1F5P0L8Y3N4B6V2C1X8O', 'Dr. Vikramaditya Roy', '+91 99999 00001', 'SUPER_ADMIN', 'Platform Engineering', 'Root Super Admin', NULL),
('22222222-2222-2222-2222-222222222202', 'admin', 'admin@alleviare.com', '$2a$10$wN3eHk8U1x.M0k8S9G6VeeQ2F1M9O5L2X1F5P0L8Y3N4B6V2C1X8O', 'Alleviare Company Admin', '+91 99999 00002', 'ADMIN', 'Administration', 'Enterprise Administrator', NULL),
('22222222-2222-2222-2222-222222222203', 'director', 'director@alleviare.com', '$2a$10$wN3eHk8U1x.M0k8S9G6VeeQ2F1M9O5L2X1F5P0L8Y3N4B6V2C1X8O', 'Dr. Siddharth Nambiar', '+91 99999 00003', 'DIRECTOR', 'Executive', 'Managing Director', NULL),
('22222222-2222-2222-2222-222222222204', 'manager', 'manager@alleviare.com', '$2a$10$wN3eHk8U1x.M0k8S9G6VeeQ2F1M9O5L2X1F5P0L8Y3N4B6V2C1X8O', 'Arjun Mehta', '+91 99999 00004', 'MANAGER', 'Regional Sales', 'Regional Manager', '11111111-1111-1111-1111-111111111101'),
('22222222-2222-2222-2222-222222222205', 'salesmanager', 'salesmanager@alleviare.com', '$2a$10$wN3eHk8U1x.M0k8S9G6VeeQ2F1M9O5L2X1F5P0L8Y3N4B6V2C1X8O', 'Vikas Saxena', '+91 99999 00005', 'SALES_MANAGER', 'Sales Management', 'Area Sales Manager', '11111111-1111-1111-1111-111111111101'),
('22222222-2222-2222-2222-222222222206', 'supervisor', 'supervisor@alleviare.com', '$2a$10$wN3eHk8U1x.M0k8S9G6VeeQ2F1M9O5L2X1F5P0L8Y3N4B6V2C1X8O', 'Kiran Sharma', '+91 99999 00006', 'SALES_SUPERVISOR', 'Field Operations', 'Field Sales Supervisor', '11111111-1111-1111-1111-111111111101'),
('22222222-2222-2222-2222-222222222207', 'accounts', 'accounts@alleviare.com', '$2a$10$wN3eHk8U1x.M0k8S9G6VeeQ2F1M9O5L2X1F5P0L8Y3N4B6V2C1X8O', 'Ramesh Kulkarni', '+91 99999 00007', 'ACCOUNTS', 'Finance & Audit', 'Accounts Head', NULL),
('22222222-2222-2222-2222-222222222208', 'mr.rahul', 'rahul.verma@alleviare.com', '$2a$10$wN3eHk8U1x.M0k8S9G6VeeQ2F1M9O5L2X1F5P0L8Y3N4B6V2C1X8O', 'Rahul Verma', '+91 98201 44512', 'MR', 'Field Force', 'Territory Medical Representative', '11111111-1111-1111-1111-111111111101'),
('22222222-2222-2222-2222-222222222209', 'mr.priya', 'priya.shah@alleviare.com', '$2a$10$wN3eHk8U1x.M0k8S9G6VeeQ2F1M9O5L2X1F5P0L8Y3N4B6V2C1X8O', 'Priya Shah', '+91 98203 11842', 'MR', 'Field Force', 'Territory Medical Representative', '11111111-1111-1111-1111-111111111102')
ON CONFLICT (username) DO NOTHING;

-- Map Reporting Manager Hierarchy
UPDATE users SET reporting_manager_id = '22222222-2222-2222-2222-222222222203' WHERE id = '22222222-2222-2222-2222-222222222204'; -- Manager reports to Director
UPDATE users SET reporting_manager_id = '22222222-2222-2222-2222-222222222204' WHERE id = '22222222-2222-2222-2222-222222222205'; -- Sales Manager reports to Manager
UPDATE users SET reporting_manager_id = '22222222-2222-2222-2222-222222222205' WHERE id = '22222222-2222-2222-2222-222222222206'; -- Supervisor reports to Sales Manager
UPDATE users SET reporting_manager_id = '22222222-2222-2222-2222-222222222206' WHERE id = '22222222-2222-2222-2222-222222222208'; -- Rahul MR reports to Kiran Supervisor
UPDATE users SET reporting_manager_id = '22222222-2222-2222-2222-222222222206' WHERE id = '22222222-2222-2222-2222-222222222209'; -- Priya MR reports to Kiran Supervisor
