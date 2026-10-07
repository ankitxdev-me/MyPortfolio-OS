import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { blogController } from '@/server/controllers/blog.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ params }) => {
  return blogController.handleGetById(params.id!);
});

export const PUT: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'blogs:write');
  const body = await request.json();
  return blogController.updateArticle(params.id!, body);
});

export const DELETE: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'blogs:delete');
  return blogController.handleDelete(params.id!);
});
