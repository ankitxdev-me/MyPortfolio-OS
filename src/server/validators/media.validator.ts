import { z } from 'zod';
import { BaseValidator } from '../base/BaseValidator';

export const mediaFolderEnum = z.enum([
  'projects',
  'blogs',
  'learning',
  'journey',
  'academics',
  'freelancing',
  'profile',
  'general',
]);

export const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const updateMediaMetadataSchema = z.object({
  altText: z.string().optional().default(''),
  folder: mediaFolderEnum.default('general'),
  tags: z.array(z.string()).optional().default([]),
});

export class MediaValidator extends BaseValidator<z.infer<typeof updateMediaMetadataSchema>> {
  protected schema = updateMediaMetadataSchema;

  public validateFile(file: { name: string; size: number; type: string }): void {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size [${(file.size / 1024 / 1024).toFixed(2)}MB] exceeds 10MB limit.`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      throw new Error(`Unsupported file MIME type [${file.type}]. Supported types: PNG, JPEG, WEBP, SVG.`);
    }
  }
}

export const mediaValidator = new MediaValidator();
