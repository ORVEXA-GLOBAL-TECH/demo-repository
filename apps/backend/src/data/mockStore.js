// Seed data for Alleviare SFA System

export const users = [
  {
    id: 'usr-001',
    name: 'Dr. Rajesh Sharma',
    email: 'admin@alleviare.com',
    role: 'ADMIN',
    designation: 'National Sales Director',
    territory: 'Headquarters',
    phone: '+91 9876543210'
  },
  {
    id: 'usr-002',
    name: 'Priya Mukherjee',
    email: 'manager@alleviare.com',
    role: 'MANAGER',
    designation: 'Regional Sales Manager (North)',
    territory: 'Delhi NCR & North Zone',
    phone: '+91 9876543211'
  },
  {
    id: 'usr-003',
    name: 'Amit Verma',
    email: 'mr@alleviare.com',
    role: 'MR',
    designation: 'Medical Representative (Cardio & Diabetes)',
    territory: 'South Delhi & Noida',
    phone: '+91 9876543212'
  }
];

export const doctors = [
  {
    id: 'doc-101',
    name: 'Dr. Arvind Mehra',
    specialty: 'Cardiologist',
    qualification: 'MD, DM (Cardiology)',
    hospital: 'Max Super Speciality Hospital, Saket',
    territory: 'South Delhi',
    class: 'A+',
    potential: 'High',
    visitingDays: ['Mon', 'Wed', 'Fri'],
    timing: '10:00 AM - 01:00 PM',
    phone: '+91 9811122334',
    address: 'Saket, New Delhi'
  },
  {
    id: 'doc-102',
    name: 'Dr. Sunita Rao',
    specialty: 'Endocrinologist / Diabetologist',
    qualification: 'MD (Med), DNB (Endo)',
    hospital: 'Fortis Escorts Heart Institute',
    territory: 'South Delhi',
    class: 'A',
    potential: 'High',
    visitingDays: ['Tue', 'Thu', 'Sat'],
    timing: '02:00 PM - 05:00 PM',
    phone: '+91 9822233445',
    address: 'Okhla Road, New Delhi'
  },
  {
    id: 'doc-103',
    name: 'Dr. Vikram Sethi',
    specialty: 'Oncologist',
    qualification: 'MS, MCh (Surgical Oncology)',
    hospital: 'Apollo Cancer Centre',
    territory: 'Noida',
    class: 'A+',
    potential: 'High',
    visitingDays: ['Mon', 'Thu'],
    timing: '11:00 AM - 02:00 PM',
    phone: '+91 9833344556',
    address: 'Sector 26, Noida'
  },
  {
    id: 'doc-104',
    name: 'Dr. Kavita Bansal',
    specialty: 'General Physician',
    qualification: 'MBBS, MD',
    hospital: 'Bansal Clinic & Diagnostic Care',
    territory: 'Noida',
    class: 'B',
    potential: 'Medium',
    visitingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timing: '09:00 AM - 01:00 PM',
    phone: '+91 9844455667',
    address: 'Sector 62, Noida'
  }
];

export const chemists = [
  {
    id: 'chm-201',
    name: 'Apollo Medplus Pharmacy',
    contactPerson: 'Ramesh Gupta',
    territory: 'South Delhi',
    address: 'Saket Community Center, New Delhi',
    phone: '+91 9711100001',
    attachedDoctors: ['Dr. Arvind Mehra', 'Dr. Sunita Rao'],
    preferredStockist: 'MedLife Distributors Ltd.'
  },
  {
    id: 'chm-202',
    name: 'Wellness Forever Chemists',
    contactPerson: 'Sunil Kumar',
    territory: 'Noida',
    address: 'Atta Market, Sector 18, Noida',
    phone: '+91 9722200002',
    attachedDoctors: ['Dr. Vikram Sethi', 'Dr. Kavita Bansal'],
    preferredStockist: 'Metro Pharma Wholesale'
  },
  {
    id: 'chm-203',
    name: 'City Care Medicos',
    contactPerson: 'Ajay Singhal',
    territory: 'South Delhi',
    address: 'Green Park Market, New Delhi',
    phone: '+91 9733300003',
    attachedDoctors: ['Dr. Arvind Mehra'],
    preferredStockist: 'MedLife Distributors Ltd.'
  }
];

