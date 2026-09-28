import React, { useState, useEffect, useMemo } from 'react';
import {
  Stethoscope, Store, Pill, Plus, Search, Truck, Eye, Star,
  Phone, MapPin, Building, Calendar, CheckCircle2, AlertCircle,
  FileText, X, ChevronRight, Filter, ShieldCheck, Tag, Sparkles
} from 'lucide-react';
import { getDoctors, getChemists, getProducts, getStockists, addDoctor } from '../services/api';
import { useTenantTheme } from '../context/TenantThemeContext';
import { INITIAL_ENTERPRISE_DATA } from '../services/localDataStore';

// Comprehensive realistic default datasets for immediate offline & online fidelity
const DEFAULT_DOCTORS = [
  {
    id: 'DOC-101',
    name: 'Dr. Arvind Mehra',
    specialty: 'Cardiologist',
    qualification: 'MBBS, MD, DM (Cardiology)',
    hospital: 'Max Super Speciality Hospital, Saket',
    territory: 'South Delhi',
    class: 'A+',
    potential: 'Very High (150+ Rx/mo)',
    monthlyTargetVisits: 3,
    completedVisitsThisMonth: 2,
    visitingDays: ['Mon', 'Wed', 'Fri'],
    timing: '10:00 AM - 01:30 PM',
    phone: '+91 98112 45890',
    keyPrescribingProducts: ['CardioShield 50mg', 'NeuroCalm Plus', 'Amlopin-AT'],
    consultationFee: 1500,
    email: 'dr.mehra@maxhealthcare.com'
  },
  {
    id: 'DOC-102',
    name: 'Dr. Sunita Rao',
    specialty: 'Diabetologist',
    qualification: 'MD (Med), DNB (Endocrinology)',
    hospital: 'Fortis Escorts Heart Institute, Okhla',
    territory: 'South Delhi',
    class: 'A+',
    potential: 'Very High (180+ Rx/mo)',
    monthlyTargetVisits: 3,
    completedVisitsThisMonth: 3,
    visitingDays: ['Tue', 'Thu', 'Sat'],
    timing: '11:00 AM - 02:00 PM',
    phone: '+91 98201 34912',
    keyPrescribingProducts: ['GlucoMet Forte 500/5', 'MetforAll 500', 'Glyciphage-G2'],
    consultationFee: 1400,
    email: 'sunita.rao@fortishealthcare.com'
  },
  {
    id: 'DOC-103',
    name: 'Dr. Vikram Sethi',
    specialty: 'Oncologist',
    qualification: 'MBBS, MD, DM (Medical Oncology)',
    hospital: 'Apollo Cancer Centre, Sarita Vihar',
    territory: 'Noida & South Delhi',
    class: 'A+',
    potential: 'High Value (110+ Rx/mo)',
    monthlyTargetVisits: 2,
    completedVisitsThisMonth: 1,
    visitingDays: ['Mon', 'Tue', 'Thu'],
    timing: '02:00 PM - 05:00 PM',
    phone: '+91 99104 22345',
    keyPrescribingProducts: ['AllevOnco 100mg Injection', 'Ondaset-MD', 'Filgrast-300'],
    consultationFee: 2000,
    email: 'vikram.sethi@apollohospitals.com'
  },
  {
    id: 'DOC-104',
    name: 'Dr. Priya Nair',
    specialty: 'Neurologist',
    qualification: 'MD, DM (Neurology), DNB',
    hospital: 'Medanta The Medicity, Gurugram',
    territory: 'Gurugram & NCR',
    class: 'A',
    potential: 'High (95+ Rx/mo)',
    monthlyTargetVisits: 2,
    completedVisitsThisMonth: 2,
    visitingDays: ['Wed', 'Fri', 'Sat'],
    timing: '09:30 AM - 12:30 PM',
    phone: '+91 97118 90432',
    keyPrescribingProducts: ['NeuroCalm Plus', 'Gabapentin-NT', 'Cerebro-SR'],
    consultationFee: 1600,
    email: 'priya.nair@medanta.org'
  },
  {
    id: 'DOC-105',
    name: 'Dr. Rajesh K. Gupta',
    specialty: 'Orthopedic Surgeon',
    qualification: 'MS (Ortho), M.Ch (Joint Replacement)',
    hospital: 'Indraprastha Apollo Hospital, Mathura Rd',
    territory: 'South Delhi',
    class: 'A',
    potential: 'High (120+ Rx/mo)',
    monthlyTargetVisits: 2,
    completedVisitsThisMonth: 1,
    visitingDays: ['Mon', 'Thu', 'Sat'],
    timing: '10:30 AM - 01:00 PM',
    phone: '+91 98991 76543',
    keyPrescribingProducts: ['OsteoFlex Max', 'ChondroPlus', 'CalciD3 Ultra'],
    consultationFee: 1500,
    email: 'rajesh.gupta@apollohospitals.com'
  },
  {
    id: 'DOC-106',
    name: 'Dr. Ananya Sen',
    specialty: 'Pediatrician',
    qualification: 'MD (Pediatrics), DCH',
    hospital: "Rainbow Children's Hospital, Malviya Nagar",
    territory: 'South Delhi',
    class: 'B',
    potential: 'Medium (70+ Rx/mo)',
    monthlyTargetVisits: 1,
    completedVisitsThisMonth: 1,
    visitingDays: ['Mon', 'Tue', 'Wed', 'Fri'],
    timing: '05:00 PM - 08:00 PM',
    phone: '+91 98300 12890',
    keyPrescribingProducts: ['KiddoCeph Drops', 'FebriCalm Suspension', 'ZincKid Oral'],
    consultationFee: 1000,
    email: 'ananya.sen@rainbowhospitals.in'
  },
  {
    id: 'DOC-107',
    name: 'Dr. Harshvardhan Joshi',
    specialty: 'Gastroenterologist',
    qualification: 'MD (Medicine), DM (Gastroenterology)',
    hospital: 'BLK-Max Super Speciality Hospital, Pusa Rd',
    territory: 'Central & West Delhi',
    class: 'A',
    potential: 'High (85+ Rx/mo)',
    monthlyTargetVisits: 2,
    completedVisitsThisMonth: 1,
    visitingDays: ['Tue', 'Fri'],
    timing: '11:30 AM - 02:30 PM',
    phone: '+91 99580 43210',
    keyPrescribingProducts: ['GastoStop-D', 'HepaSafe 300', 'Pan-D Fast'],
    consultationFee: 1400,
    email: 'h.joshi@blkmax.com'
  },
  {
    id: 'DOC-108',
    name: 'Dr. Rameshwar Das',
    specialty: 'Pulmonologist',
    qualification: 'MD (Respiratory Medicine), FCCP',
    hospital: 'National Institute of TB & RD, Mehrauli',
    territory: 'South Delhi',
    class: 'A+',
    potential: 'Very High (140+ Rx/mo)',
    monthlyTargetVisits: 3,
    completedVisitsThisMonth: 2,
    visitingDays: ['Mon', 'Wed', 'Fri'],
    timing: '09:00 AM - 12:00 PM',
    phone: '+91 98103 98765',
    keyPrescribingProducts: ['RespiraFlow Inhaler', 'Montico-LC', 'Deriphyllin-OD'],
    consultationFee: 1300,
    email: 'rameshwar.das@nitrd.nic.in'
  },
  {
    id: 'DOC-109',
    name: 'Dr. Sneha Kulkarni',
    specialty: 'Dermatologist',
    qualification: 'MD (Dermatology, Venereology & Leprosy)',
    hospital: 'Kaya Skin Clinic & Safdarjung Hospital',
    territory: 'South Delhi',
    class: 'A',
    potential: 'High (105+ Rx/mo)',
    monthlyTargetVisits: 2,
    completedVisitsThisMonth: 1,
    visitingDays: ['Tue', 'Thu', 'Sat'],
    timing: '03:00 PM - 06:30 PM',
    phone: '+91 98188 65432',
    keyPrescribingProducts: ['DermaGlow Serum', 'Claritop Gel', 'Moistura-Ultra'],
    consultationFee: 1200,
    email: 'dr.sneha@kayaclinic.in'
  },
  {
    id: 'DOC-110',
    name: 'Dr. Kavita Deshmukh',
    specialty: 'Gynecologist',
    qualification: 'MBBS, MD, DGO, FICOG',
    hospital: 'Cloudnine Hospital, Kailash Colony',
    territory: 'South Delhi',
    class: 'A',
    potential: 'High (90+ Rx/mo)',
    monthlyTargetVisits: 2,
    completedVisitsThisMonth: 2,
    visitingDays: ['Mon', 'Wed', 'Sat'],
    timing: '10:00 AM - 01:00 PM',
    phone: '+91 98450 67890',
    keyPrescribingProducts: ['FeroFem XT', 'PregnaVital-DHA', 'Progest-200'],
    consultationFee: 1500,
    email: 'kavita.d@cloudninecare.com'
  },
  {
    id: 'DOC-111',
    name: 'Dr. Alok Bhargava',
    specialty: 'Nephrologist',
    qualification: 'MD, DM (Nephrology)',
    hospital: 'Sir Ganga Ram Hospital, Rajinder Nagar',
    territory: 'Central Delhi',
    class: 'A+',
    potential: 'Very High (130+ Rx/mo)',
    monthlyTargetVisits: 3,
    completedVisitsThisMonth: 2,
    visitingDays: ['Tue', 'Thu', 'Fri'],
    timing: '10:00 AM - 01:00 PM',
    phone: '+91 99101 23456',
    keyPrescribingProducts: ['Renocare 500', 'NephroLife Plus', 'ErythroPro-4000'],
    consultationFee: 1800,
    email: 'alok.bhargava@sgrh.com'
  },
  {
    id: 'DOC-112',
    name: 'Dr. Sameer Khan',
    specialty: 'General Physician',
    qualification: 'MBBS, MD (Internal Medicine)',
    hospital: 'Batra Hospital & Medical Research Centre',
    territory: 'South Delhi',
    class: 'B',
    potential: 'Medium (65+ Rx/mo)',
    monthlyTargetVisits: 1,
    completedVisitsThisMonth: 1,
    visitingDays: ['Daily Mon-Sat'],
    timing: '09:00 AM - 01:00 PM',
    phone: '+91 98711 54321',
    keyPrescribingProducts: ['MetforAll 500', 'Pan-D', 'Ciprolon-500'],
    consultationFee: 800,
    email: 'sameer.khan@batrahospital.org'
  }
];

