import React, { createContext, useContext, useState, useEffect } from 'react';

interface NetworkConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retryAttempts: number;
  retryDelay: number;
}

interface NetworkRequestContextType {
  config: NetworkConfig;
  updateConfig: (newConfig: Partial<NetworkConfig>) => void;
  setAuthToken: (token: string | null) => void;
  isOnline: boolean;
}

const defaultConfig: NetworkConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  retryAttempts: 3,
  retryDelay: 1000,
};

const NetworkRequestContext = createContext<NetworkRequestContextType | undefined>(undefined);

interface NetworkRequestContextProviderProps {
  children: React.ReactNode;
}

export const NetworkRequestContextProvider: React.FC<NetworkRequestContextProviderProps> = ({ 
  children 
}) => {
  const [config, setConfig] = useState<NetworkConfig>(defaultConfig);
  const [isOnline, setIsOnline] = useState(true);

  const updateConfig = (newConfig: Partial<NetworkConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const setAuthToken = (token: string | null) => {
    setConfig(prev => ({
      ...prev,
      headers: {
        ...prev.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }));
  };

  useEffect(() => {
    // In a real app, you would use NetInfo to monitor network status
    // import NetInfo from '@react-native-async-storage/async-storage';
    
    const checkNetworkStatus = () => {
      // Placeholder for network status check
      setIsOnline(true);
    };

    checkNetworkStatus();
    
    // Set up network status listener
    const interval = setInterval(checkNetworkStatus, 5000);
    
    return () => {
      try {
        clearInterval(interval);
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, []);

  const value: NetworkRequestContextType = {
    config,
    updateConfig,
    setAuthToken,
    isOnline,
  };

  return (
    <NetworkRequestContext.Provider value={value}>
      {children}
    </NetworkRequestContext.Provider>
  );
};

export const useNetworkRequest = (): NetworkRequestContextType => {
  const context = useContext(NetworkRequestContext);
  if (!context) {
    throw new Error('useNetworkRequest must be used within NetworkRequestContextProvider');
  }
  return context;
};