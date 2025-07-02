// Modern color palette for the app
export const colors = {
  // Primary colors
  primary: '#6366F1', // Modern indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Secondary colors
  secondary: '#10B981', // Emerald green
  secondaryLight: '#34D399',
  secondaryDark: '#059669',
  
  // Accent colors
  accent: '#F59E0B', // Amber
  accentLight: '#FCD34D',
  accentDark: '#D97706',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  surface: '#FFFFFF',
  
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  
  // Navigation specific colors
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
  tabBarActive: '#6366F1',
  tabBarInactive: '#9CA3AF',
  headerBackground: '#FFFFFF',
  headerText: '#111827',
  
  // Shadow colors
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
} as const;

export type ColorKey = keyof typeof colors;