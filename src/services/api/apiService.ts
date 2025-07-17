// React Native API Service for StockFlow Pro
// Import configuration from the centralized config file
import {
  getCurrentConfig,
  getBaseURL,
  getPlatformConfig,
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  PLATFORM_INFO,
} from '../config';

// Re-export commonly used items for backward compatibility
export { getCurrentConfig, getBaseURL, getPlatformConfig, PLATFORM_INFO };
export { API_ENDPOINTS as ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES };

// Additional API service specific types and utilities
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
