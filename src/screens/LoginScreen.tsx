import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { ModernInput } from '../components/forms';
import { useFormValidation, validationRules } from '../utils/validation';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

interface LoginScreenProps {
  onSwitchToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitchToRegister }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isLoading } = useAuth();

  // Form validation setup
  const {
    formData,
    errors,
    handleFieldChange,
    handleFieldBlur,
    validateAllFields,
  } = useFormValidation(
    { username: '', password: '' },
    {
      username: [validationRules.required('Username')],
      password: [validationRules.required('Password')],
    }
  );

  const handleLogin = async () => {
    if (!validateAllFields()) {
      return;
    }

    setIsLoggingIn(true);
    
    try {
      const success = await login(formData.username.trim(), formData.password);
      
      if (!success) {
        Alert.alert('Error', 'Invalid username or password');
      }
      // Success will be handled by auth state change
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const isButtonDisabled = isLoggingIn || isLoading || !formData.username.trim() || !formData.password.trim();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.loginContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your StockFlowPro account</Text>
          </View>

          <View style={styles.form}>
            <ModernInput
              label="Username"
              value={formData.username}
              onChangeText={(value) => handleFieldChange('username', value)}
              onBlur={() => handleFieldBlur('username')}
              error={errors.username}
              leftIcon="person-outline"
              placeholder="Enter your username"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoggingIn}
              required
            />

            <ModernInput
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleFieldChange('password', value)}
              onBlur={() => handleFieldBlur('password')}
              error={errors.password}
              leftIcon="lock-closed-outline"
              placeholder="Enter your password"
              isPassword
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoggingIn}
              required
            />

            <TouchableOpacity
              style={[styles.loginButton, isButtonDisabled && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isButtonDisabled}
            >
              {isLoggingIn ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={onSwitchToRegister} disabled={isLoggingIn}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  loginContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.textStyles.h2,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: spacing.lg,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadows.sm,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    ...typography.textStyles.button,
    color: colors.surface,
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footerText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  linkText: {
    ...typography.textStyles.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});