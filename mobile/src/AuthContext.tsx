import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Role, User } from './types';
import { api, loadToken, setToken } from './api';

interface AuthState {
  me: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (b: { role: Role; fullName: string; phone: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (token) {
        try {
          setMe(await api.me());
        } catch {
          await setToken(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    const res = await api.login({ phone, password });
    await setToken(res.token);
    setMe(res.user);
  }, []);

  const register = useCallback(
    async (b: { role: Role; fullName: string; phone: string; password: string }) => {
      const res = await api.register(b);
      await setToken(res.token);
      setMe(res.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    await setToken(null);
    setMe(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      setMe(await api.me());
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Ctx.Provider value={{ me, loading, login, register, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
