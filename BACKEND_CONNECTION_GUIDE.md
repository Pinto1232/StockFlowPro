# Backend Connection Guide

## Issue Summary

Your mobile app is trying to connect to a backend server at `http://localhost:5131/api/health` but receiving a 404 error. This means either:

1. **Backend server is not running**
2. **Backend doesn't have a `/api/health` endpoint**
3. **Backend is running on a different port**

## Quick Diagnosis

Run this command to check your backend status:

```bash
node scripts/check-backend.js
```

This will test all the endpoints your app needs and show you exactly what's working and what's not.

## Solutions

### Option 1: Start Your Backend Server

If your backend server isn't running:

1. **For .NET Backend:**
   ```bash
   cd path/to/your/backend/project
   dotnet run
   ```

2. **For Node.js Backend:**
   ```bash
   cd path/to/your/backend/project
   npm start
   ```

3. **Verify it's running on port 5131:**
   - Open your browser and go to `http://localhost:5131`
   - You should see your backend application

### Option 2: Update Backend Configuration

If your backend is running on a different port, update the mobile app configuration:

1. **Edit the config file:**
   ```typescript
   // src/services/config/index.ts
   const BASE_URLS = {
     development: 'http://localhost:YOUR_ACTUAL_PORT/api',
     // ...
   };
   ```

2. **Common backend ports:**
   - .NET: 5000, 5001, 7000, 7001
   - Node.js: 3000, 8000, 8080
   - Express: 3000, 4000

### Option 3: Add Health Endpoint to Backend

If your backend doesn't have a health endpoint, add one:

**For .NET (ASP.NET Core):**
```csharp
// In your controller or minimal API
app.MapGet("/api/health", () => new { 
    status = "healthy", 
    timestamp = DateTime.UtcNow 
});
```

**For Node.js/Express:**
```javascript
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});
```

### Option 4: Use Mock Data (Temporary)

If you can't get the backend running right now, you can use mock data:

1. **Update your component to use mock data:**
   ```typescript
   // In your component
   const { data, isLoading, error } = useProductsEnhanced({
     dataSource: 'mock', // Use mock data instead of API
     fallbackToMock: true
   });
   ```

## What We've Fixed

The mobile app now handles backend connection issues more gracefully:

1. **Improved Health Check:** If `/api/health` doesn't exist, it tries `/api/products` as a fallback
2. **Better Error Handling:** The app won't crash if the backend is unavailable
3. **Development Mode:** In development, the app keeps you logged in even if health checks fail

## Testing Your Fix

1. **Start your backend server**
2. **Run the health check script:**
   ```bash
   node scripts/check-backend.js
   ```
3. **Restart your mobile app**
4. **Check the console logs** - you should see successful API calls instead of 404 errors

## Common Backend Endpoints

Your mobile app expects these endpoints:

- `GET /api/health` - Health check
- `GET /api/products` - Get products list
- `GET /api/products/{id}` - Get single product
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/dashboard/stats` - Dashboard statistics

## Need Help?

If you're still having issues:

1. **Check your backend logs** for errors
2. **Verify CORS is configured** to allow requests from your mobile app
3. **Test endpoints directly** using curl or Postman:
   ```bash
   curl http://localhost:5131/api/health
   curl http://localhost:5131/api/products
   ```

## Environment Variables

You can also set environment variables to control the API behavior:

```bash
# Use mock data instead of real API
REACT_APP_USE_MOCK_API=true

# Change the API base URL
REACT_APP_API_BASE_URL=http://localhost:3000/api
```