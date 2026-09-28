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
    department: 'Corporate Operations',
    allowedPlatforms: ['web', 'app'],
    avatar: 'RS'
  },
  DIRECTOR: {
    id: 'usr-002',
    name: 'Vikramaditya Singhania',
    email: 'director@alleviare.com',
    role: 'DIRECTOR',
    designation: 'Commercial & Managing Director',
    territory: 'Pan India Commercial Ops',
    department: 'Executive Board',
    allowedPlatforms: ['web', 'app'],
    avatar: 'VS'
  },
  ACCOUNTANT: {
    id: 'usr-006',
    name: 'Rameshwar Gupta',
    email: 'accountant@alleviare.com',
    role: 'ACCOUNTANT',
    designation: 'Chief Financial Accountant & Claims Officer',
    territory: 'Central Finance Division',
    department: 'Finance & Accounts',
    allowedPlatforms: ['web', 'app'],
    avatar: 'RG'
  },
  MANAGER: {
    id: 'usr-003',
    name: 'Meenakshi Sundaram',
    email: 'manager@alleviare.com',
    role: 'MANAGER',
    designation: 'Commercial Operations Manager',
    territory: 'Pan India Operations HQ',
    department: 'Field Operations',
    allowedPlatforms: ['web', 'app'],
    avatar: 'MS'
  },
  SALES_MANAGER: {
    id: 'usr-004',
    name: 'Priya Mukherjee',
    email: 'salesmanager@alleviare.com',
    role: 'SALES_MANAGER',
    designation: 'Regional Sales Manager (North Zone)',
    territory: 'North Zone India',
    department: 'Commercial Sales',
    allowedPlatforms: ['web', 'app'],
    avatar: 'PM'
  },
  MR_SUPERVISOR: {
    id: 'usr-005',
    name: 'Suresh Raina',
    email: 'mrsupervisor@alleviare.com',
    secondaryEmail: 'salessupervisor@alleviare.com',
    role: 'MR_SUPERVISOR',
    designation: 'Area Sales Supervisor (Delhi NCR)',
    territory: 'Delhi NCR Region',
    department: 'Field Supervision',
    allowedPlatforms: ['web', 'app'],
    avatar: 'SR'
  },
  SALES_SUPERVISOR: {
    id: 'usr-005b',
    name: 'Suresh Raina',
    email: 'salessupervisor@alleviare.com',
    role: 'MR_SUPERVISOR',
    designation: 'Area Sales Supervisor (Delhi NCR)',
    territory: 'Delhi NCR Region',
    department: 'Field Supervision',
    allowedPlatforms: ['web', 'app'],
    avatar: 'SR'
  },
  MR: {
    id: 'usr-007',
    name: 'Amit Verma',
    email: 'mr@alleviare.com',
    role: 'MR',
    designation: 'Medical Representative (Field Officer)',
    territory: 'South Delhi & Saket',
    department: 'Field Sales Force',
    allowedPlatforms: ['web', 'app'],
    avatar: 'AV'
  }
};

