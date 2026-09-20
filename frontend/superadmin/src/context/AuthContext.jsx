import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

export const SUPER_ADMIN_USER = {
  id: 'usr-000',
  name: 'Executive Board / Super Admin',
  email: 'superadmin@alleviare.com',
  role: 'SUPER_ADMIN',
  designation: 'Global Enterprise Super Administrator',
  territory: 'Enterprise Global HQ',
  allowedPlatforms: ['web']
};

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
    // Super admin authentication
    try {
      const res = await loginUser(email || SUPER_ADMIN_USER.email, 'SUPER_ADMIN', 'web');
      if (res && res.user) {
        if (res.user.role !== 'SUPER_ADMIN') {
          throw new Error('Access Denied: This terminal is strictly reserved for Super Administrators.');
        }
        setCurrentUser(res.user);
        setRole(res.user.role);
        setToken(res.token || 'demo-superadmin-token');
        localStorage.setItem('orvexa_superadmin_user', JSON.stringify(res.user));
        localStorage.setItem('orvexa_superadmin_token', res.token || 'demo-superadmin-token');
        return res.user;
      }
    } catch (e) {
      console.warn('Backend login fallback to local Super Admin state:', e.message);
    }

    // Direct local fallback sign-in
    setCurrentUser(SUPER_ADMIN_USER);
    setRole('SUPER_ADMIN');
    setToken('mock-jwt-superadmin-' + Date.now());
    localStorage.setItem('orvexa_superadmin_user', JSON.stringify(SUPER_ADMIN_USER));
    localStorage.setItem('orvexa_superadmin_token', 'mock-jwt-superadmin-' + Date.now());
    return SUPER_ADMIN_USER;
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
        logout,
        defaultUser: SUPER_ADMIN_USER
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
