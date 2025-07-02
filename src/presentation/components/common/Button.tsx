import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ViewStyle, TextStyle, ActivityIndicator, View, Text as RNText } from 'react-native';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: {
      backgroundColor: '#007AFF',
      borderWidth: 0,
    },
    text: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
  },
  secondary: {
    container: {
      backgroundColor: '#F2F2F7',
      borderWidth: 0,
    },
    text: {
      color: '#007AFF',
      fontWeight: '600',
    },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#007AFF',
    },
    text: {
      color: '#007AFF',
      fontWeight: '600',
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    text: {
      color: '#007AFF',
      fontWeight: '600',
    },
  },
  danger: {
    container: {
      backgroundColor: '#FF3B30',
      borderWidth: 0,
    },
    text: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
  },
};

const sizeStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
  small: {
    container: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      minHeight: 32,
    },
    text: {
      fontSize: 14,
    },
  },
  medium: {
    container: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      minHeight: 44,
    },
    text: {
      fontSize: 16,
    },
  },
  large: {
    container: {
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 10,
      minHeight: 52,
    },
    text: {
      fontSize: 18,
    },
  },
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  
  const isDisabled = disabled || loading;
  
  const containerStyle: ViewStyle = {
    ...variantStyle.container,
    ...sizeStyle.container,
    ...(fullWidth && { width: '100%' }),
    ...(isDisabled && { opacity: 0.6 }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const buttonTextStyle: TextStyle = {
    ...variantStyle.text,
    ...sizeStyle.text,
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={buttonTextStyle.color} 
        />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {leftIcon && (
            <View style={{ marginRight: 8 }}>
              {leftIcon}
            </View>
          )}
          <RNText style={buttonTextStyle}>
            {title}
          </RNText>
          {rightIcon && (
            <View style={{ marginLeft: 8 }}>
              {rightIcon}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};