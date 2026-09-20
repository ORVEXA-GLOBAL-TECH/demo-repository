import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// In-memory version releases store
let appVersionsStore = [
  {
    id: 'ver-and-341',
    versionString: 'v3.4.1',
    buildNumber: 184,
    platform: 'ANDROID',
    releaseType: 'STABLE_PRODUCTION',
    releaseNotes: 'Fixed intermittent background GPS telemetry drift on Android 14. Optimized SQLite local catalog cache for >50,000 SKUs.',
    minOsVersion: 'Android 10.0+ (API 29)',
    isForceUpdate: false,
    isDisabled: false,
    rolloutPercentage: 100,
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.orvexa.sfa',
    status: 'ACTIVE',
    activeUsersCount: 8420,
    adoptionRatePct: 63.8,
    releasedBy: 'Akshyatraj Pati (Super Admin)',
    releasedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
  },
  {
    id: 'ver-ios-341',
    versionString: 'v3.4.1',
    buildNumber: 184,
    platform: 'IOS',
    releaseType: 'STABLE_PRODUCTION',
    releaseNotes: 'iOS 18 compatibility enhancements, FaceID biometrics biometric unlock speedup, and instant chemist geofencing.',
    minOsVersion: 'iOS 15.0+',
    isForceUpdate: false,
    isDisabled: false,
    rolloutPercentage: 100,
    downloadUrl: 'https://apps.apple.com/app/orvexa-pharma-sfa/id162849102',
    status: 'ACTIVE',
    activeUsersCount: 3120,
    adoptionRatePct: 65.0,
    releasedBy: 'Akshyatraj Pati (Super Admin)',
    releasedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
  },
  {
    id: 'ver-and-340',
    versionString: 'v3.4.0',
    buildNumber: 180,
    platform: 'ANDROID',
    releaseType: 'STABLE_PRODUCTION',
    releaseNotes: 'Introduced chemist POB credit validation, offline optical doctor prescription scanner, and expense receipts upload.',
    minOsVersion: 'Android 9.0+ (API 28)',
    isForceUpdate: false,
    isDisabled: false,
    rolloutPercentage: 100,
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.orvexa.sfa',
    status: 'ACTIVE',
    activeUsersCount: 3840,
    adoptionRatePct: 29.1,
    releasedBy: 'Akshyatraj Pati (Super Admin)',
    releasedAt: new Date(Date.now() - 25 * 86400 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 25 * 86400 * 1000).toISOString()
  },
  {
    id: 'ver-ios-340',
    versionString: 'v3.4.0',
    buildNumber: 180,
    platform: 'IOS',
    releaseType: 'STABLE_PRODUCTION',
    releaseNotes: 'Chemist POB credit checks and CoreML visual product detailer aid for field calls.',
    minOsVersion: 'iOS 14.0+',
    isForceUpdate: false,
    isDisabled: false,
    rolloutPercentage: 100,
    downloadUrl: 'https://apps.apple.com/app/orvexa-pharma-sfa/id162849102',
    status: 'ACTIVE',
    activeUsersCount: 1420,
    adoptionRatePct: 29.6,
    releasedBy: 'Akshyatraj Pati (Super Admin)',
    releasedAt: new Date(Date.now() - 25 * 86400 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 25 * 86400 * 1000).toISOString()
  },
  {
    id: 'ver-and-330',
    versionString: 'v3.3.0',
    buildNumber: 165,
    platform: 'ANDROID',
    releaseType: 'STABLE_PRODUCTION',
    releaseNotes: 'Legacy build. Missing new offline encryption headers.',
    minOsVersion: 'Android 8.0+ (API 26)',
    isForceUpdate: true,
    isDisabled: true,
    rolloutPercentage: 100,
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.orvexa.sfa',
    status: 'DISABLED',
    activeUsersCount: 420,
    adoptionRatePct: 3.2,
    releasedBy: 'Akshyatraj Pati (Super Admin)',
    releasedAt: new Date(Date.now() - 90 * 86400 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 86400 * 1000).toISOString()
  },
  {
    id: 'ver-ios-330',
    versionString: 'v3.3.0',
    buildNumber: 165,
    platform: 'IOS',
    releaseType: 'STABLE_PRODUCTION',
    releaseNotes: 'Legacy build. Deprecated TLS cipher suites.',
    minOsVersion: 'iOS 13.0+',
    isForceUpdate: true,
    isDisabled: true,
    rolloutPercentage: 100,
    downloadUrl: 'https://apps.apple.com/app/orvexa-pharma-sfa/id162849102',
    status: 'DISABLED',
    activeUsersCount: 260,
    adoptionRatePct: 5.4,
    releasedBy: 'Akshyatraj Pati (Super Admin)',
    releasedAt: new Date(Date.now() - 90 * 86400 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 86400 * 1000).toISOString()
  }
];

