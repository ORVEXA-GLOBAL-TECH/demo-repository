// PostgreSQL access for field-force transactions: orders, expense claims,
// DCR (visits), tour plans, attendance & leave. Responses keep the shapes the
// frontends consumed from mockStore.js.
import { transaction } from '../config/db.js';
import { query, isUuid, num, splitMetadata, ensureLookup, EMPLOYEE_NAME_SQL, HttpError } from './repo.js';

const D = (col) => `to_char(${col}, 'YYYY-MM-DD')`;
const T = (col) => `to_char(${col} AT TIME ZONE COALESCE(co.timezone, 'Asia/Kolkata'), 'HH12:MI AM')`;

const inTransaction = (fn) => transaction(fn);

// ------------------------------------------------------------------ orders
const ORDER_CORE = ['orderNumber', 'chemistId', 'chemistName', 'stockistId', 'stockistName', 'orderDate', 'items',
  'netAmount', 'status', 'remarks', 'mrId', 'mrName'];

const orderSelect = `
  SELECT o.id, o.order_number, ${D('o.order_date')} AS order_date, o.total_amount, o.status, o.remarks, o.metadata,
         o.employee_id, ${EMPLOYEE_NAME_SQL} AS mr_name,
         o.chemist_id, c.name AS chemist_name, o.distributor_id, s.name AS stockist_name,
         t.name AS territory,
         COALESCE((SELECT json_agg(json_build_object(
              'productId', i.product_id, 'productName', p.name, 'qty', i.quantity,
              'ptr', i.unit_price, 'amount', i.total_price) ORDER BY i.created_at)
            FROM public.order_items i JOIN public.products p ON p.id = i.product_id
            WHERE i.order_id = o.id), '[]'::json) AS items
  FROM public.orders o
  JOIN public.employees e ON e.id = o.employee_id
  LEFT JOIN public.chemists c ON c.id = o.chemist_id
  LEFT JOIN public.territories t ON t.id = c.territory_id
  LEFT JOIN public.distributors s ON s.id = o.distributor_id`;

const orderOut = (r) => {
  const net = Number(r.total_amount);
  const items = r.items.map((i) => ({ ...i, ptr: Number(i.ptr), amount: Number(i.amount) }));
  const gross = items.reduce((sum, i) => sum + i.amount, 0);
  return {
    totalAmount: gross || net,
    discountPercent: 0,
    paymentTerms: '30 Days Credit',
    ...r.metadata,
    id: r.id,
    orderNumber: r.order_number,
    mrId: r.employee_id,
    mrName: r.mr_name,
    chemistId: r.chemist_id,
    chemistName: r.chemist_name || r.metadata.chemistName || '',
    stockistId: r.distributor_id,
    stockistName: r.stockist_name || r.metadata.stockistName || '',
    territory: r.territory || r.metadata.territory || '',
    orderDate: r.order_date,
    items,
    netAmount: net,
    status: r.status,
    remarks: r.remarks || ''
  };
};

