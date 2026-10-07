import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { successResponse } from '@/server/api/response';
import { authenticateRequest } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ request }) => {
  const user = await authenticateRequest(request);

  return successResponse({
    authenticated: !!user,
    user: user || null,
  });
});
