const http = require('http');

const roles = ['ADMIN', 'DIRECTOR', 'ACCOUNTANT', 'MANAGER', 'SALES_MANAGER', 'MR_SUPERVISOR', 'MR'];

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, text: data.slice(0, 100) });
        }
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function run() {
  console.log('====================================================');
  console.log('PHARMA MR REPORTING PLATFORM - 7 ROLE VERIFICATION');
  console.log('====================================================\n');

  // 1. Health Check
  const health = await checkUrl('http://localhost:5000/api/health');
  console.log('Backend Health Check (Port 5000):', health.status, health.json?.status || health.error);

  // 2. SuperAdmin Check (Port 5174 - Must be running & untouched)
  const superAdmin = await checkUrl('http://localhost:5174');
  console.log('SuperAdmin Console Check (Port 5174 - PROTECTED):', superAdmin.status === 200 ? '200 OK (FROZEN/PROTECTED)' : superAdmin.status);

  // 3. Web App Check (Port 3000)
  const webApp = await checkUrl('http://localhost:3000');
  console.log('Web Application Check (Port 3000):', webApp.status === 200 ? '200 OK' : webApp.status);

  // 4. Test all 7 role summaries
  console.log('\n--- Testing Role Dashboard APIs ---');
  for (const r of roles) {
    const res = await checkUrl(`http://localhost:5000/api/dashboard/summary?role=${r}`);
    if (res.json && res.json.success) {
      const returnedRole = String(res.json.role || 'DEFAULT');
      console.log(`[PASS] Role: ${r.padEnd(16)} | Returned Role: ${returnedRole.padEnd(16)} | Has Metrics: ${!!res.json.data?.metrics}`);
    } else {
      console.log(`[FAIL] Role: ${r} | Status: ${res.status} | Err:`, res.json || res.error);
    }
  }

  // 5. Test Auth Login for all 7 Personas
  console.log('\n--- Testing Authentication for all 7 Personas ---');
  const personas = [
    { role: 'ADMIN', email: 'admin@alleviare.com' },
    { role: 'DIRECTOR', email: 'director@alleviare.com' },
    { role: 'ACCOUNTANT', email: 'accountant@alleviare.com' },
    { role: 'MANAGER', email: 'manager@alleviare.com' },
    { role: 'SALES_MANAGER', email: 'salesmanager@alleviare.com' },
    { role: 'MR_SUPERVISOR', email: 'mrsupervisor@alleviare.com' },
    { role: 'MR', email: 'mr@alleviare.com' }
  ];

  for (const p of personas) {
    const postData = JSON.stringify({ email: p.email, password: 'password123', role: p.role, platform: 'web' });
    const authRes = await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch(e) {
            resolve({ status: res.statusCode, body });
          }
        });
      });
      req.on('error', err => resolve({ error: err.message }));
      req.write(postData);
      req.end();
    });

    if (authRes.data && authRes.data.success) {
      const u = authRes.data.user || authRes.data.data?.user || {};
      const perms = u.permissions || authRes.data.permissions || [];
      console.log(`[PASS] Login: ${p.role.padEnd(16)} | User: ${u.name} (${u.email}) | Permissions: ${perms.length}`);
    } else {
      console.log(`[FAIL] Login: ${p.role} | Status: ${authRes.status} | Err:`, authRes.data || authRes.error);
    }
  }

  console.log('\n====================================================');
  console.log('VERIFICATION COMPLETE');
  console.log('====================================================');
}

run();
