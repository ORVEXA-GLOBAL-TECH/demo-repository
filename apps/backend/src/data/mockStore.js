// MNC-Grade Enterprise Seed Data for Alleviare SFA System

export const users = [
  {
    id: 'usr-001',
    name: 'Dr. Rajesh Sharma',
    email: 'admin@alleviare.com',
    role: 'ADMIN',
    designation: 'National Sales Director',
    territory: 'All Zones (National HQ)',
    phone: '+91 9876543210',
    avatar: 'RS'
  },
  {
    id: 'usr-002',
    name: 'Priya Mukherjee',
    email: 'rsm@alleviare.com',
    role: 'RSM',
    designation: 'Regional Sales Manager (North Zone)',
    territory: 'Delhi NCR, Punjab & UP West',
    phone: '+91 9876543211',
    avatar: 'PM'
  },
  {
    id: 'usr-003',
    name: 'Suresh Raina',
    email: 'asm@alleviare.com',
    role: 'ASM',
    designation: 'Area Sales Manager (Delhi NCR)',
    territory: 'South Delhi & Noida',
    phone: '+91 9876543212',
    avatar: 'SR'
  },
  {
    id: 'usr-004',
    name: 'Amit Verma',
    email: 'mr@alleviare.com',
    role: 'MR',
    designation: 'Senior Medical Representative (Cardio & Diabetes)',
    territory: 'South Delhi (Saket & Hauz Khas)',
    phone: '+91 9876543213',
    avatar: 'AV'
  }
];

export const doctors = [
  {
    id: 'doc-101',
    name: 'Dr. Arvind Mehra',
    specialty: 'Cardiologist',
    qualification: 'MD, DM (Cardiology), FACC',
    hospital: 'Max Super Speciality Hospital, Saket',
    territory: 'South Delhi',
    class: 'A+',
    potential: 'Very High (150+ Rx/mo)',
    monthlyTargetVisits: 3,
    completedVisitsThisMonth: 3,
    visitingDays: ['Mon', 'Wed', 'Fri'],
    timing: '10:00 AM - 01:00 PM',
    phone: '+91 9811122334',
    address: 'Press Enclave Road, Saket, New Delhi',
    geoLat: 28.5284,
    geoLng: 77.2185,
    keyPrescribingProducts: ['CardioShield 50mg', 'NeuroCalm Plus']
  },
  {
    id: 'doc-102',
    name: 'Dr. Sunita Rao',
    specialty: 'Endocrinologist / Diabetologist',
    qualification: 'MD (Med), DNB (Endo)',
    hospital: 'Fortis Escorts Heart Institute',
    territory: 'South Delhi',
    class: 'A',
    potential: 'High (100+ Rx/mo)',
    monthlyTargetVisits: 2,
    completedVisitsThisMonth: 2,
    visitingDays: ['Tue', 'Thu', 'Sat'],
    timing: '02:00 PM - 05:00 PM',
    phone: '+91 9822233445',
    address: 'Okhla Road, New Delhi',
    geoLat: 28.5601,
    geoLng: 77.2831,
    keyPrescribingProducts: ['GlucoMet Forte 500/5']
  },
  {
    id: 'doc-103',
    name: 'Dr. Vikram Sethi',
    specialty: 'Oncologist',
    qualification: 'MS, MCh (Surgical Oncology)',
    hospital: 'Apollo Cancer Centre',
    territory: 'Noida',
    class: 'A+',
    potential: 'Very High (High Value)',
    monthlyTargetVisits: 2,
    completedVisitsThisMonth: 1,
    visitingDays: ['Mon', 'Thu'],
    timing: '11:00 AM - 02:00 PM',
    phone: '+91 9833344556',
    address: 'Sector 26, Noida',
    geoLat: 28.5833,
    geoLng: 77.3333,
    keyPrescribingProducts: ['AllevOnco 100mg Injection']
  },
  {
    id: 'doc-104',
    name: 'Dr. Kavita Bansal',
    specialty: 'General Physician & Diab Care',
    qualification: 'MBBS, MD',
    hospital: 'Bansal Clinic & Diagnostic Care',
    territory: 'Noida',
    class: 'B',
    potential: 'Medium (50+ Rx/mo)',
    monthlyTargetVisits: 1,
    completedVisitsThisMonth: 1,
    visitingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timing: '09:00 AM - 01:00 PM',
    phone: '+91 9844455667',
    address: 'Sector 62, Noida',
    geoLat: 28.6258,
    geoLng: 77.3648,
    keyPrescribingProducts: ['GlucoMet Forte 500/5', 'ImmunoZest Syrup']
  },
  {
    id: 'doc-105',
    name: 'Dr. Pradeep Oberoi',
    specialty: 'Neurologist',
    qualification: 'MD, DM (Neurology)',
    hospital: 'Medanta Super Speciality Clinic',
    territory: 'South Delhi',
    class: 'A',
    potential: 'High (80+ Rx/mo)',
    monthlyTargetVisits: 2,
    completedVisitsThisMonth: 1,
    visitingDays: ['Tue', 'Fri'],
    timing: '04:00 PM - 07:00 PM',
    phone: '+91 9855566778',
    address: 'Greater Kailash 1, New Delhi',
    geoLat: 28.5529,
    geoLng: 77.2344,
    keyPrescribingProducts: ['NeuroCalm Plus']
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
    preferredStockist: 'MedLife Distributors Ltd.',
    creditLimit: 250000,
    outstandingDue: 42000
  },
  {
    id: 'chm-202',
    name: 'Wellness Forever Chemists',
    contactPerson: 'Sunil Kumar',
    territory: 'Noida',
    address: 'Atta Market, Sector 18, Noida',
    phone: '+91 9722200002',
    attachedDoctors: ['Dr. Vikram Sethi', 'Dr. Kavita Bansal'],
    preferredStockist: 'Metro Pharma Wholesale',
    creditLimit: 300000,
    outstandingDue: 18500
  },
  {
    id: 'chm-203',
    name: 'City Care Medicos',
    contactPerson: 'Ajay Singhal',
    territory: 'South Delhi',
    address: 'Green Park Market, New Delhi',
    phone: '+91 9733300003',
    attachedDoctors: ['Dr. Arvind Mehra', 'Dr. Pradeep Oberoi'],
    preferredStockist: 'MedLife Distributors Ltd.',
    creditLimit: 200000,
    outstandingDue: 65000
  },
  {
    id: 'chm-204',
    name: 'Fortis Hospital In-House Pharmacy',
    contactPerson: 'Deepak Sharma',
    territory: 'South Delhi',
    address: 'Fortis Escorts, Okhla, New Delhi',
    phone: '+91 9744400004',
    attachedDoctors: ['Dr. Sunita Rao'],
    preferredStockist: 'MedLife Distributors Ltd.',
    creditLimit: 800000,
    outstandingDue: 120000
  }
];

