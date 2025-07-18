import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useSignalRConnection } from '../../hooks/useSignalR';
import { HubConnectionState } from '@microsoft/signalr';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';

interface UserDropdownProps {
  testID?: string;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ testID }) => {
  const { user, logout, isLoading } = useAuth();
  const { connectionState, isConnected, isConnecting, connect, disconnect } = useSignalRConnection();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const getUserDisplayName = () => {
    if (!user) return 'User';

    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    if (user.name) {
      return user.name;
    }

    return user.email;
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    const names = displayName.split(' ');
    
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    
    return displayName.substring(0, 2).toUpperCase();
  };

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateDropdown = (show: boolean) => {
    Animated.timing(dropdownAnim, {
      toValue: show ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const animateLogout = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleDropdownToggle = () => {
    animatePress();
    const newVisibility = !isDropdownVisible;
    setIsDropdownVisible(newVisibility);
    animateDropdown(newVisibility);
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
    animateDropdown(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      animateLogout();
      closeDropdown();

      await new Promise(resolve => setTimeout(resolve, 500));
      await logout();
    } catch (error) {
      
      if (Platform.OS === 'web') {
        alert('Failed to logout. Please try again.');
      } else {
        try {
          Alert.alert('Error', 'Failed to logout. Please try again.');
        } catch {
          // eslint-disable-next-line no-console
          console.error('Logout failed:', error);
        }
      }
    } finally {
      setIsLoggingOut(false);
      rotateAnim.setValue(0);
    }
  };

  const handleSignalRToggle = async () => {
    try {
      if (isConnected) {
        await disconnect();
      } else {
        await connect();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('SignalR toggle failed:', error);
      if (Platform.OS === 'web') {
        alert('Failed to toggle SignalR connection. Please try again.');
      } else {
        try {
          Alert.alert('Error', 'Failed to toggle SignalR connection. Please try again.');
        } catch {
          // eslint-disable-next-line no-console
          console.error('SignalR toggle failed:', error);
        }
      }
    }
  };

  const getSignalRStatus = () => {
    switch (connectionState) {
      case HubConnectionState.Connected:
        return { text: 'Connected', color: colors.success, icon: 'radio' as const };
      case HubConnectionState.Connecting:
      case HubConnectionState.Reconnecting:
        return { text: 'Connecting...', color: colors.warning, icon: 'radio-outline' as const };
      case HubConnectionState.Disconnected:
      default:
        return { text: 'Disconnected', color: colors.textSecondary, icon: 'radio-outline' as const };
    }
  };

  const signalRStatus = getSignalRStatus();

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const dropdownScale = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const dropdownOpacity = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <>
      <TouchableOpacity
        style={[styles.userButton, { transform: [{ scale: scaleAnim }] }]}
        onPress={handleDropdownToggle}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        testID={testID}
      >
        <View style={styles.userAvatar}>
          <Text style={styles.userInitials}>{getUserInitials()}</Text>
        </View>
        <Ionicons
          name={isDropdownVisible ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.headerText}
          style={styles.chevronIcon}
        />
      </TouchableOpacity>

      {}
      <Modal
        visible={isDropdownVisible}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeDropdown}
        >
          <View style={styles.dropdownContainer}>
            <Animated.View
              style={[
                styles.dropdownContent,
                {
                  opacity: dropdownOpacity,
                  transform: [{ scale: dropdownScale }],
                },
              ]}
            >
              {}
              <View style={styles.userInfoSection}>
                <View style={styles.userAvatarLarge}>
                  <Text style={styles.userInitialsLarge}>{getUserInitials()}</Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {getUserDisplayName()}
                  </Text>
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {user?.email}
                  </Text>
                  <Text style={styles.userRole} numberOfLines={1}>
                    {user?.role || 'User'}
                  </Text>
                </View>
              </View>

              {}
              <View style={styles.divider} />

              {}
              <View style={styles.menuSection}>
                {}
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    isConnecting && styles.menuItemDisabled,
                  ]}
                  onPress={handleSignalRToggle}
                  disabled={isConnecting}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemContent}>
                    {isConnecting ? (
                      <ActivityIndicator size={20} color={signalRStatus.color} />
                    ) : (
                      <Ionicons
                        name={signalRStatus.icon}
                        size={20}
                        color={signalRStatus.color}
                      />
                    )}
                  </View>
                  <View style={styles.signalRTextContainer}>
                    <Text style={[styles.menuItemText, { color: signalRStatus.color }]}>
                      SignalR
                    </Text>
                    <Text style={[styles.signalRStatus, { color: signalRStatus.color }]}>
                      {signalRStatus.text}
                    </Text>
                  </View>
                </TouchableOpacity>

                {}
                <View style={styles.menuDivider} />

                {}
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    isLoggingOut && styles.menuItemDisabled,
                  ]}
                  onPress={handleLogout}
                  disabled={isLoading || isLoggingOut}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={[
                      styles.menuItemContent,
                      { transform: [{ rotate: spin }] },
                    ]}
                  >
                    {isLoggingOut ? (
                      <ActivityIndicator size={20} color={colors.error} />
                    ) : (
                      <Ionicons
                        name="log-out-outline"
                        size={20}
                        color={colors.error}
                      />
                    )}
                  </Animated.View>
                  <Text
                    style={[
                      styles.menuItemText,
                      { color: colors.error },
                      isLoggingOut && styles.menuItemTextDisabled,
                    ]}
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: 'transparent',
    minHeight: 44,
    minWidth: 44,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  userInitials: {
    ...typography.textStyles.bodySmall,
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  chevronIcon: {
    marginLeft: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dropdownContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80, 
    left: spacing.md,
    right: spacing.md,
    width: undefined, 
  },
  dropdownContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    overflow: 'hidden',
    width: '100%',
  },
  userInfoSection: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  userAvatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userInitialsLarge: {
    ...typography.textStyles.h4,
    color: colors.white,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    ...typography.textStyles.h4,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.textStyles.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  userRole: {
    ...typography.textStyles.caption,
    color: colors.primary,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  menuSection: {
    padding: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'transparent',
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  menuItemContent: {
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  menuItemText: {
    ...typography.textStyles.body,
    fontWeight: '500',
  },
  menuItemTextDisabled: {
    color: colors.textSecondary,
  },
  signalRTextContainer: {
    flex: 1,
  },
  signalRStatus: {
    ...typography.textStyles.caption,
    marginTop: 2,
    fontWeight: '400',
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
  },
});