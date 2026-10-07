import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { mediaController } from '@/server/controllers/media.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ params }) => {
  return mediaController.handleGetById(params.id!);
});

export const PUT: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'media:write');
  const body = await request.json();
  return mediaController.updateMetadata(params.id!, body);
});

export const DELETE: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'media:write');
  return mediaController.deleteAsset(params.id!);
});
