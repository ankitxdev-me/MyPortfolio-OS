import type { ErrorPayload } from '../types/error.types';
import { AppError } from './AppError';
import { ErrorCodeEnum } from '../types/error.types';
import { appConfig } from '../config/app.config';

export class ErrorFormatter {
  public static format(error: unknown, path?: string): ErrorPayload {
    const timestamp = new Date().toISOString();

    if (error instanceof AppError) {
      return {
        code: error.errorCode,
        message: error.message,
        details: error.details,
        timestamp,
        path,
        stack: appConfig.isDev ? error.stack : undefined,
      };
    }

    if (error instanceof Error) {
      return {
        code: ErrorCodeEnum.INTERNAL_SERVER_ERROR,
        message: appConfig.isDev ? error.message : 'An internal server error occurred',
        timestamp,
        path,
        stack: appConfig.isDev ? error.stack : undefined,
      };
    }

    return {
      code: ErrorCodeEnum.INTERNAL_SERVER_ERROR,
      message: 'Unknown error occurred',
      timestamp,
      path,
    };
  }
}
