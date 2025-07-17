import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors, spacing, typography } from '../theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(50)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(30)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const circleScale1 = useRef(new Animated.Value(0)).current;
  const circleScale2 = useRef(new Animated.Value(0)).current;
  const circleScale3 = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let animationSequenceRef: Animated.CompositeAnimation | null = null;
    let circleAnimations: Animated.CompositeAnimation[] = [];

    // Start the splash animation sequence
    animationSequenceRef = Animated.sequence([
      // Background fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      
      // Animated circles appear
      Animated.stagger(200, [
        Animated.spring(circleScale1, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(circleScale2, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(circleScale3, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      
      // Logo animation
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // Title animation
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      
      // Subtitle animation
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      
      // Progress bar animation
      Animated.timing(progressWidth, {
        toValue: screenWidth * 0.6,
        duration: 1500,
        useNativeDriver: false,
      }),
      
      // Hold for a moment
      Animated.delay(500),
    ]);

    // Start continuous circle rotation with proper cleanup tracking
    const rotateCircles = () => {
      const circle1Animation = Animated.loop(
        Animated.sequence([
          Animated.timing(circleScale1, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(circleScale1, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      const circle2Animation = Animated.loop(
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(circleScale2, {
            toValue: 1.1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(circleScale2, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );

      const circle3Animation = Animated.loop(
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(circleScale3, {
            toValue: 1.15,
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.timing(circleScale3, {
            toValue: 1,
            duration: 1100,
            useNativeDriver: true,
          }),
        ])
      );

      circleAnimations = [circle1Animation, circle2Animation, circle3Animation];
      
      circle1Animation.start();
      circle2Animation.start();
      circle3Animation.start();
    };

    // Start animations
    animationSequenceRef.start((finished) => {
      if (finished) {
        // Animation complete, finish splash
        timeoutId = setTimeout(onFinish, 800);
      }
    });

    rotateCircles();

    // Cleanup function
    return () => {
      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Stop all animations
      if (animationSequenceRef) {
        animationSequenceRef.stop();
      }

      circleAnimations.forEach(animation => {
        try {
          animation.stop();
        } catch (error) {
          // Ignore cleanup errors
        }
      });

      // Stop individual animation values
      try {
        logoScale.stopAnimation();
        logoOpacity.stopAnimation();
        titleOpacity.stopAnimation();
        titleTranslateY.stopAnimation();
        subtitleOpacity.stopAnimation();
        subtitleTranslateY.stopAnimation();
        backgroundOpacity.stopAnimation();
        circleScale1.stopAnimation();
        circleScale2.stopAnimation();
        circleScale3.stopAnimation();
        progressWidth.stopAnimation();
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, [onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: backgroundOpacity }]}>
      {/* Animated Background Circles */}
      <Animated.View
        style={[
          styles.circle1,
          {
            transform: [{ scale: circleScale1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle2,
          {
            transform: [{ scale: circleScale2 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle3,
          {
            transform: [{ scale: circleScale3 }],
          },
        ]}
      />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logo}>
            <Text style={styles.logoText}>SFP</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          <Text style={styles.title}>Stock Flow Pro</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View
          style={[
            styles.subtitleContainer,
            {
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }],
            },
          ]}
        >
          <Text style={styles.subtitle}>Inventory Management System</Text>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>

        {/* Loading Text */}
        <Animated.View style={[styles.loadingContainer, { opacity: subtitleOpacity }]}>
          <Text style={styles.loadingText}>Loading your inventory...</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  // Animated Background Circles
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primary + '10',
    top: screenHeight * 0.1,
    right: -100,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.secondary + '15',
    bottom: screenHeight * 0.2,
    left: -50,
  },
  circle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.accent + '20',
    top: screenHeight * 0.3,
    left: screenWidth * 0.1,
  },
  // Logo
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.surface,
    textAlign: 'center',
  },
  // Title
  titleContainer: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.textStyles.h1,
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  // Subtitle
  subtitleContainer: {
    marginBottom: spacing.xl * 2,
  },
  subtitle: {
    ...typography.textStyles.body,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // Progress Bar
  progressContainer: {
    width: screenWidth * 0.6,
    height: 4,
    backgroundColor: colors.textSecondary + '20',
    borderRadius: 2,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  // Loading Text
  loadingContainer: {
    marginTop: spacing.md,
  },
  loadingText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
  },
});