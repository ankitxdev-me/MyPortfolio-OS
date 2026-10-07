import type { APIRoute } from 'astro';
import { searchService } from '@/server/services/search.service';

export const GET: APIRoute = async ({ url }) => {
  try {
    const query = url.searchParams.get('q') || url.searchParams.get('query') || '';
    const type = (url.searchParams.get('type') as any) || 'all';
    const category = url.searchParams.get('category') || undefined;
    const tag = url.searchParams.get('tag') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    const searchResult = await searchService.globalSearch({
      query,
      type,
      category,
      tag,
      limit,
      page,
    });

    return new Response(JSON.stringify(searchResult), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'SEARCH_FAILED',
        message: error instanceof Error ? error.message : 'Failed to perform global search',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
