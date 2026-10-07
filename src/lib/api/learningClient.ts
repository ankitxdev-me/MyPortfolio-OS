import { BaseClient } from './baseClient';
import type { CourseDTO, ApiResponse, RequestOptions } from '../types/api.types';

export class LearningClient extends BaseClient<CourseDTO> {
  constructor() {
    super('/learning');
  }

  public async getByStatus(status: 'completed' | 'in_progress' | 'planned', options?: RequestOptions): Promise<ApiResponse<CourseDTO[]>> {
    return this.http.get<CourseDTO[]>(`/learning?status=${status}`, options);
  }

  public async duplicate(id: string, options?: RequestOptions): Promise<ApiResponse<CourseDTO>> {
    return this.http.post<CourseDTO>(`/learning/${id}/duplicate`, {}, options);
  }
}

export const learningClient = new LearningClient();
