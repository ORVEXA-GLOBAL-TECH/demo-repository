// Extends app.json. Plain-HTTP traffic is blocked by Android unless a build explicitly allows it
// (ALLOW_CLEARTEXT=true), which is only meant for testing against a LAN server. Production builds use HTTPS.
module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    ...(process.env.ALLOW_CLEARTEXT === 'true'
      ? [['expo-build-properties', { android: { usesCleartextTraffic: true } }]]
      : []),
  ],
});
