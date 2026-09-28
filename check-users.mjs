import { query } from './backend/src/config/db.js';

async function checkUsers() {
  try {
    const res = await query("SELECT id, email, role, status, is_superadmin, password_hash FROM public.users WHERE role ILIKE '%ADMIN%' LIMIT 20;");
    console.log('--- ADMIN USERS IN DB ---');
    res.rows.forEach(r => {
      console.log(`Email: ${r.email} | Role: ${r.role} | Status: ${r.status} | SuperAdmin: ${r.is_superadmin} | HashPrefix: ${r.password_hash?.substring(0, 15)}...`);
    });
  } catch (err) {
    console.error('Error querying users:', err.message);
  }
  process.exit(0);
}

checkUsers();
