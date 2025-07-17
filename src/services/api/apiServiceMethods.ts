// API Service Methods for StockFlow Pro Mobile
import { apiClient } from './ApiClient';
import { API_ENDPOINTS, getCurrentEnvironment } from '../config';

// Type definitions
// Backend product structure (what your API returns)
export interface BackendProduct {
  id: string;
  name: string;
  formattedName: string;
  costPerItem: number;
  formattedPrice: string;
  numberInStock: number;
  stockDisplay: string;
  stockLevel: string;
  stockStatus: string;
  stockStatusBadge: string;
  isActive: boolean;
  isInStock: boolean;
  isLowStock: boolean;
  activeStatusBadge: string;
  priceRange: string;
  totalValue: number;
  formattedTotalValue: string;
  formattedTotalValueShort: string;
  createdAt: string;
  createdDisplay: string;
  createdFriendly: string;
}

// Frontend product structure (what the UI expects)
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  categoryId?: string;
  price: number;
  cost?: number;
  quantity: number;
  stockQuantity: number; // Added for backward compatibility with HomeScreen
  minStockLevel?: number;
  maxStockLevel?: number;
  unit?: string;
  location?: string;
  supplier?: string;
  supplierId?: string;
  tags?: string[];
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  // Additional fields from backend
  formattedPrice?: string;
  stockDisplay?: string;
  stockLevel?: string;
  stockStatus?: string;
  stockStatusBadge?: string;
  isInStock?: boolean;
  isLowStock?: boolean;
  priceRange?: string;
  totalValue?: number;
  formattedTotalValue?: string;
  createdDisplay?: string;
  createdFriendly?: string;
}

// Helper function to transform backend product to frontend format
export function transformBackendProduct(backendProduct: BackendProduct): Product {
  return {
    id: backendProduct.id,
    name: backendProduct.name || backendProduct.formattedName,
    price: backendProduct.costPerItem || 0,
    cost: backendProduct.costPerItem || 0,
    quantity: backendProduct.numberInStock || 0,
    stockQuantity: backendProduct.numberInStock || 0,
    isActive: backendProduct.isActive,
    createdAt: backendProduct.createdAt,
    // Additional fields from backend
    formattedPrice: backendProduct.formattedPrice,
    stockDisplay: backendProduct.stockDisplay,
    stockLevel: backendProduct.stockLevel,
    stockStatus: backendProduct.stockStatus,
    stockStatusBadge: backendProduct.stockStatusBadge,
    isInStock: backendProduct.isInStock,
    isLowStock: backendProduct.isLowStock,
    priceRange: backendProduct.priceRange,
    totalValue: backendProduct.totalValue,
    formattedTotalValue: backendProduct.formattedTotalValue,
    createdDisplay: backendProduct.createdDisplay,
    createdFriendly: backendProduct.createdFriendly,
  };
}

export interface ProductFilters {
  category?: string;
  supplier?: string;
  isActive?: boolean;
  activeOnly?: boolean; // Added for backward compatibility
  lowStock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalCategories: number;
  totalSuppliers: number;
  recentMovements: number;
  topProducts: Array<{
    id: string;
    name: string;
    quantity: number;
    value: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    currentStock: number;
    minStockLevel: number;
  }>;
  monthlyStats: Array<{
    month: string;
    totalValue: number;
    movements: number;
  }>;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  errors?: string[];
  success: boolean;
}

export interface StockMovement {
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason?: string;
  reference?: string;
}

// API Service Class
class ApiService {
  // Helper method to determine if we should skip auth for development
  private shouldSkipAuthForDevelopment(endpoint: string): boolean {
    const isDevelopment = getCurrentEnvironment() === 'development';
    
    // eslint-disable-next-line no-console
    console.log(`[ApiService] shouldSkipAuthForDevelopment check:`, {
      endpoint,
      isDevelopment,
      environment: getCurrentEnvironment()
    });
    
    if (!isDevelopment) {
      return false;
    }
    
    // List of endpoint patterns that can work without authentication in development
    const publicEndpointPatternsInDev = [
      '/products',           // Covers /products, /products?query, /products/search, etc.
      '/health',            // Covers all health endpoints
    ];
    
    // Check if the endpoint matches any of the public endpoint patterns
    const isPublicEndpoint = publicEndpointPatternsInDev.some(pattern => 
      endpoint.includes(pattern)
    );
    
    // eslint-disable-next-line no-console
    console.log(`[ApiService] Skip auth result:`, {
      endpoint,
      isPublicEndpoint,
      shouldSkip: isPublicEndpoint
    });
    
    return isPublicEndpoint;
  }

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<any>> {
    // Your backend expects username and password for login
    return apiClient.post(API_ENDPOINTS.auth.login, credentials);
  }

  async logout(): Promise<ApiResponse<void>> {
    // Your backend logout endpoint
    return apiClient.post(API_ENDPOINTS.auth.logout);
  }

  // Note: Your backend uses cookie-based auth, so these JWT methods are not needed
  // async checkSession(): Promise<ApiResponse<{ user: any; isValid: boolean }>> {
  //   return apiClient.get(API_ENDPOINTS.auth.session);
  // }

  // async refreshToken(): Promise<ApiResponse<{ accessToken: string; refreshToken?: string }>> {
  //   return apiClient.post(API_ENDPOINTS.auth.refresh);
  // }

