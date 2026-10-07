export interface RequestInterceptor {
  (config: RequestInit, url: string): Promise<RequestInit> | RequestInit;
}

export interface ResponseInterceptor {
  (response: Response): Promise<Response> | Response;
}

export class InterceptorManager {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  public useRequest(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  public useResponse(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  public async runRequestInterceptors(config: RequestInit, url: string): Promise<RequestInit> {
    let currentConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      currentConfig = await interceptor(currentConfig, url);
    }
    return currentConfig;
  }

  public async runResponseInterceptors(response: Response): Promise<Response> {
    let currentResponse = response;
    for (const interceptor of this.responseInterceptors) {
      currentResponse = await interceptor(currentResponse);
    }
    return currentResponse;
  }
}
