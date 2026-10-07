import type { APIRoute } from 'astro';
import { searchService } from '@/server/services/search.service';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const type = (url.searchParams.get('type') || 'all') as any;
    const category = url.searchParams.get('category') || undefined;
    const tag = url.searchParams.get('tag') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    const searchRes = await searchService.globalSearch({
      query,
      type,
      category,
      tag,
      limit,
      page,
    });

    return new Response(JSON.stringify(searchRes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: 'Search failed', message: err?.message || 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
