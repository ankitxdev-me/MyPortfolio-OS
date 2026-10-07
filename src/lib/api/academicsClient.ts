import { BaseClient } from './baseClient';
import type { AcademicSemesterDTO, ApiResponse, RequestOptions } from '../types/api.types';

export class AcademicsClient extends BaseClient<AcademicSemesterDTO> {
  constructor() {
    super('/academics');
  }

  public async getSummary(options?: RequestOptions): Promise<ApiResponse<{ overallGpa: number; totalCredits: number; completedSemesters: number }>> {
    return this.http.get<{ overallGpa: number; totalCredits: number; completedSemesters: number }>('/academics/summary', options);
  }
}

export const academicsClient = new AcademicsClient();
