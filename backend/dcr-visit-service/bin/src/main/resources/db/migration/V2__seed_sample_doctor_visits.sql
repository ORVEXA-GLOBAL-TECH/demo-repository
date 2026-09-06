-- V2__seed_sample_doctor_visits.sql

INSERT INTO doctor_visits (
    id, mr_id, doctor_id, visit_timestamp, checkin_location, is_geofence_verified, duration_minutes,
    products_discussed, samples_given, feedback, next_followup_date, status
) VALUES
(
    '66666666-6666-6666-6666-666666666601',
    '22222222-2222-2222-2222-222222222208',
    '44444444-4444-4444-4444-444444444401',
    NOW() - INTERVAL '3 hours',
    ST_SetSRID(ST_MakePoint(72.8341, 18.9821), 4326),
    TRUE,
    18,
    'Cardiovex 20mg, Vasotens-AM',
    '4 Units Cardiovex 20mg',
    'Doctor reviewed the Cardiovex clinical trial results and agreed to initiate 10 new cardiac patients this month.',
    NOW() + INTERVAL '7 days',
    'COMPLETED'
),
(
    '66666666-6666-6666-6666-666666666602',
    '22222222-2222-2222-2222-222222222209',
    '44444444-4444-4444-4444-444444444402',
    NOW() - INTERVAL '2 hours',
    ST_SetSRID(ST_MakePoint(72.8182, 18.9521), 4326),
    TRUE,
    15,
    'Glycifit-M2 Forte',
    '6 Units Glycifit-M2',
    'Doctor confirmed continuous Rx support for Glycifit in type-2 diabetic OPD.',
    NOW() + INTERVAL '14 days',
    'COMPLETED'
)
ON CONFLICT (id) DO NOTHING;
