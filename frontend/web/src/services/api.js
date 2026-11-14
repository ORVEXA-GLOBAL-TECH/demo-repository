import { getLocalStore, updateLocalStore } from './localDataStore';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://alleviare-sfa-api-2026.azurewebsites.net/api'
    : '/api');

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://alleviare-sfa-api-2026.azurewebsites.net'
    : 'http://localhost:5000');

// Resilient Fetch with Auth & Offline / Azure Static Web App Fallback
export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('alleviare_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  // 1. Attempt Network Fetch with Timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);
  const isAuthCall = endpoint.startsWith('/auth/login');

  let res = null;
  try {
    res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers, signal: controller.signal });
  } catch (netErr) {
    // Network / CORS / stopped server - fall through to the offline store (never for sign-in)
  } finally {
    clearTimeout(timeoutId);
  }

  if (res) {
    if (res.ok) return await res.json();

    // Authentication / authorisation problems must surface: a rejected sign-in or a
    // forbidden action may never be papered over with demo data.
    if (isAuthCall || res.status === 401 || res.status === 403) {
      let body = {};
      try { body = await res.json(); } catch { /* non-JSON error body */ }
      const err = new Error(body.message || body.error || `Request failed (${res.status})`);
      err.status = res.status;
      err.code = body.code;
      if (res.status === 401 && !isAuthCall && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('alleviare:unauthorized'));
      }
      throw err;
    }
  } else if (isAuthCall) {
    throw new Error('Cannot reach the server. Check your connection and try again.');
  }

  // 2. Intelligent Client-Side Enterprise Store Fallback
  return handleOfflineStoreFallback(endpoint, options);
}

