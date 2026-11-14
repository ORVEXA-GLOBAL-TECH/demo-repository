'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createClient, setCurrency, type ApiClient, type User } from '@alleviare/api-client';

// Set NEXT_PUBLIC_API_URL (see .env.example); there is deliberately no built-in default.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
const KEY = 'alleviare.session';

interface AuthState {
  user: User | null;
  ready: boolean;
  api: ApiClient;
  login(email: string, password: string): Promise<void>;
  logout(): void;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(KEY);
      if (saved) {
        const s = JSON.parse(saved) as { token: string; user: User };
        setToken(s.token);
        setCurrency(s.user.currency);
        setUser(s.user);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(KEY);
    setToken(null);
    setUser(null);
  }, []);

  const api = useMemo(
    () => createClient(API_URL, { get: () => token }, logout),
    [token, logout],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await createClient(API_URL, { get: () => null }).login(email.trim(), password, 'web');
      sessionStorage.setItem(KEY, JSON.stringify({ token: res.token, user: res.user }));
      setToken(res.token);
      setCurrency(res.user.currency);
      setUser(res.user);
    },
    [],
  );

  return <Ctx.Provider value={{ user, ready, api, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
}
