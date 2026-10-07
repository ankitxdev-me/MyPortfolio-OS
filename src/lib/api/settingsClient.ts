import { httpClient } from '../http/httpClient';
import type { SiteSettingsDTO, AuditLogDTO, ApiResponse, ApiPaginatedResponse, QueryOptions, RequestOptions } from '../types/api.types';
import { buildQueryString } from '../utils/query';

export class SettingsClient {
  public async getSettings(options?: RequestOptions): Promise<ApiResponse<SiteSettingsDTO>> {
    return httpClient.get<SiteSettingsDTO>('/settings', options);
  }

  public async updateSettings(settings: Partial<SiteSettingsDTO>, options?: RequestOptions): Promise<ApiResponse<SiteSettingsDTO>> {
    return httpClient.put<SiteSettingsDTO>('/settings', settings, options);
  }

  public async getAuditLogs(options?: QueryOptions): Promise<ApiPaginatedResponse<AuditLogDTO>> {
    const queryStr = buildQueryString(options);
    const res = await httpClient.get<any>(`/audit${queryStr}`, options);
    return res as unknown as ApiPaginatedResponse<AuditLogDTO>;
  }
}

export const settingsClient = new SettingsClient();
