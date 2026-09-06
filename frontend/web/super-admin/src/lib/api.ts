// Alleviare Central API Client & Gateway Interceptor

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface UserSession {
  token: string;
  userId: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  territoryId?: string;
}

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('alleviare_jwt') || sessionStorage.getItem('alleviare_jwt');
  },
  set: (token: string, remember: boolean = true) => {
    if (typeof window === 'undefined') return;
    if (remember) {
      localStorage.setItem('alleviare_jwt', token);
    } else {
      sessionStorage.setItem('alleviare_jwt', token);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('alleviare_jwt');
    localStorage.removeItem('alleviare_user');
    sessionStorage.removeItem('alleviare_jwt');
    sessionStorage.removeItem('alleviare_user');
  },
  getUser: (): UserSession | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('alleviare_user') || sessionStorage.getItem('alleviare_user');
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: UserSession, remember: boolean = true) => {
    if (typeof window === 'undefined') return;
    const target = remember ? localStorage : sessionStorage;
    target.setItem('alleviare_user', JSON.stringify(user));
  }
};

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (res.status === 401) {
      // Clear token if expired or invalid
      tokenStorage.clear();
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || `Request failed with status ${res.status}`);
    }

    const body = await res.json();
    return body.data !== undefined ? body.data : body;
  } catch (err: any) {
    console.warn(`[API Call ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  auth: {
    login: async (usernameOrEmail: string, password: string, remember = true) => {
      const data = await fetchWithAuth<UserSession>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ usernameOrEmail, password })
      });
      if (data && data.token) {
        tokenStorage.set(data.token, remember);
        tokenStorage.setUser(data, remember);
      }
      return data;
    },
    superAdminLogin: async (usernameOrEmail: string, password: string, remember = true) => {
      const data = await fetchWithAuth<UserSession>('/auth/super-admin/login', {
        method: 'POST',
        body: JSON.stringify({ usernameOrEmail, password })
      });
      if (data && data.token) {
        tokenStorage.set(data.token, remember);
        tokenStorage.setUser(data, remember);
      }
      return data;
    },
    staffLogin: async (usernameOrEmail: string, password: string, remember = true) => {
      const data = await fetchWithAuth<UserSession>('/auth/staff/login', {
        method: 'POST',
        body: JSON.stringify({ usernameOrEmail, password })
      });
      if (data && data.token) {
        tokenStorage.set(data.token, remember);
        tokenStorage.setUser(data, remember);
      }
      return data;
    },
    getMe: () => fetchWithAuth<UserSession>('/auth/me'),
    logout: () => tokenStorage.clear()
  },
  users: {
    getAll: (role?: string) => fetchWithAuth<any[]>(role ? `/users?role=${role}` : '/users'),
    getById: (id: string) => fetchWithAuth<any>(`/users/${id}`),
    create: (user: any) => fetchWithAuth<any>('/users', { method: 'POST', body: JSON.stringify(user) }),
    toggleStatus: (id: string) => fetchWithAuth<any>(`/users/${id}/toggle-status`, { method: 'PATCH' })
  },
  doctors: {
    getAll: (mrId?: string) => fetchWithAuth<any[]>(mrId ? `/doctors?mrId=${mrId}` : '/doctors'),
    getById: (id: string) => fetchWithAuth<any>(`/doctors/${id}`),
    create: (doctor: any) => fetchWithAuth<any>('/doctors', { method: 'POST', body: JSON.stringify(doctor) }),
    verify: (id: string) => fetchWithAuth<any>(`/doctors/${id}/verify`, { method: 'PATCH' })
  },
  products: {
    getAll: () => fetchWithAuth<any[]>('/products')
  },
  visits: {
    getByMr: (mrId: string) => fetchWithAuth<any[]>(`/visits?mrId=${mrId}`),
    record: (visit: any) => fetchWithAuth<any>('/visits', { method: 'POST', body: JSON.stringify(visit) })
  },
  orders: {
    getAll: (mrId?: string) => fetchWithAuth<any[]>(mrId ? `/orders?mrId=${mrId}` : '/orders'),
    create: (order: any) => fetchWithAuth<any>('/orders', { method: 'POST', body: JSON.stringify(order) })
  },
  expenses: {
    getAll: (employeeId?: string, status?: string) => {
      const query = new URLSearchParams();
      if (employeeId) query.set('employeeId', employeeId);
      if (status) query.set('status', status);
      const qs = query.toString();
      return fetchWithAuth<any[]>(qs ? `/expenses?${qs}` : '/expenses');
    },
    submit: (expense: any) => fetchWithAuth<any>('/expenses', { method: 'POST', body: JSON.stringify(expense) }),
    approve: (id: string, role: string) => fetchWithAuth<any>(`/expenses/${id}/approve?role=${role}`, { method: 'PATCH' })
  }
};
