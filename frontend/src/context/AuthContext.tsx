import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { envStatus } from '@/lib/env';

interface AuthContextValue {
  user: unknown;
  session: unknown;
  loading: boolean;
  ready: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<unknown>(null);
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(envStatus.authReady);

  const refreshSession = async () => {
    if (!envStatus.authReady) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.getSession();
      setSession(result.data?.session ?? null);
      setUser(result.data?.user ?? null);
    } catch {
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!envStatus.authReady) return;

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
    ready: envStatus.authReady,
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