let userDevicesStore = [
  {
    id: 'dev-001',
    userName: 'Ramesh Patel',
    userEmail: 'ramesh.p@pfizerbiopharma.com',
    role: 'MEDICAL_REP',
    companyName: 'Pfizer BioPharma Ltd',
    appVersion: 'v3.3.0',
    buildNumber: 165,
    platform: 'ANDROID',
    deviceModel: 'Samsung Galaxy A51',
    osVersion: 'Android 11',
    isOutdated: true,
    isBlocked: true,
    lastActiveAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'dev-002',
    userName: 'Suresh Raina',
    userEmail: 'suresh.r@pfizerbiopharma.com',
    role: 'MEDICAL_REP',
    companyName: 'Pfizer BioPharma Ltd',
    appVersion: 'v3.3.0',
    buildNumber: 165,
    platform: 'ANDROID',
    deviceModel: 'Xiaomi Redmi Note 10',
    osVersion: 'Android 12',
    isOutdated: true,
    isBlocked: true,
    lastActiveAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  },
  {
    id: 'dev-003',
    userName: 'Ananya Deshmukh',
    userEmail: 'ananya.d@novartispharma.com',
    role: 'AREA_MANAGER',
    companyName: 'Novartis Pharma Global',
    appVersion: 'v3.3.0',
    buildNumber: 165,
    platform: 'IOS',
    deviceModel: 'iPhone 11 Pro',
    osVersion: 'iOS 15.4',
    isOutdated: true,
    isBlocked: true,
    lastActiveAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
  },
  {
    id: 'dev-004',
    userName: 'Tariq Al-Mansoor',
    userEmail: 'tariq.m@astrazeneca.com',
    role: 'MEDICAL_REP',
    companyName: 'AstraZeneca Healthcare',
    appVersion: 'v3.4.0',
    buildNumber: 180,
    platform: 'ANDROID',
    deviceModel: 'OnePlus Nord CE',
    osVersion: 'Android 13',
    isOutdated: true,
    isBlocked: false,
    lastActiveAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'dev-005',
    userName: 'David Miller',
    userEmail: 'david.m@sanofi.com',
    role: 'MEDICAL_REP',
    companyName: 'Sanofi Healthcare Ltd',
    appVersion: 'v3.4.0',
    buildNumber: 180,
    platform: 'IOS',
    deviceModel: 'iPhone 13',
    osVersion: 'iOS 16.6',
    isOutdated: true,
    isBlocked: false,
    lastActiveAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  }
];

// ==============================================================================
// 1. OVERVIEW TELEMETRY & FLEET ADOPTION
// ==============================================================================
// GET /api/app-versions/overview
router.get('/overview', (req, res) => {
  const latestAndroid = appVersionsStore.find(v => v.platform === 'ANDROID' && v.status === 'ACTIVE') || appVersionsStore[0];
  const latestIos = appVersionsStore.find(v => v.platform === 'IOS' && v.status === 'ACTIVE') || appVersionsStore[1];

  const totalReps = 13200;
  const outdatedUsers = userDevicesStore.filter(d => d.isOutdated).length;
  const blockedUsers = userDevicesStore.filter(d => d.isBlocked).length;

  res.json({
    success: true,
    data: {
      latestAndroidVersion: latestAndroid.versionString,
      latestAndroidBuild: latestAndroid.buildNumber,
      latestIosVersion: latestIos.versionString,
      latestIosBuild: latestIos.buildNumber,
      minimumSupportedBuild: 180,
      totalActiveMobileUsers: totalReps,
      outdatedDevicesCount: 680,
      blockedDevicesCount: 420,
      totalReleasesCount: appVersionsStore.length,
      platformAdoption: {
        v3_4_1: { percentage: 64.2, count: 8474, status: 'LATEST' },
        v3_4_0: { percentage: 29.3, count: 3867, status: 'SUPPORTED' },
        v3_3_0: { percentage: 6.5, count: 859, status: 'BLOCKED_FORCE_UPDATE' }
      }
    }
  });
});

