
import { apiClient } from './ApiClient';
import { API_ENDPOINTS, getCurrentEnvironment } from '../config';

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
  stockQuantity: number; 
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
  activeOnly?: boolean; 
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

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
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

class ApiService {
  
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

    const publicEndpointPatternsInDev = [
      '/products',           
      '/health',            
    ];

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

  async login(credentials: LoginCredentials): Promise<ApiResponse<any>> {
    
    return apiClient.post(API_ENDPOINTS.auth.login, credentials);
  }

  async logout(): Promise<ApiResponse<void>> {
    
    return apiClient.post(API_ENDPOINTS.auth.logout);
  }

  async register(registerData: RegisterData): Promise<ApiResponse<RegisterResponse>> {
    
    return apiClient.post(API_ENDPOINTS.auth.register, registerData);
  }

  async verifyToken(): Promise<ApiResponse<{ user: any; valid: boolean }>> {
    return apiClient.get(API_ENDPOINTS.auth.check);
  }

  async getUserProfile(): Promise<ApiResponse<any>> {
    return apiClient.get(API_ENDPOINTS.users.profile);
  }

  async updateUserProfile(profile: any): Promise<ApiResponse<any>> {
    return apiClient.put(API_ENDPOINTS.users.updateProfile, profile);
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string; refreshToken?: string }>> {
    return apiClient.post(API_ENDPOINTS.auth.refresh);
  }

  async checkSession(): Promise<ApiResponse<{ user: any; isValid: boolean }>> {
    return apiClient.get(API_ENDPOINTS.auth.session);
  }

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

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const endpoint = API_ENDPOINTS.products.dashboardStats;
    const skipAuth = this.shouldSkipAuthForDevelopment(endpoint);
    
    return apiClient.get(endpoint, { skipAuth });
  }

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

  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; endpoint?: string; strategy?: string; responseTime?: number }>> {
    try {
      
      const { healthCheckService } = await import('./HealthCheckService');
      
      const result = await healthCheckService.checkHealth({
        timeout: 5000,
        retryAttempts: 0,
        skipAuth: this.shouldSkipAuthForDevelopment('/health'),
        includeDetails: true
      });

      return {
        data: {
          status: result.status,
          timestamp: result.timestamp,
          endpoint: result.endpoint,
          strategy: result.strategy,
          responseTime: result.responseTime
        },
        status: result.isHealthy ? 200 : (result.details?.statusCode || 503),
        message: result.isHealthy 
          ? `API is healthy (verified via ${result.strategy})` 
          : `API health check failed: ${result.details?.message || 'Unknown error'}`,
        success: result.isHealthy,
        errors: result.isHealthy ? undefined : [result.details?.error || 'Health check failed']
      };
    } catch (error: any) {
      
      // eslint-disable-next-line no-console
      console.error('[ApiService] Health check service failed:', error);
      
      return {
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          endpoint: 'unknown',
          strategy: 'fallback'
        },
        status: 503,
        message: 'Health check service unavailable',
        success: false,
        errors: [error.message || 'Health check service failed']
      };
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

  async uploadFile(file: FormData, endpoint: string = '/upload'): Promise<ApiResponse<{ url: string; filename: string }>> {
    return apiClient.uploadFile(endpoint, file);
  }

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

export const apiService = new ApiService();

export default apiService;