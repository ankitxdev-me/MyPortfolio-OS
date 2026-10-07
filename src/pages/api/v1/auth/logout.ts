import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { successResponse } from '@/server/api/response';
import { authService } from '@/server/auth/auth.service';
import { SESSION_COOKIE_NAME } from '@/server/auth/session';

export const prerender = false;

/**
 * POST /api/v1/auth/logout
 *
 * Revokes the server-side session and clears the session cookie.
 * Returns 200 even if no active session exists (idempotent logout).
 */
export const POST: APIRoute = createApiHandler(async ({ request, cookies }) => {
  // Revoke server-side session if one exists
  const token = authService.getSessionTokenFromRequest(request);
  if (token) {
    authService.logout(token);
  }

  // Delete cookie via Astro's cookie API (sets proper Set-Cookie header)
  cookies.delete(SESSION_COOKIE_NAME, {
    path: '/',
    sameSite: 'lax',
  });

  // Belt-and-suspenders: also set the expiry-in-past header for browsers
  // that don't respect cookies.delete() in all edge cases
  const clearCookieHeader = `${SESSION_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`;
  const response = successResponse({ loggedOut: true }, 'Successfully logged out');
  response.headers.append('Set-Cookie', clearCookieHeader);

  return response;
});
