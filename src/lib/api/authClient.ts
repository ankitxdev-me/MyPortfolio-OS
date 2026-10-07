import { httpClient } from '../http/httpClient';
import type { ApiResponse, UserDTO, RequestOptions } from '../types/api.types';
import { apiCache } from '../cache/apiCache';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthSessionResponse {
  user: UserDTO;
  token: string;
  expiresAt: string;
  permissions: string[];
}

export class AuthClient {
  public async login(credentials: LoginRequest, options?: RequestOptions): Promise<ApiResponse<AuthSessionResponse>> {
    const res = await httpClient.post<AuthSessionResponse>('/auth/login', credentials, options);
    apiCache.clear();
    return res;
  }

  public async logout(options?: RequestOptions): Promise<ApiResponse<void>> {
    const res = await httpClient.post<void>('/auth/logout', {}, options);
    apiCache.clear();
    return res;
  }

  public async me(options?: RequestOptions): Promise<ApiResponse<UserDTO>> {
    return httpClient.get<UserDTO>('/auth/me', options);
  }

  public async validateSession(options?: RequestOptions): Promise<ApiResponse<{ valid: boolean; user?: UserDTO }>> {
    return httpClient.get<{ valid: boolean; user?: UserDTO }>('/auth/validate', options);
  }
}

export const authClient = new AuthClient();
