import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

export const DEFAULT_USERS = {
  ADMIN: {
    id: 'usr-001',
    name: 'Dr. Rajesh Sharma',
    email: 'admin@alleviare.com',
    role: 'ADMIN',
    designation: 'National Corporate Admin / Ops Lead',
    territory: 'National HQ (All Zones)',
    allowedPlatforms: ['web']
  },
  DIRECTOR: {
    id: 'usr-002',
    name: 'Vikramaditya Singhania',
    email: 'director@alleviare.com',
    role: 'DIRECTOR',
    designation: 'Commercial & Managing Director',
    territory: 'Pan India Commercial Ops',
    allowedPlatforms: ['web', 'app']
  },
  MANAGER: {
    id: 'usr-003',
    name: 'Meenakshi Sundaram',
    email: 'manager@alleviare.com',
    role: 'MANAGER',
    designation: 'Commercial Operations Manager',
    territory: 'Pan India Operations HQ',
    allowedPlatforms: ['web', 'app']
  },
  SALES_MANAGER: {
    id: 'usr-004',
    name: 'Priya Mukherjee',
    email: 'salesmanager@alleviare.com',
    role: 'SALES_MANAGER',
    designation: 'Regional Sales Manager (North Zone)',
    territory: 'North Zone India',
    allowedPlatforms: ['web', 'app']
  },
  SALES_SUPERVISOR: {
    id: 'usr-005',
    name: 'Suresh Raina',
    email: 'salessupervisor@alleviare.com',
    role: 'SALES_SUPERVISOR',
    designation: 'Area Sales Supervisor (Delhi NCR)',
    territory: 'Delhi NCR Region',
    allowedPlatforms: ['web', 'app']
  },
  ACCOUNTANT: {
    id: 'usr-006',
    name: 'Rameshwar Gupta',
    email: 'accountant@alleviare.com',
    role: 'ACCOUNTANT',
    designation: 'Chief Financial Accountant & Claims Officer',
    territory: 'Central Finance Division',
    allowedPlatforms: ['web', 'app']
  },
  MR: {
    id: 'usr-007',
    name: 'Amit Verma',
    email: 'mr@alleviare.com',
    role: 'MR',
    designation: 'Medical Representative (Field Officer)',
    territory: 'South Delhi & Noida',
    allowedPlatforms: ['app']
  }
};

