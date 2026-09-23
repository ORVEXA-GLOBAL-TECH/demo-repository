import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loginUser } from '../services/api';
import { supabase } from '../services/supabase';

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

  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('orvexa_session_id') || null;
  });

  const isLoggingOutRef = useRef(false);

  const logout = (reason = 'MANUAL') => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    // Invalidate session in Supabase if we have a sessionId
    const activeSessionId = localStorage.getItem('orvexa_session_id');
    if (activeSessionId) {
      supabase
        .from('user_sessions')
        .update({
          is_active: false,
          invalidated_reason: reason === 'INACTIVITY' ? 'INACTIVITY_TIMEOUT' : 'USER_LOGOUT'
        })
        .eq('id', activeSessionId)
        .then(() => {})
        .catch(() => {});
    }

    setCurrentUser(null);
    setRole(null);
    setToken(null);
    setSessionId(null);

    localStorage.removeItem('orvexa_superadmin_user');
    localStorage.removeItem('orvexa_superadmin_token');
    localStorage.removeItem('orvexa_session_id');

    setTimeout(() => {
      isLoggingOutRef.current = false;
    }, 500);
  };

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

    const newSessionId = res.sessionId || localStorage.getItem('orvexa_session_id');

    setCurrentUser(res.user);
    setRole(res.user.role);
    setToken(res.token || '');
    setSessionId(newSessionId);

    localStorage.setItem('orvexa_superadmin_user', JSON.stringify(res.user));
    localStorage.setItem('orvexa_superadmin_token', res.token || '');
    if (newSessionId) {
      localStorage.setItem('orvexa_session_id', newSessionId);
    }

    // Broadcast instant NEW_LOGIN event to all other open tabs/windows
    try {
      const channel = new BroadcastChannel('orvexa_superadmin_single_session');
      channel.postMessage({
        type: 'SUPERADMIN_LOGIN',
        newSessionId,
        userId: res.user.id,
        timestamp: Date.now()
      });
      channel.close();
    } catch (e) {
      // BroadcastChannel fallback
    }

    return res.user;
  };

  // ==============================================================================
  // 1. INACTIVITY AUTO-LOGOUT: 5 MINUTES OF NO SCREEN MOVEMENT
  // ==============================================================================
  useEffect(() => {
    if (!currentUser) return;

    let inactivityTimer = null;
    const FIVE_MINUTES_MS = 5 * 60 * 1000; // 5 minutes

    const triggerInactivityLogout = () => {
      alert('🔒 Security Notice: You have been automatically logged out due to 5 minutes of inactivity.');
      logout('INACTIVITY');
    };

    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(triggerInactivityLogout, FIVE_MINUTES_MS);
    };

    // Track all physical screen movements and user activity
    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'wheel'
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    // Start 5-minute countdown immediately on login
    resetInactivityTimer();

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [currentUser]);

  // ==============================================================================
  // 2. DUAL-WINDOW SINGLE-SESSION ENFORCEMENT:
  // If a 2nd window logs in, the 1st window automatically closes / logs out
  // ==============================================================================
  useEffect(() => {
    if (!currentUser) return;

    const currentSessionId = localStorage.getItem('orvexa_session_id');

    // A. Real-time Cross-Window Synchronization (BroadcastChannel)
    let sessionChannel = null;
    try {
      sessionChannel = new BroadcastChannel('orvexa_superadmin_single_session');
      sessionChannel.onmessage = (event) => {
        if (event.data?.type === 'SUPERADMIN_LOGIN' && event.data?.newSessionId !== currentSessionId) {
          alert('⚠️ Security Notice: Your Super Admin account was opened in another window. This session has been terminated.');
          logout('CONCURRENT_LOGIN');
        }
      };
    } catch (err) {
      console.warn('BroadcastChannel not supported in this environment');
    }

    // B. Periodic Database Heartbeat (Polls session status every 5 seconds)
    // Ensures single-session across different browsers, private windows, and devices
    const verifyDatabaseSessionStatus = async () => {
      const activeId = localStorage.getItem('orvexa_session_id');
      if (!activeId) return;

      try {
        const { data, error } = await supabase
          .from('user_sessions')
          .select('is_active, invalidated_reason')
          .eq('id', activeId)
          .maybeSingle();

        if (data && data.is_active === false) {
          const reason = data.invalidated_reason === 'CONCURRENT_LOGIN_DETECTED'
            ? '⚠️ You have been logged out because another window logged in with this account.'
            : '🔒 Your session was terminated by an administrator.';
          alert(reason);
          logout('CONCURRENT_LOGIN');
        }
      } catch (e) {
        // Silently handle transient connection issues
      }
    };

    const heartbeatInterval = setInterval(verifyDatabaseSessionStatus, 5000);

    return () => {
      if (sessionChannel) sessionChannel.close();
      clearInterval(heartbeatInterval);
    };
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        token,
        sessionId,
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
