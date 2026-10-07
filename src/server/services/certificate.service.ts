import { BaseService } from '../base/BaseService';
import { certificateRepository, CertificateRepository } from '../db/repositories/CertificateRepository';
import type { CertificateDTO } from '@/lib/types/api.types';
import { slugify } from '../utils/slug';
import { logger } from '../logger/logger';

export class CertificateService extends BaseService<CertificateDTO> {
  constructor(repository: CertificateRepository = certificateRepository) {
    super(repository);
  }

  public async createCertificate(data: Partial<CertificateDTO>): Promise<CertificateDTO> {
    const title = data.title || 'Untitled Certificate';
    const baseSlug = slugify(title);
    let slug = baseSlug;

    const existing = await (this.repository as CertificateRepository).findBySlug(slug);
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const payload: Partial<CertificateDTO> = {
      ...data,
      title,
      slug,
      published: data.published !== false,
    };

    logger.info(`CertificateService: Creating certificate [${title}] with slug [${slug}]`);
    return this.create(payload);
  }
}

export const certificateService = new CertificateService();
