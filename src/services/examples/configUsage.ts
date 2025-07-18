
import { apiClient, ApiClient } from '../api/ApiClient';
import { 
  getCurrentConfig, 
  getBaseURL, 
  API_ENDPOINTS,
  getCurrentEnvironment 
} from '../config';
import { 
  environmentManager, 
  getEnvironmentInfo,
  isDevelopment,
  envLog 
} from '../environment';
import { 
  storeAuthTokens, 
  getAuthTokens, 
  clearAuthTokens 
} from '../secureStorage';
import { LoginResponseDTO } from '../../business/dtos/UserDTO';

export const exampleApiUsage = async () => {
  try {
    
    const isHealthy = await apiClient.healthCheck();
    envLog('API Health Check:', isHealthy);

    const loginResponse = await apiClient.post<LoginResponseDTO>(API_ENDPOINTS.auth.login, {
      email: 'user@example.com',
      password: 'password123'
    });

    if (loginResponse.success) {
      
      await storeAuthTokens(
        loginResponse.data.token,
        loginResponse.data.refreshToken
      );

      apiClient.setAuthTokens(
        loginResponse.data.token,
        loginResponse.data.refreshToken
      );

      envLog('Login successful');
    }

    const productsResponse = await apiClient.get(API_ENDPOINTS.products.list);
    envLog('Products:', productsResponse.data);

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('API Error:', error);
  }
};

export const exampleEnvironmentUsage = () => {
  const envInfo = getEnvironmentInfo();
  envLog('Current Environment:', envInfo);

  if (isDevelopment()) {
    envLog('Development mode - enabling debug features');
    
  } else {
    envLog('Production mode - enabling analytics and crash reporting');
    
  }

  const canDebug = environmentManager.canUseFeature('debug_logging');
  const canSwitchEnv = environmentManager.canUseFeature('environment_switching');
  
  envLog('Feature flags:', { canDebug, canSwitchEnv });
};

export const exampleConfigInspection = () => {
  const config = getCurrentConfig();
  const baseURL = getBaseURL();
  const environment = getCurrentEnvironment();

  envLog('Configuration Details:', {
    environment,
    baseURL,
    timeout: config.timeout,
    retryAttempts: config.retryAttempts,
    enableLogging: config.enableLogging,
  });
};

export const exampleTokenManagement = async () => {
  try {
    
    const { accessToken, refreshToken } = await getAuthTokens();
    
    if (accessToken) {
      
      apiClient.setAuthTokens(accessToken, refreshToken || undefined);
      envLog('Tokens restored from secure storage');
    } else {
      envLog('No stored tokens found');
    }

    await clearAuthTokens();
    apiClient.clearAuthTokens();
    envLog('Tokens cleared');

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Token management error:', error);
  }
};

export const exampleCustomApiClient = () => {
  
  const customClient = new ApiClient();

  customClient.setAuthTokens('custom-token');
  
  return customClient;
};

export const exampleErrorHandling = async () => {
  try {
    
    await apiClient.get('/non-existent-endpoint');
  } catch (error: any) {
    envLog('Handling API Error:', {
      status: error.status,
      message: error.message,
      errors: error.errors,
    });

    if (error.status === 401) {
      envLog('Unauthorized - redirecting to login');
      await clearAuthTokens();
      
    } else if (error.status === 500) {
      envLog('Server error - showing user-friendly message');
      
    }
  }
};

export const exampleFileUpload = async (file: FormData) => {
  try {
    const response = await apiClient.uploadFile(
      '/upload/product-image',
      file,
      { timeout: 30000 } 
    );

    envLog('File upload successful:', response.data);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('File upload failed:', error);
    throw error;
  }
};

export const exampleEnvironmentSwitching = () => {
  if (isDevelopment()) {
    envLog('Available environments:', environmentManager.getAvailableEnvironments());

    environmentManager.switchEnvironment('staging');

    apiClient.updateConfig();
    
    envLog('Switched to staging environment');
    envLog('New base URL:', getBaseURL());
  }
};