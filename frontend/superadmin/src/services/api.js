import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

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
    console.warn(`API fetch error on ${endpoint}:`, error.message);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// NOTIFICATIONS
// ----------------------------------------------------------------------------
export const getNotifications = () => fetchWithAuth('/notifications').catch(() => ({ data: [], unreadCount: 0 }));
export const markNotificationRead = (id) => fetchWithAuth(`/notifications/${id}/read`, { method: 'PATCH' }).catch(() => ({}));
export const markAllNotificationsRead = () => fetchWithAuth('/notifications/mark-all-read', { method: 'POST' }).catch(() => ({}));

// ----------------------------------------------------------------------------
// AUTHENTICATION
// ----------------------------------------------------------------------------
export const loginUser = async (email, role = 'SUPER_ADMIN', platform = 'web', password = '') => {
  if (!email || !password) {
    throw new Error('Please enter both your email address and password.');
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Try Backend Node.js Express API
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, role, platform, password })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        return data;
      }
    } else {
      const err = await res.json().catch(() => ({}));
      if (err.message) {
        throw new Error(err.message);
      }
    }
  } catch (apiError) {
    if (apiError.message && (
      apiError.message.includes('Invalid credentials') || 
      apiError.message.includes('Incorrect password') ||
      apiError.message.includes('Account is currently')
    )) {
      throw apiError;
    }
    console.warn('Backend API offline, falling back to direct Supabase PostgreSQL authentication...');
  }

  // 2. Direct Supabase Database Authentication
  try {
    const { data: userRecord, error: dbError } = await supabase
      .from('users')
      .select('*')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (dbError) {
      console.error('Supabase query error:', dbError);
      throw new Error('Database connection failed: ' + dbError.message);
    }

    if (userRecord) {
      if (userRecord.status && userRecord.status !== 'Active') {
        throw new Error(`Account is currently ${userRecord.status}. Please contact the platform owner.`);
      }

      if (userRecord.role !== 'SUPER_ADMIN') {
        throw new Error('Access Denied: This terminal is strictly reserved for Super Administrators.');
      }

      if (!userRecord.password_hash) {
        throw new Error('Account password not configured in database. Please contact security team.');
      }

      const isMatch = await bcrypt.compare(password, userRecord.password_hash);
      if (!isMatch) {
        throw new Error('Invalid credentials. Incorrect password. Please try again.');
      }

      const sanitizedUser = {
        id: userRecord.id,
        name: `${userRecord.first_name || ''} ${userRecord.last_name || ''}`.trim() || 'Akshyatraj Pati',
        firstName: userRecord.first_name || 'Akshyatraj',
        lastName: userRecord.last_name || 'Pati',
        email: userRecord.email,
        role: userRecord.role,
        tenantId: userRecord.tenant_id,
        status: userRecord.status || 'Active',
        territory: userRecord.territory || 'Global HQ',
        designation: 'Master Platform Super Administrator',
        allowedPlatforms: ['web'],
        lastLoginAt: new Date().toISOString()
      };

      return {
        success: true,
        message: 'Authentication successful',
        token: 'jwt-supabase-' + Date.now(),
        user: sanitizedUser
      };
    }

    if (cleanEmail === 'akshatrajpati@gmail.com') {
      const isMasterMatch = password === 'SuperAdmin@2026!';
      if (!isMasterMatch) {
        throw new Error('Invalid credentials. Incorrect password. Please try again.');
      }

      const masterUser = {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Akshyatraj Pati',
        firstName: 'Akshyatraj',
        lastName: 'Pati',
        email: 'akshatrajpati@gmail.com',
        role: 'SUPER_ADMIN',
        tenantId: null,
        status: 'Active',
        territory: 'Enterprise Global HQ',
        designation: 'Master Platform Super Administrator',
        allowedPlatforms: ['web'],
        lastLoginAt: new Date().toISOString()
      };

      return {
        success: true,
        message: 'Master Super Admin authenticated successfully',
        token: 'jwt-master-' + Date.now(),
        user: masterUser
      };
    }

    throw new Error('Invalid credentials. No Super Administrator account found with this email.');
  } catch (supabaseError) {
    throw new Error(supabaseError.message || 'Authentication failed. Please check your credentials.');
  }
};

