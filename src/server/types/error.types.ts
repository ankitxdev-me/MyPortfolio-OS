export enum ErrorCodeEnum {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

export interface FieldValidationErrorDetail {
  field: string;
  message: string;
  code?: string;
}

export interface ErrorPayload {
  code: ErrorCodeEnum | string;
  message: string;
  details?: FieldValidationErrorDetail[] | unknown;
  timestamp: string;
  path?: string;
  stack?: string;
}