// Seamless Offline Local Persistence Handler
function handleOfflineStoreFallback(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const store = getLocalStore();
  const urlPath = endpoint.split('?')[0];
  const queryString = endpoint.includes('?') ? endpoint.split('?')[1] : '';
  const searchParams = new URLSearchParams(queryString);
  const targetRole = (searchParams.get('role') || localStorage.getItem('alleviare_user') ? JSON.parse(localStorage.getItem('alleviare_user') || '{}').role : 'ADMIN') || 'ADMIN';

  // --- GET ENDPOINTS ---
  if (method === 'GET') {
    if (urlPath === '/dashboard/summary') {
      const uRole = targetRole.toUpperCase();

      if (uRole === 'DIRECTOR') {
        return {
          success: true,
          role: 'DIRECTOR',
          data: {
            metrics: {
              totalEnterpriseRevenue: 68500000,
              annualTarget: 80000000,
              quotaAchievementPct: 85.6,
              doctorCoveragePct: 91.2,
              activeFieldForceCount: 52,
              totalRegisteredDoctors: 480,
              totalHospitalsCovered: 142,
              topDivision: 'Cardiovascular Care (₹2.88 Cr)',
              topTerritory: 'Delhi NCR (104% Quota)',
              underperformingTerritoriesCount: 3
            },
            zonalPerformance: [
              { zone: 'North Zone India', target: 22000000, achieved: 20400000, pct: 92.7, rsm: 'Priya Mukherjee', reps: 14, status: 'On Track' },
              { zone: 'West Zone India', target: 20000000, achieved: 18200000, pct: 91.0, rsm: 'Kunal Deshmukh', reps: 12, status: 'On Track' },
              { zone: 'South Zone India', target: 21000000, achieved: 17640000, pct: 84.0, rsm: 'R. Venkatesh', reps: 15, status: 'Needs Focus' },
              { zone: 'East Zone India', target: 17000000, achieved: 12260000, pct: 72.1, rsm: 'Debashis Roy', reps: 11, status: 'Critical Gap' }
            ],
            divisionBreakdown: [
              { division: 'Cardiovascular Care', revenue: 28800000, target: 30000000, share: 42, growth: '+14.2%', topProduct: 'CardioShield 50mg' },
              { division: 'Diabetology & Metabolic', revenue: 21900000, target: 24000000, share: 32, growth: '+18.5%', topProduct: 'GlucoMet Forte 500/5' },
              { division: 'Neuroscience & CNS', revenue: 12300000, target: 16000000, share: 18, growth: '+9.1%', topProduct: 'NeuroCalm Plus' },
              { division: 'Oncology Therapeutics', revenue: 5500000, target: 10000000, share: 8, growth: '+24.0%', topProduct: 'AllevOnco 100mg' }
            ],
            strategicExceptions: [
              { id: 'exc-1', type: 'TERRITORY_UNDERPERFORMING', title: 'Patna & Bihar Central', issue: 'Quota attainment at 64% (Gap: ₹18.4L)', severity: 'HIGH' },
              { id: 'exc-2', type: 'COVERAGE_GAP', title: 'Apollo Hospitals Cluster (South)', issue: 'Institutional coverage down 15% this quarter', severity: 'MEDIUM' },
              { id: 'exc-3', type: 'HIGH_VALUE_ORDER', title: 'Max Healthcare Consignment', issue: 'Consignment order of ₹1.45L pending director concurrence', severity: 'ACTION_REQUIRED' }
            ],
            strategicApprovals: [
              { id: 'sap-1', title: 'Institutional Rate Contract - Medanta Medicity', category: 'Commercial Discount', value: '₹ 12.5 Lakhs', requestedBy: 'Priya Mukherjee (RSM)', date: 'Today' },
              { id: 'sap-2', title: 'Annual CME Doctor Sponsorship - CSI Cardiology Conference', category: 'Medical Affairs', value: '₹ 3.8 Lakhs', requestedBy: 'Dr. Rajesh Sharma', date: 'Yesterday' }
            ]
          }
        };
      }

      if (uRole === 'ACCOUNTANT') {
        return {
          success: true,
          role: 'ACCOUNTANT',
          data: {
            metrics: {
              totalClaimsValueMonth: 485000,
              claimsAwaitingVerificationCount: 8,
              claimsAwaitingVerificationValue: 64200,
              approvedPendingPayoutCount: 14,
              approvedPendingPayoutValue: 128500,
              totalDisbursedMonth: 292300,
              policyViolationCount: 3,
              averageTurnaroundDays: 2.1
            },
            claimsAging: { under3Days: 12, days3to7: 6, over7Days: 1 },
            categorySpend: [
              { category: 'Daily Allowance (DA)', amount: 185000, share: 38 },
              { category: 'Travel Allowance (TA / Fuel)', amount: 165000, share: 34 },
              { category: 'Hotel & Lodging (Outstation)', amount: 82000, share: 17 },
              { category: 'Physician Detailing / Refreshments', amount: 53000, share: 11 }
            ],
            pendingClaimsQueue: (store.expenses || []).slice(0, 4),
            recentReimbursements: [
              { batchId: 'BATCH-2026-09B', date: '25 Sep 2026', count: 18, totalAmount: 142800, status: 'PROCESSED', bankRef: 'HDFC-NEFT-991204' },
              { batchId: 'BATCH-2026-09A', date: '10 Sep 2026', count: 22, totalAmount: 189400, status: 'PROCESSED', bankRef: 'HDFC-NEFT-881920' }
            ]
          }
        };
      }

      if (uRole === 'MANAGER') {
        return {
          success: true,
          role: 'MANAGER',
          data: {
            metrics: {
              teamQuotaTarget: 1850000,
              teamAchieved: 1640000,
              teamQuotaPct: 88.6,
              teamAttendancePresent: 5,
              teamAttendanceTotal: 6,
              teamVisitsToday: 38,
              pendingTeamDCRs: 4,
              pendingTeamLeave: 2,
              pendingTeamExpenses: 3
            },
            teamRoster: [
              { id: 'EMP-007', name: 'Amit Verma', role: 'MR', territory: 'South Delhi & Saket', attendance: 'CHECKED_IN', checkInTime: '09:15 AM', visitsLogged: 8, targetAchievedPct: 92, status: 'In Clinic (Max Hospital Saket)' },
              { id: 'EMP-008', name: 'Rohit Khanna', role: 'MR', territory: 'Central Delhi Belt', attendance: 'CHECKED_IN', checkInTime: '09:28 AM', visitsLogged: 6, targetAchievedPct: 84, status: 'In Transit' },
              { id: 'EMP-009', name: 'Neeraj Joshi', role: 'MR', territory: 'Noida Sector 62', attendance: 'CHECKED_IN', checkInTime: '09:05 AM', visitsLogged: 7, targetAchievedPct: 89, status: 'Chemist Call (Apollo)' },
              { id: 'EMP-010', name: 'Vikas Malhotra', role: 'MR', territory: 'Gurugram Commercial', attendance: 'LEAVE_APPROVED', checkInTime: '-', visitsLogged: 0, targetAchievedPct: 78, status: 'Casual Leave' },
              { id: 'EMP-005', name: 'Suresh Raina', role: 'MR_SUPERVISOR', territory: 'Delhi NCR Area', attendance: 'CHECKED_IN', checkInTime: '08:50 AM', visitsLogged: 4, targetAchievedPct: 94, status: 'Joint Fieldwork' }
            ],
            pendingApprovalsList: [
              { id: 'DCR-REV-101', type: 'DCR', employee: 'Amit Verma', summary: 'DCR for 27 Sep 2026 (9 doctor calls, 3 chemist POBs)', date: '27 Sep 2026', status: 'SUBMITTED' },
              { id: 'LEV-REQ-201', type: 'LEAVE', employee: 'Neeraj Joshi', summary: 'Sick Leave (2 days: 30 Sep - 01 Oct 2026)', date: '28 Sep 2026', status: 'PENDING' },
              { id: 'EXP-REV-301', type: 'EXPENSE', employee: 'Rohit Khanna', summary: 'Local Travel & Daily Allowance (₹3,450)', date: '26 Sep 2026', status: 'PENDING' }
            ]
          }
        };
      }

      if (uRole === 'SALES_MANAGER') {
        return {
          success: true,
          role: 'SALES_MANAGER',
          data: {
            metrics: {
              commercialRevenue: 16400000,
              commercialTarget: 18500000,
              commercialPct: 88.6,
              momGrowthPct: 12.4,
              pobOrdersCount: 148,
              pobOrdersValue: 4850000,
              activeStockistsCount: 24,
              topBrand: 'CardioShield 50mg (₹1.45 Cr)',
              topTerritory: 'Delhi NCR - Saket (112% Quota)'
            },
            repLeaderboard: [
              { rank: 1, name: 'Amit Verma', territory: 'South Delhi', target: 450000, achieved: 414000, pct: 92, ordersCount: 28 },
              { rank: 2, name: 'Neeraj Joshi', territory: 'Noida Sector 62', target: 400000, achieved: 356000, pct: 89, ordersCount: 22 },
              { rank: 3, name: 'Rohit Khanna', territory: 'Central Delhi', target: 420000, achieved: 352800, pct: 84, ordersCount: 20 },
              { rank: 4, name: 'Vikas Malhotra', territory: 'Gurugram Phase 1', target: 480000, achieved: 374400, pct: 78, ordersCount: 18 }
            ],
            competitorPulse: [
              { brand: 'CardioShield 50mg', ourShare: 38, competitor: 'Cardace (Sanofi)', compShare: 42, delta: '+3.2%' },
              { brand: 'GlucoMet Forte 500/5', ourShare: 45, competitor: 'Janumet (MSD)', compShare: 35, delta: '+5.4%' },
              { brand: 'NeuroCalm Plus', ourShare: 29, competitor: 'Nexito (Sun)', compShare: 51, delta: '+1.8%' }
            ],
            pendingCommercialOrders: (store.orders || []).slice(0, 3)
          }
        };
      }

      if (uRole === 'MR_SUPERVISOR' || uRole === 'SALES_SUPERVISOR') {
        return {
          success: true,
          role: 'MR_SUPERVISOR',
          data: {
            metrics: {
              supervisedMRsCount: 3,
              onDutyTodayCount: 3,
              scheduledVisitsToday: 30,
              completedVisitsToday: 24,
              completionRatePct: 80,
              dcrSubmissionRatePct: 100,
              todayPobValue: 142500,
              pendingDcrReviews: 3
            },
            supervisedRepsLive: [
              { id: 'EMP-007', name: 'Amit Verma', territory: 'South Delhi (DEL-SAK)', punchTime: '09:15 AM', callsDone: 8, callsTarget: 10, lastCall: 'Dr. Arvind Mehra (11:30 AM)', pobToday: 24500, status: 'In-Clinic' },
              { id: 'EMP-008', name: 'Rohit Khanna', territory: 'Central Delhi (DEL-GRP)', punchTime: '09:28 AM', callsDone: 6, callsTarget: 10, lastCall: 'Dr. Sunita Rao (01:15 PM)', pobToday: 18000, status: 'In-Transit' },
              { id: 'EMP-009', name: 'Neeraj Joshi', territory: 'Noida (NOI-S62)', punchTime: '09:05 AM', callsDone: 7, callsTarget: 10, lastCall: 'Apollo Pharmacy (02:45 PM)', pobToday: 32000, status: 'Chemist Call' }
            ],
            dcrReviewQueue: (store.dcrs || []).slice(0, 3),
            jointFieldPlan: [
              { date: 'Tomorrow, 29 Sep', rep: 'Amit Verma', area: 'Saket Hospitals Belt', focus: 'CardioShield Oncology Launch' },
              { date: 'Thursday, 01 Oct', rep: 'Neeraj Joshi', area: 'Noida Sector 62 & 18', focus: 'Chemist POB Drive' }
            ]
          }
        };
      }

      if (uRole === 'MR') {
        return {
          success: true,
          role: 'MR',
          data: {
            todayAttendance: {
              isCheckedIn: true,
              checkInTime: '09:15 AM',
              location: 'Saket Field HQ, New Delhi',
              gpsAccuracy: '±4m',
              status: 'PRESENT_FIELD'
            },
            metrics: {
              monthlyTarget: 450000,
              monthlyAchieved: 385400,
              quotaPct: 86,
              rankInTerritory: 'Rank #1 in South Delhi Belt',
              todayCallsTarget: 10,
              todayCallsCompleted: 6,
              todayPobBooked: 24500,
              samplesOnHand: 52
            },
            todayCallSchedule: [
              { id: 'call-1', customerName: 'Dr. Arvind Mehra', specialty: 'Cardiologist', institution: 'Max Super Speciality Hospital, Saket', time: '10:30 AM', status: 'COMPLETED', productsDetailed: ['CardioShield 50mg', 'NeuroCalm Plus'], samplesGiven: 4, feedback: 'Prescribing CardioShield regularly. Requested 2 more samples next visit.' },
              { id: 'call-2', customerName: 'Dr. Sunita Rao', specialty: 'Endocrinologist', institution: 'Saket Diabetes Clinic', time: '12:15 PM', status: 'COMPLETED', productsDetailed: ['GlucoMet Forte 500/5'], samplesGiven: 6, feedback: 'Interested in clinical trial data for GlucoMet.' },
              { id: 'call-3', customerName: 'Apollo Pharmacy Saket', specialty: 'Retail Chemist', institution: 'Press Enclave Marg', time: '02:30 PM', status: 'COMPLETED', pobValue: 24500, feedback: 'Booked POB order for Apex Pharma Stockist.' },
              { id: 'call-4', customerName: 'Dr. Rajesh Gupta', specialty: 'Physician', institution: 'Hauz Khas Medical Centre', time: '04:30 PM', status: 'PENDING', productsDetailed: [], samplesGiven: 0, feedback: '' },
              { id: 'call-5', customerName: 'MedPlus Pharmacy Sector 4', specialty: 'Retail Chemist', institution: 'Malviya Nagar Market', time: '05:45 PM', status: 'PENDING', pobValue: 0, feedback: '' }
            ],
            sampleInventory: [
              { product: 'CardioShield 50mg', batch: 'CS-2026-B8', allocated: 40, distributed: 20, remaining: 20, expiry: '12/2027' },
              { product: 'GlucoMet Forte 500/5', batch: 'GM-2026-C2', allocated: 30, distributed: 16, remaining: 14, expiry: '09/2027' },
              { product: 'NeuroCalm Plus', batch: 'NC-2026-A1', allocated: 25, distributed: 13, remaining: 12, expiry: '06/2028' },
              { product: 'AllevOnco 100mg', batch: 'AO-2026-K9', allocated: 10, distributed: 4, remaining: 6, expiry: '03/2028' }
            ],
            dcrStatus: {
              todayDate: '28 Sep 2026',
              status: 'DRAFT',
              visitsCount: 3,
              pendingCount: 2,
              readyToSubmit: true
            }
          }
        };
      }

      // ADMIN DEFAULT
      return {
        success: true,
        role: 'ADMIN',
        data: {
          metrics: {
            totalRevenue: 385400,
            monthlyQuota: 450000,
            monthlyAchieved: 385400,
            quotaAchievementPct: 86,
            doctorCoveragePct: 88,
            totalDoctorVisits: 198,
            targetDoctorVisits: 220,
            totalChemistVisits: 142,
            pendingApprovalsCount: (store.approvals || []).filter(a => a.status === 'PENDING').length || 5,
            activeFieldRepsCount: 14,
            totalRegisteredDoctors: 12,
            totalRegisteredChemists: 8,
            dcrCompliancePct: 92,
            pendingDCRs: 4,
            pendingExpenses: 5,
            pendingOrders: 3
          },
          recentVisits: (store.visits || []).slice(0, 5),
          recentOrders: (store.orders || []).slice(0, 5),
          brandPerformance: [
            { brand: 'CardioShield 50mg', sales: 145000, target: 150000, pct: 97 },
            { brand: 'GlucoMet Forte 500/5', sales: 112400, target: 120000, pct: 94 },
            { brand: 'NeuroCalm Plus', sales: 88000, target: 100000, pct: 88 },
            { brand: 'AllevOnco 100mg', sales: 40000, target: 80000, pct: 50 }
          ],
          todayAttendance: {
            status: 'PRESENT_FIELD',
            punchInTime: '09:15 AM',
            punchInLocation: 'Saket Field HQ, New Delhi',
            totalHours: 7.5
          }
        }
      };
    }

    if (urlPath.includes('/catalog/products')) return { success: true, data: store.products || [] };
    if (urlPath.includes('/catalog/doctors')) return { success: true, data: store.doctors || [] };
    if (urlPath.includes('/catalog/chemists')) return { success: true, data: store.chemists || [] };
    if (urlPath.includes('/catalog/stockists')) return { success: true, data: store.stockists || [] };
    if (urlPath.includes('/catalog/hospitals')) return { success: true, data: store.hospitals || [] };
    if (urlPath.includes('/catalog/divisions')) return { success: true, data: store.divisions || [] };
    if (urlPath.includes('/catalog/competitors')) return { success: true, data: store.competitors || [] };

    if (urlPath.includes('/dcr')) return { success: true, data: store.dcrs || [] };
    if (urlPath.includes('/orders')) return { success: true, data: store.orders || [] };
    if (urlPath.includes('/expenses')) return { success: true, data: store.expenses || [] };
    if (urlPath.includes('/tour-plans')) return { success: true, data: store.tourPlans || [] };
    if (urlPath.includes('/visits')) return { success: true, data: store.visits || [] };

    if (urlPath.includes('/attendance')) {
      return {
        success: true,
        data: store.attendanceRecords || [],
        leaves: {
          casualLeaveBalance: 7,
          sickLeaveBalance: 5,
          earnedLeaveBalance: 12,
          pendingRequests: store.leaveRequests || []
        }
      };
    }

    if (urlPath.includes('/tracking')) {
      return {
        success: true,
        activeFieldOfficers: [
          {
            id: 'FO-01',
            name: 'Amit Verma',
            role: 'MR (Field Officer)',
            territory: 'Saket & Malviya Nagar',
            currentLocation: 'Max Super Speciality Hospital, Saket',
            lat: 28.5284,
            lng: 77.2185,
            battery: '84%',
            speed: '18 km/h',
            lastPing: '2 mins ago',
            status: 'ONLINE'
          },
          {
            id: 'FO-02',
            name: 'Rohit Khanna',
            role: 'Senior MR',
            territory: 'Central Delhi',
            currentLocation: 'Sir Ganga Ram Hospital',
            lat: 28.6389,
            lng: 77.1896,
            battery: '92%',
            speed: '0 km/h (In Clinic)',
            lastPing: 'Just now',
            status: 'ONLINE'
          }
        ]
      };
    }

    if (urlPath.includes('/organization')) {
      return {
        success: true,
        zones: store.zones || [],
        regions: store.regions || [],
        areas: store.areas || [],
        territories: store.territories || [],
        headquarters: store.headquarters || []
      };
    }

    if (urlPath.includes('/employees') || urlPath.includes('/users')) {
      return { success: true, data: store.employees || [] };
    }

    if (urlPath.includes('/samples')) {
      return {
        success: true,
        inventory: store.sampleInventory || [],
        promotions: store.promotionalMaterials || []
      };
    }

    if (urlPath.includes('/targets') || urlPath.includes('/sales')) {
      return { success: true, data: store.salesTargets || [] };
    }

    if (urlPath.includes('/approvals')) return { success: true, data: store.approvals || [] };
    if (urlPath.includes('/audit-logs')) return { success: true, data: store.auditLogs || [] };
    if (urlPath.includes('/training')) return { success: true, data: store.trainingCourses || [] };
    if (urlPath.includes('/settings')) return { success: true, data: store.companySettings || {} };
    if (urlPath.includes('/notifications')) return { success: true, data: [], unreadCount: 2 };
  }

  // --- POST / PATCH / MUTATIONS ---
  let payload = {};
  try {
    payload = options.body ? JSON.parse(options.body) : {};
  } catch (e) {
    payload = {};
  }

  if (urlPath.includes('/dcr')) {
    if (method === 'POST') {
      const newDcr = {
        id: `dcr-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'SUBMITTED',
        ...payload
      };
      updateLocalStore('dcrs', list => [newDcr, ...(list || [])]);
      // Also register in approvals queue
      updateLocalStore('approvals', apps => [
        {
          id: `APP-${Date.now()}`,
          type: 'DCR',
          title: `DCR - ${payload.targetName || 'Doctor Call'}`,
          submitter: payload.mrName || 'Field Officer',
          role: 'MR',
          amountOrUnits: payload.feedback || 'Visit completed with sample distribution',
          submittedAt: 'Just now',
          status: 'PENDING',
          modulePath: 'dcr'
        },
        ...(apps || [])
      ]);
      return { success: true, data: newDcr };
    }
  }

  if (urlPath.includes('/orders')) {
    if (method === 'POST') {
      const newOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `ALV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'PENDING_APPROVAL',
        date: new Date().toISOString().split('T')[0],
        ...payload
      };
      updateLocalStore('orders', list => [newOrder, ...(list || [])]);
      return { success: true, data: newOrder };
    }
  }

  if (urlPath.includes('/expenses')) {
    if (method === 'POST') {
      const newExp = {
        id: `exp-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'PENDING_REVIEW',
        ...payload
      };
      updateLocalStore('expenses', list => [newExp, ...(list || [])]);
      return { success: true, data: newExp };
    }
  }

  if (urlPath.includes('/attendance/punch-in') || urlPath.includes('/attendance/punch-out')) {
    const punch = {
      id: `ATT-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: urlPath.includes('punch-in') ? 'PRESENT_FIELD' : 'DAY_COMPLETED',
      ...payload
    };
    updateLocalStore('attendanceRecords', list => [punch, ...(list || [])]);
    return { success: true, data: punch };
  }

  if (urlPath.includes('/attendance/leave-request')) {
    const leave = {
      id: `LEV-${Date.now()}`,
      appliedOn: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      ...payload
    };
    updateLocalStore('leaveRequests', list => [leave, ...(list || [])]);
    return { success: true, data: leave };
  }

  return { success: true, message: 'Operation processed successfully in enterprise store' };
}

// =========================================================================
// EXPORTED OPERATIONAL API METHODS
// =========================================================================

// 1. Dashboard Summary
export const getDashboardSummary = (role) => fetchWithAuth(`/dashboard/summary${role ? `?role=${role}` : ''}`);

// 2. Catalog APIs (Products, Doctors, Chemists, Stockists, Hospitals, Divisions, Competitors)
export const getProducts = (params = {}) => fetchWithAuth(`/catalog/products?${new URLSearchParams(params)}`);
export const getDoctors = (params = {}) => fetchWithAuth(`/catalog/doctors?${new URLSearchParams(params)}`);
export const addDoctor = (docData) => fetchWithAuth('/catalog/doctors', { method: 'POST', body: JSON.stringify(docData) });
export const getChemists = (params = {}) => fetchWithAuth(`/catalog/chemists?${new URLSearchParams(params)}`);
export const getStockists = () => fetchWithAuth('/catalog/stockists');
export const getHospitals = () => fetchWithAuth('/catalog/hospitals');
export const getDivisions = () => fetchWithAuth('/catalog/divisions');
export const getCompetitors = () => fetchWithAuth('/catalog/competitors');

// 3. Field Visits 360°
export const getVisits = () => fetchWithAuth('/visits');
export const recordVisit = (visitData) => fetchWithAuth('/visits', { method: 'POST', body: JSON.stringify(visitData) });

// 4. DCR APIs
export const getDcrReports = (params = {}) => fetchWithAuth(`/dcr?${new URLSearchParams(params)}`);
export const submitDcr = (dcrData) => fetchWithAuth('/dcr', { method: 'POST', body: JSON.stringify(dcrData) });
export const updateDcrStatus = (id, status) => fetchWithAuth(`/dcr/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

// 5. Orders APIs
export const getOrders = (params = {}) => fetchWithAuth(`/orders?${new URLSearchParams(params)}`);
export const createOrder = (orderData) => fetchWithAuth('/orders', { method: 'POST', body: JSON.stringify(orderData) });
export const updateOrderStatus = (id, status) => fetchWithAuth(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

// 6. Expenses APIs
export const getExpenses = (params = {}) => fetchWithAuth(`/expenses?${new URLSearchParams(params)}`);
export const submitExpense = (expenseData) => fetchWithAuth('/expenses', { method: 'POST', body: JSON.stringify(expenseData) });
export const updateExpenseStatus = (id, status, managerRemarks = '') => fetchWithAuth(`/expenses/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, managerRemarks }) });

