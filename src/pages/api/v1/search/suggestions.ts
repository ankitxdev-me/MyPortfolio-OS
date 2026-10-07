import type { APIRoute } from 'astro';
import { searchService } from '@/server/services/search.service';

export const GET: APIRoute = async ({ url }) => {
  try {
    const query = url.searchParams.get('q') || url.searchParams.get('query') || '';
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);

    const suggestions = await searchService.getSuggestions(query, limit);

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'SUGGESTIONS_FAILED',
        message: error instanceof Error ? error.message : 'Failed to fetch search suggestions',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
