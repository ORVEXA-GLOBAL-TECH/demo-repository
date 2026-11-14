import { Router } from 'express';
import * as mock from '../data/mockStore.js';
import { dbReady, resolveContext } from '../data/repo.js';
import { requireLogin, effectiveRole } from '../middleware/rbac.js';
import * as field from '../data/fieldRepo.js';
import * as catalog from '../data/catalogRepo.js';

const router = Router();
const { territoryQuotas } = mock;

// Live records from PostgreSQL when reachable; the in-memory seed otherwise.
async function loadCollections(req) {
  try {
    if (await dbReady()) {
      const ctx = await resolveContext(req);
      if (ctx) {
        const [dcrReports, orders, expenses, doctors, chemists, attendanceRecords] = await Promise.all([
          field.listDcr(ctx, {}), field.listOrders(ctx, {}), field.listExpenses(ctx, {}),
          catalog.listDoctors(ctx, {}), catalog.listChemists(ctx, {}), field.listAttendance(ctx)
        ]);
        return { dcrReports, orders, expenses, doctors, chemists, attendanceRecords };
      }
    }
  } catch (err) {
    console.warn(`⚠️ [dashboard] DB read failed (${err.message}); using mock data.`);
  }
  const { dcrReports, orders, expenses, doctors, chemists, attendanceRecords } = mock;
  return { dcrReports, orders, expenses, doctors, chemists, attendanceRecords };
}