  // Product Methods
  async getProducts(filters?: ProductFilters): Promise<ApiResponse<{ products: Product[]; total: number; page: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      // Filter out internal hook parameters that shouldn't be sent to the API
      const apiFilters = { ...filters };
      delete (apiFilters as any).dataSource;
      delete (apiFilters as any).fallbackToMock;
      
      Object.entries(apiFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.products.list}?${queryParams.toString()}`
      : API_ENDPOINTS.products.list;

    const skipAuth = this.shouldSkipAuthForDevelopment(endpoint);
    
    return apiClient.get(endpoint, { skipAuth });
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const endpoint = API_ENDPOINTS.products.byId(id);
    const skipAuth = this.shouldSkipAuthForDevelopment(endpoint);
    
    return apiClient.get(endpoint, { skipAuth });
  }

  async searchProducts(searchTerm: string, filters?: ProductFilters): Promise<ApiResponse<{ products: Product[]; total: number }>> {
    const queryParams = new URLSearchParams({ q: searchTerm });
    
    if (filters) {
      // Filter out internal hook parameters that shouldn't be sent to the API
      const apiFilters = { ...filters };
      delete (apiFilters as any).dataSource;
      delete (apiFilters as any).fallbackToMock;
      
      Object.entries(apiFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `${API_ENDPOINTS.products.search}?${queryParams.toString()}`;
    const skipAuth = this.shouldSkipAuthForDevelopment(endpoint);
    
    return apiClient.get(endpoint, { skipAuth });
  }

  async getLowStockProducts(threshold: number = 10): Promise<ApiResponse<Product[]>> {
    const endpoint = `${API_ENDPOINTS.products.lowStock}?threshold=${threshold}`;
    const skipAuth = this.shouldSkipAuthForDevelopment(endpoint);
    
    return apiClient.get(endpoint, { skipAuth });
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    return apiClient.post(API_ENDPOINTS.products.create, product);
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.put(API_ENDPOINTS.products.update(id), product);
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(API_ENDPOINTS.products.delete(id));
  }

  async updateProductStock(id: string, quantity: number, reason?: string): Promise<ApiResponse<Product>> {
    return apiClient.patch(API_ENDPOINTS.products.updateStock(id), { quantity, reason });
  }

  // Dashboard Methods
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const endpoint = API_ENDPOINTS.products.dashboardStats;
    const skipAuth = this.shouldSkipAuthForDevelopment(endpoint);
    
    return apiClient.get(endpoint, { skipAuth });
  }

  // Inventory Methods
  async recordStockMovement(movement: StockMovement): Promise<ApiResponse<any>> {
    return apiClient.post(API_ENDPOINTS.inventory.movements, movement);
  }

  async getInventoryMovements(filters?: any): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.inventory.movements}?${queryParams.toString()}`
      : API_ENDPOINTS.inventory.movements;

    return apiClient.get(endpoint);
  }

  async getInventoryReport(params?: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.inventory.reports}?${queryParams.toString()}`
      : API_ENDPOINTS.inventory.reports;

    return apiClient.get(endpoint);
  }

  // User Methods
  async getUsers(filters?: any): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.users.list}?${queryParams.toString()}`
      : API_ENDPOINTS.users.list;

    return apiClient.get(endpoint);
  }

  async getUserById(id: string): Promise<ApiResponse<any>> {
    return apiClient.get(API_ENDPOINTS.users.byId(id));
  }

  async createUser(user: any): Promise<ApiResponse<any>> {
    return apiClient.post(API_ENDPOINTS.users.create, user);
  }

  async updateUser(id: string, user: any): Promise<ApiResponse<any>> {
    return apiClient.put(API_ENDPOINTS.users.update(id), user);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(API_ENDPOINTS.users.delete(id));
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    const endpoint = API_ENDPOINTS.health.basic;
    const skipAuth = this.shouldSkipAuthForDevelopment(endpoint);
    
    try {
      return await apiClient.get(endpoint, { skipAuth });
    } catch (error: any) {
      // If health endpoint doesn't exist, try a fallback approach
      if (error.status === 404) {
        // eslint-disable-next-line no-console
        console.warn('[ApiService] Health endpoint not found, trying products endpoint as fallback');
        
        try {
          // Try to access products endpoint as a health check
          await apiClient.get(API_ENDPOINTS.products.list, { skipAuth });
          
          // If products endpoint works, consider the API healthy
          return {
            data: { status: 'healthy', timestamp: new Date().toISOString() },
            status: 200,
            message: 'API is healthy (verified via products endpoint)',
            success: true,
          };
        } catch (fallbackError) {
          // eslint-disable-next-line no-console
          console.warn('[ApiService] Fallback health check also failed:', fallbackError);
          throw error; // Throw original health check error
        }
      }
      
      throw error;
    }
  }

  async getDetailedHealth(): Promise<ApiResponse<any>> {
    const endpoint = API_ENDPOINTS.health.detailed;
    const skipAuth = this.shouldSkipAuthForDevelopment(endpoint);
    
    return apiClient.get(endpoint, { skipAuth });
  }

  async getVersion(): Promise<ApiResponse<{ version: string; build: string }>> {
    const endpoint = API_ENDPOINTS.health.version;
    const skipAuth = this.shouldSkipAuthForDevelopment(endpoint);
    
    return apiClient.get(endpoint, { skipAuth });
  }

  // File Upload
  async uploadFile(file: FormData, endpoint: string = '/upload'): Promise<ApiResponse<{ url: string; filename: string }>> {
    return apiClient.uploadFile(endpoint, file);
  }

  // Utility Methods
  getBaseUrl(): string {
    return apiClient['baseURL'];
  }

  setAuthTokens(accessToken: string, refreshToken?: string): void {
    apiClient.setAuthTokens(accessToken, refreshToken);
  }

  clearAuthTokens(): void {
    apiClient.clearAuthTokens();
  }

  updateConfig(): void {
    apiClient.updateConfig();
  }
}

// Create and export singleton instance
export const apiService = new ApiService();

// Export default instance
export default apiService;