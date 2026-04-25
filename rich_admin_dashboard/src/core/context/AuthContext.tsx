// ============================================================
// AuthContext.tsx
// Manages the admin's login session using localStorage.
// mirrors the mobile app's AuthService + SecureStore pattern —
// here we use localStorage instead since it's a web app.
//
// Flow:
//  1. On mount: restore token + user from localStorage.
//  2. signIn(): POST /auth/login → verify role === 'admin'
//             → save token + user to localStorage.
//  3. signOut(): clear localStorage → redirect to /login.
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '../types';

const TOKEN_KEY = 'admin_token';
const USER_KEY  = 'admin_user';
const API_URL   = import.meta.env.VITE_API_URL as string;

// ----- Context shape -----
interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----- Provider -----
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user,      setUser]      = useState<AdminUser | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on first mount
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser  = localStorage.getItem(USER_KEY);
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser) as AdminUser);
    }
    setIsLoading(false);
  }, []);

  /**
   * signIn — calls POST /auth/login on the Fastify backend.
   * Throws if:
   *   • credentials are wrong (backend 401)
   *   • the user does not have role === 'admin'
   */
  const signIn = async (email: string, password: string) => {
    const res  = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    // Role gate — only admins can access the dashboard
    if (data.user?.role !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY,  JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user as AdminUser);
  };

  /** signOut — clears localStorage and resets state */
  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAdmin: user?.role === 'admin', signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// ----- Hook -----
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
