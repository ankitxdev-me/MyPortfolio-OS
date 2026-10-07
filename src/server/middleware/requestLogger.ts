import { logger } from '../logger/logger';

export async function requestLoggerMiddleware(
  request: Request,
  url: URL,
  next: () => Promise<Response>
): Promise<Response> {
  const startTime = performance.now();
  const response = await next();
  const durationMs = performance.now() - startTime;
  
  logger.request(request.method, url.pathname, response.status, durationMs);
  return response;
}
