import { Router } from 'express';
import { users } from '../data/mockStore.js';

const router = Router();

// GET /api/users
router.get('/', (req, res) => {
  const { role } = req.query;
  let list = [...users];
  if (role && role !== 'ALL') {
    list = list.filter(u => u.role === role);
  }
  res.json({ success: true, count: list.length, data: list });
});

export default router;
