import { Router } from 'express';
import { dcrReports, orders, expenses, doctors, attendanceRecords, territoryQuotas } from '../data/mockStore.js';

const router = Router();

// GET /api/dashboard/summary
router.get('/summary', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.netAmount || 0), 0);
  const pendingApprovalsCount = expenses.filter(e => e.status === 'SUBMITTED').length +
                               orders.filter(o => o.status === 'PENDING_APPROVAL').length;
  
  const doctorCoveragePct = Math.round((territoryQuotas.completedDoctorVisits / territoryQuotas.targetDoctorVisits) * 100);
  const revenueQuotaPct = Math.round((territoryQuotas.monthlyAchievedRevenue / territoryQuotas.monthlyTargetRevenue) * 100);

  res.json({
    success: true,
    data: {
      metrics: {
        totalRevenue,
        monthlyQuota: territoryQuotas.monthlyTargetRevenue,
        monthlyAchieved: territoryQuotas.monthlyAchievedRevenue,
        quotaAchievementPct: revenueQuotaPct,
        doctorCoveragePct,
        totalDoctorVisits: territoryQuotas.completedDoctorVisits,
        targetDoctorVisits: territoryQuotas.targetDoctorVisits,
        totalChemistVisits: territoryQuotas.completedChemistVisits,
        pendingApprovalsCount,
        activeFieldRepsCount: 1
      },
      recentVisits: dcrReports.slice(0, 5),
      recentOrders: orders.slice(0, 5),
      recentExpenses: expenses.slice(0, 4),
      brandPerformance: territoryQuotas.brandPerformance,
      todayAttendance: attendanceRecords[0]
    }
  });
});

export default router;
