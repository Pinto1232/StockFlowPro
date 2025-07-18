import { Platform } from 'react-native';

/**
 * Platform-specific utilities to handle differences between native and web
 */

export const isWeb = Platform.OS === 'web';
export const isNative = Platform.OS !== 'web';

/**
 * Safe animation cleanup that handles platform differences
 */
export const safeStopAnimation = (animatedValue: any) => {
  try {
    if (animatedValue && typeof animatedValue.stopAnimation === 'function') {
      animatedValue.stopAnimation();
    }
  } catch (error) {
    // Silently ignore cleanup errors, especially on web
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('Animation cleanup warning:', error);
    }
  }
};

/**
 * Safe animation start that handles platform differences
 */
export const safeStartAnimation = (animation: any, callback?: (finished: boolean) => void) => {
  try {
    if (animation && typeof animation.start === 'function') {
      animation.start(callback);
    }
  } catch (error) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('Animation start warning:', error);
    }
    // Call callback with false to indicate animation didn't complete
    if (callback) {
      callback(false);
    }
  }
};

/**
 * Safe timer cleanup
 */
export const safeClearTimeout = (timeoutId: NodeJS.Timeout | number | null) => {
  try {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('Timeout cleanup warning:', error);
    }
  }
};

/**
 * Safe interval cleanup
 */
export const safeClearInterval = (intervalId: NodeJS.Timeout | number | null) => {
  try {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  } catch (error) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('Interval cleanup warning:', error);
    }
  }
};

/**
 * Web-safe component unmount handler
 */
export const createSafeCleanup = (cleanupFunctions: (() => void)[]) => {
  return () => {
    cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn('Cleanup function warning:', error);
        }
      }
    });
  };
};

/**
 * Platform-specific animation configuration
 */
export const getAnimationConfig = () => {
  if (isWeb) {
    return {
      useNativeDriver: false, // Web doesn't support native driver for all properties
      duration: 300, // Shorter durations for web
    };
  }
  
  return {
    useNativeDriver: true,
    duration: 500,
  };
};

/**
 * Debounce function to prevent rapid state updates that can cause DOM issues
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};