const DEFAULT_CHEMISTS = [
  {
    id: 'CHM-201',
    name: 'Apollo Pharmacy Saket',
    contactPerson: 'Ramesh Gupta',
    territory: 'Saket, South Delhi',
    address: 'Shop 14-15, Main Market, Block J, Saket, New Delhi 110017',
    preferredStockist: 'MedLife Distributors Ltd.',
    creditLimit: 500000,
    outstandingDue: 120000,
    dlNumber: 'DL-20B/3492/SZ',
    gstNumber: '07AAAAA0000A1Z5',
    attachedDoctors: ['Dr. Arvind Mehra', 'Dr. Sunita Rao', 'Dr. Rajesh K. Gupta'],
    phone: '+91 98114 77889'
  },
  {
    id: 'CHM-202',
    name: 'MedPlus Pharmacy Green Park',
    contactPerson: 'Suresh Choudhary',
    territory: 'Green Park, South Delhi',
    address: 'G-22, Main Market, Green Park, New Delhi 110016',
    preferredStockist: 'Apex Pharma Distributors',
    creditLimit: 400000,
    outstandingDue: 85000,
    dlNumber: 'DL-21B/4811/SZ',
    gstNumber: '07BBBBB1111B2Z6',
    attachedDoctors: ['Dr. Priya Nair', 'Dr. Sneha Kulkarni'],
    phone: '+91 98102 33441'
  },
  {
    id: 'CHM-203',
    name: 'Guardian Pharmacy South Ext',
    contactPerson: 'Naveen Malhotra',
    territory: 'South Extension II',
    address: 'E-12, Main Market, South Extension Part II, New Delhi 110049',
    preferredStockist: 'Metro Healthcare Stockists',
    creditLimit: 650000,
    outstandingDue: 140000,
    dlNumber: 'DL-20B/5520/SZ',
    gstNumber: '07CCCCC2222C3Z7',
    attachedDoctors: ['Dr. Rajesh K. Gupta', 'Dr. Kavita Deshmukh'],
    phone: '+91 99114 88772'
  },
  {
    id: 'CHM-204',
    name: 'Wellness Forever Chemists',
    contactPerson: 'Amit Aggarwal',
    territory: 'Hauz Khas Enclave',
    address: 'Plot 4, Community Centre, Hauz Khas, New Delhi 110016',
    preferredStockist: 'MedLife Distributors Ltd.',
    creditLimit: 750000,
    outstandingDue: 210000,
    dlNumber: 'DL-20B/6612/SZ',
    gstNumber: '07DDDDD3333D4Z8',
    attachedDoctors: ['Dr. Vikram Sethi', 'Dr. Harshvardhan Joshi'],
    phone: '+91 98188 99001'
  },
  {
    id: 'CHM-205',
    name: 'Fortis Hospital Internal Pharmacy',
    contactPerson: 'Sanjeev Saxena',
    territory: 'Okhla Road',
    address: 'Ground Floor, Fortis Escorts Institute, Okhla, New Delhi 110025',
    preferredStockist: 'National Pharma Wholesale',
    creditLimit: 1500000,
    outstandingDue: 420000,
    dlNumber: 'DL-20B/7701/SZ',
    gstNumber: '07EEEEE4444E5Z9',
    attachedDoctors: ['Dr. Sunita Rao', 'Dr. Arvind Mehra'],
    phone: '+91 98110 55443'
  },
  {
    id: 'CHM-206',
    name: 'Max Chemist & Surgical',
    contactPerson: 'Deepak Verma',
    territory: 'Press Enclave, Saket',
    address: 'Opp. Max Hospital Gate 2, Press Enclave Road, Saket, New Delhi 110017',
    preferredStockist: 'Apex Pharma Distributors',
    creditLimit: 1200000,
    outstandingDue: 310000,
    dlNumber: 'DL-21B/8823/SZ',
    gstNumber: '07FFFFF5555F6Z1',
    attachedDoctors: ['Dr. Arvind Mehra', 'Dr. Rameshwar Das'],
    phone: '+91 98101 66554'
  },
  {
    id: 'CHM-207',
    name: 'Frank Ross Pharmacy',
    contactPerson: 'Joydeep Banerjee',
    territory: 'Connaught Place',
    address: 'B-Block Inner Circle, Connaught Place, New Delhi 110001',
    preferredStockist: 'Metro Healthcare Stockists',
    creditLimit: 550000,
    outstandingDue: 95000,
    dlNumber: 'DL-20B/9934/CZ',
    gstNumber: '07GGGGG6666G7Z2',
    attachedDoctors: ['Dr. Harshvardhan Joshi', 'Dr. Alok Bhargava'],
    phone: '+91 98711 22334'
  },
  {
    id: 'CHM-208',
    name: 'Nobel Medicos',
    contactPerson: 'Anil Grover',
    territory: 'Malviya Nagar Corner',
    address: 'Corner Shop 3, Main Shivalik Road, Malviya Nagar, New Delhi 110017',
    preferredStockist: 'Delhi Pharma Syndicate',
    creditLimit: 350000,
    outstandingDue: 60000,
    dlNumber: 'DL-20B/1144/SZ',
    gstNumber: '07HHHHH7777H8Z3',
    attachedDoctors: ['Dr. Sameer Khan', 'Dr. Ananya Sen'],
    phone: '+91 98115 33221'
  }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'PRD-301',
    name: 'CardioShield 50mg',
    composition: 'Telmisartan 40mg + Amlodipine 5mg',
    indication: 'Essential Hypertension & Angina Pectoris',
    category: 'Cardiology',
    division: 'Cardio-Diabetology Division',
    packing: 'Blister 10x10 Tablets',
    mrp: 145.00,
    ptr: 108.75,
    pts: 98.60,
    sampleStock: 140,
    gstPercent: 12,
    visualAidUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-302',
    name: 'GlucoMet Forte 500/5',
    composition: 'Metformin SR 500mg + Glimepiride 2mg',
    indication: 'Type 2 Diabetes Mellitus Glycemic Control',
    category: 'Diabetology',
    division: 'Cardio-Diabetology Division',
    packing: 'Strip of 15 Tablets',
    mrp: 180.00,
    ptr: 135.00,
    pts: 122.40,
    sampleStock: 220,
    gstPercent: 12,
    visualAidUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-303',
    name: 'AllevOnco 100mg Injection',
    composition: 'Paclitaxel Nanoparticle Injection 100mg/vial',
    indication: 'Metastatic Breast & Non-Small Cell Lung Carcinoma',
    category: 'Oncology',
    division: 'Specialty Oncology Vault',
    packing: 'Single Dose Vial + Infusion Set',
    mrp: 3200.00,
    ptr: 2400.00,
    pts: 2160.00,
    sampleStock: 18,
    gstPercent: 12,
    visualAidUrl: 'https://images.unsplash.com/photo-1579165466791-788226ab6fb3?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-304',
    name: 'NeuroCalm Plus',
    composition: 'Pregabalin 75mg + Methylcobalamin 750mcg',
    indication: 'Peripheral Neuropathy & Sciatica Neuralgia',
    category: 'Neurology',
    division: 'Neuro-Psychiatry Division',
    packing: 'Strip of 10 Capsules',
    mrp: 210.00,
    ptr: 157.50,
    pts: 142.80,
    sampleStock: 95,
    gstPercent: 12,
    visualAidUrl: 'https://images.unsplash.com/photo-1550572017-ed240d85ec56?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-305',
    name: 'OsteoFlex Max',
    composition: 'Glucosamine Sulfate 750mg + Diacerein 50mg',
    indication: 'Osteoarthritis & Joint Cartilage Degeneration',
    category: 'Orthopedics',
    division: 'Ortho-Rheuma Division',
    packing: 'Alu-Alu 10x10 Tablets',
    mrp: 320.00,
    ptr: 240.00,
    pts: 216.00,
    sampleStock: 80,
    gstPercent: 12,
    visualAidUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-306',
    name: 'RespiraFlow Inhaler',
    composition: 'Budesonide 200mcg + Formoterol 6mcg DPI',
    indication: 'Chronic Bronchial Asthma & Severe COPD',
    category: 'Pulmonology',
    division: 'Respiratory Care Unit',
    packing: '120 Metered Doses with Inhaler Device',
    mrp: 495.00,
    ptr: 371.25,
    pts: 334.00,
    sampleStock: 65,
    gstPercent: 12,
    visualAidUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-307',
    name: 'GastoStop-D',
    composition: 'Rabeprazole Sodium 20mg + Domperidone 30mg SR',
    indication: 'GERD, Reflux Esophagitis & Peptic Ulcers',
    category: 'Gastroenterology',
    division: 'Gastro-Hepato Division',
    packing: 'Alu-Alu 10x10 Capsules',
    mrp: 160.00,
    ptr: 120.00,
    pts: 108.80,
    sampleStock: 190,
    gstPercent: 12,
    visualAidUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-308',
    name: 'DermaGlow Serum',
    composition: 'Vitamin C 20% + Hyaluronic Acid + Ferulic Acid',
    indication: 'Hyperpigmentation, Photoaging & Collagen Boost',
    category: 'Dermatology',
    division: 'Derma-Cosmeceuticals',
    packing: '30ml Amber Glass Dropper Bottle',
    mrp: 850.00,
    ptr: 637.50,
    pts: 578.00,
    sampleStock: 45,
    gstPercent: 18,
    visualAidUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-309',
    name: 'FeroFem XT',
    composition: 'Ferrous Ascorbate 100mg + Folic Acid 1.5mg + Zinc',
    indication: 'Iron Deficiency Anemia in Pregnancy & Lactation',
    category: 'Gynecology',
    division: "Women's Health Division",
    packing: '10x10 Red Sugar-Coated Tablets',
    mrp: 175.00,
    ptr: 131.25,
    pts: 119.00,
    sampleStock: 160,
    gstPercent: 12,
    visualAidUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'PRD-310',
    name: 'KiddoCeph Drops',
    composition: 'Cefixime Oral Suspension 50mg/5ml',
    indication: 'Pediatric Upper Respiratory & Urinary Tract Infections',
    category: 'Pediatrics',
    division: 'Pediatric Antibiotics Unit',
    packing: '30ml Dry Syrup with Calibrated Dropper',
    mrp: 125.00,
    ptr: 93.75,
    pts: 85.00,
    sampleStock: 110,
    gstPercent: 12,
    visualAidUrl: 'https://images.unsplash.com/photo-1550572017-ed240d85ec56?w=800&auto=format&fit=crop&q=80'
  }
];

