import { BaseService } from '../base/BaseService';
import { projectRepository, ProjectRepository } from '../db/repositories/ProjectRepository';
import type { DetailedProject } from '@/data/projectsData';
import { slugify } from '../utils/slug';
import { NotFoundError } from '../errors/HttpError';
import { logger } from '../logger/logger';

export class ProjectService extends BaseService<DetailedProject & { id: string }> {
  constructor(repository: ProjectRepository = projectRepository) {
    super(repository);
  }

  public async createProject(data: Partial<DetailedProject>): Promise<DetailedProject & { id: string }> {
    const title = data.title || 'Untitled Project';
    const baseSlug = slugify(title);
    let slug = baseSlug;
    
    const existing = await (this.repository as ProjectRepository).findBySlug(slug);
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const payload = {
      ...data,
      slug,
      status: data.status || 'In Progress',
      progress: data.progress || 0,
      featured: data.featured || false,
    };

    logger.info(`ProjectService: Creating new project [${title}] with slug [${slug}]`);
    return this.create(payload as Partial<DetailedProject & { id: string }>);
  }

  public async publishProject(id: string): Promise<DetailedProject & { id: string }> {
    logger.info(`ProjectService: Publishing project [ID: ${id}]`);
    return this.update(id, { status: 'Completed', progress: 100, published: true } as Partial<DetailedProject & { id: string }>);
  }

  public async archiveProject(id: string): Promise<DetailedProject & { id: string }> {
    logger.info(`ProjectService: Archiving project [ID: ${id}]`);
    return this.update(id, { status: 'Planned', published: false } as Partial<DetailedProject & { id: string }>);
  }

  public async duplicateProject(id: string): Promise<DetailedProject & { id: string }> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new NotFoundError(`Project to duplicate [ID: ${id}] not found`);
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

    logger.info(`ProjectService: Duplicating project [${existing.title}] -> [${duplicatedTitle}]`);
    return this.create(payload as Partial<DetailedProject & { id: string }>);
  }
}

export const projectService = new ProjectService();
