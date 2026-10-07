import type { ApiErrorDetail } from '../types/api.types';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details: ApiErrorDetail[];
  public readonly userFriendlyMessage: string;

  constructor(
    statusCode: number,
    errorCode: string,
    message: string,
    details: ApiErrorDetail[] = [],
    userFriendlyMessage?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.userFriendlyMessage = userFriendlyMessage || message;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network connection failure. Please check your internet connection.') {
    super(0, 'NETWORK_ERROR', message, [], message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', details: ApiErrorDetail[] = []) {
    super(400, 'VALIDATION_ERROR', message, details, message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required. Please sign in.') {
    super(401, 'UNAUTHORIZED', message, [], message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message = 'Access denied. Insufficient permissions.') {
    super(403, 'FORBIDDEN', message, [], message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'The requested resource was not found.') {
    super(404, 'NOT_FOUND', message, [], message);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends ApiError {
  constructor(message = 'An unexpected server error occurred. Please try again later.') {
    super(500, 'INTERNAL_SERVER_ERROR', message, [], message);
    this.name = 'ServerError';
  }
}