export const stockists = [
  {
    id: 'stk-401',
    name: 'MedLife Distributors Ltd.',
    contactPerson: 'Harish Bajaj',
    phone: '+91 9811099887',
    address: 'Okhla Industrial Area Phase 2, New Delhi',
    territoryCoverage: 'South Delhi, Central Delhi, Faridabad',
    creditTerms: '30 Days Credit',
    creditLimit: 2500000,
    activeOrdersCount: 8
  },
  {
    id: 'stk-402',
    name: 'Metro Pharma Wholesale',
    contactPerson: 'Rajiv Chawla',
    phone: '+91 9822099888',
    address: 'Sector 6, Noida, UP',
    territoryCoverage: 'Noida, Greater Noida, Ghaziabad',
    creditTerms: '21 Days Credit',
    creditLimit: 2000000,
    activeOrdersCount: 5
  }
];

export const products = [
  {
    id: 'prd-301',
    name: 'CardioShield 50mg',
    composition: 'Metoprolol Succinate 50mg Extended Release',
    category: 'Cardiology',
    packing: '10x10 Tablets',
    mrp: 145.00,
    ptr: 108.75,
    pts: 98.60,
    gstPercent: 12,
    sampleStock: 85,
    visualAidUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
    indication: 'Hypertension, Post-MI, & Angina Pectoris'
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
    gstPercent: 12,
    sampleStock: 120,
    visualAidUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800',
    indication: 'Type 2 Diabetes Mellitus glycemic control'
  },
  {
    id: 'prd-303',
    name: 'AllevOnco 100mg Injection',
    composition: 'Paclitaxel 100mg/16.7mL Infusion',
    category: 'Oncology',
    packing: 'Single Vial Box',
    mrp: 3200.00,
    ptr: 2400.00,
    pts: 2160.00,
    gstPercent: 5,
    sampleStock: 15,
    visualAidUrl: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800',
    indication: 'Advanced Ovarian & Breast Carcinoma'
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
    gstPercent: 12,
    sampleStock: 60,
    visualAidUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=800',
    indication: 'Diabetic Peripheral Neuropathy & Fibromyalgia'
  },
  {
    id: 'prd-305',
    name: 'ImmunoZest Syrup',
    composition: 'Zinc, Vitamin C, Vitamin D3 & Elderberry',
    category: 'Wellness',
    packing: '200ml Bottle',
    mrp: 165.00,
    ptr: 123.75,
    pts: 112.20,
    gstPercent: 18,
    sampleStock: 45,
    visualAidUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800',
    indication: 'Immunity enhancer & post-viral recovery'
  }
];

