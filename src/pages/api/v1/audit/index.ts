import type { APIRoute } from 'astro';
import { requirePermission } from '@/server/middleware/auth.middleware';
import { auditService } from '@/server/services/audit.service';

export const GET: APIRoute = async (context) => {
  try {
    await requirePermission(context.request, 'settings:write');
    const limit = parseInt(context.url.searchParams.get('limit') || '50', 10);
    const page = parseInt(context.url.searchParams.get('page') || '1', 10);

    const logsData = await auditService.getLogs(limit, page);

    return new Response(JSON.stringify(logsData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'AUDIT_QUERY_FAILED',
        message: error instanceof Error ? error.message : 'Failed to query audit logs',
      }),
      { status: error.status || 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
