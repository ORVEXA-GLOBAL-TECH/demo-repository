import { Router } from 'express';
import { dcrReports, orders, expenses, doctors, chemists, attendanceRecords, territoryQuotas } from '../data/mockStore.js';

const router = Router();

// GET /api/dashboard/summary - Fully dynamic live computation
router.get('/summary', (req, res) => {
  // Compute real-time revenue from orders
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.netAmount) || 0), 0);
  const monthlyQuota = Number(territoryQuotas.monthlyTargetRevenue) || 450000;
  const quotaAchievementPct = monthlyQuota > 0 ? Math.round((totalRevenue / monthlyQuota) * 100) : 0;

  // Compute live visit metrics
  const doctorVisitsCount = dcrReports.filter(d => d.targetType === 'DOCTOR' || d.targetType === 'Doctor').length;
  const chemistVisitsCount = dcrReports.filter(d => d.targetType === 'CHEMIST' || d.targetType === 'Chemist').length;
  const totalDoctorTarget = doctors.length * 2 || 220;
  const doctorCoveragePct = totalDoctorTarget > 0 ? Math.min(100, Math.round((doctorVisitsCount / totalDoctorTarget) * 100)) : 0;

  // Compute pending approvals across orders & expenses
  const pendingOrders = orders.filter(o => o.status === 'PENDING_APPROVAL').length;
  const pendingExpenses = expenses.filter(e => e.status === 'SUBMITTED').length;
  const pendingApprovalsCount = pendingOrders + pendingExpenses;

  // Compute live brand performance from actual orders placed
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

  res.json({
    success: true,
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
        activeFieldRepsCount: 1,
        totalRegisteredDoctors: doctors.length,
        totalRegisteredChemists: chemists.length
      },
      recentVisits: dcrReports.slice(0, 5),
      recentOrders: orders.slice(0, 5),
      recentExpenses: expenses.slice(0, 5),
      brandPerformance: dynamicBrandPerformance,
      todayAttendance: attendanceRecords[0] || null
    }
  });
});

export default router;
