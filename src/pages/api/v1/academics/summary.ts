import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { academicsController } from '@/server/controllers/academics.controller';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ url }) => {
  const includeDrafts = url.searchParams.get('includeDrafts') === 'true';
  return academicsController.getSummary(includeDrafts);
});
