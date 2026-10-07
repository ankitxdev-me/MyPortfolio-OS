import { BaseClient } from './baseClient';
import type { ApiResponse, RequestOptions } from '../types/api.types';

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export class ContactClient extends BaseClient<ContactMessageItem> {
  constructor() {
    super('/contact');
  }

  public async getMessages(
    params?: { status?: string; page?: number; limit?: number },
    options?: RequestOptions
  ): Promise<ApiResponse<ContactMessageItem[]>> {
    const queryParts: string[] = [];
    if (params?.status) queryParts.push(`status=${encodeURIComponent(params.status)}`);
    if (params?.page) queryParts.push(`page=${params.page}`);
    if (params?.limit) queryParts.push(`limit=${params.limit}`);
    const qs = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    return this.http.get<ContactMessageItem[]>(`/contact${qs}`, options);
  }

  public async updateStatus(
    id: string,
    status: 'unread' | 'read' | 'replied' | 'archived',
    options?: RequestOptions
  ): Promise<ApiResponse<ContactMessageItem>> {
    return this.http.patch<ContactMessageItem>(`/contact/${id}`, { status }, options);
  }

  public async markAllAsRead(options?: RequestOptions): Promise<ApiResponse<null>> {
    return this.http.patch<null>('/contact', { action: 'markAllRead' }, options);
  }

  public async deleteMessage(id: string, options?: RequestOptions): Promise<ApiResponse<null>> {
    return this.http.delete<null>(`/contact/${id}`, options);
  }
}

export const contactClient = new ContactClient();
