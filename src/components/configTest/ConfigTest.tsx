import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { 
  getEnvironmentInfo, 
  getCurrentConfig, 
  getBaseURL,
  apiService,
  mockApiService,
  realApiService 
} from '../../services';
import { colors, spacing, typography, borderRadius } from '../../theme';

export const ConfigTest: React.FC = () => {
  const [configInfo, setConfigInfo] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<string>('Not tested');
  const [apiType, setApiType] = useState<string>('Unknown');

  useEffect(() => {
    loadConfigInfo();
    detectApiType();
  }, []);

  const loadConfigInfo = () => {
    const envInfo = getEnvironmentInfo();
    const config = getCurrentConfig();
    const baseURL = getBaseURL();

    setConfigInfo({
      environment: envInfo,
      config,
      baseURL,
    });
  };

  const detectApiType = () => {
    // Check if we're using mock or real API
    if (apiService === mockApiService) {
      setApiType('Mock API (Development)');
    } else if (apiService === realApiService) {
      setApiType('Real API');
    } else {
      setApiType('Unknown API Service');
    }
  };

  const testHealthCheck = async () => {
    setHealthStatus('Testing...');
    try {
      const response = await apiService.healthCheck();
      setHealthStatus(`✅ Healthy - ${response.message}`);
    } catch (error: any) {
      setHealthStatus(`❌ Error - ${error.message}`);
    }
  };

  const testProductsAPI = async () => {
    try {
      // eslint-disable-next-line no-console
      console.log('🧪 Testing Products API...');
      const response = await apiService.getProducts({ activeOnly: true });
      // eslint-disable-next-line no-console
      console.log('📦 Products Response:', response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Products API Error:', error);
    }
  };

  const testDashboardAPI = async () => {
    try {
      // eslint-disable-next-line no-console
      console.log('🧪 Testing Dashboard API...');
      const response = await apiService.getDashboardStats();
      // eslint-disable-next-line no-console
      console.log('📊 Dashboard Response:', response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Dashboard API Error:', error);
    }
  };

  if (!configInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading configuration...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🔧 Configuration Test</Text>
      
      {}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environment</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{configInfo.environment.displayName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Is Development:</Text>
          <Text style={styles.value}>{configInfo.environment.isDevelopment ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Is Production:</Text>
          <Text style={styles.value}>{configInfo.environment.isProduction ? 'Yes' : 'No'}</Text>
        </View>
      </View>

      {}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Base URL:</Text>
          <Text style={[styles.value, styles.urlText]}>{configInfo.baseURL}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Timeout:</Text>
          <Text style={styles.value}>{configInfo.config.timeout}ms</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Retry Attempts:</Text>
          <Text style={styles.value}>{configInfo.config.retryAttempts}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Logging Enabled:</Text>
          <Text style={styles.value}>{configInfo.config.enableLogging ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>API Service:</Text>
          <Text style={[styles.value, styles.apiTypeText]}>{apiType}</Text>
        </View>
      </View>

      {}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Check</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{healthStatus}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={testHealthCheck}>
          <Text style={styles.buttonText}>Test Health Check</Text>
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Tests</Text>
        <Text style={styles.description}>
          These tests will call the API and log results to the console.
          Check the browser console or React Native debugger for output.
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={testProductsAPI}>
          <Text style={styles.buttonText}>Test Products API</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testDashboardAPI}>
          <Text style={styles.buttonText}>Test Dashboard API</Text>
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.description}>
          • In development, the app uses mock API by default{'\n'}
          • Set REACT_APP_USE_MOCK_API=false to use real API{'\n'}
          • Check console logs for detailed API responses{'\n'}
          • Base URLs are automatically selected based on environment{'\n'}
          • Android emulator uses 10.0.2.2 instead of localhost
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    padding: spacing.lg,
  },
  loadingText: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  title: {
    ...typography.textStyles.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontWeight: '700',
  },
  section: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.textStyles.h4,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  label: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
    minWidth: 100,
  },
  value: {
    ...typography.textStyles.body,
    color: colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  urlText: {
    ...typography.textStyles.caption,
    color: colors.primary,
    fontFamily: 'monospace',
  },
  apiTypeText: {
    color: colors.success,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: {
    ...typography.textStyles.button,
    color: colors.surface,
    fontWeight: '600',
  },
  description: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
});