import bcrypt from 'bcryptjs';
import { query, checkDbHealth } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function createSuperAdmin() {
  console.log('=======================================================');
  console.log('👑 Provisioning Master Super Admin Database User');
  console.log('=======================================================');

  const args = process.argv.slice(2);
  const email = args[0] || process.env.SUPERADMIN_EMAIL || 'superadmin@alleviaresfa.com';
  const rawPassword = args[1] || process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@2026!';
  const firstName = args[2] || 'System';
  const lastName = args[3] || 'SuperAdmin';

  const health = await checkDbHealth();
  if (health.status !== 'CONNECTED') {
    console.error('❌ Cannot connect to PostgreSQL Database:', health.error || 'Check DATABASE_URL');
    process.exit(1);
  }

  try {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(rawPassword, saltRounds);

    // Upsert into users table (tenant_id IS NULL for platform super admins)
    const res = await query(`
      INSERT INTO users (
        tenant_id, email, password_hash, first_name, last_name, role, status
      )
      VALUES (NULL, $1, $2, $3, $4, 'SUPER_ADMIN', 'Active')
      ON CONFLICT (tenant_id, email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = 'SUPER_ADMIN',
        status = 'Active',
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, email, role, status, created_at;
    `, [email.toLowerCase(), passwordHash, firstName, lastName]);

    // Record in Platform Audit Logs
    await query(`
      INSERT INTO platform_audit_logs (
        actor_email, actor_role, action, target_entity, entity_id, details
      )
      VALUES ($1, 'SUPER_ADMIN', 'SUPERADMIN_PROVISIONED', 'users', $2, $3);
    `, [
      email,
      res.rows[0].id,
      JSON.stringify({ email, role: 'SUPER_ADMIN', timestamp: new Date().toISOString() })
    ]);

    console.log('\n✅ [SUCCESS] Master Super Admin Provisioned:');
    console.log(`   • User ID:  ${res.rows[0].id}`);
    console.log(`   • Email:    ${res.rows[0].email}`);
    console.log(`   • Password: ${rawPassword}`);
    console.log(`   • Role:     ${res.rows[0].role}`);
    console.log(`   • Status:   ${res.rows[0].status}`);
    console.log('=======================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to provision Super Admin:', err.message);
    process.exit(1);
  }
}

createSuperAdmin();
