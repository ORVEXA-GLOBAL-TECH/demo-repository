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

    // B. Periodic & Real-time Database Session Heartbeat (Cross-Device & Cross-Browser)
    const verifyDatabaseSessionStatus = async () => {
      let mySessionId = localStorage.getItem('orvexa_session_id');

      try {
        // Query the currently active session for this user in Supabase
        const { data: latestActiveSession, error } = await supabase
          .from('user_sessions')
          .select('id, is_active, invalidated_reason, created_at')
          .eq('user_id', currentUser.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) return;

        // If no active session exists at all (e.g. was revoked or closed by admin)
        if (!latestActiveSession) {
          alert('⚠️ Security Notice: Your active session has ended. Please log in again.');
          logout('CONCURRENT_LOGIN');
          return;
        }

        // If mySessionId was not stored, adopt the active session
        if (!mySessionId) {
          localStorage.setItem('orvexa_session_id', latestActiveSession.id);
          mySessionId = latestActiveSession.id;
          return;
        }

        // If a new session was created with a different ID (i.e. another device or window logged in)
        if (latestActiveSession.id !== mySessionId) {
          alert('⚠️ Security Notice: Your Super Admin account was opened on another device or window. This session has been terminated.');
          logout('CONCURRENT_LOGIN');
          return;
        }

        // Verify that my own session has not been marked inactive
        const { data: mySession } = await supabase
          .from('user_sessions')
          .select('is_active, invalidated_reason')
          .eq('id', mySessionId)
          .maybeSingle();

        if (mySession && mySession.is_active === false) {
          alert('⚠️ Security Notice: Your session was terminated because another window or device logged in.');
          logout('CONCURRENT_LOGIN');
        }
      } catch (e) {
        // Network resilience
      }
    };

    // Run check immediately on mount
    verifyDatabaseSessionStatus();

    // Check immediately whenever user switches to or focuses this window/tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        verifyDatabaseSessionStatus();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', verifyDatabaseSessionStatus);

    // Continuous 2-second background heartbeat
    const heartbeatInterval = setInterval(verifyDatabaseSessionStatus, 2000);

    // Supabase Realtime WebSocket listener for instant push
    let realtimeChannel = null;
    try {
      realtimeChannel = supabase
        .channel('realtime_session_enforcement_' + currentUser.id)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_sessions'
          },
          () => {
            verifyDatabaseSessionStatus();
          }
        )
        .subscribe();
    } catch (rtErr) {
      console.warn('Realtime subscription not available:', rtErr);
    }

    return () => {
      if (sessionChannel) sessionChannel.close();
      if (realtimeChannel) supabase.removeChannel(realtimeChannel);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', verifyDatabaseSessionStatus);
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
