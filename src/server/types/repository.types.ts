import type { PaginationParams, PaginationMeta } from './pagination.types';

export interface QueryOptions {
  select?: string[];
  populate?: string[];
  sort?: Record<string, 1 | -1>;
  lean?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface IBaseRepository<T> {
  find(filter?: Record<string, unknown>, options?: QueryOptions): Promise<T[]>;
  findById(id: string, options?: QueryOptions): Promise<T | null>;
  findOne(filter: Record<string, unknown>, options?: QueryOptions): Promise<T | null>;
  create(item: Partial<T>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(filter?: Record<string, unknown>): Promise<number>;
  paginate(params: PaginationParams, filter?: Record<string, unknown>, options?: QueryOptions): Promise<PaginatedResult<T>>;
}
