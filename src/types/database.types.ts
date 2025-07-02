// Database configuration interface
export interface DatabaseConfig {
  API_BASE_URL?: string;
  API_TIMEOUT?: number;
  MONGODB_URI?: string;
  MONGODB_DB_NAME?: string;
  databaseName?: string;
}

// Database connection status
export interface DatabaseStatus {
  isConnected: boolean;
  connectionError?: string;
  lastConnectedAt?: Date;
}

// Generic database operation result
export interface DatabaseOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  affectedCount?: number;
}

// Database service interface (following Interface Segregation Principle)
export interface IDatabaseService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnectedToDatabase(): boolean;
  getDatabase(): any;
  getCollection(name: string): any;
}

// Environment configuration interface
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT?: number;
  API_BASE_URL?: string;
  API_TIMEOUT?: number;
  MONGODB_URI?: string;
  MONGODB_DB_NAME?: string;
}