# Testing & Quality Assurance Guide

## Automated Backend & Security Tests

Run the security and suite test runner:
```bash
node backend/tests/run_tests.js
```

### Test Scope:
- **JWT & Single-Session Verification**: Tests active session token validation and concurrent login invalidation.
- **RBAC Role Guards**: Tests `requireRoles('ADMIN', 'MANAGER')` access control.
- **Granular Permission Guards**: Tests `requirePermissions('visit.create')` validation.
- **Multi-Tenant Data Isolation**: Verifies tenant scoping rules to prevent cross-company data leakage.

## Frontend Production Build Verification
To ensure all frontend static web apps build cleanly without bundle errors:
```bash
npm run build:all
```
