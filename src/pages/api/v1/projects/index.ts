import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { projectController } from '@/server/controllers/project.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 100;
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');
  const includeDrafts = url.searchParams.get('includeDrafts') === 'true';

  const filter: Record<string, unknown> = {};
  if (category && category !== 'All') filter.category = category;
  if (!includeDrafts) {
    filter.published = { $ne: false };
    filter.status = { $ne: 'Draft' };
  }

  return projectController.handleGetPaginated({ page, limit, search: search || undefined }, filter);
});

export const POST: APIRoute = createApiHandler(async ({ request }) => {
  await requireAuth(request);
  await requirePermission(request, 'projects:write');
  const body = await request.json();
  return projectController.create(body);
});
