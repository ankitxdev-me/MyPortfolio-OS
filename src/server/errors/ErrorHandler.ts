import { AppError } from './AppError';
import { ErrorFormatter } from './ErrorFormatter';
import { logger } from '../logger/logger';
import type { ApiErrorResponse } from '../types/api.types';
import { HTTP_STATUS, type HttpStatusCode } from '../config/constants';

export class ErrorHandler {
  public static handle(error: unknown, path?: string): { statusCode: HttpStatusCode; body: ApiErrorResponse } {
    const formattedError = ErrorFormatter.format(error, path);
    let statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;

    if (error instanceof AppError) {
      statusCode = error.statusCode;
      if (!error.isOperational) {
        logger.error(`Critical Unoperational AppError [${error.errorCode}]:`, error);
      } else {
        logger.warn(`Operational AppError [${error.errorCode}] at ${path || 'unknown'}: ${error.message}`);
      }
    } else {
      logger.error(`Unhandled Unknown Error at ${path || 'unknown'}:`, error);
    }

    return {
      statusCode,
      body: {
        success: false,
        error: formattedError,
        timestamp: formattedError.timestamp,
      },
    };
  }
}
