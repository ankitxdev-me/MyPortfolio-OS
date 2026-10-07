import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { blogController } from '@/server/controllers/blog.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const POST: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'blogs:write');
  return blogController.archive(params.id!);
});
