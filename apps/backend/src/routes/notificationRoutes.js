import { Router } from 'express';

const router = Router();

let notifications = [
  {
    id: 'notif-1',
    title: 'New POB Order Booked',
    message: 'Amit Verma booked ₹16,743 POB for Apollo Medplus Pharmacy.',
    type: 'ORDER',
    timestamp: '10 mins ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'DCR Visit Verified with Geofence',
    message: 'Dr. Arvind Mehra call verified within 35m perimeter of Max Hospital.',
    type: 'DCR',
    timestamp: '45 mins ago',
    read: false
  },
  {
    id: 'notif-3',
    title: 'TA/DA Expense Approval Required',
    message: 'Claim #EXP-701 for ₹659 is waiting for Regional Manager sign-off.',
    type: 'EXPENSE',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif-4',
    title: 'Stockist Delivery Dispatched',
    message: 'MedLife Distributors dispatched Order #ALV-2026-0903 for Fortis Hospital.',
    type: 'STOCKIST',
    timestamp: 'Yesterday',
    read: true
  }
];

// GET /api/notifications
router.get('/', (req, res) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  res.json({
    success: true,
    unreadCount,
    data: notifications
  });
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req, res) => {
  const { id } = req.params;
  const item = notifications.find(n => n.id === id);
  if (item) item.read = true;
  res.json({ success: true, data: item });
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', (req, res) => {
  notifications.forEach(n => n.read = true);
  res.json({ success: true, message: 'All notifications marked as read' });
});

export default router;
