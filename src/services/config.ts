// StockFlow Pro Mobile App Configuration
import { Platform } from 'react-native';

// Environment types
export type Environment = 'development' | 'staging' | 'production';
export type PlatformOS = 'android' | 'ios' | 'web' | 'windows' | 'macos' | 'default';

// Configuration interfaces
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableLogging: boolean;
}

export interface PlatformConfigs {
  android: ApiConfig;
  ios: ApiConfig;
  web: ApiConfig;
  windows?: ApiConfig;
  macos?: ApiConfig;
  default: ApiConfig;
}

export interface EnvironmentConfig {
  development: PlatformConfigs;
  staging: PlatformConfigs;
  production: PlatformConfigs;
}

// Base URLs from the web application
export const BASE_URLS = {
  development: {
    api: 'http://localhost:5131/api',
    web: 'http://localhost:5131', // Alternative: https://localhost:7181
  },
  staging: {
    api: 'https://staging-api.stockflowpro.com/api',
    web: 'https://staging.stockflowpro.com',
  },
  production: {
    api: 'https://api.stockflowpro.com/api',
    web: 'https://stockflowpro.com',
  },
} as const;

// Platform-specific URL adjustments for mobile
const getPlatformSpecificURL = (baseUrl: string, platform: PlatformOS): string => {
  // For development localhost URLs, adjust for Android emulator
  if (baseUrl.includes('localhost') && platform === 'android') {
    return baseUrl.replace('localhost', '10.0.2.2');
  }
  return baseUrl;
};

// Main configuration object
export const APP_CONFIG: EnvironmentConfig = {
  // Development configuration
  development: {
    android: {
      baseURL: getPlatformSpecificURL(BASE_URLS.development.api, 'android'),
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableLogging: true,
    },
    ios: {
      baseURL: BASE_URLS.development.api,
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableLogging: true,
    },
    web: {
      baseURL: BASE_URLS.development.api,
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableLogging: true,
    },
    windows: {
      baseURL: BASE_URLS.development.api,
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableLogging: true,
    },
    macos: {
      baseURL: BASE_URLS.development.api,
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableLogging: true,
    },
    default: {
      baseURL: BASE_URLS.development.api,
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableLogging: true,
    },
  },

  // Staging configuration
  staging: {
    android: {
      baseURL: BASE_URLS.staging.api,
      timeout: 15000,
      retryAttempts: 2,
      retryDelay: 1500,
      enableLogging: true,
    },
    ios: {
      baseURL: BASE_URLS.staging.api,
      timeout: 15000,
      retryAttempts: 2,
      retryDelay: 1500,
      enableLogging: true,
    },
    web: {
      baseURL: BASE_URLS.staging.api,
      timeout: 15000,
      retryAttempts: 2,
      retryDelay: 1500,
      enableLogging: true,
    },
    windows: {
      baseURL: BASE_URLS.staging.api,
      timeout: 15000,
      retryAttempts: 2,
      retryDelay: 1500,
      enableLogging: true,
    },
    macos: {
      baseURL: BASE_URLS.staging.api,
      timeout: 15000,
      retryAttempts: 2,
      retryDelay: 1500,
      enableLogging: true,
    },
    default: {
      baseURL: BASE_URLS.staging.api,
      timeout: 15000,
      retryAttempts: 2,
      retryDelay: 1500,
      enableLogging: true,
    },
  },

  // Production configuration
  production: {
    android: {
      baseURL: BASE_URLS.production.api,
      timeout: 20000,
      retryAttempts: 2,
      retryDelay: 2000,
      enableLogging: false,
    },
    ios: {
      baseURL: BASE_URLS.production.api,
      timeout: 20000,
      retryAttempts: 2,
      retryDelay: 2000,
      enableLogging: false,
    },
    web: {
      baseURL: BASE_URLS.production.api,
      timeout: 20000,
      retryAttempts: 2,
      retryDelay: 2000,
      enableLogging: false,
    },
    windows: {
      baseURL: BASE_URLS.production.api,
      timeout: 20000,
      retryAttempts: 2,
      retryDelay: 2000,
      enableLogging: false,
    },
    macos: {
      baseURL: BASE_URLS.production.api,
      timeout: 20000,
      retryAttempts: 2,
      retryDelay: 2000,
      enableLogging: false,
    },
    default: {
      baseURL: BASE_URLS.production.api,
      timeout: 20000,
      retryAttempts: 2,
      retryDelay: 2000,
      enableLogging: false,
    },
  },
};

