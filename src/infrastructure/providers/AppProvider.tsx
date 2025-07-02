import React from 'react';
import { AppProviders } from '../../state/providers/AppProviders';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PushNotificationProvider } from './PushNotificationProvider';
import { EnvironmentProvider } from './EnvironmentProvider';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <EnvironmentProvider>
        <AppProviders>
          <PushNotificationProvider>
            {children}
          </PushNotificationProvider>
        </AppProviders>
      </EnvironmentProvider>
    </SafeAreaProvider>
  );
};