import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useEnvironment } from '../infrastructure/providers/EnvironmentProvider';
import { useAuth } from '../contexts/AuthContext';
import { Logger } from '../utils';

// Single Responsibility Principle - This screen only handles settings
export const SettingsScreen: React.FC = () => {
  const { config, isDevelopment } = useEnvironment();
  const { user, logout, isLoading } = useAuth();
  const logger = Logger.getInstance();

  const handleClearLogs = () => {
    Alert.alert(
      'Clear Logs',
      'Are you sure you want to clear all logs?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            logger.clearLogs();
            Alert.alert('Success', 'Logs cleared');
          },
        },
      ]
    );
  };

  const handleViewLogs = () => {
    const logs = logger.getLogs();
    const logCount = logs.length;
    Alert.alert('Logs', `Total logs: ${logCount}\nCheck console for details`);
    // eslint-disable-next-line no-console
    console.log('Application Logs:', logs);
  };

  const handleTestError = () => {
    logger.error('Test error message', 'SettingsScreen');
    Alert.alert('Test', 'Error logged - check console');
  };

  const handleTestInfo = () => {
    logger.info('Test info message', 'SettingsScreen');
    Alert.alert('Test', 'Info logged - check console');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Alert.alert('Success', 'You have been logged out');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {/* User Authentication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {user && (
            <>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Name:</Text>
                <Text style={styles.configValue}>{user.name}</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Email:</Text>
                <Text style={styles.configValue}>{user.email}</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Role:</Text>
                <Text style={styles.configValue}>{user.role}</Text>
              </View>
            </>
          )}
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Environment Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environment</Text>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Environment:</Text>
            <Text style={styles.configValue}>{config.environment}</Text>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>API Base URL:</Text>
            <Text style={styles.configValue} numberOfLines={1}>
              {config.apiBaseUrl}
            </Text>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Tenant:</Text>
            <Text style={styles.configValue}>{config.tenant}</Text>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Version:</Text>
            <Text style={styles.configValue}>{config.version}</Text>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Build Number:</Text>
            <Text style={styles.configValue}>{config.buildNumber}</Text>
          </View>
        </View>

        {/* Feature Flags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feature Flags</Text>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Logging Enabled:</Text>
            <Text style={[styles.configValue, config.enableLogging ? styles.enabled : styles.disabled]}>
              {config.enableLogging ? 'Yes' : 'No'}
            </Text>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Analytics Enabled:</Text>
            <Text style={[styles.configValue, config.enableAnalytics ? styles.enabled : styles.disabled]}>
              {config.enableAnalytics ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        {/* Logging */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logging</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleViewLogs}>
              <Text style={styles.buttonText}>View Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClearLogs}>
              <Text style={styles.buttonText}>Clear Logs</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.testButton]} onPress={handleTestInfo}>
              <Text style={styles.buttonText}>Test Info Log</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.errorButton]} onPress={handleTestError}>
              <Text style={styles.buttonText}>Test Error Log</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Info</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Architecture:</Text>
            <Text style={styles.infoValue}>Layered Architecture</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>State Management:</Text>
            <Text style={styles.infoValue}>Zustand + React Query</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>UI Framework:</Text>
            <Text style={styles.infoValue}>React Native</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Navigation:</Text>
            <Text style={styles.infoValue}>React Navigation</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Development Mode:</Text>
            <Text style={[styles.infoValue, isDevelopment ? styles.enabled : styles.disabled]}>
              {isDevelopment ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#FF9500',
  },
  testButton: {
    backgroundColor: '#5856D6',
  },
  errorButton: {
    backgroundColor: '#FF3B30',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  configLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  configValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  enabled: {
    color: '#34C759',
  },
  disabled: {
    color: '#FF3B30',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});