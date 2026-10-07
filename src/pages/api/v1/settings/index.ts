import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { settingsController } from '@/server/controllers/settings.controller';
import { requireAuth, requirePermission } from '@/server/middleware/auth.middleware';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async () => {
  return settingsController.getSettings();
});

export const PUT: APIRoute = createApiHandler(async ({ request }) => {
  await requireAuth(request);
  await requirePermission(request, 'settings:write');
  const body = await request.json();
  return settingsController.updateSettings(body);
});
