import { BaseClient } from './baseClient';
import type { DetailedClientWork } from '@/data/freelanceData';
import type { FreelanceServiceDTO, FreelanceProjectDTO, ApiResponse, RequestOptions } from '../types/api.types';

export class FreelancingClient extends BaseClient<DetailedClientWork & { id: string }> {
  constructor() {
    super('/freelancing');
  }

  public async getServices(options?: RequestOptions): Promise<ApiResponse<FreelanceServiceDTO[]>> {
    return this.http.get<FreelanceServiceDTO[]>('/freelancing/services', options);
  }

  public async getServiceById(id: string, options?: RequestOptions): Promise<ApiResponse<FreelanceServiceDTO>> {
    return this.http.get<FreelanceServiceDTO>(`/freelancing/services/${id}`, options);
  }

  public async getProjects(options?: RequestOptions): Promise<ApiResponse<FreelanceProjectDTO[]>> {
    return this.http.get<FreelanceProjectDTO[]>('/freelancing/projects', options);
  }

  public async createInquiry(inquiryData: { name: string; email: string; serviceId?: string; message: string }, options?: RequestOptions): Promise<ApiResponse<{ inquiryId: string }>> {
    return this.http.post<{ inquiryId: string }>('/freelancing/inquire', inquiryData, options);
  }
}

export const freelancingClient = new FreelancingClient();
