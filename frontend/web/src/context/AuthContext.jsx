import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

export const DEFAULT_USERS = {
  SUPER_ADMIN: {
    id: 'usr-000',
    name: 'Executive Board / Super Admin',
    email: 'superadmin@alleviare.com',
    role: 'SUPER_ADMIN',
    designation: 'Global Enterprise Super Administrator',
    territory: 'Enterprise Global HQ',
    allowedPlatforms: ['web']
  },
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

  // Portal switcher: 'staff' | 'superadmin'
  const [activePortal, setActivePortal] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('superadmin')) {
      return 'superadmin';
    }
    return 'staff';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.toLowerCase().includes('superadmin')) {
        setActivePortal('superadmin');
      } else if (window.location.hash.toLowerCase().includes('staff') || window.location.hash.toLowerCase().includes('login')) {
        setActivePortal('staff');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchLoginPortal = (portal) => {
    setActivePortal(portal);
    if (typeof window !== 'undefined') {
      window.location.hash = portal === 'superadmin' ? '#superadmin' : '#login';
    }
  };

  const login = async ({ email, role: requestedRole, portalType = 'staff' }) => {
    // Determine target persona
    let target = null;
    if (email) {
      target = Object.values(DEFAULT_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    }
    if (!target && requestedRole) {
      target = DEFAULT_USERS[requestedRole];
    }
    if (!target) {
      target = portalType === 'superadmin' ? DEFAULT_USERS.SUPER_ADMIN : DEFAULT_USERS.ADMIN;
    }

    // Strict Super Admin Portal Validation
    if (portalType === 'superadmin') {
      if (target.role !== 'SUPER_ADMIN') {
        throw new Error('Access Denied: This terminal is strictly reserved for Super Administrators. Please log in through the Corporate Staff Portal.');
      }
    }

    // Platform restriction check
    if (target.allowedPlatforms && !target.allowedPlatforms.includes('web')) {
      throw new Error(`⚠️ Access Restricted: ${target.name} (${target.role}) is restricted to the Mobile App ONLY.\n\nMedical Representatives must access via the field mobile application.`);
    }

    try {
      const res = await loginUser(target.email, target.role, 'web');
      if (res && res.user) {
        setCurrentUser(res.user);
        setRole(res.user.role);
        setToken(res.token || 'demo-token');
        localStorage.setItem('alleviare_user', JSON.stringify(res.user));
        localStorage.setItem('alleviare_token', res.token || 'demo-token');
        return res.user;
      }
    } catch (e) {
      console.warn('Backend login fallback to local credentials:', e.message);
    }

    // Fallback local sign-in
    setCurrentUser(target);
    setRole(target.role);
    setToken('mock-jwt-token-' + Date.now());
    localStorage.setItem('alleviare_user', JSON.stringify(target));
    localStorage.setItem('alleviare_token', 'mock-jwt-token-' + Date.now());
    return target;
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

    try {
      const res = await loginUser(target.email, newRole, 'web');
      if (res && res.user) {
        setCurrentUser(res.user);
        setRole(res.user.role);
        setToken(res.token);
        localStorage.setItem('alleviare_user', JSON.stringify(res.user));
        localStorage.setItem('alleviare_token', res.token);
      } else {
        setCurrentUser(target);
        setRole(newRole);
        localStorage.setItem('alleviare_user', JSON.stringify(target));
      }
    } catch (e) {
      console.warn('Backend login fallback to local state:', e.message);
      setCurrentUser(target);
      setRole(newRole);
      localStorage.setItem('alleviare_user', JSON.stringify(target));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        token,
        activePortal,
        switchLoginPortal,
        login,
        logout,
        switchRole,
        defaultUsers: DEFAULT_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
