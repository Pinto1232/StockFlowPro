import { useRef } from 'react';

export function createSingletonHook<T>(factory: () => T): () => T {
  let instance: T | null = null;
  
  return function useSingleton(): T {
    const ref = useRef<T | null>(null);
    
    if (!instance) {
      instance = factory();
    }
    
    if (!ref.current) {
      ref.current = instance;
    }
    
    return ref.current;
  };
}

interface GlobalAppState {
  isInitialized: boolean;
  lastActiveTime: Date;
  sessionId: string;
  deviceId: string;
}

const createGlobalAppState = (): GlobalAppState => ({
  isInitialized: false,
  lastActiveTime: new Date(),
  sessionId: Math.random().toString(36).substring(7),
  deviceId: Math.random().toString(36).substring(7),
});

export const useGlobalAppState = createSingletonHook(createGlobalAppState);

interface NetworkState {
  isOnline: boolean;
  connectionType: string;
  isSlowConnection: boolean;
  retryCount: number;
}

const createNetworkState = (): NetworkState => ({
  isOnline: true,
  connectionType: 'wifi',
  isSlowConnection: false,
  retryCount: 0,
});

export const useNetworkState = createSingletonHook(createNetworkState);

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
  user: any | null;
}

const createAuthState = (): AuthState => ({
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  expiresAt: null,
  user: null,
});

export const useAuthState = createSingletonHook(createAuthState);