export const dcrReports = [
  {
    id: 'dcr-501',
    mrId: 'usr-004',
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
    feedback: 'Highly impressed with CardioShield Bio-equivalence study. Committed 25 patients this month.',
    pobGenerated: true,
    pobAmount: 18500,
    geoLat: 28.5284,
    geoLng: 77.2185,
    geoVerified: true,
    geoDistanceMeters: 35,
    status: 'SUBMITTED'
  },
  {
    id: 'dcr-502',
    mrId: 'usr-004',
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
    feedback: 'Max Hospital prescriptions flowing nicely. Stock replenished with fresh POB booking.',
    pobGenerated: true,
    pobAmount: 12400,
    geoLat: 28.5245,
    geoLng: 77.2140,
    geoVerified: true,
    geoDistanceMeters: 48,
    status: 'SUBMITTED'
  },
  {
    id: 'dcr-503',
    mrId: 'usr-004',
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
    feedback: 'Discussed new elderly dosing guidelines for GlucoMet Forte. Satisfactory response.',
    pobGenerated: false,
    pobAmount: 0,
    geoLat: 28.5601,
    geoLng: 77.2831,
    geoVerified: true,
    geoDistanceMeters: 20,
    status: 'APPROVED'
  }
];

export const orders = [
  {
    id: 'ord-801',
    orderNumber: 'ALV-2026-0901',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    chemistId: 'chm-201',
    chemistName: 'Apollo Medplus Pharmacy',
    stockistId: 'stk-401',
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
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    chemistId: 'chm-202',
    chemistName: 'Wellness Forever Chemists',
    stockistId: 'stk-402',
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
  },
  {
    id: 'ord-803',
    orderNumber: 'ALV-2026-0903',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    chemistId: 'chm-204',
    chemistName: 'Fortis Hospital In-House Pharmacy',
    stockistId: 'stk-401',
    stockistName: 'MedLife Distributors Ltd.',
    territory: 'South Delhi',
    orderDate: '2026-09-14',
    items: [
      { productId: 'prd-301', productName: 'CardioShield 50mg', qty: 250, ptr: 108.75, amount: 27187.50 },
      { productId: 'prd-302', productName: 'GlucoMet Forte 500/5', qty: 150, ptr: 135.00, amount: 20250.00 }
    ],
    totalAmount: 47437.50,
    discountPercent: 7.5,
    netAmount: 43879.69,
    paymentTerms: '30 Days Credit',
    status: 'INVOICED',
    remarks: 'Bulk monthly stock indent for cardiology ward.'
  }
];

export const expenses = [
  {
    id: 'exp-701',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    date: '2026-09-17',
    claimType: 'HQ_FIELD_WORK',
    stationType: 'HQ',
    travelKm: 42,
    fareRatePerKm: 4.5,
    travelAllowance: 189.00,
    dailyAllowance: 350.00,
    hotelCharges: 0.00,
    miscellaneousCharges: 120.00,
    miscDescription: 'Max Saket clinic parking & Barapullah toll slip',
    totalClaimAmount: 659.00,
    policyCompliant: true,
    receiptUrls: ['https://placehold.co/400x300/png?text=Toll+Slip+Receipt'],
    status: 'SUBMITTED',
    managerRemarks: ''
  },
  {
    id: 'exp-702',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    date: '2026-09-16',
    claimType: 'EX_HQ_VISIT',
    stationType: 'EX_HQ',
    travelKm: 68,
    fareRatePerKm: 5.0,
    travelAllowance: 340.00,
    dailyAllowance: 450.00,
    hotelCharges: 0.00,
    miscellaneousCharges: 80.00,
    miscDescription: 'Noida Expressway toll & parking fee',
    totalClaimAmount: 870.00,
    policyCompliant: true,
    receiptUrls: ['https://placehold.co/400x300/png?text=Parking+Receipt'],
    status: 'APPROVED',
    managerRemarks: 'Verified against DCR doctor call locations in Sector 18/62.'
  }
];

export const tourPlans = [
  {
    id: 'tp-901',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    month: 'September 2026',
    date: '2026-09-18',
    dayOfWeek: 'Friday',
    territory: 'South Delhi (Saket & Hauz Khas)',
    activityType: 'Field Doctor Visits',
    plannedDoctors: ['Dr. Arvind Mehra', 'Dr. Sunita Rao', 'Dr. Pradeep Oberoi'],
    plannedChemists: ['Apollo Medplus Pharmacy', 'City Care Medicos'],
    objectives: 'Promote CardioShield new clinical data; review chemist stocking',
    status: 'APPROVED'
  },
  {
    id: 'tp-902',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    month: 'September 2026',
    date: '2026-09-19',
    dayOfWeek: 'Saturday',
    territory: 'Noida (Sector 18 & 26)',
    activityType: 'Oncology & Diab Specialist Visits',
    plannedDoctors: ['Dr. Vikram Sethi', 'Dr. Kavita Bansal'],
    plannedChemists: ['Wellness Forever Chemists'],
    objectives: 'Hospital formulary review for AllevOnco injection',
    status: 'APPROVED'
  },
  {
    id: 'tp-903',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    month: 'September 2026',
    date: '2026-09-21',
    dayOfWeek: 'Monday',
    territory: 'South Delhi (Okhla & Fortis Base)',
    activityType: 'Institutional Hospital Detailing',
    plannedDoctors: ['Dr. Sunita Rao'],
    plannedChemists: ['Fortis Hospital In-House Pharmacy'],
    objectives: 'Stockist delivery coordination and GlucoMet indent',
    status: 'PLANNED'
  }
];

