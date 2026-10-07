import type { ApiResponse, ApiErrorResponse } from '../types/api.types';
import type { PaginationMeta } from '../types/pagination.types';
import type { FieldValidationErrorDetail } from '../types/error.types';
import { ErrorCodeEnum } from '../types/error.types';
import { HTTP_STATUS, type HttpStatusCode } from '../config/constants';

export function successResponse<T>(
  data: T,
  message?: string,
  meta?: PaginationMeta | Record<string, unknown>,
  status: HttpStatusCode = HTTP_STATUS.OK
): Response {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function paginatedResponse<T>(
  items: T[],
  meta: PaginationMeta,
  message = 'Resource list retrieved successfully'
): Response {
  return successResponse(items, message, meta, HTTP_STATUS.OK);
}

export function errorResponse(
  message: string,
  code: ErrorCodeEnum | string = ErrorCodeEnum.INTERNAL_SERVER_ERROR,
  status: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details?: unknown,
  path?: string
): Response {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      path,
    },
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function validationErrorResponse(
  fieldErrors: FieldValidationErrorDetail[],
  message = 'Request validation failed',
  path?: string
): Response {
  return errorResponse(
    message,
    ErrorCodeEnum.VALIDATION_ERROR,
    HTTP_STATUS.UNPROCESSABLE_ENTITY,
    fieldErrors,
    path
  );
}
