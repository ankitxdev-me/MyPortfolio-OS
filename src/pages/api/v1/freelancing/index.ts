import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { freelancingController } from '@/server/controllers/freelancing.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 10;
  const search = url.searchParams.get('search');
  const includeDrafts = url.searchParams.get('includeDrafts') === 'true';

  const filter: any = {};
  if (!includeDrafts) {
    filter.published = { $ne: false };
    filter.status = { $nin: ['Draft', 'draft', 'Planned'] };
  }

  return freelancingController.handleGetPaginated({ page, limit, search: search || undefined }, filter);
});

export const POST: APIRoute = createApiHandler(async ({ request }) => {
  await requireAuth(request);
  await requirePermission(request, 'freelancing:write');
  const body = await request.json();
  return freelancingController.create(body);
});
