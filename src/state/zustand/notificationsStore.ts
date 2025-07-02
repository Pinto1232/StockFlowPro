import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationsActions {
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  clearError: () => void;
}

type NotificationsStore = NotificationsState & NotificationsActions;

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const useNotificationsStore = create<NotificationsStore>()(
  devtools(
    (set, _get) => ({
      ...initialState,
      
      fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock notifications
          const mockNotifications: Notification[] = [
            {
              id: '1',
              title: 'Auction Ending Soon',
              message: 'Your watched auction ends in 1 hour',
              type: 'warning',
              timestamp: new Date().toISOString(),
              isRead: false,
            },
            {
              id: '2',
              title: 'Bid Successful',
              message: 'Your bid of $150 was successful',
              type: 'success',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              isRead: true,
            },
          ];
          
          const unreadCount = mockNotifications.filter(n => !n.isRead).length;
          
          set({
            isLoading: false,
            notifications: mockNotifications,
            unreadCount,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: 'Failed to fetch notifications',
          });
        }
      },
      
      addNotification: (notification: Notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
      })),
      
      markAsRead: (id: string) => set((state) => {
        const notifications = state.notifications.map(notification =>
          notification.id === id && !notification.isRead
            ? { ...notification, isRead: true }
            : notification
        );
        
        const unreadCount = notifications.filter(n => !n.isRead).length;
        
        return { notifications, unreadCount };
      }),
      
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true,
        })),
        unreadCount: 0,
      })),
      
      removeNotification: (id: string) => set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        const notifications = state.notifications.filter(n => n.id !== id);
        const unreadCount = notification && !notification.isRead 
          ? state.unreadCount - 1 
          : state.unreadCount;
        
        return { notifications, unreadCount };
      }),
      
      clearAllNotifications: () => set({
        notifications: [],
        unreadCount: 0,
      }),
      
      clearError: () => set({ error: null }),
    }),
    { name: 'notifications-store' }
  )
);