export const products = [
  {
    id: 'prd-301',
    name: 'CardioShield 50mg',
    composition: 'Metoprolol Succinate 50mg',
    category: 'Cardiology',
    packing: '10x10 Tablets',
    mrp: 145.00,
    ptr: 108.75, // Price to Retailer
    pts: 98.60,  // Price to Stockist
    sampleStock: 85,
    indication: 'Hypertension & Angina Pectoris'
  },
  {
    id: 'prd-302',
    name: 'GlucoMet Forte 500/5',
    composition: 'Metformin 500mg + Glimepiride 5mg',
    category: 'Diabetology',
    packing: '10x15 Tablets',
    mrp: 180.00,
    ptr: 135.00,
    pts: 122.40,
    sampleStock: 120,
    indication: 'Type 2 Diabetes Mellitus'
  },
  {
    id: 'prd-303',
    name: 'AllevOnco 100mg Injection',
    composition: 'Paclitaxel 100mg/16.7mL',
    category: 'Oncology',
    packing: 'Single Vial',
    mrp: 3200.00,
    ptr: 2400.00,
    pts: 2160.00,
    sampleStock: 15,
    indication: 'Solid Tumor Chemotherapy'
  },
  {
    id: 'prd-304',
    name: 'NeuroCalm Plus',
    composition: 'Pregabalin 75mg + Methylcobalamin 750mcg',
    category: 'Neurology',
    packing: '10x10 Capsules',
    mrp: 210.00,
    ptr: 157.50,
    pts: 142.80,
    sampleStock: 60,
    indication: 'Neuropathic Pain & Peripheral Neuropathy'
  },
  {
    id: 'prd-305',
    name: 'ImmunoZest Syrup',
    composition: 'Zinc, Vitamin C, Vitamin D3 & Elderberry Extract',
    category: 'Wellness',
    packing: '200ml Bottle',
    mrp: 165.00,
    ptr: 123.75,
    pts: 112.20,
    sampleStock: 45,
    indication: 'Immunity & Nutritional Support'
  }
];

export const dcrReports = [
  {
    id: 'dcr-501',
    mrId: 'usr-003',
    mrName: 'Amit Verma',
    date: '2026-09-17',
    targetType: 'DOCTOR',
    targetId: 'doc-101',
    targetName: 'Dr. Arvind Mehra',
    specialty: 'Cardiologist',
    hospital: 'Max Super Speciality Hospital, Saket',
    visitTime: '10:45 AM',
    productsDetailed: ['CardioShield 50mg', 'NeuroCalm Plus'],
    samplesGiven: [
      { product: 'CardioShield 50mg', qty: 2 },
      { product: 'NeuroCalm Plus', qty: 1 }
    ],
    inputsGiven: ['Cardio Visual Aid Pamphlet', 'Desk Pen Stand'],
    feedback: 'Very receptive to CardioShield study results. Promised 15 prescriptions/month.',
    pobGenerated: true,
    pobAmount: 18500,
    geoLat: 28.5284,
    geoLng: 77.2185,
    status: 'SUBMITTED'
  },
  {
    id: 'dcr-502',
    mrId: 'usr-003',
    mrName: 'Amit Verma',
    date: '2026-09-17',
    targetType: 'CHEMIST',
    targetId: 'chm-201',
    targetName: 'Apollo Medplus Pharmacy',
    contactPerson: 'Ramesh Gupta',
    visitTime: '12:15 PM',
    productsDetailed: ['CardioShield 50mg', 'GlucoMet Forte 500/5'],
    samplesGiven: [],
    inputsGiven: ['Chemist Shelf Banner'],
    feedback: 'Stock running low on GlucoMet Forte. Placed fresh order.',
    pobGenerated: true,
    pobAmount: 12400,
    geoLat: 28.5245,
    geoLng: 77.2140,
    status: 'SUBMITTED'
  },
  {
    id: 'dcr-503',
    mrId: 'usr-003',
    mrName: 'Amit Verma',
    date: '2026-09-16',
    targetType: 'DOCTOR',
    targetId: 'doc-102',
    targetName: 'Dr. Sunita Rao',
    specialty: 'Endocrinologist / Diabetologist',
    hospital: 'Fortis Escorts Heart Institute',
    visitTime: '02:30 PM',
    productsDetailed: ['GlucoMet Forte 500/5'],
    samplesGiven: [{ product: 'GlucoMet Forte 500/5', qty: 3 }],
    inputsGiven: ['HbA1c Patient Tracking Diary'],
    feedback: 'Discussed new dosing regimen for elderly patients.',
    pobGenerated: false,
    pobAmount: 0,
    geoLat: 28.5601,
    geoLng: 77.2831,
    status: 'APPROVED'
  }
];

