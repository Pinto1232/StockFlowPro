import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';

interface TextProps {
  children?: React.ReactNode;
  style?: TextStyle;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  onPress?: () => void;
  selectable?: boolean;
  testID?: string;
}

const variantStyles: Record<string, TextStyle> = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 16,
  },
  overline: {
    fontSize: 10,
    fontWeight: 'normal',
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
};

export const Text: React.FC<TextProps> = ({
  children,
  style,
  variant = 'body1',
  color,
  fontSize,
  fontWeight,
  textAlign,
  numberOfLines,
  ellipsizeMode,
  onPress,
  selectable,
  testID,
  ...props
}) => {
  const textStyle: TextStyle = {
    ...variantStyles[variant],
    ...(color && { color }),
    ...(fontSize && { fontSize }),
    ...(fontWeight && { fontWeight }),
    ...(textAlign && { textAlign }),
  };

  return (
    <RNText
      style={[textStyle, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      onPress={onPress}
      selectable={selectable}
      testID={testID}
      {...props}
    >
      {children}
    </RNText>
  );
};