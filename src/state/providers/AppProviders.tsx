import React from 'react';
import { QueryProvider } from './QueryProvider';
import { NetworkRequestContextProvider } from '../../services/network/NetworkRequestContextProvider';
import { AuthProvider } from '../../contexts/AuthContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <NetworkRequestContextProvider>
          {children}
        </NetworkRequestContextProvider>
      </AuthProvider>
    </QueryProvider>
  );
};