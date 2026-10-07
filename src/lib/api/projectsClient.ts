import { BaseClient } from './baseClient';
import type { ProjectDTO, ApiResponse, QueryOptions, RequestOptions } from '../types/api.types';
import { buildQueryString } from '../utils/query';

export class ProjectsClient extends BaseClient<ProjectDTO> {
  constructor() {
    super('/projects');
  }

  public async getFeatured(limit = 3, options?: RequestOptions): Promise<ApiResponse<ProjectDTO[]>> {
    return this.http.get<ProjectDTO[]>(`/projects/featured?limit=${limit}`, options);
  }

  public async getByCategory(category: string, options?: QueryOptions): Promise<ApiResponse<ProjectDTO[]>> {
    const queryStr = buildQueryString(options);
    return this.http.get<ProjectDTO[]>(`/projects/category/${category}${queryStr}`, options);
  }

  public async archive(id: string, options?: RequestOptions): Promise<ApiResponse<ProjectDTO>> {
    return this.http.post<ProjectDTO>(`/projects/${id}/archive`, {}, options);
  }

  public async publish(id: string, options?: RequestOptions): Promise<ApiResponse<ProjectDTO>> {
    return this.http.post<ProjectDTO>(`/projects/${id}/publish`, {}, options);
  }

  public async duplicate(id: string, options?: RequestOptions): Promise<ApiResponse<ProjectDTO>> {
    return this.http.post<ProjectDTO>(`/projects/${id}/duplicate`, {}, options);
  }
}

export const projectsClient = new ProjectsClient();