const DEFAULT_STOCKISTS = [
  {
    id: 'STK-401',
    name: 'MedLife Distributors Ltd.',
    contactPerson: 'Rajeev Singhania',
    phone: '+91 98110 99881',
    territoryCoverage: 'South Delhi, Faridabad & Badarpur Corridor',
    address: 'B-44, Okhla Industrial Area Phase II, New Delhi 110020',
    creditTerms: '30 Days Net (2% Cash Discount in 7 Days)',
    creditLimit: 7500000,
    activeOrdersCount: 8,
    gstNumber: '07AAAAA1234A1Z9',
    establishedYear: 2008,
    fulfillmentRate: 98.4
  },
  {
    id: 'STK-402',
    name: 'Apex Pharma Distributors',
    contactPerson: 'Manoj Agrawal',
    phone: '+91 98102 33445',
    territoryCoverage: 'Central Delhi, Karol Bagh & Chandni Chowk',
    address: 'Shop 8-10, Wholesale Medicine Market, Chandni Chowk, Delhi 110006',
    creditTerms: '21 Days Net',
    creditLimit: 9000000,
    activeOrdersCount: 14,
    gstNumber: '07BBBBB2345B2Z8',
    establishedYear: 2002,
    fulfillmentRate: 99.1
  },
  {
    id: 'STK-403',
    name: 'Metro Healthcare Stockists',
    contactPerson: 'Vikas Goel',
    phone: '+91 99114 55667',
    territoryCoverage: 'Noida (Sec 1-135), Greater Noida & Ghaziabad',
    address: 'Plot C-19, Logistics Park, Sector 63, Noida, UP 201301',
    creditTerms: '30 Days Net',
    creditLimit: 6000000,
    activeOrdersCount: 6,
    gstNumber: '09CCCCC3456C3Z7',
    establishedYear: 2014,
    fulfillmentRate: 97.6
  },
  {
    id: 'STK-404',
    name: 'National Pharma Wholesale',
    contactPerson: 'R. K. Mittal',
    phone: '+91 98188 77665',
    territoryCoverage: 'Gurugram, Manesar & South West Delhi Belt',
    address: 'Building 12, Udyog Vihar Phase IV, Gurugram, HR 122015',
    creditTerms: '45 Days Net (Hospital Supply Contract)',
    creditLimit: 12000000,
    activeOrdersCount: 11,
    gstNumber: '06DDDDD4567D4Z6',
    establishedYear: 1998,
    fulfillmentRate: 99.5
  },
  {
    id: 'STK-405',
    name: 'Delhi Pharma Syndicate',
    contactPerson: 'Alok Khurana',
    phone: '+91 98100 44332',
    territoryCoverage: 'East Delhi, Shahdara, Laxmi Nagar & Mayur Vihar',
    address: '15 Medical Complex, Daryaganj, New Delhi 110002',
    creditTerms: '21 Days Net',
    creditLimit: 5000000,
    activeOrdersCount: 4,
    gstNumber: '07EEEEE5678E5Z5',
    establishedYear: 2011,
    fulfillmentRate: 96.8
  },
  {
    id: 'STK-406',
    name: 'Northern BioLogix Wholesalers',
    contactPerson: 'Harpreet Singh',
    phone: '+91 98765 43210',
    territoryCoverage: 'Ambala, Panipat, Sonipat & GT Road Corridor',
    address: 'Wholesale Mandi Gate 4, Ambala Cantt, HR 133001',
    creditTerms: '30 Days Net',
    creditLimit: 8500000,
    activeOrdersCount: 7,
    gstNumber: '06FFFFF6789F6Z4',
    establishedYear: 2005,
    fulfillmentRate: 98.2
  }
];

