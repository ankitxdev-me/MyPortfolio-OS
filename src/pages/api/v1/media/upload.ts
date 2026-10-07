import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { mediaController } from '@/server/controllers/media.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const POST: APIRoute = createApiHandler(async ({ request }) => {
  await requireAuth(request);
  await requirePermission(request, 'media:write');
  const formData = await request.formData();
  return mediaController.uploadFile(formData);
});
