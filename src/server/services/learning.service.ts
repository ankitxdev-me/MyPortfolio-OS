import { BaseService } from '../base/BaseService';
import { learningRepository, LearningRepository } from '../db/repositories/LearningRepository';
import type { TechnologyDetail } from '@/data/learningData';
import { slugify } from '../utils/slug';
import { NotFoundError } from '../errors/HttpError';
import { logger } from '../logger/logger';

export class LearningService extends BaseService<TechnologyDetail & { id: string }> {
  constructor(repository: LearningRepository = learningRepository) {
    super(repository);
  }

  public async createTopic(data: Partial<TechnologyDetail>): Promise<TechnologyDetail & { id: string }> {
    const rawData = data as Record<string, unknown>;
    const title = (data as any).title || data.name || 'Untitled Learning Topic';
    const name = data.name || title;
    const baseSlug = slugify(title);
    let slug = baseSlug;

    const existing = await (this.repository as LearningRepository).findBySlug(slug);
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const progressVal = typeof (data as any).progressPercent === 'number'
      ? (data as any).progressPercent
      : (typeof rawData.proficiency === 'number' ? rawData.proficiency : (typeof (data as any).progress === 'number' ? (data as any).progress : 50));

    const payload = {
      ...data,
      title,
      name,
      slug,
      platform: (data as any).platform || 'Self-Paced',
      instructor: (data as any).instructor || 'Lead Architect',
      proficiency: progressVal,
      progressPercent: progressVal,
      status: data.status || 'in_progress',
      published: (data as any).published !== false,
      featured: !!(data as any).featured,
      isTopSkill: !!(data as any).isTopSkill,
      topics: (data as any).topics || [],
      timeline: (data as any).timeline || [],
    };

    logger.info(`LearningService: Creating learning item [${title}] with slug [${slug}]`);
    return this.create(payload as Partial<TechnologyDetail & { id: string }>);
  }

  public async duplicateTopic(id: string): Promise<TechnologyDetail & { id: string }> {
    const existing = await this.getById(id);
    if (!existing) throw new NotFoundError(`Topic [ID: ${id}] not found`);

    const currentTitle = (existing as any).title || existing.name || 'Topic';
    const duplicatedName = `${currentTitle} (Copy)`;
    const duplicatedSlug = `${existing.slug}-copy-${Date.now().toString(36)}`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...rest } = existing;
    return this.create({
      ...rest,
      name: duplicatedName,
      title: duplicatedName,
      slug: duplicatedSlug,
      published: false,
      status: 'Draft',
    } as unknown as Partial<TechnologyDetail & { id: string }>);
  }

  public async publishTopic(id: string): Promise<TechnologyDetail & { id: string }> {
    return this.update(id, { published: true, status: 'in_progress' } as any);
  }

  public async archiveTopic(id: string): Promise<TechnologyDetail & { id: string }> {
    return this.update(id, { published: false, status: 'Draft' } as any);
  }
}

export const learningService = new LearningService();
