import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { learningController } from '@/server/controllers/learning.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ params }) => {
  return learningController.handleGetById(params.id!);
});

export const PUT: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'learning:write');
  const body = await request.json();
  return learningController.updateTopic(params.id!, body);
});

export const DELETE: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'learning:write');
  return learningController.handleDelete(params.id!);
});
