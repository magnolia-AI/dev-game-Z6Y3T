'use client';

import { useContext, useCallback } from 'react';
import { createAuthClient } from '@neondatabase/auth/next';
import { SessionContext, type SessionData } from '@/components/auth-provider';

export const authClient = createAuthClient();

/**
 * Hook providing access to auth state and methods.
 * Uses server-fetched initial session - no client-side fetch on mount.
 * Session state is shared across all components via context.
 * 
 * @returns Auth state and methods
 * - `user` - Current user or null
 * - `session` - Current session or null  
 * - `isAuthenticated` - Boolean indicating if user is logged in
 * - `isPending` - True during manual refetch
 * - `error` - Any error from session fetch
 * - `refetch` - Function to manually refetch session from server
 * - `signOut` - Sign out the current user
 * - `signIn` - Sign in methods (email, social, etc.)
 * - `signUp` - Sign up methods
 */
export function useAuthClient() {
  const context = useContext(SessionContext);
  
  if (!context) {
    throw new Error('useAuthClient must be used within an AuthProvider');
  }

  const { session: sessionData, isPending, error, refetch, clearSession } = context;

  // Wrapped signOut that clears session state
  const handleSignOut = useCallback(async () => {
    const result = await authClient.signOut();
    clearSession();
    return result;
  }, [clearSession]);

  return {
    // Core state
    user: sessionData?.user ?? null,
    session: sessionData?.session ?? null,
    isAuthenticated: !!sessionData?.user,
    
    // Loading state
    isPending,
    error,
    
    // Methods
    refetch,
    signOut: handleSignOut,
    signIn: authClient.signIn,
    signUp: authClient.signUp,
    
    // Direct access to client for advanced use cases
    client: authClient,
  };
}

// Re-export SessionData type for convenience
export type { SessionData };
