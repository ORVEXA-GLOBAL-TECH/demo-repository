import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_USERS = {
  ADMIN: {
    id: 'usr-001',
    name: 'Dr. Rajesh Sharma',
    email: 'admin@alleviare.com',
    role: 'ADMIN',
    designation: 'National Sales Director',
    territory: 'National HQ (All Zones)'
  },
  RSM: {
    id: 'usr-002',
    name: 'Priya Mukherjee',
    email: 'rsm@alleviare.com',
    role: 'RSM',
    designation: 'Regional Sales Manager',
    territory: 'North Zone India'
  },
  ASM: {
    id: 'usr-003',
    name: 'Suresh Raina',
    email: 'asm@alleviare.com',
    role: 'ASM',
    designation: 'Area Sales Manager',
    territory: 'Delhi NCR Region'
  },
  MR: {
    id: 'usr-004',
    name: 'Amit Verma',
    email: 'mr@alleviare.com',
    role: 'MR',
    designation: 'Medical Representative',
    territory: 'South Delhi & Noida'
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEFAULT_USERS.ADMIN);
  const [role, setRole] = useState('ADMIN');
  const [token, setToken] = useState(null);

  const switchRole = async (newRole) => {
    try {
      const target = DEFAULT_USERS[newRole] || DEFAULT_USERS.ADMIN;
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
      setCurrentUser(DEFAULT_USERS[newRole] || DEFAULT_USERS.ADMIN);
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
