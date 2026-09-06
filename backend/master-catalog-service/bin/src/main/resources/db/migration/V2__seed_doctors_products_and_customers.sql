-- V2__seed_doctors_products_and_customers.sql

-- 1. Seed Products SKU Catalog
INSERT INTO products (id, sku, name, brand, generic_name, composition, category, pack_size, mrp, ptr, pts) VALUES
('33333333-3333-3333-3333-333333333301', 'ALV-CARD-20', 'Cardiovex 20mg', 'Cardiovex', 'Atorvastatin + Aspirin', 'Atorvastatin 20mg + Aspirin 75mg Capsule', 'Cardiology', '10x10 Tablets', 240.00, 192.00, 172.80),
('33333333-3333-3333-3333-333333333302', 'ALV-GLYC-M2', 'Glycifit-M2 Forte', 'Glycifit', 'Metformin + Glimepiride', 'Metformin SR 1000mg + Glimepiride 2mg', 'Diabetology', '15 Tablets', 185.00, 148.00, 133.20),
('33333333-3333-3333-3333-333333333303', 'ALV-RESP-D', 'Allevia-D Respir', 'Allevia-D', 'Deflazacort 6mg', 'Deflazacort Tablets 6mg', 'Pulmonology', '10 Tablets', 145.00, 116.00, 104.40),
('33333333-3333-3333-3333-333333333304', 'ALV-NEUR-P', 'Neurocalm Plus', 'Neurocalm', 'Pregabalin + Methylcobalamin', 'Pregabalin 75mg + Methylcobalamin 750mcg', 'Neurology', '10 Capsules', 210.00, 168.00, 151.20),
('33333333-3333-3333-3333-333333333305', 'ALV-VASO-AM', 'Vasotens-AM 5/50', 'Vasotens', 'Telmisartan + Amlodipine', 'Telmisartan 40mg + Amlodipine 5mg', 'Cardiology', '10 Tablets', 160.00, 128.00, 115.20)
ON CONFLICT (sku) DO NOTHING;

-- 2. Seed Doctors with PostGIS Coordinates
INSERT INTO doctors (id, name, specialization, qualification, hospital_clinic, phone, location, category, potential, visit_frequency, assigned_mr_id, territory_id, is_verified) VALUES
(
    '44444444-4444-4444-4444-444444444401',
    'Dr. A. Mehta',
    'Cardiology',
    'MD (Med), DM (Cardio), FACC',
    'KEM Hospital & Research Centre, Parel',
    '+91 98200 88771',
    ST_SetSRID(ST_MakePoint(72.8340, 18.9820), 4326),
    'A+',
    'HIGH',
    4,
    '22222222-2222-2222-2222-222222222208',
    '11111111-1111-1111-1111-111111111101',
    TRUE
),
(
    '44444444-4444-4444-4444-444444444402',
    'Dr. Sanjay Deshmukh',
    'Diabetology',
    'MD, Diab (UK)',
    'Saifee Hospital OPD, Charni Road',
    '+91 98200 88772',
    ST_SetSRID(ST_MakePoint(72.8180, 18.9520), 4326),
    'A',
    'HIGH',
    2,
    '22222222-2222-2222-2222-222222222209',
    '11111111-1111-1111-1111-111111111102',
    TRUE
),
(
    '44444444-4444-4444-4444-444444444403',
    'Dr. R. K. Joshi',
    'Pulmonology',
    'MD (Chest & Resp)',
    'Apollo Clinic Sector 17, Vashi',
    '+91 98200 88773',
    ST_SetSRID(ST_MakePoint(73.0010, 19.0760), 4326),
    'B',
    'MEDIUM',
    2,
    '22222222-2222-2222-2222-222222222208',
    '11111111-1111-1111-1111-111111111101',
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Customers (Chemists & Stockists)
INSERT INTO customers (id, name, type, contact_person, phone, email, address, territory_id, assigned_mr_id) VALUES
('55555555-5555-5555-5555-555555555501', 'Apollo Pharmacy Hub Parel', 'Retail Pharmacy', 'Manish Gupta', '+91 98200 11223', 'apollo.parel@pharmacy.com', 'Shop 4, Dr. Ambedkar Road, Parel, Mumbai', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222208'),
('55555555-5555-5555-5555-555555555502', 'MedPlus Drugs Churchgate', 'Retail Pharmacy', 'Sunil Jadhav', '+91 98200 44556', 'medplus.cg@drugs.com', 'Opp Station, Churchgate, Mumbai', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222209'),
('55555555-5555-5555-5555-555555555503', 'Mahalaxmi Pharma Distributors', 'Distributor', 'Rajendra Shah', '+91 98200 77889', 'orders@mahalaxmipharma.in', 'Warehouse Hub 12, Kalbadevi, Mumbai', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222208')
ON CONFLICT (id) DO NOTHING;
