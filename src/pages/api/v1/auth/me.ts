import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { successResponse } from '@/server/api/response';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { PermissionManager, type UserRole } from '@/server/auth/permissions';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ request }) => {
  const user = await requireAuth(request);
  const permissions = PermissionManager.getPermissionsForRole(user.role as UserRole);

  return successResponse({
    user,
    permissions,
  });
});
