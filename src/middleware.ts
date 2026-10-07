import { defineMiddleware } from 'astro:middleware';
import { rateLimiter } from '@/server/middleware/rateLimiter';
import { handleDashboardRouteProtection } from '@/server/middleware/auth.middleware';
import { authService } from '@/server/auth/auth.service';
import { SESSION_COOKIE_NAME } from '@/server/auth/session';
import { dbManager } from '@/server/db/connection';
import { SettingsModel } from '@/server/db/models/Settings.model';
import { seedDatabase } from '@/server/db/seeders/seed';
import { logger } from '@/server/logger/logger';

let isSeeding = false;

export const onRequest = defineMiddleware(async (context, next) => {
  // ── Database Connection & Auto-Seeding ──────────────────────────────────
  try {
    await dbManager.connect();
    if (!isSeeding) {
      const settingsCount = await SettingsModel.countDocuments();
      if (settingsCount === 0) {
        isSeeding = true;
        logger.info('Database empty. Triggering initial seed...');
        await seedDatabase().catch((err) => logger.error('Auto-seed error:', err));
        isSeeding = false;
      }
    }
  } catch (err) {
    logger.error('Failed to establish database connection in middleware:', err);
  }

  const clientIp = context.request.headers.get('x-forwarded-for') || '127.0.0.1';
  const pathname = context.url.pathname;


  // ── Rate Limiting ────────────────────────────────────────────────────────

  let maxRequests = 100;
  if (pathname.startsWith('/api/v1/auth')) {
    maxRequests = 10;
  } else if (pathname.startsWith('/api/v1/media/upload')) {
    maxRequests = 15;
  }

  const rateCheck = rateLimiter.isRateLimited(`${clientIp}:${pathname}`, maxRequests, 60000);
  if (rateCheck.limited) {
    return new Response(
      JSON.stringify({
        error: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded. Please wait before retrying.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil(rateCheck.resetMs / 1000)),
        },
      }
    );
  }

  // ── Dashboard / Login Route Protection ───────────────────────────────────

  const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const isLoginRoute = pathname === '/login';

  if (isDashboardRoute || isLoginRoute) {
    // Read the raw session cookie value
    const cookieHeader = context.request.headers.get('Cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader
        .split(';')
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => {
          const idx = c.indexOf('=');
          return [c.slice(0, idx).trim(), c.slice(idx + 1).trim()];
        })
    );
    const rawToken = cookies[SESSION_COOKIE_NAME];

    // Validate the session (null = no valid session)
    const user = await authService.validateSession(rawToken || '');

    // Detect "expired session" vs "no session":
    // rawToken is present but session is invalid → expired
    const isExpiredSession = !!rawToken && !user;

    const redirect = handleDashboardRouteProtection(pathname, user);
    if (redirect) {
      // If the cookie exists but session is invalid (expired / revoked),
      // append ?expired=1 so the login page can show an informative banner.
      if (isDashboardRoute && isExpiredSession) {
        const expiredUrl = `/login?expired=1&redirect=${encodeURIComponent(pathname)}`;
        return new Response(null, {
          status: 302,
          headers: { Location: expiredUrl },
        });
      }
      return redirect;
    }
  }

  // ── Execute Handler ──────────────────────────────────────────────────────

  const response = await next();

  // ── Security Headers ─────────────────────────────────────────────────────

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Cache-Control: no caching for dashboard, short TTL for public pages
  if (context.request.method === 'GET' && !pathname.startsWith('/dashboard')) {
    if (!response.headers.has('Cache-Control')) {
      response.headers.set(
        'Cache-Control',
        'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400'
      );
    }
  }

  return response;
});
