import { BaseService } from '../base/BaseService';
import { blogRepository, BlogRepository } from '../db/repositories/BlogRepository';
import type { DetailedBlog } from '@/data/blogsData';
import { slugify } from '../utils/slug';
import { NotFoundError } from '../errors/HttpError';
import { logger } from '../logger/logger';

export class BlogService extends BaseService<DetailedBlog & { id: string }> {
  constructor(repository: BlogRepository = blogRepository) {
    super(repository);
  }

  public async createArticle(data: Partial<DetailedBlog>): Promise<DetailedBlog & { id: string }> {
    const title = data.title || 'Untitled Article';
    const baseSlug = slugify(title);
    let slug = baseSlug;

    const existing = await (this.repository as BlogRepository).findBySlug(slug);
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const payload = {
      ...data,
      slug,
      publishedAt: data.date || new Date().toISOString(),
      featured: data.featured || false,
    };

    logger.info(`BlogService: Creating new blog article [${title}] with slug [${slug}]`);
    return this.create(payload as Partial<DetailedBlog & { id: string }>);
  }

  public async publishArticle(id: string): Promise<DetailedBlog & { id: string }> {
    logger.info(`BlogService: Publishing blog article [ID: ${id}]`);
    return this.update(id, { status: 'published', published: true, date: new Date().toISOString() } as Partial<DetailedBlog & { id: string }>);
  }

  public async archiveArticle(id: string): Promise<DetailedBlog & { id: string }> {
    logger.info(`BlogService: Archiving blog article [ID: ${id}]`);
    return this.update(id, { status: 'draft', published: false } as Partial<DetailedBlog & { id: string }>);
  }

  public async duplicateArticle(id: string): Promise<DetailedBlog & { id: string }> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new NotFoundError(`Blog article to duplicate [ID: ${id}] not found`);
    }

    const duplicatedTitle = `${existing.title} (Copy)`;
    const duplicatedSlug = `${existing.slug}-copy-${Date.now().toString(36)}`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...rest } = existing;
    const payload = {
      ...rest,
      title: duplicatedTitle,
      slug: duplicatedSlug,
      featured: false,
    };

    logger.info(`BlogService: Duplicating article [${existing.title}] -> [${duplicatedTitle}]`);
    return this.create(payload as Partial<DetailedBlog & { id: string }>);
  }
}

export const blogService = new BlogService();
