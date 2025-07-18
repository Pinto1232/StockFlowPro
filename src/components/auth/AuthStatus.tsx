import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, typography, borderRadius } from '../../theme';

export const AuthStatus: React.FC = () => {
  const { user, isAuthenticated, logout, isLoading, refreshUser } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const handleRefreshUser = async () => {
    try {
      await refreshUser();
      Alert.alert('Success', 'User data refreshed');
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh user data');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Not authenticated</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userRole}>Role: {user.role}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshUser}>
          <Text style={styles.refreshButtonText}>Refresh Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    margin: spacing.md,
  },
  loadingText: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statusText: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  userInfo: {
    marginBottom: spacing.lg,
  },
  welcomeText: {
    ...typography.textStyles.h4,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  userName: {
    ...typography.textStyles.h4,
    color: colors.textPrimary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  userRole: {
    ...typography.textStyles.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  actions: {
    gap: spacing.md,
  },
  refreshButton: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  refreshButtonText: {
    ...typography.textStyles.button,
    color: colors.primary,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  logoutButtonText: {
    ...typography.textStyles.button,
    color: colors.surface,
    fontWeight: '500',
  },
});