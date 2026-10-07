import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { certificateController } from '@/server/controllers/certificate.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 50;
  const search = url.searchParams.get('search');

  const filter: Record<string, unknown> = {};
  return certificateController.handleGetPaginated({ page, limit, search: search || undefined }, filter);
});

export const POST: APIRoute = createApiHandler(async ({ request }) => {
  await requireAuth(request);
  await requirePermission(request, 'learning:write');
  const body = await request.json();
  return certificateController.create(body);
});
