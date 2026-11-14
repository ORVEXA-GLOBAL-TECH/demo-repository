import { Router } from 'express';
import { tourPlans } from '../data/mockStore.js';
import { requireLogin, requirePermission, ownOnly } from '../middleware/rbac.js';
import { dual } from '../data/repo.js';
import * as repo from '../data/fieldRepo.js';

const router = Router();

// GET /api/tour-plans
router.get('/', requireLogin, (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = await repo.listTourPlans(ctx);
    return { body: { success: true, count: data.length, data } };
  },
  mock: () => { const data = ownOnly(req, tourPlans); return { body: { success: true, count: data.length, data } }; }
}));

// POST /api/tour-plans
router.post('/', requirePermission('tour.create'), (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = await repo.createTourPlan(ctx, req.body);
    return { status: 201, body: { success: true, data } };
  },
  mock: () => {
    const newPlan = { id: `tp-${Date.now()}`, status: 'PLANNED', ...req.body };
    tourPlans.unshift(newPlan);
    return { status: 201, body: { success: true, data: newPlan } };
  }
}));

export default router;