// GET /api/dashboard/summary - Role-Scoped Dynamic Enterprise Dashboard Data
router.get('/summary', requireLogin, async (req, res) => {
  const { dcrReports, orders, expenses, doctors, chemists, attendanceRecords } = await loadCollections(req);
  // The signed-in user's role decides the view (SUPER_ADMIN sees the company-admin view; ?role is only honoured for it).
  const tokenRole = effectiveRole(req.user);
  const role = (tokenRole === 'SUPER_ADMIN' && req.query.role ? req.query.role : (tokenRole === 'SUPER_ADMIN' ? 'ADMIN' : tokenRole) || 'ADMIN').toUpperCase();

  // Compute common baseline metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.netAmount) || 0), 0);
  const monthlyQuota = Number(territoryQuotas.monthlyTargetRevenue) || 450000;
  const quotaAchievementPct = monthlyQuota > 0 ? Math.round((totalRevenue / monthlyQuota) * 100) : 0;
  const doctorVisitsCount = dcrReports.filter(d => (d.targetType || '').toUpperCase() === 'DOCTOR').length;
  const chemistVisitsCount = dcrReports.filter(d => (d.targetType || '').toUpperCase() === 'CHEMIST').length;
  const totalDoctorTarget = doctors.length * 2 || 220;
  const doctorCoveragePct = totalDoctorTarget > 0 ? Math.min(100, Math.round((doctorVisitsCount / totalDoctorTarget) * 100)) : 0;

  const pendingOrders = orders.filter(o => o.status === 'PENDING_APPROVAL').length;
  const pendingExpenses = expenses.filter(e => e.status === 'SUBMITTED' || e.status === 'UNDER_REVIEW').length;
  const pendingDCRs = dcrReports.filter(d => d.status === 'SUBMITTED' || d.status === 'UNDER_REVIEW').length;
  const pendingApprovalsCount = pendingOrders + pendingExpenses + pendingDCRs;

  // Dynamic Brand Performance
  const brandSalesMap = {};
  orders.forEach(ord => {
    (ord.items || []).forEach(item => {
      const pName = item.productName || item.name || 'Core Product';
      brandSalesMap[pName] = (brandSalesMap[pName] || 0) + (Number(item.qty) * (Number(item.ptr) || 0));
    });
  });

  const dynamicBrandPerformance = Object.keys(brandSalesMap).length > 0 
    ? Object.entries(brandSalesMap).map(([brand, rev]) => ({
        brand,
        sales: rev,
        target: 120000,
        pct: Math.min(100, Math.round((rev / 120000) * 100))
      }))
    : territoryQuotas.brandPerformance;

  // ============================================================================
  // 1. DIRECTOR ROLE DATA
  // ============================================================================
  if (role === 'DIRECTOR') {
    return res.json({
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
          { id: 'exc-1', type: 'TERRITORY_UNDERPERFORMING', title: 'Patna & Bihar Central', issue: 'Quota attainment at 64% (Gap: ₹18.4L)', severity: 'HIGH', impact: 'Requires Field Intervention' },
          { id: 'exc-2', type: 'COVERAGE_GAP', title: 'Apollo Hospitals Cluster (South)', issue: 'Institutional coverage down 15% this quarter', severity: 'MEDIUM', impact: 'Key Account Risk' },
          { id: 'exc-3', type: 'HIGH_VALUE_ORDER', title: 'Max Healthcare Consignment', issue: 'Bulk order of ₹1.45L pending director concurrence', severity: 'ACTION_REQUIRED', impact: 'Commercial Clearance' }
        ],
        strategicApprovals: [
          { id: 'sap-1', title: 'Institutional Rate Contract - Medanta Medicity', category: 'Commercial Discount', value: '₹ 12.5 Lakhs', requestedBy: 'Priya Mukherjee (RSM)', date: 'Today', status: 'PENDING_DIRECTOR' },
          { id: 'sap-2', title: 'Annual CME Doctor Sponsorship - CSI Cardiology Conference', category: 'Medical Affairs', value: '₹ 3.8 Lakhs', requestedBy: 'Dr. Rajesh Sharma', date: 'Yesterday', status: 'PENDING_DIRECTOR' }
        ],
        monthlyRevenueTrend: [
          { month: 'Apr', revenue: 54000000, target: 60000000 },
          { month: 'May', revenue: 58000000, target: 62000000 },
          { month: 'Jun', revenue: 61000000, target: 65000000 },
          { month: 'Jul', revenue: 64500000, target: 68000000 },
          { month: 'Aug', revenue: 67200000, target: 70000000 },
          { month: 'Sep', revenue: 68500000, target: 80000000 }
        ]
      }
    });
  }

  // ============================================================================
  // 2. ACCOUNTANT ROLE DATA
  // ============================================================================
  if (role === 'ACCOUNTANT') {
    return res.json({
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
        claimsAging: {
          under3Days: 12,
          days3to7: 6,
          over7Days: 1
        },
        categorySpend: [
          { category: 'Daily Allowance (DA)', amount: 185000, share: 38, icon: 'Users' },
          { category: 'Travel Allowance (TA / Fuel)', amount: 165000, share: 34, icon: 'TrendingUp' },
          { category: 'Hotel & Lodging (Outstation)', amount: 82000, share: 17, icon: 'Building' },
          { category: 'Physician Detailing / Refreshments', amount: 53000, share: 11, icon: 'Receipt' }
        ],
        pendingClaimsQueue: [
          { id: 'EXP-901', employee: 'Amit Verma (MR)', employeeCode: 'ALV-E107', territory: 'South Delhi', amount: 3450, category: 'Travel Allowance (TA)', dates: '24-26 Sep 2026', policyStatus: 'COMPLIANT', receiptAttached: true, status: 'SUBMITTED' },
          { id: 'EXP-902', employee: 'Rohit Khanna (MR)', employeeCode: 'ALV-E108', territory: 'Central Delhi', amount: 4800, category: 'Daily Allowance + Fuel', dates: '22-25 Sep 2026', policyStatus: 'COMPLIANT', receiptAttached: true, status: 'SUBMITTED' },
          { id: 'EXP-903', employee: 'Suresh Raina (Supervisor)', employeeCode: 'ALV-E105', territory: 'Delhi NCR', amount: 8900, category: 'Outstation Stay & DA', dates: '20-23 Sep 2026', policyStatus: 'FLAGGED_OVER_LIMIT', limitNote: 'Hotel ₹3,200/night vs Metro cap ₹2,500/night', receiptAttached: true, status: 'UNDER_REVIEW' },
          { id: 'EXP-904', employee: 'Priya Mukherjee (RSM)', employeeCode: 'ALV-E104', territory: 'North Zone', amount: 14200, category: 'Zonal Airfare & Hotel', dates: '18-20 Sep 2026', policyStatus: 'APPROVED_BY_MANAGER', receiptAttached: true, status: 'APPROVED' }
        ],
        recentReimbursements: [
          { batchId: 'BATCH-2026-09B', date: '25 Sep 2026', count: 18, totalAmount: 142800, status: 'PROCESSED', bankRef: 'HDFC-NEFT-991204' },
          { batchId: 'BATCH-2026-09A', date: '10 Sep 2026', count: 22, totalAmount: 189400, status: 'PROCESSED', bankRef: 'HDFC-NEFT-881920' }
        ]
      }
    });
  }

  // ============================================================================
  // 3. MANAGER ROLE DATA
  // ============================================================================
  if (role === 'MANAGER') {
    return res.json({
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
    });
  }

  // ============================================================================
  // 4. SALES_MANAGER ROLE DATA
  // ============================================================================
  if (role === 'SALES_MANAGER') {
    return res.json({
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
        pendingCommercialOrders: [
          { id: 'ORD-8910', chemist: 'Apollo Pharmacy Saket', stockist: 'Apex Pharma Distributors', value: 38500, discount: '3.5%', status: 'PENDING_COMMERCIAL_APPROVAL' },
          { id: 'ORD-8911', chemist: 'MedPlus Sector 18', stockist: 'Metro Healthcare Stockists', value: 52000, discount: '5.0%', status: 'PENDING_COMMERCIAL_APPROVAL' }
        ],
        brandPerformance: dynamicBrandPerformance
      }
    });
  }

  // ============================================================================
  // 5. MR_SUPERVISOR ROLE DATA
  // ============================================================================
  if (role === 'MR_SUPERVISOR' || role === 'SALES_SUPERVISOR') {
    return res.json({
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
        dcrReviewQueue: [
          { id: 'DCR-701', mrName: 'Amit Verma', date: '27 Sep 2026', totalCalls: 9, doctorsDetailed: ['Dr. Mehra', 'Dr. Verma', 'Dr. Bajaj'], samplesGiven: 14, pobBooked: 24500, status: 'SUBMITTED' },
          { id: 'DCR-702', mrName: 'Rohit Khanna', date: '27 Sep 2026', totalCalls: 8, doctorsDetailed: ['Dr. Sunita Rao', 'Dr. Sethi'], samplesGiven: 12, pobBooked: 18000, status: 'SUBMITTED' },
          { id: 'DCR-703', mrName: 'Neeraj Joshi', date: '27 Sep 2026', totalCalls: 10, doctorsDetailed: ['Dr. Alok Nath', 'Dr. Neena Gupta'], samplesGiven: 16, pobBooked: 35000, status: 'SUBMITTED' }
        ],
        jointFieldPlan: [
          { date: 'Tomorrow, 29 Sep', rep: 'Amit Verma', area: 'Saket Hospitals Belt', focus: 'CardioShield Oncology Launch' },
          { date: 'Thursday, 01 Oct', rep: 'Neeraj Joshi', area: 'Noida Sector 62 & 18', focus: 'Chemist POB Drive' }
        ]
      }
    });
  }

  // ============================================================================
  // 6. MR (MEDICAL REPRESENTATIVE) ROLE DATA
  // ============================================================================
  if (role === 'MR') {
    return res.json({
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
    });
  }

  // ============================================================================
  // 7. ADMIN ROLE (DEFAULT)
  // ============================================================================
  res.json({
    success: true,
    role: 'ADMIN',
    data: {
      metrics: {
        totalRevenue,
        monthlyQuota,
        monthlyAchieved: totalRevenue,
        quotaAchievementPct,
        doctorCoveragePct,
        totalDoctorVisits: doctorVisitsCount,
        targetDoctorVisits: totalDoctorTarget,
        totalChemistVisits: chemistVisitsCount,
        pendingApprovalsCount,
        activeFieldRepsCount: 14,
        totalRegisteredDoctors: doctors.length,
        totalRegisteredChemists: chemists.length,
        dcrCompliancePct: 92,
        pendingDCRs,
        pendingExpenses,
        pendingOrders
      },
      recentVisits: dcrReports.slice(0, 5),
      recentOrders: orders.slice(0, 5),
      recentExpenses: expenses.slice(0, 5),
      brandPerformance: dynamicBrandPerformance,
      todayAttendance: attendanceRecords[0] || null,
      operationalAlerts: [
        { id: 'alt-1', type: 'DCR', text: '4 MR DCRs awaiting end-of-day supervisor review', time: '15m ago', severity: 'warning' },
        { id: 'alt-2', type: 'STOCK', text: 'CardioShield 50mg Central Depot inventory below threshold', time: '1h ago', severity: 'danger' },
        { id: 'alt-3', type: 'APPROVAL', text: '3 High-value Chemist POB Orders waiting for commercial sign-off', time: '2h ago', severity: 'info' }
      ]
    }
  });
});

export default router;
