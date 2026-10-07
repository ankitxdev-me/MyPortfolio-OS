import { useAuth } from './AuthContext';
import type { Permission } from '@/server/auth/permissions';

/**
 * usePermissions — convenience hook for permission-based UI guards.
 *
 * @example
 * const { can, canAny } = usePermissions();
 * if (can('projects:write')) { ... }
 * if (canAny(['media:write', 'media:delete'])) { ... }
 */
export function usePermissions() {
  const { hasPermission, hasAnyPermission, isAuthenticated, user } = useAuth();

  return {
    /** Check if the current user has a specific permission */
    can: (permission: Permission) => isAuthenticated && hasPermission(permission),
    /** Check if the current user has ANY of the given permissions */
    canAny: (permissions: Permission[]) => isAuthenticated && hasAnyPermission(permissions),
    /** Check if the current user has ALL of the given permissions */
    canAll: (permissions: Permission[]) => isAuthenticated && permissions.every((p) => hasPermission(p)),
    /** Whether the current user is an admin */
    isAdmin: isAuthenticated && user?.role === 'admin',
    /** The current user's role */
    role: user?.role ?? null,
  };
}
