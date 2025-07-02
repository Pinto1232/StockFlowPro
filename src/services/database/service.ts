import { Platform } from 'react-native';
import { getDatabaseConfig, validateDatabaseConfig } from './config';

// Simple logger utility to replace console statements
const logger = {
  info: (message: string, ...args: any[]) => {
    // In production, you might want to use a proper logging service
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`[DB INFO] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    // In production, you might want to use a proper logging service
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error(`[DB ERROR] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    // In production, you might want to use a proper logging service
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn(`[DB WARN] ${message}`, ...args);
    }
  }
};

export interface DatabaseService {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<number>;
  isConnected(): boolean;
}

class WebDatabaseService implements DatabaseService {
  private connected = false;
  private apiBaseUrl: string;

  constructor() {
    // For web, we'll use HTTP API calls to a backend that handles SQL Server
    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api';
  }

  async connect(): Promise<boolean> {
    try {
      // Test connection by making a health check API call
      const response = await fetch(`${this.apiBaseUrl}/database/health`);
      this.connected = response.ok;
      return this.connected;
    } catch (error) {
      logger.error('Database connection failed:', error);
      this.connected = false;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/database/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      logger.error('Database query failed:', error);
      throw error;
    }
  }

  async execute(sql: string, params?: any[]): Promise<number> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/database/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      });

      if (!response.ok) {
        throw new Error(`Execute failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.rowsAffected || 0;
    } catch (error) {
      logger.error('Database execute failed:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

class MobileDatabaseService implements DatabaseService {
  private connected = false;
  private apiBaseUrl: string;

  constructor() {
    // For mobile, we'll also use HTTP API calls to a backend
    // Direct SQL Server connection is not recommended on mobile
    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api';
  }

  async connect(): Promise<boolean> {
    try {
      // Test connection by making a health check API call
      const response = await fetch(`${this.apiBaseUrl}/database/health`);
      this.connected = response.ok;
      return this.connected;
    } catch (error) {
      logger.error('Database connection failed:', error);
      this.connected = false;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/database/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      logger.error('Database query failed:', error);
      throw error;
    }
  }

  async execute(sql: string, params?: any[]): Promise<number> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/database/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      });

      if (!response.ok) {
        throw new Error(`Execute failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.rowsAffected || 0;
    } catch (error) {
      logger.error('Database execute failed:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Factory function to create the appropriate database service
export const createDatabaseService = (): DatabaseService => {
  const config = getDatabaseConfig();
  
  if (!validateDatabaseConfig(config)) {
    throw new Error('Invalid database configuration');
  }

  if (Platform.OS === 'web') {
    return new WebDatabaseService();
  } else {
    return new MobileDatabaseService();
  }
};

// Singleton instance
let databaseServiceInstance: DatabaseService | null = null;

export const getDatabaseService = (): DatabaseService => {
  if (!databaseServiceInstance) {
    databaseServiceInstance = createDatabaseService();
  }
  return databaseServiceInstance;
};

// Initialize database connection
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    const service = getDatabaseService();
    const connected = await service.connect();
    
    if (connected) {
      logger.info('Database connected successfully');
    } else {
      logger.error('Failed to connect to database');
    }
    
    return connected;
  } catch (error) {
    logger.error('Database initialization failed:', error);
    return false;
  }
};

export default getDatabaseService;