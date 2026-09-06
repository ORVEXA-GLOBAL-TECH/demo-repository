-- V2__seed_sample_expenses.sql

INSERT INTO expenses (id, employee_id, category, amount, expense_date, description, km_driven, receipt_url, ocr_verified, status) VALUES
(
    '99999999-9999-9999-9999-999999999901',
    '22222222-2222-2222-2222-222222222208',
    'Fuel & Travel',
    4250.00,
    CURRENT_DATE - INTERVAL '1 day',
    'Daily doctor beat coverage from Dadar to Thane clinics (142 km)',
    142,
    'fuel_receipt_01.jpg',
    TRUE,
    'SUPERVISOR_APPROVED'
),
(
    '99999999-9999-9999-9999-999999999902',
    '22222222-2222-2222-2222-222222222209',
    'Food & DA',
    1200.00,
    CURRENT_DATE - INTERVAL '1 day',
    'Outstation daily allowance for Solapur CME',
    0,
    'da_receipt_02.jpg',
    TRUE,
    'SUPERVISOR_APPROVED'
),
(
    '99999999-9999-9999-9999-999999999903',
    '22222222-2222-2222-2222-222222222208',
    'Accommodation',
    3800.00,
    CURRENT_DATE - INTERVAL '3 days',
    'Hotel stay for 2 nights - Mysore Doctor Conclave',
    0,
    'hotel_receipt_03.pdf',
    TRUE,
    'ACCOUNTS_APPROVED'
)
ON CONFLICT (id) DO NOTHING;
