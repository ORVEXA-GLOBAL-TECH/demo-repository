import { Router } from 'express';
import { doctors, chemists, products, stockists } from '../data/mockStore.js';
import { requireLogin, requirePermission, ownOnly } from '../middleware/rbac.js';
import { dual, isUuid } from '../data/repo.js';
import * as repo from '../data/catalogRepo.js';

const router = Router();

const notFound = (what) => ({ status: 404, body: { success: false, message: `${what} not found` } });

/**
 * Registers list/create/update/delete for one catalog entity.
 *  - `list`/`save`/`remove` are the DB-backed functions in catalogRepo.js
 *  - `store` is the in-memory mock array used when PostgreSQL is unavailable.
 */
function crud(path, { label, store, list, save, remove, mockList, mockDefaults, msgs, perms }) {
  router.get(`/${path}`, requireLogin, (req, res) => dual(req, res, {
    db: async (ctx) => {
      const data = await list(ctx, req.query);
      return { body: { success: true, count: data.length, data } };
    },
    mock: () => {
      const data = mockList(req.query);
      return { body: { success: true, count: data.length, data } };
    }
  }));

  router.post(`/${path}`, requirePermission(perms.create), (req, res) => dual(req, res, {
    db: async (ctx) => ({ status: 201, body: { success: true, message: msgs.created, data: await save(ctx, null, req.body) } }),
    mock: () => {
      const prefix = { products: 'prod', doctors: 'doc', chemists: 'chm', stockists: 'stk' }[path];
      const item = { id: `${prefix}-${Date.now()}`, ...mockDefaults(req.body) };
      store.unshift(item);
      return { status: 201, body: { success: true, message: msgs.created, data: item } };
    }
  }));

  router.put(`/${path}/:id`, requirePermission(perms.update), (req, res) => dual(req, res, {
    db: async (ctx) => {
      const data = isUuid(req.params.id) ? await save(ctx, req.params.id, req.body) : null;
      return data ? { body: { success: true, message: msgs.updated, data } } : notFound(label);
    },
    mock: () => {
      const idx = store.findIndex(x => x.id === req.params.id);
      if (idx === -1) return notFound(label);
      store[idx] = { ...store[idx], ...req.body };
      return { body: { success: true, message: msgs.updated, data: store[idx] } };
    }
  }));

  router.delete(`/${path}/:id`, requirePermission(perms.remove), (req, res) => dual(req, res, {
    db: async (ctx) => {
      const data = isUuid(req.params.id) ? await remove(ctx, req.params.id) : null;
      return data ? { body: { success: true, message: msgs.deleted, data } } : notFound(label);
    },
    mock: () => {
      const idx = store.findIndex(x => x.id === req.params.id);
      if (idx === -1) return notFound(label);
      const [deleted] = store.splice(idx, 1);
      return { body: { success: true, message: msgs.deleted, data: deleted } };
    }
  }));
}

const lc = (v) => String(v ?? '').toLowerCase();
const rnd = (a, b) => Math.floor(a + Math.random() * (b - a));

// ==================== PRODUCTS ====================
crud('products', {
  label: 'Product', store: products, perms: { create: 'product.create', update: 'product.update', remove: 'product.update' },
  list: repo.listProducts, save: repo.saveProduct, remove: repo.deleteProduct,
  msgs: { created: 'Product created successfully', updated: 'Product updated successfully', deleted: 'Product deleted successfully' },
  mockList: ({ category, search }) => {
    let result = [...products];
    if (category && category !== 'ALL') result = result.filter(p => lc(p.category) === lc(category));
    if (search) {
      const q = lc(search);
      result = result.filter(p => lc(p.name).includes(q) || lc(p.composition).includes(q) || lc(p.indication).includes(q));
    }
    return result;
  },
  mockDefaults: (b) => ({
    name: b.name || 'New Pharmaceutical Product', category: b.category || 'General',
    composition: b.composition || '', indication: b.indication || '',
    mrp: Number(b.mrp) || 0, ptr: Number(b.ptr) || 0, pts: Number(b.pts) || 0,
    gstPct: Number(b.gstPct) || 12, packSize: b.packSize || '10x10 Tablets',
    stockAvailable: Number(b.stockAvailable) || 100, sampleAvailable: Number(b.sampleAvailable) || 20
  })
});

