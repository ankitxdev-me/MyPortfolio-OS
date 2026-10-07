import type { APIRoute } from 'astro';
import { createApiHandler } from '@/server/api/handler';
import { githubService } from '@/server/services/github.service';
import { successResponse } from '@/server/api/response';

export const prerender = false;

export const GET: APIRoute = createApiHandler(async ({ url }) => {
  const explicitUsername = url.searchParams.get('username') || undefined;
  const stats = await githubService.getGitHubStats(explicitUsername);
  return successResponse(stats, 'GitHub statistics retrieved successfully');
});
