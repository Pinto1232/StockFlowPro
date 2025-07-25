
export interface AppConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  enableLogging: boolean;
}

export type Environment = 'development' | 'staging' | 'production';

const BASE_URLS = {
  development: 'http://localhost:5131/api',
  staging: 'https://staging-api.stockflowpro.com/api',
  production: 'https://api.stockflowpro.com/api',
} as const;

const WEB_URLS = {
  development: ['https://localhost:7181', 'http://localhost:5131'],
  staging: 'https://staging.stockflowpro.com',
  production: 'https://stockflowpro.com',
} as const;

const CONFIGS: Record<Environment, AppConfig> = {
  development: {
    baseURL: BASE_URLS.development,
    timeout: 10000, 
    retryAttempts: 3,
    enableLogging: true,
  },
  staging: {
    baseURL: BASE_URLS.staging,
    timeout: 15000, 
    retryAttempts: 2,
    enableLogging: true,
  },
  production: {
    baseURL: BASE_URLS.production,
    timeout: 20000, 
    retryAttempts: 1,
    enableLogging: false,
  },
};

export const getCurrentEnvironment = (): Environment => {
  
  // For now, we'll default to development
  const env = process.env.NODE_ENV as Environment;
  return env && env in CONFIGS ? env : 'development';
};

export const getCurrentConfig = (): AppConfig => {
  const environment = getCurrentEnvironment();
  return CONFIGS[environment];
};

export const getBaseURL = (): string => {
  return getCurrentConfig().baseURL;
};

export const API_ENDPOINTS = {
  
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    register: '/auth/register',
    profile: '/auth/profile',
    session: '/auth/session',
    verify: '/auth/verify',
  },

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

  dashboard: {
    stats: '/dashboard/stats',
    overview: '/dashboard/overview',
  },

  inventory: {
    movements: '/inventory/movements',
    reports: '/inventory/reports',
    updateStock: (id: string) => `/inventory/products/${id}/stock`,
  },

  users: {
    list: '/users',
    create: '/users',
    byId: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },

  health: {
    basic: '/health',
    detailed: '/health/detailed',
    version: '/version',
  },
} as const;

export { BASE_URLS, WEB_URLS, CONFIGS };

export default {
  getCurrentEnvironment,
  getCurrentConfig,
  getBaseURL,
  API_ENDPOINTS,
  BASE_URLS,
  WEB_URLS,
  CONFIGS,
};