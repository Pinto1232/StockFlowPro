
import { apiService as realApiService } from './apiServiceMethods';
import { mockApiService } from './mockApiService';
import { getCurrentEnvironment } from '../config';

const shouldUseMock = process.env.REACT_APP_USE_MOCK_API === 'true';

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

export * from './apiService';
export { apiClient, ApiClient } from './ApiClient';

export { apiService as realApiService } from './apiServiceMethods';
export { mockApiService };