import { Router } from 'express';
import { orders } from '../data/mockStore.js';
import { requireLogin, requirePermission, ownOnly } from '../middleware/rbac.js';
import { dual, isUuid } from '../data/repo.js';
import * as repo from '../data/fieldRepo.js';

const router = Router();

// GET /api/orders
router.get('/', requireLogin, (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = await repo.listOrders(ctx, req.query);
    return { body: { success: true, count: data.length, data } };
  },
  mock: () => {
    const { status, search } = req.query;
    let list = ownOnly(req, [...orders]);
    if (status && status !== 'ALL') list = list.filter(o => o.status === status);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.chemistName.toLowerCase().includes(q) ||
        o.stockistName.toLowerCase().includes(q));
    }
    return { body: { success: true, count: list.length, data: list } };
  }
}));

// POST /api/orders
router.post('/', requirePermission('order.create'), (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = await repo.createOrder(ctx, req.body);
    return { status: 201, body: { success: true, message: 'Order booked successfully', data } };
  },
  mock: () => {
    const { items = [], discountPercent = 0, chemistName, stockistName, mrName = 'Amit Verma', mrId = 'usr-003', remarks } = req.body;
    const totalAmount = items.reduce((sum, item) => sum + (item.qty * (item.ptr || 0)), 0);
    const netAmount = totalAmount - (totalAmount * (discountPercent / 100));
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ALV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      mrId, mrName,
      chemistName: chemistName || 'Selected Chemist',
      stockistName: stockistName || 'Standard Stockist',
      territory: 'Delhi NCR',
      orderDate: new Date().toISOString().split('T')[0],
      items, totalAmount, discountPercent, netAmount,
      paymentTerms: '30 Days Credit', status: 'PENDING_APPROVAL', remarks: remarks || ''
    };
    orders.unshift(newOrder);
    return { status: 201, body: { success: true, message: 'Order booked successfully', data: newOrder } };
  }
}));

// PATCH /api/orders/:id/status
router.patch('/:id/status', requirePermission('order.approve'), (req, res) => dual(req, res, {
  db: async (ctx) => {
    const data = isUuid(req.params.id) ? await repo.setOrderStatus(ctx, req.params.id, req.body.status) : null;
    return data
      ? { body: { success: true, data } }
      : { status: 404, body: { success: false, message: 'Order not found' } };
  },
  mock: () => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return { status: 404, body: { success: false, message: 'Order not found' } };
    order.status = req.body.status || order.status;
    return { body: { success: true, data: order } };
  }
}));

export default router;
