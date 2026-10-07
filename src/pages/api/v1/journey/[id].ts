import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { journeyController } from '@/server/controllers/journey.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ params }) => {
  return journeyController.handleGetById(params.id!);
});

export const PUT: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'journey:write');
  const body = await request.json();
  return journeyController.updateMilestone(params.id!, body);
});

export const DELETE: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'journey:write');
  return journeyController.handleDelete(params.id!);
});
