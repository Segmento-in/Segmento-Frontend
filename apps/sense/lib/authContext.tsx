'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AuthUser,
  setAuthSession,
  getAuthToken,
  getAuthUser,
  clearAuthSession,
} from './auth';
import { APIClient } from './apiClient';

const api = new APIClient();

export type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Rehydrate from localStorage on client mount
  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser  = getAuthUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const result = await api.login(email, password);
    setAuthSession(result.access_token, result.user);
    setToken(result.access_token);
    setUser(result.user);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const result = await api.register(name, email, password);
    // If Supabase requires email confirmation, result.access_token may be null
    if (result.access_token) {
      setAuthSession(result.access_token, result.user);
      setToken(result.access_token);
      setUser(result.user);
    }
    // If no token (email confirmation pending), caller handles the 202 response
  };

  const logout = async (): Promise<void> => {
    const currentToken = getAuthToken();
    if (currentToken) {
      await api.logout(currentToken).catch(() => {}); // best-effort server invalidation
    }
    clearAuthSession();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: Boolean(token), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
