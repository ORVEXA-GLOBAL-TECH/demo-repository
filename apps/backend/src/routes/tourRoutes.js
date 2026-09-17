import { Router } from 'express';
import { tourPlans } from '../data/mockStore.js';

const router = Router();

// GET /api/tour-plans
router.get('/', (req, res) => {
  res.json({ success: true, count: tourPlans.length, data: tourPlans });
});

// POST /api/tour-plans
router.post('/', (req, res) => {
  const newPlan = {
    id: `tp-${Date.now()}`,
    status: 'PLANNED',
    ...req.body
  };
  tourPlans.unshift(newPlan);
  res.status(201).json({ success: true, data: newPlan });
});

export default router;
