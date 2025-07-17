// API Health Status Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import { useApiHealth } from '../hooks/useApiHealth';

interface ApiHealthStatusProps {
  // Show detailed information
  showDetails?: boolean;
  // Show refresh button
  showRefreshButton?: boolean;
  // Compact mode (smaller size)
  compact?: boolean;
  // Custom style
  style?: any;
  // Callback when status is pressed
  onPress?: () => void;
}

export const ApiHealthStatus: React.FC<ApiHealthStatusProps> = ({
  showDetails = false,
  showRefreshButton = true,
  compact = false,
  style,
  onPress
}) => {
  const {
    status,
    lastCheckFormatted,
    responseTimeFormatted,
    endpoint,
    strategy,
    error,
    isLoading,
    checkHealth
  } = useApiHealth({
    autoStart: true,
    checkInterval: 60000, // Check every minute
    enableLogging: false
  });

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return colors.success;
      case 'unhealthy':
        return colors.error;
      case 'degraded':
        return colors.warning;
      case 'checking':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'unhealthy':
        return '❌';
      case 'degraded':
        return '⚠️';
      case 'checking':
        return '🔄';
      default:
        return '❓';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'healthy':
        return 'API Online';
      case 'unhealthy':
        return 'API Offline';
      case 'degraded':
        return 'API Issues';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  const handleRefresh = async () => {
    try {
      await checkHealth(true); // Force new check
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to refresh health check:', error);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (!isLoading) {
      handleRefresh();
    }
  };

  const containerStyle = [
    compact ? styles.containerCompact : styles.container,
    { borderColor: getStatusColor() },
    style
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
        
        {showRefreshButton && !compact && (
          <TouchableOpacity
            style={[styles.refreshButton, { opacity: isLoading ? 0.5 : 1 }]}
            onPress={handleRefresh}
            disabled={isLoading}
          >
            <Text style={styles.refreshButtonText}>
              {isLoading ? '🔄' : '↻'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {showDetails && !compact && (
        <View style={styles.details}>
          {lastCheckFormatted && (
            <Text style={styles.detailText}>
              Last check: {lastCheckFormatted}
            </Text>
          )}
          
          {responseTimeFormatted && (
            <Text style={styles.detailText}>
              Response time: {responseTimeFormatted}
            </Text>
          )}
          
          {endpoint && (
            <Text style={styles.detailText}>
              Endpoint: {endpoint}
            </Text>
          )}
          
          {strategy && (
            <Text style={styles.detailText}>
              Strategy: {strategy}
            </Text>
          )}
          
          {error && (
            <Text style={[styles.detailText, styles.errorText]}>
              Error: {error}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  containerCompact: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginVertical: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  statusText: {
    ...typography.textStyles.body,
    fontWeight: '600',
    flex: 1,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  refreshButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  details: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  detailText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  errorText: {
    color: colors.error,
  },
});

export default ApiHealthStatus;