import type { BaseService } from './BaseService';
import { successResponse, paginatedResponse } from '../api/response';
import { HTTP_STATUS } from '../config/constants';
import type { PaginationParams } from '../types/pagination.types';

export abstract class BaseController<T extends { id: string }> {
  constructor(protected readonly service: BaseService<T>) {}

  public async handleGetAll(filter: Record<string, unknown> = {}): Promise<Response> {
    const items = await this.service.getAll(filter);
    return successResponse(items, 'Resource list retrieved successfully');
  }

  public async handleGetPaginated(
    params: PaginationParams,
    filter: Record<string, unknown> = {}
  ): Promise<Response> {
    const result = await this.service.getPaginated(params, filter);
    return paginatedResponse(result.data, result.meta);
  }

  public async handleGetById(id: string): Promise<Response> {
    const item = await this.service.getById(id);
    return successResponse(item, 'Resource retrieved successfully');
  }

  public async handleCreate(data: Partial<T>): Promise<Response> {
    const created = await this.service.create(data);
    return successResponse(created, 'Resource created successfully', undefined, HTTP_STATUS.CREATED);
  }

  public async handleUpdate(id: string, data: Partial<T>): Promise<Response> {
    const updated = await this.service.update(id, data);
    return successResponse(updated, 'Resource updated successfully');
  }

  public async handleDelete(id: string): Promise<Response> {
    await this.service.delete(id);
    return successResponse({ id }, 'Resource deleted successfully');
  }
}
