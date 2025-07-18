import React from 'react';
import {
  Platform,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HomeScreen,
  UserManagementScreen,
  CounterScreen,
  SettingsScreen,
} from '../screens';
import { CustomTabBar, CustomHeader, UserDropdown } from '../components/navigation';
import { AuthNavigator } from './AuthNavigator';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography } from '../theme';
import { BottomTabParamList } from '../types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Modern navigation theme
const navigationTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.error,
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700' as const,
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '900' as const,
    },
  },
};


// Screen options for consistent styling
const getScreenOptions = (title: string) => ({
  header: () => (
    <CustomHeader 
      title={title} 
      rightComponent={<UserDropdown testID="user-dropdown" />} 
    />
  ),
  tabBarHideOnKeyboard: true,
});

// Main App Tabs Component
const MainAppTabs: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        tabBarHideOnKeyboard: Platform.OS === 'android',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
          height: Platform.OS === 'ios' ? 88 : 68,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={getScreenOptions('Home')}
      />
      <Tab.Screen
        name="Users"
        component={UserManagementScreen}
        options={getScreenOptions('User')}
      />
      <Tab.Screen
        name="Counter"
        component={CounterScreen}
        options={getScreenOptions('Counter')}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={getScreenOptions('Settings')}
      />
    </Tab.Navigator>
  );
};

// Loading Component
const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <NavigationContainer theme={navigationTheme}>
      {isLoading ? (
        <LoadingScreen />
      ) : isAuthenticated ? (
        <MainAppTabs />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});