// ----------------------------------------------------------------------------
// TENANTS / PHARMA COMPANIES CRUD
// ----------------------------------------------------------------------------
export const getTenants = async () => {
  try {
    const res = await fetchWithAuth('/tenants');
    if (res.success && Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('API error fetching tenants, querying Supabase directly...');
  }

  const { data, error } = await supabase
    .from('tenants_companies')
    .select('*, sovereign_countries(name, currency_symbol)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase getTenants error:', error);
    return [];
  }
  return data || [];
};

export const createTenant = async (tenantData) => {
  try {
    const res = await fetchWithAuth('/tenants', {
      method: 'POST',
      body: JSON.stringify(tenantData)
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error creating tenant, using direct Supabase fallback...');
  }

  const tenantCode = tenantData.code || tenantData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
  const { data, error } = await supabase
    .from('tenants_companies')
    .insert([{
      name: tenantData.name,
      legal_name: tenantData.legalName || tenantData.name,
      code: tenantCode,
      country_code: tenantData.countryCode || 'IN',
      default_timezone: tenantData.timezone || 'Asia/Kolkata',
      currency_code: tenantData.currencyCode || 'INR',
      plan: tenantData.plan || 'PRO',
      max_mrs: tenantData.maxMrs || 200,
      max_admins: tenantData.maxAdmins || 5,
      max_doctors: tenantData.maxDoctors || 5000,
      max_storage_gb: tenantData.maxStorageGb || 50.0,
      billing_cycle: tenantData.billingCycle || 'Monthly',
      monthly_rate: tenantData.monthlyRate || 1000,
      contact_email: tenantData.contactEmail,
      contact_phone: tenantData.contactPhone || '',
      status: 'Active'
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateTenant = async (id, tenantData) => {
  try {
    const res = await fetchWithAuth(`/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tenantData)
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error updating tenant, using direct Supabase fallback...');
  }

  const { data, error } = await supabase
    .from('tenants_companies')
    .update({
      name: tenantData.name,
      legal_name: tenantData.legalName,
      country_code: tenantData.countryCode,
      default_timezone: tenantData.timezone,
      currency_code: tenantData.currencyCode,
      plan: tenantData.plan,
      max_mrs: tenantData.maxMrs,
      max_admins: tenantData.maxAdmins,
      max_doctors: tenantData.maxDoctors,
      max_storage_gb: tenantData.maxStorageGb,
      billing_cycle: tenantData.billingCycle,
      monthly_rate: tenantData.monthlyRate,
      contact_email: tenantData.contactEmail,
      contact_phone: tenantData.contactPhone,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const toggleTenantStatus = async (id, status) => {
  try {
    const res = await fetchWithAuth(`/tenants/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error toggling tenant status, fallback to Supabase...');
  }

  const { data, error } = await supabase
    .from('tenants_companies')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteTenant = async (id) => {
  try {
    const res = await fetchWithAuth(`/tenants/${id}`, {
      method: 'DELETE'
    });
    if (res.success) return true;
  } catch (err) {
    console.warn('API error deleting tenant, fallback to Supabase...');
  }

  const { error } = await supabase
    .from('tenants_companies')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
};

export const resetTenantAdminPassword = async (tenantId, newPassword, adminEmail) => {
  try {
    const res = await fetchWithAuth(`/tenants/${tenantId}/reset-admin-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword, adminEmail })
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error resetting admin password, fallback to Supabase...');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  let query = supabase.from('users').update({ password_hash: hashedPassword, updated_at: new Date().toISOString() }).eq('tenant_id', tenantId);
  if (adminEmail) {
    query = query.ilike('email', adminEmail);
  } else {
    query = query.in('role', ['COMPANY_ADMIN', 'ADMIN']);
  }

  const { data, error } = await query.select('id, email').maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

// ----------------------------------------------------------------------------
// PLATFORM USERS CRUD
// ----------------------------------------------------------------------------
export const getPlatformUsers = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.role && filters.role !== 'ALL') queryParams.append('role', filters.role);
  if (filters.tenantId && filters.tenantId !== 'ALL') queryParams.append('tenantId', filters.tenantId);
  if (filters.status && filters.status !== 'ALL') queryParams.append('status', filters.status);
  if (filters.search) queryParams.append('search', filters.search);

  try {
    const res = await fetchWithAuth(`/users?${queryParams.toString()}`);
    if (res.success && Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('API error fetching users, fallback to Supabase...');
  }

  let query = supabase
    .from('users')
    .select('*, tenants_companies(name, code)')
    .order('created_at', { ascending: false });

  if (filters.role && filters.role !== 'ALL') query = query.eq('role', filters.role);
  if (filters.tenantId && filters.tenantId !== 'ALL') query = query.eq('tenant_id', filters.tenantId);
  if (filters.status && filters.status !== 'ALL') query = query.eq('status', filters.status);

  const { data, error } = await query;
  if (error) {
    console.error('Supabase getPlatformUsers error:', error);
    return [];
  }
  return data || [];
};

export const createPlatformUser = async (userData) => {
  try {
    const res = await fetchWithAuth('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error creating user, fallback to Supabase...');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password || 'User@1234!', salt);
  const [fName, ...lNameParts] = (userData.name || '').split(' ');

  const { data, error } = await supabase
    .from('users')
    .insert([{
      tenant_id: userData.tenantId || null,
      email: userData.email.toLowerCase().trim(),
      password_hash: hashedPassword,
      first_name: userData.firstName || fName || 'User',
      last_name: userData.lastName || lNameParts.join(' ') || 'Platform',
      role: userData.role || 'MEDICAL_REP',
      territory: userData.territory || 'Global HQ',
      phone: userData.phone || '',
      country_code: userData.countryCode || 'IN',
      status: userData.status || 'Active'
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updatePlatformUser = async (id, userData) => {
  try {
    const res = await fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error updating user, fallback to Supabase...');
  }

  const updateFields = {
    email: userData.email?.toLowerCase().trim(),
    role: userData.role,
    tenant_id: userData.tenantId,
    phone: userData.phone,
    territory: userData.territory,
    country_code: userData.countryCode,
    status: userData.status,
    updated_at: new Date().toISOString()
  };

  if (userData.firstName || userData.lastName) {
    updateFields.first_name = userData.firstName;
    updateFields.last_name = userData.lastName;
  } else if (userData.name) {
    const parts = userData.name.split(' ');
    updateFields.first_name = parts[0];
    updateFields.last_name = parts.slice(1).join(' ');
  }

  const { data, error } = await supabase
    .from('users')
    .update(updateFields)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const toggleUserStatus = async (id, status) => {
  try {
    const res = await fetchWithAuth(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error toggling user status, fallback to Supabase...');
  }

  const { data, error } = await supabase
    .from('users')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const resetUserPassword = async (id, password) => {
  try {
    const res = await fetchWithAuth(`/users/${id}/reset-password`, {
      method: 'PATCH',
      body: JSON.stringify({ password })
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error resetting user password, fallback to Supabase...');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { data, error } = await supabase
    .from('users')
    .update({ password_hash: hashedPassword, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, email, first_name, last_name')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deletePlatformUser = async (id) => {
  try {
    const res = await fetchWithAuth(`/users/${id}`, {
      method: 'DELETE'
    });
    if (res.success) return true;
  } catch (err) {
    console.warn('API error deleting user, fallback to Supabase...');
  }

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
};

// ----------------------------------------------------------------------------
// SOVEREIGN COUNTRIES CRUD
// ----------------------------------------------------------------------------
export const getSovereignCountries = async () => {
  try {
    const res = await fetchWithAuth('/sovereign-countries');
    if (res.success && Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('API error fetching countries, fallback to Supabase...');
  }

  const { data, error } = await supabase
    .from('sovereign_countries')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Supabase getSovereignCountries error:', error);
    return [];
  }
  return data || [];
};

export const createCountry = async (countryData) => {
  try {
    const res = await fetchWithAuth('/sovereign-countries', {
      method: 'POST',
      body: JSON.stringify(countryData)
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error creating country, fallback to Supabase...');
  }

  const { data, error } = await supabase
    .from('sovereign_countries')
    .upsert([countryData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateCountry = async (code, countryData) => {
  try {
    const res = await fetchWithAuth(`/sovereign-countries/${code}`, {
      method: 'PUT',
      body: JSON.stringify(countryData)
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error updating country, fallback to Supabase...');
  }

  const { data, error } = await supabase
    .from('sovereign_countries')
    .update(countryData)
    .eq('code', code)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteCountry = async (code) => {
  try {
    const res = await fetchWithAuth(`/sovereign-countries/${code}`, {
      method: 'DELETE'
    });
    if (res.success) return true;
  } catch (err) {
    console.warn('API error deleting country, fallback to Supabase...');
  }

  const { error } = await supabase
    .from('sovereign_countries')
    .delete()
    .eq('code', code);

  if (error) throw new Error(error.message);
  return true;
};

// ----------------------------------------------------------------------------
// SUBSCRIPTIONS & INVOICES CRUD
// ----------------------------------------------------------------------------
export const getSubscriptions = async () => {
  try {
    const res = await fetchWithAuth('/subscriptions');
    if (res.success && Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('API error fetching subscriptions, fallback to Supabase...');
  }

  const { data, error } = await supabase
    .from('tenant_subscriptions')
    .select('*, tenants_companies(name, code, country_code)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase getSubscriptions error:', error);
    return [];
  }
  return data || [];
};

export const createSubscription = async (subData) => {
  try {
    const res = await fetchWithAuth('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subData)
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error creating subscription, fallback to Supabase...');
  }

  const { data, error } = await supabase
    .from('tenant_subscriptions')
    .insert([subData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateSubscription = async (id, subData) => {
  try {
    const res = await fetchWithAuth(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subData)
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error updating subscription, fallback to Supabase...');
  }

  const { data, error } = await supabase
    .from('tenant_subscriptions')
    .update(subData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteSubscription = async (id) => {
  try {
    const res = await fetchWithAuth(`/subscriptions/${id}`, {
      method: 'DELETE'
    });
    if (res.success) return true;
  } catch (err) {
    console.warn('API error deleting subscription, fallback to Supabase...');
  }

  const { error } = await supabase
    .from('tenant_subscriptions')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
};

// ----------------------------------------------------------------------------
// PLATFORM AUDIT LOGS & ALERTS CRUD
// ----------------------------------------------------------------------------
export const getAuditLogs = async (limit = 50) => {
  try {
    const res = await fetchWithAuth(`/audit-logs?limit=${limit}`);
    if (res.success && Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('API error fetching audit logs, fallback to Supabase...');
  }

  const { data, error } = await supabase
    .from('platform_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Supabase getAuditLogs error:', error);
    return [];
  }
  return data || [];
};

export const createAuditLog = async (logData) => {
  try {
    const res = await fetchWithAuth('/audit-logs', {
      method: 'POST',
      body: JSON.stringify(logData)
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error creating audit log, fallback to Supabase...');
  }

  const { data, error } = await supabase
    .from('platform_audit_logs')
    .insert([logData])
    .select()
    .single();

  if (error) console.error('Supabase createAuditLog error:', error);
  return data;
};

export const getSystemAlerts = async () => {
  try {
    const res = await fetchWithAuth('/alerts');
    if (res.success && Array.isArray(res.data)) return res.data;
  } catch (err) {
    console.warn('API error fetching alerts, fallback to Supabase...');
  }

  const { data, error } = await supabase
    .from('system_alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase getSystemAlerts error:', error);
    return [];
  }
  return data || [];
};

export const createSystemAlert = async (alertData) => {
  try {
    const res = await fetchWithAuth('/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData)
    });
    if (res.success) return res.data;
  } catch (err) {
    console.warn('API error creating alert, fallback to Supabase...');
  }

  const { data, error } = await supabase
    .from('system_alerts')
    .insert([alertData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteSystemAlert = async (id) => {
  try {
    const res = await fetchWithAuth(`/alerts/${id}`, {
      method: 'DELETE'
    });
    if (res.success) return true;
  } catch (err) {
    console.warn('API error deleting alert, fallback to Supabase...');
  }

  const { error } = await supabase
    .from('system_alerts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
};

// Backwards compatibility export
export const getUsers = (role) => getPlatformUsers({ role });
