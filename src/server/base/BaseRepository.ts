import type {
  IBaseRepository,
  QueryOptions,
  PaginatedResult,
} from '../types/repository.types';
import type { PaginationParams } from '../types/pagination.types';
import { normalizePaginationParams, buildPaginationMeta, calculatePaginationOffset } from '../utils/pagination';

export abstract class BaseRepository<T extends { id: string }> implements IBaseRepository<T> {
  protected items: T[] = [];

  public async find(filter: Record<string, unknown> = {}, _options?: QueryOptions): Promise<T[]> {
    if (Object.keys(filter).length === 0) return [...this.items];
    return this.items.filter((item) =>
      Object.entries(filter).every(([key, val]) => (item as Record<string, unknown>)[key] === val)
    );
  }

  public async findById(id: string, _options?: QueryOptions): Promise<T | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? { ...item } : null;
  }

  public async findOne(filter: Record<string, unknown>, _options?: QueryOptions): Promise<T | null> {
    const results = await this.find(filter, _options);
    return results.length > 0 ? { ...results[0] } : null;
  }

  public async create(item: Partial<T>): Promise<T> {
    const newId = item.id || `id_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const createdItem = {
      ...item,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as T;

    this.items.push(createdItem);
    return { ...createdItem };
  }

  public async update(id: string, item: Partial<T>): Promise<T | null> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...this.items[index],
      ...item,
      updatedAt: new Date(),
    };

    this.items[index] = updatedItem;
    return { ...updatedItem };
  }

  public async delete(id: string): Promise<boolean> {
    const initialLength = this.items.length;
    this.items = this.items.filter((i) => i.id !== id);
    return this.items.length < initialLength;
  }

  public async count(filter: Record<string, unknown> = {}): Promise<number> {
    const results = await this.find(filter);
    return results.length;
  }

  public async paginate(
    params: PaginationParams,
    filter: Record<string, unknown> = {},
    options?: QueryOptions
  ): Promise<PaginatedResult<T>> {
    const normalized = normalizePaginationParams(params);
    const allFiltered = await this.find(filter, options);
    const totalItems = allFiltered.length;
    const offset = calculatePaginationOffset(normalized.page, normalized.limit);
    const data = allFiltered.slice(offset, offset + normalized.limit);

    return {
      data,
      meta: buildPaginationMeta(totalItems, normalized.page, normalized.limit),
    };
  }
}
