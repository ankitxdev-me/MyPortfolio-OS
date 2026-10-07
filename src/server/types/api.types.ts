import type { ErrorPayload } from './error.types';
import type { PaginationMeta } from './pagination.types';

export interface ApiResponse<T = unknown> {
  success: true;
  message?: string;
  data: T;
  meta?: PaginationMeta | Record<string, unknown>;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ErrorPayload;
  timestamp: string;
}

export type StandardApiResponse<T = unknown> = ApiResponse<T> | ApiErrorResponse;
