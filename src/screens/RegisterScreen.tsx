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
import { RegisterData } from '../services/api';

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onSwitchToLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { register, isLoading } = useAuth();

  const {
    formData,
    errors,
    handleFieldChange,
    handleFieldBlur,
    validateAllFields,
  } = useFormValidation(
    {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: '',
    },
    {
      firstName: [validationRules.required('First name'), validationRules.name()],
      lastName: [validationRules.required('Last name'), validationRules.name()],
      email: [validationRules.required('Email'), validationRules.email()],
      phoneNumber: [validationRules.phone()], 
      dateOfBirth: [validationRules.dateOfBirth()], 
      password: [validationRules.required('Password'), validationRules.passwordSimple()],
      confirmPassword: [validationRules.required('Confirm password')],
    }
  );

  const validateConfirmPassword = (value: string) => {
    if (value !== formData.password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleRegister = async () => {
    if (!validateAllFields()) {
      return;
    }

    setIsRegistering(true);
    
    try {
      
      const registerData: RegisterData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        dateOfBirth: formData.dateOfBirth.trim() || undefined,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const result = await register(registerData);
      
      if (result.success) {
        Alert.alert(
          'Registration Successful',
          result.message || 'Your account has been created successfully. You can now sign in.',
          [
            {
              text: 'Sign In',
              onPress: onSwitchToLogin,
            },
          ]
        );
      } else {
        
        const errorMessage = result.message || 'Registration failed. Please try again.';
        const errorDetails = result.errors?.join('\n') || '';
        
        Alert.alert(
          'Registration Failed',
          errorDetails ? `${errorMessage}\n\n${errorDetails}` : errorMessage
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const isButtonDisabled = isRegistering || isLoading || 
    !formData.firstName.trim() || 
    !formData.lastName.trim() || 
    !formData.email.trim() || 
    !formData.password.trim() || 
    !formData.confirmPassword.trim();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
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
        <View style={styles.registerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join StockFlowPro to manage your inventory</Text>
          </View>

          <View style={styles.form}>
            <ModernInput
              label="First Name"
              value={formData.firstName}
              onChangeText={(value) => handleFieldChange('firstName', value)}
              onBlur={() => handleFieldBlur('firstName')}
              error={errors.firstName}
              leftIcon="person-outline"
              placeholder="Enter your first name"
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isRegistering}
              required
            />

            <ModernInput
              label="Last Name"
              value={formData.lastName}
              onChangeText={(value) => handleFieldChange('lastName', value)}
              onBlur={() => handleFieldBlur('lastName')}
              error={errors.lastName}
              leftIcon="person-outline"
              placeholder="Enter your last name"
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isRegistering}
              required
            />

            <ModernInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleFieldChange('email', value)}
              onBlur={() => handleFieldBlur('email')}
              error={errors.email}
              leftIcon="mail-outline"
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isRegistering}
              required
            />

            <ModernInput
              label="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(value) => handleFieldChange('phoneNumber', value)}
              onBlur={() => handleFieldBlur('phoneNumber')}
              error={errors.phoneNumber}
              leftIcon="call-outline"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isRegistering}
              helperText="Optional"
            />

            <ModernInput
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChangeText={(value) => handleFieldChange('dateOfBirth', value)}
              onBlur={() => handleFieldBlur('dateOfBirth')}
              error={errors.dateOfBirth}
              leftIcon="calendar-outline"
              placeholder="YYYY-MM-DD"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isRegistering}
              helperText="Optional - Format: YYYY-MM-DD"
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
              editable={!isRegistering}
              required
            />

            <ModernInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleFieldChange('confirmPassword', value)}
              onBlur={() => handleFieldBlur('confirmPassword')}
              error={errors.confirmPassword || validateConfirmPassword(formData.confirmPassword)}
              leftIcon="lock-closed-outline"
              placeholder="Confirm your password"
              isPassword
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isRegistering}
              required
            />

            <TouchableOpacity
              style={[styles.registerButton, isButtonDisabled && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isButtonDisabled}
            >
              {isRegistering ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={onSwitchToLogin} disabled={isRegistering}>
              <Text style={styles.linkText}>Sign In</Text>
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
  registerContainer: {
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
    ...typography.textStyles.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: spacing.lg,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadows.sm,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
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