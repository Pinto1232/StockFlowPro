import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '../../theme';


interface TabIconProps {
  routeName: string;
  focused: boolean;
  color: string;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({ routeName, focused, color, size }) => {
  const getIconName = (route: string, isFocused: boolean) => {
    switch (route) {
      case 'Home':
        return isFocused ? 'home' : 'home-outline';
      case 'Users':
        return isFocused ? 'people' : 'people-outline';
      case 'Counter':
        return isFocused ? 'calculator' : 'calculator-outline';
      case 'Settings':
        return isFocused ? 'settings' : 'settings-outline';
      default:
        return 'circle-outline';
    }
  };

  return (
    <Ionicons
      name={getIconName(routeName, focused) as any}
      size={size}
      color={color}
    />
  );
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={`tab-${route.name}`}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={[
                styles.tabContent,
                isFocused && styles.tabContentFocused
              ]}>
                <View style={[
                  styles.iconContainer,
                  isFocused && styles.iconContainerFocused
                ]}>
                  <TabIcon
                    routeName={route.name}
                    focused={isFocused}
                    color={isFocused ? colors.white : colors.tabBarInactive}
                    size={22}
                  />
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? colors.tabBarActive : colors.tabBarInactive }
                  ]}
                  numberOfLines={1}
                >
                  {label as string}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.tabBarBackground,
    borderTopWidth: 1,
    borderTopColor: colors.tabBarBorder,
    ...shadows.sm,
    shadowColor: colors.shadowMedium,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.tabBarBackground,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  tabContentFocused: {
    // Additional styling for focused state if needed
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs / 2,
    backgroundColor: 'transparent',
  },
  iconContainerFocused: {
    backgroundColor: colors.tabBarActive,
    ...shadows.sm,
    shadowColor: colors.tabBarActive,
  },
  tabLabel: {
    ...typography.textStyles.caption,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});