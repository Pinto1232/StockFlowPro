// React Native API Configuration for StockFlow Pro
import { Platform } from 'react-native';

interface PlatformConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

interface EnvironmentConfig {
  android: PlatformConfig;
  ios: PlatformConfig;
  web: PlatformConfig;
  default: PlatformConfig;
}

interface ApiConfig {
  development: EnvironmentConfig;
  production: EnvironmentConfig;
}

export const API_CONFIG: ApiConfig = {
  // Development configuration
  development: {
    // Platform-specific base URLs for development
    android: {
      baseURL: 'http://10.0.2.2:5131', // Android emulator (updated port)
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
    },
    ios: {
      baseURL: 'http://localhost:5131', // iOS simulator (updated port)
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
    },
    web: {
      baseURL: 'http://localhost:5131', // Web development
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
    },
    // Default fallback
    default: {
      baseURL: 'http://localhost:5131',
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
    }
  },
  
  // Production configuration
  production: {
    // All platforms use the same production URL
    android: {
      baseURL: 'https://your-production-api.com',
      timeout: 15000,
      retryAttempts: 2,
      retryDelay: 2000,
    },
    ios: {
      baseURL: 'https://your-production-api.com',
      timeout: 15000,
      retryAttempts: 2,
      retryDelay: 2000,
    },
    web: {
      baseURL: 'https://your-production-api.com',
      timeout: 15000,
      retryAttempts: 2,
      retryDelay: 2000,
    },
    // Default fallback
    default: {
      baseURL: 'https://your-production-api.com',
      timeout: 15000,
      retryAttempts: 2,
      retryDelay: 2000,
    }
  }
};

export const ENDPOINTS = {
  // Authentication
  auth: {
    login: '/api/v2/auth/login',
    logout: '/api/v2/auth/logout',
    session: '/api/v2/auth/session',
    refresh: '/api/v2/auth/refresh',
    check: '/api/v2/auth/check',
  },
  
  // Users
  users: {
    list: '/api/users',
    byId: (id: string | number) => `/api/users/${id}`,
    byEmail: (email: string) => `/api/users/by-email/${email}`,
    search: '/api/users/search',
    create: '/api/users',
    update: (id: string | number) => `/api/users/${id}`,
    delete: (id: string | number) => `/api/users/${id}`,
  },
  
  // Products
  products: {
    list: '/api/products',
    byId: (id: string | number) => `/api/products/${id}`,
    search: '/api/products/search',
    dashboardStats: '/api/products/dashboard-stats',
    create: '/api/products',
    update: (id: string | number) => `/api/products/${id}`,
    updateStock: (id: string | number) => `/api/products/${id}/stock`,
    delete: (id: string | number) => `/api/products/${id}`,
  },
  
  // Health
  health: {
    basic: '/api/health',
    detailed: '/api/health/detailed',
    version: '/api/health/version',
  }
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Get current environment configuration based on platform
export const getCurrentConfig = (): PlatformConfig => {
  const isDevelopment = __DEV__;
  const environment: keyof ApiConfig = isDevelopment ? 'development' : 'production';
  
  // Detect platform
  let platform: keyof EnvironmentConfig = 'default';
  
  if (Platform.OS === 'android') {
    platform = 'android';
  } else if (Platform.OS === 'ios') {
    platform = 'ios';
  } else if (Platform.OS === 'web') {
    platform = 'web';
  }
  
  // Return platform-specific config or fallback to default
  return API_CONFIG[environment][platform] || API_CONFIG[environment].default;
};

// Helper function to get base URL for current platform
export const getBaseURL = (): string => {
  return getCurrentConfig().baseURL;
};

// Helper function to get platform-specific configuration
export const getPlatformConfig = (platform: keyof EnvironmentConfig | null = null): PlatformConfig => {
  const isDevelopment = __DEV__;
  const environment: keyof ApiConfig = isDevelopment ? 'development' : 'production';
  const targetPlatform: keyof EnvironmentConfig = platform || (Platform.OS as keyof EnvironmentConfig) || 'default';
  
  return API_CONFIG[environment][targetPlatform] || API_CONFIG[environment].default;
};

// Platform detection utilities
export const PLATFORM_INFO = {
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  isWeb: Platform.OS === 'web',
  current: Platform.OS,
  
  // Get appropriate localhost URL for current platform
  getLocalhostURL: (port = 5131) => {
    switch (Platform.OS) {
      case 'android':
        return `http://10.0.2.2:${port}`; // Android emulator
      case 'ios':
      case 'web':
      default:
        return `http://localhost:${port}`; // iOS simulator and web
    }
  }
};