export const ROLE_PERMISSIONS_MAP = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'dashboard.view', 'company.view', 'company.update', 'employee.view', 'employee.create', 'employee.update', 'employee.delete',
    'doctor.view', 'doctor.create', 'doctor.update', 'doctor.delete', 'chemist.view', 'chemist.create', 'chemist.update',
    'hospital.view', 'product.view', 'product.create', 'product.update', 'visit.view', 'visit.approve', 'dcr.view', 'dcr.approve',
    'attendance.view', 'leave.view', 'leave.approve', 'target.view', 'target.create', 'sales.view', 'order.view', 'order.create',
    'order.approve', 'expense.view', 'expense.approve', 'reports.view', 'reports.export', 'audit.view', 'settings.view'
  ],
  DIRECTOR: [
    'dashboard.view', 'employee.view', 'doctor.view', 'chemist.view', 'hospital.view', 'product.view', 'visit.view',
    'dcr.view', 'attendance.view', 'leave.view', 'target.view', 'sales.view', 'order.view', 'order.approve', 'expense.view',
    'expense.approve', 'reports.view', 'reports.export'
  ],
  ACCOUNTANT: [
    'dashboard.view', 'expense.view', 'expense.approve', 'reports.view', 'reports.export'
  ],
  MANAGER: [
    'dashboard.view', 'employee.view', 'doctor.view', 'chemist.view', 'hospital.view', 'product.view', 'visit.view',
    'visit.approve', 'dcr.view', 'dcr.approve', 'attendance.view', 'leave.view', 'leave.approve', 'target.view', 'target.create',
    'sales.view', 'order.view', 'order.approve', 'expense.view', 'expense.approve', 'reports.view'
  ],
  SALES_MANAGER: [
    'dashboard.view', 'product.view', 'product.create', 'target.view', 'target.create', 'sales.view', 'order.view',
    'order.create', 'order.approve', 'reports.view', 'reports.export'
  ],
  MR_SUPERVISOR: [
    'dashboard.view', 'employee.view', 'doctor.view', 'chemist.view', 'visit.view', 'visit.approve', 'dcr.view',
    'dcr.approve', 'attendance.view', 'leave.view', 'leave.approve', 'target.view', 'expense.view', 'expense.approve'
  ],
  MR: [
    'dashboard.view', 'doctor.view', 'chemist.view', 'hospital.view', 'product.view', 'visit.view', 'visit.create',
    'dcr.view', 'dcr.create', 'dcr.submit', 'attendance.view', 'attendance.create', 'leave.view', 'leave.create',
    'target.view', 'order.view', 'order.create', 'expense.view', 'expense.create'
  ]
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('alleviare_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    try {
      const saved = localStorage.getItem('alleviare_user');
      return saved ? JSON.parse(saved).role : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('alleviare_token') || null;
  });

  const hasPermission = (permissionCode) => {
    if (role === 'SUPER_ADMIN') return true;
    const userPermissions = currentUser?.permissions || ROLE_PERMISSIONS_MAP[role] || [];
    return userPermissions.includes(permissionCode) || userPermissions.includes('*');
  };

  const login = async ({ email, role: requestedRole }) => {
    // Determine target persona
    let target = null;
    if (email) {
      target = Object.values(DEFAULT_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    }
    if (!target && requestedRole) {
      target = DEFAULT_USERS[requestedRole];
    }
    if (!target) {
      target = DEFAULT_USERS.ADMIN;
    }

    // Platform restriction check
    if (target.allowedPlatforms && !target.allowedPlatforms.includes('web')) {
      throw new Error(`⚠️ Access Restricted: ${target.name} (${target.role}) is restricted to the Mobile App ONLY.\n\nMedical Representatives must access via the field mobile application.`);
    }

    try {
      const res = await loginUser(target.email, target.role, 'web');
      if (res && res.user) {
        const userWithPerms = {
          ...res.user,
          permissions: res.user.permissions || ROLE_PERMISSIONS_MAP[res.user.role] || []
        };
        setCurrentUser(userWithPerms);
        setRole(res.user.role);
        setToken(res.token || 'demo-token');
        localStorage.setItem('alleviare_user', JSON.stringify(userWithPerms));
        localStorage.setItem('alleviare_token', res.token || 'demo-token');
        return userWithPerms;
      }
    } catch (e) {
      console.warn('Backend login fallback to local credentials:', e.message);
    }

    // Fallback local sign-in
    const targetWithPerms = {
      ...target,
      permissions: ROLE_PERMISSIONS_MAP[target.role] || []
    };
    setCurrentUser(targetWithPerms);
    setRole(target.role);
    setToken('mock-jwt-token-' + Date.now());
    localStorage.setItem('alleviare_user', JSON.stringify(targetWithPerms));
    localStorage.setItem('alleviare_token', 'mock-jwt-token-' + Date.now());
    return targetWithPerms;
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('alleviare_user');
    localStorage.removeItem('alleviare_token');
  };

  const switchRole = async (newRole) => {
    const target = DEFAULT_USERS[newRole] || DEFAULT_USERS.ADMIN;
    
    if (target.allowedPlatforms && !target.allowedPlatforms.includes('web')) {
      alert(`⚠️ Access Restricted: ${target.name} (${target.role}) is restricted to the Mobile App ONLY.\n\nMedical Representatives must access via the field mobile application.`);
      return;
    }

    const targetWithPerms = {
      ...target,
      permissions: ROLE_PERMISSIONS_MAP[newRole] || []
    };

    try {
      const res = await loginUser(target.email, newRole, 'web');
      if (res && res.user) {
        const userWithPerms = {
          ...res.user,
          permissions: res.user.permissions || ROLE_PERMISSIONS_MAP[res.user.role] || []
        };
        setCurrentUser(userWithPerms);
        setRole(res.user.role);
        setToken(res.token);
        localStorage.setItem('alleviare_user', JSON.stringify(userWithPerms));
        localStorage.setItem('alleviare_token', res.token);
      } else {
        setCurrentUser(targetWithPerms);
        setRole(newRole);
        localStorage.setItem('alleviare_user', JSON.stringify(targetWithPerms));
      }
    } catch (e) {
      console.warn('Backend login fallback to local state:', e.message);
      setCurrentUser(targetWithPerms);
      setRole(newRole);
      localStorage.setItem('alleviare_user', JSON.stringify(targetWithPerms));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        token,
        hasPermission,
        login,
        logout,
        switchRole,
        defaultUsers: DEFAULT_USERS,
        rolePermissionsMap: ROLE_PERMISSIONS_MAP
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
