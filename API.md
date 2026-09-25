# REST API Specification

## Swagger / OpenAPI Specification
Interactive Swagger documentation is served live at: `/api/docs`

## Core API Endpoints

### Authentication & Sessions
- `POST /api/auth/login`: Authenticate user and issue JWT token
- `POST /api/auth/logout`: Terminate active session
- `GET /api/auth/me`: Get active user profile & granted permissions

### Catalog & Customers
- `GET /api/catalog/doctors`: Fetch doctor directory
- `GET /api/catalog/chemists`: Fetch chemist directory
- `GET /api/catalog/products`: Fetch product SKUs with PTR/MRP

### Daily Call Reporting (DCR) & Visits
- `POST /api/dcr`: Submit Daily Call Report
- `GET /api/dcr`: Fetch DCR history
- `PATCH /api/dcr/:id/approve`: Approve DCR report

### Expenses
- `POST /api/expenses`: Submit TA/DA expense claim
- `PATCH /api/expenses/:id/approve`: Verify/Approve expense claim

### Media Storage
- `GET /api/upload/auth`: Generate ImageKit authentication signature
- `POST /api/upload`: Upload file to ImageKit
