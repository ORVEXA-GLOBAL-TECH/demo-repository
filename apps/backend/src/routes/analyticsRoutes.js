import { Router } from 'express';
import { territoryQuotas, doctors, orders, dcrReports } from '../data/mockStore.js';

const router = Router();

// GET /api/analytics
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      quotas: territoryQuotas,
      doctorCoverageStats: {
        classAPlus: { target: 5, visited: 5, compliance: '100%' },
        classA: { target: 4, visited: 3, compliance: '75%' },
        classB: { target: 1, visited: 1, compliance: '100%' }
      },
      topDoctorsByPrescription: [
        { name: 'Dr. Arvind Mehra', specialty: 'Cardiology', hospital: 'Max Hospital', rxIndex: 96, keyProduct: 'CardioShield' },
        { name: 'Dr. Sunita Rao', specialty: 'Diabetology', hospital: 'Fortis Escorts', rxIndex: 88, keyProduct: 'GlucoMet Forte' },
        { name: 'Dr. Vikram Sethi', specialty: 'Oncology', hospital: 'Apollo Cancer', rxIndex: 82, keyProduct: 'AllevOnco' },
        { name: 'Dr. Pradeep Oberoi', specialty: 'Neurology', hospital: 'Medanta Clinic', rxIndex: 75, keyProduct: 'NeuroCalm' }
      ],
      monthlyTrend: [
        { month: 'May 2026', target: 400000, achieved: 390000 },
        { month: 'Jun 2026', target: 410000, achieved: 415000 },
        { month: 'Jul 2026', target: 425000, achieved: 430000 },
        { month: 'Aug 2026', target: 440000, achieved: 448000 },
        { month: 'Sep 2026 (MTD)', target: 450000, achieved: 385400 }
      ]
    }
  });
});

export default router;
