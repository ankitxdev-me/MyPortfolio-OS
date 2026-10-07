import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { Permission } from '@/server/auth/permissions';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface AuthState {
  /** Whether a session check is in-flight */
  isLoading: boolean;
  /** Whether the user has a valid session */
  isAuthenticated: boolean;
  /** Authenticated user object, or null */
  user: AuthUser | null;
  /** Array of permission strings granted to the user's role */
  permissions: string[];
  /** Refresh auth state from the server (call after any credential change) */
  refresh: () => Promise<void>;
  /** Sign the user out: revokes server session + clears cookie + redirects */
  logout: () => Promise<void>;
  /** True if the user's role has the given permission */
  hasPermission: (permission: Permission) => boolean;
  /** True if the user's role has ANY of the listed permissions */
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthState | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useAuth — access auth state in any dashboard React island.
 *
 * Must be used inside <AuthProvider>.
 */
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface AuthProviderProps {
  children: React.ReactNode;
  /**
   * Initial user passed from the Astro server via props.
   * When provided, auth state is pre-hydrated synchronously (no loading flash).
   */
  initialUser?: AuthUser | null;
  initialPermissions?: string[];
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  initialUser = null,
  initialPermissions = [],
}) => {
  const [isLoading, setIsLoading] = useState(!initialUser);
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [permissions, setPermissions] = useState<string[]>(initialPermissions);
  const isMounted = useRef(true);

  // ── Validate session against server ────────────────────────────────────────

  const refresh = useCallback(async () => {
    if (!isMounted.current) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/validate', {
        method: 'GET',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });

      if (!isMounted.current) return;

      if (res.ok) {
        const json = await res.json();
        if (json?.data?.valid) {
          setUser(json.data.user);
          setPermissions(json.data.permissions || []);
        } else {
          setUser(null);
          setPermissions([]);
        }
      } else {
        setUser(null);
        setPermissions([]);
      }
    } catch {
      if (isMounted.current) {
        setUser(null);
        setPermissions([]);
      }
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch {
      // Continue with client-side cleanup even if network fails
    }

    // Clear client-side cookie fallback
    document.cookie = 'portfolio_os_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';

    setUser(null);
    setPermissions([]);
    window.location.href = '/login';
  }, []);

  // ── Permission Helpers ─────────────────────────────────────────────────────

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      return permissions.includes(permission);
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (perms: Permission[]): boolean => {
      return perms.some((p) => permissions.includes(p));
    },
    [permissions]
  );

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  useEffect(() => {
    isMounted.current = true;

    // Only fetch from server if we don't have pre-hydrated user from SSR
    if (!initialUser) {
      refresh();
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthState = {
    isLoading,
    isAuthenticated: !!user,
    user,
    permissions,
    refresh,
    logout,
    hasPermission,
    hasAnyPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
