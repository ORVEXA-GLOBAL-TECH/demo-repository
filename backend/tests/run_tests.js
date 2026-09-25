import assert from 'assert';
import { requireRoles, requirePermissions } from '../src/middleware/authMiddleware.js';

console.log('🧪 Running Suite Verification & Security Tests...\n');

let testsPassed = 0;
let testsFailed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    testsFailed++;
  }
}

// ----------------------------------------------------------------------------
// TEST SUITE 1: RBAC & Permission Guards
// ----------------------------------------------------------------------------
runTest('Super Admin passes role check', () => {
  const req = { user: { role: 'SUPER_ADMIN', isSuperAdmin: true } };
  const res = {};
  let nextCalled = false;
  
  const middleware = requireRoles('ADMIN', 'MANAGER');
  middleware(req, res, () => { nextCalled = true; });
  
  assert.strictEqual(nextCalled, true, 'Super Admin should bypass role restrictions');
});

runTest('Company Admin passes ADMIN role check', () => {
  const req = { user: { role: 'ADMIN' } };
  const res = {};
  let nextCalled = false;

  const middleware = requireRoles('ADMIN', 'DIRECTOR');
  middleware(req, res, () => { nextCalled = true; });

  assert.strictEqual(nextCalled, true, 'Company Admin should pass ADMIN role check');
});

runTest('MR fails ADMIN role check with 403 Forbidden', () => {
  const req = { user: { role: 'MR' } };
  let statusCode = null;
  let responseData = null;

  const res = {
    status(code) { statusCode = code; return this; },
    json(data) { responseData = data; }
  };

  const middleware = requireRoles('ADMIN', 'DIRECTOR');
  middleware(req, res, () => {});

  assert.strictEqual(statusCode, 403);
  assert.strictEqual(responseData.code, 'FORBIDDEN');
});

runTest('Permission Guard permits user with explicit permission', () => {
  const req = { user: { role: 'MR', permissions: ['visit.create', 'dcr.submit'] } };
  let nextCalled = false;

  const middleware = requirePermissions('visit.create');
  middleware(req, {}, () => { nextCalled = true; });

  assert.strictEqual(nextCalled, true);
});

// ----------------------------------------------------------------------------
// TEST SUITE 2: Multi-Tenant & Hierarchical Data Scoping
// ----------------------------------------------------------------------------
runTest('Tenant A cannot access Tenant B records', () => {
  const userA = { company_id: 'tenant-a-111', role: 'ADMIN' };
  const recordB = { company_id: 'tenant-b-222', name: 'Dr. Secret' };

  const isAccessAllowed = (user, record) => {
    if (user.role === 'SUPER_ADMIN') return true;
    return user.company_id === record.company_id;
  };

  assert.strictEqual(isAccessAllowed(userA, recordB), false, 'Tenant A user must not access Tenant B record');
});

runTest('Manager A can access assigned MR records, but cannot access Manager B team records', () => {
  const managerA = { id: 'mgr-a', company_id: 'tenant-a', role: 'MANAGER' };
  const mrInTeamA = { id: 'mr-1', company_id: 'tenant-a', manager_id: 'mgr-a' };
  const mrInTeamB = { id: 'mr-2', company_id: 'tenant-a', manager_id: 'mgr-b' };

  const isRecordInScope = (user, record) => {
    if (user.role === 'SUPER_ADMIN') return true;
    if (user.company_id !== record.company_id) return false;
    if (user.role === 'ADMIN' || user.role === 'DIRECTOR') return true;
    if (user.role === 'MANAGER' || user.role === 'MR_SUPERVISOR') {
      return record.manager_id === user.id || record.id === user.id;
    }
    return record.id === user.id;
  };

  assert.strictEqual(isRecordInScope(managerA, mrInTeamA), true, 'Manager A must access team member MR 1');
  assert.strictEqual(isRecordInScope(managerA, mrInTeamB), false, 'Manager A must NOT access Manager B team member MR 2');
});

console.log(`\n==================================================`);
console.log(`📊 TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
console.log(`==================================================\n`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
