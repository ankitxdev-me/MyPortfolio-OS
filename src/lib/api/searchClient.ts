import { httpClient } from '../http/httpClient';
import type { SearchResultItemDTO, ApiResponse, RequestOptions } from '../types/api.types';

export class SearchClient {
  public async query(term: string, type?: string, limit = 10, options?: RequestOptions): Promise<ApiResponse<SearchResultItemDTO[]>> {
    const params = new URLSearchParams({ q: term, limit: String(limit) });
    if (type) params.append('type', type);

    return httpClient.get<SearchResultItemDTO[]>(`/search?${params.toString()}`, options);
  }

  public async getRelated(slug: string, type: string, limit = 3, options?: RequestOptions): Promise<ApiResponse<SearchResultItemDTO[]>> {
    return httpClient.get<SearchResultItemDTO[]>(`/search/related?slug=${slug}&type=${type}&limit=${limit}`, options);
  }
}

export const searchClient = new SearchClient();