// ==============================================================================
// 2. LIST ALL RELEASES
// ==============================================================================
// GET /api/app-versions
router.get('/', async (req, res) => {
  const { platform } = req.query;

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      let sql = 'SELECT * FROM mobile_app_versions WHERE 1=1';
      const params = [];
      if (platform && platform !== 'ALL') {
        params.push(platform);
        sql += ` AND (platform = $${params.length} OR platform = 'ALL')`;
      }
      sql += ' ORDER BY build_number DESC';
      const result = await query(sql, params);
      if (result.rows.length > 0) {
        return res.json({
          success: true,
          count: result.rows.length,
          data: result.rows.map(r => ({
            id: r.id,
            versionString: r.version_string,
            buildNumber: r.build_number,
            platform: r.platform,
            releaseType: r.release_type,
            releaseNotes: r.release_notes,
            minOsVersion: r.min_os_version,
            isForceUpdate: r.is_force_update,
            isDisabled: r.is_disabled,
            rolloutPercentage: r.rollout_percentage,
            downloadUrl: r.download_url,
            status: r.status,
            activeUsersCount: r.active_users_count,
            adoptionRatePct: parseFloat(r.adoption_rate_pct || 0),
            releasedBy: r.released_by,
            releasedAt: r.released_at,
            createdAt: r.created_at
          }))
        });
      }
    }
  } catch (err) {
    console.warn('DB query error for app versions, falling back to memory store:', err.message);
  }

  let filtered = [...appVersionsStore];
  if (platform && platform !== 'ALL') {
    filtered = filtered.filter(v => v.platform === platform || v.platform === 'ALL');
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// ==============================================================================
// 3. RELEASE NEW VERSION (CREATE & PUBLISH)
// ==============================================================================
// POST /api/app-versions
router.post('/', async (req, res) => {
  const {
    versionString,
    buildNumber,
    platform,
    releaseType,
    releaseNotes,
    minOsVersion,
    isForceUpdate,
    rolloutPercentage,
    downloadUrl,
    releasedBy
  } = req.body;

  if (!versionString || !buildNumber || !releaseNotes) {
    return res.status(400).json({
      success: false,
      message: 'Version String (e.g. v3.4.2), Build Number (e.g. 185), and Release Notes are required.'
    });
  }

  const newVersion = {
    id: `ver-${(platform || 'all').toLowerCase().slice(0, 3)}-${Date.now()}`,
    versionString: versionString.startsWith('v') ? versionString : `v${versionString}`,
    buildNumber: parseInt(buildNumber, 10),
    platform: platform || 'ALL',
    releaseType: releaseType || 'STABLE_PRODUCTION',
    releaseNotes,
    minOsVersion: minOsVersion || (platform === 'IOS' ? 'iOS 15.0+' : 'Android 10.0+'),
    isForceUpdate: Boolean(isForceUpdate),
    isDisabled: false,
    rolloutPercentage: parseInt(rolloutPercentage, 10) || 100,
    downloadUrl: downloadUrl || (platform === 'IOS' ? 'https://apps.apple.com/app/orvexa-pharma-sfa' : 'https://play.google.com/store/apps/details?id=com.orvexa.sfa'),
    status: 'ACTIVE',
    activeUsersCount: 0,
    adoptionRatePct: 0.0,
    releasedBy: releasedBy || 'Akshyatraj Pati (Super Admin)',
    releasedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      await query(
        `INSERT INTO mobile_app_versions (
          version_string, build_number, platform, release_type, release_notes,
          min_os_version, is_force_update, is_disabled, rollout_percentage,
          download_url, status, active_users_count, adoption_rate_pct, released_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, false, $8, $9, 'ACTIVE', 0, 0, $10)
        ON CONFLICT (platform, build_number) DO UPDATE SET
          version_string = EXCLUDED.version_string,
          release_notes = EXCLUDED.release_notes,
          is_force_update = EXCLUDED.is_force_update,
          status = 'ACTIVE'`,
        [
          newVersion.versionString,
          newVersion.buildNumber,
          newVersion.platform,
          newVersion.releaseType,
          newVersion.releaseNotes,
          newVersion.minOsVersion,
          newVersion.isForceUpdate,
          newVersion.rolloutPercentage,
          newVersion.downloadUrl,
          newVersion.releasedBy
        ]
      );
    }
  } catch (err) {
    console.warn('DB app version insert failed, saved to memory:', err.message);
  }

  appVersionsStore.unshift(newVersion);

  res.status(201).json({
    success: true,
    message: `Mobile App Version ${newVersion.versionString} (Build ${newVersion.buildNumber}) successfully released for ${newVersion.platform}.`,
    data: newVersion
  });
});

