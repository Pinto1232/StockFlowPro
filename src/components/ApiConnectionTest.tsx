import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

interface ApiConnectionTestProps {
  onTestComplete?: (results: any) => void;
}

export const ApiConnectionTest: React.FC<ApiConnectionTestProps> = ({
  onTestComplete,
}) => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testApiConnection = async () => {
    setTesting(true);
    const testResults = {
      timestamp: new Date().toISOString(),
      tests: [] as any[],
    };

    try {
      // Test 1: Basic connectivity to backend
      testResults.tests.push({
        name: 'Backend API Connectivity',
        endpoint: 'http://localhost:5131/api/products',
        status: 'testing',
        startTime: Date.now(),
      });

      try {
        const response = await fetch('http://localhost:5131/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const responseData = await response.text();
        let parsedData;
        
        try {
          parsedData = JSON.parse(responseData);
        } catch (parseError) {
          parsedData = responseData;
        }

        testResults.tests[0] = {
          ...testResults.tests[0],
          status: response.ok ? 'success' : 'error',
          statusCode: response.status,
          statusText: response.statusText,
          responseData: parsedData,
          endTime: Date.now(),
          duration: Date.now() - testResults.tests[0].startTime,
        };

      } catch (error) {
        testResults.tests[0] = {
          ...testResults.tests[0],
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
          endTime: Date.now(),
          duration: Date.now() - testResults.tests[0].startTime,
        };
      }

      // Test 2: Health check endpoint
      testResults.tests.push({
        name: 'Health Check',
        endpoint: 'http://localhost:5131/api/health',
        status: 'testing',
        startTime: Date.now(),
      });

      try {
        const healthResponse = await fetch('http://localhost:5131/api/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const healthData = await healthResponse.text();
        let parsedHealthData;
        
        try {
          parsedHealthData = JSON.parse(healthData);
        } catch (parseError) {
          parsedHealthData = healthData;
        }

        testResults.tests[1] = {
          ...testResults.tests[1],
          status: healthResponse.ok ? 'success' : 'error',
          statusCode: healthResponse.status,
          statusText: healthResponse.statusText,
          responseData: parsedHealthData,
          endTime: Date.now(),
          duration: Date.now() - testResults.tests[1].startTime,
        };

      } catch (error) {
        testResults.tests[1] = {
          ...testResults.tests[1],
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
          endTime: Date.now(),
          duration: Date.now() - testResults.tests[1].startTime,
        };
      }

      // Test 3: CORS check
      testResults.tests.push({
        name: 'CORS Configuration',
        endpoint: 'http://localhost:5131/api/products',
        status: 'testing',
        startTime: Date.now(),
      });

      try {
        const corsResponse = await fetch('http://localhost:5131/api/products', {
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type',
          },
        });

        testResults.tests[2] = {
          ...testResults.tests[2],
          status: corsResponse.ok ? 'success' : 'warning',
          statusCode: corsResponse.status,
          statusText: corsResponse.statusText,
          corsHeaders: {
            'Access-Control-Allow-Origin': corsResponse.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': corsResponse.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': corsResponse.headers.get('Access-Control-Allow-Headers'),
          },
          endTime: Date.now(),
          duration: Date.now() - testResults.tests[2].startTime,
        };

      } catch (error) {
        testResults.tests[2] = {
          ...testResults.tests[2],
          status: 'warning',
          error: error instanceof Error ? error.message : String(error),
          note: 'CORS preflight may not be required for simple requests',
          endTime: Date.now(),
          duration: Date.now() - testResults.tests[2].startTime,
        };
      }

    } catch (error) {
      // Silently handle test suite errors - results will show the issue
    }

    setResults(testResults);
    setTesting(false);
    onTestComplete?.(testResults);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return colors.success;
      case 'error': return colors.error;
      case 'warning': return '#FFA500';
      case 'testing': return colors.primary;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'testing': return '🔄';
      default: return '❓';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Backend API Connection Test</Text>
        <Text style={styles.subtitle}>
          Test connectivity to http://localhost:5131/api
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.testButton, testing && styles.testButtonDisabled]}
        onPress={testApiConnection}
        disabled={testing}
      >
        {testing ? (
          <View style={styles.testingContainer}>
            <ActivityIndicator size="small" color={colors.surface} />
            <Text style={styles.testButtonText}>Testing...</Text>
          </View>
        ) : (
          <Text style={styles.testButtonText}>🧪 Run Connection Test</Text>
        )}
      </TouchableOpacity>

      {results && (
        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.resultsTitle}>Test Results</Text>
          <Text style={styles.timestamp}>
            Tested at: {new Date(results.timestamp).toLocaleString()}
          </Text>

          {results.tests.map((test: any, index: number) => (
            <View key={index} style={styles.testResult}>
              <View style={styles.testHeader}>
                <Text style={styles.testName}>
                  {getStatusIcon(test.status)} {test.name}
                </Text>
                <Text style={[styles.testStatus, { color: getStatusColor(test.status) }]}>
                  {test.status.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.testEndpoint}>
                Endpoint: {test.endpoint}
              </Text>

              {test.duration && (
                <Text style={styles.testDuration}>
                  Duration: {test.duration}ms
                </Text>
              )}

              {test.statusCode && (
                <Text style={styles.testDetail}>
                  HTTP Status: {test.statusCode} {test.statusText}
                </Text>
              )}

              {test.error && (
                <Text style={styles.errorText}>
                  Error: {test.error}
                </Text>
              )}

              {test.note && (
                <Text style={styles.noteText}>
                  Note: {test.note}
                </Text>
              )}

              {test.responseData && (
                <View style={styles.responseContainer}>
                  <Text style={styles.responseTitle}>Response:</Text>
                  <Text style={styles.responseText}>
                    {typeof test.responseData === 'string' 
                      ? test.responseData.substring(0, 200) + (test.responseData.length > 200 ? '...' : '')
                      : JSON.stringify(test.responseData, null, 2).substring(0, 200) + '...'
                    }
                  </Text>
                </View>
              )}

              {test.corsHeaders && (
                <View style={styles.corsContainer}>
                  <Text style={styles.corsTitle}>CORS Headers:</Text>
                  {Object.entries(test.corsHeaders).map(([key, value]) => (
                    <Text key={key} style={styles.corsHeader}>
                      {`${key}: ${value || 'Not set'}`}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    margin: spacing.md,
    ...shadows.sm,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.textStyles.h3,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  testButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  testButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  testingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  testButtonText: {
    ...typography.textStyles.button,
    color: colors.surface,
    fontWeight: '600',
  },
  resultsContainer: {
    maxHeight: 400,
  },
  resultsTitle: {
    ...typography.textStyles.h4,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  timestamp: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  testResult: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  testName: {
    ...typography.textStyles.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  testStatus: {
    ...typography.textStyles.caption,
    fontWeight: '600',
  },
  testEndpoint: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  testDuration: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  testDetail: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  errorText: {
    ...typography.textStyles.caption,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  noteText: {
    ...typography.textStyles.caption,
    color: '#FFA500',
    marginBottom: spacing.xs,
  },
  responseContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  responseTitle: {
    ...typography.textStyles.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  responseText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 10,
  },
  corsContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  corsTitle: {
    ...typography.textStyles.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  corsHeader: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
});