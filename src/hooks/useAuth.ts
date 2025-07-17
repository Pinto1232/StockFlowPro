import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService, type LoginCredentials } from '../services/api';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  verify: () => [...authKeys.all, 'verify'] as const,
};

// Check if user is authenticated
export const useAuthStatus = () => {
  return useQuery({
    queryKey: authKeys.verify(),
    queryFn: () => apiService.verifyToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry auth checks
  });
};

// Get user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => apiService.getUserProfile(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => apiService.login(credentials),
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate auth queries to refetch user data
        queryClient.invalidateQueries({ queryKey: authKeys.all });
        // Prefetch user profile
        queryClient.prefetchQuery({
          queryKey: authKeys.profile(),
          queryFn: () => apiService.getUserProfile(),
        });
      }
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
    onError: () => {
      // Even if logout fails on server, clear local cache
      queryClient.clear();
    },
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: any) => apiService.updateUserProfile(profile),
    onSuccess: () => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};

// Refresh token mutation
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiService.refreshToken(),
    onSuccess: () => {
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

// Utility hook to check authentication status
export const useIsAuthenticated = () => {
  const { data: authData, isLoading } = useAuthStatus();
  
  return {
    isAuthenticated: authData?.success && authData?.data?.valid,
    isLoading,
    user: authData?.data?.user,
  };
};