# StockFlow Pro Mobile - API Configuration

This directory contains the API configuration and services for the StockFlow Pro mobile application, designed to work seamlessly with the web application's backend.

## 📁 File Structure

```
src/services/
├── config.ts              # Main configuration file with base URLs and settings
├── environment.ts         # Environment management utilities
├── secureStorage.ts       # Secure storage for sensitive data
├── api/
│   ├── apiService.ts      # Legacy API service (updated to use config)
│   └── ApiClient.ts       # New comprehensive API client
├── examples/
│   └── configUsage.ts     # Usage examples and best practices
└── README.md              # This file
```

## 🔧 Configuration

### Base URLs

The configuration supports multiple environments with the following base URLs:

- **Development**: `http://localhost:5000/api`
- **Staging**: `https://staging-api.stockflowpro.com/api`
- **Production**: `https://api.stockflowpro.com/api`

### Platform-Specific Adjustments

The configuration automatically adjusts URLs for different platforms:

- **Android Emulator**: Converts `localhost` to `10.0.2.2`
- **iOS Simulator**: Uses `localhost` directly
- **Physical Devices**: Uses the actual server URLs

## 🚀 Quick Start

### 1. Basic API Usage

```typescript
import { apiClient, API_ENDPOINTS } from '../services';

// Health check
const isHealthy = await apiClient.healthCheck();

// Login
const loginResponse = await apiClient.post(API_ENDPOINTS.auth.login, {
  email: 'user@example.com',
  password: 'password123'
});

// Authenticated request
const products = await apiClient.get(API_ENDPOINTS.products.list);
```

### 2. Environment Detection

```typescript
import { getEnvironmentInfo, isDevelopment } from '../services';

const envInfo = getEnvironmentInfo();
console.log(`Running in ${envInfo.displayName} mode`);

if (isDevelopment()) {
  // Enable debug features
}
```

### 3. Secure Token Storage

```typescript
import { storeAuthTokens, getAuthTokens, clearAuthTokens } from '../services';

// Store tokens after login
await storeAuthTokens(accessToken, refreshToken);

// Restore tokens on app start
const { accessToken, refreshToken } = await getAuthTokens();
if (accessToken) {
  apiClient.setAuthTokens(accessToken, refreshToken);
}

// Clear tokens on logout
await clearAuthTokens();
apiClient.clearAuthTokens();
```

## 🔐 Security Features

### Token Management
- Automatic token refresh
- Secure storage integration (ready for react-native-keychain)
- Automatic token clearing on unauthorized responses

### Request Security
- SSL pinning support (production only)
- Request timeout and retry logic
- Platform-specific headers

## 🌍 Environment Management

### Available Environments
- `development` - Local development with debug logging
- `staging` - Staging environment for testing
- `production` - Production environment with optimized settings

### Environment Switching (Development Only)
```typescript
import { environmentManager } from '../services';

// Switch environment (development only)
environmentManager.switchEnvironment('staging');
apiClient.updateConfig();
```

## 📱 Platform Support

The configuration supports all React Native platforms:
- Android (Emulator and Device)
- iOS (Simulator and Device)
- Web
- Windows
- macOS

## 🔧 Configuration Options

### API Configuration
```typescript
interface ApiConfig {
  baseURL: string;           // API base URL
  timeout: number;           // Request timeout in ms
  retryAttempts: number;     // Number of retry attempts
  retryDelay: number;        // Delay between retries in ms
  enableLogging: boolean;    // Enable request/response logging
}
```

### Request Options
```typescript
interface RequestOptions {
  timeout?: number;          // Override default timeout
  retryAttempts?: number;    // Override retry attempts
  retryDelay?: number;       // Override retry delay
  headers?: Record<string, string>; // Additional headers
  enableLogging?: boolean;   // Override logging setting
  skipAuth?: boolean;        // Skip authentication
}
```

## 📊 API Endpoints

All API endpoints are centrally defined and include:

### Authentication
- Login/Logout
- Session management
- Token refresh
- Password reset

### Users
- User CRUD operations
- Profile management
- Search functionality

### Products
- Product management
- Stock updates
- Dashboard statistics
- Categories

### Inventory
- Inventory tracking
- Movement history
- Adjustments
- Reports

### Orders
- Order management
- Fulfillment
- Cancellation

## 🛠️ Advanced Usage

### Custom API Client
```typescript
import { ApiClient } from '../services';

const customClient = new ApiClient();
customClient.setAuthTokens('custom-token');
```

### File Uploads
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await apiClient.uploadFile('/upload/image', formData);
```

### Error Handling
```typescript
try {
  const response = await apiClient.get('/some-endpoint');
} catch (error) {
  if (error.status === 401) {
    // Handle unauthorized
  } else if (error.status === 500) {
    // Handle server error
  }
}
```

## 🔄 Migration from Legacy API Service

The new configuration is backward compatible. Existing code using the legacy `apiService.ts` will continue to work, but we recommend migrating to the new `ApiClient` for better features and type safety.

### Before (Legacy)
```typescript
import { getBaseURL, ENDPOINTS } from '../services/api/apiService';
```

### After (New)
```typescript
import { apiClient, API_ENDPOINTS } from '../services';
```

## 📝 TODO

- [ ] Integrate with react-native-keychain for secure storage
- [ ] Add SSL pinning implementation
- [ ] Add offline support with request queuing
- [ ] Add request/response interceptors
- [ ] Add analytics integration
- [ ] Add crash reporting integration

## 🤝 Contributing

When adding new API endpoints or configuration options:

1. Update the `config.ts` file with new endpoints
2. Add appropriate TypeScript types
3. Update this README with usage examples
4. Add examples to `configUsage.ts`
5. Test on all supported platforms

## 📚 Related Documentation

- [React Native Network Configuration](https://reactnative.dev/docs/network)
- [React Native Keychain](https://github.com/oblador/react-native-keychain)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)