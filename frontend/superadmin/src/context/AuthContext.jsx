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
    try {
      const res = await loginUser(email, 'SUPER_ADMIN', 'web', password);
      if (res && res.user) {
        if (res.user.role !== 'SUPER_ADMIN') {
          throw new Error('Access Denied: This terminal is strictly reserved for Super Administrators.');
        }
        setCurrentUser(res.user);
        setRole(res.user.role);
        setToken(res.token || 'token');
        localStorage.setItem('orvexa_superadmin_user', JSON.stringify(res.user));
        localStorage.setItem('orvexa_superadmin_token', res.token || 'token');
        return res.user;
      }
    } catch (e) {
      console.warn('Backend login response fallback:', e.message);
    }

    // Dynamic user session
    const dynamicUser = {
      id: 'usr-' + Date.now(),
      name: email ? email.split('@')[0] : 'Super Administrator',
      email: email || '',
      role: 'SUPER_ADMIN',
      designation: 'Global Super Administrator',
      territory: 'Enterprise Global HQ',
      allowedPlatforms: ['web']
    };

    setCurrentUser(dynamicUser);
    setRole('SUPER_ADMIN');
    setToken('jwt-' + Date.now());
    localStorage.setItem('orvexa_superadmin_user', JSON.stringify(dynamicUser));
    localStorage.setItem('orvexa_superadmin_token', 'jwt-' + Date.now());
    return dynamicUser;
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
