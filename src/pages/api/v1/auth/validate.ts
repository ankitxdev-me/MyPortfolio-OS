import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { successResponse } from '@/server/api/response';
import { authenticateRequest } from '@/server/middleware/auth.middleware';
import { PermissionManager, type UserRole } from '@/server/auth/permissions';

export const prerender = false;

/**
 * GET /api/v1/auth/validate
 *
 * Validates the current session cookie and returns auth state.
 * Used by client-side AuthContext to hydrate React auth state.
 *
 * Response:
 *   { valid: true,  user: SessionUser, permissions: string[] }
 *   { valid: false, user: null }
 */
export const GET: APIRoute = createApiHandler(async ({ request }) => {
  const user = await authenticateRequest(request);

  if (!user) {
    return successResponse({ valid: false, user: null, permissions: [] }, 'No active session');
  }

  const permissions = PermissionManager.getPermissionsForRole(user.role as UserRole);

  return successResponse(
    {
      valid: true,
      user,
      permissions,
    },
    'Session is valid'
  );
});
