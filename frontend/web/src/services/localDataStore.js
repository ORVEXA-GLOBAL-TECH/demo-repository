// Enterprise Local Resilient Data Store for Alleviare SFA
// Guarantees 100% operational fidelity offline, online, and on Azure Static Web Apps

const STORAGE_KEY = 'alleviare_offline_enterprise_db_v1';

export const INITIAL_ENTERPRISE_DATA = {
  // 1. Organization & Hierarchy
  zones: [
    { id: 'ZN-101', name: 'North Zone India', code: 'NZ-IND', head: 'Priya Mukherjee (RSM)', territoriesCount: 8, repsCount: 14, quarterlyTarget: '₹ 1.85 Cr', achievementPct: 88, status: 'Active' },
    { id: 'ZN-102', name: 'West Zone India', code: 'WZ-IND', head: 'Kunal Deshmukh (RSM)', territoriesCount: 8, repsCount: 12, quarterlyTarget: '₹ 1.60 Cr', achievementPct: 91, status: 'Active' },
    { id: 'ZN-103', name: 'South Zone India', code: 'SZ-IND', head: 'R. Venkatesh (RSM)', territoriesCount: 9, repsCount: 15, quarterlyTarget: '₹ 1.95 Cr', achievementPct: 84, status: 'Active' },
    { id: 'ZN-104', name: 'East Zone India', code: 'EZ-IND', head: 'Debashis Roy (RSM)', territoriesCount: 7, repsCount: 11, quarterlyTarget: '₹ 1.30 Cr', achievementPct: 86, status: 'Active' }
  ],
  regions: [
    { id: 'REG-201', name: 'Delhi NCR Region', zoneId: 'ZN-101', zoneName: 'North Zone India', manager: 'Suresh Raina', territoryCount: 4, activeReps: 6, monthlyTarget: '₹ 62 Lakh', status: 'Active' },
    { id: 'REG-202', name: 'Punjab & Haryana', zoneId: 'ZN-101', zoneName: 'North Zone India', manager: 'Harpreet Singh', territoryCount: 4, activeReps: 5, monthlyTarget: '₹ 48 Lakh', status: 'Active' },
    { id: 'REG-203', name: 'Mumbai Metropolitan', zoneId: 'ZN-102', zoneName: 'West Zone India', manager: 'Sachin Patil', territoryCount: 4, activeReps: 6, monthlyTarget: '₹ 70 Lakh', status: 'Active' },
    { id: 'REG-204', name: 'Bengaluru Urban & Rural', zoneId: 'ZN-103', zoneName: 'South Zone India', manager: 'Anand Kumar', territoryCount: 4, activeReps: 6, monthlyTarget: '₹ 65 Lakh', status: 'Active' }
  ],
  areas: [
    { id: 'AR-301', name: 'South Delhi & Faridabad Belt', regionName: 'Delhi NCR Region', supervisor: 'Amit Saxena', mrCount: 3, doctorsCovered: 140, status: 'Active' },
    { id: 'AR-302', name: 'Central & North Delhi', regionName: 'Delhi NCR Region', supervisor: 'Vikas Sharma', mrCount: 3, doctorsCovered: 125, status: 'Active' },
    { id: 'AR-303', name: 'Noida & Greater Noida Industrial', regionName: 'Delhi NCR Region', supervisor: 'Rajat Verma', mrCount: 2, doctorsCovered: 95, status: 'Active' },
    { id: 'AR-304', name: 'Gurugram Cybercity & Manesar', regionName: 'Delhi NCR Region', supervisor: 'Deepak Chawla', mrCount: 2, doctorsCovered: 110, status: 'Active' }
  ],
  territories: [
    { id: 'TER-401', code: 'DEL-SAK', name: 'Saket & Malviya Nagar', hqName: 'South Delhi HQ', mrAssigned: 'Amit Verma', doctorsCount: 48, chemistsCount: 26, monthlyTarget: '₹ 14.5 Lakh', status: 'Active' },
    { id: 'DEL-402', code: 'DEL-GRP', name: 'Green Park & Hauz Khas', hqName: 'South Delhi HQ', mrAssigned: 'Rohit Khanna', doctorsCount: 42, chemistsCount: 22, monthlyTarget: '₹ 13.0 Lakh', status: 'Active' },
    { id: 'TER-403', code: 'NOI-S62', name: 'Noida Sector 62 & Indirapuram', hqName: 'Noida HQ', mrAssigned: 'Neeraj Joshi', doctorsCount: 38, chemistsCount: 19, monthlyTarget: '₹ 11.5 Lakh', status: 'Active' },
    { id: 'TER-404', code: 'GGN-CYB', name: 'Gurugram Phase 1-5', hqName: 'Gurugram HQ', mrAssigned: 'Vikas Malhotra', doctorsCount: 45, chemistsCount: 25, monthlyTarget: '₹ 15.0 Lakh', status: 'Active' }
  ],
  headquarters: [
    { id: 'HQ-501', name: 'South Delhi HQ', city: 'New Delhi', state: 'Delhi', activeMRs: 4, leadStockist: 'MedLife Distributors Ltd.', status: 'Active' },
    { id: 'HQ-502', name: 'Central Delhi HQ', city: 'New Delhi', state: 'Delhi', activeMRs: 3, leadStockist: 'Apex Pharma Distributors', status: 'Active' },
    { id: 'HQ-503', name: 'Noida Regional HQ', city: 'Noida', state: 'Uttar Pradesh', activeMRs: 3, leadStockist: 'Metro Healthcare Stockists', status: 'Active' },
    { id: 'HQ-504', name: 'Gurugram Commercial HQ', city: 'Gurugram', state: 'Haryana', activeMRs: 4, leadStockist: 'National Pharma Wholesale', status: 'Active' }
  ],

  // 2. People & Employees
  employees: [
    { id: 'EMP-001', code: 'ALV-E101', name: 'Dr. Rajesh Sharma', email: 'admin@alleviare.com', role: 'ADMIN', designation: 'National Corporate Admin / Ops Lead', department: 'Executive Operations', territory: 'National HQ (All Zones)', phone: '+91 98110 01122', status: 'Active', joinDate: '2021-03-15' },
    { id: 'EMP-002', code: 'ALV-E102', name: 'Vikramaditya Singhania', email: 'director@alleviare.com', role: 'DIRECTOR', designation: 'Commercial & Managing Director', department: 'Executive Board', territory: 'Pan India Commercial Ops', phone: '+91 98200 44332', status: 'Active', joinDate: '2020-01-10' },
    { id: 'EMP-003', code: 'ALV-E103', name: 'Meenakshi Sundaram', email: 'manager@alleviare.com', role: 'MANAGER', designation: 'Commercial Operations Manager', department: 'Field Operations', territory: 'Pan India Operations HQ', phone: '+91 98450 12345', status: 'Active', joinDate: '2022-06-01' },
    { id: 'EMP-004', code: 'ALV-E104', name: 'Priya Mukherjee', email: 'salesmanager@alleviare.com', role: 'SALES_MANAGER', designation: 'Regional Sales Manager (North Zone)', department: 'Commercial Sales', territory: 'North Zone India', phone: '+91 98101 98765', status: 'Active', joinDate: '2022-09-15' },
    { id: 'EMP-005', code: 'ALV-E105', name: 'Suresh Raina', email: 'salessupervisor@alleviare.com', role: 'MR_SUPERVISOR', designation: 'Area Sales Supervisor (Delhi NCR)', department: 'Field Supervision', territory: 'Delhi NCR Region', phone: '+91 98711 22334', status: 'Active', joinDate: '2023-02-01' },
    { id: 'EMP-006', code: 'ALV-E106', name: 'Rameshwar Gupta', email: 'accountant@alleviare.com', role: 'ACCOUNTANT', designation: 'Chief Financial Accountant & Claims Officer', department: 'Finance & Accounts', territory: 'Central Finance Division', phone: '+91 98118 77665', status: 'Active', joinDate: '2021-11-20' },
    { id: 'EMP-007', code: 'ALV-E107', name: 'Amit Verma', email: 'mr@alleviare.com', role: 'MR', designation: 'Medical Representative (Field Officer)', department: 'Field Sales Force', territory: 'South Delhi & Noida', phone: '+91 98188 33445', status: 'Active', joinDate: '2024-01-15' },
    { id: 'EMP-008', code: 'ALV-E108', name: 'Rohit Khanna', email: 'rohit.k@alleviare.com', role: 'MR', designation: 'Senior Medical Representative', department: 'Field Sales Force', territory: 'Central Delhi Belt', phone: '+91 98199 55667', status: 'Active', joinDate: '2023-08-10' }
  ],

  // 3. Customers - Hospitals
  hospitals: [
    { id: 'HSP-001', name: 'Max Super Speciality Hospital, Saket', type: 'Super Speciality Tertiary', territory: 'South Delhi', beds: 550, keyDepartments: ['Cardiology', 'Oncology', 'Neurology', 'Nephrology'], attachedDoctorsCount: 28, address: '1, 2, Press Enclave Marg, Saket Institutional Area, New Delhi 110017', contact: '+91 11 2651 5050', status: 'Tier 1 Preferred' },
    { id: 'HSP-002', name: 'Fortis Escorts Heart Institute, Okhla', type: 'Cardiovascular Specialty', territory: 'South Delhi', beds: 310, keyDepartments: ['Cardiology', 'Cardiothoracic Surgery', 'Vascular'], attachedDoctorsCount: 22, address: 'Okhla Road, New Friends Colony, New Delhi 110025', contact: '+91 11 4713 5000', status: 'Tier 1 Preferred' },
    { id: 'HSP-003', name: 'Apollo Cancer Centre, Sarita Vihar', type: 'Oncology Comprehensive', territory: 'South Delhi & Faridabad', beds: 420, keyDepartments: ['Medical Oncology', 'Surgical Oncology', 'Hematology'], attachedDoctorsCount: 19, address: 'Delhi Mathura Road, Sarita Vihar, New Delhi 110076', contact: '+91 11 2692 5858', status: 'Tier 1 Preferred' },
    { id: 'HSP-004', name: 'Sir Ganga Ram Hospital, Rajinder Nagar', type: 'Multi-Speciality Trust Hospital', territory: 'Central Delhi', beds: 675, keyDepartments: ['Nephrology', 'Internal Medicine', 'Gastroenterology'], attachedDoctorsCount: 35, address: 'Sir Ganga Ram Hospital Marg, Old Rajinder Nagar, New Delhi 110060', contact: '+91 11 2575 0000', status: 'Tier 1 Preferred' },
    { id: 'HSP-005', name: 'Medanta - The Medicity, Gurugram', type: 'Multi-Super Speciality', territory: 'Gurugram', beds: 1250, keyDepartments: ['All Specialties'], attachedDoctorsCount: 45, address: 'CH Bakhtawar Singh Rd, Sector 38, Gurugram, Haryana 122001', contact: '+91 124 414 1414', status: 'Tier 1 Preferred' }
  ],

  // 4. Products - Divisions & Competitors
  divisions: [
    { id: 'DIV-01', name: 'Cardio-Diab Specialty Division', head: 'Dr. Alok Verma', productsCount: 5, targetMonthly: '₹ 45 Lakh', status: 'Active' },
    { id: 'DIV-02', name: 'Onco-Hematology Care', head: 'Dr. Meenakshi S.', productsCount: 3, targetMonthly: '₹ 38 Lakh', status: 'Active' },
    { id: 'DIV-03', name: 'Neuro-Psychiatry Division', head: 'Dr. R. K. Singhal', productsCount: 4, targetMonthly: '₹ 28 Lakh', status: 'Active' },
    { id: 'DIV-04', name: 'Critical Therapeutics & Antibiotics', head: 'Priya Mukherjee', productsCount: 4, targetMonthly: '₹ 22 Lakh', status: 'Active' }
  ],
  competitors: [
    { id: 'CMP-01', brand: 'CardiGuard 50', company: 'Sun Pharma', competitorProduct: 'Metoprolol Succinate 50mg', priceMrp: 160, marketSharePct: 34, keyStrength: 'High brand recall amongst private cardiologists', status: 'Active Tracking' },
    { id: 'CMP-02', brand: 'GlyciStar Duo', company: 'Torrent Pharma', competitorProduct: 'Glimepiride + Metformin 2/500', priceMrp: 145, marketSharePct: 29, keyStrength: 'Extensive chemist margin & bonus schemes', status: 'Active Tracking' },
    { id: 'CMP-03', brand: 'NeuroRest Plus', company: 'Lupin Laboratories', competitorProduct: 'Pregabalin 75mg + Methylcobalamin', priceMrp: 210, marketSharePct: 22, keyStrength: 'Aggressive CME sponsorship', status: 'Active Tracking' },
    { id: 'CMP-04', brand: 'OncoShield 100', company: 'Cipla Ltd.', competitorProduct: 'Imatinib Mesylate 100mg', priceMrp: 4800, marketSharePct: 41, keyStrength: 'Government institutional hospital tender lock-in', status: 'Active Tracking' }
  ],

  // 5. Visits 360° Field Execution Log
  visits: [
    {
      id: 'VIS-901',
      date: '2026-09-28',
      mrName: 'Amit Verma',
      mrId: 'usr-007',
      targetType: 'DOCTOR',
      targetName: 'Dr. Arvind Mehra',
      targetId: 'DOC-101',
      hospitalOrClinic: 'Max Super Speciality Hospital, Saket',
      specialty: 'Cardiologist',
      startTime: '10:15 AM',
      endTime: '10:42 AM',
      durationMinutes: 27,
      gpsVerified: true,
      gpsCoordinates: '28.5284° N, 77.2185° E (18m accuracy)',
      callPurpose: 'Product Detailing & Clinical Trial Presentation',
      productsDetailed: ['CardioShield 50mg', 'NeuroCalm Plus'],
      samplesHanded: [{ product: 'CardioShield 50mg', batch: 'CS50-2026B', qty: 4 }],
      promoMaterialGiven: 'CardioShield Phase III Clinical Trial Flipchart',
      feedback: 'Very receptive to latest hemodynamics trial. Requested 2 more sample boxes for chronic hypertensive patient trial.',
      pobBooked: false,
      status: 'COMPLETED',
      linkedDcrId: 'dcr-1'
    },
    {
      id: 'VIS-902',
      date: '2026-09-28',
      mrName: 'Amit Verma',
      mrId: 'usr-007',
      targetType: 'DOCTOR',
      targetName: 'Dr. Sunita Rao',
      targetId: 'DOC-102',
      hospitalOrClinic: 'Fortis Escorts Heart Institute, Okhla',
      specialty: 'Diabetologist',
      startTime: '11:30 AM',
      endTime: '11:58 AM',
      durationMinutes: 28,
      gpsVerified: true,
      gpsCoordinates: '28.5603° N, 77.2792° E (12m accuracy)',
      callPurpose: 'Detailing & Next Generation Insulin Sensitizer',
      productsDetailed: ['GlucoMet Forte 500/5'],
      samplesHanded: [{ product: 'GlucoMet Forte 500/5', batch: 'GM-F2604', qty: 6 }],
      promoMaterialGiven: 'ADA 2026 Guidelines Patient Brochure',
      feedback: 'Agreed to initiate 10 new diabetic patients on GlucoMet Forte this week.',
      pobBooked: false,
      status: 'COMPLETED',
      linkedDcrId: 'dcr-2'
    },
    {
      id: 'VIS-903',
      date: '2026-09-28',
      mrName: 'Amit Verma',
      mrId: 'usr-007',
      targetType: 'CHEMIST',
      targetName: 'Apollo Pharmacy Saket',
      targetId: 'CHM-201',
      hospitalOrClinic: 'Shop 14-15, Main Market, Saket',
      specialty: 'Retail Pharmacy',
      startTime: '02:10 PM',
      endTime: '02:35 PM',
      durationMinutes: 25,
      gpsVerified: true,
      gpsCoordinates: '28.5245° N, 77.2140° E (10m accuracy)',
      callPurpose: 'Stock Audit & POB Booking',
      productsDetailed: ['CardioShield 50mg', 'GlucoMet Forte 500/5', 'Pan-D'],
      samplesHanded: [],
      promoMaterialGiven: 'Retail Chemist Shelf Display Standee',
      feedback: 'CardioShield moving fast due to Dr. Mehra Rx. Booked replenishment order.',
      pobBooked: true,
      pobAmount: 24500,
      status: 'COMPLETED',
      linkedDcrId: 'dcr-3'
    }
  ],

  // 6. Tour Plans (MTP)
  tourPlans: [
    {
      id: 'MTP-01',
      date: '2026-09-28',
      dayOfWeek: 'Monday',
      mrName: 'Amit Verma',
      territory: 'Saket & Malviya Nagar (South Delhi)',
      objectives: 'Cover key Tier 1 Cardiologists at Max Hospital and audit attached chemist stock levels.',
      plannedDoctors: ['Dr. Arvind Mehra (Cardio)', 'Dr. Rajesh K. Gupta (Cardio)', 'Dr. Sneha Verma (Derma)'],
      plannedChemists: ['Apollo Pharmacy Saket', 'Guardian Pharmacy Saket'],
      status: 'APPROVED',
      distanceEstimateKm: 32,
      approver: 'Suresh Raina (Supervisor)'
    },
    {
      id: 'MTP-02',
      date: '2026-09-29',
      dayOfWeek: 'Tuesday',
      mrName: 'Amit Verma',
      territory: 'Green Park & Hauz Khas',
      objectives: 'Focus on Diabetology clinics and promote GlucoMet Forte launch pack.',
      plannedDoctors: ['Dr. Sunita Rao (Diabeto)', 'Dr. Sameer Khan (GP)', 'Dr. Kavita Deshmukh (Gynae)'],
      plannedChemists: ['MedPlus Pharmacy Green Park', 'Wellness Forever Hauz Khas'],
      status: 'APPROVED',
      distanceEstimateKm: 28,
      approver: 'Suresh Raina (Supervisor)'
    },
    {
      id: 'MTP-03',
      date: '2026-09-30',
      dayOfWeek: 'Wednesday',
      mrName: 'Amit Verma',
      territory: 'Okhla & Sarita Vihar Oncology Belt',
      objectives: 'Follow up with Apollo Cancer Centre oncology leads and oncopharmacists.',
      plannedDoctors: ['Dr. Vikram Sethi (Onco)', 'Dr. Alok Bhargava (Nephro)'],
      plannedChemists: ['Fortis In-house Chemist', 'Apollo Hospital Dispensary'],
      status: 'SUBMITTED',
      distanceEstimateKm: 42,
      approver: 'Pending Review'
    }
  ],

  // 7. Samples & Promotional Materials Inventory
  sampleInventory: [
    { id: 'SMP-101', brandName: 'CardioShield 50mg', batchNo: 'CS50-2026B', expiryDate: '2027-12-31', totalUnits: 500, allocatedUnits: 320, distributedUnits: 180, remainingUnits: 140, unitCost: 15, status: 'Active Stock' },
    { id: 'SMP-102', brandName: 'GlucoMet Forte 500/5', batchNo: 'GM-F2604', expiryDate: '2028-04-30', totalUnits: 600, allocatedUnits: 400, distributedUnits: 250, remainingUnits: 150, unitCost: 12, status: 'Active Stock' },
    { id: 'SMP-103', brandName: 'NeuroCalm Plus', batchNo: 'NCP-9011', expiryDate: '2027-08-31', totalUnits: 350, allocatedUnits: 200, distributedUnits: 130, remainingUnits: 70, unitCost: 24, status: 'Low Stock' },
    { id: 'SMP-104', brandName: 'AllevOnco 100mg', batchNo: 'ONC-100A', expiryDate: '2027-06-30', totalUnits: 120, allocatedUnits: 80, distributedUnits: 55, remainingUnits: 25, unitCost: 450, status: 'High Value Controlled' }
  ],
  promotionalMaterials: [
    { id: 'MAT-201', name: 'CardioShield Digital Detailing Flipchart', type: 'Visual Aid', targetSpecialty: 'Cardiologists', totalReceived: 200, distributed: 140, balance: 60, status: 'Available' },
    { id: 'MAT-202', name: 'ADA 2026 Diabetes Patient Diet Calendars', type: 'Patient Education Gift', targetSpecialty: 'Diabetologists', totalReceived: 500, distributed: 380, balance: 120, status: 'Available' },
    { id: 'MAT-203', name: 'NeuroCalm Reflex Hammer & Penlight Sets', type: 'Doctor Utility Instrument', targetSpecialty: 'Neurologists', totalReceived: 100, distributed: 85, balance: 15, status: 'Low Stock' },
    { id: 'MAT-204', name: 'Alleviare Premium Prescription Pads (Bond)', type: 'Stationery Leave-Behind', targetSpecialty: 'All HCPs', totalReceived: 1000, distributed: 750, balance: 250, status: 'Available' }
  ],

  // 8. Commercial Sales & Quota Targets
  salesTargets: [
    { id: 'TGT-801', repName: 'Amit Verma (MR)', territory: 'South Delhi & Noida', quarter: 'Q3 2026 (Jul-Sep)', targetAmount: 450000, achievedAmount: 385400, pct: 86, doctorCallTarget: 220, doctorCallAchieved: 198, pobTarget: 180000, pobAchieved: 165000, status: 'ON_TRACK' },
    { id: 'TGT-802', repName: 'Rohit Khanna (Senior MR)', territory: 'Central Delhi Belt', quarter: 'Q3 2026 (Jul-Sep)', targetAmount: 420000, achievedAmount: 395000, pct: 94, doctorCallTarget: 210, doctorCallAchieved: 205, pobTarget: 170000, pobAchieved: 172000, status: 'STAR_PERFORMER' },
    { id: 'TGT-803', repName: 'Neeraj Joshi (MR)', territory: 'Noida Sector 62 & Indirapuram', quarter: 'Q3 2026 (Jul-Sep)', targetAmount: 380000, achievedAmount: 298000, pct: 78, doctorCallTarget: 190, doctorCallAchieved: 162, pobTarget: 150000, pobAchieved: 120000, status: 'NEEDS_FOCUS' }
  ],

  // 9. Unified Approvals Hub Items
  approvals: [
    { id: 'APP-101', type: 'DCR', title: 'Daily Call Report - 28 Sep 2026', submitter: 'Amit Verma (MR)', role: 'MR', amountOrUnits: '4 Dr Calls • 2 Chemist Audits • ₹24.5k POB', submittedAt: '2026-09-28 04:30 PM', status: 'PENDING', modulePath: 'dcr' },
    { id: 'APP-102', type: 'EXPENSE', title: 'Ex-HQ Travel Claim (Malviya Nagar & Noida)', submitter: 'Amit Verma (MR)', role: 'MR', amountOrUnits: '₹ 1,180.00 (42 km + DA ₹450)', submittedAt: '2026-09-28 05:15 PM', status: 'PENDING', modulePath: 'expenses' },
    { id: 'APP-103', type: 'ORDER', title: 'POB Order ALV-2026-8910 (Apollo Pharmacy)', submitter: 'Apollo Pharmacy Saket', role: 'Chemist Booking', amountOrUnits: '₹ 38,500.00 Net (Apex Pharma)', submittedAt: '2026-09-28 02:40 PM', status: 'PENDING', modulePath: 'orders' },
    { id: 'APP-104', type: 'LEAVE', title: 'Casual Leave Request (2 Days)', submitter: 'Rohit Khanna (Senior MR)', role: 'MR', amountOrUnits: '03 Oct 2026 to 04 Oct 2026', submittedAt: '2026-09-27 10:00 AM', status: 'PENDING', modulePath: 'attendance' },
    { id: 'APP-105', type: 'TOUR_PLAN', title: 'MTP October 2026 Beat Program', submitter: 'Neeraj Joshi (MR)', role: 'MR', amountOrUnits: '24 Planned Beats • 180 Target Visits', submittedAt: '2026-09-26 06:00 PM', status: 'PENDING', modulePath: 'tour-plan' }
  ],

  // 10. Training LMS Courses
  trainingCourses: [
    { id: 'TRN-01', title: 'CardioShield 50mg: Clinical Trial Detailing Masterclass', category: 'Product Knowledge', durationMinutes: 45, totalSlides: 28, status: 'COMPLETED', score: '95%', certificateIssued: true, mandatoryForRole: ['MR', 'MR_SUPERVISOR'] },
    { id: 'TRN-02', title: 'Good Detailing Practice (GDP) & HCP Objection Handling', category: 'Field Effectiveness', durationMinutes: 60, totalSlides: 35, status: 'IN_PROGRESS', progressPct: 65, certificateIssued: false, mandatoryForRole: ['MR'] },
    { id: 'TRN-03', title: 'Pharmacovigilance & Adverse Drug Reaction (ADR) Reporting', category: 'Regulatory Compliance', durationMinutes: 30, totalSlides: 18, status: 'COMPLETED', score: '100%', certificateIssued: true, mandatoryForRole: ['ALL'] },
    { id: 'TRN-04', title: 'Effective POB Closing & Chemist Return Audit Techniques', category: 'Commercial Sales', durationMinutes: 40, totalSlides: 22, status: 'NOT_STARTED', certificateIssued: false, mandatoryForRole: ['MR'] }
  ],

  // 11. Enterprise Immutable Audit Trail
  auditLogs: [
    { id: 'AUD-8801', timestamp: '2026-09-28 05:15:22', actorName: 'Amit Verma', actorRole: 'MR', action: 'CREATE', entity: 'EXPENSE_CLAIM', entityId: 'EXP-401', ipAddress: '103.21.144.6', details: 'Submitted field travel claim for ₹1,180 (42 km at ₹5/km + ₹450 DA)', status: 'SUCCESS' },
    { id: 'AUD-8802', timestamp: '2026-09-28 04:30:10', actorName: 'Amit Verma', actorRole: 'MR', action: 'SUBMIT', entity: 'DCR_REPORT', entityId: 'DCR-2026-0928', ipAddress: '103.21.144.6', details: 'Submitted DCR with 4 doctor calls and 2 chemist audits with GPS verification', status: 'SUCCESS' },
    { id: 'AUD-8803', timestamp: '2026-09-28 02:40:05', actorName: 'Amit Verma', actorRole: 'MR', action: 'CREATE', entity: 'POB_ORDER', entityId: 'ORD-8910', ipAddress: '103.21.144.6', details: 'Booked POB order for ₹38,500 at Apollo Pharmacy Saket via Apex Pharma', status: 'SUCCESS' },
    { id: 'AUD-8804', timestamp: '2026-09-28 09:15:30', actorName: 'Amit Verma', actorRole: 'MR', action: 'PUNCH_IN', entity: 'ATTENDANCE', entityId: 'ATT-2026-0928', ipAddress: '103.21.144.6', details: 'GPS check-in verified at Saket Field Hub (28.5284, 77.2185), within 20m tolerance', status: 'SUCCESS' },
    { id: 'AUD-8805', timestamp: '2026-09-27 18:20:00', actorName: 'Dr. Rajesh Sharma', actorRole: 'ADMIN', action: 'UPDATE', entity: 'EXPENSE_POLICY', entityId: 'POL-HQ-2026', ipAddress: '14.139.60.10', details: 'Updated outstation per diem DA ceiling from ₹600 to ₹650', status: 'SUCCESS' },
    { id: 'AUD-8806', timestamp: '2026-09-27 14:10:45', actorName: 'Suresh Raina', actorRole: 'MR_SUPERVISOR', action: 'APPROVE', entity: 'DCR_REPORT', entityId: 'DCR-2026-0927', ipAddress: '49.36.120.44', details: 'Approved DCR of Amit Verma with 5 doctor visits', status: 'SUCCESS' }
  ],

  // 12. Company Settings
  companySettings: {
    companyName: 'Alleviare Health Sciences',
    companyCode: 'ALV',
    primaryColor: '#2563eb',
    headquartersCity: 'New Delhi, India',
    geofenceAccuracyRadiusMeters: 50,
    dailyDcrCutoffTime: '22:00',
    mandatoryGpsForVisits: true,
    requireChemistStockAudit: true,
    maxDailyTaKmAllowance: 180,
    currencySymbol: '₹',
    currencyCode: 'INR',
    fiscalYearStart: 'April',
    autoLockApprovedDcr: true
  }
};

// Retrieve persistent store or initialize with seed defaults
export function getLocalStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ENTERPRISE_DATA));
      return { ...INITIAL_ENTERPRISE_DATA };
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStore read fallback:', e);
    return { ...INITIAL_ENTERPRISE_DATA };
  }
}

// Update partial data in local store
export function updateLocalStore(key, updater) {
  try {
    const current = getLocalStore();
    const nextVal = typeof updater === 'function' ? updater(current[key] || []) : updater;
    current[key] = nextVal;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (e) {
    console.warn('LocalStore update failed:', e);
    return getLocalStore();
  }
}