// API Endpoints - consistent with web application
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    session: '/auth/session',
    refresh: '/auth/refresh',
    check: '/auth/check',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  // Users
  users: {
    list: '/users',
    byId: (id: string | number) => `/users/${id}`,
    byEmail: (email: string) => `/users/by-email/${encodeURIComponent(email)}`,
    search: '/users/search',
    create: '/users',
    update: (id: string | number) => `/users/${id}`,
    delete: (id: string | number) => `/users/${id}`,
    profile: '/users/profile',
    updateProfile: '/users/profile',
  },

  // Products
  products: {
    list: '/products',
    byId: (id: string | number) => `/products/${id}`,
    search: '/products/search',
    dashboardStats: '/products/dashboard-stats',
    create: '/products',
    update: (id: string | number) => `/products/${id}`,
    updateStock: (id: string | number) => `/products/${id}/stock`,
    delete: (id: string | number) => `/products/${id}`,
    categories: '/products/categories',
    lowStock: '/products/low-stock',
  },

  // Inventory
  inventory: {
    list: '/inventory',
    byId: (id: string | number) => `/inventory/${id}`,
    movements: '/inventory/movements',
    adjustments: '/inventory/adjustments',
    reports: '/inventory/reports',
  },

  // Orders
  orders: {
    list: '/orders',
    byId: (id: string | number) => `/orders/${id}`,
    create: '/orders',
    update: (id: string | number) => `/orders/${id}`,
    cancel: (id: string | number) => `/orders/${id}/cancel`,
    fulfill: (id: string | number) => `/orders/${id}/fulfill`,
  },

  // Reports
  reports: {
    sales: '/reports/sales',
    inventory: '/reports/inventory',
    financial: '/reports/financial',
    export: '/reports/export',
  },

  // Health & System
  health: {
    basic: '/health',
    detailed: '/health/detailed',
    version: '/health/version',
  },

  // Notifications
  notifications: {
    list: '/notifications',
    markRead: (id: string | number) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read',
    settings: '/notifications/settings',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  OFFLINE_ERROR: 'You are currently offline. Please check your connection.',
} as const;

// Helper function to get platform key
const getPlatformKey = (platformOS: typeof Platform.OS): keyof PlatformConfigs => {
  switch (platformOS) {
    case 'android':
      return 'android';
    case 'ios':
      return 'ios';
    case 'web':
      return 'web';
    case 'windows':
      return 'windows';
    case 'macos':
      return 'macos';
    default:
      return 'default';
  }
};

// Environment detection
export const getCurrentEnvironment = (): Environment => {
  // Check for environment variables first
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }
  if (process.env.NODE_ENV === 'staging') {
    return 'staging';
  }
  
  // Default to development in debug mode
  return __DEV__ ? 'development' : 'production';
};

// Get current configuration based on environment and platform
export const getCurrentConfig = (): ApiConfig => {
  const environment = getCurrentEnvironment();
  const platformKey = getPlatformKey(Platform.OS);
  
  return APP_CONFIG[environment][platformKey] || APP_CONFIG[environment].default;
};

// Helper functions
export const getBaseURL = (): string => {
  return getCurrentConfig().baseURL;
};

export const getPlatformConfig = (
  platform: PlatformOS | null = null,
  environment: Environment | null = null
): ApiConfig => {
  const targetEnvironment = environment || getCurrentEnvironment();
  const targetPlatform = platform || getPlatformKey(Platform.OS);
  
  return APP_CONFIG[targetEnvironment][targetPlatform] || APP_CONFIG[targetEnvironment].default;
};

// Platform utilities
export const PLATFORM_INFO = {
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  isWeb: Platform.OS === 'web',
  isWindows: Platform.OS === 'windows',
  isMacOS: Platform.OS === 'macos',
  current: Platform.OS,
  
  // Get appropriate localhost URL for current platform
  getLocalhostURL: (port: number = 5131, path: string = '/api'): string => {
    const baseUrl = Platform.OS === 'android' 
      ? `http://10.0.2.2:${port}` 
      : `http://localhost:${port}`;
    return `${baseUrl}${path}`;
  },
} as const;

// Security configuration
export const SECURITY_CONFIG = {
  // API Key should be stored securely (e.g., in Keychain/Keystore)
  // Never hardcode sensitive data here
  enableSSLPinning: getCurrentEnvironment() === 'production',
  enableCertificateValidation: true,
  maxRetryAttempts: 3,
  tokenRefreshThreshold: 300000, // 5 minutes in milliseconds
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  enableOfflineMode: true,
  enablePushNotifications: true,
  enableBiometricAuth: true,
  enableAnalytics: getCurrentEnvironment() !== 'development',
  enableCrashReporting: getCurrentEnvironment() === 'production',
} as const;