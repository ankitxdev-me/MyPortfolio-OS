import type { IBaseRepository, QueryOptions, PaginatedResult } from '../types/repository.types';
import type { PaginationParams } from '../types/pagination.types';
import { NotFoundError } from '../errors/HttpError';
import { auditService } from '../services/audit.service';

export abstract class BaseService<T extends { id: string }> {
  constructor(protected readonly repository: IBaseRepository<T>) {}

  public async getAll(filter: Record<string, unknown> = {}, options?: QueryOptions): Promise<T[]> {
    return this.repository.find(filter, options);
  }

  public async getById(id: string, options?: QueryOptions): Promise<T> {
    const item = await this.repository.findById(id, options);
    if (!item) {
      throw new NotFoundError(`Resource with ID '${id}' was not found`);
    }
    return item;
  }

  public async getBySlugOrId(slugOrId: string, options?: QueryOptions): Promise<T> {
    if ((this.repository as any).findBySlug) {
      const bySlug = await (this.repository as any).findBySlug(slugOrId, options);
      if (bySlug) return bySlug;
    }
    const list = await this.getAll({ slug: slugOrId }, options);
    if (list && list.length > 0) return list[0];
    return this.getById(slugOrId, options);
  }

  public async getPaginated(
    params: PaginationParams,
    filter: Record<string, unknown> = {},
    options?: QueryOptions
  ): Promise<PaginatedResult<T>> {
    return this.repository.paginate(params, filter, options);
  }

  public async create(data: Partial<T>): Promise<T> {
    const created = await this.repository.create(data);
    const title = (created as any).title || (created as any).name || (created as any).slug || 'Entity';
    const resourceName = this.constructor.name.replace('Service', '') || 'Resource';
    auditService.log({
      action: 'CREATE',
      actor: 'admin',
      resource: resourceName,
      details: { id: created.id, title },
    }).catch(() => {});
    return created;
  }

  public async update(id: string, data: Partial<T>): Promise<T> {
    const existing = await this.getById(id); // Throws NotFoundError if missing
    const updated = await this.repository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Failed to update resource with ID '${id}'`);
    }
    const title = (updated as any).title || (updated as any).name || (existing as any).title || (existing as any).name || id;
    const resourceName = this.constructor.name.replace('Service', '') || 'Resource';
    auditService.log({
      action: 'UPDATE',
      actor: 'admin',
      resource: resourceName,
      details: { id, title },
    }).catch(() => {});
    return updated;
  }

  public async delete(id: string): Promise<void> {
    const resourceName = this.constructor.name.replace('Service', '') || 'Resource';
    auditService.log({
      action: 'DELETE',
      actor: 'admin',
      resource: resourceName,
      details: { id },
    }).catch(() => {});
    await this.repository.delete(id);
  }
}
