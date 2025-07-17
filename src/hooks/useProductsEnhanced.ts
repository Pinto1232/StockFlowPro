import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { 
  mockApiService, 
  realApiService,
  type Product, 
  type ProductFilters,
  type ApiResponse
} from '../services/api';
import { type BackendProduct, transformBackendProduct } from '../services/api/apiServiceMethods';

// Enhanced Product Filters with data source selection
export interface EnhancedProductFilters extends ProductFilters {
  dataSource?: 'auto' | 'mock' | 'api' | 'both';
  fallbackToMock?: boolean; // If API fails, fallback to mock data
}

// Enhanced Query Keys
export const enhancedProductKeys = {
  all: ['products-enhanced'] as const,
  lists: () => [...enhancedProductKeys.all, 'list'] as const,
  list: (filters: EnhancedProductFilters) => [...enhancedProductKeys.lists(), { filters }] as const,
  details: () => [...enhancedProductKeys.all, 'detail'] as const,
  detail: (id: string, source?: string) => [...enhancedProductKeys.details(), id, source] as const,
  search: (term: string, source?: string) => [...enhancedProductKeys.all, 'search', term, source] as const,
  lowStock: (threshold: number, source?: string) => [...enhancedProductKeys.all, 'lowStock', threshold, source] as const,
};

// Data source type
type DataSource = 'mock' | 'api' | 'both';

// Combined response type
interface CombinedProductResponse {
  data: {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
    sources: {
      mock?: ApiResponse<any>;
      api?: ApiResponse<any>;
    };
    combinedFrom: DataSource[];
    errors?: {
      mock?: Error;
      api?: Error;
    };
  };
  success: boolean;
  message: string;
}

