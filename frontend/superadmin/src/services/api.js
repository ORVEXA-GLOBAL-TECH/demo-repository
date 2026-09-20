export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://alleviare-sfa-api-2026.azurewebsites.net/api'
    : '/api');

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://alleviare-sfa-api-2026.azurewebsites.net'
    : 'http://localhost:5000');

export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('orvexa_superadmin_token') || localStorage.getItem('alleviare_token');
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

// Notifications
export const getNotifications = () => fetchWithAuth('/notifications');
export const markNotificationRead = (id) => fetchWithAuth(`/notifications/${id}/read`, { method: 'PATCH' });
export const markAllNotificationsRead = () => fetchWithAuth('/notifications/mark-all-read', { method: 'POST' });

// Auth & Users
export const loginUser = (email, role = 'SUPER_ADMIN', platform = 'web', password = '') => {
  return fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, role, platform, password })
  });
};

export const getUsers = (role) => {
  const query = role ? `?role=${role}` : '';
  return fetchWithAuth(`/users${query}`);
};
