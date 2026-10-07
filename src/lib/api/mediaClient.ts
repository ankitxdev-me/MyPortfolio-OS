import { httpClient } from '../http/httpClient';
import type { MediaFileDTO, ApiResponse, ApiPaginatedResponse, QueryOptions, RequestOptions } from '../types/api.types';
import { buildQueryString } from '../utils/query';

export class MediaClient {
  public async getFiles(options?: QueryOptions): Promise<ApiPaginatedResponse<MediaFileDTO>> {
    const queryStr = buildQueryString(options);
    const res = await httpClient.get<any>(`/media${queryStr}`, options);
    return res as unknown as ApiPaginatedResponse<MediaFileDTO>;
  }

  public async upload(file: File, folder = 'general', altText?: string, options?: RequestOptions): Promise<ApiResponse<MediaFileDTO>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (altText) formData.append('altText', altText);

    return httpClient.upload<MediaFileDTO>('/media/upload', formData, options);
  }

  public async delete(id: string, options?: RequestOptions): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`/media/${id}`, options);
  }

  public async replace(id: string, file: File, options?: RequestOptions): Promise<ApiResponse<MediaFileDTO>> {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.upload<MediaFileDTO>(`/media/${id}/replace`, formData, options);
  }
}

export const mediaClient = new MediaClient();
