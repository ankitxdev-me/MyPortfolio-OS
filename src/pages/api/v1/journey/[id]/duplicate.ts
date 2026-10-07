import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { journeyController } from '@/server/controllers/journey.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const POST: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'journey:write');
  return journeyController.duplicate(params.id!);
});
