import { BaseService } from '../base/BaseService';
import { freelancingRepository, FreelancingRepository } from '../db/repositories/FreelancingRepository';
import type { DetailedClientWork } from '@/data/freelanceData';
import { slugify } from '../utils/slug';
import { logger } from '../logger/logger';

export class FreelancingService extends BaseService<DetailedClientWork & { id: string }> {
  constructor(repository: FreelancingRepository = freelancingRepository) {
    super(repository);
  }

  public async createClientWork(data: Partial<DetailedClientWork>): Promise<DetailedClientWork & { id: string }> {
    const title = data.title || 'Untitled Client Work';
    const baseSlug = slugify(title);
    let slug = baseSlug;

    const existing = await (this.repository as FreelancingRepository).findBySlug(slug);
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const payload = {
      ...data,
      slug,
      status: data.status || 'Completed',
      published: data.published !== false,
      featured: !!data.featured,
    };

    logger.info(`FreelancingService: Creating client project [${title}]`);
    return this.create(payload as Partial<DetailedClientWork & { id: string }>);
  }

  public async publishWork(id: string): Promise<DetailedClientWork & { id: string }> {
    return this.update(id, { status: 'Completed', published: true } as any);
  }

  public async archiveWork(id: string): Promise<DetailedClientWork & { id: string }> {
    return this.update(id, { status: 'Draft', published: false } as any);
  }
}

export const freelancingService = new FreelancingService();
