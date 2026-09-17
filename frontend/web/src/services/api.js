export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://alleviare-sfa-api-2026.azurewebsites.net/api'
    : '/api');

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://alleviare-sfa-api-2026.azurewebsites.net'
    : 'http://localhost:5000');

export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('alleviare_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

// Dashboard Summary
export const getDashboardSummary = () => fetchWithAuth('/dashboard/summary');

// Catalog APIs
export const getProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchWithAuth(`/catalog/products?${query}`);
};

export const getDoctors = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchWithAuth(`/catalog/doctors?${query}`);
};

export const addDoctor = (docData) => {
  return fetchWithAuth('/catalog/doctors', {
    method: 'POST',
    body: JSON.stringify(docData)
  });
};

export const getChemists = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchWithAuth(`/catalog/chemists?${query}`);
};

export const getStockists = () => fetchWithAuth('/catalog/stockists');

// DCR APIs
export const getDcrReports = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchWithAuth(`/dcr?${query}`);
};

export const submitDcr = (dcrData) => {
  return fetchWithAuth('/dcr', {
    method: 'POST',
    body: JSON.stringify(dcrData)
  });
};

export const updateDcrStatus = (id, status) => {
  return fetchWithAuth(`/dcr/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
};

// Orders APIs
export const getOrders = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchWithAuth(`/orders?${query}`);
};

export const createOrder = (orderData) => {
  return fetchWithAuth('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};

export const updateOrderStatus = (id, status) => {
  return fetchWithAuth(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
};

// Expenses APIs
export const getExpenses = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchWithAuth(`/expenses?${query}`);
};

export const submitExpense = (expenseData) => {
  return fetchWithAuth('/expenses', {
    method: 'POST',
    body: JSON.stringify(expenseData)
  });
};

export const updateExpenseStatus = (id, status, managerRemarks = '') => {
  return fetchWithAuth(`/expenses/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, managerRemarks })
  });
};

// Tour Plans
export const getTourPlans = () => fetchWithAuth('/tour-plans');

// Attendance & Leaves
export const getAttendance = () => fetchWithAuth('/attendance');
export const recordPunchIn = (data) => fetchWithAuth('/attendance/punch-in', { method: 'POST', body: JSON.stringify(data) });
export const recordPunchOut = (data) => fetchWithAuth('/attendance/punch-out', { method: 'POST', body: JSON.stringify(data) });
export const applyLeave = (leaveData) => fetchWithAuth('/attendance/leave-request', { method: 'POST', body: JSON.stringify(leaveData) });

// Analytics
export const getAnalytics = () => fetchWithAuth('/analytics');

// Live GPS Tracking
export const getLiveTracking = () => fetchWithAuth('/tracking');

// AI Microservice APIs
export const optimizeRoute = (doctorIds) => fetchWithAuth('/ai/optimize-route', { method: 'POST', body: JSON.stringify({ doctorIds }) });
export const scanPrescriptionOcr = (sampleType) => fetchWithAuth('/ai/ocr-prescription', { method: 'POST', body: JSON.stringify({ sampleType }) });

// Notifications
export const getNotifications = () => fetchWithAuth('/notifications');
export const markNotificationRead = (id) => fetchWithAuth(`/notifications/${id}/read`, { method: 'PATCH' });
export const markAllNotificationsRead = () => fetchWithAuth('/notifications/mark-all-read', { method: 'POST' });

// Auth & Users
export const loginUser = (email, role, platform = 'web') => {
  return fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, role, platform })
  });
};

export const getUsers = (role) => {
  const query = role ? `?role=${role}` : '';
  return fetchWithAuth(`/users${query}`);
};
