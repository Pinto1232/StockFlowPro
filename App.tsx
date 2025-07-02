import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated } from 'react-native';
import { AppProvider } from './src/infrastructure/providers/AppProvider';
import { AppNavigator } from './src/navigation';
import { SplashScreen } from './src/components/SplashScreen';

// Main App component using Layered Architecture with Redux + React Query
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const appOpacity = useRef(new Animated.Value(0)).current;

  // Handle splash screen finish
  const handleSplashFinish = () => {
    setShowSplash(false);
    // Fade in the main app
    Animated.timing(appOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  // Show splash screen first, then the main app
  if (showSplash) {
    return (
      <>
        <SplashScreen onFinish={handleSplashFinish} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <AppProvider>
      <Animated.View style={{ flex: 1, opacity: appOpacity }}>
        <AppNavigator />
        <StatusBar style="auto" />
      </Animated.View>
    </AppProvider>
  );
}