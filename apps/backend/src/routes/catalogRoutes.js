import { Router } from 'express';
import { doctors, chemists, products } from '../data/mockStore.js';

const router = Router();

// GET /api/catalog/products
router.get('/products', (req, res) => {
  const { category, search } = req.query;
  let result = [...products];

  if (category && category !== 'ALL') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.composition.toLowerCase().includes(q) ||
      p.indication.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/catalog/doctors
router.get('/doctors', (req, res) => {
  const { specialty, territory, search } = req.query;
  let result = [...doctors];

  if (specialty && specialty !== 'ALL') {
    result = result.filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
  }

  if (territory && territory !== 'ALL') {
    result = result.filter(d => d.territory.toLowerCase().includes(territory.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.hospital.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// POST /api/catalog/doctors (Add doctor)
router.post('/doctors', (req, res) => {
  const newDoctor = {
    id: `doc-${Date.now()}`,
    ...req.body
  };
  doctors.unshift(newDoctor);
  res.status(201).json({ success: true, data: newDoctor });
});

// GET /api/catalog/chemists
router.get('/chemists', (req, res) => {
  const { search } = req.query;
  let result = [...chemists];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.contactPerson.toLowerCase().includes(q) ||
      c.territory.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

export default router;
