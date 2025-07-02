import { Platform } from 'react-native';

export interface SqlServerDatabaseConfig {
  connectionString: string;
  host: string;
  database: string;
  trustedConnection: boolean;
  trustServerCertificate: boolean;
  multipleActiveResultSets: boolean;
}

// Environment variables with fallbacks
const getEnvVar = (key: string, defaultValue = ''): string => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

const getBooleanEnvVar = (key: string, defaultValue = false): boolean => {
  const value = getEnvVar(key);
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};

// Database configuration
export const databaseConfig: SqlServerDatabaseConfig = {
  connectionString: getEnvVar(
    'DATABASE_CONNECTION_STRING',
    'Server=localhost;Database=StockFlowProDB;Trusted_Connection=true;TrustServerCertificate=true;MultipleActiveResultSets=true;'
  ),
  host: getEnvVar('DATABASE_HOST', 'localhost'),
  database: getEnvVar('DATABASE_NAME', 'StockFlowProDB'),
  trustedConnection: getBooleanEnvVar('DATABASE_TRUSTED_CONNECTION', true),
  trustServerCertificate: getBooleanEnvVar('DATABASE_TRUST_SERVER_CERTIFICATE', true),
  multipleActiveResultSets: getBooleanEnvVar('DATABASE_MULTIPLE_ACTIVE_RESULT_SETS', true),
};

// Platform-specific database configuration
export const getDatabaseConfig = (): SqlServerDatabaseConfig => {
  if (Platform.OS === 'web') {
    // For web platform, we might need to use HTTP API calls to a backend
    // that handles the SQL Server connection
    return {
      ...databaseConfig,
      // Web-specific adjustments if needed
    };
  } else {
    // For mobile platforms (iOS/Android)
    // Direct SQL Server connection might not be possible
    // Consider using a backend API or local database like SQLite
    return {
      ...databaseConfig,
      // Mobile-specific adjustments if needed
    };
  }
};

// Connection string builder for different platforms
export const buildConnectionString = (config: SqlServerDatabaseConfig): string => {
  const parts = [
    `Server=${config.host}`,
    `Database=${config.database}`,
  ];

  if (config.trustedConnection) {
    parts.push('Trusted_Connection=true');
  }

  if (config.trustServerCertificate) {
    parts.push('TrustServerCertificate=true');
  }

  if (config.multipleActiveResultSets) {
    parts.push('MultipleActiveResultSets=true');
  }

  return parts.join(';') + ';';
};

// Validate database configuration
export const validateDatabaseConfig = (config: SqlServerDatabaseConfig): boolean => {
  return !!(config.host && config.database);
};

export default databaseConfig;