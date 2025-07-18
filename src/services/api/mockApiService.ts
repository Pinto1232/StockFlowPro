
import { 
  Product, 
  ProductFilters, 
  DashboardStats, 
  ApiResponse, 
  LoginCredentials,
  RegisterData,
  RegisterResponse,
  StockMovement 
} from './apiServiceMethods';
import { getCurrentConfig, getBaseURL, getCurrentEnvironment } from '../config';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    sku: 'WBH-001',
    barcode: '1234567890123',
    category: 'Electronics',
    categoryId: 'cat-1',
    price: 99.99,
    cost: 60.00,
    quantity: 50,
    stockQuantity: 50,
    minStockLevel: 10,
    maxStockLevel: 100,
    unit: 'piece',
    location: 'Warehouse A',
    supplier: 'TechSupplier Inc',
    supplierId: 'sup-1',
    tags: ['electronics', 'audio', 'wireless'],
    images: [],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'Smartphone Case',
    description: 'Protective case for smartphones',
    sku: 'SC-002',
    barcode: '1234567890124',
    category: 'Accessories',
    categoryId: 'cat-2',
    price: 19.99,
    cost: 8.00,
    quantity: 25,
    stockQuantity: 25,
    minStockLevel: 5,
    maxStockLevel: 50,
    unit: 'piece',
    location: 'Warehouse B',
    supplier: 'AccessoryWorld',
    supplierId: 'sup-2',
    tags: ['accessories', 'protection'],
    images: [],
    isActive: true,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: '3',
    name: 'USB-C Cable',
    description: 'High-speed USB-C charging cable',
    sku: 'USB-003',
    barcode: '1234567890125',
    category: 'Cables',
    categoryId: 'cat-3',
    price: 12.99,
    cost: 5.00,
    quantity: 8,
    stockQuantity: 8,
    minStockLevel: 15,
    maxStockLevel: 100,
    unit: 'piece',
    location: 'Warehouse A',
    supplier: 'CableTech',
    supplierId: 'sup-3',
    tags: ['cables', 'charging', 'usb-c'],
    images: [],
    isActive: true,
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-19T13:20:00Z',
  },
];

const mockDashboardStats: DashboardStats = {
  totalProducts: 3,
  totalValue: 2847.73,
  lowStockItems: 1,
  outOfStockItems: 0,
  totalCategories: 3,
  totalSuppliers: 3,
  recentMovements: 12,
  topProducts: [
    { id: '1', name: 'Wireless Bluetooth Headphones', quantity: 50, value: 4999.50 },
    { id: '2', name: 'Smartphone Case', quantity: 25, value: 499.75 },
    { id: '3', name: 'USB-C Cable', quantity: 8, value: 103.92 },
  ],
  lowStockProducts: [
    { id: '3', name: 'USB-C Cable', currentStock: 8, minStockLevel: 15 },
  ],
  monthlyStats: [
    { month: 'January', totalValue: 2847.73, movements: 12 },
    { month: 'December', totalValue: 2650.00, movements: 8 },
    { month: 'November', totalValue: 2400.00, movements: 15 },
  ],
};

class MockApiService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createResponse<T>(data: T, message?: string): ApiResponse<T> {
    const config = getCurrentConfig();
    const environment = getCurrentEnvironment();
    
    // eslint-disable-next-line no-console
    console.log(`[MockAPI] Request to ${getBaseURL()} (${environment} environment)`);
    // eslint-disable-next-line no-console
    console.log(`[MockAPI] Config:`, { 
      timeout: config.timeout, 
      retryAttempts: config.retryAttempts,
      enableLogging: config.enableLogging 
    });

    return {
      data,
      status: 200,
      message: message || 'Success',
      success: true,
    };
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<{ accessToken: string; refreshToken: string; user: any }>> {
    await this.delay();
    
    if (credentials.username === 'test@example.com' && credentials.password === 'password') {
      return this.createResponse({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          email: credentials.username,
          name: 'Test User',
          role: 'admin',
        },
      }, 'Login successful');
    }
    
