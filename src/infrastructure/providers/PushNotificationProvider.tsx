import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';

interface PushNotificationContextType {
  token: string | null;
  isPermissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
  scheduleLocalNotification: (
    title: string,
    body: string,
    delay?: number
  ) => void;
  clearAllNotifications: () => void;
}

const PushNotificationContext = createContext<
  PushNotificationContextType | undefined
>(undefined);

interface PushNotificationProviderProps {
  children: React.ReactNode;
}

export const PushNotificationProvider: React.FC<
  PushNotificationProviderProps
> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    initializePushNotifications();
  }, []);

  const initializePushNotifications = async () => {
    try {

      const hasPermission = await requestPermission();
      if (hasPermission) {
        
        const fcmToken = await getFCMToken();
        setToken(fcmToken);

        setupNotificationHandlers();
      }
    } catch (error) {
      
      setIsPermissionGranted(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {

      if (Platform.OS === 'ios') {
        
        setIsPermissionGranted(true);
        return true;
      } else {
        
        setIsPermissionGranted(true);
        return true;
      }
    } catch (error) {
      
      setIsPermissionGranted(false);
      return false;
    }
  };

  const getFCMToken = async (): Promise<string> => {
    try {

      await new Promise(resolve => setTimeout(resolve, 100));

      const fcmToken = 'placeholder-fcm-token';
      return fcmToken;
    } catch (error) {
      
      return '';
    }
  };

  const setupNotificationHandlers = () => {

  };

  const scheduleLocalNotification = (
    title: string,
    body: string,
    delay: number = 0
  ) => {

    if (delay === 0) {
      
      Alert.alert(title, body);
    }
  };

  const clearAllNotifications = () => {

  };

  const value: PushNotificationContextType = {
    token,
    isPermissionGranted,
    requestPermission,
    scheduleLocalNotification,
    clearAllNotifications,
  };

  return (
    <PushNotificationContext.Provider value={value}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotifications = (): PushNotificationContextType => {
  const context = useContext(PushNotificationContext);
  if (!context) {
    throw new Error(
      'usePushNotifications must be used within PushNotificationProvider'
    );
  }
  return context;
};
