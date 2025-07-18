
import {
  getCurrentConfig,
  getBaseURL,
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  getCurrentEnvironment,
  type ApiConfig,
} from '../config';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  errors?: string[];
  success: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: string[];
  code?: string;
}

export interface RequestOptions {
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  enableLogging?: boolean;
  skipAuth?: boolean;
}

export class ApiClient {
  private config: ApiConfig;
  private baseURL: string;
  private authToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.config = getCurrentConfig();
    this.baseURL = getBaseURL();
  }

  setAuthTokens(accessToken: string, refreshToken?: string): void {
    this.authToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
  }

  clearAuthTokens(): void {
    this.authToken = null;
    this.refreshToken = null;
  }

  private getDefaultHeaders(skipAuth: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client-Platform': 'mobile',
      'X-Client-Version': '1.0.0', 
    };

    if (!skipAuth && this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private log(message: string, data?: any): void {
    if (this.config.enableLogging && getCurrentEnvironment() !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[ApiClient] ${message}`, data || '');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.config.timeout,
      retryAttempts = this.config.retryAttempts,
      retryDelay = this.config.retryDelay,
      headers: customHeaders = {},
      skipAuth = false,
      ...fetchOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      ...this.getDefaultHeaders(skipAuth),
      ...customHeaders,
    };

    const requestConfig: RequestInit = {
      ...fetchOptions,
      headers,
      
      credentials: 'include',
    };

    this.log(`Making request to: ${url}`, { 
      method: fetchOptions.method || 'GET', 
      headers,
      skipAuth: skipAuth,
      isDevelopment: getCurrentEnvironment() === 'development'
    });

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...requestConfig,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        this.log(`Response status: ${response.status}`);

        let responseData: any;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        if (response.ok) {
          return {
            data: responseData,
            status: response.status,
            message: responseData?.message,
            success: true,
          };
        }

        if (response.status === HTTP_STATUS.UNAUTHORIZED) {

          if (skipAuth) {
            this.log('Received 401 even with skipAuth=true, server requires authentication');
          } else {
            
            this.clearAuthTokens();
          }
          throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
        }

        const error: ApiError = {
          status: response.status,
          message: responseData?.message || this.getErrorMessage(response.status),
          errors: responseData?.errors,
          code: responseData?.code,
        };

        throw error;

      } catch (error: any) {
        lastError = error;
        
        // Don't retry on certain errors
        if (
          error.name === 'AbortError' ||
          error.status === HTTP_STATUS.UNAUTHORIZED ||
          error.status === HTTP_STATUS.FORBIDDEN ||
          error.status === HTTP_STATUS.NOT_FOUND ||
          attempt === retryAttempts
        ) {
          break;
        }

        this.log(`Request failed (attempt ${attempt + 1}/${retryAttempts + 1}):`, error.message);

        if (attempt < retryAttempts) {
          await this.sleep(retryDelay * (attempt + 1)); 
        }
      }
    }

    if (lastError) {
      if (lastError.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
      }
      throw lastError;
    }

    throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }

  private getErrorMessage(status: number): string {
    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case HTTP_STATUS.UNAUTHORIZED:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case HTTP_STATUS.FORBIDDEN:
        return ERROR_MESSAGES.FORBIDDEN;
      case HTTP_STATUS.NOT_FOUND:
        return ERROR_MESSAGES.NOT_FOUND;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.BAD_GATEWAY:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
      case HTTP_STATUS.GATEWAY_TIMEOUT:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async uploadFile<T>(
    endpoint: string,
    file: FormData,
    options?: Omit<RequestOptions, 'headers'>
  ): Promise<ApiResponse<T>> {
    const customHeaders = this.getDefaultHeaders(options?.skipAuth);
    
    delete customHeaders['Content-Type'];

    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: file,
      headers: customHeaders,
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get(API_ENDPOINTS.health.basic, { skipAuth: true });
      return response.success;
    } catch {
      return false;
    }
  }

  updateConfig(): void {
    this.config = getCurrentConfig();
    this.baseURL = getBaseURL();
    this.log('Configuration updated', { baseURL: this.baseURL });
  }
}

export const apiClient = new ApiClient();

export default apiClient;