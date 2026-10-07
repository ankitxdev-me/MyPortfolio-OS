import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { projectController } from '@/server/controllers/project.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ params }) => {
  return projectController.handleGetById(params.id!);
});

export const PUT: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'projects:write');
  const body = await request.json();
  return projectController.updateProject(params.id!, body);
});

export const DELETE: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'projects:delete');
  return projectController.handleDelete(params.id!);
});
