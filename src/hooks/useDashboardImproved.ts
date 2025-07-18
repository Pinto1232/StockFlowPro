import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

// Query Keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  reports: () => [...dashboardKeys.all, 'reports'] as const,
  inventoryReport: (params: any) => [...dashboardKeys.reports(), 'inventory', params] as const,
};

// Dashboard Stats Hook with improved error handling
export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => apiService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: false, // Disable auto-refetch to prevent spam
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Don't retry on auth errors (401, 403)
      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as any).response?.status;
        if (status === 401 || status === 403) {
          return false;
        }
      }
      // Don't retry on CORS errors
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as any).message;
        if (message.includes('CORS') || message.includes('Access-Control-Allow-Origin')) {
          return false;
        }
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Inventory Report Hook
export const useInventoryReport = (params?: {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}) => {
  return useQuery({
    queryKey: dashboardKeys.inventoryReport(params || {}),
    queryFn: () => apiService.getInventoryReport(params),
    enabled: !!(params?.startDate && params?.endDate), // Only fetch if date range is provided
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as any).response?.status;
        if (status === 401 || status === 403) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
};

// Health Check Hook with improved error handling
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiService.healthCheck(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: false, // Disable auto-refetch
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as any).response?.status;
        if (status === 401 || status === 403) {
          return false;
        }
      }
      // Only retry once for health checks
      return failureCount < 1;
    },
    retryDelay: 5000, // Wait 5 seconds before retry
  });
};