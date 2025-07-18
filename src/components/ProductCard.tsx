import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';

const { width: screenWidth } = Dimensions.get('window');

interface ProductCardProps {
  item: {
    id?: string;
    name: string;
    description?: string;
    costPerItem?: number;
    formattedPrice?: string;
    numberInStock?: number;
    stockDisplay?: string;
    isActive: boolean;
    isLowStock?: boolean;
    isInStock?: boolean;
    stockStatus?: string;
    stockLevel?: string;
    stockStatusBadge?: 'danger' | 'warning' | 'success';
    priceRange?: string;
    createdAt?: string;
    createdDisplay?: string;
    createdFriendly?: string;
    activeStatusBadge?: string;
    formattedName?: string;
    totalValue?: number;
    formattedTotalValue?: string;
  };
  index: number;
  onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, index, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 150; 

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
    ]).start();

    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    
    const shimmerTimeout = setTimeout(() => {
      shimmerAnimation.start();
    }, delay + 1000);

    return () => {
      clearTimeout(shimmerTimeout);
      shimmerAnimation.stop();
    };
  }, [index]);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const getStatusColor = () => {
    if (item.stockStatusBadge === 'danger') return colors.error;
    if (item.stockStatusBadge === 'warning') return colors.warning;
    if (item.isLowStock) return colors.warning;
    if (item.isInStock) return colors.success;
    return colors.primary;
  };

  const statusColor = getStatusColor();

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['5deg', '0deg'],
  });

  const shadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.25],
  });

  const shadowRadius = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 16],
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={styles.cardContainer}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
              { rotate: rotateInterpolate },
            ],
            opacity: fadeAnim,
            shadowOpacity: Platform.OS === 'ios' ? shadowOpacity : 0,
            shadowRadius: Platform.OS === 'ios' ? shadowRadius : 0,
            elevation: Platform.OS === 'android' ? (isPressed ? 12 : 8) : 0,
          },
        ]}
      >
        {}
        <View style={styles.shimmerContainer}>
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                transform: [{ translateX: shimmerTranslateX }],
              },
            ]}
          />
        </View>

        {}
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />

        {}
        <Animated.View
          style={[
            styles.actionIndicator,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.actionIcon}>→</Text>
        </Animated.View>

        {}
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.formattedName || item.name}
            </Text>
          </View>
          <View style={styles.badgeRow}>
            <Animated.View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: item.isActive ? colors.success : colors.error,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.statusText}>
                {item.activeStatusBadge || (item.isActive ? 'Active' : 'Inactive')}
              </Text>
            </Animated.View>
          </View>
        </View>

        {}
        {item.description && (
          <Text style={styles.productDescription} numberOfLines={3}>
            {item.description}
          </Text>
        )}

        {}
        <View style={styles.detailsSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>
              {item.formattedPrice || `$${item.costPerItem?.toFixed(2) || '0.00'}`}
            </Text>
          </View>

          <View style={styles.stockContainer}>
            <Text style={styles.stockLabel}>Stock</Text>
            <Text
              style={[
                styles.stockValue,
                {
                  color: item.isLowStock
                    ? colors.error
                    : item.isInStock
                      ? colors.success
                      : colors.textPrimary,
                },
              ]}
            >
              {item.stockDisplay || `${item.numberInStock || 0} units`}
            </Text>
          </View>
        </View>

        {}
        {(item.stockStatus || item.priceRange) && (
          <View style={styles.extraInfo}>
            {item.stockStatus && (
              <View
                style={[
                  styles.stockStatusBadge,
                  {
                    backgroundColor: statusColor + '15',
                    borderColor: statusColor + '30',
                  },
                ]}
              >
                <Text style={[styles.stockStatusText, { color: statusColor }]}>
                  {item.stockStatus}
                </Text>
              </View>
            )}
            {item.priceRange && (
              <View style={styles.priceRangeBadge}>
                <Text style={styles.priceRangeText}>{item.priceRange}</Text>
              </View>
            )}
          </View>
        )}

        {}
        <View style={styles.cardFooter}>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Created</Text>
            <Text style={styles.dateValue}>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'N/A'}
            </Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Stock Level</Text>
            <Text style={[styles.dateValue, { 
              color: item.isInStock 
                ? colors.success 
                : item.isLowStock 
                  ? colors.warning 
                  : colors.error 
            }]}>
              {item.stockLevel || 'Unknown'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: spacing.lg,
    marginHorizontal: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadowMedium,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRadius: borderRadius.xl,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 100,
    transform: [{ skewX: '-20deg' }],
  },
  statusIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    borderTopLeftRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
  },
  actionIndicator: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  actionIcon: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
    includeFontPadding: false,
  },
  cardHeader: {
    marginBottom: spacing.md,
    paddingRight: 44, 
  },
  titleRow: {
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  productName: {
    ...typography.textStyles.h4,
    color: colors.textPrimary,
    fontWeight: '700',
    lineHeight: 24,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'flex-start',
  },
  statusText: {
    ...typography.textStyles.caption,
    color: colors.surface,
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productDescription: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  priceContainer: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  priceValue: {
    ...typography.textStyles.h4,
    color: colors.primary,
    fontWeight: '800',
    fontSize: 18,
  },
  stockContainer: {
    flex: 1,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.borderLight,
  },
  stockLabel: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  stockValue: {
    ...typography.textStyles.h4,
    fontWeight: '700',
    fontSize: 16,
  },
  extraInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stockStatusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  stockStatusText: {
    ...typography.textStyles.caption,
    fontWeight: '600',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceRangeBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  priceRangeText: {
    ...typography.textStyles.caption,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  dateInfo: {
    alignItems: 'center',
  },
  dateLabel: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  dateValue: {
    ...typography.textStyles.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 11,
  },
});