// 7. Tour Plans (MTP)
export const getTourPlans = () => fetchWithAuth('/tour-plans');
export const createTourPlan = (planData) => fetchWithAuth('/tour-plans', { method: 'POST', body: JSON.stringify(planData) });

// 8. Attendance & Leaves
export const getAttendance = () => fetchWithAuth('/attendance');
export const recordPunchIn = (data) => fetchWithAuth('/attendance/punch-in', { method: 'POST', body: JSON.stringify(data) });
export const recordPunchOut = (data) => fetchWithAuth('/attendance/punch-out', { method: 'POST', body: JSON.stringify(data) });
export const applyLeave = (leaveData) => fetchWithAuth('/attendance/leave-request', { method: 'POST', body: JSON.stringify(leaveData) });

// 9. Analytics & Sales Targets
export const getAnalytics = () => fetchWithAuth('/analytics');
export const getSalesTargets = () => fetchWithAuth('/targets');
export const createTarget = (targetData) => fetchWithAuth('/targets', { method: 'POST', body: JSON.stringify(targetData) });

// 10. Live GPS Tracking
export const getLiveTracking = () => fetchWithAuth('/tracking');

// 11. AI Microservice APIs
export const optimizeRoute = (doctorIds) => fetchWithAuth('/ai/optimize-route', { method: 'POST', body: JSON.stringify({ doctorIds }) });
export const scanPrescriptionOcr = (sampleType) => fetchWithAuth('/ai/ocr-prescription', { method: 'POST', body: JSON.stringify({ sampleType }) });

