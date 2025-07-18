# StockFlowPro - Modern React Native Application

## 📱 Overview

StockFlowPro is a comprehensive mobile application built with React Native and Expo, designed for stock management, inventory tracking, and real-time product monitoring. The application features a modern layered architecture with Zustand for state management and React Query for server state synchronization.

## 🏗️ Architecture

### Layered Architecture Pattern
The application follows a **Layered Architecture with Zustand + React Query** pattern, providing:

- **Presentation Layer** (`src/presentation/`): UI components and screens
- **State Management Layer** (`src/state/`): Zustand stores and React Query configuration
- **Business Logic Layer** (`src/business/`): Domain-specific logic and validation
- **Service Layer** (`src/services/`): API communication and external integrations
- **Infrastructure Layer** (`src/infrastructure/`): Cross-cutting concerns and providers

### Key Technologies
- **React Native 0.79.4** with **Expo ~53.0.13**
- **TypeScript** for type safety
- **Zustand** for global state management
- **React Query (@tanstack/react-query)** for server state
- **React Navigation** for navigation
- **SignalR** for real-time updates
- **Axios** for HTTP requests

## 📁 Project Structure

```
src/
├── business/                    # Business logic layer
│   ├── dtos/                   # Data Transfer Objects
│   │   ├── AuctionDTO.ts       # Auction-related data contracts
│   │   ├── BidDTO.ts           # Bidding data contracts
│   │   └── UserDTO.ts          # User data contracts
│   ├── enums/                  # Application constants
│   │   └── AppEnums.ts         # Status enums, notification types
│   ├── helpers/                # Utility classes
│   │   ├── CurrencyHelper.ts   # Currency formatting utilities
│   │   ├── DateHelper.ts       # Date manipulation utilities
│   │   └── ValidationHelper.ts # Form validation logic
│   └── hooks/                  # Business logic hooks
│       ├── useAppState.ts      # App state management
│       ├── useCamera.ts        # Camera functionality
│       └── useCustomNavigation.ts # Navigation business logic
├���─ components/                  # Reusable UI components
│   ├── auth/                   # Authentication components
│   ├── common/                 # Shared UI components (Box, Text, Button)
│   ├── forms/                  # Form components
│   ├── navigation/             # Navigation components
│   ├── parallax/               # Parallax effects
│   │   └── ParallaxHero.tsx    # Hero section with parallax
│   ├── user/                   # User-related components
│   ├── widgets/                # Dashboard widgets
│   ├── ApiConnectionTest.tsx   # API connectivity testing
│   ├── ApiHealthStatus.tsx     # API health monitoring
│   ├── ErrorBoundary.tsx       # Error boundary component
│   ├── ProductCard.tsx         # Product display component
│   └── SplashScreen.tsx        # App splash screen
├── contexts/                    # React contexts
│   ├── AuthContext.tsx         # Authentication context
│   └── WidgetMarketplace.tsx   # Widget marketplace context
├── hooks/                      # Custom React hooks
│   ├── useApiHealth.ts         # API health monitoring
│   ├── useAuth.ts              # Authentication hooks
│   ├── useDashboard.ts         # Dashboard data hooks
│   ├── useProducts.ts          # Product management hooks
│   └── useSignalR.ts           # Real-time SignalR hooks
├── infrastructure/             # Infrastructure layer
│   ├── hooks/                  # Infrastructure hooks
│   │   └── useSingleton.ts     # Singleton state management
│   └── providers/              # Application providers
│       ├── AppProvider.tsx     # Root application provider
│       ├── EnvironmentProvider.tsx # Environment configuration
│       └── PushNotificationProvider.tsx # Push notifications
├── navigation/                 # Navigation configuration
│   └── index.ts                # Navigation setup
├── screens/                    # Application screens
│   ├── CounterScreen.tsx       # Counter example screen
│   ├── HomeScreen.tsx          # Main dashboard screen
│   ├── LoginScreen.tsx         # User authentication
│   ├── RegisterScreen.tsx      # User registration
│   ├── SettingsScreen.tsx      # App settings
│   └── UserManagementScreen.tsx # User management
├── services/                   # Service layer
│   ├── api/                    # API services
│   │   ├── ApiClient.ts        # HTTP client configuration
│   │   ├── apiService.ts       # Main API service
│   │   ├── apiServiceMethods.ts # API method implementations
│   │   ├── HealthCheckService.ts # API health checking
│   │   └── mockApiService.ts   # Mock API for development
│   ├── config/                 # Configuration services
│   │   └── index.ts            # App configuration
│   ├── shared-library/         # Shared library integration
│   │   └── index.ts            # External library services
│   ├── config.ts               # Environment configuration
│   ├── environment.ts          # Environment management
│   ├── secureStorage.ts        # Secure storage utilities
│   └── signalRService.ts       # Real-time communication
├── state/                      # State management
│   ├── react-query/            # React Query configuration
│   │   ├── keys.ts             # Query key factory
│   │   └── queryClient.ts      # Query client setup
│   ├── zustand/                # Zustand stores
│   │   ├── accountStore.ts     # User account state
│   │   ├── auctionRegistrationStore.ts # Auction registration
│   │   ├── counterStore.ts     # Counter example state
│   │   ├── filterStore.ts      # Search and filter state
│   │   ├── notificationsStore.ts # Notifications state
│   │   └── wishlistStore.ts    # Wishlist state
│   └── providers/              # State providers
│       └── AppProviders.tsx    # Combined state providers
├── theme/                      # Design system
│   ├── colors.ts               # Color palette
│   ├── spacing.ts              # Spacing and layout
│   ├── typography.ts           # Typography system
│   └── index.ts                # Theme exports
├── types/                      # TypeScript type definitions
│   ├── navigation.types.ts     # Navigation types
│   ├── user.types.ts           # User-related types
│   └── index.ts                # Type exports
└── utils/                      # Utility functions
    ├── config.ts               # Configuration utilities
    ├── errorHandler.ts         # Error handling utilities
    ├── logger.ts               # Logging utilities
    ├── platformUtils.ts        # Platform-specific utilities
    └── validation.ts           # Validation utilities
```

