import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { freelancingController } from '@/server/controllers/freelancing.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ params }) => {
  return freelancingController.handleGetById(params.id!);
});

export const PUT: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'freelancing:write');
  const body = await request.json();
  return freelancingController.updateClientWork(params.id!, body);
});

export const DELETE: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'freelancing:write');
  return freelancingController.handleDelete(params.id!);
});
