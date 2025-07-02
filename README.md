# NeonApp - React Native + Expo + Zustand + TypeScript + MongoDB

A React Native application built with Expo, Zustand for state management, TypeScript for type safety, MongoDB for data persistence, and code formatting tools.

## Features

- ⚡ **React Native** with Expo for cross-platform development
- 🏪 **Zustand** for lightweight state management
- ��� **TypeScript** for type safety and better developer experience
- 🗄️ **MongoDB** for data persistence and storage
- 🌍 **Environment Variables** for configuration management
- 🎨 **ESLint** for code linting and quality
- ✨ **Prettier** for consistent code formatting
- 📱 **Cross-platform** - runs on iOS, Android, and Web
- 🎨 **Modern UI** with clean styling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your MongoDB connection details.

### MongoDB Setup

#### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Update `.env` with local connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/neonapp
   ```

#### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `.env` with Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neonapp?retryWrites=true&w=majority
   ```

### Running the App

#### Start the development server:

```bash
npm start
```

#### Run on specific platforms:

```bash
# iOS (requires macOS)
npm run ios

# Android (requires Android Studio/emulator)
npm run android

# Web
npm run web
```

### Using Expo Go

1. Install Expo Go on your mobile device
2. Run `npm start` to start the development server
3. Scan the QR code with Expo Go (Android) or Camera app (iOS)

### Development Tools

#### Code Quality & Formatting:

```bash
# Run ESLint to check for code issues
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is properly formatted
npm run format:check

# Type check with TypeScript
npm run type-check
```

## Project Structure

```
NeonApp/
├── App.tsx             # Main application component (TypeScript)
├── src/                # Source code organized by Clean Architecture
│   ├── core/           # Business logic (entities, use cases, repositories)
│   ├── infrastructure/ # External concerns (database, APIs)
│   ├── presentation/   # UI layer (components, controllers, hooks)
│   └── store/          # State management with Zustand
├── .env                # Environment variables (not in git)
├── .env.example        # Environment variables template
├── tsconfig.json       # TypeScript configuration
├── .eslintrc.json      # ESLint configuration
├── .prettierrc         # Prettier configuration
├── package.json        # Dependencies and scripts
├── app.json           # Expo configuration
└── assets/            # Images and other assets
```

## State Management with Zustand + MongoDB

This app demonstrates three Zustand stores with MongoDB integration:

### Counter Store

- Simple counter with increment, decrement, and reset functionality
- Save counter state to MongoDB
- Shows basic state management patterns

### User Store

- User authentication and management
- CRUD operations (Create, Read, Update, Delete)
- Login/logout functionality with database persistence
- Error handling and loading states

### Database Store

- MongoDB connection management
- Connection status monitoring
- Error handling for database operations

## Example Usage

```typescript
import { useCounterStore } from './src/store';

function MyComponent() {
  const { count, increment, decrement } = useCounterStore();

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button onPress={increment} title="+" />
      <Button onPress={decrement} title="-" />
    </View>
  );
}
```

## Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **Zustand**: Lightweight state management
- **TypeScript**: Type-safe JavaScript with enhanced developer experience
- **MongoDB**: NoSQL database for data persistence
- **Environment Variables**: Configuration management
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting and style consistency

## Learn More

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [ESLint Documentation](https://eslint.org/docs/)
- [Prettier Documentation](https://prettier.io/docs/)

## License

This project is open source and available under the [MIT License](LICENSE).
