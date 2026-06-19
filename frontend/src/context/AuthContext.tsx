import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { isAuthReady } from '@/lib/auth-base-url';

interface AuthContextValue {
  user: unknown;
  session: unknown;
  loading: boolean;
  ready: boolean;
  refreshSession: () => Promise<unknown>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authReady = isAuthReady();
  const [user, setUser] = useState<unknown>(null);
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(authReady);

  const refreshSession = async () => {
    if (!authReady) {
      setLoading(false);
      return null;
    }

    setLoading(true);

    try {
      const result = await authClient.getSession();
      const nextSession = result.data?.session ?? null;
      const nextUser = result.data?.user ?? null;

      setSession(nextSession);
      setUser(nextUser);
      return nextSession;
    } catch {
      setSession(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!authReady) return;

    try {
      await authClient.signOut();
    } finally {
      setSession(null);
      setUser(null);
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  const value = {
    user,
    session,
    loading,
    ready: authReady,
    refreshSession,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
  return context;
}
