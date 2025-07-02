import React, { createContext, useContext, useState, useEffect } from 'react';

interface EnvironmentConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  enableLogging: boolean;
  enableAnalytics: boolean;
  tenant: string;
  version: string;
  buildNumber: string;
}

interface EnvironmentContextType {
  config: EnvironmentConfig;
  updateConfig: (newConfig: Partial<EnvironmentConfig>) => void;
  isDevelopment: boolean;
  isProduction: boolean;
  isStaging: boolean;
}

const defaultConfig: EnvironmentConfig = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.example.com',
  environment: (process.env.EXPO_PUBLIC_ENVIRONMENT as any) || 'development',
  enableLogging: process.env.EXPO_PUBLIC_ENABLE_LOGGING === 'true',
  enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
  tenant: process.env.EXPO_PUBLIC_TENANT || 'default',
  version: process.env.EXPO_PUBLIC_VERSION || '1.0.0',
  buildNumber: process.env.EXPO_PUBLIC_BUILD_NUMBER || '1',
};

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(
  undefined
);

interface EnvironmentProviderProps {
  children: React.ReactNode;
}

export const EnvironmentProvider: React.FC<EnvironmentProviderProps> = ({
  children,
}) => {
  const [config, setConfig] = useState<EnvironmentConfig>(defaultConfig);

  useEffect(() => {
    // Log environment configuration in development
    if (config.enableLogging && config.environment === 'development') {
      // eslint-disable-next-line no-console
      // eslint-disable-next-line no-console
      console.log('Environment Configuration:', config);
    }
  }, [config]);

  const updateConfig = (newConfig: Partial<EnvironmentConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const isDevelopment = config.environment === 'development';
  const isProduction = config.environment === 'production';
  const isStaging = config.environment === 'staging';

  const value: EnvironmentContextType = {
    config,
    updateConfig,
    isDevelopment,
    isProduction,
    isStaging,
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = (): EnvironmentContextType => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment must be used within EnvironmentProvider');
  }
  return context;
};
