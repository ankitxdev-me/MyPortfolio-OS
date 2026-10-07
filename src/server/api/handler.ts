import type { APIRoute } from 'astro';
import { ErrorHandler } from '../errors/ErrorHandler';
import { logger } from '../logger/logger';

export type ApiHandlerFunction = (context: Parameters<APIRoute>[0]) => Promise<Response> | Response;

export function createApiHandler(handler: ApiHandlerFunction): APIRoute {
  return async (context) => {
    const startTime = performance.now();
    const { request, url } = context;

    try {
      const response = await handler(context);
      const durationMs = performance.now() - startTime;
      logger.request(request.method, url.pathname, response.status, durationMs);
      return response;
    } catch (error) {
      const durationMs = performance.now() - startTime;
      const { statusCode, body } = ErrorHandler.handle(error, url.pathname);
      logger.request(request.method, url.pathname, statusCode, durationMs);

      return new Response(JSON.stringify(body), {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  };
}