export const orders = [
  {
    id: 'ord-801',
    orderNumber: 'ALV-2026-0901',
    mrId: 'usr-003',
    mrName: 'Amit Verma',
    chemistId: 'chm-201',
    chemistName: 'Apollo Medplus Pharmacy',
    stockistName: 'MedLife Distributors Ltd.',
    territory: 'South Delhi',
    orderDate: '2026-09-17',
    items: [
      { productId: 'prd-301', productName: 'CardioShield 50mg', qty: 100, ptr: 108.75, amount: 10875.00 },
      { productId: 'prd-302', productName: 'GlucoMet Forte 500/5', qty: 50, ptr: 135.00, amount: 6750.00 }
    ],
    totalAmount: 17625.00,
    discountPercent: 5,
    netAmount: 16743.75,
    paymentTerms: '30 Days Credit',
    status: 'PENDING_APPROVAL',
    remarks: 'Urgent stock requirement for Max hospital prescription flows.'
  },
  {
    id: 'ord-802',
    orderNumber: 'ALV-2026-0902',
    mrId: 'usr-003',
    mrName: 'Amit Verma',
    chemistId: 'chm-202',
    chemistName: 'Wellness Forever Chemists',
    stockistName: 'Metro Pharma Wholesale',
    territory: 'Noida',
    orderDate: '2026-09-15',
    items: [
      { productId: 'prd-303', productName: 'AllevOnco 100mg Injection', qty: 10, ptr: 2400.00, amount: 24000.00 },
      { productId: 'prd-304', productName: 'NeuroCalm Plus', qty: 40, ptr: 157.50, amount: 6300.00 }
    ],
    totalAmount: 30300.00,
    discountPercent: 3,
    netAmount: 29391.00,
    paymentTerms: 'Advance Cheque',
    status: 'APPROVED',
    remarks: 'Special oncology order approved by Regional Manager.'
  }
];

export const expenses = [
  {
    id: 'exp-701',
    mrId: 'usr-003',
    mrName: 'Amit Verma',
    date: '2026-09-17',
    claimType: 'DAILY_FIELD_ALLOWANCE',
    travelKm: 42,
    fareRatePerKm: 4.5,
    travelAllowance: 189.00,
    dailyAllowance: 350.00,
    hotelCharges: 0.00,
    miscellaneousCharges: 120.00,
    miscDescription: 'Doctor clinic parking & toll plaza receipts',
    totalClaimAmount: 659.00,
    receiptUrls: ['https://placehold.co/400x300/png?text=Toll+Receipt'],
    status: 'SUBMITTED',
    managerRemarks: ''
  },
  {
    id: 'exp-702',
    mrId: 'usr-003',
    mrName: 'Amit Verma',
    date: '2026-09-16',
    claimType: 'DAILY_FIELD_ALLOWANCE',
    travelKm: 38,
    fareRatePerKm: 4.5,
    travelAllowance: 171.00,
    dailyAllowance: 350.00,
    hotelCharges: 0.00,
    miscellaneousCharges: 80.00,
    miscDescription: 'Hospital parking charges',
    totalClaimAmount: 601.00,
    receiptUrls: [],
    status: 'APPROVED',
    managerRemarks: 'Verified against DCR doctor call locations.'
  }
];

export const tourPlans = [
  {
    id: 'tp-901',
    mrId: 'usr-003',
    month: 'September 2026',
    date: '2026-09-18',
    dayOfWeek: 'Friday',
    territory: 'South Delhi (Saket & Hauz Khas)',
    activityType: 'Field Doctor Visits',
    plannedDoctors: ['Dr. Arvind Mehra', 'Dr. Sunita Rao'],
    plannedChemists: ['Apollo Medplus Pharmacy', 'City Care Medicos'],
    objectives: 'Promote CardioShield new pack; review chemist stocking',
    status: 'PLANNED'
  },
  {
    id: 'tp-902',
    mrId: 'usr-003',
    month: 'September 2026',
    date: '2026-09-19',
    dayOfWeek: 'Saturday',
    territory: 'Noida (Sector 18 & 26)',
    activityType: 'Oncology Specialist Visits',
    plannedDoctors: ['Dr. Vikram Sethi'],
    plannedChemists: ['Wellness Forever Chemists'],
    objectives: 'Hospital formulary review for AllevOnco',
    status: 'PLANNED'
  }
];
