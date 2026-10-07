import type { z } from 'zod';
import { ValidationError } from '../errors/ValidationError';
import type { FieldValidationErrorDetail } from '../types/error.types';

export abstract class BaseValidator<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract schema: z.ZodType<T, any, any>;

  public validate(data: unknown): T {
    const result = this.schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: FieldValidationErrorDetail[] = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      throw new ValidationError('Validation failed', fieldErrors);
    }
    return result.data;
  }

  public validatePartial(data: unknown): Partial<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ('partial' in this.schema && typeof (this.schema as any).partial === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const partialSchema = (this.schema as any).partial();
      const result = partialSchema.safeParse(data);
      if (!result.success) {
        const fieldErrors: FieldValidationErrorDetail[] = (result.error as z.ZodError).errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        throw new ValidationError('Partial validation failed', fieldErrors);
      }
      return result.data;
    }
    return this.validate(data) as Partial<T>;
  }
}
