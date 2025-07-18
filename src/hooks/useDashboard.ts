import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  reports: () => [...dashboardKeys.all, 'reports'] as const,
  inventoryReport: (params: any) => [...dashboardKeys.reports(), 'inventory', params] as const,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => apiService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, 
    gcTime: 5 * 60 * 1000, 
    refetchInterval: 5 * 60 * 1000, 
  });
};

export const useInventoryReport = (params?: {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}) => {
  return useQuery({
    queryKey: dashboardKeys.inventoryReport(params || {}),
    queryFn: () => apiService.getInventoryReport(params),
    enabled: !!(params?.startDate && params?.endDate), 
    staleTime: 10 * 60 * 1000, 
  });
};

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiService.healthCheck(),
    staleTime: 30 * 1000, 
    refetchInterval: 60 * 1000, 
    retry: 3,
  });
};