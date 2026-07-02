import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../api/client';
import { Role, UserSession } from '../types';

interface AuthContextValue {
  session: UserSession | null;
  signIn: (email: string, password?: string) => Promise<UserSession>;
  signOut: () => void;
  isAllowed: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = 'sbertrack.session';

const roleHome: Record<Role, string> = {
  STUDENT: '/student/dashboard',
  CUSTOMER: '/customer/dashboard',
  MODERATOR: '/moderator/dashboard',
  ADMIN: '/admin/dashboard'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<UserSession | null>(() => {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as UserSession) : null;
  });

  const signIn = useCallback(async (email: string, password = 'password') => {
    const nextSession = await post<UserSession>('/auth/sign-in', { email, password });
    localStorage.setItem(storageKey, JSON.stringify(nextSession));
    setSession(nextSession);
    navigate(roleHome[nextSession.user.role], { replace: true });
    return nextSession;
  }, [navigate]);

  const signOut = useCallback(() => {
    localStorage.removeItem(storageKey);
    setSession(null);
    navigate('/sign-in', { replace: true });
  }, [navigate]);

  const isAllowed = useCallback((roles: Role[]) => {
    return !!session && roles.includes(session.user.role);
  }, [session]);

  const value = useMemo<AuthContextValue>(() => ({ session, signIn, signOut, isAllowed }), [session, signIn, signOut, isAllowed]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

export { roleHome };
