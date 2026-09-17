import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_USERS = {
  SUPER_ADMIN: {
    id: 'usr-000',
    name: 'Executive Board / Super Admin',
    email: 'superadmin@alleviare.com',
    role: 'SUPER_ADMIN',
    designation: 'Enterprise Super Administrator',
    territory: 'Enterprise Global HQ',
    allowedPlatforms: ['web']
  },
  ADMIN: {
    id: 'usr-001',
    name: 'Dr. Rajesh Sharma',
    email: 'admin@alleviare.com',
    role: 'ADMIN',
    designation: 'National Sales Director',
    territory: 'National HQ (All Zones)',
    allowedPlatforms: ['web']
  },
  RSM: {
    id: 'usr-002',
    name: 'Priya Mukherjee',
    email: 'rsm@alleviare.com',
    role: 'RSM',
    designation: 'Regional Sales Manager',
    territory: 'North Zone India',
    allowedPlatforms: ['web', 'app']
  },
  ASM: {
    id: 'usr-003',
    name: 'Suresh Raina',
    email: 'asm@alleviare.com',
    role: 'ASM',
    designation: 'Area Sales Manager',
    territory: 'Delhi NCR Region',
    allowedPlatforms: ['web', 'app']
  },
  MR: {
    id: 'usr-004',
    name: 'Amit Verma',
    email: 'mr@alleviare.com',
    role: 'MR',
    designation: 'Medical Representative',
    territory: 'South Delhi & Noida',
    allowedPlatforms: ['web', 'app']
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEFAULT_USERS.SUPER_ADMIN);
  const [role, setRole] = useState('SUPER_ADMIN');
  const [token, setToken] = useState(null);

  const switchRole = async (newRole) => {
    try {
      const target = DEFAULT_USERS[newRole] || DEFAULT_USERS.SUPER_ADMIN;
      const res = await loginUser(target.email, newRole);
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
      setCurrentUser(DEFAULT_USERS[newRole] || DEFAULT_USERS.SUPER_ADMIN);
      setRole(newRole);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, switchRole, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
