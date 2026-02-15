'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { authClient } from '@/lib/auth/client';

type AuthContextType = typeof authClient;

// Session data type - flexible to accept what neonAuth() returns
export type SessionData = {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    impersonatedBy?: string | null;
    activeOrganizationId?: string | null;
  } | null;
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email?: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
    banned?: boolean | null;
    role?: string | null;
    banReason?: string | null;
    banExpires?: Date | null;
  } | null;
};

// Shared session state context
interface SessionContextValue {
  session: SessionData | null;
  isPending: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const SessionContext = createContext<SessionContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  initialSession?: SessionData | null;
}

export function AuthProvider({ children, initialSession = null }: AuthProviderProps) {
  const [session, setSession] = useState<SessionData | null>(initialSession);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsPending(true);
    setError(null);
    try {
      const { data, error } = await authClient.getSession();
      if (error) {
        setError(new Error(error.message));
      } else {
        setSession(data as SessionData);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to fetch session'));
    } finally {
      setIsPending(false);
    }
  }, []);

  const clearSession = useCallback(() => {
    setSession({ session: null, user: null });
  }, []);

  return (
    <AuthContext.Provider value={authClient}>
      <SessionContext.Provider value={{ session, isPending, error, refetch, clearSession }}>
        {children}
      </SessionContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
