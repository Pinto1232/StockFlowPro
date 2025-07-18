
import { getCurrentEnvironment, getCurrentConfig, getBaseURL, type Environment } from './config';

export interface EnvironmentInfo {
  name: Environment;
  displayName: string;
  baseURL: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
}

export const getEnvironmentInfo = (): EnvironmentInfo => {
  const environment = getCurrentEnvironment();
  const config = getCurrentConfig();
  
  return {
    name: environment,
    displayName: environment.charAt(0).toUpperCase() + environment.slice(1),
    baseURL: config.baseURL,
    isProduction: environment === 'production',
    isDevelopment: environment === 'development',
    isStaging: environment === 'staging',
  };
};

export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private currentEnvironment: Environment;

  private constructor() {
    this.currentEnvironment = getCurrentEnvironment();
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  getCurrentEnvironment(): Environment {
    return this.currentEnvironment;
  }

  getEnvironmentInfo(): EnvironmentInfo {
    return getEnvironmentInfo();
  }

  switchEnvironment(environment: Environment): void {
    if (__DEV__) {
      this.currentEnvironment = environment;
      // eslint-disable-next-line no-console
      console.log(`[EnvironmentManager] Switched to ${environment} environment`);
      // eslint-disable-next-line no-console
      console.log(`[EnvironmentManager] Base URL: ${getBaseURL()}`);
    } else {
      // eslint-disable-next-line no-console
      console.warn('[EnvironmentManager] Environment switching is only available in development mode');
    }
  }

  getAvailableEnvironments(): Environment[] {
    return ['development', 'staging', 'production'];
  }

  canUseFeature(feature: string): boolean {
    const env = this.getEnvironmentInfo();
    
    switch (feature) {
      case 'debug_logging':
        return env.isDevelopment || env.isStaging;
      case 'crash_reporting':
        return env.isProduction;
      case 'analytics':
        return env.isStaging || env.isProduction;
      case 'environment_switching':
        return env.isDevelopment;
      case 'ssl_pinning':
        return env.isProduction;
      default:
        return true;
    }
  }
}

export const environmentManager = EnvironmentManager.getInstance();

export const isProduction = (): boolean => getEnvironmentInfo().isProduction;
export const isDevelopment = (): boolean => getEnvironmentInfo().isDevelopment;
export const isStaging = (): boolean => getEnvironmentInfo().isStaging;

export const envLog = (message: string, data?: any): void => {
  if (isDevelopment() || isStaging()) {
    // eslint-disable-next-line no-console
    console.log(`[${getEnvironmentInfo().displayName}] ${message}`, data || '');
  }
};

export const envWarn = (message: string, data?: any): void => {
  if (isDevelopment() || isStaging()) {
    // eslint-disable-next-line no-console
    console.warn(`[${getEnvironmentInfo().displayName}] ${message}`, data || '');
  }
};

export const envError = (message: string, error?: any): void => {
  // eslint-disable-next-line no-console
  console.error(`[${getEnvironmentInfo().displayName}] ${message}`, error || '');
};