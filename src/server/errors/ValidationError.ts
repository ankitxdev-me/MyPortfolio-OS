import { AppError } from './AppError';
import { ErrorCodeEnum, type FieldValidationErrorDetail } from '../types/error.types';
import { HTTP_STATUS } from '../config/constants';

export class ValidationError extends AppError {
  public readonly fieldErrors: FieldValidationErrorDetail[];

  constructor(message = 'Validation failed', fieldErrors: FieldValidationErrorDetail[] = []) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ErrorCodeEnum.VALIDATION_ERROR, true, fieldErrors);
    this.fieldErrors = fieldErrors;
  }
}
