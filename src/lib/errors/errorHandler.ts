import {
  ApiError,
  NetworkError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ServerError,
} from './apiError';

export class ErrorHandler {
  public static async fromResponse(response: Response): Promise<ApiError> {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || 'Unexpected error' };
    }

    const statusCode = response.status;
    const errorCode = errorData.error?.code || `HTTP_${statusCode}`;
    const message = errorData.error?.message || errorData.message || 'An error occurred';
    const details = errorData.error?.details || [];

    switch (statusCode) {
      case 400:
        return new ValidationError(message, details);
      case 401:
        return new AuthenticationError(message);
      case 403:
        return new AuthorizationError(message);
      case 404:
        return new NotFoundError(message);
      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerError(message);
      default:
        return new ApiError(statusCode, errorCode, message, details);
    }
  }

  public static handle(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new NetworkError();
    }

    if (error instanceof Error) {
      return new ServerError(error.message);
    }

    return new ServerError('An unknown error occurred.');
  }
}
