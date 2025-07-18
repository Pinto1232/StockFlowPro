
import { Platform } from 'react-native';

export type Environment = 'development' | 'staging' | 'production';
export type PlatformOS = 'android' | 'ios' | 'web' | 'windows' | 'macos' | 'default';

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

export const BASE_URLS = {
  development: {
    api: 'http://localhost:5131/api',
    web: 'http://localhost:5131', 
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

const getPlatformSpecificURL = (baseUrl: string, platform: PlatformOS): string => {
  
  if (baseUrl.includes('localhost') && platform === 'android') {
    return baseUrl.replace('localhost', '10.0.2.2');
  }
  return baseUrl;
};

export const APP_CONFIG: EnvironmentConfig = {
  
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

export const API_ENDPOINTS = {
  
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

  inventory: {
    list: '/inventory',
    byId: (id: string | number) => `/inventory/${id}`,
    movements: '/inventory/movements',
    adjustments: '/inventory/adjustments',
    reports: '/inventory/reports',
  },

  orders: {
    list: '/orders',
    byId: (id: string | number) => `/orders/${id}`,
    create: '/orders',
    update: (id: string | number) => `/orders/${id}`,
    cancel: (id: string | number) => `/orders/${id}/cancel`,
    fulfill: (id: string | number) => `/orders/${id}/fulfill`,
  },

  reports: {
    sales: '/reports/sales',
    inventory: '/reports/inventory',
    financial: '/reports/financial',
    export: '/reports/export',
  },

  health: {
    basic: '/health',
    detailed: '/health/detailed',
    version: '/health/version',
  },

  notifications: {
    list: '/notifications',
    markRead: (id: string | number) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read',
    settings: '/notifications/settings',
  },
} as const;

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

export const getCurrentEnvironment = (): Environment => {
  
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }
  if (process.env.NODE_ENV === 'staging') {
    return 'staging';
  }

  return __DEV__ ? 'development' : 'production';
};

export const getCurrentConfig = (): ApiConfig => {
  const environment = getCurrentEnvironment();
  const platformKey = getPlatformKey(Platform.OS);
  
  return APP_CONFIG[environment][platformKey] || APP_CONFIG[environment].default;
};

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

export const PLATFORM_INFO = {
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  isWeb: Platform.OS === 'web',
  isWindows: Platform.OS === 'windows',
  isMacOS: Platform.OS === 'macos',
  current: Platform.OS,

  getLocalhostURL: (port: number = 5131, path: string = '/api'): string => {
    const baseUrl = Platform.OS === 'android' 
      ? `http://10.0.2.2:${port}` 
      : `http://localhost:${port}`;
    return `${baseUrl}${path}`;
  },
} as const;

export const SECURITY_CONFIG = {

  enableSSLPinning: getCurrentEnvironment() === 'production',
  enableCertificateValidation: true,
  maxRetryAttempts: 3,
  tokenRefreshThreshold: 300000, 
} as const;

export const FEATURE_FLAGS = {
  enableOfflineMode: true,
  enablePushNotifications: true,
  enableBiometricAuth: true,
  enableAnalytics: getCurrentEnvironment() !== 'development',
  enableCrashReporting: getCurrentEnvironment() === 'production',
} as const;