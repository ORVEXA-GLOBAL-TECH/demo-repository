// Shared, dependency-free API client used by the Next.js web app and the React Native app.

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
  currency?: string;
  permissions: string[];
}

export type Role =
  | 'SUPER_ADMIN' | 'ADMIN' | 'DIRECTOR' | 'ACCOUNTANT' | 'MANAGER'
  | 'SALES_MANAGER' | 'MR_SUPERVISOR' | 'MR';

export interface Doctor {
  id: string;
  name: string;
  qualification?: string;
  phone?: string;
  address?: string;
  monthlyTargetVisits?: number;
}


export function qs(params: Record<string, string | undefined>): string {
  const p = Object.entries(params).filter(([, v]) => v && v !== 'ALL');
  return p.length ? '?' + p.map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`).join('&') : '';
}

export interface Product { id: string; sku: string; name: string; composition?: string; category?: string; packSize?: string; mrp: number; ptr: number; pts: number }
export interface Chemist { id: string; name: string; contactPerson?: string; phone?: string; drugLicense?: string; gstin?: string; address?: string; preferredStockist?: string }
export interface Stockist { id: string; name: string; contactPerson?: string; phone?: string; gstin?: string; address?: string }
export interface Employee { id: string; code: string; name: string; email: string; phone?: string; headquarters?: string; status: string; manager?: string }
export interface NewEmployee { code: string; firstName: string; lastName: string; email: string; phone?: string; headquarters?: string }
export interface LoginAccount { id: string; email: string; name: string; role: string; status: string; lastLogin?: string }
export interface OrderItem { productId: string; productName: string; qty: number; ptr: number; amount: number }
export interface Order { id: string; orderNumber: string; orderDate: string; netAmount: number; status: string; remarks?: string; mrName: string; chemistName?: string; stockistName?: string; items: OrderItem[] }
export interface NewOrder { chemistId?: string; stockistId?: string; discountPercent?: number; remarks?: string; items: { productId: string; qty: number }[] }
export interface Expense { id: string; claimNumber: string; date: string; totalClaimAmount: number; status: string; managerRemarks?: string; mrName: string }
export interface NewExpense { date?: string; travelKm?: number; fareRatePerKm?: number; dailyAllowance?: number; hotelCharges?: number; miscCharges?: number; description?: string }
export interface Dcr { id: string; date: string; targetType: 'DOCTOR' | 'CHEMIST'; targetName: string; purpose?: string; feedback?: string; status: string; mrName: string }
export interface NewDcr { targetType: 'DOCTOR' | 'CHEMIST'; targetId: string; purpose?: string; feedback?: string; lat?: number; lng?: number; productIds?: string[] }
export interface TourPlan { id: string; date: string; route: string; objective?: string; targetDoctors: number; status: string; mrName: string }
export interface NewTourPlan { date: string; route: string; objective?: string; targetDoctors?: number }
export interface Attendance { id: string; date: string; status: string; punchInTime?: string; punchOutTime?: string; totalHours: number; punchInLocation?: string; mrName: string }
export interface LeaveSummary { balances: { code: string; name: string; total: number; used: number }[]; requests: { id: string; leaveType: string; fromDate: string; toDate: string; days: number; reason?: string; status: string }[] }
export interface NewLeave { leaveType: string; fromDate: string; toDate: string; reason?: string }
export interface DashboardSummary { role: string; scope: 'SELF' | 'COMPANY'; metrics: Record<string, number>; recentOrders: { orderNumber: string; netAmount: number; status: string; chemistName?: string }[] }

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

export type Platform = 'web' | 'app';

export interface TokenStore {
  get(): string | null | Promise<string | null>;
}

export function createClient(baseUrl: string, tokens: TokenStore, onUnauthorized?: () => void) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await tokens.get();
    let res: Response;
    try {
      res = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(init.headers as Record<string, string> | undefined),
        },
      });
    } catch {
      throw new ApiError(0, 'NETWORK', 'Cannot reach the server. Check your connection and try again.');
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401 && token) onUnauthorized?.();
      throw new ApiError(res.status, body.code ?? 'ERROR', body.message ?? `Request failed (${res.status})`);
    }
    return body as T;
  }

  const list = <T>(path: string) => request<{ count: number; data: T[] }>(path);
  const post = (path: string, body: unknown) =>
    request<{ data: { id: string } & Record<string, unknown> }>(path, { method: 'POST', body: JSON.stringify(body) });
  const patch = (path: string, body: unknown) =>
    request<{ data: Record<string, unknown> }>(path, { method: 'PATCH', body: JSON.stringify(body) });

  return {
    login: (email: string, password: string, platform: Platform) =>
      request<{ token: string; user: User }>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, platform }),
      }),
    me: () => request<{ user: User }>('/api/v1/auth/me'),
    listDoctors: (search?: string) =>
      request<{ count: number; data: Doctor[] }>(`/api/v1/doctors${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    createDoctor: (d: Omit<Doctor, 'id'>) =>
      request<{ data: Doctor }>('/api/v1/doctors', { method: 'POST', body: JSON.stringify(d) }),

    dashboard: () => request<DashboardSummary>('/api/v1/dashboard/summary'),

    listProducts: (search?: string) => list<Product>(`/api/v1/products${qs({ search })}`),
    createProduct: (p: Omit<Product, 'id' | 'sku'>) => post('/api/v1/products', p),
    listChemists: (search?: string) => list<Chemist>(`/api/v1/chemists${qs({ search })}`),
    createChemist: (c: Omit<Chemist, 'id'>) => post('/api/v1/chemists', c),
    listStockists: () => list<Stockist>('/api/v1/stockists'),
    createStockist: (s: Omit<Stockist, 'id'>) => post('/api/v1/stockists', s),
    listEmployees: () => list<Employee>('/api/v1/employees'),
    createEmployee: (e: NewEmployee) => post('/api/v1/employees', e),
    listUsers: () => list<LoginAccount>('/api/v1/users'),
    createUser: (u: { email: string; password: string; role: string }) => post('/api/v1/users', u),
    setUserStatus: (id: string, status: 'Active' | 'Inactive') => patch(`/api/v1/users/${id}/status`, { status }),
    resetPassword: (id: string, password: string) => post(`/api/v1/users/${id}/password`, { password }),

    listOrders: (status?: string) => list<Order>(`/api/v1/orders${qs({ status })}`),
    createOrder: (o: NewOrder) => post('/api/v1/orders', o),
    setOrderStatus: (id: string, status: string) => patch(`/api/v1/orders/${id}/status`, { status }),

    listExpenses: (status?: string) => list<Expense>(`/api/v1/expenses${qs({ status })}`),
    createExpense: (e: NewExpense) => post('/api/v1/expenses', e),
    decideExpense: (id: string, status: 'APPROVED' | 'REJECTED', remarks?: string) =>
      patch(`/api/v1/expenses/${id}/status`, { status, remarks }),

    listDcr: (status?: string) => list<Dcr>(`/api/v1/dcr${qs({ status })}`),
    createDcr: (c: NewDcr) => post('/api/v1/dcr', c),
    setDcrStatus: (id: string, status: 'APPROVED' | 'REJECTED') => patch(`/api/v1/dcr/${id}/status`, { status }),

    listTourPlans: () => list<TourPlan>('/api/v1/tour-plans'),
    createTourPlan: (t: NewTourPlan) => post('/api/v1/tour-plans', t),

    listAttendance: () => list<Attendance>('/api/v1/attendance'),
    punchIn: (locationName?: string) => post('/api/v1/attendance/punch-in', { locationName }),
    punchOut: (locationName?: string) => post('/api/v1/attendance/punch-out', { locationName }),
    leaveSummary: () => request<LeaveSummary>('/api/v1/attendance/leave/summary'),
    requestLeave: (l: NewLeave) => post('/api/v1/attendance/leave/requests', l),
    decideLeave: (id: string, status: 'APPROVED' | 'REJECTED') => patch(`/api/v1/attendance/leave/requests/${id}`, { status }),
  };
}

