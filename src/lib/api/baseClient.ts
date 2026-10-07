import { httpClient, HttpClient } from '../http/httpClient';
import type { ApiResponse, ApiPaginatedResponse, QueryOptions, RequestOptions } from '../types/api.types';
import { buildQueryString } from '../utils/query';
import { apiCache } from '../cache/apiCache';

export abstract class BaseClient<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  protected http: HttpClient;
  protected basePath: string;

  constructor(basePath: string, client = httpClient) {
    this.basePath = basePath.replace(/\/$/, '');
    this.http = client;
  }

  public async getAll(options?: QueryOptions): Promise<ApiPaginatedResponse<T>> {
    const queryStr = buildQueryString(options);
    const res = await this.http.get<any>(`${this.basePath}${queryStr}`, options);
    return res as unknown as ApiPaginatedResponse<T>;
  }

  public async getBySlugOrId(slugOrId: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.http.get<T>(`${this.basePath}/${slugOrId}`, options);
  }

  public async create(data: CreateDTO, options?: RequestOptions): Promise<ApiResponse<T>> {
    const res = await this.http.post<T>(this.basePath, data, options);
    apiCache.clear();
    return res;
  }

  public async update(slugOrId: string, data: UpdateDTO, options?: RequestOptions): Promise<ApiResponse<T>> {
    const res = await this.http.put<T>(`${this.basePath}/${slugOrId}`, data, options);
    apiCache.clear();
    return res;
  }

  public async delete(slugOrId: string, options?: RequestOptions): Promise<ApiResponse<void>> {
    const res = await this.http.delete<void>(`${this.basePath}/${slugOrId}`, options);
    apiCache.clear();
    return res;
  }
}
