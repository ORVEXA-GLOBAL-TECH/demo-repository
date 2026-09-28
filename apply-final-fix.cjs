const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

console.log('--- Step 1: Fixing AppManagementTab.jsx ---');
const appTabPath = 'frontend/superadmin/src/pages/tabs/AppManagementTab.jsx';
let appCode = fs.readFileSync(appTabPath, 'utf8');
const appTarget = 'getTierMonthlyRate, toLocalInputDateTime,';
if (appCode.includes(appTarget)) {
  appCode = appCode.replace(appTarget, appTarget + '\n    getAppVersionsOverview, getAppVersions, getUsersOnOldAppVersions, handleDisableAppVersion,');
  fs.writeFileSync(appTabPath, appCode, 'utf8');
  console.log('AppManagementTab.jsx updated.');
} else {
  console.error('Target not found in AppManagementTab.jsx');
}

console.log('\n--- Step 2: Fixing CommunicationsTab.jsx ---');
const commTabPath = 'frontend/superadmin/src/pages/tabs/CommunicationsTab.jsx';
const commCode = fs.readFileSync(commTabPath, 'utf8');
const commLines = commCode.split('\n');

// Extract modals JSX from CommunicationsTab (from line 712 to 5500)
const modalsJsx = commLines.slice(712, 5500).join('\n') + '\n      )}';

// Trim CommunicationsTab to lines 0..710 and close properly
let trimmedComm = commLines.slice(0, 710).join('\n') + '\n  );\n}\n';

// Add missing destructured vars to CommunicationsTab
const commTarget = 'getTierMonthlyRate, toLocalInputDateTime,';
if (trimmedComm.includes(commTarget)) {
  trimmedComm = trimmedComm.replace(commTarget, commTarget + '\n    getGlobalAnnouncements, getNotificationOverview, getNotificationChannels, getAnnouncementAcknowledgments, handleTestDispatchAnnouncement, handleTogglePinAnnouncement,');
}
fs.writeFileSync(commTabPath, trimmedComm, 'utf8');
console.log('CommunicationsTab.jsx trimmed and updated.');

console.log('\n--- Step 3: Updating SuperAdminDashboard.jsx ---');
const dashPath = 'frontend/superadmin/src/pages/SuperAdminDashboard.jsx';
let dashCode = fs.readFileSync(dashPath, 'utf8');

// Add handleSendAnnouncement definition if not present
if (!dashCode.includes('handleSendAnnouncement =')) {
  const handlerTarget = '  const handlePublishAnnouncement =';
  dashCode = dashCode.replace(handlerTarget, '  const handleSendAnnouncement = (...args) => handlePublishAnnouncement(...args);\n' + handlerTarget);
}

// Insert modals before floating shortcut
const shortcutTarget = '{/* ─── FLOATING MANAGE ADMINS SHORTCUT';
const insertPoint = dashCode.lastIndexOf(shortcutTarget);
if (insertPoint !== -1) {
  dashCode = dashCode.slice(0, insertPoint) + '\n      {/* Global Platform Modals */}\n' + modalsJsx + '\n\n      ' + dashCode.slice(insertPoint);
  fs.writeFileSync(dashPath, dashCode, 'utf8');
  console.log('SuperAdminDashboard.jsx updated with global modals.');
} else {
  console.error('Shortcut target not found in SuperAdminDashboard.jsx');
}

console.log('\n--- Step 4: Full AST Verification ---');
const standardGlobals = new Set([
  'window', 'document', 'console', 'Math', 'Date', 'setTimeout', 'clearTimeout',
  'setInterval', 'clearInterval', 'fetch', 'localStorage', 'sessionStorage',
  'navigator', 'Intl', 'JSON', 'URL', 'Array', 'Object', 'String', 'Number',
  'Boolean', 'RegExp', 'Error', 'Promise', 'Set', 'Map', 'alert', 'confirm',
  'prompt', 'location', 'btoa', 'atob', 'isNaN', 'parseInt', 'parseFloat',
  'encodeURIComponent', 'decodeURIComponent', 'Blob', 'FileReader', 'FormData',
  'Event', 'CustomEvent', 'crypto', 'performance', 'history', 'requestAnimationFrame',
  'cancelAnimationFrame', 'undefined', 'NaN', 'Infinity', 'Symbol', 'WeakMap', 'WeakSet',
  'Proxy', 'Reflect', 'URLSearchParams', 'Node', 'Element', 'HTMLElement', 'React'
]);

function checkFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  const missing = [];
  traverse(ast, {
    ReferencedIdentifier(p) {
      const name = p.node.name;
      if (standardGlobals.has(name)) return;
      if (!p.scope.hasBinding(name)) {
        if (!missing.includes(name)) missing.push(name);
      }
    }
  });
  return missing;
}

const dashMissing = checkFile(dashPath);
console.log('SuperAdminDashboard.jsx unresolved identifiers:', dashMissing.length, dashMissing);

const tabsDir = 'frontend/superadmin/src/pages/tabs';
const tabFiles = fs.readdirSync(tabsDir).filter(f => f.endsWith('.jsx'));
let anyTabError = false;
for (const file of tabFiles) {
  const missing = checkFile(path.join(tabsDir, file));
  if (missing.length > 0) {
    console.error(`ERROR in ${file}: missing (${missing.length}) ->`, missing);
    anyTabError = true;
  }
}

if (!anyTabError && dashMissing.length === 0) {
  console.log('\n🎉 ALL FILES IN THE ENTIRE SUPERADMIN PORTAL HAVE 0 UNRESOLVED IDENTIFIERS! 🎉');
}