## 🚀 Features

### Core Functionality
- **Product Management**: Create, read, update, and delete products
- **Inventory Tracking**: Real-time stock level monitoring
- **User Authentication**: Secure login/registration system
- **Dashboard Analytics**: Comprehensive inventory statistics
- **Real-time Updates**: SignalR integration for live data
- **Search & Filtering**: Advanced product search capabilities
- **Wishlist Management**: User wishlist functionality
- **Notifications**: Push notification system

### Technical Features
- **Offline Support**: Local data caching with React Query
- **Error Handling**: Comprehensive error boundary system
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Cross-platform UI components
- **Performance Optimization**: Optimistic updates and caching
- **Development Tools**: Hot reloading, debugging tools
- **Testing**: Jest configuration with testing utilities

## 🛠️ Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- React Native development environment

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StockFlowPro-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file with appropriate values:
   ```env
   # API Configuration
   API_BASE_URL=https://localhost:7001
   API_TIMEOUT=10000
   
   # Environment
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   # Start Expo development server
   npm start
   
   # Platform-specific commands
   npm run android    # Android emulator
   npm run ios        # iOS simulator
   npm run web        # Web browser
   ```

### Backend Connection

The app is configured to connect to your backend API with automatic platform detection:

- **Android Emulator**: `https://10.0.2.2:7001`
- **iOS Simulator**: `https://localhost:7001`
- **Web Development**: `https://localhost:7001`
- **Physical Devices**: Use your computer's IP address

For detailed backend setup instructions, see [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md).

## 📱 Platform Support

### Supported Platforms
- **iOS**: Native iOS app via Expo
- **Android**: Native Android app via Expo
- **Web**: Progressive Web App (PWA)

### Platform-Specific Features
- **iOS**: Native navigation, haptic feedback
- **Android**: Material Design components, edge-to-edge display
- **Web**: Responsive design, keyboard navigation

## 🔧 Scripts

### Development
```bash
npm start          # Start Expo development server
npm run dev        # Start with cache clearing
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run web:dev    # Web with cache clearing
npm run web:hot    # Web with fast refresh
```

### Code Quality
```bash
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run format     # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check # TypeScript type checking
```

### Testing
```bash
npm test           # Run tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:ci    # Run tests for CI
```

