import { Router } from 'express';
import { dcrReports } from '../data/mockStore.js';
import { requireLogin, requirePermission, ownOnly } from '../middleware/rbac.js';
import { dual, isUuid } from '../data/repo.js';
import * as repo from '../data/fieldRepo.js';

const router = Router();

// GET /api/dcr
router.get('/', requireLogin, (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = await repo.listDcr(ctx, req.query);
    return { body: { success: true, count: data.length, data } };
  },
  mock: () => {
    const { status, targetType, date } = req.query;
    let list = ownOnly(req, [...dcrReports]);
    if (status && status !== 'ALL') list = list.filter(r => r.status === status);
    if (targetType && targetType !== 'ALL') list = list.filter(r => r.targetType === targetType);
    if (date) list = list.filter(r => r.date === date);
    return { body: { success: true, count: list.length, data: list } };
  }
}));

// POST /api/dcr
router.post('/', requirePermission('dcr.create'), (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = await repo.createDcr(ctx, req.body);
    return { status: 201, body: { success: true, message: 'DCR submitted successfully', data } };
  },
  mock: () => {
    const newDcr = {
      id: `dcr-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      visitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SUBMITTED',
      ...req.body
    };
    dcrReports.unshift(newDcr);
    return { status: 201, body: { success: true, message: 'DCR submitted successfully', data: newDcr } };
  }
}));

// PATCH /api/dcr/:id/status
router.patch('/:id/status', requirePermission('dcr.approve'), (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = isUuid(req.params.id) ? await repo.setDcrStatus(ctx, req.params.id, req.body.status) : null;
    return data
      ? { body: { success: true, data } }
      : { status: 404, body: { success: false, message: 'DCR record not found' } };
  },
  mock: () => {
    const item = dcrReports.find(r => r.id === req.params.id);
    if (!item) return { status: 404, body: { success: false, message: 'DCR record not found' } };
    item.status = req.body.status || item.status;
    return { body: { success: true, data: item } };
  }
}));

export default router;