// Enhanced Products Hook with multiple data sources
export const useProductsEnhanced = (filters?: EnhancedProductFilters) => {
  const [dataSource, setDataSource] = useState<DataSource>(
    filters?.dataSource === 'both' ? 'both' : 
    filters?.dataSource === 'mock' ? 'mock' : 
    filters?.dataSource === 'api' ? 'api' : 'api' // Default to API
  );

  const queryFn = useCallback(async (): Promise<CombinedProductResponse> => {
    const results: CombinedProductResponse = {
      data: {
        products: [],
        total: 0,
        page: 1,
        totalPages: 1,
        sources: {},
        combinedFrom: [],
        errors: {}
      },
      success: false,
      message: ''
    };

    // Helper function to normalize product data
    const normalizeProducts = (products: Product[]): Product[] => {
      return products.map(product => ({
        ...product,
        stockQuantity: product.stockQuantity || product.quantity || 0,
        quantity: product.quantity || product.stockQuantity || 0,
      }));
    };

    try {
      if (dataSource === 'mock' || dataSource === 'both') {
        try {
          // eslint-disable-next-line no-console
          console.log('🔄 Fetching from Mock API...');
          const mockResponse = await mockApiService.getProducts(filters);
          results.data.sources.mock = mockResponse;
          
          if (mockResponse.success && mockResponse.data) {
            const mockProducts = Array.isArray(mockResponse.data) 
              ? mockResponse.data 
              : mockResponse.data.products || [];
            
            results.data.products.push(...normalizeProducts(mockProducts));
            results.data.combinedFrom.push('mock');
            // eslint-disable-next-line no-console
            console.log(`✅ Mock API: ${mockProducts.length} products fetched`);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('❌ Mock API Error:', error);
          results.data.errors!.mock = error as Error;
        }
      }

      if (dataSource === 'api' || dataSource === 'both') {
        try {
          // eslint-disable-next-line no-console
          console.log('🔄 Fetching from Real API (http://localhost:5131/api/products)...');
          const apiResponse = await realApiService.getProducts(filters);
          results.data.sources.api = apiResponse;
          
          if (apiResponse.success && apiResponse.data) {
            let apiProducts: Product[] = [];
            
            // Cast to any to handle different response formats from backend
            const responseData = apiResponse.data as any;
            
            // Handle different response formats from backend
            if (Array.isArray(responseData)) {
              // Direct array of products
              apiProducts = responseData.map((product: any) => {
                // Check if it's already in frontend format or needs transformation
                if (product.costPerItem !== undefined) {
                  return transformBackendProduct(product as BackendProduct);
                }
                return product as Product;
              });
            } else if (responseData.data && Array.isArray(responseData.data)) {
              // Response has nested data array (like your API response structure)
              // This is the case for your API: { success: true, data: Array(10), ... }
              apiProducts = responseData.data.map((product: any) => {
                if (product.costPerItem !== undefined) {
                  return transformBackendProduct(product as BackendProduct);
                }
                return product as Product;
              });
            } else if (responseData.products) {
              // Nested products array
              apiProducts = responseData.products.map((product: any) => {
                if (product.costPerItem !== undefined) {
                  return transformBackendProduct(product as BackendProduct);
                }
                return product as Product;
              });
            } else {
              // Single product or other format
              apiProducts = [responseData].map((product: any) => {
                if (product.costPerItem !== undefined) {
                  return transformBackendProduct(product as BackendProduct);
                }
                return product as Product;
              });
            }
            
            // eslint-disable-next-line no-console
            console.log('🔄 Transformed API products:', {
              originalCount: Array.isArray(responseData) 
                ? responseData.length 
                : Array.isArray(responseData.data) 
                  ? responseData.data.length 
                  : (responseData.products?.length || 1),
              transformedCount: apiProducts.length,
              sampleProduct: apiProducts[0]
            });
            
            // If we're combining both sources, merge the data
            if (dataSource === 'both') {
              results.data.products.push(...normalizeProducts(apiProducts));
            } else {
              // If only API, replace mock data
              results.data.products = normalizeProducts(apiProducts);
            }
            
            results.data.combinedFrom.push('api');
            // eslint-disable-next-line no-console
            console.log(`✅ Real API: ${apiProducts.length} products fetched and transformed`);
            
            // Update pagination info from API response
            if (responseData.total !== undefined) {
              results.data.total = responseData.total;
              results.data.page = responseData.page || 1;
              results.data.totalPages = responseData.totalPages || 1;
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('❌ Real API Error:', error);
          results.data.errors!.api = error as Error;
          
          // Fallback to mock if API fails and fallbackToMock is enabled
          if (filters?.fallbackToMock && dataSource === 'api' && !results.data.combinedFrom.includes('mock')) {
            try {
              // eslint-disable-next-line no-console
              console.log('🔄 Falling back to Mock API...');
              const mockResponse = await mockApiService.getProducts(filters);
              if (mockResponse.success && mockResponse.data) {
                const mockProducts = Array.isArray(mockResponse.data) 
                  ? mockResponse.data 
                  : mockResponse.data.products || [];
                
                results.data.products = normalizeProducts(mockProducts);
                results.data.sources.mock = mockResponse;
                results.data.combinedFrom.push('mock');
                // eslint-disable-next-line no-console
                console.log(`✅ Fallback successful: ${mockProducts.length} products from mock`);
              }
            } catch (fallbackError) {
              // eslint-disable-next-line no-console
              console.warn('❌ Fallback to Mock also failed:', fallbackError);
            }
          }
        }
      }

      // Remove duplicates if combining both sources (based on ID)
      if (dataSource === 'both' && results.data.products.length > 0) {
        const uniqueProducts = results.data.products.reduce((acc, product) => {
          if (!acc.find(p => p.id === product.id)) {
            acc.push(product);
          }
          return acc;
        }, [] as Product[]);
        results.data.products = uniqueProducts;
      }

      // Update total count
      results.data.total = results.data.products.length;

      // Determine success status
      results.success = results.data.products.length > 0 || results.data.combinedFrom.length > 0;
      
      // Create descriptive message
      if (results.data.combinedFrom.length > 0) {
        const sources = results.data.combinedFrom.join(' + ');
        results.message = `Successfully fetched ${results.data.products.length} products from ${sources}`;
      } else {
        results.message = 'No data available from any source';
      }

      // eslint-disable-next-line no-console
      console.log('📊 Combined Results:', {
        totalProducts: results.data.products.length,
        sources: results.data.combinedFrom,
        hasErrors: Object.keys(results.data.errors || {}).length > 0
      });

      return results;

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Critical error in useProductsEnhanced:', error);
      return {
        data: {
          products: [],
          total: 0,
          page: 1,
          totalPages: 1,
          sources: {},
          combinedFrom: [],
          errors: { api: error as Error }
        },
        success: false,
        message: `Critical error: ${(error as Error).message}`
      };
    }
  }, [filters, dataSource]);

  const query = useQuery({
    queryKey: enhancedProductKeys.list(filters || {}),
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, _error) => {
      // Retry up to 2 times for network errors
      if (failureCount < 2) {
        // eslint-disable-next-line no-console
        console.log(`🔄 Retrying query (attempt ${failureCount + 1})...`);
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Enhanced return object with additional utilities
  return {
    ...query,
    // Original data structure for backward compatibility
    data: query.data ? {
      success: query.data.success,
      message: query.data.message,
      data: {
        products: query.data.data.products,
        total: query.data.data.total,
        page: query.data.data.page,
        totalPages: query.data.data.totalPages,
      }
    } : undefined,
    // Enhanced data with source information
    enhancedData: query.data,
    // Utility functions
    switchDataSource: setDataSource,
    currentDataSource: dataSource,
    // Source-specific data
    mockData: query.data?.data.sources.mock,
    apiData: query.data?.data.sources.api,
    // Error information
    sourceErrors: query.data?.data.errors,
    // Combined sources info
    dataSources: query.data?.data.combinedFrom || [],
  };
};

// Hook for single product with enhanced source selection
export const useProductEnhanced = (id: string, source: DataSource = 'api') => {
  const queryFn = useCallback(async () => {
    if (source === 'mock') {
      return mockApiService.getProductById(id);
    } else if (source === 'api') {
      return realApiService.getProductById(id);
    } else {
      // Try API first, fallback to mock
      try {
        return await realApiService.getProductById(id);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('API failed, trying mock:', error);
        return mockApiService.getProductById(id);
      }
    }
  }, [id, source]);

  return useQuery({
    queryKey: enhancedProductKeys.detail(id, source),
    queryFn,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to test connectivity to both sources
export const useProductSourcesHealth = () => {
  const [healthStatus, setHealthStatus] = useState<{
    mock: 'unknown' | 'healthy' | 'error';
    api: 'unknown' | 'healthy' | 'error';
    lastChecked?: Date;
  }>({
    mock: 'unknown',
    api: 'unknown'
  });

  const checkHealth = useCallback(async () => {
    type HealthValue = 'unknown' | 'healthy' | 'error';
    const results: { mock: HealthValue; api: HealthValue } = { 
      mock: 'unknown', 
      api: 'unknown' 
    };

    // Test Mock API
    try {
      await mockApiService.healthCheck();
      results.mock = 'healthy';
    } catch (_error) {
      results.mock = 'error';
    }

    // Test Real API
    try {
      await realApiService.healthCheck();
      results.api = 'healthy';
    } catch (_error) {
      results.api = 'error';
    }

    setHealthStatus({
      ...results,
      lastChecked: new Date()
    });

    return results;
  }, []);

  return {
    healthStatus,
    checkHealth,
    isHealthy: healthStatus.mock === 'healthy' || healthStatus.api === 'healthy',
    bothHealthy: healthStatus.mock === 'healthy' && healthStatus.api === 'healthy',
  };
};

// Export backward compatible hook that uses the enhanced version
export const useProducts = (filters?: ProductFilters) => {
  const enhancedFilters: EnhancedProductFilters = {
    ...filters,
    dataSource: 'api', // Default to API for backward compatibility
    fallbackToMock: true, // Enable fallback for better UX
  };

  const enhancedResult = useProductsEnhanced(enhancedFilters);

  // Return in the original format for backward compatibility
  return {
    data: enhancedResult.data,
    isLoading: enhancedResult.isLoading,
    error: enhancedResult.error,
    refetch: enhancedResult.refetch,
    isError: enhancedResult.isError,
    isFetching: enhancedResult.isFetching,
    isSuccess: enhancedResult.isSuccess,
  };
};