### Utilities
```bash
npm run remove-comments        # Remove code comments
npm run remove-comments:src    # Remove comments from src/
npm run remove-comments:dry-run # Preview comment removal
```

## 🏛️ State Management

### Zustand Stores
The application uses Zustand for global state management with the following stores:

- **accountStore**: User authentication and profile data
- **counterStore**: Example counter implementation
- **filterStore**: Search and filtering state
- **auctionRegistrationStore**: Auction registration data
- **notificationsStore**: App notifications
- **wishlistStore**: User wishlist items

### React Query Integration
Server state is managed with React Query for:
- **Caching**: Intelligent data caching
- **Background Updates**: Automatic data synchronization
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Retry logic and error states

## 🔌 API Integration

### API Services
- **ApiClient**: HTTP client with interceptors
- **HealthCheckService**: API health monitoring
- **SignalRService**: Real-time communication
- **MockApiService**: Development mock data

### Endpoints
The application connects to various API endpoints:
- `/api/products` - Product management
- `/api/auth` - Authentication
- `/api/dashboard` - Analytics data
- `/stockflowhub` - SignalR hub

## 🎨 Design System

### Theme Structure
- **Colors**: Comprehensive color palette with semantic naming
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized spacing scale
- **Components**: Reusable UI components (Box, Text, Button)

### Component Library
Custom components built for consistency:
- **Box**: Layout container with theme integration
- **Text**: Typography component with variants
- **Button**: Interactive button with multiple styles
- **ProductCard**: Product display component
- **ErrorBoundary**: Error handling wrapper

## 🔒 Security

### Authentication
- Secure token storage with react-native-keychain
- Automatic token refresh
- Protected route navigation

### Data Protection
- Secure storage for sensitive data
- Input validation and sanitization
- Error boundary protection

## 📊 Performance

### Optimization Strategies
- **React Query Caching**: Reduces API calls
- **Zustand Minimal Re-renders**: Efficient state updates
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Optimized asset loading
- **Bundle Analysis**: Webpack bundle optimization

### Monitoring
- Performance metrics tracking
- Error reporting and logging
- API response time monitoring

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API and state integration
- **E2E Tests**: Full user flow testing

### Testing Tools
- **Jest**: Test runner and framework
- **React Native Testing Library**: Component testing
- **Mock Services**: API mocking for tests

## 📚 Documentation

### Additional Documentation
- [LAYERED_ARCHITECTURE.md](./LAYERED_ARCHITECTURE.md) - Detailed architecture guide
- [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) - Backend connection setup
- [BACKEND_CONNECTION_GUIDE.md](./BACKEND_CONNECTION_GUIDE.md) - API integration guide
- [ERROR_SOLUTIONS.md](./ERROR_SOLUTIONS.md) - Common error solutions
- [ESLINT_FIXES.md](./ESLINT_FIXES.md) - Code quality guidelines

### Code Comments
The codebase includes comprehensive comments explaining:
- **Component Purpose**: What each component does
- **Business Logic**: Complex algorithms and workflows
- **API Integration**: Service layer implementations
- **State Management**: Store patterns and data flow
- **Type Definitions**: Interface and type explanations

## 🚀 Deployment

### Build Commands
```bash
# Production build
expo build:android
expo build:ios
expo build:web

# Development build
expo publish
```

### Environment Configuration
- **Development**: Local API endpoints
- **Staging**: Staging server configuration
- **Production**: Production API endpoints

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Run code quality checks
4. Submit pull request with description

### Code Standards
- TypeScript for all new code
- ESLint and Prettier configuration
- Comprehensive test coverage
- Documentation for complex logic

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- Check [ERROR_SOLUTIONS.md](./ERROR_SOLUTIONS.md) for common issues
- Review [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) for setup problems
- Consult the [LAYERED_ARCHITECTURE.md](./LAYERED_ARCHITECTURE.md) for architecture questions

### Common Issues
- **API Connection**: Verify backend is running and URLs are correct
- **Platform Issues**: Check platform-specific configuration
- **Build Errors**: Clear cache and reinstall dependencies
- **Type Errors**: Run type checking and fix TypeScript issues

---

**StockFlowPro** - Built with ❤️ using React Native, TypeScript, and modern development practices.