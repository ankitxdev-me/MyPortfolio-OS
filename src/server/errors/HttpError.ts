import { AppError } from './AppError';
import { ErrorCodeEnum } from '../types/error.types';
import { HTTP_STATUS } from '../config/constants';

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: unknown) {
    super(message, HTTP_STATUS.BAD_REQUEST, ErrorCodeEnum.BAD_REQUEST, true, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', details?: unknown) {
    super(message, HTTP_STATUS.UNAUTHORIZED, ErrorCodeEnum.UNAUTHORIZED, true, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden', details?: unknown) {
    super(message, HTTP_STATUS.FORBIDDEN, ErrorCodeEnum.FORBIDDEN, true, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Requested resource not found', details?: unknown) {
    super(message, HTTP_STATUS.NOT_FOUND, ErrorCodeEnum.NOT_FOUND, true, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict detected', details?: unknown) {
    super(message, HTTP_STATUS.CONFLICT, ErrorCodeEnum.CONFLICT, true, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'An unexpected internal server error occurred', details?: unknown) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, ErrorCodeEnum.INTERNAL_SERVER_ERROR, false, details);
  }
}
