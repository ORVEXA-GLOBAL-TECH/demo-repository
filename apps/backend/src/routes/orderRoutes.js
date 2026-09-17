import { Router } from 'express';
import { orders } from '../data/mockStore.js';

const router = Router();

// GET /api/orders
router.get('/', (req, res) => {
  const { status, search } = req.query;
  let list = [...orders];

  if (status && status !== 'ALL') {
    list = list.filter(o => o.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(o =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.chemistName.toLowerCase().includes(q) ||
      o.stockistName.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: list.length, data: list });
});

// POST /api/orders
router.post('/', (req, res) => {
  const { items = [], discountPercent = 0, chemistName, stockistName, mrName = 'Amit Verma', mrId = 'usr-003', remarks } = req.body;

  const totalAmount = items.reduce((sum, item) => sum + (item.qty * (item.ptr || 0)), 0);
  const netAmount = totalAmount - (totalAmount * (discountPercent / 100));

  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber: `ALV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    mrId,
    mrName,
    chemistName: chemistName || 'Selected Chemist',
    stockistName: stockistName || 'Standard Stockist',
    territory: 'Delhi NCR',
    orderDate: new Date().toISOString().split('T')[0],
    items,
    totalAmount,
    discountPercent,
    netAmount,
    paymentTerms: '30 Days Credit',
    status: 'PENDING_APPROVAL',
    remarks: remarks || ''
  };

  orders.unshift(newOrder);
  res.status(201).json({ success: true, message: 'Order booked successfully', data: newOrder });
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  order.status = status || order.status;
  res.json({ success: true, data: order });
});

export default router;
