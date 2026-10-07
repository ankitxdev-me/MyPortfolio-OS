import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { certificateController } from '@/server/controllers/certificate.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ params }) => {
  return certificateController.handleGetById(params.id!);
});

export const PUT: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'learning:write');
  const body = await request.json();
  return certificateController.updateCertificate(params.id!, body);
});

export const DELETE: APIRoute = createApiHandler(async ({ params, request }) => {
  await requireAuth(request);
  await requirePermission(request, 'learning:write');
  return certificateController.handleDelete(params.id!);
});
