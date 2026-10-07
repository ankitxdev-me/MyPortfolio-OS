import { BaseService } from '../base/BaseService';
import { journeyRepository, JourneyRepository } from '../db/repositories/JourneyRepository';
import type { DetailedMilestone } from '@/data/journeyData';
import { slugify } from '../utils/slug';
import { NotFoundError } from '../errors/HttpError';
import { logger } from '../logger/logger';

export class JourneyService extends BaseService<DetailedMilestone & { id: string }> {
  constructor(repository: JourneyRepository = journeyRepository) {
    super(repository);
  }

  public async createMilestone(data: Partial<DetailedMilestone>): Promise<DetailedMilestone & { id: string }> {
    const title = data.title || 'Untitled Milestone';
    const baseSlug = slugify(title);
    let slug = baseSlug;

    const existing = await (this.repository as JourneyRepository).findBySlug(slug);
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const rawData = data as Record<string, unknown>;
    const payload = {
      ...data,
      slug,
      year: data.year || new Date().getFullYear().toString(),
      quarter: (rawData.quarter as string) || 'Q1',
    };

    logger.info(`JourneyService: Creating milestone [${title}] with slug [${slug}]`);
    return this.create(payload as Partial<DetailedMilestone & { id: string }>);
  }

  public async duplicateMilestone(id: string): Promise<DetailedMilestone & { id: string }> {
    const existing = await this.getById(id);
    if (!existing) throw new NotFoundError(`Milestone [ID: ${id}] not found`);

    const duplicatedTitle = `${existing.title} (Copy)`;
    const duplicatedSlug = `${existing.slug}-copy-${Date.now().toString(36)}`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...rest } = existing;
    return this.create({
      ...rest,
      title: duplicatedTitle,
      slug: duplicatedSlug,
    } as Partial<DetailedMilestone & { id: string }>);
  }
}

export const journeyService = new JourneyService();
