
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

export interface ScreenProps {
  navigation: any; 
  route: any; 
}

export interface INavigationService {
  navigate(routeName: string, params?: any): void;
  goBack(): void;
  reset(routeName: string): void;
}