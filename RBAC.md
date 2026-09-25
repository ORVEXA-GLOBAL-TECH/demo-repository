# Role-Based Access Control (RBAC) & Data Scoping

## Roles & Permissions Matrix

| Permission | SUPER_ADMIN | ADMIN | DIRECTOR | ACCOUNTANT | MANAGER | SALES_MGR | SUPERVISOR | MR |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `company.create` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `employee.manage` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `doctor.manage` | ✅ | ✅ | 👁️ | ❌ | 👁️ | 👁️ | 👁️ | 👁️ (Assigned) |
| `visit.create` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `dcr.approve` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| `expense.approve` | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `order.approve` | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

## Data Scoping Rules
* **SUPER_ADMIN**: Global access across all tenant companies.
* **ADMIN**: Access restricted to own tenant company (`company_id`).
* **DIRECTOR**: Strategic read-only analytics for company business performance.
* **ACCOUNTANT**: Financial verification for expense claims (`public.expense_claims`).
* **MANAGER / SUPERVISOR**: Access restricted to employees reporting to them (`manager_id`).
* **MR**: Access restricted to own visits (`employee_id`), assigned doctors, and assigned chemists.
