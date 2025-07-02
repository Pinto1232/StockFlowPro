import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}


export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onDismiss,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.errorText}>{message}</Text>
        <View style={styles.buttonContainer}>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
          {onDismiss && (
            <TouchableOpacity style={styles.dismissButton} onPress={onDismiss} activeOpacity={0.8}>
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF2F2',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: spacing.sm,
    paddingTop: 2,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  errorText: {
    ...typography.textStyles.body,
    color: colors.error,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  retryButton: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  retryButtonText: {
    ...typography.textStyles.button,
    color: colors.white,
    fontSize: typography.fontSize.sm,
  },
  dismissButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  dismissButtonText: {
    ...typography.textStyles.button,
    color: colors.error,
    fontSize: typography.fontSize.sm,
  },
});