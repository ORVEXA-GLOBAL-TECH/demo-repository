// PostgreSQL access for the catalog: products, doctors, chemists, stockists.
// Row -> API mapping keeps the exact shapes the frontends already consume
// (formerly served from mockStore.js). Fields without a dedicated column live
// in the JSONB `metadata` column (migration 015).
import { query, ensureLookup, slug, num, splitMetadata, HttpError } from './repo.js';

// ---------------------------------------------------------------- products
const PRODUCT_CORE = ['name', 'composition', 'category', 'packing', 'packSize', 'mrp', 'ptr', 'pts', 'sku'];

const productSelect = `
  SELECT p.id, p.sku, p.name, p.composition, p.pack_size, p.mrp, p.ptr, p.pts, p.is_active,
         pc.name AS category, p.metadata
  FROM public.products p
  LEFT JOIN public.product_categories pc ON pc.id = p.category_id`;

const productOut = (r) => ({
  ...r.metadata,
  id: r.id,
  sku: r.sku,
  name: r.name,
  composition: r.composition || '',
  category: r.category || 'General',
  packing: r.pack_size,
  packSize: r.pack_size,
  mrp: Number(r.mrp),
  ptr: Number(r.ptr),
  pts: Number(r.pts)
});

export async function listProducts(ctx, { category, search }) {
  const params = [ctx.companyId];
  let sql = `${productSelect} WHERE p.company_id = $1 AND p.is_active`;
  if (category && category !== 'ALL') {
    params.push(category);
    sql += ` AND lower(pc.name) = lower($${params.length})`;
  }
  if (search) {
    params.push(`%${search}%`);
    const i = params.length;
    sql += ` AND (p.name ILIKE $${i} OR p.composition ILIKE $${i} OR p.metadata->>'indication' ILIKE $${i})`;
  }
  const r = await query(`${sql} ORDER BY p.created_at DESC, p.name`, params);
  return r.rows.map(productOut);
}

async function getProduct(ctx, id) {
  const r = await query(`${productSelect} WHERE p.company_id = $1 AND p.id = $2`, [ctx.companyId, id]);
  return r.rows[0] ? productOut(r.rows[0]) : null;
}

export async function saveProduct(ctx, id, data) {
  const existing = id ? await getProduct(ctx, id) : null;
  if (id && !existing) return null;
  const d = id ? { ...existing, ...data } : data;
  const categoryId = await ensureLookup({ query }, 'product_categories', ctx.companyId, 'name', d.category || 'General');
  const meta = splitMetadata(d, PRODUCT_CORE);
  const packSize = d.packSize || d.packing || '10x10 Tablets';
  const vals = [categoryId, d.name || 'New Pharmaceutical Product', d.composition || '', packSize,
    num(d.mrp), num(d.ptr), num(d.pts), JSON.stringify(meta)];

  if (id) {
    await query(
      `UPDATE public.products SET category_id=$1, name=$2, composition=$3, pack_size=$4, mrp=$5, ptr=$6, pts=$7,
              metadata=$8::jsonb WHERE id=$9 AND company_id=$10`, [...vals, id, ctx.companyId]);
    return getProduct(ctx, id);
  }
  const sku = d.sku || `PRD-${slug(d.name).slice(0, 12)}-${Date.now().toString(36).toUpperCase()}`;
  const r = await query(
    `INSERT INTO public.products (company_id, sku, category_id, name, composition, pack_size, mrp, ptr, pts, metadata)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb) RETURNING id`,
    [ctx.companyId, sku, ...vals]);
  return getProduct(ctx, r.rows[0].id);
}

export async function deleteProduct(ctx, id) {
  const existing = await getProduct(ctx, id);
  if (!existing) return null;
  // Products referenced by orders/visits are retired, not removed, to keep history intact.
  await query(`UPDATE public.products SET is_active = FALSE WHERE id=$1 AND company_id=$2`, [id, ctx.companyId]);
  return existing;
}

// ----------------------------------------------------------------- doctors
const DOCTOR_CORE = ['name', 'specialty', 'qualification', 'hospital', 'territory', 'class', 'monthlyTargetVisits',
  'completedVisitsThisMonth', 'phone', 'address'];

const doctorSelect = `
  SELECT d.id, d.name, d.qualification, d.phone, d.clinic_address, d.visit_frequency, d.metadata,
         ds.name AS specialty, dc.code AS class, h.name AS hospital, t.name AS territory,
         (SELECT count(*) FROM public.visits v
           WHERE v.doctor_id = d.id AND date_trunc('month', v.visit_date) = date_trunc('month', CURRENT_DATE))::int AS completed
  FROM public.doctors d
  LEFT JOIN public.doctor_specialties ds ON ds.id = d.specialty_id
  LEFT JOIN public.doctor_categories dc ON dc.id = d.category_id
  LEFT JOIN public.hospitals h ON h.id = d.hospital_id
  LEFT JOIN public.territories t ON t.id = d.territory_id`;