export const ROLE_PERMISSIONS_MAP = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'dashboard.view', 'company.view', 'company.update', 'employee.view', 'employee.create', 'employee.update', 'employee.delete',
    'organization.view', 'organization.update', 'doctor.view', 'doctor.create', 'doctor.update', 'doctor.delete',
    'chemist.view', 'chemist.create', 'chemist.update', 'hospital.view', 'hospital.create', 'hospital.update',
    'product.view', 'product.create', 'product.update', 'tour.view', 'tour.create', 'tour.update', 'tour.delete', 'tour.approve',
    'visit.view', 'visit.create', 'visit.update', 'visit.approve', 'dcr.view', 'dcr.create', 'dcr.update', 'dcr.submit', 'dcr.approve', 'dcr.reject',
    'attendance.view', 'attendance.create', 'attendance.update', 'leave.view', 'leave.create', 'leave.approve',
    'target.view', 'target.create', 'target.update', 'sales.view', 'order.view', 'order.create', 'order.approve',
    'expense.view', 'expense.create', 'expense.approve', 'expense.reject',
    'sample.view', 'sample.create', 'sample.allocate', 'sample.distribute',
    'material.view', 'material.create', 'material.distribute', 'reports.view', 'reports.export',
    'audit.view', 'settings.view', 'settings.update'
  ],
  DIRECTOR: [
    'dashboard.view', 'employee.view', 'organization.view', 'doctor.view', 'chemist.view', 'hospital.view', 'product.view',
    'tour.view', 'visit.view', 'dcr.view', 'attendance.view', 'leave.view',
    'target.view', 'target.update', 'sales.view', 'sales.create', 'order.view', 'order.approve',
    'expense.view', 'sample.view', 'material.view', 'reports.view', 'reports.export',
    'approvals.view', 'approvals.decide', 'audit.view', 'settings.view'
  ],
  ACCOUNTANT: [
    'dashboard.view', 'employee.view', 'attendance.view', 'leave.view', 'target.view', 'sales.view', 'order.view',
    'expense.view', 'expense.create', 'expense.update', 'expense.approve', 'expense.reject', 'expense.reimburse',
    'expense_policy.view', 'expense_policy.update', 'reports.view', 'reports.export',
    'approvals.view', 'approvals.decide', 'audit.view', 'settings.view'
  ],
  MANAGER: [
    'dashboard.view', 'employee.view', 'employee.create', 'employee.update', 'organization.view', 'organization.update',
    'doctor.view', 'chemist.view', 'hospital.view', 'tour.view', 'tour.create', 'tour.update', 'tour.approve',
    'visit.view', 'visit.create', 'visit.update', 'visit.approve', 'dcr.view', 'dcr.approve', 'dcr.reject',
    'attendance.view', 'attendance.update', 'leave.view', 'leave.approve',
    'target.view', 'target.create', 'target.update', 'sales.view', 'order.view', 'order.create', 'order.approve',
    'expense.view', 'expense.approve', 'sample.view', 'sample.allocate', 'material.view', 'material.allocate',
    'reports.view', 'reports.export', 'approvals.view', 'approvals.decide', 'audit.view', 'settings.view'
  ],
  SALES_MANAGER: [
    'dashboard.view', 'employee.view', 'doctor.view', 'chemist.view', 'hospital.view', 'product.view', 'product.create', 'product.update',
    'tour.view', 'tour.approve', 'visit.view', 'visit.approve', 'dcr.view', 'dcr.approve',
    'attendance.view', 'leave.view', 'target.view', 'target.create', 'target.update',
    'sales.view', 'sales.create', 'sales.update', 'order.view', 'order.create', 'order.approve',
    'expense.view', 'sample.view', 'sample.allocate', 'material.view', 'material.allocate',
    'reports.view', 'reports.export', 'approvals.view', 'approvals.decide', 'audit.view', 'settings.view'
  ],
  MR_SUPERVISOR: [
    'dashboard.view', 'employee.view', 'doctor.view', 'doctor.create', 'doctor.update', 'chemist.view', 'chemist.create', 'chemist.update',
    'hospital.view', 'tour.view', 'tour.create', 'tour.update', 'tour.approve', 'visit.view', 'visit.create', 'visit.update', 'visit.approve',
    'dcr.view', 'dcr.approve', 'dcr.reject', 'attendance.view', 'attendance.update', 'leave.view', 'leave.approve',
    'target.view', 'target.update', 'sales.view', 'order.view', 'expense.view', 'expense.approve',
    'sample.view', 'sample.allocate', 'sample.distribute', 'material.view', 'material.distribute',
    'reports.view', 'approvals.view', 'approvals.decide', 'audit.view', 'settings.view'
  ],
  SALES_SUPERVISOR: [
    'dashboard.view', 'employee.view', 'doctor.view', 'doctor.create', 'doctor.update', 'chemist.view', 'chemist.create', 'chemist.update',
    'hospital.view', 'tour.view', 'tour.create', 'tour.update', 'tour.approve', 'visit.view', 'visit.create', 'visit.update', 'visit.approve',
    'dcr.view', 'dcr.approve', 'dcr.reject', 'attendance.view', 'attendance.update', 'leave.view', 'leave.approve',
    'target.view', 'target.update', 'sales.view', 'order.view', 'expense.view', 'expense.approve',
    'sample.view', 'sample.allocate', 'sample.distribute', 'material.view', 'material.distribute',
    'reports.view', 'approvals.view', 'approvals.decide', 'audit.view', 'settings.view'
  ],
  MR: [
    'dashboard.view', 'employee.view', 'doctor.view', 'doctor.create', 'doctor.update', 'chemist.view', 'chemist.create', 'chemist.update',
    'hospital.view', 'product.view', 'tour.view', 'tour.create', 'tour.update',
    'visit.view', 'visit.create', 'visit.update', 'dcr.view', 'dcr.create', 'dcr.update', 'dcr.submit',
    'attendance.view', 'attendance.create', 'leave.view', 'leave.create',
    'target.view', 'sales.view', 'sales.create', 'order.view', 'order.create',
    'expense.view', 'expense.create', 'sample.view', 'sample.distribute', 'material.view', 'material.distribute',
    'reports.view', 'settings.view', 'settings.update'
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

  const getUserScope = () => {
    return {
      companyId: currentUser?.tenantId || 'alleviare-health',
      employeeId: currentUser?.id || 'usr-001',
      role: role || 'ADMIN',
      isSuperAdmin: role === 'SUPER_ADMIN',
      isAdmin: role === 'ADMIN',
      isDirector: role === 'DIRECTOR',
      isAccountant: role === 'ACCOUNTANT',
      isManager: role === 'MANAGER',
      isSalesManager: role === 'SALES_MANAGER',
      isSupervisor: role === 'MR_SUPERVISOR' || role === 'SALES_SUPERVISOR',
      isMR: role === 'MR',
      territory: currentUser?.territory || 'National HQ'
    };
  };

  const login = async ({ email, role: requestedRole }) => {
    // Determine target persona
    let target = null;
    if (email) {
      target = Object.values(DEFAULT_USERS).find(u => 
        u.email.toLowerCase() === email.toLowerCase() || 
        (u.secondaryEmail && u.secondaryEmail.toLowerCase() === email.toLowerCase())
      );
    }
    if (!target && requestedRole) {
      target = DEFAULT_USERS[requestedRole];
    }
    if (!target) {
      target = DEFAULT_USERS.ADMIN;
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
        setToken(res.token || 'auth-token-' + Date.now());
        localStorage.setItem('alleviare_user', JSON.stringify(userWithPerms));
        localStorage.setItem('alleviare_token', res.token || 'auth-token-' + Date.now());
        return userWithPerms;
      }
    } catch (e) {
      console.warn('Backend login fallback to local credentials:', e.message);
    }

    // Fallback client session
    const userWithPerms = {
      ...target,
      permissions: ROLE_PERMISSIONS_MAP[target.role] || []
    };
    setCurrentUser(userWithPerms);
    setRole(target.role);
    setToken('mock-jwt-token-' + Date.now());
    localStorage.setItem('alleviare_user', JSON.stringify(userWithPerms));
    localStorage.setItem('alleviare_token', 'mock-jwt-token-' + Date.now());
    return userWithPerms;
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
      console.warn('Backend switchRole fallback to local state:', e.message);
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
        userScope: getUserScope(),
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
