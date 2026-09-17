import { Router } from 'express';
import { expenses } from '../data/mockStore.js';

const router = Router();

// GET /api/expenses
router.get('/', (req, res) => {
  const { status } = req.query;
  let list = [...expenses];
  if (status && status !== 'ALL') {
    list = list.filter(e => e.status === status);
  }
  res.json({ success: true, count: list.length, data: list });
});

// POST /api/expenses
router.post('/', (req, res) => {
  const { travelKm = 0, fareRatePerKm = 4.5, dailyAllowance = 350, hotelCharges = 0, miscellaneousCharges = 0, miscDescription = '', mrName = 'Amit Verma', mrId = 'usr-003' } = req.body;

  const travelAllowance = Number(travelKm) * Number(fareRatePerKm);
  const totalClaimAmount = travelAllowance + Number(dailyAllowance) + Number(hotelCharges) + Number(miscellaneousCharges);

  const newExpense = {
    id: `exp-${Date.now()}`,
    mrId,
    mrName,
    date: new Date().toISOString().split('T')[0],
    claimType: 'DAILY_FIELD_ALLOWANCE',
    travelKm: Number(travelKm),
    fareRatePerKm: Number(fareRatePerKm),
    travelAllowance,
    dailyAllowance: Number(dailyAllowance),
    hotelCharges: Number(hotelCharges),
    miscellaneousCharges: Number(miscellaneousCharges),
    miscDescription,
    totalClaimAmount,
    receiptUrls: [],
    status: 'SUBMITTED',
    managerRemarks: ''
  };

  expenses.unshift(newExpense);
  res.status(201).json({ success: true, message: 'Expense claim submitted', data: newExpense });
});

// PATCH /api/expenses/:id/status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, managerRemarks } = req.body;
  const expense = expenses.find(e => e.id === id);
  if (!expense) {
    return res.status(404).json({ success: false, message: 'Expense claim not found' });
  }
  expense.status = status || expense.status;
  if (managerRemarks !== undefined) expense.managerRemarks = managerRemarks;
  res.json({ success: true, data: expense });
});

export default router;