export async function listOrders(ctx, { status, search }) {
  const params = [ctx.companyId];
  let sql = `${orderSelect} WHERE o.company_id = $1`;
  if (status && status !== 'ALL') {
    params.push(status);
    sql += ` AND o.status = $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    const i = params.length;
    sql += ` AND (o.order_number ILIKE $${i} OR c.name ILIKE $${i} OR s.name ILIKE $${i})`;
  }
  if (ctx.scopeEmployeeId) { params.push(ctx.scopeEmployeeId); sql += ` AND o.employee_id = $${params.length}`; }
  const r = await query(`${sql} ORDER BY o.created_at DESC`, params);
  return r.rows.map(orderOut);
}

async function getOrder(ctx, id) {
  const r = await query(`${orderSelect} WHERE o.company_id = $1 AND o.id = $2`, [ctx.companyId, id]);
  return r.rows[0] ? orderOut(r.rows[0]) : null;
}

async function resolveByIdOrName(client, table, companyId, id, name) {
  if (isUuid(id)) {
    const r = await client.query(`SELECT id FROM public.${table} WHERE id = $1 AND company_id = $2`, [id, companyId]);
    if (r.rows[0]) return r.rows[0].id;
  }
  if (name) {
    const r = await client.query(
      `SELECT id FROM public.${table} WHERE company_id = $1 AND lower(name) = lower($2) LIMIT 1`, [companyId, name]);
    if (r.rows[0]) return r.rows[0].id;
  }
  return null;
}

export async function createOrder(ctx, data) {
  const employee = await ctx.actingEmployee();
  const items = Array.isArray(data.items) ? data.items : [];
  const discount = num(data.discountPercent);

  const id = await inTransaction(async (client) => {
    const chemistId = await resolveByIdOrName(client, 'chemists', ctx.companyId, data.chemistId, data.chemistName);
    const stockistId = await resolveByIdOrName(client, 'distributors', ctx.companyId, data.stockistId, data.stockistName);

    const lines = [];
    for (const item of items) {
      const productId = await resolveByIdOrName(client, 'products', ctx.companyId, item.productId, item.productName);
      if (!productId) throw new HttpError(400, `Unknown product: ${item.productName || item.productId}`);
      const qty = num(item.qty);
      const unit = num(item.ptr);
      lines.push({ productId, qty, unit, total: qty * unit });
    }
    const gross = lines.reduce((s, l) => s + l.total, 0);
    const net = Math.round((gross - gross * (discount / 100)) * 100) / 100;

    const meta = splitMetadata(data, ORDER_CORE);
    Object.assign(meta, {
      totalAmount: gross, discountPercent: discount,
      paymentTerms: data.paymentTerms || '30 Days Credit',
      chemistName: data.chemistName || 'Selected Chemist', stockistName: data.stockistName || 'Standard Stockist'
    });
    const orderNumber = data.orderNumber || `ALV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const ins = await client.query(
      `INSERT INTO public.orders (company_id, employee_id, chemist_id, distributor_id, order_number, order_date,
                                  total_amount, status, remarks, metadata)
       VALUES ($1,$2,$3,$4,$5,COALESCE($6::date, CURRENT_DATE),$7,$8,$9,$10::jsonb) RETURNING id`,
      [ctx.companyId, employee.id, chemistId, stockistId, orderNumber, data.orderDate || null, net,
        data.status || 'PENDING_APPROVAL', data.remarks || '', JSON.stringify(meta)]);
    for (const l of lines) {
      await client.query(
        `INSERT INTO public.order_items (order_id, product_id, unit_price, quantity, total_price)
         VALUES ($1,$2,$3,$4,$5)`, [ins.rows[0].id, l.productId, l.unit, l.qty, l.total]);
    }
    return ins.rows[0].id;
  });
  return getOrder(ctx, id);
}

export async function setOrderStatus(ctx, id, status) {
  const r = await query(
    `UPDATE public.orders SET status = COALESCE($1::text, status), updated_at = now() WHERE id = $2 AND company_id = $3 RETURNING id`,
    [status || null, id, ctx.companyId]);
  return r.rows[0] ? getOrder(ctx, id) : null;
}

// ---------------------------------------------------------------- expenses
const EXPENSE_CORE = ['mrId', 'mrName', 'date', 'totalClaimAmount', 'status'];
const EXPENSE_LINES = [
  ['TRAVEL', 'Travel', 'travelAllowance'],
  ['DAILY_ALLOWANCE', 'Daily Allowance', 'dailyAllowance'],
  ['HOTEL', 'Hotel', 'hotelCharges'],
  ['MISC', 'Miscellaneous', 'miscellaneousCharges']
];

const expenseSelect = `
  SELECT x.id, ${D('x.claim_date')} AS claim_date, x.total_amount, x.status, x.rejection_reason, x.metadata,
         x.employee_id, ${EMPLOYEE_NAME_SQL} AS mr_name
  FROM public.expense_claims x JOIN public.employees e ON e.id = x.employee_id`;

const expenseOut = (r) => ({
  receiptUrls: [],
  managerRemarks: r.rejection_reason || '',
  ...r.metadata,
  id: r.id,
  mrId: r.employee_id,
  mrName: r.mr_name,
  date: r.claim_date,
  totalClaimAmount: Number(r.total_amount),
  status: r.status
});

