import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { dashboardService } from '@/server/services/dashboard.service';
import { successResponse } from '@/server/api/response';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ request }) => {
  await requireAuth(request);
  const data = await dashboardService.getOverview();
  return successResponse(data, 'Dashboard overview data retrieved successfully');
});
