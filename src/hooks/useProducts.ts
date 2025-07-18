import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, type Product, type ProductFilters } from '../services/api';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (term: string) => [...productKeys.all, 'search', term] as const,
  lowStock: (threshold: number) => [...productKeys.all, 'lowStock', threshold] as const,
};

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => apiService.getProducts(filters),
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => apiService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchProducts = (searchTerm: string, filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.search(searchTerm),
    queryFn: () => apiService.searchProducts(searchTerm, filters),
    enabled: searchTerm.length > 2, 
    staleTime: 2 * 60 * 1000, 
  });
};

export const useLowStockProducts = (threshold: number = 10) => {
  return useQuery({
    queryKey: productKeys.lowStock(threshold),
    queryFn: () => apiService.getLowStockProducts(threshold),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiService.createProduct(product),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      apiService.updateProduct(id, product),
    onSuccess: (data, variables) => {
      
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteProduct(id),
    onSuccess: (data, id) => {
      
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

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
      
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

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