export async function listExpenses(ctx, { status }) {
  const params = [ctx.companyId];
  let sql = `${expenseSelect} WHERE x.company_id = $1`;
  if (status && status !== 'ALL') {
    params.push(status);
    sql += ` AND x.status = $${params.length}`;
  }
  if (ctx.scopeEmployeeId) { params.push(ctx.scopeEmployeeId); sql += ` AND x.employee_id = $${params.length}`; }
  const r = await query(`${sql} ORDER BY x.created_at DESC`, params);
  return r.rows.map(expenseOut);
}

async function getExpense(ctx, id) {
  const r = await query(`${expenseSelect} WHERE x.company_id = $1 AND x.id = $2`, [ctx.companyId, id]);
  return r.rows[0] ? expenseOut(r.rows[0]) : null;
}

export async function createExpense(ctx, data) {
  const employee = await ctx.actingEmployee();
  const travelKm = num(data.travelKm);
  const fareRatePerKm = num(data.fareRatePerKm, 4.5);
  const amounts = {
    travelAllowance: data.travelAllowance !== undefined ? num(data.travelAllowance) : travelKm * fareRatePerKm,
    dailyAllowance: num(data.dailyAllowance, 350),
    hotelCharges: num(data.hotelCharges),
    miscellaneousCharges: num(data.miscellaneousCharges)
  };
  const total = Object.values(amounts).reduce((a, b) => a + b, 0);
  const claimDate = data.date || new Date().toISOString().split('T')[0];

  const id = await inTransaction(async (client) => {
    const meta = splitMetadata(data, EXPENSE_CORE);
    Object.assign(meta, {
      claimType: data.claimType || 'DAILY_FIELD_ALLOWANCE', travelKm, fareRatePerKm, ...amounts,
      miscDescription: data.miscDescription || '', receiptUrls: data.receiptUrls || [],
      managerRemarks: data.managerRemarks || ''
    });
    const claim = await client.query(
      `INSERT INTO public.expense_claims (company_id, employee_id, claim_number, claim_date, total_amount, status, metadata)
       VALUES ($1,$2,$3,$4::date,$5,$6,$7::jsonb) RETURNING id`,
      [ctx.companyId, employee.id, `EXP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        claimDate, total, data.status || 'SUBMITTED', JSON.stringify(meta)]);

    for (const [code, name, key] of EXPENSE_LINES) {
      if (!(amounts[key] > 0)) continue;
      const categoryId = await ensureLookup(client, 'expense_categories', ctx.companyId, 'code', code, { name });
      await client.query(
        `INSERT INTO public.expense_items (claim_id, category_id, expense_date, amount, receipt_url, description)
         VALUES ($1,$2,$3::date,$4,$5,$6)`,
        [claim.rows[0].id, categoryId, claimDate, amounts[key],
          code === 'MISC' ? (data.receiptUrls?.[0] || null) : null,
          code === 'MISC' ? data.miscDescription || null : null]);
    }
    return claim.rows[0].id;
  });
  return getExpense(ctx, id);
}

export async function setExpenseStatus(ctx, id, { status, managerRemarks }) {
  const current = await query(`SELECT metadata FROM public.expense_claims WHERE id=$1 AND company_id=$2`, [id, ctx.companyId]);
  if (!current.rows[0]) return null;
  const meta = { ...current.rows[0].metadata };
  if (managerRemarks !== undefined) meta.managerRemarks = managerRemarks;
  const reviewer = ctx.employee;
  const approved = status === 'APPROVED';
  await query(
    `UPDATE public.expense_claims
        SET status = COALESCE($1::text, status),
            metadata = $2::jsonb,
            rejection_reason = CASE WHEN $1::text = 'REJECTED' THEN $3::text ELSE rejection_reason END,
            approved_amount = CASE WHEN $1::text = 'APPROVED' THEN total_amount ELSE approved_amount END,
            approved_by_id = CASE WHEN $1::text IN ('APPROVED','REJECTED') THEN $4::uuid ELSE approved_by_id END,
            updated_at = now()
      WHERE id = $5 AND company_id = $6`,
    [status || null, JSON.stringify(meta), managerRemarks ?? null, reviewer?.id || null, id, ctx.companyId]);
  if (reviewer && (approved || status === 'REJECTED')) {
    await query(
      `INSERT INTO public.expense_approvals (claim_id, approver_id, action, approved_amount, remarks)
       SELECT id, $1, $2::text, CASE WHEN $2::text = 'APPROVED' THEN total_amount END, $3::text FROM public.expense_claims WHERE id = $4`,
      [reviewer.id, status, managerRemarks ?? null, id]);
  }
  return getExpense(ctx, id);
}

// --------------------------------------------------------------------- DCR
const DCR_CORE = ['mrId', 'mrName', 'date', 'targetType', 'targetId', 'targetName', 'visitTime', 'feedback',
  'geoLat', 'geoLng', 'status', 'purpose'];

const dcrSelect = `
  SELECT v.id, v.employee_id, ${EMPLOYEE_NAME_SQL} AS mr_name, ${D('v.visit_date')} AS visit_date,
         ${T('v.visit_time')} AS visit_time, v.visit_type, v.doctor_id, v.chemist_id,
         COALESCE(d.name, ch.name) AS target_name, ds.name AS specialty, h.name AS hospital,
         v.remarks, v.latitude, v.longitude, v.status, v.metadata
  FROM public.visits v
  JOIN public.employees e ON e.id = v.employee_id
  JOIN public.companies co ON co.id = v.company_id
  LEFT JOIN public.doctors d ON d.id = v.doctor_id
  LEFT JOIN public.doctor_specialties ds ON ds.id = d.specialty_id
  LEFT JOIN public.hospitals h ON h.id = d.hospital_id
  LEFT JOIN public.chemists ch ON ch.id = v.chemist_id`;

const dcrOut = (r) => ({
  ...r.metadata,
  id: r.id,
  mrId: r.employee_id,
  mrName: r.mr_name,
  date: r.visit_date,
  targetType: r.visit_type,
  targetId: r.doctor_id || r.chemist_id,
  targetName: r.target_name || r.metadata.targetName || '',
  ...(r.specialty ? { specialty: r.specialty } : {}),
  ...(r.hospital ? { hospital: r.hospital } : {}),
  visitTime: r.visit_time,
  feedback: r.remarks || '',
  geoLat: r.latitude === null ? undefined : Number(r.latitude),
  geoLng: r.longitude === null ? undefined : Number(r.longitude),
  status: r.status
});

export async function listDcr(ctx, { status, targetType, date }) {
  const params = [ctx.companyId];
  let sql = `${dcrSelect} WHERE v.company_id = $1`;
  if (status && status !== 'ALL') { params.push(status); sql += ` AND v.status = $${params.length}`; }
  if (targetType && targetType !== 'ALL') { params.push(targetType); sql += ` AND v.visit_type = $${params.length}`; }
  if (date) { params.push(date); sql += ` AND v.visit_date = $${params.length}::date`; }
  if (ctx.scopeEmployeeId) { params.push(ctx.scopeEmployeeId); sql += ` AND v.employee_id = $${params.length}`; }
  const r = await query(`${sql} ORDER BY v.visit_date DESC, v.visit_time DESC`, params);
  return r.rows.map(dcrOut);
}

async function getDcr(ctx, id) {
  const r = await query(`${dcrSelect} WHERE v.company_id = $1 AND v.id = $2`, [ctx.companyId, id]);
  return r.rows[0] ? dcrOut(r.rows[0]) : null;
}

export async function createDcr(ctx, data) {
  const employee = await ctx.actingEmployee();
  const date = data.date || new Date().toISOString().split('T')[0];
  const type = (data.targetType || 'DOCTOR').toUpperCase();

  const id = await inTransaction(async (client) => {
    const doctorId = type === 'DOCTOR'
      ? await resolveByIdOrName(client, 'doctors', ctx.companyId, data.targetId, data.targetName) : null;
    const chemistId = type === 'CHEMIST'
      ? await resolveByIdOrName(client, 'chemists', ctx.companyId, data.targetId, data.targetName) : null;

    const report = await client.query(
      `INSERT INTO public.dcr_reports (company_id, employee_id, dcr_date, total_calls, status)
       VALUES ($1,$2,$3::date,1,$4)
       ON CONFLICT (company_id, employee_id, dcr_date)
       DO UPDATE SET total_calls = public.dcr_reports.total_calls + 1, updated_at = now()
       RETURNING id`,
      [ctx.companyId, employee.id, date, data.status || 'SUBMITTED']);

    const meta = splitMetadata(data, DCR_CORE);
    if (!doctorId && !chemistId && data.targetName) meta.targetName = data.targetName;
    const visit = await client.query(
      `INSERT INTO public.visits (company_id, employee_id, dcr_report_id, doctor_id, chemist_id, visit_type, visit_date,
                                  visit_time, latitude, longitude, purpose, remarks, status, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7::date,
               COALESCE(($7::text || ' ' || $8::text)::timestamp AT TIME ZONE
                        (SELECT COALESCE(timezone,'Asia/Kolkata') FROM public.companies WHERE id = $1), now()),
               $9,$10,$11,$12,$13,$14::jsonb) RETURNING id`,
      [ctx.companyId, employee.id, report.rows[0].id, doctorId, chemistId, type, date,
        data.visitTime || null,
        data.geoLat ?? null, data.geoLng ?? null, data.purpose || null, data.feedback || null,
        data.status || 'SUBMITTED', JSON.stringify(meta)]);

    // Ledger rows for detailed products / samples given (best effort by name).
    const samples = new Map((data.samplesGiven || []).map((s) => [String(s.product).toLowerCase(), num(s.qty)]));
    for (const name of data.productsDetailed || []) {
      const productId = await resolveByIdOrName(client, 'products', ctx.companyId, null, name);
      if (!productId) continue;
      await client.query(
        `INSERT INTO public.visit_products (visit_id, product_id, samples_given_qty) VALUES ($1,$2,$3)`,
        [visit.rows[0].id, productId, samples.get(String(name).toLowerCase()) || 0]);
    }
    return visit.rows[0].id;
  });
  return getDcr(ctx, id);
}

export async function setDcrStatus(ctx, id, status) {
  const r = await query(
    `UPDATE public.visits SET status = COALESCE($1::text, status), updated_at = now()
      WHERE id = $2 AND company_id = $3 RETURNING dcr_report_id`, [status || null, id, ctx.companyId]);
  if (!r.rows[0]) return null;
  if (status && r.rows[0].dcr_report_id) {
    // Report-level status follows its visits once they all agree.
    await query(
      `UPDATE public.dcr_reports SET status = $1::text, updated_at = now()
        WHERE id = $2 AND NOT EXISTS (SELECT 1 FROM public.visits WHERE dcr_report_id = $2 AND status <> $1::text)`,
      [status, r.rows[0].dcr_report_id]);
  }
  return getDcr(ctx, id);
}

// -------------------------------------------------------------- tour plans
const TOUR_CORE = ['mrId', 'mrName', 'month', 'date', 'territory', 'objectives', 'status'];

const tourSelect = `
  SELECT i.id, p.employee_id, ${EMPLOYEE_NAME_SQL} AS mr_name, p.month, p.year, p.status,
         ${D('i.plan_date')} AS plan_date, trim(to_char(i.plan_date, 'Day')) AS day_of_week,
         trim(to_char(i.plan_date, 'FMMonth')) AS month_name, i.route_name, i.objective, i.metadata
  FROM public.tour_plan_items i
  JOIN public.tour_plans p ON p.id = i.tour_plan_id
  JOIN public.employees e ON e.id = p.employee_id`;

const tourOut = (r) => ({
  ...r.metadata,
  id: r.id,
  mrId: r.employee_id,
  mrName: r.mr_name,
  month: `${r.month_name} ${r.year}`,
  date: r.plan_date,
  dayOfWeek: r.day_of_week,
  territory: r.route_name,
  objectives: r.objective || '',
  status: r.status
});

export async function listTourPlans(ctx) {
  const params = [ctx.companyId];
  let sql = `${tourSelect} WHERE p.company_id = $1`;
  if (ctx.scopeEmployeeId) { params.push(ctx.scopeEmployeeId); sql += ` AND p.employee_id = $2`; }
  const r = await query(`${sql} ORDER BY i.plan_date DESC, i.created_at DESC`, params);
  return r.rows.map(tourOut);
}

export async function createTourPlan(ctx, data) {
  const employee = await ctx.actingEmployee();
  const date = data.date || new Date().toISOString().split('T')[0];
  const [year, month] = date.split('-').map(Number);

  const id = await inTransaction(async (client) => {
    const plan = await client.query(
      `INSERT INTO public.tour_plans (company_id, employee_id, month, year, status)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (company_id, employee_id, month, year) DO UPDATE SET updated_at = now()
       RETURNING id`,
      [ctx.companyId, employee.id, month, year, data.status || 'PLANNED']);
    const meta = splitMetadata(data, TOUR_CORE);
    const item = await client.query(
      `INSERT INTO public.tour_plan_items (tour_plan_id, plan_date, route_name, objective, target_doctor_count, metadata)
       VALUES ($1,$2::date,$3,$4,$5,$6::jsonb) RETURNING id`,
      [plan.rows[0].id, date, data.territory || 'Unassigned route', data.objectives || null,
        Array.isArray(data.plannedDoctors) ? data.plannedDoctors.length : 0, JSON.stringify(meta)]);
    return item.rows[0].id;
  });
  const r = await query(`${tourSelect} WHERE p.company_id = $1 AND i.id = $2`, [ctx.companyId, id]);
  return tourOut(r.rows[0]);
}

// --------------------------------------------------------------- attendance
const attendanceSelect = `
  SELECT a.id, a.employee_id, ${EMPLOYEE_NAME_SQL} AS mr_name, ${D('a.date')} AS date,
         ${T('a.check_in_time')} AS punch_in, ${T('a.check_out_time')} AS punch_out,
         a.total_hours, a.status, a.metadata
  FROM public.attendance a
  JOIN public.employees e ON e.id = a.employee_id
  JOIN public.companies co ON co.id = a.company_id`;

const attendanceOut = (r) => ({
  callsCompleted: 0,
  pobBooked: 0,
  ...r.metadata,
  id: r.id,
  mrId: r.employee_id,
  mrName: r.mr_name,
  date: r.date,
  punchInTime: r.punch_in,
  punchOutTime: r.punch_out,
  totalHours: Number(r.total_hours),
  status: r.status
});

export async function listAttendance(ctx) {
  const params = [ctx.companyId];
  let sql = `${attendanceSelect} WHERE a.company_id = $1`;
  if ((ctx.identified || ctx.scopeEmployeeId) && ctx.employee) { params.push(ctx.employee.id); sql += ` AND a.employee_id = $2`; }
  const r = await query(`${sql} ORDER BY a.date DESC LIMIT 60`, params);
  return r.rows.map(attendanceOut);
}

export async function punchIn(ctx, data) {
  const employee = await ctx.actingEmployee();
  const location = data.locationName || 'Field location';
  const r = await query(
    `INSERT INTO public.attendance (company_id, employee_id, date, status, check_in_time, check_in_lat, check_in_lng, metadata)
     VALUES ($1,$2,CURRENT_DATE,'PRESENT_FIELD',now(),$3,$4,$5::jsonb)
     ON CONFLICT (company_id, employee_id, date) DO NOTHING RETURNING id`,
    [ctx.companyId, employee.id, data.lat ?? null, data.lng ?? null,
      JSON.stringify({ punchInLocation: location, punchOutLocation: null, callsCompleted: 0, pobBooked: 0 })]);
  if (!r.rows[0]) throw new HttpError(409, 'Already punched in today');
  const out = await query(`${attendanceSelect} WHERE a.id = $1`, [r.rows[0].id]);
  return attendanceOut(out.rows[0]);
}

export async function punchOut(ctx, data) {
  const employee = await ctx.actingEmployee();
  const r = await query(
    `UPDATE public.attendance
        SET check_out_time = now(),
            total_hours = round((extract(epoch FROM (now() - check_in_time)) / 3600)::numeric, 2),
            check_out_lat = $3, check_out_lng = $4,
            metadata = metadata || jsonb_build_object('punchOutLocation', $5::text),
            updated_at = now()
      WHERE company_id = $1 AND employee_id = $2 AND date = CURRENT_DATE AND check_out_time IS NULL
      RETURNING id`,
    [ctx.companyId, employee.id, data.lat ?? null, data.lng ?? null, data.locationName || 'Field location']);
  if (!r.rows[0]) return null;
  const out = await query(`${attendanceSelect} WHERE a.id = $1`, [r.rows[0].id]);
  return attendanceOut(out.rows[0]);
}

// -------------------------------------------------------------------- leave
const LEAVE_DEFAULTS = [['CL', 'Casual Leave', 12], ['SL', 'Sick Leave', 10], ['PL', 'Earned Leave', 15]];

async function ensureLeaveTypes(companyId) {
  for (const [code, name, quota] of LEAVE_DEFAULTS) {
    await query(
      `INSERT INTO public.leave_types (company_id, code, name, annual_quota) VALUES ($1,$2,$3,$4)
       ON CONFLICT (company_id, code) DO NOTHING`, [companyId, code, name, quota]);
  }
}

export async function leaveSummary(ctx) {
  const employee = await ctx.actingEmployee();
  await ensureLeaveTypes(ctx.companyId);
  const types = await query(
    `SELECT lt.code, lt.annual_quota,
            COALESCE(SUM(lr.total_days) FILTER (WHERE lr.status = 'APPROVED'
              AND date_part('year', lr.start_date) = date_part('year', CURRENT_DATE)), 0)::int AS used
       FROM public.leave_types lt
       LEFT JOIN public.leave_requests lr ON lr.leave_type_id = lt.id AND lr.employee_id = $2
      WHERE lt.company_id = $1 GROUP BY lt.code, lt.annual_quota`, [ctx.companyId, employee.id]);
  const by = Object.fromEntries(types.rows.map((t) => [t.code, t]));
  const pending = await query(
    `SELECT lr.id, lt.name AS leave_type, ${D('lr.start_date')} AS from_date, ${D('lr.end_date')} AS to_date,
            lr.reason, lr.status, ${D('lr.created_at')} AS applied_on
       FROM public.leave_requests lr LEFT JOIN public.leave_types lt ON lt.id = lr.leave_type_id
      WHERE lr.employee_id = $1 AND lr.status IN ('PENDING','PENDING_APPROVAL') ORDER BY lr.created_at DESC`, [employee.id]);
  const name = `${employee.first_name} ${employee.last_name}`;
  return {
    mrId: employee.id,
    mrName: name,
    casualLeaveTotal: by.CL?.annual_quota ?? 12, casualLeaveUsed: by.CL?.used ?? 0,
    sickLeaveTotal: by.SL?.annual_quota ?? 10, sickLeaveUsed: by.SL?.used ?? 0,
    earnedLeaveTotal: by.PL?.annual_quota ?? 15, earnedLeaveUsed: by.PL?.used ?? 0,
    pendingLeaves: pending.rows.map((p) => ({
      id: p.id, leaveType: p.leave_type, fromDate: p.from_date, toDate: p.to_date,
      reason: p.reason, status: p.status, appliedOn: p.applied_on
    }))
  };
}

export async function createLeaveRequest(ctx, { leaveType, fromDate, toDate, reason }) {
  if (!fromDate || !toDate) throw new HttpError(400, 'fromDate and toDate are required');
  if (new Date(toDate) < new Date(fromDate)) throw new HttpError(400, 'toDate cannot be before fromDate');
  const employee = await ctx.actingEmployee();
  await ensureLeaveTypes(ctx.companyId);
  const kind = String(leaveType || '').toLowerCase();
  const code = kind.includes('sick') ? 'SL' : kind.includes('earn') || kind.includes('privilege') ? 'PL' : 'CL';
  const r = await query(
    `INSERT INTO public.leave_requests (company_id, employee_id, leave_type_id, start_date, end_date, total_days, reason, status)
     SELECT $1, $2, lt.id, $3::date, $4::date, ($4::date - $3::date) + 1, $5, 'PENDING_APPROVAL'
       FROM public.leave_types lt WHERE lt.company_id = $1 AND lt.code = $6
     RETURNING id, ${D('created_at')} AS applied_on`,
    [ctx.companyId, employee.id, fromDate, toDate, reason || null, code]);
  return { id: r.rows[0].id, leaveType, fromDate, toDate, reason, status: 'PENDING_APPROVAL', appliedOn: r.rows[0].applied_on };
}
