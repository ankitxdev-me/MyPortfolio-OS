import type { APIRoute } from 'astro';
import { searchService } from '@/server/services/search.service';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug') || '';
    const type = url.searchParams.get('type') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '3', 10);

    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'Missing parameter', message: 'Parameter "slug" is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const related = await searchService.getRelatedContent(slug, type, limit);

    return new Response(JSON.stringify(related), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch related content', message: err?.message || 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
