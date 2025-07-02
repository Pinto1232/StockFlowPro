import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, UserManagementScreen, CounterScreen, SettingsScreen } from '../screens';
import { CustomTabBar, CustomHeader } from '../components/navigation';
import { colors, spacing } from '../theme';
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
  header: () => <CustomHeader title={title} />,
  tabBarHideOnKeyboard: true,
});

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
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
          name="HomeTab"
          component={HomeScreen}
          options={getScreenOptions('Home')}
        />
        <Tab.Screen
          name="UsersTab"
          component={UserManagementScreen}
          options={getScreenOptions('User Management')}
        />
        <Tab.Screen
          name="CounterTab"
          component={CounterScreen}
          options={getScreenOptions('Counter')}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsScreen}
          options={getScreenOptions('Settings')}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};