    throw new Error('Invalid credentials');
  }

  async logout(): Promise<ApiResponse<void>> {
    await this.delay(200);
    return this.createResponse(undefined, 'Logout successful');
  }

  async register(registerData: RegisterData): Promise<ApiResponse<RegisterResponse>> {
    await this.delay(800);

    if (registerData.email === 'existing@example.com') {
      const error = new Error('User already exists');
      (error as any).response = {
        status: 409,
        data: {
          message: 'User already exists with this email address',
          errors: ['Email already registered']
        }
      };
      throw error;
    }

    const mockUser = {
      id: `user-${Date.now()}`,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      role: 'User'
    };
    
    return this.createResponse({
      message: 'Registration successful',
      user: mockUser
    }, 'User registered successfully');
  }

  async verifyToken(): Promise<ApiResponse<{ user: any; valid: boolean }>> {
    await this.delay(300);
    return this.createResponse({
      user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'admin' },
      valid: true,
    });
  }

  async getUserProfile(): Promise<ApiResponse<any>> {
    await this.delay(400);
    return this.createResponse({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '+1234567890',
      createdAt: '2024-01-01T00:00:00Z',
    });
  }

  async updateUserProfile(profile: any): Promise<ApiResponse<any>> {
    await this.delay(600);
    return this.createResponse({
      ...profile,
      id: '1',
      updatedAt: new Date().toISOString(),
    }, 'Profile updated successfully');
  }

  async checkSession(): Promise<ApiResponse<{ user: any; isValid: boolean }>> {
    await this.delay(300);
    return this.createResponse({
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      isValid: true,
    });
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string; refreshToken?: string }>> {
    await this.delay(400);
    return this.createResponse({
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token',
    });
  }

  async getProducts(filters?: ProductFilters): Promise<ApiResponse<{ products: Product[]; total: number; page: number; totalPages: number }>> {
    await this.delay();
    
    let filteredProducts = [...mockProducts];
    
    if (filters?.activeOnly || filters?.isActive) {
      filteredProducts = filteredProducts.filter(p => p.isActive);
    }
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description?.toLowerCase().includes(searchTerm) ||
        p.sku?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters?.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    if (filters?.lowStock) {
      filteredProducts = filteredProducts.filter(p => p.stockQuantity < (p.minStockLevel || 0));
    }

    return this.createResponse({
      products: filteredProducts,
      total: filteredProducts.length,
      page: filters?.page || 1,
      totalPages: Math.ceil(filteredProducts.length / (filters?.limit || 10)),
    }, `Found ${filteredProducts.length} products`);
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    await this.delay();
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    return this.createResponse(product);
  }

  async searchProducts(searchTerm: string, filters?: ProductFilters): Promise<ApiResponse<{ products: Product[]; total: number }>> {
    await this.delay();
    
    const searchFilters = { ...filters, search: searchTerm };
    const result = await this.getProducts(searchFilters);
    
    return this.createResponse({
      products: result.data.products,
      total: result.data.total,
    });
  }

  async getLowStockProducts(threshold: number = 10): Promise<ApiResponse<Product[]>> {
    await this.delay();
    
    const lowStockProducts = mockProducts.filter(p => p.stockQuantity < threshold);
    return this.createResponse(lowStockProducts, `Found ${lowStockProducts.length} low stock products`);
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    await this.delay(800);
    
    const newProduct: Product = {
      ...product,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return this.createResponse(newProduct, 'Product created successfully');
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    await this.delay(600);
    
    const existingProduct = mockProducts.find(p => p.id === id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...product,
      updatedAt: new Date().toISOString(),
    };
    
    return this.createResponse(updatedProduct, 'Product updated successfully');
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    await this.delay(400);
    
    const productExists = mockProducts.some(p => p.id === id);
    if (!productExists) {
      throw new Error('Product not found');
    }
    
    return this.createResponse(undefined, 'Product deleted successfully');
  }

  async updateProductStock(id: string, quantity: number, _reason?: string): Promise<ApiResponse<Product>> {
    await this.delay(500);
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    const updatedProduct: Product = {
      ...product,
      quantity,
      stockQuantity: quantity,
      updatedAt: new Date().toISOString(),
    };
    
    return this.createResponse(updatedProduct, 'Stock updated successfully');
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await this.delay(700);
    return this.createResponse(mockDashboardStats, 'Dashboard stats retrieved');
  }

  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    await this.delay(100);
    return this.createResponse({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    }, 'Service is healthy');
  }

  async recordStockMovement(movement: StockMovement): Promise<ApiResponse<any>> {
    await this.delay(600);
    return this.createResponse({
      id: `mov-${Date.now()}`,
      ...movement,
      timestamp: new Date().toISOString(),
    }, 'Stock movement recorded');
  }

  async getInventoryMovements(_filters?: any): Promise<ApiResponse<any[]>> {
    await this.delay(500);
    return this.createResponse([], 'No movements found');
  }

  async getInventoryReport(_params?: any): Promise<ApiResponse<any>> {
    await this.delay(800);
    return this.createResponse({
      reportId: `report-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      data: mockDashboardStats,
    }, 'Report generated');
  }

  async getUsers(_filters?: any): Promise<ApiResponse<any[]>> {
    await this.delay();
    return this.createResponse([
      { id: '1', name: 'Test User', email: 'test@example.com', role: 'admin' },
    ]);
  }

  async getUserById(id: string): Promise<ApiResponse<any>> {
    await this.delay();
    
    const userData = { id: id, name: 'Test User', email: 'test@example.com' };
    return this.createResponse(userData);
  }

  async createUser(user: any): Promise<ApiResponse<any>> {
    await this.delay(800);
    return this.createResponse({ ...user, id: `user-${Date.now()}` });
  }

  async updateUser(id: string, user: any): Promise<ApiResponse<any>> {
    await this.delay(600);
    return this.createResponse({ ...user, id });
  }

  async deleteUser(_id: string): Promise<ApiResponse<void>> {
    await this.delay(400);
    return this.createResponse(undefined);
  }

  async getDetailedHealth(): Promise<ApiResponse<any>> {
    await this.delay(200);
    return this.createResponse({
      status: 'healthy',
      uptime: '24h 30m',
      memory: '512MB',
      cpu: '15%',
    });
  }

  async getVersion(): Promise<ApiResponse<{ version: string; build: string }>> {
    await this.delay(100);
    return this.createResponse({
      version: '1.0.0',
      build: 'mock-build-123',
    });
  }

  async uploadFile(_file: FormData, _endpoint: string = '/upload'): Promise<ApiResponse<{ url: string; filename: string }>> {
    await this.delay(1200);
    return this.createResponse({
      url: 'https://example.com/uploads/file.jpg',
      filename: 'file.jpg',
    });
  }

  getBaseUrl(): string {
    return getBaseURL();
  }

  setAuthTokens(accessToken: string, refreshToken?: string): void {
    // eslint-disable-next-line no-console
    console.log('[MockAPI] Auth tokens set:', { accessToken: '***', refreshToken: refreshToken ? '***' : undefined });
  }

  clearAuthTokens(): void {
    // eslint-disable-next-line no-console
    console.log('[MockAPI] Auth tokens cleared');
  }

  updateConfig(): void {
    // eslint-disable-next-line no-console
    console.log('[MockAPI] Configuration updated');
  }
}

export const mockApiService = new MockApiService();

export default mockApiService;