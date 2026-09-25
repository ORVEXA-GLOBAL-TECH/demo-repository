# Deployment & CI/CD Pipeline

## Microsoft Azure Static Web Apps Deployment

The project configures dual Azure Static Web Apps deployments via GitHub Actions:

### 1. Super Admin Console
- **GitHub Workflow**: `.github/workflows/azure-static-web-apps-happy-sea-0ee625c00.yml`
- **Location**: `frontend/superadmin`
- **Build Output**: `frontend/superadmin/dist`
- **Live Endpoint**: `https://happy-sea-0ee625c00.3.azurestaticapps.net/`

### 2. Staff & Field Portal
- **GitHub Workflow**: `.github/workflows/azure-static-web-apps-happy-hill-0e8076300.yml`
- **Location**: `frontend/web`
- **Build Output**: `frontend/web/dist`
- **Live Endpoint**: `https://happy-hill-0e8076300.1.azurestaticapps.net/`

## Backend API Deployment
- **Docker Build**: `backend/Dockerfile`
- **Environment**: Node.js v20 LTS
- **Production Server**: Azure App Service / Docker Container instance
