/**
 * Loads the demo SFA dataset (formerly served from data/mockStore.js) into
 * PostgreSQL. Idempotent per table: a table that already has rows for the
 * target company is skipped. Run after `npm run db:migrate`:
 *
 *   npm --prefix backend run db:seed-domain
 */
import { query, checkDbHealth } from '../config/db.js';
import { resolveContext } from '../data/repo.js';
import * as catalog from '../data/catalogRepo.js';
import * as field from '../data/fieldRepo.js';
import {
  products, doctors, chemists, stockists, orders, expenses, dcrReports, tourPlans, attendanceRecords
} from '../data/mockStore.js';

const ctxFor = (body = {}) => resolveContext({ headers: {}, query: {}, body });

async function isEmpty(table, companyId) {
  const r = await query(`SELECT 1 FROM public.${table} WHERE company_id = $1 LIMIT 1`, [companyId]);
  return r.rows.length === 0;
}

async function seedTable(label, table, companyId, rows, insert) {
  if (!(await isEmpty(table, companyId))) {
    console.log(`⏭️  ${label}: already populated, skipped`);
    return;
  }
  let ok = 0;
  for (const row of rows) {
    try {
      await insert(row);
      ok += 1;
    } catch (err) {
      console.warn(`   ⚠️ ${label}: skipped "${row.id}" (${err.message})`);
    }
  }
  console.log(`✅ ${label}: ${ok}/${rows.length} rows inserted`);
}

async function main() {
  const health = await checkDbHealth();
  if (health.status !== 'CONNECTED') {
    console.error('❌ Database not reachable:', health.error);
    process.exit(1);
  }
  const base = await ctxFor();
  if (!base) {
    console.error('❌ No company found. Run `npm run db:migrate` first (migration 013 seeds companies/employees).');
    process.exit(1);
  }
  const { companyId } = base;
  console.log(`🌱 Seeding demo data into company ${companyId}`);

  // Catalog first: orders / DCRs / expenses resolve products, chemists and stockists by name.
  await seedTable('products', 'products', companyId, products, (p) => catalog.saveProduct(base, null, p));
  await seedTable('doctors', 'doctors', companyId, doctors, (d) => catalog.saveDoctor(base, null, d));
  await seedTable('chemists', 'chemists', companyId, chemists, (c) => catalog.saveChemist(base, null, c));
  await seedTable('stockists', 'distributors', companyId, stockists, (s) => catalog.saveStockist(base, null, s));

  await seedTable('orders', 'orders', companyId, orders, async (o) => field.createOrder(await ctxFor(o), o));
  await seedTable('expenses', 'expense_claims', companyId, expenses, async (e) => field.createExpense(await ctxFor(e), e));
  await seedTable('DCR visits', 'visits', companyId, dcrReports, async (d) => field.createDcr(await ctxFor(d), d));
  await seedTable('tour plans', 'tour_plans', companyId, tourPlans, async (t) => field.createTourPlan(await ctxFor(t), t));

  await seedTable('attendance', 'attendance', companyId, attendanceRecords, async (a) => {
    const ctx = await ctxFor(a);
    const employee = await ctx.actingEmployee();
    const at = (time) => (time ? `(($1::text || ' ' || ${time})::timestamp AT TIME ZONE
        (SELECT COALESCE(timezone, 'Asia/Kolkata') FROM public.companies WHERE id = $2))` : 'NULL');
    await query(
      `INSERT INTO public.attendance (company_id, employee_id, date, status, check_in_time, check_out_time, total_hours, metadata)
       VALUES ($2, $3, $1::date, $4, ${at('$5')}, ${at('$6')}, $7, $8::jsonb)
       ON CONFLICT (company_id, employee_id, date) DO NOTHING`,
      [a.date, companyId, employee.id, a.status, a.punchInTime || null, a.punchOutTime || null, a.totalHours || 0,
        JSON.stringify({
          punchInLocation: a.punchInLocation, punchOutLocation: a.punchOutLocation,
          callsCompleted: a.callsCompleted, pobBooked: a.pobBooked
        })]);
  });

  console.log('🎉 Demo data seeding finished');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
