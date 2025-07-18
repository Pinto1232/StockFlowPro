import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from './src/infrastructure/providers/AppProvider';
import { AppNavigator } from './src/navigation';
import { SplashScreen } from './src/components/SplashScreen';

// Main App component using Layered Architecture with Redux + React Query
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const appOpacity = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Check if user is already authenticated to skip splash on refresh
  useEffect(() => {
    const checkAuthAndFirstLaunch = async () => {
      try {
        const [storedUser, hasLaunchedBefore] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('hasLaunchedBefore'),
        ]);

        // If user is authenticated and app has launched before, skip splash
        if (storedUser && hasLaunchedBefore) {
          setIsFirstLaunch(false);
          setShowSplash(false);
          appOpacity.setValue(1);
        } else {
          // Mark that app has launched at least once
          if (!hasLaunchedBefore) {
            await AsyncStorage.setItem('hasLaunchedBefore', 'true');
          }
          setIsFirstLaunch(true);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error checking auth status:', error);
        // On error, show splash screen
        setIsFirstLaunch(true);
      }
    };

    checkAuthAndFirstLaunch();
  }, [appOpacity]);

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

  // Show splash screen only on first launch or when user is not authenticated
  if (showSplash && isFirstLaunch) {
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
