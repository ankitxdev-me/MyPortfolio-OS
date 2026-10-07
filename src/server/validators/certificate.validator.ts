import { z } from 'zod';
import { BaseValidator } from '../base/BaseValidator';

export const createCertificateSchema = z.object({
  title: z.string().min(1, 'Certificate title is required'),
  issuer: z.string().min(1, 'Issuer organization is required'),
  issueDate: z.string().optional().default(''),
  credentialId: z.string().optional().default(''),
  url: z.string().optional().default(''),
  category: z.string().optional().default('Cloud & DevOps'),
  description: z.string().optional().default(''),
  published: z.boolean().optional().default(true),
});

export const updateCertificateSchema = createCertificateSchema.partial();

export class CertificateValidator extends BaseValidator<z.infer<typeof createCertificateSchema>> {
  protected schema = createCertificateSchema;
}

export const certificateValidator = new CertificateValidator();
