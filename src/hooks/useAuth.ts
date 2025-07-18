import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService, type LoginCredentials } from '../services/api';

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  verify: () => [...authKeys.all, 'verify'] as const,
};

export const useAuthStatus = () => {
  return useQuery({
    queryKey: authKeys.verify(),
    queryFn: () => apiService.verifyToken(),
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    retry: false, // Don't retry auth checks
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => apiService.getUserProfile(),
    staleTime: 10 * 60 * 1000, 
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => apiService.login(credentials),
    onSuccess: (data) => {
      if (data.success) {
        
        queryClient.invalidateQueries({ queryKey: authKeys.all });
        
        queryClient.prefetchQuery({
          queryKey: authKeys.profile(),
          queryFn: () => apiService.getUserProfile(),
        });
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      
      queryClient.clear();
    },
    onError: () => {
      
      queryClient.clear();
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: any) => apiService.updateUserProfile(profile),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiService.refreshToken(),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

export const useIsAuthenticated = () => {
  const { data: authData, isLoading } = useAuthStatus();
  
  return {
    isAuthenticated: authData?.success && authData?.data?.valid,
    isLoading,
    user: authData?.data?.user,
  };
};