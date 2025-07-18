import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, typography, shadows } from '../../theme';

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  subtitle,
  rightComponent,
  leftComponent,
  backgroundColor = colors.headerBackground,
  textColor = colors.headerText,
}) => {
  return (
    <>
      <StatusBar
        barStyle={backgroundColor === colors.white ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundColor}
        translucent={false}
      />
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <View style={[styles.header, { backgroundColor }]}>
          <View style={styles.leftSection}>
            {leftComponent}
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
                {title}
              </Text>
              {subtitle && (
                <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.rightSection}>
            {rightComponent}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.headerBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 56,
    backgroundColor: colors.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
    shadowColor: colors.shadowLight,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    marginLeft: spacing.sm,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    ...typography.textStyles.h4,
    color: colors.headerText,
    textAlign: 'left',
  },
  subtitle: {
    ...typography.textStyles.bodySmall,
    color: colors.textSecondary,
    textAlign: 'left',
    marginTop: 2,
  },
});