export default function CatalogPage({ initialTab = 'doctors' }) {
  const { activeTenant } = useTenantTheme();
  const brandColor = activeTenant?.brand_primary_color || activeTenant?.brandPrimaryColor || '#2563eb';

  // Active Sub Tab: 'doctors' | 'chemists' | 'products' | 'stockists' | 'hospitals' | 'divisions' | 'competitors'
  const [activeSubTab, setActiveSubTab] = useState(initialTab || 'doctors');

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Datasets initialized with rich defaults, updated on live API load
  const [doctors, setDoctors] = useState(DEFAULT_DOCTORS);
  const [chemists, setChemists] = useState(DEFAULT_CHEMISTS);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [stockists, setStockists] = useState(DEFAULT_STOCKISTS);

  // Modals state
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showAddChemistModal, setShowAddChemistModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddStockistModal, setShowAddStockistModal] = useState(false);

  // Inspection modal state
  const [inspectItem, setInspectItem] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);

  // Form states
  const [newDoc, setNewDoc] = useState({
    name: '',
    specialty: 'Cardiologist',
    qualification: 'MD, DM',
    hospital: '',
    territory: 'South Delhi',
    class: 'A+',
    potential: 'Very High (150+ Rx/mo)',
    monthlyTargetVisits: 3,
    timing: '10:00 AM - 01:00 PM',
    phone: '',
    keyPrescribingProducts: 'CardioShield 50mg, NeuroCalm Plus'
  });

  const [newChem, setNewChem] = useState({
    name: '',
    contactPerson: '',
    territory: 'South Delhi',
    address: '',
    preferredStockist: 'MedLife Distributors Ltd.',
    creditLimit: '500000',
    phone: ''
  });

  const [newProd, setNewProd] = useState({
    name: '',
    composition: '',
    indication: '',
    category: 'Cardiology',
    packing: 'Blister 10x10',
    mrp: '150',
    ptr: '112.50',
    pts: '101.25',
    sampleStock: '100'
  });

  const [newStk, setNewStk] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    territoryCoverage: 'South Delhi & NCR',
    address: '',
    creditTerms: '30 Days Net',
    creditLimit: '5000000'
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [docRes, chmRes, prdRes, stkRes] = await Promise.all([
        getDoctors(),
        getChemists(),
        getProducts(),
        getStockists()
      ]);
      if (docRes?.data && docRes.data.length > 0) setDoctors(docRes.data);
      if (chmRes?.data && chmRes.data.length > 0) setChemists(chmRes.data);
      if (prdRes?.data && prdRes.data.length > 0) setProducts(prdRes.data);
      if (stkRes?.data && stkRes.data.length > 0) setStockists(stkRes.data);
    } catch (e) {
      console.warn('API sync fallback to preloaded enterprise catalog:', e.message);
    }
  };

  // Add Handlers
  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    const nextId = `DOC-${101 + doctors.length}`;
    const docObj = {
      ...newDoc,
      id: nextId,
      completedVisitsThisMonth: 0,
      monthlyTargetVisits: Number(newDoc.monthlyTargetVisits) || 2,
      keyPrescribingProducts: newDoc.keyPrescribingProducts.split(',').map(s => s.trim())
    };
    try {
      await addDoctor(docObj);
    } catch (e) {
      console.warn('Local state fallback for doctor creation:', e);
    }
    setDoctors([docObj, ...doctors]);
    setShowAddDoctorModal(false);
    setNewDoc({
      name: '',
      specialty: 'Cardiologist',
      qualification: 'MD, DM',
      hospital: '',
      territory: 'South Delhi',
      class: 'A+',
      potential: 'Very High (150+ Rx/mo)',
      monthlyTargetVisits: 3,
      timing: '10:00 AM - 01:00 PM',
      phone: '',
      keyPrescribingProducts: 'CardioShield 50mg, NeuroCalm Plus'
    });
  };

  const handleAddChemistSubmit = (e) => {
    e.preventDefault();
    const nextId = `CHM-${201 + chemists.length}`;
    const chmObj = {
      ...newChem,
      id: nextId,
      creditLimit: Number(newChem.creditLimit) || 300000,
      outstandingDue: 0,
      attachedDoctors: ['Dr. Arvind Mehra']
    };
    setChemists([chmObj, ...chemists]);
    setShowAddChemistModal(false);
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    const nextId = `PRD-${301 + products.length}`;
    const prodObj = {
      ...newProd,
      id: nextId,
      mrp: Number(newProd.mrp) || 100,
      ptr: Number(newProd.ptr) || 75,
      pts: Number(newProd.pts) || 68,
      sampleStock: Number(newProd.sampleStock) || 50,
      gstPercent: 12
    };
    setProducts([prodObj, ...products]);
    setShowAddProductModal(false);
  };

  const handleAddStockistSubmit = (e) => {
    e.preventDefault();
    const nextId = `STK-${401 + stockists.length}`;
    const stkObj = {
      ...newStk,
      id: nextId,
      creditLimit: Number(newStk.creditLimit) || 5000000,
      activeOrdersCount: 0,
      fulfillmentRate: 98.0
    };
    setStockists([stkObj, ...stockists]);
    setShowAddStockistModal(false);
  };

  // Filtered lists
  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => {
      const q = search.toLowerCase().trim();
      const matchQ = !q ||
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        d.territory.toLowerCase().includes(q);
      const matchSpecialty = specialtyFilter === 'ALL' || d.specialty === specialtyFilter;
      return matchQ && matchSpecialty;
    });
  }, [doctors, search, specialtyFilter]);

  const filteredChemists = useMemo(() => {
    return chemists.filter(c => {
      const q = search.toLowerCase().trim();
      return !q ||
        c.name.toLowerCase().includes(q) ||
        c.contactPerson.toLowerCase().includes(q) ||
        c.territory.toLowerCase().includes(q) ||
        c.preferredStockist.toLowerCase().includes(q);
    });
  }, [chemists, search]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = search.toLowerCase().trim();
      const matchQ = !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.composition.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'ALL' || p.category === categoryFilter;
      return matchQ && matchCat;
    });
  }, [products, search, categoryFilter]);

  const filteredStockists = useMemo(() => {
    return stockists.filter(s => {
      const q = search.toLowerCase().trim();
      return !q ||
        s.name.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.territoryCoverage.toLowerCase().includes(q);
    });
  }, [stockists, search]);

  // Unique specialties for filter pills
  const doctorSpecialties = useMemo(() => {
    const set = new Set(doctors.map(d => d.specialty));
    return ['ALL', ...Array.from(set)];
  }, [doctors]);

  // Unique product categories for filter pills
  const productCategories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Tab switcher trigger
  const handleOpenAddModal = () => {
    if (activeSubTab === 'doctors') setShowAddDoctorModal(true);
    else if (activeSubTab === 'chemists') setShowAddChemistModal(true);
    else if (activeSubTab === 'products') setShowAddProductModal(true);
    else if (activeSubTab === 'stockists') setShowAddStockistModal(true);
  };

  const getAddButtonLabel = () => {
    if (activeSubTab === 'doctors') return 'Add Doctor';
    if (activeSubTab === 'chemists') return 'Add Chemist';
    if (activeSubTab === 'products') return 'Add Product';
    if (activeSubTab === 'stockists') return 'Add Stockist';
    return 'Add Item';
  };

  return (
    <div style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
      
      {/* Main Container Card */}
      <div
        className="card-section"
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        
        {/* =====================================================================
            1. MODERN SEGMENTED TOGGLE BAR & SEARCH / ACTIONS ROW
            ===================================================================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '18px'
          }}
        >
          
          {/* Segmented Pill Tabs Bar */}
          <div
            className="tabs-bar"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: '#f1f5f9',
              padding: '5px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              overflowX: 'auto',
              maxWidth: '100%'
            }}
          >
            {/* Doctors Tab */}
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'doctors' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('doctors')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 15px',
                borderRadius: '8px',
                border: 'none',
                background: activeSubTab === 'doctors' ? '#0f172a' : 'transparent',
                color: activeSubTab === 'doctors' ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: activeSubTab === 'doctors' ? '700' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: activeSubTab === 'doctors' ? '0 2px 6px rgba(15,23,42,0.2)' : 'none'
              }}
            >
              <Stethoscope size={16} />
              <span>Doctors Directory</span>
              <span
                style={{
                  background: activeSubTab === 'doctors' ? 'rgba(255,255,255,0.22)' : '#e2e8f0',
                  color: activeSubTab === 'doctors' ? '#ffffff' : '#475569',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: '700'
                }}
              >
                {doctors.length}
              </span>
            </button>

            {/* Chemists Tab */}
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'chemists' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('chemists')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 15px',
                borderRadius: '8px',
                border: 'none',
                background: activeSubTab === 'chemists' ? '#0f172a' : 'transparent',
                color: activeSubTab === 'chemists' ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: activeSubTab === 'chemists' ? '700' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: activeSubTab === 'chemists' ? '0 2px 6px rgba(15,23,42,0.2)' : 'none'
              }}
            >
              <Store size={16} />
              <span>Chemists &amp; Retailers</span>
              <span
                style={{
                  background: activeSubTab === 'chemists' ? 'rgba(255,255,255,0.22)' : '#e2e8f0',
                  color: activeSubTab === 'chemists' ? '#ffffff' : '#475569',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: '700'
                }}
              >
                {chemists.length}
              </span>
            </button>

            {/* Products Tab */}
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('products')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 15px',
                borderRadius: '8px',
                border: 'none',
                background: activeSubTab === 'products' ? '#0f172a' : 'transparent',
                color: activeSubTab === 'products' ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: activeSubTab === 'products' ? '700' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: activeSubTab === 'products' ? '0 2px 6px rgba(15,23,42,0.2)' : 'none'
              }}
            >
              <Pill size={16} />
              <span>Product Catalog</span>
              <span
                style={{
                  background: activeSubTab === 'products' ? 'rgba(255,255,255,0.22)' : '#e2e8f0',
                  color: activeSubTab === 'products' ? '#ffffff' : '#475569',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: '700'
                }}
              >
                {products.length}
              </span>
            </button>

            {/* Stockists Tab */}
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'stockists' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('stockists')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 15px',
                borderRadius: '8px',
                border: 'none',
                background: activeSubTab === 'stockists' ? '#0f172a' : 'transparent',
                color: activeSubTab === 'stockists' ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: activeSubTab === 'stockists' ? '700' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: activeSubTab === 'stockists' ? '0 2px 6px rgba(15,23,42,0.2)' : 'none'
              }}
            >
              <Truck size={16} />
              <span>Stockist Network</span>
              <span
                style={{
                  background: activeSubTab === 'stockists' ? 'rgba(255,255,255,0.22)' : '#e2e8f0',
                  color: activeSubTab === 'stockists' ? '#ffffff' : '#475569',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: '700'
                }}
              >
                {stockists.length}
              </span>
            </button>

            {/* Hospitals Tab */}
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'hospitals' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('hospitals')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 15px',
                borderRadius: '8px',
                border: 'none',
                background: activeSubTab === 'hospitals' ? '#0f172a' : 'transparent',
                color: activeSubTab === 'hospitals' ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: activeSubTab === 'hospitals' ? '700' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: activeSubTab === 'hospitals' ? '0 2px 6px rgba(15,23,42,0.2)' : 'none'
              }}
            >
              <Building size={16} />
              <span>Hospitals</span>
              <span
                style={{
                  background: activeSubTab === 'hospitals' ? 'rgba(255,255,255,0.22)' : '#e2e8f0',
                  color: activeSubTab === 'hospitals' ? '#ffffff' : '#475569',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: '700'
                }}
              >
                {INITIAL_ENTERPRISE_DATA.hospitals?.length || 5}
              </span>
            </button>

            {/* Divisions Tab */}
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'divisions' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('divisions')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 15px',
                borderRadius: '8px',
                border: 'none',
                background: activeSubTab === 'divisions' ? '#0f172a' : 'transparent',
                color: activeSubTab === 'divisions' ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: activeSubTab === 'divisions' ? '700' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: activeSubTab === 'divisions' ? '0 2px 6px rgba(15,23,42,0.2)' : 'none'
              }}
            >
              <Tag size={16} />
              <span>Divisions</span>
              <span
                style={{
                  background: activeSubTab === 'divisions' ? 'rgba(255,255,255,0.22)' : '#e2e8f0',
                  color: activeSubTab === 'divisions' ? '#ffffff' : '#475569',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: '700'
                }}
              >
                {INITIAL_ENTERPRISE_DATA.divisions?.length || 4}
              </span>
            </button>

            {/* Competitors Tab */}
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'competitors' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('competitors')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 15px',
                borderRadius: '8px',
                border: 'none',
                background: activeSubTab === 'competitors' ? '#0f172a' : 'transparent',
                color: activeSubTab === 'competitors' ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: activeSubTab === 'competitors' ? '700' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: activeSubTab === 'competitors' ? '0 2px 6px rgba(15,23,42,0.2)' : 'none'
              }}
            >
              <ShieldCheck size={16} />
              <span>Competitors</span>
              <span
                style={{
                  background: activeSubTab === 'competitors' ? 'rgba(255,255,255,0.22)' : '#e2e8f0',
                  color: activeSubTab === 'competitors' ? '#ffffff' : '#475569',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: '700'
                }}
              >
                {INITIAL_ENTERPRISE_DATA.competitors?.length || 4}
              </span>
            </button>
          </div>

          {/* Right Action: Search input & Add button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                style={{
                  paddingLeft: '32px',
                  height: '36px',
                  fontSize: '0.82rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff'
                }}
                placeholder="Search master registries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    padding: '2px'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Dynamic Add Action Button */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenAddModal}
              style={{
                background: '#2563eb',
                borderColor: '#2563eb',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.82rem',
                height: '36px',
                padding: '0 16px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              <span>{getAddButtonLabel()}</span>
            </button>
          </div>

        </div>

        {/* =====================================================================
            2. SECONDARY FILTER PILLS BAR
            ===================================================================== */}
        {activeSubTab === 'doctors' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', marginRight: '4px' }}>
              Specialty Filter:
            </span>
            {doctorSpecialties.map(spec => (
              <button
                key={spec}
                type="button"
                onClick={() => setSpecialtyFilter(spec)}
                style={{
                  padding: '3px 10px',
                  borderRadius: '14px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  border: '1px solid',
                  borderColor: specialtyFilter === spec ? '#0284c7' : '#e2e8f0',
                  background: specialtyFilter === spec ? '#eff6ff' : '#ffffff',
                  color: specialtyFilter === spec ? '#0284c7' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {spec}
              </button>
            ))}
          </div>
        )}

        {activeSubTab === 'products' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', marginRight: '4px' }}>
              Category Filter:
            </span>
            {productCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '3px 10px',
                  borderRadius: '14px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  border: '1px solid',
                  borderColor: categoryFilter === cat ? '#0284c7' : '#e2e8f0',
                  background: categoryFilter === cat ? '#eff6ff' : '#ffffff',
                  color: categoryFilter === cat ? '#0284c7' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* =====================================================================
            3. TAB 1: DOCTORS DIRECTORY TABLE
            ===================================================================== */}
        {activeSubTab === 'doctors' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Doctor Name</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Specialty &amp; Degree</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Hospital / Clinic Affiliation</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Class &amp; Potential</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Monthly Target Visits</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Prescribing Focus</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Contact</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                      No doctor records match criteria. Try clearing search or specialty filter.
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map((doc) => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.84rem' }}>{doc.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '600' }}>{doc.id} • {doc.territory}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#1e293b' }}>{doc.specialty}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{doc.qualification}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#334155' }}>
                        {doc.hospital}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            backgroundColor: doc.class === 'A+' ? '#fef3c7' : (doc.class === 'A' ? '#eff6ff' : '#f1f5f9'),
                            color: doc.class === 'A+' ? '#b45309' : (doc.class === 'A' ? '#2563eb' : '#475569'),
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Star size={11} /> Class {doc.class} ({doc.potential})
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#0f172a' }}>
                          {doc.completedVisitsThisMonth || 0} / {doc.monthlyTargetVisits} Visits Done
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{doc.timing}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {(doc.keyPrescribingProducts || []).map((p, i) => (
                            <span key={i} style={{ background: '#f1f5f9', padding: '2px 7px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '600', color: '#334155' }}>
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#475569', whiteSpace: 'nowrap' }}>
                        {doc.phone}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setInspectItem({ type: 'doctor', data: doc })}
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                        >
                          View 360°
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* =====================================================================
            4. TAB 2: CHEMISTS & RETAILERS TABLE
            ===================================================================== */}
        {activeSubTab === 'chemists' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Pharmacy / Chemist Name</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Key Contact</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Territory &amp; Address</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Assigned Stockist</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Credit Limit &amp; Due</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Attached Key Doctors</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredChemists.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                      No chemist records match criteria.
                    </td>
                  </tr>
                ) : (
                  filteredChemists.map((chm) => (
                    <tr key={chm.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.84rem', color: '#0f172a' }}>{chm.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: '600' }}>ID: {chm.id}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.82rem' }}>{chm.contactPerson}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{chm.phone}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.8rem' }}>{chm.territory}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', maxWidth: '240px' }}>{chm.address}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontWeight: '700', color: '#2563eb', fontSize: '0.82rem' }}>{chm.preferredStockist}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#0f172a' }}>₹{chm.creditLimit?.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: '600' }}>Due: ₹{chm.outstandingDue?.toLocaleString('en-IN')}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {(chm.attachedDoctors || []).map((doc, idx) => (
                            <span key={idx} style={{ background: '#f1f5f9', padding: '2px 7px', borderRadius: '4px', fontSize: '0.72rem', color: '#334155' }}>
                              {doc}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setInspectItem({ type: 'chemist', data: chm })}
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                        >
                          View 360°
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* =====================================================================
            5. TAB 3: PRODUCT CATALOG TABLE
            ===================================================================== */}
        {activeSubTab === 'products' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Brand Name</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Composition &amp; Indication</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Therapeutic Category</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>MRP (₹)</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>PTR (Retailer)</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>PTS (Stockist)</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Sample Stock</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', textAlign: 'center' }}>Visual Detailing</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                      No products match criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.84rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: '600' }}>{p.packing} • GST: {p.gstPercent || 12}%</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.8rem', color: '#1e293b' }}>{p.composition}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.indication}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ background: '#f0fdfa', color: '#0d9488', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '800' }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', fontSize: '0.82rem' }}>₹{p.mrp?.toFixed(2)}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#2563eb', fontSize: '0.82rem' }}>₹{p.ptr?.toFixed(2)}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#059669', fontSize: '0.82rem' }}>₹{p.pts?.toFixed(2)}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.78rem', color: p.sampleStock < 20 ? '#e11d48' : '#0f172a' }}>
                          {p.sampleStock} Units
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setPreviewProduct(p)}
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                        >
                          <Eye size={12} /> Visual Aid
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* =====================================================================
            6. TAB 4: STOCKIST NETWORK TABLE
            ===================================================================== */}
        {activeSubTab === 'stockists' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Stockist Name</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Contact Person &amp; Phone</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Territory Coverage</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Credit Policy</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Credit Limit</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Active Deliveries</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStockists.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                      No stockist records match criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStockists.map((stk) => (
                    <tr key={stk.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.84rem', color: '#0f172a' }}>{stk.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', maxWidth: '240px' }}>{stk.address}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.82rem' }}>{stk.contactPerson}</div>
                        <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '600' }}>{stk.phone}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#334155' }}>
                        {stk.territoryCoverage}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: '700', color: '#334155' }}>
                          {stk.creditTerms}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', fontSize: '0.82rem' }}>
                        ₹{stk.creditLimit?.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="status-badge badge-pending" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                          {stk.activeOrdersCount} Pending Deliveries
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setInspectItem({ type: 'stockist', data: stk })}
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                        >
                          View 360°
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* =====================================================================
            7. TAB 5: HOSPITALS TABLE
            ===================================================================== */}
        {activeSubTab === 'hospitals' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Hospital / Institution Name</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Facility Type</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Territory &amp; Address</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Key Clinical Specialties</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Attached HCPs</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Partnership Tier</th>
                </tr>
              </thead>
              <tbody>
                {(INITIAL_ENTERPRISE_DATA.hospitals || []).map((h) => (
                  <tr key={h.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.84rem' }}>{h.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#2563eb' }}>Bed Capacity: {h.beds} Beds</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#475569' }}>{h.type}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#334155' }}>
                      <div style={{ fontWeight: '600' }}>📍 {h.territory}</div>
                      <div style={{ color: '#64748b' }}>{h.address}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {(h.keyDepartments || []).map((dept, i) => (
                          <span key={i} style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 7px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '600' }}>
                            {dept}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a', fontSize: '0.82rem' }}>
                      {h.attachedDoctorsCount} Practicing Doctors
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800' }}>
                        ★ {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* =====================================================================
            8. TAB 6: PRODUCT DIVISIONS TABLE
            ===================================================================== */}
        {activeSubTab === 'divisions' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Division Code &amp; Name</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Division Medical Lead</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Active Brand Portfolio</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Monthly Target Quota</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(INITIAL_ENTERPRISE_DATA.divisions || []).map((div) => (
                  <tr key={div.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                      {div.name} <span style={{ color: '#2563eb', fontSize: '0.74rem' }}>({div.id})</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>👨‍⚕️ {div.head}</td>
                    <td style={{ padding: '12px 14px', color: '#2563eb', fontWeight: '600' }}>{div.productsCount} Formulations</td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>{div.targetMonthly}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: '#16a34a', fontWeight: '800', fontSize: '0.78rem' }}>● {div.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* =====================================================================
            9. TAB 7: COMPETITORS TABLE
            ===================================================================== */}
        {activeSubTab === 'competitors' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Competitor Brand Name</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Pharma Manufacturer</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Active Molecule Composition</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>MRP Price (₹)</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Market Share</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Strategic Competitive Notes</th>
                </tr>
              </thead>
              <tbody>
                {(INITIAL_ENTERPRISE_DATA.competitors || []).map((comp) => (
                  <tr key={comp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>{comp.brand}</td>
                    <td style={{ padding: '12px 14px', color: '#2563eb', fontWeight: '600' }}>{comp.company}</td>
                    <td style={{ padding: '12px 14px', color: '#334155', fontSize: '0.8rem' }}>{comp.competitorProduct}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '700' }}>₹{comp.priceMrp}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: '800' }}>
                        {comp.marketSharePct}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#475569' }}>{comp.keyStrength}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* =====================================================================
          MODAL: DIGITAL VISUAL AID PREVIEW
          ===================================================================== */}
      {previewProduct && (
        <div className="modal-overlay" onClick={() => setPreviewProduct(null)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                  Digital Visual Aid: {previewProduct.name}
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{previewProduct.division}</span>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setPreviewProduct(null)}>&times;</button>
            </div>
            
            <img
              src={previewProduct.visualAidUrl}
              alt={previewProduct.name}
              style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '10px', marginBottom: '14px' }}
            />
            
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Composition:</strong> {previewProduct.composition}</div>
              <div><strong>Indications:</strong> {previewProduct.indication}</div>
              <div style={{ color: '#2563eb', fontWeight: '700', marginTop: '4px' }}>
                Key Detailing Points: Superior bioavailability, once-daily dosage, patient compliance profile.
              </div>
            </div>

            <div className="modal-actions-bar" style={{ marginTop: '14px' }}>
              <button type="button" className="cancel-btn" onClick={() => setPreviewProduct(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: INSPECT ITEM 360 PROFILE
          ===================================================================== */}
      {inspectItem && (
        <div className="modal-overlay" onClick={() => setInspectItem(null)}>
          <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
                  {inspectItem.data.name}
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {inspectItem.data.id} • {inspectItem.type.toUpperCase()}
                </span>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setInspectItem(null)}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '14px 0', fontSize: '0.8rem' }}>
              {inspectItem.type === 'doctor' && (
                <>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                    <div><strong>Specialty:</strong> {inspectItem.data.specialty} ({inspectItem.data.qualification})</div>
                    <div style={{ marginTop: '4px' }}><strong>Hospital / Affiliation:</strong> {inspectItem.data.hospital}</div>
                    <div style={{ marginTop: '4px' }}><strong>Territory:</strong> {inspectItem.data.territory}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: '700' }}>POTENTIAL & CLASS</span>
                      <div style={{ fontWeight: '800', color: '#1d4ed8' }}>Class {inspectItem.data.class}</div>
                      <div style={{ fontSize: '0.72rem', color: '#2563eb' }}>{inspectItem.data.potential}</div>
                    </div>
                    <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: '700' }}>MONTHLY TARGET VISITS</span>
                      <div style={{ fontWeight: '800', color: '#15803d' }}>{inspectItem.data.completedVisitsThisMonth || 0} / {inspectItem.data.monthlyTargetVisits} Visits</div>
                      <div style={{ fontSize: '0.72rem', color: '#16a34a' }}>Timing: {inspectItem.data.timing}</div>
                    </div>
                  </div>
                  <div>
                    <strong>Key Prescribing Portfolio:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                      {(inspectItem.data.keyPrescribingProducts || []).map((p, i) => (
                        <span key={i} style={{ background: '#e2e8f0', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem' }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  <div><strong>Phone:</strong> {inspectItem.data.phone} • <strong>Email:</strong> {inspectItem.data.email || 'N/A'}</div>
                </>
              )}

              {inspectItem.type === 'chemist' && (
                <>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                    <div><strong>Key Contact Person:</strong> {inspectItem.data.contactPerson}</div>
                    <div style={{ marginTop: '4px' }}><strong>Territory:</strong> {inspectItem.data.territory}</div>
                    <div style={{ marginTop: '4px' }}><strong>Physical Address:</strong> {inspectItem.data.address}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: '700' }}>PREFERRED STOCKIST</span>
                      <div style={{ fontWeight: '800', color: '#1d4ed8' }}>{inspectItem.data.preferredStockist}</div>
                    </div>
                    <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: '700' }}>FINANCIAL STATUS</span>
                      <div style={{ fontWeight: '800', color: '#dc2626' }}>Due: ₹{inspectItem.data.outstandingDue?.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Limit: ₹{inspectItem.data.creditLimit?.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  <div><strong>Drug License (DL):</strong> <code>{inspectItem.data.dlNumber}</code></div>
                  <div><strong>GSTIN:</strong> <code>{inspectItem.data.gstNumber}</code></div>
                </>
              )}

              {inspectItem.type === 'stockist' && (
                <>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                    <div><strong>Primary Contact:</strong> {inspectItem.data.contactPerson} ({inspectItem.data.phone})</div>
                    <div style={{ marginTop: '4px' }}><strong>Coverage:</strong> {inspectItem.data.territoryCoverage}</div>
                    <div style={{ marginTop: '4px' }}><strong>Logistics Hub:</strong> {inspectItem.data.address}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: '700' }}>CREDIT POLICY</span>
                      <div style={{ fontWeight: '800', color: '#1d4ed8' }}>{inspectItem.data.creditTerms}</div>
                    </div>
                    <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: '700' }}>FULFILLMENT RATE</span>
                      <div style={{ fontWeight: '800', color: '#15803d' }}>{inspectItem.data.fulfillmentRate}% On-Time</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="modal-actions-bar">
              <button type="button" className="cancel-btn" onClick={() => setInspectItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD DOCTOR
          ===================================================================== */}
      {showAddDoctorModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>Add Master Doctor Profile</h3>
              <button type="button" className="close-modal-btn" onClick={() => setShowAddDoctorModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleAddDoctorSubmit} style={{ marginTop: '14px' }}>
              <div className="form-group">
                <label>Doctor Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Specialty *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={newDoc.specialty}
                    onChange={(e) => setNewDoc({ ...newDoc, specialty: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Qualification</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newDoc.qualification}
                    onChange={(e) => setNewDoc({ ...newDoc, qualification: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Hospital / Clinic Name &amp; Location *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Max Hospital, Saket"
                  value={newDoc.hospital}
                  onChange={(e) => setNewDoc({ ...newDoc, hospital: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Doctor Class</label>
                  <select
                    className="form-control"
                    value={newDoc.class}
                    onChange={(e) => setNewDoc({ ...newDoc, class: e.target.value })}
                  >
                    <option value="A+">Class A+ (Very High Rx / 150+ Rx)</option>
                    <option value="A">Class A (High Rx / 100+ Rx)</option>
                    <option value="B">Class B (Medium Rx / 50+ Rx)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Monthly Target Visits</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newDoc.monthlyTargetVisits}
                    onChange={(e) => setNewDoc({ ...newDoc, monthlyTargetVisits: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Key Prescribing Focus (Comma Separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="CardioShield 50mg, NeuroCalm Plus"
                  value={newDoc.keyPrescribingProducts}
                  onChange={(e) => setNewDoc({ ...newDoc, keyPrescribingProducts: e.target.value })}
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setShowAddDoctorModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb' }}>
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD CHEMIST
          ===================================================================== */}
      {showAddChemistModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>Add Chemist &amp; Retailer</h3>
              <button type="button" className="close-modal-btn" onClick={() => setShowAddChemistModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleAddChemistSubmit} style={{ marginTop: '14px' }}>
              <div className="form-group">
                <label>Pharmacy / Store Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Apollo Pharmacy Saket"
                  value={newChem.name}
                  onChange={(e) => setNewChem({ ...newChem, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Contact Person *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={newChem.contactPerson}
                    onChange={(e) => setNewChem({ ...newChem, contactPerson: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newChem.phone}
                    onChange={(e) => setNewChem({ ...newChem, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Physical Address &amp; Territory *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="Shop number, market, territory..."
                  value={newChem.address}
                  onChange={(e) => setNewChem({ ...newChem, address: e.target.value, territory: e.target.value.split(',')[0] || 'South Delhi' })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Assigned Stockist</label>
                  <select
                    className="form-control"
                    value={newChem.preferredStockist}
                    onChange={(e) => setNewChem({ ...newChem, preferredStockist: e.target.value })}
                  >
                    {stockists.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Credit Limit (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newChem.creditLimit}
                    onChange={(e) => setNewChem({ ...newChem, creditLimit: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setShowAddChemistModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb' }}>
                  Save Chemist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD PRODUCT
          ===================================================================== */}
      {showAddProductModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>Add Pharmaceutical Product</h3>
              <button type="button" className="close-modal-btn" onClick={() => setShowAddProductModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleAddProductSubmit} style={{ marginTop: '14px' }}>
              <div className="form-group">
                <label>Brand Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. CardioShield 50mg"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Salt Composition *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Telmisartan 40mg + Amlodipine 5mg"
                  value={newProd.composition}
                  onChange={(e) => setNewProd({ ...newProd, composition: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Diabetology">Diabetology</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Packaging</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProd.packing}
                    onChange={(e) => setNewProd({ ...newProd, packing: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div className="form-group">
                  <label>MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={newProd.mrp}
                    onChange={(e) => setNewProd({ ...newProd, mrp: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>PTR (Retailer)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={newProd.ptr}
                    onChange={(e) => setNewProd({ ...newProd, ptr: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>PTS (Stockist)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={newProd.pts}
                    onChange={(e) => setNewProd({ ...newProd, pts: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setShowAddProductModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb' }}>
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD STOCKIST
          ===================================================================== */}
      {showAddStockistModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>Add Wholesale Stockist</h3>
              <button type="button" className="close-modal-btn" onClick={() => setShowAddStockistModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleAddStockistSubmit} style={{ marginTop: '14px' }}>
              <div className="form-group">
                <label>Stockist Company Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. MedLife Distributors Ltd."
                  value={newStk.name}
                  onChange={(e) => setNewStk({ ...newStk, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Contact Person *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={newStk.contactPerson}
                    onChange={(e) => setNewStk({ ...newStk, contactPerson: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={newStk.phone}
                    onChange={(e) => setNewStk({ ...newStk, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Territory Coverage *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. South Delhi, Faridabad Corridor"
                  value={newStk.territoryCoverage}
                  onChange={(e) => setNewStk({ ...newStk, territoryCoverage: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Credit Terms</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newStk.creditTerms}
                    onChange={(e) => setNewStk({ ...newStk, creditTerms: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Credit Limit (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newStk.creditLimit}
                    onChange={(e) => setNewStk({ ...newStk, creditLimit: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="cancel-btn" onClick={() => setShowAddStockistModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb' }}>
                  Save Stockist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
