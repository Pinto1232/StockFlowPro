import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCounterStore } from '../state/zustand/counterStore';

// Single Responsibility Principle - This screen only handles counter functionality
export const CounterScreen: React.FC = () => {
  const {
    count,
    isLoading,
    error,
    lastSaved,
    increment,
    decrement,
    reset,
    saveCounter,
    clearError,
  } = useCounterStore();

  const handleSaveCounter = async () => {
    try {
      await saveCounter();
      Alert.alert('Success', 'Counter saved successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to save counter');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Counter Example</Text>
        <Text style={styles.subtitle}>
          Demonstrates Zustand state management with async operations
        </Text>

        <View style={styles.counterSection}>
          <Text style={styles.counterText}>Count: {count}</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={increment}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={decrement}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={reset}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.saveButton, isLoading && styles.disabledButton]}
            onPress={handleSaveCounter}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Saving...' : 'Save Counter'}
            </Text>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                ❌ {error}
              </Text>
              <TouchableOpacity style={styles.clearErrorButton} onPress={clearError}>
                <Text style={styles.clearErrorText}>Clear Error</Text>
              </TouchableOpacity>
            </View>
          )}

          {lastSaved && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>
                ✅ Last saved: {new Date(lastSaved).toLocaleTimeString()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            • Counter state is managed by Zustand
          </Text>
          <Text style={styles.infoText}>
            • State persists across component re-renders
          </Text>
          <Text style={styles.infoText}>
            • Async operations with loading states
          </Text>
          <Text style={styles.infoText}>
            • Demonstrates modern state management patterns
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  counterSection: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  counterText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#007AFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF9500',
  },
  saveButton: {
    backgroundColor: '#5856D6',
    marginTop: 10,
    paddingHorizontal: 30,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    alignItems: 'center',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  clearErrorButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearErrorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  successContainer: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#fff',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 10,
  },
});