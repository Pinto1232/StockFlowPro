import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LegacyUser } from '../../types';

interface UserCardProps {
  user: LegacyUser;
  onEdit?: (user: LegacyUser) => void;
  onDelete?: (user: LegacyUser) => void;
  onToggleStatus?: (user: LegacyUser) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userStatus}>
          Status: {user.isActive ? 'Active' : 'Inactive'}
        </Text>
        <Text style={styles.userDate}>
          Created: {user.createdAt?.toLocaleDateString() || 'Unknown'}
        </Text>
      </View>
      
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(user)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
        
        {onToggleStatus && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              user.isActive ? styles.deactivateButton : styles.activateButton,
            ]}
            onPress={() => onToggleStatus(user)}
          >
            <Text style={styles.actionButtonText}>
              {user.isActive ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
        )}
        
        {onDelete && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(user)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userStatus: {
    fontSize: 12,
    color: '#888',
    marginBottom: 3,
  },
  userDate: {
    fontSize: 12,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  activateButton: {
    backgroundColor: '#34C759',
  },
  deactivateButton: {
    backgroundColor: '#FF9500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
});