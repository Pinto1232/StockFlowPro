# ESLint Fixes for HomeScreen.tsx

## Issues Found

1. **Line 28**: `'isProductsError' is assigned a value but never used.`
2. **Line 36**: `'isDashboardError' is assigned a value but never used.`

## Solutions

### Option 1: Remove Unused Variables (Recommended)

Replace the destructuring assignments to remove the unused variables:

```typescript
// Current (with unused variables)
const { 
  data: productsData, 
  isLoading: productsLoading, 
  error: productsError,
  refetch: refetchProducts,
  isError: isProductsError  // ❌ Unused
} = useProducts({ 
  activeOnly: true
});

const { 
  data: dashboardData, 
  error: dashboardError,
  isError: isDashboardError  // ❌ Unused
} = useDashboardStats();

// Fixed (without unused variables)
const { 
  data: productsData, 
  isLoading: productsLoading, 
  error: productsError,
  refetch: refetchProducts
} = useProducts({ 
  activeOnly: true
});

const { 
  data: dashboardData, 
  error: dashboardError
} = useDashboardStats();
```

### Option 2: Use the Variables

If you want to keep the variables, you can use them in your error handling:

```typescript
// Add error status indicators
{isProductsError && (
  <View style={styles.errorIndicator}>
    <Text style={styles.errorIndicatorText}>⚠️ Products Error</Text>
  </View>
)}

{isDashboardError && (
  <View style={styles.errorIndicator}>
    <Text style={styles.errorIndicatorText}>⚠️ Dashboard Error</Text>
  </View>
)}
```

### Option 3: Prefix with Underscore (ESLint Ignore)

```typescript
const { 
  data: productsData, 
  isLoading: productsLoading, 
  error: productsError,
  refetch: refetchProducts,
  isError: _isProductsError  // Prefixed with _ to indicate intentionally unused
} = useProducts({ 
  activeOnly: true
});

const { 
  data: dashboardData, 
  error: dashboardError,
  isError: _isDashboardError  // Prefixed with _ to indicate intentionally unused
} = useDashboardStats();
```

## Quick Fix Commands

To quickly fix these issues, you can:

1. **Manual Fix**: Edit the file and remove the unused variables from the destructuring
2. **ESLint Auto-fix**: Run `npm run lint -- --fix` if your ESLint is configured for auto-fixing
3. **VS Code**: Use the "Quick Fix" option (Ctrl+. or Cmd+.) when hovering over the error

## Recommended Solution

**Remove the unused variables** since they're not being used in the current implementation. This keeps the code clean and follows the principle of not declaring variables you don't need.

The fixed destructuring should look like:

```typescript
// React Query data fetching with error handling
const { 
  data: productsData, 
  isLoading: productsLoading, 
  error: productsError,
  refetch: refetchProducts
} = useProducts({ 
  activeOnly: true
});

const { 
  data: dashboardData, 
  error: dashboardError
} = useDashboardStats();
```

This will resolve both ESLint warnings while maintaining the same functionality.