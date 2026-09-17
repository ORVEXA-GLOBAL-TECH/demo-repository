import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_USERS = {
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
  const [currentUser, setCurrentUser] = useState(DEFAULT_USERS.SUPER_ADMIN);
  const [role, setRole] = useState('SUPER_ADMIN');
  const [token, setToken] = useState(null);

  const switchRole = async (newRole) => {
    const target = DEFAULT_USERS[newRole] || DEFAULT_USERS.SUPER_ADMIN;
    
    // Check if target persona is restricted from Web portal
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
        localStorage.setItem('alleviare_token', res.token);
      } else {
        setCurrentUser(target);
        setRole(newRole);
      }
    } catch (e) {
      console.warn('Backend login fallback to local state:', e.message);
      setCurrentUser(target);
      setRole(newRole);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, switchRole, token, defaultUsers: DEFAULT_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