export type ApiClient = ReturnType<typeof createClient>;

/** Role-specific headline shown on the home screen. */
export const ROLE_TITLE: Record<Role, string> = {
  SUPER_ADMIN: 'Platform Governance',
  ADMIN: 'Company Command Center',
  DIRECTOR: 'Executive Intelligence',
  ACCOUNTANT: 'Finance & Claims',
  MANAGER: 'Team Command Center',
  SALES_MANAGER: 'Sales Control',
  MR_SUPERVISOR: 'Field Supervision',
  MR: "Today's Field Work",
};

export type ModuleId =
  | 'users' | 'doctors' | 'chemists' | 'products' | 'orders' | 'expenses' | 'visits' | 'attendance' | 'tours' | 'employees';

export interface ModuleDef { id: ModuleId; label: string; permission: string; mobile: boolean }

/** Every module of the field-force product and the permission that unlocks it. */
export const MODULES: ModuleDef[] = [
  { id: 'visits', label: 'Daily Call Reports', permission: 'dcr.view', mobile: true },
  { id: 'orders', label: 'Orders', permission: 'order.view', mobile: true },
  { id: 'expenses', label: 'Expenses', permission: 'expense.view', mobile: true },
  { id: 'attendance', label: 'Attendance & Leave', permission: 'attendance.view', mobile: true },
  { id: 'tours', label: 'Tour Plans', permission: 'tour.view', mobile: true },
  { id: 'doctors', label: 'Doctors', permission: 'doctor.view', mobile: true },
  { id: 'chemists', label: 'Chemists', permission: 'chemist.view', mobile: true },
  { id: 'products', label: 'Products', permission: 'product.view', mobile: true },
  { id: 'employees', label: 'Employees', permission: 'employee.view', mobile: true },
  { id: 'users', label: 'Logins', permission: 'user.manage', mobile: false },
];

export const can = (user: User, permission: string): boolean =>
  user.permissions.includes('*') || user.permissions.includes(permission);

/** Modules the signed-in user may open. The server enforces the same permissions. */
export const visibleModules = (user: User): ModuleDef[] => MODULES.filter((m) => can(user, m.permission));

/** Business rules for status changes, shared so web and mobile show the same buttons. */
export const canApprove = (user: User, kind: 'order' | 'expense' | 'dcr' | 'leave'): boolean =>
  can(user, `${kind}.approve`);

let activeCurrency = 'USD';

/** Currency comes from the signed-in user's company; call once after login / session restore. */
export const setCurrency = (code?: string): void => { if (code) activeCurrency = code; };

export const fmtMoney = (n: number | string | undefined): string =>
  Number(n ?? 0).toLocaleString(undefined, { style: 'currency', currency: activeCurrency, maximumFractionDigits: 2 });
