import type { ApiResponse, RequestOptions } from '../types/api.types';
import { ErrorHandler } from '../errors/errorHandler';
import { NetworkError } from '../errors/apiError';
import { apiCache } from '../cache/apiCache';
import { InterceptorManager } from './interceptors';

export class HttpClient {
  private baseUrl: string;
  public readonly interceptors: InterceptorManager;

  constructor(baseUrl = '/api/v1') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.interceptors = new InterceptorManager();
    this.setupDefaultInterceptors();
  }

  private setupDefaultInterceptors(): void {
    // Default Request Interceptor: Attach standard JSON headers
    this.interceptors.useRequest((config) => {
      const headers = new Headers(config.headers || {});
      if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
      }
      return { ...config, headers };
    });
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new NetworkError(`Request timed out after ${timeoutMs}ms`);
      }
      throw err;
    }
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const isServer = typeof window === 'undefined';
    const serverHost = (typeof process !== 'undefined' && process.env?.SITE_URL) ? process.env.SITE_URL : 'http://localhost:4321';
    const resolvedBase = isServer ? `${serverHost}${this.baseUrl}` : this.baseUrl;
    const url = endpoint.startsWith('http') ? endpoint : `${resolvedBase}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const method = (options.method || 'GET').toUpperCase();
    const useCache = options.useCache ?? method === 'GET';
    const cacheKey = `${method}:${url}`;

    if (useCache) {
      const cached = apiCache.get<ApiResponse<T>>(cacheKey);
      if (cached) return cached;
    }

    const {
      timeout = 10000,
      retries = 2,
      retryDelay = 500,
      skipAuth = false,
      useCache: _,
      cacheTtl,
      ...fetchOptions
    } = options;

    let init: RequestInit = {
      credentials: 'same-origin',
      ...fetchOptions,
      method,
    };

    init = await this.interceptors.runRequestInterceptors(init, url);

    let attempt = 0;
    let lastError: any;

    while (attempt <= retries) {
      try {
        let response = await this.fetchWithTimeout(url, init, timeout);
        response = await this.interceptors.runResponseInterceptors(response);

        if (!response.ok) {
          throw await ErrorHandler.fromResponse(response);
        }

        const data: ApiResponse<T> = await response.json();

        if (useCache && data.success) {
          apiCache.set(cacheKey, data, cacheTtl);
        }

        return data;
      } catch (err: any) {
        lastError = ErrorHandler.handle(err);

        // Don't retry client errors (4xx) except potential 429 rate limit
        if (lastError.statusCode >= 400 && lastError.statusCode < 500 && lastError.statusCode !== 429) {
          throw lastError;
        }

        attempt++;
        if (attempt <= retries) {
          const delay = retryDelay * Math.pow(2, attempt - 1);
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }

    throw lastError;
  }

  public async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const headers = new Headers(options?.headers || {});

    if (!isFormData && body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const headers = new Headers(options?.headers || {});

    if (!isFormData && body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  }

  public async patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const headers = new Headers(options?.headers || {});
    if (body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public async upload<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    });
  }
}

export const httpClient = new HttpClient('/api/v1');
