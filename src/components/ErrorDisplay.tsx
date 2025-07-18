import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { parseError, getErrorSuggestion } from '../utils/errorHandler';

interface ErrorDisplayProps {
  error: unknown;
  onRetry?: () => void;
  showSuggestion?: boolean;
  compact?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  showSuggestion = true,
  compact = false,
}) => {
  const parsedError = parseError(error);
  const suggestion = getErrorSuggestion(error);

  const getErrorIcon = () => {
    if (parsedError.isCorsError) return '🌐';
    if (parsedError.isAuthError) return '🔐';
    if (parsedError.isNetworkError) return '📡';
    if (parsedError.status === 404) return '🔍';
    if (parsedError.status === 500) return '⚠️';
    return '❌';
  };

  const getErrorColor = () => {
    if (parsedError.isCorsError) return colors.warning;
    if (parsedError.isAuthError) return colors.info;
    if (parsedError.isNetworkError) return colors.error;
    return colors.error;
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, { borderLeftColor: getErrorColor() }]}>
        <Text style={styles.compactIcon}>{getErrorIcon()}</Text>
        <View style={styles.compactContent}>
          <Text style={styles.compactMessage}>{parsedError.message}</Text>
          {onRetry && (
            <TouchableOpacity style={styles.compactRetryButton} onPress={onRetry}>
              <Text style={styles.compactRetryText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { borderColor: getErrorColor() }]}>
      <View style={[styles.header, { backgroundColor: getErrorColor() + '10' }]}>
        <Text style={styles.icon}>{getErrorIcon()}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: getErrorColor() }]}>
            {parsedError.isNetworkError ? 'Connection Error' :
             parsedError.isCorsError ? 'Server Configuration Error' :
             parsedError.isAuthError ? 'Authentication Error' :
             'Error'}
          </Text>
          {parsedError.status && (
            <Text style={styles.statusCode}>Status: {parsedError.status}</Text>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.message}>{parsedError.message}</Text>
        
        {showSuggestion && (
          <View style={styles.suggestionContainer}>
            <Text style={styles.suggestionTitle}>💡 Suggestion:</Text>
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </View>
        )}

        {onRetry && (
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: getErrorColor() }]} 
            onPress={onRetry}
          >
            <Text style={styles.retryButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginVertical: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.textStyles.h4,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  statusCode: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.md,
  },
  message: {
    ...typography.textStyles.body,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  suggestionContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  suggestionTitle: {
    ...typography.textStyles.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  suggestionText: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  retryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  retryButtonText: {
    ...typography.textStyles.button,
    color: colors.surface,
    fontWeight: '600',
  },
  
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderLeftWidth: 4,
    marginVertical: spacing.xs,
    ...shadows.sm,
  },
  compactIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  compactContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactMessage: {
    ...typography.textStyles.body,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.md,
  },
  compactRetryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  compactRetryText: {
    ...typography.textStyles.caption,
    color: colors.surface,
    fontWeight: '600',
  },
});