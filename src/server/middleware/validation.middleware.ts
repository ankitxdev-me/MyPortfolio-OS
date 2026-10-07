import type { z } from 'zod';
import { ValidationError } from '../errors/ValidationError';
import type { FieldValidationErrorDetail } from '../types/error.types';

export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch (error) {
    try {
      const text = await request.text();
      rawBody = text && text.trim() ? JSON.parse(text) : {};
    } catch (e) {
      throw new ValidationError('Invalid JSON request body format', [
        { field: 'body', message: 'Malformed JSON payload' },
      ]);
    }
  }

  const result = schema.safeParse(rawBody);

  if (!result.success) {
    const fieldErrors: FieldValidationErrorDetail[] = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));

    throw new ValidationError('Validation failed for request body', fieldErrors);
  }

  return result.data;
}

export function validateRequestQuery<T>(
  url: URL,
  schema: z.ZodSchema<T>
): T {
  const queryObj: Record<string, string> = {};
  url.searchParams.forEach((val, key) => {
    queryObj[key] = val;
  });

  const result = schema.safeParse(queryObj);

  if (!result.success) {
    const fieldErrors: FieldValidationErrorDetail[] = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));

    throw new ValidationError('Validation failed for query parameters', fieldErrors);
  }

  return result.data;
}
