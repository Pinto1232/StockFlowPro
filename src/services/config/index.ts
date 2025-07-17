// Configuration file for API base URLs and environment settings
export interface AppConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  enableLogging: boolean;
}

export type Environment = 'development' | 'staging' | 'production';

// Base URLs for different environments
const BASE_URLS = {
  development: 'http://localhost:5131/api',
  staging: 'https://staging-api.stockflowpro.com/api',
  production: 'https://api.stockflowpro.com/api',
} as const;

// Web application URLs (for reference)
const WEB_URLS = {
  development: ['https://localhost:7181', 'http://localhost:5131'],
  staging: 'https://staging.stockflowpro.com',
  production: 'https://stockflowpro.com',
} as const;

// Default configuration for each environment
const CONFIGS: Record<Environment, AppConfig> = {
  development: {
    baseURL: BASE_URLS.development,
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
    enableLogging: true,
  },
  staging: {
    baseURL: BASE_URLS.staging,
    timeout: 15000, // 15 seconds
    retryAttempts: 2,
    enableLogging: true,
  },
  production: {
    baseURL: BASE_URLS.production,
    timeout: 20000, // 20 seconds
    retryAttempts: 1,
    enableLogging: false,
  },
};

// Get current environment from environment variables or default to development
export const getCurrentEnvironment = (): Environment => {
  // In React Native, you might use react-native-config or similar
  // For now, we'll default to development
  const env = process.env.NODE_ENV as Environment;
  return env && env in CONFIGS ? env : 'development';
};

// Get configuration for current environment
export const getCurrentConfig = (): AppConfig => {
  const environment = getCurrentEnvironment();
  return CONFIGS[environment];
};

// Get base URL for current environment
export const getBaseURL = (): string => {
  return getCurrentConfig().baseURL;
};

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    register: '/auth/register',
    profile: '/auth/profile',
    session: '/auth/session',
    verify: '/auth/verify',
  },
  
  // Products
  products: {
    list: '/products',
    create: '/products',
    byId: (id: string) => `/products/${id}`,
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    search: '/products/search',
    lowStock: '/products/low-stock',
    updateStock: (id: string) => `/products/${id}/stock`,
    dashboardStats: '/dashboard/stats',
  },
  
  // Dashboard
  dashboard: {
    stats: '/dashboard/stats',
    overview: '/dashboard/overview',
  },
  
  // Inventory
  inventory: {
    movements: '/inventory/movements',
    reports: '/inventory/reports',
    updateStock: (id: string) => `/inventory/products/${id}/stock`,
  },
  
  // Users
  users: {
    list: '/users',
    create: '/users',
    byId: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  
  // Health
  health: {
    basic: '/health',
    detailed: '/health/detailed',
    version: '/version',
  },
} as const;

// Export all configurations for reference
export { BASE_URLS, WEB_URLS, CONFIGS };

// Default export
export default {
  getCurrentEnvironment,
  getCurrentConfig,
  getBaseURL,
  API_ENDPOINTS,
  BASE_URLS,
  WEB_URLS,
  CONFIGS,
};