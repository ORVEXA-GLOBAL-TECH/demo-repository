import { Router } from 'express';
import { doctors, chemists, products, stockists } from '../data/mockStore.js';

const router = Router();

// ==================== PRODUCTS ====================
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

// POST /api/catalog/products
router.post('/products', (req, res) => {
  const newProduct = {
    id: `prod-${Date.now()}`,
    name: req.body.name || 'New Pharmaceutical Product',
    category: req.body.category || 'General',
    composition: req.body.composition || '',
    indication: req.body.indication || '',
    mrp: Number(req.body.mrp) || 0,
    ptr: Number(req.body.ptr) || 0,
    pts: Number(req.body.pts) || 0,
    gstPct: Number(req.body.gstPct) || 12,
    packSize: req.body.packSize || '10x10 Tablets',
    stockAvailable: Number(req.body.stockAvailable) || 100,
    sampleAvailable: Number(req.body.sampleAvailable) || 20
  };
  products.unshift(newProduct);
  res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
});

// PUT /api/catalog/products/:id
router.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
  products[idx] = { ...products[idx], ...req.body };
  res.json({ success: true, message: 'Product updated successfully', data: products[idx] });
});

// DELETE /api/catalog/products/:id
router.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
  const deleted = products.splice(idx, 1)[0];
  res.json({ success: true, message: 'Product deleted successfully', data: deleted });
});

// ==================== DOCTORS ====================
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

// POST /api/catalog/doctors
router.post('/doctors', (req, res) => {
  const newDoctor = {
    id: `doc-${Date.now()}`,
    name: req.body.name || 'Dr. New Doctor',
    specialty: req.body.specialty || 'General Physician',
    qualification: req.body.qualification || 'MBBS',
    hospital: req.body.hospital || 'City Clinic',
    territory: req.body.territory || 'South Delhi',
    class: req.body.class || 'A',
    potential: req.body.potential || 'Medium (50+ Rx/mo)',
    monthlyTargetVisits: Number(req.body.monthlyTargetVisits) || 2,
    completedVisitsThisMonth: 0,
    visitingDays: req.body.visitingDays || ['Mon', 'Thu'],
    timing: req.body.timing || '10:00 AM - 01:00 PM',
    phone: req.body.phone || '+91 9800000000',
    address: req.body.address || 'Medical Enclave, Delhi',
    geoLat: Number(req.body.geoLat) || 28.5355,
    geoLng: Number(req.body.geoLng) || 77.2410,
    keyPrescribingProducts: req.body.keyPrescribingProducts || []
  };
  doctors.unshift(newDoctor);
  res.status(201).json({ success: true, message: 'Doctor added to registry', data: newDoctor });
});

// PUT /api/catalog/doctors/:id
router.put('/doctors/:id', (req, res) => {
  const { id } = req.params;
  const idx = doctors.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Doctor not found' });
  doctors[idx] = { ...doctors[idx], ...req.body };
  res.json({ success: true, message: 'Doctor profile updated', data: doctors[idx] });
});

// DELETE /api/catalog/doctors/:id
router.delete('/doctors/:id', (req, res) => {
  const { id } = req.params;
  const idx = doctors.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Doctor not found' });
  const deleted = doctors.splice(idx, 1)[0];
  res.json({ success: true, message: 'Doctor removed from registry', data: deleted });
});

// ==================== CHEMISTS ====================
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

// POST /api/catalog/chemists
router.post('/chemists', (req, res) => {
  const newChemist = {
    id: `chm-${Date.now()}`,
    name: req.body.name || 'New Chemist Store',
    contactPerson: req.body.contactPerson || 'Proprietor',
    phone: req.body.phone || '+91 9800000000',
    drugLicense: req.body.drugLicense || `DL-${Math.floor(100000 + Math.random() * 900000)}`,
    gstin: req.body.gstin || `07AAAAA${Math.floor(1000 + Math.random() * 9000)}1Z5`,
    territory: req.body.territory || 'South Delhi',
    address: req.body.address || 'Market Complex, Delhi',
    associatedStockist: req.body.associatedStockist || 'Apex Pharma Distributors',
    outstandingDues: Number(req.body.outstandingDues) || 0,
    creditLimit: Number(req.body.creditLimit) || 100000
  };
  chemists.unshift(newChemist);
  res.status(201).json({ success: true, message: 'Chemist registered successfully', data: newChemist });
});

// PUT /api/catalog/chemists/:id
router.put('/chemists/:id', (req, res) => {
  const { id } = req.params;
  const idx = chemists.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Chemist not found' });
  chemists[idx] = { ...chemists[idx], ...req.body };
  res.json({ success: true, message: 'Chemist updated successfully', data: chemists[idx] });
});

// DELETE /api/catalog/chemists/:id
router.delete('/chemists/:id', (req, res) => {
  const { id } = req.params;
  const idx = chemists.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Chemist not found' });
  const deleted = chemists.splice(idx, 1)[0];
  res.json({ success: true, message: 'Chemist deleted successfully', data: deleted });
});

// ==================== STOCKISTS ====================
// GET /api/catalog/stockists
router.get('/stockists', (req, res) => {
  res.json({ success: true, count: stockists.length, data: stockists });
});

// POST /api/catalog/stockists
router.post('/stockists', (req, res) => {
  const newStockist = {
    id: `stk-${Date.now()}`,
    name: req.body.name || 'New Wholesale Stockist',
    territory: req.body.territory || 'Delhi Central Hub',
    contactPerson: req.body.contactPerson || 'Managing Partner',
    phone: req.body.phone || '+91 9800000000',
    gstin: req.body.gstin || `07AAAAA${Math.floor(1000 + Math.random() * 9000)}1Z1`,
    creditLimit: Number(req.body.creditLimit) || 2000000,
    currentOutstanding: Number(req.body.currentOutstanding) || 0,
    rating: req.body.rating || 'A+'
  };
  stockists.unshift(newStockist);
  res.status(201).json({ success: true, message: 'Stockist registered successfully', data: newStockist });
});

// PUT /api/catalog/stockists/:id
router.put('/stockists/:id', (req, res) => {
  const { id } = req.params;
  const idx = stockists.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Stockist not found' });
  stockists[idx] = { ...stockists[idx], ...req.body };
  res.json({ success: true, message: 'Stockist updated successfully', data: stockists[idx] });
});

// DELETE /api/catalog/stockists/:id
router.delete('/stockists/:id', (req, res) => {
  const { id } = req.params;
  const idx = stockists.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Stockist not found' });
  const deleted = stockists.splice(idx, 1)[0];
  res.json({ success: true, message: 'Stockist removed successfully', data: deleted });
});

export default router;
