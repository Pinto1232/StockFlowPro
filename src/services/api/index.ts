// API exports
import { apiService as realApiService } from './apiServiceMethods';
import { mockApiService } from './mockApiService';
import { getCurrentEnvironment } from '../config';

// Conditionally use mock service only when explicitly requested
const shouldUseMock = process.env.REACT_APP_USE_MOCK_API === 'true';

// Debug logging
if (getCurrentEnvironment() === 'development') {
  // eslint-disable-next-line no-console
  console.log('[API Service] Configuration:', {
    environment: getCurrentEnvironment(),
    shouldUseMock,
    REACT_APP_USE_MOCK_API: process.env.REACT_APP_USE_MOCK_API,
    selectedService: shouldUseMock ? 'MockApiService' : 'RealApiService'
  });
}

export const apiService = shouldUseMock ? mockApiService : realApiService;
export default apiService;

export type { 
  ApiResponse, 
  Product, 
  DashboardStats, 
  ProductFilters, 
  LoginCredentials,
  RegisterData,
  RegisterResponse,
  StockMovement 
} from './apiServiceMethods';

// Re-export configuration and client
export * from './apiService';
export { apiClient, ApiClient } from './ApiClient';

// Export both services for manual selection if needed
export { apiService as realApiService } from './apiServiceMethods';
export { mockApiService };