import { authService } from '../auth/auth.service';
import type { SessionUser } from '../auth/session';
import { PermissionManager, type Permission, type UserRole } from '../auth/permissions';
import { UnauthorizedError, ForbiddenError } from '../errors/HttpError';

export async function authenticateRequest(request: Request): Promise<SessionUser | null> {
  const token = authService.getSessionTokenFromRequest(request);
  if (!token) return null;
  return authService.validateSession(token);
}

export async function requireAuth(request: Request): Promise<SessionUser> {
  const user = await authenticateRequest(request);
  if (!user) {
    throw new UnauthorizedError('Authentication token or session cookie missing or expired');
  }
  return user;
}

export async function requirePermission(request: Request, permission: Permission): Promise<SessionUser> {
  const user = await requireAuth(request);
  if (!PermissionManager.hasPermission(user.role as UserRole, permission)) {
    throw new ForbiddenError(`Insufficient privileges. Missing permission '${permission}'`);
  }
  return user;
}

export async function requireAdminRole(request: Request): Promise<SessionUser> {
  const user = await requireAuth(request);
  if (user.role !== 'admin') {
    throw new ForbiddenError('Administrator privileges required');
  }
  return user;
}

export function handleDashboardRouteProtection(urlPath: string, user: SessionUser | null): Response | null {
  const isDashboardRoute = urlPath === '/dashboard' || urlPath.startsWith('/dashboard/');
  const isLoginRoute = urlPath === '/login' || urlPath === '/dashboard/login';

  // Redirect unauthenticated visitors attempting to access CMS dashboard to login page
  if (isDashboardRoute && !user && !isLoginRoute) {
    const redirectUrl = `/login?redirect=${encodeURIComponent(urlPath)}`;
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    });
  }

  // Redirect authenticated admin attempting to visit login page directly to dashboard
  if (isLoginRoute && user) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard',
      },
    });
  }

  return null;
}
