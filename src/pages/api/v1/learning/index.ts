import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { learningController } from '@/server/controllers/learning.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 10;
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;

  return learningController.handleGetPaginated({ page, limit, search: search || undefined }, filter);
});

export const POST: APIRoute = createApiHandler(async ({ request }) => {
  await requireAuth(request);
  await requirePermission(request, 'learning:write');
  const body = await request.json();
  return learningController.create(body);
});
