import { httpClient } from '../http/httpClient';
import type { ApiResponse, RequestOptions } from '../types/api.types';
import type { DashboardOverviewData } from '@/server/services/dashboard.service';

export class DashboardClient {
  public async getOverview(options?: RequestOptions): Promise<ApiResponse<DashboardOverviewData>> {
    return httpClient.get<DashboardOverviewData>('/dashboard/overview', options);
  }
}

export const dashboardClient = new DashboardClient();
