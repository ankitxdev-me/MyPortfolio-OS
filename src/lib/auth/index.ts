/**
 * Auth Library — Barrel Export
 *
 * Central export point for all client-side authentication utilities.
 *
 * Usage:
 *   import { AuthProvider, useAuth, usePermissions } from '@/lib/auth';
 */

export { AuthProvider, useAuth } from './AuthContext';
export type { AuthUser, AuthState, AuthProviderProps } from './AuthContext';
export { usePermissions } from './usePermissions';
