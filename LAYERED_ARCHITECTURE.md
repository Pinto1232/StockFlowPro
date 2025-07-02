# NeonApp Layered Architecture Documentation

## Overview

NeonApp has been migrated to a **Layered Architecture with Zustand + React Query** pattern, providing a scalable, maintainable, and performant foundation for auction and bidding functionality.

## Architecture Layers

### 1. Presentation Layer (`src/presentation/`)

The presentation layer handles all UI-related concerns and user interactions.

#### Components Structure
```
src/presentation/
├── components/
│   ├── common/          # Reusable UI components (Box, Text, Button)
│   ├── auction/         # Auction-specific components
│   ├── bidding/         # Bidding-specific components
│   ├── user/            # User-related components
│   └── navigation/      # Navigation components
├── screens/             # Feature-specific screens
├── navigation/          # Navigation configuration
└── hooks/              # Presentation-specific hooks
```

#### Key Features
- **Custom Component Library**: Reusable components (Box, Text, Button) with consistent styling
- **Feature-based Organization**: Components organized by domain (auction, bidding, user)
- **React Navigation Integration**: Type-safe navigation with stack and tab navigation
- **Responsive Design**: Components adapt to different screen sizes

### 2. State Management Layer (`src/state/`)

Hybrid approach combining Zustand for global state and React Query for server state.

#### Zustand Stores Structure
```
src/state/zustand/
├── accountStore.ts              # User account state
├── counterStore.ts              # Counter example state
├── filterStore.ts               # Search and filter state
├── auctionRegistrationStore.ts  # Auction registration state
├── notificationsStore.ts        # Notifications state
└── wishlistStore.ts             # Wishlist state
```

#### React Query Structure
```
src/state/react-query/
├── queryClient.ts       # Query client configuration
└── keys.ts             # Query key factory
```

#### Key Features
- **Global State Management**: Zustand for application state with minimal boilerplate
- **Server State Management**: React Query for API data caching and synchronization
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Background Refetching**: Automatic data synchronization
- **Retry Logic**: Configurable retry strategies for failed requests
- **Persistence**: Automatic state persistence with Zustand persist middleware

### 3. Business Logic Layer (`src/business/`)

Contains domain-specific business logic, validation rules, and data transformation.

#### Structure
```
src/business/
├── hooks/               # Custom business logic hooks
│   ├── useCustomNavigation.ts   # Navigation business logic
│   ├── useCamera.ts             # Camera functionality
│   └── useAppState.ts           # App state management
├── helpers/             # Utility classes
│   ├── ValidationHelper.ts     # Form and data validation
│   ├── DateHelper.ts           # Date formatting and calculations
│   └── CurrencyHelper.ts       # Currency formatting and calculations
├── dtos/               # Data Transfer Objects
│   ├── UserDTO.ts              # User-related DTOs
│   ├── AuctionDTO.ts           # Auction-related DTOs
│   └── BidDTO.ts               # Bidding-related DTOs
└── enums/              # Application constants
    └── AppEnums.ts             # Status enums, categories, etc.
```

#### Key Features
- **Encapsulated Business Logic**: Custom hooks for complex business operations
- **Type-safe Data Contracts**: DTOs ensure consistent data structure
- **Validation Rules**: Centralized validation for forms and business rules
- **Helper Classes**: Utility functions for common operations

### 4. Service/API Layer (`src/services/`)

Handles external API communication and shared library integration.

#### Structure
```
src/services/
├── api/
│   └── apiPaths.ts             # Centralized API endpoint definitions
├── shared-library/
│   └── index.ts                # prembid-shared-library-npm integration
├── network/
│   └── NetworkRequestContextProvider.tsx  # Network configuration
└── query-client/
    └── index.ts                # React Query client configuration
```

#### Key Features
- **Centralized API Paths**: Single source of truth for all endpoints
- **Shared Library Integration**: Integration with prembid-shared-library-npm
- **Network Configuration**: Centralized network request configuration
- **Request/Response Interceptors**: Global request and response handling

### 5. Infrastructure Layer (`src/infrastructure/`)

Provides cross-cutting concerns and system-level functionality.

#### Structure
```
src/infrastructure/
├── providers/
│   ├── AppProvider.tsx              # Root application provider
│   ├── PushNotificationProvider.tsx # Push notification handling
│   └── EnvironmentProvider.tsx      # Environment configuration
└── hooks/
    └── useSingleton.ts              # Singleton hooks for shared state
```

