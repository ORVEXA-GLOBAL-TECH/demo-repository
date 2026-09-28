import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const email = 'superadmin@orvexa.com';
const password = 'SuperAdmin@2026';

async function main() {
  try {
    const hash = await bcrypt.hash(password, 10);
    const res = await pool.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role, status, designation)
      VALUES ($1, $2, 'Super', 'Admin', 'SUPER_ADMIN', 'Active', 'Master Platform Super Administrator')
      ON CONFLICT (email) DO UPDATE 
        SET password_hash = $2, role = 'SUPER_ADMIN', status = 'Active', 
            first_name = 'Super', last_name = 'Admin'
      RETURNING id, email, role, status;
    `, [email, hash]);

    console.log('✅ Super Admin user created/updated successfully!');
    console.log('   Email   :', res.rows[0].email);
    console.log('   Role    :', res.rows[0].role);
    console.log('   Status  :', res.rows[0].status);
    console.log('   ID      :', res.rows[0].id);
    console.log('');
    console.log('🔐 Login credentials:');
    console.log('   Email   : superadmin@orvexa.com');
    console.log('   Password: SuperAdmin@2026');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
