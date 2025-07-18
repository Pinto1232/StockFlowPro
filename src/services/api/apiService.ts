

import {
  getCurrentConfig,
  getBaseURL,
  getPlatformConfig,
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  PLATFORM_INFO,
} from '../config';

export { getCurrentConfig, getBaseURL, getPlatformConfig, PLATFORM_INFO };
export { API_ENDPOINTS as ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES };

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  status: number;
  message: string;
  errors?: string[];
  code?: string;
}

export interface RequestConfig {
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  enableLogging?: boolean;
}
