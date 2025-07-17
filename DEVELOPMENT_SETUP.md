# Development Setup Guide

## API Configuration

Your StockFlowPro mobile app is configured to connect to your backend API with the following URLs:

### Backend Development URLs

From your backend configuration:
- **Primary HTTPS**: `https://localhost:7001`
- **Fallback HTTP**: `http://localhost:5001`
- **IIS Express HTTPS**: `https://localhost:44310`
- **IIS Express HTTP**: `http://localhost:44352`

### React Native Configuration

The app automatically detects the platform and uses the appropriate URL:

#### Android Emulator
```typescript
// Primary: https://10.0.2.2:7001
// Fallback: http://10.0.2.2:5001
```

#### iOS Simulator
```typescript
// Primary: https://localhost:7001
// Fallback: http://localhost:5001
```

#### Web Development
```typescript
// Primary: https://localhost:7001
// Fallback: http://localhost:5001
```

#### Physical Devices
```typescript
// Use your computer's IP address
// Example: https://192.168.1.XXX:7001
```

## Environment Configuration

### .env File
```env
# Primary HTTPS endpoint (recommended)
API_BASE_URL=https://localhost:7001

# If HTTPS causes certificate issues, use HTTP
# API_BASE_URL=http://localhost:5001

API_TIMEOUT=10000
```

### Platform-Specific URLs
The app will automatically adjust the URL based on the platform:
- **Android**: Replaces `localhost` with `10.0.2.2`
- **iOS/Web**: Uses `localhost` as-is
- **Physical Device**: Use your computer's IP address in `.env`

## HTTPS Certificate Issues

If you encounter HTTPS certificate issues in development:

### Option 1: Use HTTP (Recommended for Development)
Update your `.env` file:
```env
API_BASE_URL=http://localhost:5001
```

### Option 2: Accept Self-Signed Certificates
For Android development, you may need to configure your app to accept self-signed certificates.

### Option 3: Use HTTP for Development, HTTPS for Production
The app is configured to automatically handle this based on the `__DEV__` flag.

## SignalR Configuration

The SignalR hub URL is automatically constructed as:
```typescript
const hubUrl = `${baseURL}/stockflowhub`;
```

Examples:
- **Development**: `https://localhost:7001/stockflowhub`
- **Android**: `https://10.0.2.2:7001/stockflowhub`
- **Production**: `https://your-production-domain.com/stockflowhub`

## Testing the Connection

### 1. Check Console Logs
The app logs detailed information about API connections:
```
🌐 API Service initialized with base URL: https://localhost:7001
📱 Platform: ios
🚀 API Request: GET /api/products?activeOnly=true&page=1&limit=10
✅ API Response: 200 /api/products
```

### 2. Network Debugging
If you see network errors:
1. Verify your backend is running on the expected port
2. Check if HTTPS certificates are properly configured
3. Try switching to HTTP endpoints
4. For physical devices, ensure your computer and device are on the same network

### 3. Common Issues

#### ERR_NAME_NOT_RESOLVED
- Backend is not running
- Wrong URL configuration
- Network connectivity issues

#### Certificate/SSL Errors
- Switch to HTTP endpoints for development
- Configure certificate trust (advanced)

#### Connection Refused
- Backend is not running on the specified port
- Firewall blocking the connection
- Wrong port number

## Production Deployment

When deploying to production:

1. **Update Environment Variables**:
   ```env
   API_BASE_URL=https://your-production-api.com
   ```

2. **Update API Service**:
   The production URL is automatically used when `__DEV__` is false.

3. **SignalR Hub**:
   Will automatically use the production URL: `https://your-production-api.com/stockflowhub`

## Quick Setup Commands

### Start Backend (if using .NET)
```bash
dotnet run --urls="https://localhost:7001;http://localhost:5001"
```

### Start React Native App
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Check API Connection
The app will automatically log connection details in the console. Look for:
- ✅ Successful connections
- ❌ Error messages with details
- 🌐 Base URL being used

## Troubleshooting

### If API calls fail:
1. Check the console logs for the exact URL being used
2. Verify your backend is running on that URL
3. Try the HTTP fallback if HTTPS fails
4. For physical devices, update `.env` with your computer's IP address

### If SignalR fails:
1. Ensure your backend has SignalR configured
2. Check that the hub is available at `/stockflowhub`
3. Verify the same base URL works for regular API calls

### Platform-Specific Issues:
- **Android**: Use `10.0.2.2` instead of `localhost`
- **iOS**: Should work with `localhost`
- **Physical Device**: Must use computer's IP address
- **Web**: Should work with `localhost`