const doctorOut = (r) => ({
  ...r.metadata,
  id: r.id,
  name: r.name,
  specialty: r.specialty || '',
  qualification: r.qualification || '',
  hospital: r.hospital || '',
  territory: r.territory || '',
  class: r.class || '',
  monthlyTargetVisits: r.visit_frequency,
  completedVisitsThisMonth: r.completed,
  phone: r.phone || '',
  address: r.clinic_address || ''
});

export async function listDoctors(ctx, { specialty, territory, search }) {
  const params = [ctx.companyId];
  let sql = `${doctorSelect} WHERE d.company_id = $1`;
  if (specialty && specialty !== 'ALL') {
    params.push(`%${specialty}%`);
    sql += ` AND ds.name ILIKE $${params.length}`;
  }
  if (territory && territory !== 'ALL') {
    params.push(`%${territory}%`);
    sql += ` AND t.name ILIKE $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    const i = params.length;
    sql += ` AND (d.name ILIKE $${i} OR h.name ILIKE $${i} OR ds.name ILIKE $${i})`;
  }
  const r = await query(`${sql} ORDER BY d.created_at DESC, d.name`, params);
  return r.rows.map(doctorOut);
}

async function getDoctor(ctx, id) {
  const r = await query(`${doctorSelect} WHERE d.company_id = $1 AND d.id = $2`, [ctx.companyId, id]);
  return r.rows[0] ? doctorOut(r.rows[0]) : null;
}

export async function saveDoctor(ctx, id, data) {
  const existing = id ? await getDoctor(ctx, id) : null;
  if (id && !existing) return null;
  const d = id ? { ...existing, ...data } : data;
  const c = { query };
  const specialtyId = await ensureLookup(c, 'doctor_specialties', ctx.companyId, 'name', d.specialty || 'General Physician');
  const categoryId = await ensureLookup(c, 'doctor_categories', ctx.companyId, 'code', d.class || 'A', { name: d.class || 'A' });
  const hospitalId = await ensureLookup(c, 'hospitals', ctx.companyId, 'name', d.hospital || 'City Clinic');
  const territoryId = await ensureLookup(c, 'territories', ctx.companyId, 'name', d.territory || 'General', { code: slug(d.territory || 'General') });
  const meta = splitMetadata(d, DOCTOR_CORE);
  const vals = [d.name || 'Dr. New Doctor', d.qualification || 'MBBS', specialtyId, categoryId, hospitalId, territoryId,
    d.phone || null, d.address || null, num(d.monthlyTargetVisits, 2), JSON.stringify(meta)];

  if (id) {
    await query(
      `UPDATE public.doctors SET name=$1, qualification=$2, specialty_id=$3, category_id=$4, hospital_id=$5,
              territory_id=$6, phone=$7, clinic_address=$8, visit_frequency=$9, metadata=$10::jsonb, updated_at=now()
       WHERE id=$11 AND company_id=$12`, [...vals, id, ctx.companyId]);
    return getDoctor(ctx, id);
  }
  const r = await query(
    `INSERT INTO public.doctors (company_id, name, qualification, specialty_id, category_id, hospital_id, territory_id,
                                 phone, clinic_address, visit_frequency, metadata)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb) RETURNING id`, [ctx.companyId, ...vals]);
  return getDoctor(ctx, r.rows[0].id);
}

export async function deleteDoctor(ctx, id) {
  const existing = await getDoctor(ctx, id);
  if (!existing) return null;
  await query(`DELETE FROM public.doctors WHERE id=$1 AND company_id=$2`, [id, ctx.companyId]);
  return existing;
}

// ---------------------------------------------------------------- chemists
const CHEMIST_CORE = ['name', 'contactPerson', 'phone', 'drugLicense', 'gstin', 'territory', 'address',
  'preferredStockist', 'associatedStockist'];

const chemistSelect = `
  SELECT c.id, c.name, c.contact_person, c.phone, c.drug_license_no, c.gstin, c.address, c.preferred_stockist,
         c.metadata, t.name AS territory
  FROM public.chemists c LEFT JOIN public.territories t ON t.id = c.territory_id`;

const chemistOut = (r) => ({
  ...r.metadata,
  id: r.id,
  name: r.name,
  contactPerson: r.contact_person || '',
  phone: r.phone || '',
  drugLicense: r.drug_license_no || '',
  gstin: r.gstin || '',
  territory: r.territory || '',
  address: r.address || '',
  preferredStockist: r.preferred_stockist || '',
  associatedStockist: r.preferred_stockist || ''
});

export async function listChemists(ctx, { search }) {
  const params = [ctx.companyId];
  let sql = `${chemistSelect} WHERE c.company_id = $1`;
  if (search) {
    params.push(`%${search}%`);
    const i = params.length;
    sql += ` AND (c.name ILIKE $${i} OR c.contact_person ILIKE $${i} OR t.name ILIKE $${i})`;
  }
  const r = await query(`${sql} ORDER BY c.created_at DESC, c.name`, params);
  return r.rows.map(chemistOut);
}

async function getChemist(ctx, id) {
  const r = await query(`${chemistSelect} WHERE c.company_id = $1 AND c.id = $2`, [ctx.companyId, id]);
  return r.rows[0] ? chemistOut(r.rows[0]) : null;
}

export async function saveChemist(ctx, id, data) {
  const existing = id ? await getChemist(ctx, id) : null;
  if (id && !existing) return null;
  const d = id ? { ...existing, ...data } : data;
  const territoryId = await ensureLookup({ query }, 'territories', ctx.companyId, 'name', d.territory || 'General', { code: slug(d.territory || 'General') });
  const meta = splitMetadata(d, CHEMIST_CORE);
  const stockist = d.associatedStockist || d.preferredStockist || null;
  const license = d.drugLicense || (id ? null : `DL-${Math.floor(100000 + Math.random() * 900000)}`);
  const vals = [d.name || 'New Chemist Store', d.contactPerson || 'Proprietor', d.phone || null, license,
    d.gstin || null, d.address || null, territoryId, stockist, JSON.stringify(meta)];

  if (id) {
    await query(
      `UPDATE public.chemists SET name=$1, contact_person=$2, phone=$3, drug_license_no=$4, gstin=$5, address=$6,
              territory_id=$7, preferred_stockist=$8, metadata=$9::jsonb WHERE id=$10 AND company_id=$11`,
      [...vals, id, ctx.companyId]);
    return getChemist(ctx, id);
  }
  const r = await query(
    `INSERT INTO public.chemists (company_id, name, contact_person, phone, drug_license_no, gstin, address,
                                  territory_id, preferred_stockist, metadata)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb) RETURNING id`, [ctx.companyId, ...vals]);
  return getChemist(ctx, r.rows[0].id);
}

export async function deleteChemist(ctx, id) {
  const existing = await getChemist(ctx, id);
  if (!existing) return null;
  try {
    await query(`DELETE FROM public.chemists WHERE id=$1 AND company_id=$2`, [id, ctx.companyId]);
  } catch (err) {
    if (err.code === '23503') throw new HttpError(409, 'Chemist has orders on record and cannot be deleted');
    throw err;
  }
  return existing;
}

// --------------------------------------------------------------- stockists
// Stockists are stored in public.distributors.
const STOCKIST_CORE = ['name', 'contactPerson', 'phone', 'address', 'gstin', 'code'];

const stockistSelect = `
  SELECT s.id, s.name, s.code, s.contact_person, s.phone, s.address, s.gstin, s.metadata,
         (SELECT count(*) FROM public.orders o
           WHERE o.distributor_id = s.id AND o.status IN ('PENDING','PENDING_APPROVAL','APPROVED'))::int AS active_orders
  FROM public.distributors s`;

const stockistOut = (r) => ({
  ...r.metadata,
  id: r.id,
  name: r.name,
  contactPerson: r.contact_person || '',
  phone: r.phone || '',
  address: r.address || '',
  gstin: r.gstin || '',
  activeOrdersCount: r.active_orders
});

export async function listStockists(ctx) {
  const r = await query(`${stockistSelect} WHERE s.company_id = $1 ORDER BY s.created_at DESC, s.name`, [ctx.companyId]);
  return r.rows.map(stockistOut);
}

async function getStockist(ctx, id) {
  const r = await query(`${stockistSelect} WHERE s.company_id = $1 AND s.id = $2`, [ctx.companyId, id]);
  return r.rows[0] ? stockistOut(r.rows[0]) : null;
}

export async function saveStockist(ctx, id, data) {
  const existing = id ? await getStockist(ctx, id) : null;
  if (id && !existing) return null;
  const d = id ? { ...existing, ...data } : data;
  const meta = splitMetadata(d, STOCKIST_CORE);
  delete meta.activeOrdersCount;
  const vals = [d.name || 'New Wholesale Stockist', d.contactPerson || null, d.phone || null, d.address || null,
    d.gstin || null, JSON.stringify(meta)];

  if (id) {
    await query(
      `UPDATE public.distributors SET name=$1, contact_person=$2, phone=$3, address=$4, gstin=$5, metadata=$6::jsonb
       WHERE id=$7 AND company_id=$8`, [...vals, id, ctx.companyId]);
    return getStockist(ctx, id);
  }
  const code = `STK-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
  const r = await query(
    `INSERT INTO public.distributors (company_id, code, name, contact_person, phone, address, gstin, metadata)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb) RETURNING id`,
    [ctx.companyId, code, ...vals]);
  return getStockist(ctx, r.rows[0].id);
}

export async function deleteStockist(ctx, id) {
  const existing = await getStockist(ctx, id);
  if (!existing) return null;
  // orders.distributor_id has no ON DELETE action: block deletion when referenced.
  try {
    await query(`DELETE FROM public.distributors WHERE id=$1 AND company_id=$2`, [id, ctx.companyId]);
  } catch (err) {
    if (err.code === '23503') throw new HttpError(409, 'Stockist has orders on record and cannot be deleted');
    throw err;
  }
  return existing;
}
