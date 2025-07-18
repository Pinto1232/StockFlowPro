import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInputProps,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

interface ModernInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  required?: boolean;
  containerStyle?: any;
}

export const ModernInput: React.FC<ModernInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  required = false,
  containerStyle,
  value,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(underlineAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(underlineAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur?.(e);
  };

  const labelStyle = {
    position: 'absolute' as const,
    left: leftIcon ? 40 : 0,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: error 
      ? colors.error 
      : animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [colors.textSecondary, isFocused ? colors.primary : colors.textSecondary],
        }),
  };

  const underlineColor = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? colors.error : colors.border, error ? colors.error : colors.primary],
  });

  const underlineWidth = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const underlineOpacity = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getRightIcon = () => {
    if (isPassword) {
      return showPassword ? 'eye-off-outline' : 'eye-outline';
    }
    return rightIcon;
  };

  const handleRightIconPress = () => {
    if (isPassword) {
      togglePasswordVisibility();
    } else {
      onRightIconPress?.();
    }
  };

  const webStyles = Platform.OS === 'web' ? {
    outline: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
    boxShadow: 'none',
    border: 'none',
  } as any : {};

  const inputStyles = [
    styles.input,
    leftIcon && styles.inputWithLeftIcon,
    {
      borderWidth: 0,
      borderColor: 'transparent',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderRadius: 0,
      backgroundColor: 'transparent',
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    webStyles,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputContainer}>
        <Animated.Text style={labelStyle}>
          {label}{required && <Text style={styles.required}> *</Text>}
        </Animated.Text>

        <View style={styles.inputRow}>
          {leftIcon && (
            <View style={styles.leftIconContainer}>
              <Ionicons
                name={leftIcon}
                size={20}
                color={error ? colors.error : isFocused ? colors.primary : colors.textSecondary}
              />
            </View>
          )}
          
          <TextInput
            {...textInputProps}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isPassword && !showPassword}
            style={inputStyles}
            placeholderTextColor="transparent"
            underlineColorAndroid="transparent"
            selectionColor={colors.primary}
            blurOnSubmit={false}
            autoCorrect={false}
            spellCheck={false}
            textContentType="none"
            autoComplete="off"
          />

          {(getRightIcon() || isPassword) && (
            <TouchableOpacity
              style={styles.rightIconContainer}
              onPress={handleRightIconPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={getRightIcon() as keyof typeof Ionicons.glyphMap}
                size={20}
                color={error ? colors.error : isFocused ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {}
        <View style={styles.borderContainer}>
          <View style={[styles.borderLine, { borderBottomColor: error ? colors.error : colors.border }]} />
          <Animated.View 
            style={[
              styles.focusedBorderLine, 
              { 
                borderBottomColor: underlineColor,
                width: underlineWidth,
                opacity: underlineOpacity,
              }
            ]} 
          />
        </View>
      </View>

      {(error || helperText) && (
        <View style={styles.messageContainer}>
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          {!error && helperText && (
            <Text style={styles.helperText}>{helperText}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  inputContainer: {
    position: 'relative',
    paddingTop: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  leftIconContainer: {
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    ...typography.textStyles.body,
    color: colors.textPrimary,
    flex: 1,
    fontSize: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    textDecorationLine: 'none',
    ...(Platform.OS === 'android' && {
      includeFontPadding: false,
      textAlignVertical: 'center',
    }),
  },
  inputWithLeftIcon: {
    marginLeft: 0,
  },
  rightIconContainer: {
    marginLeft: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  borderContainer: {
    position: 'relative',
    height: 1,
  },
  borderLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
  },
  focusedBorderLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    height: 1,
  },
  required: {
    color: colors.error,
  },
  messageContainer: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  errorText: {
    ...typography.textStyles.caption,
    color: colors.error,
    fontSize: 12,
  },
  helperText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
});