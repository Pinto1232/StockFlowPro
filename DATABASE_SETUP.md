# Database Setup Guide

This guide explains how to set up and use the SQL Server database connection in your Neon app for both web and mobile platforms.

## Overview

Your app is configured to work with a SQL Server database using the connection string:
```
Server=localhost;Database=StockFlowProDB;Trusted_Connection=true;TrustServerCertificate=true;MultipleActiveResultSets=true;
```

## Architecture

The database integration follows a layered architecture:

1. **Configuration Layer** (`src/services/database/config.ts`)
   - Manages database connection settings
   - Platform-specific configurations
   - Environment variable handling

2. **Service Layer** (`src/services/database/service.ts`)
   - Database connection management
   - Platform-specific implementations (Web vs Mobile)
   - Query execution interface

3. **Repository Layer** (`src/services/database/repository.ts`)
   - Data access patterns
   - Business logic abstraction
   - Example CRUD operations

4. **Hook Layer** (`src/infrastructure/hooks/useDatabase.ts`)
   - React integration
   - State management
   - Easy-to-use API for components

## Platform Considerations

### Web Platform
- Uses HTTP API calls to a backend server
- Backend server handles direct SQL Server connections
- Suitable for browser security constraints

### Mobile Platform (iOS/Android)
- Also uses HTTP API calls to a backend server
- Direct SQL Server connections are not recommended on mobile
- Maintains consistent API with web platform

## Backend Server Requirements

Since both web and mobile platforms use HTTP API calls, you need a backend server that:

1. **Handles SQL Server connections directly**
2. **Provides REST API endpoints:**
   - `GET /api/database/health` - Connection health check
   - `POST /api/database/query` - Execute SELECT queries
   - `POST /api/database/execute` - Execute INSERT/UPDATE/DELETE

### Example Backend Endpoints

```javascript
// Express.js example
app.get('/api/database/health', async (req, res) => {
  // Test database connection
  res.json({ status: 'connected' });
});

app.post('/api/database/query', async (req, res) => {
  const { sql, params } = req.body;
  // Execute query and return results
  res.json({ data: results });
});

app.post('/api/database/execute', async (req, res) => {
  const { sql, params } = req.body;
  // Execute command and return affected rows
  res.json({ rowsAffected: count });
});
```

## Environment Configuration

The database configuration is stored in your `.env` file:

```env
# Database Configuration
DATABASE_CONNECTION_STRING=Server=localhost;Database=StockFlowProDB;Trusted_Connection=true;TrustServerCertificate=true;MultipleActiveResultSets=true;
DATABASE_HOST=localhost
DATABASE_NAME=StockFlowProDB
DATABASE_TRUSTED_CONNECTION=true
DATABASE_TRUST_SERVER_CERTIFICATE=true
DATABASE_MULTIPLE_ACTIVE_RESULT_SETS=true

# API Configuration (for backend communication)
API_BASE_URL=http://localhost:3000/api
```

## Usage Examples

### Basic Database Hook Usage

```typescript
import { useDatabase } from '../infrastructure/hooks/useDatabase';

const MyComponent = () => {
  const { isConnected, isLoading, error, repository } = useDatabase();

  if (isLoading) return <Text>Connecting...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (!isConnected) return <Text>Not connected</Text>;

  return <Text>Connected to database!</Text>;
};
```

### Products Hook Usage

```typescript
import { useProducts } from '../infrastructure/hooks/useDatabase';

const ProductsComponent = () => {
  const { 
    products, 
    loading, 
    error, 
    createProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();

  const handleCreateProduct = async () => {
    await createProduct({
      productName: 'New Product',
      price: 99.99,
      stockQuantity: 100
    });
  };

  return (
    <View>
      {products.map(product => (
        <Text key={product.ProductId}>{product.ProductName}</Text>
      ))}
    </View>
  );
};
```

### Direct Repository Usage

```typescript
import { stockFlowRepository } from '../services/database';

const fetchProducts = async () => {
  try {
    const products = await stockFlowRepository.getAllProducts();
    console.log('Products:', products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
```

## Database Schema Example

The repository includes example methods for a typical StockFlow database. You may need to adjust the SQL queries based on your actual database schema:

```sql
-- Example Products table structure
CREATE TABLE Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL,
    CategoryId INT,
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    ModifiedDate DATETIME2,
    IsActive BIT DEFAULT 1
);
```

## Testing the Setup

1. **Start your backend server** that handles SQL Server connections
2. **Update the API_BASE_URL** in your `.env` file to point to your backend
3. **Use the DatabaseExample component** to test the connection:

```typescript
import { DatabaseExample } from '../components/database/DatabaseExample';

// Add to your app or a test screen
<DatabaseExample />
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if your backend server is running
   - Verify the API_BASE_URL in `.env`
   - Ensure your backend can connect to SQL Server

2. **CORS Issues (Web)**
   - Configure CORS on your backend server
   - Allow requests from your web app's origin

3. **Network Issues (Mobile)**
   - Use your computer's IP address instead of localhost
   - Ensure your mobile device can reach the backend server

### Debug Steps

1. Check database connection status:
```typescript
const { isConnected, error } = useDatabase();
console.log('Connected:', isConnected, 'Error:', error);
```

2. Test backend endpoints directly:
```bash
curl http://localhost:3000/api/database/health
```

3. Enable debug logging by setting `DEBUG=true` in your `.env` file

## Next Steps

1. **Set up your backend server** with SQL Server connectivity
2. **Customize the repository methods** for your specific database schema
3. **Create additional repositories** for other database entities
4. **Add error handling and retry logic** as needed
5. **Implement caching strategies** for better performance

## Security Considerations

- Never expose SQL Server connection strings in client-side code
- Use environment variables for sensitive configuration
- Implement proper authentication and authorization in your backend
- Validate and sanitize all user inputs before database operations
- Use parameterized queries to prevent SQL injection