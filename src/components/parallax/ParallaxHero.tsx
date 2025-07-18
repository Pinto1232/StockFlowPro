import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { colors, spacing } from '../../theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ParallaxHeroProps {
  scrollY: Animated.Value;
  children?: React.ReactNode;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  scrollY,
  children,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const particleAnims = useRef(
    Array.from({ length: 15 }, () => ({
      translateX: new Animated.Value(Math.random() * screenWidth),
      translateY: new Animated.Value(Math.random() * screenHeight),
      scale: new Animated.Value(Math.random() * 0.5 + 0.5),
      opacity: new Animated.Value(Math.random() * 0.7 + 0.3),
      rotate: new Animated.Value(0),
    }))
  ).current;

  const floatingButtonAnim = useRef(new Animated.Value(0)).current;

  const getTimeBasedGradient = () => {
    const hour = currentTime.getHours();

    if (hour >= 6 && hour < 12) {
      return ['#4A6FA5', '#6B8DD6', '#8BB8E8'];
    } else if (hour >= 12 && hour < 18) {
      return ['#5A7FC7', '#7B68EE', '#20B2AA'];
    } else if (hour >= 18 && hour < 22) {
      return ['#4682B4', '#FF7F7F', '#98FB98'];
    } else {
      return ['#2F4F4F', '#9370DB', '#CCCCFF'];
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const particleAnimations: Animated.CompositeAnimation[] = [];

    const animateParticles = () => {
      particleAnims.forEach((particle, index) => {
        const duration = 3000 + Math.random() * 4000;
        const delay = index * 200;

        const animation = Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(particle.translateX, {
                toValue: Math.random() * screenWidth,
                duration,
                useNativeDriver: true,
              }),
              Animated.timing(particle.translateY, {
                toValue: Math.random() * screenHeight,
                duration,
                useNativeDriver: true,
              }),
              Animated.timing(particle.rotate, {
                toValue: 360,
                duration: duration * 2,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(particle.opacity, {
                  toValue: 0.1,
                  duration: duration / 2,
                  useNativeDriver: true,
                }),
                Animated.timing(particle.opacity, {
                  toValue: 0.8,
                  duration: duration / 2,
                  useNativeDriver: true,
                }),
              ]),
            ]),
          ])
        );

        particleAnimations.push(animation);
        animation.start();
      });
    };

    animateParticles();

    return () => {
      particleAnimations.forEach(animation => {
        try {
          animation.stop();
        } catch (error) {
          // Animation may already be stopped, ignore error
        }
      });
      particleAnims.forEach(particle => {
        try {
          particle.translateX.stopAnimation();
          particle.translateY.stopAnimation();
          particle.rotate.stopAnimation();
          particle.opacity.stopAnimation();
        } catch (error) {
          // Animation may already be stopped, ignore error
        }
      });
    };
  }, []);

  useEffect(() => {
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingButtonAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingButtonAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    floatingAnimation.start();

    return () => {
      try {
        floatingAnimation.stop();
        floatingButtonAnim.stopAnimation();
      } catch (error) {
        // Animation may already be stopped, ignore error
      }
    };
  }, []);

  const backgroundTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -150],
    extrapolate: 'clamp',
  });

  const midgroundTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -75],
    extrapolate: 'clamp',
  });

  const foregroundTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -25],
    extrapolate: 'clamp',
  });

  const heroScale = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 200, 300],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const gradientColors = getTimeBasedGradient();

  return (
    <View style={styles.container}>
      {}
      <Animated.View
        style={[
          styles.backgroundLayer,
          {
            transform: [{ translateY: backgroundTranslateY }],
          },
        ]}
      >
        <View
          style={[
            styles.gradientBackground,
            { backgroundColor: gradientColors[0] },
          ]}
        />
        <View
          style={[
            styles.gradientOverlay,
            { backgroundColor: gradientColors[1] },
          ]}
        />
        <View
          style={[styles.gradientTop, { backgroundColor: gradientColors[2] }]}
        />
      </Animated.View>

      {}
      <Animated.View
        style={[
          styles.particleLayer,
          {
            transform: [{ translateY: midgroundTranslateY }],
          },
        ]}
      >
        {particleAnims.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: particle.translateX },
                  { translateY: particle.translateY },
                  { scale: particle.scale },
                  {
                    rotate: particle.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
                opacity: particle.opacity,
              },
            ]}
          />
        ))}
      </Animated.View>

      {}
      <Animated.View
        style={[
          styles.foregroundLayer,
          {
            transform: [
              { translateY: foregroundTranslateY },
              { scale: heroScale },
            ],
            opacity: heroOpacity,
          },
        ]}
      >
        {children}
      </Animated.View>

      {}
      <Animated.View
        style={[
          styles.floatingButtonContainer,
          {
            transform: [
              {
                translateY: floatingButtonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10],
                }),
              },
              {
                scale: floatingButtonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.floatingButton,
            { backgroundColor: gradientColors[0] },
          ]}
        >
          <Text style={styles.buttonIcon}>📦</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingButton,
            { backgroundColor: gradientColors[1] },
          ]}
        >
          <Text style={styles.buttonIcon}>📋</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingButton,
            { backgroundColor: gradientColors[2] },
          ]}
        >
          <Text style={styles.buttonIcon}>🏪</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundLayer: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    height: 600,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70%',
    opacity: 0.6,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    opacity: 0.4,
  },
  particleLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surface,
    boxShadow: `0 0 4px ${colors.primary}cc`,
    elevation: 5,
  },
  foregroundLayer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  floatingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 20,
    textAlign: 'center',
  },
});
