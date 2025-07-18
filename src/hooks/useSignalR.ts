import { useEffect, useState, useCallback, useRef } from 'react';
import { HubConnectionState } from '@microsoft/signalr';
import signalRService, {
  type StockAlert,
  type ProductUpdate,
  type NotificationMessage,
} from '../services/signalRService';
import { useAuth } from '../contexts/AuthContext';

export const useSignalRConnection = () => {
  const [connectionState, setConnectionState] = useState<HubConnectionState>(
    signalRService.getConnectionState()
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const { isAuthenticated } = useAuth();
  const connectionAttempted = useRef(false);

  const connect = useCallback(async () => {
    if (isConnecting || connectionState === HubConnectionState.Connected) {
      return;
    }

    setIsConnecting(true);
    try {
      await signalRService.startConnection();
    } catch (error) {
      
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error('Failed to connect to SignalR:', error);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, connectionState]);

  const disconnect = useCallback(async () => {
    await signalRService.stopConnection();
  }, []);

  useEffect(() => {
    
    const unsubscribe =
      signalRService.onConnectionStateChange(setConnectionState);

    if (isAuthenticated && !connectionAttempted.current) {
      connectionAttempted.current = true;
      connect();
    }

    if (
      !isAuthenticated &&
      connectionState !== HubConnectionState.Disconnected
    ) {
      disconnect();
      connectionAttempted.current = false;
    }

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, connect, disconnect, connectionState]);

  return {
    connectionState,
    isConnected: connectionState === HubConnectionState.Connected,
    isConnecting,
    connect,
    disconnect,
  };
};

export const useProductUpdates = (productId?: string) => {
  const [latestUpdate, setLatestUpdate] = useState<ProductUpdate | null>(null);
  const [updates, setUpdates] = useState<ProductUpdate[]>([]);
  const { isConnected } = useSignalRConnection();

  useEffect(() => {
    const unsubscribe = signalRService.onProductUpdate(update => {
      
      if (!productId || update.id === productId) {
        setLatestUpdate(update);
        setUpdates(prev => [update, ...prev.slice(0, 9)]); 
      }
    });

    if (productId && isConnected) {
      signalRService.subscribeToProduct(productId);
    }

    return () => {
      unsubscribe();
      
      if (productId && isConnected) {
        signalRService.unsubscribeFromProduct(productId);
      }
    };
  }, [productId, isConnected]);

  const requestUpdate = useCallback((id: string) => {
    signalRService.requestStockUpdate(id);
  }, []);

  return {
    latestUpdate,
    updates,
    requestUpdate,
  };
};

export const useStockAlerts = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = signalRService.onStockAlert(alert => {
      setAlerts(prev => {
        const newAlerts = [alert, ...prev];
        
        return newAlerts.slice(0, 50);
      });
      setUnreadCount(prev => prev + 1);
    });

    return unsubscribe;
  }, []);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setUnreadCount(0);
  }, []);

  return {
    alerts,
    unreadCount,
    markAsRead,
    clearAlerts,
  };
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = signalRService.onNotification(notification => {
      setNotifications(prev => {
        const newNotifications = [notification, ...prev];
        
        return newNotifications.slice(0, 100);
      });
      setUnreadCount(prev => prev + 1);
    });

    return unsubscribe;
  }, []);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications,
    removeNotification,
  };
};

export const useRealTimeUpdates = (productId?: string) => {
  const connection = useSignalRConnection();
  const productUpdates = useProductUpdates(productId);
  const stockAlerts = useStockAlerts();
  const notifications = useNotifications();

  return {
    connection,
    productUpdates,
    stockAlerts,
    notifications,
  };
};