#### Key Features
- **Provider Pattern**: Dependency injection through React Context
- **Push Notifications**: Firebase messaging integration
- **Environment Configuration**: Multi-tenant settings management
- **Singleton Hooks**: Shared stateful logic across components

## Key Architectural Benefits

### 1. Separation of Concerns
- Each layer has a specific responsibility
- Clear boundaries between UI, business logic, and data access
- Easy to test and maintain individual components

### 2. Scalability
- Feature-based organization allows teams to work independently
- Modular structure supports adding new features without affecting existing code
- Clear dependency flow prevents circular dependencies

### 3. Performance
- React Query provides intelligent caching and background updates
- Zustand offers minimal re-renders and excellent performance
- Optimistic updates provide immediate user feedback

### 4. Developer Experience
- TypeScript throughout ensures type safety
- Clear folder structure makes code easy to find
- Consistent patterns reduce cognitive load
- Zustand's simple API reduces boilerplate

### 5. Testability
- Business logic separated from UI components
- Dependency injection makes mocking easy
- Clear interfaces enable unit testing

## Data Flow

### 1. User Interaction Flow
```
User Action → Presentation Layer → Business Logic → Service Layer → API
                     ↓
State Management ← Business Logic ← Service Layer ← API Response
                     ↓
UI Update ← Presentation Layer ← State Management
```

### 2. Zustand State Management Flow
```
Component → Store Action → State Update → Component Re-render
```

### 3. Server State Flow
```
Component → useQuery/useMutation → React Query → API → Cache → Component
```

## Migration Benefits

### From Previous Architecture
1. **Simplified State Management**: Zustand + React Query provides cleaner state management with less boilerplate
2. **Better Server State Handling**: React Query handles caching, synchronization, and background updates
3. **Enhanced Type Safety**: Comprehensive TypeScript coverage with DTOs and typed stores
4. **Clearer Architecture**: Layered approach provides better separation of concerns
5. **Better Performance**: Optimized caching and minimal re-renders

### Development Workflow Improvements
1. **Faster Development**: Reusable components and clear patterns
2. **Easier Testing**: Separated business logic and dependency injection
3. **Better Debugging**: Zustand DevTools and React Query DevTools
4. **Consistent Code**: Established patterns and conventions
5. **Less Boilerplate**: Zustand's simple API reduces code complexity

## Best Practices

### 1. Component Development
- Use the custom component library (Box, Text, Button)
- Keep components focused on presentation
- Use business logic hooks for complex operations
- Implement proper error boundaries

### 2. State Management
- Use Zustand for global application state
- Use React Query for server state
- Implement optimistic updates for better UX
- Use proper error handling and loading states
- Leverage Zustand's persist middleware for data that should survive app restarts

### 3. Business Logic
- Encapsulate business rules in helper classes
- Use DTOs for type-safe data contracts
- Implement proper validation using ValidationHelper
- Keep business logic separate from UI components

### 4. API Integration
- Use centralized API paths
- Implement proper error handling
- Use React Query for caching and synchronization
- Handle network failures gracefully

### 5. Testing
- Test business logic separately from UI
- Use proper mocking for external dependencies
- Implement integration tests for critical flows
- Use React Native Testing Library for component tests

## Zustand Store Patterns

### 1. Store Structure
```typescript
interface StoreState {
  // State properties
  data: DataType[];
  isLoading: boolean;
  error: string | null;
}

interface StoreActions {
  // Action methods
  fetchData: () => Promise<void>;
  updateData: (id: string, updates: Partial<DataType>) => void;
  clearError: () => void;
}

type Store = StoreState & StoreActions;
```

### 2. Async Operations
```typescript
const useStore = create<Store>()(
  devtools(
    (set, get) => ({
      // Initial state
      data: [],
      isLoading: false,
      error: null,
      
      // Async action
      fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.fetchData();
          set({ data, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
    })
  )
);
```

### 3. Persistence
```typescript
const useStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        // Store implementation
      }),
      {
        name: 'store-name',
        partialize: (state) => ({ 
          // Only persist specific fields
          importantData: state.importantData 
        }),
      }
    )
  )
);
```

## Future Enhancements

1. **Offline Support**: Implement offline-first architecture with local storage
2. **Real-time Updates**: WebSocket integration for live bidding
3. **Performance Monitoring**: Analytics and performance tracking
4. **Internationalization**: Multi-language support
5. **Advanced Caching**: Implement more sophisticated caching strategies

This layered architecture provides a solid foundation for building scalable, maintainable, and performant auction and bidding applications with the simplicity of Zustand and the power of React Query.