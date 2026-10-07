import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { journeyController } from '@/server/controllers/journey.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 10;
  const year = url.searchParams.get('year');
  const search = url.searchParams.get('search');

  const filter: Record<string, unknown> = {};
  if (year) filter.year = year;

  return journeyController.handleGetPaginated({ page, limit, search: search || undefined }, filter);
});

export const POST: APIRoute = createApiHandler(async ({ request }) => {
  await requireAuth(request);
  await requirePermission(request, 'journey:write');
  const body = await request.json();
  return journeyController.create(body);
});
