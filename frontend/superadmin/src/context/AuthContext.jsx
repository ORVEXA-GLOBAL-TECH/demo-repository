import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('orvexa_superadmin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    try {
      const saved = localStorage.getItem('orvexa_superadmin_user');
      return saved ? JSON.parse(saved).role : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('orvexa_superadmin_token') || null;
  });

  const login = async ({ email, password }) => {
    if (!email || !password) {
      throw new Error('Please enter both your email address and password.');
    }

    const res = await loginUser(email, 'SUPER_ADMIN', 'web', password);
    if (!res || !res.user) {
      throw new Error(res?.message || 'Authentication failed. Please verify your credentials.');
    }

    if (res.user.role !== 'SUPER_ADMIN') {
      throw new Error('Access Denied: This terminal is strictly reserved for Super Administrators.');
    }

    setCurrentUser(res.user);
    setRole(res.user.role);
    setToken(res.token || '');
    localStorage.setItem('orvexa_superadmin_user', JSON.stringify(res.user));
    localStorage.setItem('orvexa_superadmin_token', res.token || '');
    return res.user;
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('orvexa_superadmin_user');
    localStorage.removeItem('orvexa_superadmin_token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
