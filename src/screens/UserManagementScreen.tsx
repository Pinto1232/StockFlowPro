import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';

export const UserManagementScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>User Management</Text>
        <Text style={styles.subtitle}>
          User management features will be implemented here
        </Text>

        <View style={styles.featureSection}>
          <Text style={styles.sectionTitle}>Planned Features:</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>User profile management</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Account settings</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Auction participation history</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Bidding preferences</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Notification settings</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Payment methods</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Architecture Notes:</Text>
          <Text style={styles.infoText}>
            This screen will implement user management using the layered architecture with Zustand for state management and React Query for server state synchronization.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  featureSection: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.textPrimary,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureBullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 10,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  infoSection: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.textPrimary,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});