import { Router } from 'express';
import { expenses } from '../data/mockStore.js';
import { requireLogin, requirePermission, ownOnly } from '../middleware/rbac.js';
import { dual, isUuid } from '../data/repo.js';
import * as repo from '../data/fieldRepo.js';

const router = Router();

// GET /api/expenses
router.get('/', requireLogin, (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = await repo.listExpenses(ctx, req.query);
    return { body: { success: true, count: data.length, data } };
  },
  mock: () => {
    const { status } = req.query;
    const list = ownOnly(req, status && status !== 'ALL' ? expenses.filter(e => e.status === status) : [...expenses]);
    return { body: { success: true, count: list.length, data: list } };
  }
}));

// POST /api/expenses
router.post('/', requirePermission('expense.create'), (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = await repo.createExpense(ctx, req.body);
    return { status: 201, body: { success: true, message: 'Expense claim submitted', data } };
  },
  mock: () => {
    const { travelKm = 0, fareRatePerKm = 4.5, dailyAllowance = 350, hotelCharges = 0, miscellaneousCharges = 0, miscDescription = '', mrName = 'Amit Verma', mrId = 'usr-003' } = req.body;
    const travelAllowance = Number(travelKm) * Number(fareRatePerKm);
    const totalClaimAmount = travelAllowance + Number(dailyAllowance) + Number(hotelCharges) + Number(miscellaneousCharges);
    const newExpense = {
      id: `exp-${Date.now()}`, mrId, mrName,
      date: new Date().toISOString().split('T')[0],
      claimType: 'DAILY_FIELD_ALLOWANCE',
      travelKm: Number(travelKm), fareRatePerKm: Number(fareRatePerKm), travelAllowance,
      dailyAllowance: Number(dailyAllowance), hotelCharges: Number(hotelCharges),
      miscellaneousCharges: Number(miscellaneousCharges), miscDescription, totalClaimAmount,
      receiptUrls: [], status: 'SUBMITTED', managerRemarks: ''
    };
    expenses.unshift(newExpense);
    return { status: 201, body: { success: true, message: 'Expense claim submitted', data: newExpense } };
  }
}));

// PATCH /api/expenses/:id/status
router.patch('/:id/status', requirePermission('expense.approve'), (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = isUuid(req.params.id) ? await repo.setExpenseStatus(ctx, req.params.id, req.body) : null;
    return data
      ? { body: { success: true, data } }
      : { status: 404, body: { success: false, message: 'Expense claim not found' } };
  },
  mock: () => {
    const expense = expenses.find(e => e.id === req.params.id);
    if (!expense) return { status: 404, body: { success: false, message: 'Expense claim not found' } };
    const { status, managerRemarks } = req.body;
    expense.status = status || expense.status;
    if (managerRemarks !== undefined) expense.managerRemarks = managerRemarks;
    return { body: { success: true, data: expense } };
  }
}));

export default router;
