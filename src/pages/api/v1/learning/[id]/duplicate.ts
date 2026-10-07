import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { learningController } from '@/server/controllers/learning.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const POST: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'learning:write');
  return learningController.duplicate(params.id!);
});
