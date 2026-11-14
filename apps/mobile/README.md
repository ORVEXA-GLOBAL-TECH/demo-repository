# Mobile app (Expo React Native + TypeScript)

```
App.tsx       Session (secure storage), login, module navigation
screens.tsx   Home dashboard, call reports, orders, expenses, attendance & leave, read-only lists
styles.ts     Shared styles
app.config.js Optional cleartext HTTP for LAN test builds (ALLOW_CLEARTEXT=true)
eas.json      Build profile (APK)
```

Server address is injected at build time as `EXPO_PUBLIC_API_URL`; the app shows an error if it is missing.

```bash
npm install
EXPO_PUBLIC_API_URL=http://<LAN-IP>:8080 npx expo start       # development
npx eas-cli env:create --name EXPO_PUBLIC_API_URL --value https://<api> --environment production --visibility plaintext
npx eas-cli build -p android --profile production              # installable APK
```

See `docs/deployment/azure.md` section 3.
