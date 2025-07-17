import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, type Product, type ProductFilters } from '../services/api';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (term: string) => [...productKeys.all, 'search', term] as const,
  lowStock: (threshold: number) => [...productKeys.all, 'lowStock', threshold] as const,
};

// Custom Hooks with improved error handling
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => apiService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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
    // Enable background refetch but with longer intervals
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchInterval: false, // Disable automatic refetch
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => apiService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as any).response?.status;
        if (status === 401 || status === 403 || status === 404) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
};

export const useSearchProducts = (searchTerm: string, filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.search(searchTerm),
    queryFn: () => apiService.searchProducts(searchTerm, filters),
    enabled: searchTerm.length > 2, // Only search if term is longer than 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    retry: 1, // Only retry once for search
  });
};

export const useLowStockProducts = (threshold: number = 10) => {
  return useQuery({
    queryKey: productKeys.lowStock(threshold),
    queryFn: () => apiService.getLowStockProducts(threshold),
    staleTime: 5 * 60 * 1000,
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

// Mutations with improved error handling
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiService.createProduct(product),
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      apiService.updateProduct(id, product),
    onSuccess: (data, variables) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Update the specific product in cache
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
    onError: (error) => {
      console.error('Failed to update product:', error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteProduct(id),
    onSuccess: (data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete product:', error);
    },
  });
};

// Stock Movement Mutations
export const useRecordStockMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movement: {
      productId: string;
      type: 'IN' | 'OUT' | 'ADJUSTMENT';
      quantity: number;
      reason?: string;
      reference?: string;
    }) => apiService.recordStockMovement(movement),
    onSuccess: (data, variables) => {
      // Invalidate product details to refresh stock quantity
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Invalidate low stock products
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error) => {
      console.error('Failed to record stock movement:', error);
    },
  });
};

// Utility function to prefetch product
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => apiService.getProductById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};