// Navigation types for React Navigation
export type RootStackParamList = {
  Home: undefined;
  UserManagement: undefined;
  Counter: undefined;
  Settings: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Users: undefined;
  Counter: undefined;
  Settings: undefined;
};

// Screen props types
export interface ScreenProps {
  navigation: any; // React Navigation navigation prop
  route: any; // React Navigation route prop
}

// Navigation service interface
export interface INavigationService {
  navigate(routeName: string, params?: any): void;
  goBack(): void;
  reset(routeName: string): void;
}