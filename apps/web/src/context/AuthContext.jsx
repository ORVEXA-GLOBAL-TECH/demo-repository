import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_USERS = {
  ADMIN: {
    id: 'usr-001',
    name: 'Dr. Rajesh Sharma',
    email: 'admin@alleviare.com',
    role: 'ADMIN',
    designation: 'National Sales Director',
    territory: 'Headquarters'
  },
  MANAGER: {
    id: 'usr-002',
    name: 'Priya Mukherjee',
    email: 'manager@alleviare.com',
    role: 'MANAGER',
    designation: 'Regional Sales Manager (North)',
    territory: 'Delhi NCR & North Zone'
  },
  MR: {
    id: 'usr-003',
    name: 'Amit Verma',
    email: 'mr@alleviare.com',
    role: 'MR',
    designation: 'Medical Representative (Cardio & Diabetes)',
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
