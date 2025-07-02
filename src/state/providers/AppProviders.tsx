import React from 'react';
import { QueryProvider } from './QueryProvider';
import { NetworkRequestContextProvider } from '../../services/network/NetworkRequestContextProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <NetworkRequestContextProvider>
        {children}
      </NetworkRequestContextProvider>
    </QueryProvider>
  );
};