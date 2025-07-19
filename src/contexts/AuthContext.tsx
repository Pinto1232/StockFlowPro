import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, RegisterData } from '../services/api';

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
  register: (registerData: RegisterData) => Promise<{ success: boolean; message?: string; errors?: string[] }>;
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
        
        const parsedUser = JSON.parse(storedUser);

        // Since your backend uses cookies, we'll try a simple API call to check if still authenticated
        try {
          const response = await apiService.healthCheck();
          
          if (response && response.success) {
            
            setUser(parsedUser);
            // eslint-disable-next-line no-console
            console.log('[AuthContext] Health check passed, user session restored');
          } else {
            
            // eslint-disable-next-line no-console
            console.warn('[AuthContext] Health check failed, but keeping user session for development:', response);
            // In development, keep the user logged in even if health check fails
            setUser(parsedUser);
          }
        } catch (healthError) {
          // eslint-disable-next-line no-console
          console.warn('[AuthContext] Health check failed, but keeping user session for development:', healthError);

          // In development, we'll keep the user logged in to avoid constant re-authentication
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
    
    await AsyncStorage.removeItem('hasLaunchedBefore');
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // eslint-disable-next-line no-console
      console.log('[AuthContext] Using API service:', apiService.constructor.name);
      // eslint-disable-next-line no-console
      console.log('[AuthContext] API base URL:', apiService.getBaseUrl());
      // eslint-disable-next-line no-console
      console.log('[AuthContext] Login credentials:', { username, password: '***' });
      
      // Call your backend's login endpoint
      const response = await apiService.login({ username, password });
      
      if (response.success && response.data) {
        
        const userData = response.data.user || response.data;

        const user: User = {
          id: userData.id || userData.userId || '1',
          name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
          email: userData.email,
          role: userData.role || 'User',
          firstName: userData.firstName,
          lastName: userData.lastName,
        };
        
        setUser(user);

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

      await apiService.logout();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout error:', error);
      
    } finally {
      await clearAuthData();
      setIsLoading(false);
    }
  };

  const register = async (registerData: RegisterData): Promise<{ success: boolean; message?: string; errors?: string[] }> => {
    try {
      // eslint-disable-next-line no-console
      console.log('[AuthContext] Registering user:', { ...registerData, password: '***', confirmPassword: '***' });
      
      // Call your backend's register endpoint
      const response = await apiService.register(registerData);
      
      if (response.success && response.data) {
        
        return {
          success: true,
          message: response.data.message || response.message || 'Registration successful'
        };
      } else {
        
        return {
          success: false,
          message: response.message || 'Registration failed',
          errors: response.errors
        };
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Registration failed:', error);

      if (error.response) {
        
        const { status, data } = error.response;
        
        if (status === 409) {
          return {
            success: false,
            message: 'User already exists with this email address',
            errors: data?.errors || ['Email already registered']
          };
        } else if (status === 400) {
          return {
            success: false,
            message: data?.message || 'Invalid registration data',
            errors: data?.errors || ['Please check your input and try again']
          };
        } else {
          return {
            success: false,
            message: data?.message || 'Registration failed',
            errors: data?.errors || ['Server error occurred']
          };
        }
      } else if (error.message) {
        return {
          success: false,
          message: error.message,
          errors: [error.message]
        };
      } else {
        return {
          success: false,
          message: 'Registration failed. Please try again.',
          errors: ['Unknown error occurred']
        };
      }
    }
  };

  const refreshUser = async () => {
    try {
      if (!user) return;
      
      // Since your backend uses cookies, we can't easily refresh user data
      // without a dedicated endpoint. For now, we'll keep the existing user data.
      
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
    register,
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