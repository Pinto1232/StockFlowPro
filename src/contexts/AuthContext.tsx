import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if we have stored user data (cookie-based auth doesn't need tokens)
      const storedUser = await AsyncStorage.getItem('user');
      
      if (!storedUser) {
        setIsLoading(false);
        return;
      }

      try {
        // Parse stored user data
        const parsedUser = JSON.parse(storedUser);
        
        // Try to verify session by making an authenticated request
        // Since your backend uses cookies, we'll try a simple API call to check if still authenticated
        try {
          const response = await apiService.healthCheck();
          
          if (response && response.success) {
            // Session is still valid, restore user
            setUser(parsedUser);
            // eslint-disable-next-line no-console
            console.log('[AuthContext] Health check passed, user session restored');
          } else {
            // Session expired, clear stored data
            // eslint-disable-next-line no-console
            console.warn('[AuthContext] Health check failed, clearing auth data:', response);
            await clearAuthData();
          }
        } catch (healthError) {
          // eslint-disable-next-line no-console
          console.warn('[AuthContext] Health check failed, but keeping user session for development:', healthError);
          
          // In development, if health check fails but we have stored user data,
          // we'll keep the user logged in to avoid constant re-authentication
          // This is helpful when the backend server might not be running
          setUser(parsedUser);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Session check failed, clearing auth data:', error);
        await clearAuthData();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Auth check failed:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = async () => {
    setUser(null);
    // Clear any stored auth tokens (though we're using cookies)
    apiService.clearAuthTokens();
    await AsyncStorage.removeItem('user');
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Debug: Log which service is being used
      // eslint-disable-next-line no-console
      console.log('[AuthContext] Using API service:', apiService.constructor.name);
      // eslint-disable-next-line no-console
      console.log('[AuthContext] API base URL:', apiService.getBaseUrl());
      // eslint-disable-next-line no-console
      console.log('[AuthContext] Login credentials:', { username, password: '***' });
      
      // Call your backend's login endpoint
      const response = await apiService.login({ username, password });
      
      if (response.success && response.data) {
        // Extract user data from response
        const userData = response.data.user || response.data;
        
        // Create user object with expected structure
        const user: User = {
          id: userData.id || userData.userId || '1',
          name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
          email: userData.email,
          role: userData.role || 'User',
          firstName: userData.firstName,
          lastName: userData.lastName,
        };
        
        setUser(user);
        
        // Store user data locally (cookies are handled automatically by the browser/HTTP client)
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        return true;
      }
      
      return false;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API to invalidate session on server
      await apiService.logout();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout error:', error);
      // Continue with local logout even if server call fails
    } finally {
      await clearAuthData();
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (!user) return;
      
      // Since your backend uses cookies, we can't easily refresh user data
      // without a dedicated endpoint. For now, we'll keep the existing user data.
      // You could add a GET /api/auth/user endpoint to your backend for this.
      // eslint-disable-next-line no-console
      console.log('User refresh not implemented - backend uses cookie auth');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to refresh user data:', error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export type { User, AuthContextType };