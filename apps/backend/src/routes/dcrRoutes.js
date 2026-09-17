import { Router } from 'express';
import { dcrReports } from '../data/mockStore.js';

const router = Router();

// GET /api/dcr
router.get('/', (req, res) => {
  const { status, targetType, date } = req.query;
  let list = [...dcrReports];

  if (status && status !== 'ALL') {
    list = list.filter(r => r.status === status);
  }
  if (targetType && targetType !== 'ALL') {
    list = list.filter(r => r.targetType === targetType);
  }
  if (date) {
    list = list.filter(r => r.date === date);
  }

  res.json({ success: true, count: list.length, data: list });
});

// POST /api/dcr
router.post('/', (req, res) => {
  const newDcr = {
    id: `dcr-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    visitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'SUBMITTED',
    ...req.body
  };
  dcrReports.unshift(newDcr);
  res.status(201).json({ success: true, message: 'DCR submitted successfully', data: newDcr });
});

// PATCH /api/dcr/:id/status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const item = dcrReports.find(r => r.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'DCR record not found' });
  }
  item.status = status || item.status;
  res.json({ success: true, data: item });
});

export default router;