// 12. Organization Hierarchy & People
export const getOrganizationHierarchy = () => fetchWithAuth('/organization');
export const addTerritory = (data) => fetchWithAuth('/organization/territory', { method: 'POST', body: JSON.stringify(data) });
export const getEmployees = (role = '') => fetchWithAuth(`/employees?role=${role}`);
export const addEmployee = (empData) => fetchWithAuth('/employees', { method: 'POST', body: JSON.stringify(empData) });

// 13. Samples & Promotional Materials
export const getSamplesAndPromotions = () => fetchWithAuth('/samples');
export const allocateSampleStock = (data) => fetchWithAuth('/samples/allocate', { method: 'POST', body: JSON.stringify(data) });
export const recordSampleHandover = (data) => fetchWithAuth('/samples/handover', { method: 'POST', body: JSON.stringify(data) });

// 14. Unified Approvals Hub
export const getApprovals = () => fetchWithAuth('/approvals');
export const decideApproval = (id, decision, reason = '') => fetchWithAuth(`/approvals/${id}/decision`, { method: 'POST', body: JSON.stringify({ decision, reason }) });

// 15. Training & LMS
export const getTrainingCourses = () => fetchWithAuth('/training');
export const completeTrainingCourse = (id) => fetchWithAuth(`/training/${id}/complete`, { method: 'POST' });

// 16. Enterprise Audit Logs
export const getAuditLogs = () => fetchWithAuth('/audit-logs');

// 17. Company Settings
export const getCompanySettings = () => fetchWithAuth('/settings');
export const updateCompanySettings = (settings) => fetchWithAuth('/settings', { method: 'PUT', body: JSON.stringify(settings) });

// 18. Notifications
export const getNotifications = () => fetchWithAuth('/notifications');
export const markNotificationRead = (id) => fetchWithAuth(`/notifications/${id}/read`, { method: 'PATCH' });
export const markAllNotificationsRead = () => fetchWithAuth('/notifications/mark-all-read', { method: 'POST' });

// 19. Auth & Multi-Tenancy
export const loginUser = (email, password, platform = 'web') => fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, platform }) });
export const getUsers = (role) => fetchWithAuth(`/users${role ? `?role=${role}` : ''}`);
export const getTenants = () => fetchWithAuth('/tenants');
export const getTenantById = (id) => fetchWithAuth(`/tenants/${id}`);
