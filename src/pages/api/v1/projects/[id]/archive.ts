import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { projectController } from '@/server/controllers/project.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const POST: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'projects:write');
  return projectController.archive(params.id!);
});
