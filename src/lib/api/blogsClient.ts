import { BaseClient } from './baseClient';
import type { BlogDTO, ApiResponse, QueryOptions, RequestOptions } from '../types/api.types';
import { buildQueryString } from '../utils/query';

export class BlogsClient extends BaseClient<BlogDTO> {
  constructor() {
    super('/blogs');
  }

  public async getPublished(options?: QueryOptions): Promise<ApiResponse<BlogDTO[]>> {
    const queryStr = buildQueryString({ ...options, filter: { ...options?.filter, published: true } });
    return this.http.get<BlogDTO[]>(`/blogs${queryStr}`, options);
  }

  public async getRecent(limit = 5, options?: RequestOptions): Promise<ApiResponse<BlogDTO[]>> {
    return this.http.get<BlogDTO[]>(`/blogs/recent?limit=${limit}`, options);
  }

  public async incrementLikes(slug: string, options?: RequestOptions): Promise<ApiResponse<{ likes: number }>> {
    return this.http.post<{ likes: number }>(`/blogs/${slug}/like`, {}, options);
  }

  public async archive(id: string, options?: RequestOptions): Promise<ApiResponse<BlogDTO>> {
    return this.http.post<BlogDTO>(`/blogs/${id}/archive`, {}, options);
  }

  public async publish(id: string, options?: RequestOptions): Promise<ApiResponse<BlogDTO>> {
    return this.http.post<BlogDTO>(`/blogs/${id}/publish`, {}, options);
  }

  public async duplicate(id: string, options?: RequestOptions): Promise<ApiResponse<BlogDTO>> {
    return this.http.post<BlogDTO>(`/blogs/${id}/duplicate`, {}, options);
  }
}

export const blogsClient = new BlogsClient();