// ==================== DOCTORS ====================
crud('doctors', {
  label: 'Doctor', store: doctors, perms: { create: 'doctor.create', update: 'doctor.update', remove: 'doctor.delete' },
  list: repo.listDoctors, save: repo.saveDoctor, remove: repo.deleteDoctor,
  msgs: { created: 'Doctor added to registry', updated: 'Doctor profile updated', deleted: 'Doctor removed from registry' },
  mockList: ({ specialty, territory, search }) => {
    let result = [...doctors];
    if (specialty && specialty !== 'ALL') result = result.filter(d => lc(d.specialty).includes(lc(specialty)));
    if (territory && territory !== 'ALL') result = result.filter(d => lc(d.territory).includes(lc(territory)));
    if (search) {
      const q = lc(search);
      result = result.filter(d => lc(d.name).includes(q) || lc(d.hospital).includes(q) || lc(d.specialty).includes(q));
    }
    return result;
  },
  mockDefaults: (b) => ({
    name: b.name || 'Dr. New Doctor', specialty: b.specialty || 'General Physician',
    qualification: b.qualification || 'MBBS', hospital: b.hospital || 'City Clinic',
    territory: b.territory || 'South Delhi', class: b.class || 'A',
    potential: b.potential || 'Medium (50+ Rx/mo)', monthlyTargetVisits: Number(b.monthlyTargetVisits) || 2,
    completedVisitsThisMonth: 0, visitingDays: b.visitingDays || ['Mon', 'Thu'],
    timing: b.timing || '10:00 AM - 01:00 PM', phone: b.phone || '+91 9800000000',
    address: b.address || 'Medical Enclave, Delhi',
    geoLat: Number(b.geoLat) || 28.5355, geoLng: Number(b.geoLng) || 77.2410,
    keyPrescribingProducts: b.keyPrescribingProducts || []
  })
});

// ==================== CHEMISTS ====================
crud('chemists', {
  label: 'Chemist', store: chemists, perms: { create: 'chemist.create', update: 'chemist.update', remove: 'chemist.update' },
  list: repo.listChemists, save: repo.saveChemist, remove: repo.deleteChemist,
  msgs: { created: 'Chemist registered successfully', updated: 'Chemist updated successfully', deleted: 'Chemist deleted successfully' },
  mockList: ({ search }) => {
    if (!search) return [...chemists];
    const q = lc(search);
    return chemists.filter(c => lc(c.name).includes(q) || lc(c.contactPerson).includes(q) || lc(c.territory).includes(q));
  },
  mockDefaults: (b) => ({
    name: b.name || 'New Chemist Store', contactPerson: b.contactPerson || 'Proprietor',
    phone: b.phone || '+91 9800000000', drugLicense: b.drugLicense || `DL-${rnd(100000, 1000000)}`,
    gstin: b.gstin || `07AAAAA${rnd(1000, 10000)}1Z5`, territory: b.territory || 'South Delhi',
    address: b.address || 'Market Complex, Delhi', associatedStockist: b.associatedStockist || 'Apex Pharma Distributors',
    outstandingDues: Number(b.outstandingDues) || 0, creditLimit: Number(b.creditLimit) || 100000
  })
});

// ==================== STOCKISTS ====================
crud('stockists', {
  label: 'Stockist', store: stockists, perms: { create: 'order.approve', update: 'order.approve', remove: 'order.approve' },
  list: repo.listStockists, save: repo.saveStockist, remove: repo.deleteStockist,
  msgs: { created: 'Stockist registered successfully', updated: 'Stockist updated successfully', deleted: 'Stockist removed successfully' },
  mockList: () => [...stockists],
  mockDefaults: (b) => ({
    name: b.name || 'New Wholesale Stockist', territory: b.territory || 'Delhi Central Hub',
    contactPerson: b.contactPerson || 'Managing Partner', phone: b.phone || '+91 9800000000',
    gstin: b.gstin || `07AAAAA${rnd(1000, 10000)}1Z1`, creditLimit: Number(b.creditLimit) || 2000000,
    currentOutstanding: Number(b.currentOutstanding) || 0, rating: b.rating || 'A+'
  })
});

export default router;
