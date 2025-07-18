
export const typography = {
  
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  textStyles: {
    h1: {
      fontSize: 30,
      fontWeight: '700' as const,
      lineHeight: 36,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 30,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 26,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
    },
  },
} as const;