export const attendanceRecords = [
  {
    id: 'att-101',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    date: '2026-09-17',
    punchInTime: '09:15 AM',
    punchOutTime: '06:45 PM',
    punchInLocation: 'Saket Metro Station (28.5204, 77.2014)',
    punchOutLocation: 'Green Park Market (28.5588, 77.2028)',
    totalHours: 9.5,
    status: 'PRESENT_FIELD',
    callsCompleted: 2,
    pobBooked: 30900
  },
  {
    id: 'att-102',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    date: '2026-09-16',
    punchInTime: '09:00 AM',
    punchOutTime: '06:30 PM',
    punchInLocation: 'Noida Sector 18 (28.5708, 77.3260)',
    punchOutLocation: 'Noida Sector 62 (28.6258, 77.3648)',
    totalHours: 9.5,
    status: 'PRESENT_FIELD',
    callsCompleted: 1,
    pobBooked: 29391
  },
  {
    id: 'att-103',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    date: '2026-09-15',
    punchInTime: '09:30 AM',
    punchOutTime: '06:00 PM',
    punchInLocation: 'South Delhi HQ Office',
    punchOutLocation: 'South Delhi HQ Office',
    totalHours: 8.5,
    status: 'PRESENT_MEETING',
    callsCompleted: 0,
    pobBooked: 0
  }
];

export const leaveBalances = [
  {
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    casualLeaveTotal: 12,
    casualLeaveUsed: 3,
    sickLeaveTotal: 10,
    sickLeaveUsed: 1,
    earnedLeaveTotal: 15,
    earnedLeaveUsed: 4,
    pendingLeaves: []
  }
];

export const fieldTrackingPings = [
  {
    id: 'ping-001',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    timestamp: '09:15 AM',
    activity: 'Punch-In & Day Start',
    locationName: 'Saket Metro Station',
    lat: 28.5204,
    lng: 77.2014,
    battery: '94%',
    gpsAccuracy: 'High (4m)'
  },
  {
    id: 'ping-002',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    timestamp: '10:45 AM',
    activity: 'DCR Visit: Dr. Arvind Mehra (Max Hospital)',
    locationName: 'Max Super Speciality Hospital, Saket',
    lat: 28.5284,
    lng: 77.2185,
    battery: '88%',
    gpsAccuracy: 'High (3m)'
  },
  {
    id: 'ping-003',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    timestamp: '12:15 PM',
    activity: 'Chemist Audit: Apollo Medplus Pharmacy',
    locationName: 'Saket Community Center',
    lat: 28.5245,
    lng: 77.2140,
    battery: '82%',
    gpsAccuracy: 'High (5m)'
  },
  {
    id: 'ping-004',
    mrId: 'usr-004',
    mrName: 'Amit Verma',
    timestamp: '03:45 PM',
    activity: 'In Transit to Green Park Clinic',
    locationName: 'Hauz Khas Outer Ring Road',
    lat: 28.5494,
    lng: 77.2001,
    battery: '74%',
    gpsAccuracy: 'High (6m)'
  }
];

export const territoryQuotas = {
  monthlyTargetRevenue: 450000,
  monthlyAchievedRevenue: 385400,
  targetDoctorVisits: 220,
  completedDoctorVisits: 198,
  targetChemistVisits: 80,
  completedChemistVisits: 74,
  brandPerformance: [
    { brand: 'CardioShield 50mg', targetQty: 1200, soldQty: 1080, revenue: 117450, growth: '+18.4%' },
    { brand: 'GlucoMet Forte 500/5', targetQty: 900, soldQty: 850, revenue: 114750, growth: '+12.1%' },
    { brand: 'AllevOnco 100mg', targetQty: 40, soldQty: 38, revenue: 91200, growth: '+25.0%' },
    { brand: 'NeuroCalm Plus', targetQty: 500, soldQty: 420, revenue: 66150, growth: '+9.5%' },
    { brand: 'ImmunoZest Syrup', targetQty: 400, soldQty: 320, revenue: 39600, growth: '+6.2%' }
  ]
};
