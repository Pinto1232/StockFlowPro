import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated } from 'react-native';
import { AppProvider } from './src/infrastructure/providers/AppProvider';
import { AppNavigator } from './src/navigation';
import { SplashScreen } from './src/components/SplashScreen';

// Main App component using Layered Architecture with Redux + React Query
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const appOpacity = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Handle splash screen finish with useCallback to prevent recreation
  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
    
    // Stop any existing animation
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    // Fade in the main app
    animationRef.current = Animated.timing(appOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });
    
    animationRef.current.start();
  }, [appOpacity]);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        try {
          animationRef.current.stop();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
      
      try {
        appOpacity.stopAnimation();
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, [appOpacity]);

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