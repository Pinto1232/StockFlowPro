import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from './src/infrastructure/providers/AppProvider';
import { AppNavigator } from './src/navigation';
import { SplashScreen } from './src/components/splashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const appOpacity = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const checkAuthAndFirstLaunch = async () => {
      try {
        const [storedUser, hasLaunchedBefore] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('hasLaunchedBefore'),
        ]);

        if (storedUser && hasLaunchedBefore) {
          setIsFirstLaunch(false);
          setShowSplash(false);
          appOpacity.setValue(1);
        } else {
          if (!hasLaunchedBefore) {
            await AsyncStorage.setItem('hasLaunchedBefore', 'true');
          }
          setIsFirstLaunch(true);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error checking auth status:', error);

        setIsFirstLaunch(true);
      }
    };

    checkAuthAndFirstLaunch();
  }, [appOpacity]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);

    if (animationRef.current) {
      animationRef.current.stop();
    }

    animationRef.current = Animated.timing(appOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });

    animationRef.current.start();
  }, [appOpacity]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        try {
          animationRef.current.stop();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Animation stop error:', error);
        }
      }

      try {
        appOpacity.stopAnimation();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Animation cleanup error:', error);
      }
    };
  }, [appOpacity]);

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
