import { ErrorHandler } from '../errors/ErrorHandler';

export async function errorHandlerMiddleware(
  urlPath: string,
  next: () => Promise<Response>
): Promise<Response> {
  try {
    return await next();
  } catch (error) {
    const { statusCode, body } = ErrorHandler.handle(error, urlPath);
    return new Response(JSON.stringify(body), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
