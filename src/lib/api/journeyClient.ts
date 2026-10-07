import { BaseClient } from './baseClient';
import type { MilestoneDTO, ApiResponse, RequestOptions } from '../types/api.types';

export class JourneyClient extends BaseClient<MilestoneDTO> {
  constructor() {
    super('/journey');
  }

  public async getByType(type: 'experience' | 'education' | 'achievement' | 'leadership', options?: RequestOptions): Promise<ApiResponse<MilestoneDTO[]>> {
    return this.http.get<MilestoneDTO[]>(`/journey?type=${type}`, options);
  }

  public async duplicate(id: string, options?: RequestOptions): Promise<ApiResponse<MilestoneDTO>> {
    return this.http.post<MilestoneDTO>(`/journey/${id}/duplicate`, {}, options);
  }
}

export const journeyClient = new JourneyClient();
