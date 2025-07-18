import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

// Query Keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  reports: () => [...dashboardKeys.all, 'reports'] as const,
  inventoryReport: (params: any) => [...dashboardKeys.reports(), 'inventory', params] as const,
};

// Dashboard Stats Hook
export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => apiService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
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
  });
};

// Health Check Hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiService.healthCheck(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Check every minute
    retry: 3,
  });
};