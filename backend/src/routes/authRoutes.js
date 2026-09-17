import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { users } from '../data/mockStore.js';
import { config } from '../config/index.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, role } = req.body;
  
  // Find matching user or fallback to matching role or default
  let user = users.find(u => u.email === email);
  if (!user && role) {
    user = users.find(u => u.role === role);
  }
  if (!user) {
    user = users[0]; // fallback default admin
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Authentication successful',
    token,
    user
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ user: users[0] });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = users.find(u => u.id === decoded.id) || decoded;
    res.json({ user });
  } catch (err) {
    res.json({ user: users[0] });
  }
});

export default router;