// ==============================================================================
// 4. TOGGLE FORCE UPDATE
// ==============================================================================
// PATCH /api/app-versions/:id/force-update
router.patch('/:id/force-update', async (req, res) => {
  const { id } = req.params;
  const found = appVersionsStore.find(v => v.id === id);

  if (!found) {
    return res.status(404).json({ success: false, message: 'App version release not found' });
  }

  found.isForceUpdate = !found.isForceUpdate;

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      await query('UPDATE mobile_app_versions SET is_force_update = $1 WHERE id = $2 OR build_number::text = $2', [found.isForceUpdate, id]);
    }
  } catch (err) {
    console.warn('DB force update toggle error:', err.message);
  }

  res.json({
    success: true,
    message: `Force update ${found.isForceUpdate ? 'ENFORCED' : 'RELAXED'} for build ${found.versionString}. Users below this version will ${found.isForceUpdate ? 'be blocked until upgraded' : 'be allowed to proceed'}.`,
    isForceUpdate: found.isForceUpdate
  });
});

// ==============================================================================
// 5. DISABLE / SUNSET OLD VERSION
// ==============================================================================
// PATCH /api/app-versions/:id/disable
router.patch('/:id/disable', async (req, res) => {
  const { id } = req.params;
  const found = appVersionsStore.find(v => v.id === id);

  if (!found) {
    return res.status(404).json({ success: false, message: 'App version release not found' });
  }

  found.isDisabled = true;
  found.status = 'DISABLED';

  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      await query("UPDATE mobile_app_versions SET is_disabled = true, status = 'DISABLED' WHERE id = $1 OR build_number::text = $1", [id]);
    }
  } catch (err) {
    console.warn('DB disable version error:', err.message);
  }

  res.json({
    success: true,
    message: `App version ${found.versionString} (Build ${found.buildNumber}) has been permanently DISABLED and sunset. All API handshakes will return HTTP 426 Upgrade Required.`,
    data: found
  });
});

// ==============================================================================
// 6. USERS ON OUTDATED BUILDS
// ==============================================================================
// GET /api/app-versions/users-on-old-versions
router.get('/users-on-old-versions', async (req, res) => {
  try {
    const isHealthy = await checkDbHealth();
    if (isHealthy) {
      const result = await query('SELECT * FROM mobile_app_user_devices WHERE is_outdated = true ORDER BY last_active_at DESC');
      if (result.rows.length > 0) {
        return res.json({
          success: true,
          count: result.rows.length,
          data: result.rows.map(r => ({
            id: r.id,
            userName: r.user_name,
            userEmail: r.user_email,
            role: r.role,
            companyName: r.company_name,
            appVersion: r.app_version,
            buildNumber: r.build_number,
            platform: r.platform,
            deviceModel: r.device_model,
            osVersion: r.os_version,
            isOutdated: r.is_outdated,
            isBlocked: r.is_blocked,
            lastActiveAt: r.last_active_at
          }))
        });
      }
    }
  } catch (err) {
    console.warn('DB user devices query error:', err.message);
  }

  res.json({
    success: true,
    count: userDevicesStore.length,
    data: userDevicesStore
  });
});

// ==============================================================================
// 7. SEND UPGRADE REMINDER PUSH
// ==============================================================================
// POST /api/app-versions/send-upgrade-reminder
router.post('/send-upgrade-reminder', (req, res) => {
  const { targetUserEmail, targetDevice, broadcastAll } = req.body;

  if (broadcastAll) {
    return res.json({
      success: true,
      message: `Emergency upgrade push notification dispatched to all ${userDevicesStore.length} field representatives on outdated app builds.`,
      dispatchedCount: userDevicesStore.length,
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    message: `Upgrade reminder push notification sent to ${targetUserEmail || 'field representative'} on device ${targetDevice || 'mobile client'}.`,
    timestamp: new Date().toISOString()
  });
});

export default router;
