import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { academicsController } from '@/server/controllers/academics.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ params }) => {
  return academicsController.handleGetById(params.id!);
});

export const PUT: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'academics:write');
  const body = await request.json();
  return academicsController.updateSemester(params.id!, body);
});

export const DELETE: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'academics:write');
  return academicsController.handleDelete(params.id!);
});
