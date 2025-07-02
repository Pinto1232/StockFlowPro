import React from 'react';
import { View, ViewStyle } from 'react-native';

interface BoxProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  flex?: number;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  position?: 'absolute' | 'relative';
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  zIndex?: number;
  opacity?: number;
  overflow?: 'visible' | 'hidden' | 'scroll';
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

export const Box: React.FC<BoxProps> = ({
  children,
  style,
  padding,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  backgroundColor,
  borderRadius,
  borderWidth,
  borderColor,
  flex,
  alignItems,
  justifyContent,
  flexDirection,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  position,
  top,
  bottom,
  left,
  right,
  zIndex,
  opacity,
  overflow,
  shadowColor,
  shadowOffset,
  shadowOpacity,
  shadowRadius,
  elevation,
  ...props
}) => {
  const boxStyle: ViewStyle = {
    ...(padding !== undefined && { padding }),
    ...(margin !== undefined && { margin }),
    ...(marginTop !== undefined && { marginTop }),
    ...(marginBottom !== undefined && { marginBottom }),
    ...(marginLeft !== undefined && { marginLeft }),
    ...(marginRight !== undefined && { marginRight }),
    ...(backgroundColor && { backgroundColor }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...(borderWidth !== undefined && { borderWidth }),
    ...(borderColor && { borderColor }),
    ...(flex !== undefined && { flex }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(flexDirection && { flexDirection }),
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(minWidth !== undefined && { minWidth }),
    ...(minHeight !== undefined && { minHeight }),
    ...(maxWidth !== undefined && { maxWidth }),
    ...(maxHeight !== undefined && { maxHeight }),
    ...(position && { position }),
    ...(top !== undefined && { top }),
    ...(bottom !== undefined && { bottom }),
    ...(left !== undefined && { left }),
    ...(right !== undefined && { right }),
    ...(zIndex !== undefined && { zIndex }),
    ...(opacity !== undefined && { opacity }),
    ...(overflow && { overflow }),
    ...(shadowColor && { shadowColor }),
    ...(shadowOffset && { shadowOffset }),
    ...(shadowOpacity !== undefined && { shadowOpacity }),
    ...(shadowRadius !== undefined && { shadowRadius }),
    ...(elevation !== undefined && { elevation }),
  };

  return (
    <View style={[boxStyle, style]} {...props}>
      {children}
    </View>
  );
};