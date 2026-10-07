import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { successResponse } from '@/server/api/response';
import { authService } from '@/server/auth/auth.service';
import { SESSION_COOKIE_NAME } from '@/server/auth/session';

export const prerender = false;

export const POST: APIRoute = createApiHandler(async ({ request, cookies }) => {
  let bodyData: Record<string, any> = {};

  try {
    const rawText = await request.text();
    if (rawText && rawText.trim() !== '') {
      try {
        bodyData = JSON.parse(rawText);
      } catch {
        const params = new URLSearchParams(rawText);
        bodyData = Object.fromEntries(params.entries());
      }
    }
  } catch {
    bodyData = {};
  }

  const email = (bodyData.email || '').toString().trim();
  const password = (bodyData.password || '').toString().trim();
  const rememberMe = bodyData.rememberMe !== false;

  const { user, token, expiresAt, permissions } = await authService.login(
    email,
    password,
    rememberMe
  );

  // Set HTTP-only session cookie via Astro's built-in cookies manager
  cookies.set(SESSION_COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    expires: expiresAt,
  });

  return successResponse(
    {
      token,
      user,
      permissions,
      expiresAt: expiresAt.toISOString(),
    },
    'Authentication successful'
  );
});
