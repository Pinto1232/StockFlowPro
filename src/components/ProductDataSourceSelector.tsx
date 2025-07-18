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
import { useProductsEnhanced, useProductSourcesHealth } from '../hooks/useProductsEnhanced';

interface ProductDataSourceSelectorProps {
  onDataSourceChange?: (source: 'mock' | 'api' | 'both') => void;
  showHealthStatus?: boolean;
  showProductCount?: boolean;
}

export const ProductDataSourceSelector: React.FC<ProductDataSourceSelectorProps> = ({
  onDataSourceChange,
  showHealthStatus = true,
  showProductCount = true,
}) => {
  const [selectedSource, setSelectedSource] = useState<'mock' | 'api' | 'both'>('api');
  const { healthStatus, checkHealth } = useProductSourcesHealth();
  
  const {
    enhancedData,
    isLoading,
    error,
    switchDataSource,
    dataSources,
    sourceErrors,
  } = useProductsEnhanced({
    dataSource: selectedSource,
    fallbackToMock: true,
    activeOnly: true,
  });

  const handleSourceChange = (source: 'mock' | 'api' | 'both') => {
    setSelectedSource(source);
    switchDataSource(source);
    onDataSourceChange?.(source);
  };

  const getSourceButtonStyle = (source: 'mock' | 'api' | 'both') => [
    styles.sourceButton,
    selectedSource === source && styles.sourceButtonActive,
    sourceErrors?.[source as keyof typeof sourceErrors] && styles.sourceButtonError,
  ];

  const getSourceButtonTextStyle = (source: 'mock' | 'api' | 'both') => [
    styles.sourceButtonText,
    selectedSource === source && styles.sourceButtonTextActive,
  ];

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <Text style={styles.title}>Product Data Source</Text>
        <Text style={styles.subtitle}>
          Choose where to fetch product data from
        </Text>
      </View>

      {}
      <View style={styles.sourceButtons}>
        <TouchableOpacity
          style={getSourceButtonStyle('mock')}
          onPress={() => handleSourceChange('mock')}
        >
          <Text style={getSourceButtonTextStyle('mock')}>
            📝 Mock Data
          </Text>
          {sourceErrors?.mock && (
            <Text style={styles.errorIndicator}>⚠️</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={getSourceButtonStyle('api')}
          onPress={() => handleSourceChange('api')}
        >
          <Text style={getSourceButtonTextStyle('api')}>
            🌐 Backend API
          </Text>
          {sourceErrors?.api && (
            <Text style={styles.errorIndicator}>⚠️</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={getSourceButtonStyle('both')}
          onPress={() => handleSourceChange('both')}
        >
          <Text style={getSourceButtonTextStyle('both')}>
            🔄 Both Sources
          </Text>
        </TouchableOpacity>
      </View>

      {}
      {showHealthStatus && (
        <View style={styles.healthSection}>
          <View style={styles.healthHeader}>
            <Text style={styles.healthTitle}>Source Health Status</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={checkHealth}
            >
              <Text style={styles.refreshButtonText}>🔄 Check</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.healthStatus}>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Mock API:</Text>
              <View style={[
                styles.healthIndicator,
                { backgroundColor: healthStatus.mock === 'healthy' ? colors.success : 
                                 healthStatus.mock === 'error' ? colors.error : colors.textSecondary }
              ]}>
                <Text style={styles.healthIndicatorText}>
                  {healthStatus.mock === 'healthy' ? '✅' : 
                   healthStatus.mock === 'error' ? '❌' : '❓'}
                </Text>
              </View>
            </View>
            
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Backend API:</Text>
              <View style={[
                styles.healthIndicator,
                { backgroundColor: healthStatus.api === 'healthy' ? colors.success : 
                                 healthStatus.api === 'error' ? colors.error : colors.textSecondary }
              ]}>
                <Text style={styles.healthIndicatorText}>
                  {healthStatus.api === 'healthy' ? '✅' : 
                   healthStatus.api === 'error' ? '❌' : '❓'}
                </Text>
              </View>
            </View>
          </View>

          {healthStatus.lastChecked && (
            <Text style={styles.lastChecked}>
              Last checked: {healthStatus.lastChecked.toLocaleTimeString()}
            </Text>
          )}
        </View>
      )}

      {}
      <View style={styles.dataStatus}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : enhancedData ? (
          <View style={styles.dataInfo}>
            {showProductCount && (
              <Text style={styles.dataCount}>
                📦 {enhancedData.data.products.length} products loaded
              </Text>
            )}
            
            <Text style={styles.dataSources}>
              Sources: {dataSources.join(' + ') || 'None'}
            </Text>
            
            {enhancedData.message && (
              <Text style={styles.dataMessage}>
                {enhancedData.message}
              </Text>
            )}
          </View>
        ) : error ? (
          <Text style={styles.errorText}>
            ❌ Error: {error.message}
          </Text>
        ) : null}
      </View>

      {}
      {enhancedData && (
        <ScrollView style={styles.sourceDetails} showsVerticalScrollIndicator={false}>
          {enhancedData.data.sources.mock && (
            <View style={styles.sourceDetail}>
              <Text style={styles.sourceDetailTitle}>📝 Mock API Response:</Text>
              <Text style={styles.sourceDetailText}>
                Status: {enhancedData.data.sources.mock.success ? '✅ Success' : '❌ Failed'}
              </Text>
              {enhancedData.data.sources.mock.message && (
                <Text style={styles.sourceDetailText}>
                  Message: {enhancedData.data.sources.mock.message}
                </Text>
              )}
            </View>
          )}

          {enhancedData.data.sources.api && (
            <View style={styles.sourceDetail}>
              <Text style={styles.sourceDetailTitle}>🌐 Backend API Response:</Text>
              <Text style={styles.sourceDetailText}>
                Status: {enhancedData.data.sources.api.success ? '✅ Success' : '❌ Failed'}
              </Text>
              <Text style={styles.sourceDetailText}>
                Endpoint: http:
              </Text>
              {enhancedData.data.sources.api.message && (
                <Text style={styles.sourceDetailText}>
                  Message: {enhancedData.data.sources.api.message}
                </Text>
              )}
            </View>
          )}

          {sourceErrors && Object.keys(sourceErrors).length > 0 && (
            <View style={styles.errorDetails}>
              <Text style={styles.errorDetailsTitle}>⚠️ Errors:</Text>
              {sourceErrors.mock && (
                <Text style={styles.errorDetailText}>
                  Mock: {sourceErrors.mock.message}
                </Text>
              )}
              {sourceErrors.api && (
                <Text style={styles.errorDetailText}>
                  API: {sourceErrors.api.message}
                </Text>
              )}
            </View>
          )}
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
  sourceButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sourceButton: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    position: 'relative',
  },
  sourceButtonActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  sourceButtonError: {
    borderColor: colors.error,
  },
  sourceButtonText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  sourceButtonTextActive: {
    color: colors.primary,
  },
  errorIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    fontSize: 12,
  },
  healthSection: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  healthTitle: {
    ...typography.textStyles.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  refreshButtonText: {
    ...typography.textStyles.caption,
    color: colors.primary,
    fontSize: 10,
  },
  healthStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  healthItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  healthLabel: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  healthIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthIndicatorText: {
    fontSize: 12,
  },
  lastChecked: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    fontSize: 9,
    textAlign: 'center',
  },
  dataStatus: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
  },
  dataInfo: {
    gap: spacing.xs,
  },
  dataCount: {
    ...typography.textStyles.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  dataSources: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
  },
  dataMessage: {
    ...typography.textStyles.caption,
    color: colors.success,
    fontStyle: 'italic',
  },
  errorText: {
    ...typography.textStyles.caption,
    color: colors.error,
    textAlign: 'center',
  },
  sourceDetails: {
    maxHeight: 200,
  },
  sourceDetail: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  sourceDetailTitle: {
    ...typography.textStyles.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  sourceDetailText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
  },
  errorDetails: {
    backgroundColor: colors.error + '10',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  errorDetailsTitle: {
    ...typography.textStyles.caption,
    color: colors.error,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  errorDetailText: {
    ...typography.textStyles.caption,
    color: colors.error,
    fontSize: 10,
    lineHeight: 14,
  },
});