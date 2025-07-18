import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
  HubConnectionState,
} from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  severity: 'low' | 'critical' | 'out_of_stock';
  timestamp: string;
}

interface ProductUpdate {
  id: string;
  name: string;
  stockQuantity: number;
  price: number;
  isActive: boolean;
  lastModified: string;
}

interface NotificationMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  userId?: string;
}

type EventCallback<T> = (data: T) => void;

class SignalRService {
  private connection: HubConnection | null = null;
  private baseURL = this.getBaseURL();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  private getBaseURL(): string {
    if (process.env.API_BASE_URL) {
      return process.env.API_BASE_URL.replace('/api', '');
    }

    if (__DEV__) {
      if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5131';
      } else if (Platform.OS === 'ios') {
        return 'http://localhost:5131';
      } else if (Platform.OS === 'web') {
        return 'http://localhost:5131';
      }
    }

    return 'https://your-production-domain.com';
  }

  private productUpdateListeners: EventCallback<ProductUpdate>[] = [];
  private stockAlertListeners: EventCallback<StockAlert>[] = [];
  private notificationListeners: EventCallback<NotificationMessage>[] = [];
  private connectionStateListeners: EventCallback<HubConnectionState>[] = [];

  async startConnection(): Promise<void> {
    if (
      this.isConnecting ||
      this.connection?.state === HubConnectionState.Connected
    ) {
      return;
    }

    this.isConnecting = true;

    try {
      const token = await AsyncStorage.getItem('authToken');

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(
          '🔗 SignalR connecting to:',
          `${this.baseURL}/stockflowhub`
        );
        // eslint-disable-next-line no-console
        console.log('📱 Platform:', Platform.OS);
      }

      this.connection = new HubConnectionBuilder()
        .withUrl(`${this.baseURL}/stockflowhub`, {
          accessTokenFactory: () => token || '',
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            const delay = Math.min(
              2000 * Math.pow(2, retryContext.previousRetryCount),
              30000
            );
            // eslint-disable-next-line no-console
            console.log(
              `SignalR reconnecting in ${delay}ms (attempt ${retryContext.previousRetryCount + 1})`
            );
            return delay;
          },
        })
        .configureLogging(LogLevel.Information)
        .build();

      this.setupConnectionHandlers();

      this.setupEventHandlers();

      await this.connection.start();
      // eslint-disable-next-line no-console
      console.log('✅ SignalR Connected successfully');
      this.reconnectAttempts = 0;
      this.notifyConnectionStateListeners(HubConnectionState.Connected);

      if (token) {
        await this.joinUserGroup();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ SignalR Connection Error:', error);
      this.notifyConnectionStateListeners(HubConnectionState.Disconnected);
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  private setupConnectionHandlers(): void {
    if (!this.connection) return;

    this.connection.onclose(error => {
      // eslint-disable-next-line no-console
      console.log('🔌 SignalR Connection closed', error);
      this.notifyConnectionStateListeners(HubConnectionState.Disconnected);
    });

    this.connection.onreconnecting(error => {
      // eslint-disable-next-line no-console
      console.log('🔄 SignalR Reconnecting...', error);
      this.notifyConnectionStateListeners(HubConnectionState.Reconnecting);
    });

    this.connection.onreconnected(connectionId => {
      // eslint-disable-next-line no-console
      console.log('✅ SignalR Reconnected with ID:', connectionId);
      this.notifyConnectionStateListeners(HubConnectionState.Connected);
      
      this.joinUserGroup();
    });
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    this.connection.on('ProductUpdated', (product: ProductUpdate) => {
      // eslint-disable-next-line no-console
      console.log('📦 Product updated:', product);
      this.productUpdateListeners.forEach(listener => listener(product));
    });

    this.connection.on('StockAlert', (alert: StockAlert) => {
      // eslint-disable-next-line no-console
      console.log('⚠️ Stock alert:', alert);
      this.stockAlertListeners.forEach(listener => listener(alert));
    });

    this.connection.on(
      'NotificationReceived',
      (notification: NotificationMessage) => {
        // eslint-disable-next-line no-console
        console.log('🔔 Notification received:', notification);
        this.notificationListeners.forEach(listener => listener(notification));
      }
    );

    this.connection.on('InventoryUpdated', (data: any) => {
      // eslint-disable-next-line no-console
      console.log('📊 Inventory updated:', data);
    });

    this.connection.on(
      'UserNotification',
      (notification: NotificationMessage) => {
        // eslint-disable-next-line no-console
        console.log('👤 User notification:', notification);
        this.notificationListeners.forEach(listener => listener(notification));
      }
    );
  }

  private async joinUserGroup(): Promise<void> {
    if (
      !this.connection ||
      this.connection.state !== HubConnectionState.Connected
    ) {
      return;
    }

    try {
      await this.connection.invoke('JoinUserGroup');
      // eslint-disable-next-line no-console
      console.log('👥 Joined user-specific group');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Failed to join user group:', error);
    }
  }

  async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        // eslint-disable-next-line no-console
        console.log('🛑 SignalR Connection stopped');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Error stopping SignalR connection:', error);
      } finally {
        this.connection = null;
        this.notifyConnectionStateListeners(HubConnectionState.Disconnected);
      }
    }
  }

  onProductUpdate(callback: EventCallback<ProductUpdate>): () => void {
    this.productUpdateListeners.push(callback);
    return () => {
      const index = this.productUpdateListeners.indexOf(callback);
      if (index > -1) {
        this.productUpdateListeners.splice(index, 1);
      }
    };
  }

  onStockAlert(callback: EventCallback<StockAlert>): () => void {
    this.stockAlertListeners.push(callback);
    return () => {
      const index = this.stockAlertListeners.indexOf(callback);
      if (index > -1) {
        this.stockAlertListeners.splice(index, 1);
      }
    };
  }

  onNotification(callback: EventCallback<NotificationMessage>): () => void {
    this.notificationListeners.push(callback);
    return () => {
      const index = this.notificationListeners.indexOf(callback);
      if (index > -1) {
        this.notificationListeners.splice(index, 1);
      }
    };
  }

  onConnectionStateChange(
    callback: EventCallback<HubConnectionState>
  ): () => void {
    this.connectionStateListeners.push(callback);
    return () => {
      const index = this.connectionStateListeners.indexOf(callback);
      if (index > -1) {
        this.connectionStateListeners.splice(index, 1);
      }
    };
  }

  private notifyConnectionStateListeners(state: HubConnectionState): void {
    this.connectionStateListeners.forEach(listener => listener(state));
  }

  async subscribeToProduct(productId: string): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      try {
        await this.connection.invoke('SubscribeToProduct', productId);
        // eslint-disable-next-line no-console
        console.log(`📦 Subscribed to product updates: ${productId}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Failed to subscribe to product:', error);
      }
    }
  }

  async unsubscribeFromProduct(productId: string): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      try {
        await this.connection.invoke('UnsubscribeFromProduct', productId);
        // eslint-disable-next-line no-console
        console.log(`📦 Unsubscribed from product updates: ${productId}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Failed to unsubscribe from product:', error);
      }
    }
  }

  async requestStockUpdate(productId: string): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      try {
        await this.connection.invoke('RequestStockUpdate', productId);
        // eslint-disable-next-line no-console
        console.log(`📊 Requested stock update for: ${productId}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Failed to request stock update:', error);
      }
    }
  }

  getConnectionState(): HubConnectionState {
    return this.connection?.state || HubConnectionState.Disconnected;
  }

  isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }

  getConnectionId(): string | null {
    return this.connection?.connectionId || null;
  }

  updateBaseURL(newBaseURL: string): void {
    this.baseURL = newBaseURL;
  }

  removeAllListeners(): void {
    this.productUpdateListeners = [];
    this.stockAlertListeners = [];
    this.notificationListeners = [];
    this.connectionStateListeners = [];
  }
}

export default new SignalRService();
export type { StockAlert, ProductUpdate, NotificationMessage };
export { HubConnectionState };
