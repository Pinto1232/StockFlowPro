// Example Usage of StockFlow Pro Mobile Configuration
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

// Example 1: Basic API calls
export const exampleApiUsage = async () => {
  try {
    // Health check
    const isHealthy = await apiClient.healthCheck();
    envLog('API Health Check:', isHealthy);

    // Login example
    const loginResponse = await apiClient.post(API_ENDPOINTS.auth.login, {
      email: 'user@example.com',
      password: 'password123'
    });

    if (loginResponse.success) {
      // Store tokens securely
      await storeAuthTokens(
        loginResponse.data.accessToken,
        loginResponse.data.refreshToken
      );

      // Set tokens in API client
      apiClient.setAuthTokens(
        loginResponse.data.accessToken,
        loginResponse.data.refreshToken
      );

      envLog('Login successful');
    }

    // Authenticated API call
    const productsResponse = await apiClient.get(API_ENDPOINTS.products.list);
    envLog('Products:', productsResponse.data);

  } catch (error) {
    console.error('API Error:', error);
  }
};

// Example 2: Environment-specific behavior
export const exampleEnvironmentUsage = () => {
  const envInfo = getEnvironmentInfo();
  envLog('Current Environment:', envInfo);

  // Different behavior based on environment
  if (isDevelopment()) {
    envLog('Development mode - enabling debug features');
    // Enable debug logging, mock data, etc.
  } else {
    envLog('Production mode - enabling analytics and crash reporting');
    // Enable production features
  }

  // Check feature availability
  const canDebug = environmentManager.canUseFeature('debug_logging');
  const canSwitchEnv = environmentManager.canUseFeature('environment_switching');
  
  envLog('Feature flags:', { canDebug, canSwitchEnv });
};

// Example 3: Configuration inspection
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

// Example 4: Token management
export const exampleTokenManagement = async () => {
  try {
    // Retrieve stored tokens
    const { accessToken, refreshToken } = await getAuthTokens();
    
    if (accessToken) {
      // Set tokens in API client
      apiClient.setAuthTokens(accessToken, refreshToken || undefined);
      envLog('Tokens restored from secure storage');
    } else {
      envLog('No stored tokens found');
    }

    // Clear tokens on logout
    await clearAuthTokens();
    apiClient.clearAuthTokens();
    envLog('Tokens cleared');

  } catch (error) {
    console.error('Token management error:', error);
  }
};

// Example 5: Custom API client instance
export const exampleCustomApiClient = () => {
  // Create a custom API client instance
  const customClient = new ApiClient();
  
  // You can customize it further if needed
  customClient.setAuthTokens('custom-token');
  
  return customClient;
};

// Example 6: Error handling
export const exampleErrorHandling = async () => {
  try {
    // This will likely fail for demonstration
    await apiClient.get('/non-existent-endpoint');
  } catch (error: any) {
    envLog('Handling API Error:', {
      status: error.status,
      message: error.message,
      errors: error.errors,
    });

    // Handle specific error types
    if (error.status === 401) {
      envLog('Unauthorized - redirecting to login');
      await clearAuthTokens();
      // Navigate to login screen
    } else if (error.status === 500) {
      envLog('Server error - showing user-friendly message');
      // Show error toast/modal
    }
  }
};

// Example 7: File upload
export const exampleFileUpload = async (file: FormData) => {
  try {
    const response = await apiClient.uploadFile(
      '/upload/product-image',
      file,
      { timeout: 30000 } // Longer timeout for file uploads
    );

    envLog('File upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

// Example 8: Environment switching (development only)
export const exampleEnvironmentSwitching = () => {
  if (isDevelopment()) {
    envLog('Available environments:', environmentManager.getAvailableEnvironments());
    
    // Switch to staging for testing
    environmentManager.switchEnvironment('staging');
    
    // Update API client configuration
    apiClient.updateConfig();
    
    envLog('Switched to staging environment');
    envLog('New base URL:', getBaseURL());
  }
};