import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { mediaController } from '@/server/controllers/media.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 12;
  const folder = url.searchParams.get('folder');
  const search = url.searchParams.get('search');

  const filter: Record<string, unknown> = {};
  if (folder) filter.folder = folder;

  return mediaController.handleGetPaginated({ page, limit, search: search || undefined }, filter);
});

export const POST: APIRoute = createApiHandler(async ({ request }) => {
  await requireAuth(request);
  await requirePermission(request, 'media:write');
  const formData = await request.formData();
  return mediaController.uploadFile(formData);
});
