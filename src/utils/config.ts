import { DatabaseConfig, EnvironmentConfig } from '../types';

// Configuration utility following Single Responsibility Principle
export class ConfigManager {
  private static instance: ConfigManager;
  private config: EnvironmentConfig | null = null;

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  // Load configuration from environment variables
  loadConfig(): EnvironmentConfig {
    if (this.config) {
      return this.config;
    }

    this.config = {
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
      MONGODB_URI: process.env['MONGODB_URI'] || 'mongodb://localhost:27017/neonapp',
      MONGODB_DB_NAME: process.env['MONGODB_DB_NAME'] || 'neonapp',
    };

    return this.config;
  }

  // Get database configuration
  getDatabaseConfig(): DatabaseConfig {
    const config = this.loadConfig();
    return {
      MONGODB_URI: config.MONGODB_URI,
      MONGODB_DB_NAME: config.MONGODB_DB_NAME,
    };
  }

  // Validate configuration
  validateConfig(): { isValid: boolean; errors: string[] } {
    const config = this.loadConfig();
    const errors: string[] = [];

    if (!config.MONGODB_URI) {
      errors.push('MONGODB_URI is required');
    }

    if (!config.MONGODB_DB_NAME) {
      errors.push('MONGODB_DB_NAME is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Get configuration value by key
  get<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K] {
    const config = this.loadConfig();
    return config[key];
  }
}