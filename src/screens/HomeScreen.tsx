import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { ParallaxHero } from '../components/parallax';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ProductCard } from '../components/ProductCard';
import { useProductsEnhanced } from '../hooks/useProductsEnhanced';
import { safeStopAnimation, debounce } from '../utils/platformUtils';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - spacing.lg * 4;
const INITIAL_PRODUCTS_COUNT = 2;
const PRODUCTS_PER_LOAD = 2;

const HomeScreenComponent: React.FC = () => {
  
  const mountedRef = useRef(true);
  const componentIdRef = useRef(Math.random().toString(36).substr(2, 9));
  const cleanupExecutedRef = useRef(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [dataSource] = useState<'mock' | 'api' | 'both'>('api');

  const [displayedProductsCount, setDisplayedProductsCount] = useState(
    INITIAL_PRODUCTS_COUNT
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;

  const activeAnimationsRef = useRef(new Set<Animated.CompositeAnimation>());
  const activeIntervalsRef = useRef(new Set<NodeJS.Timeout>());
  const animationCallbacksRef = useRef(new Set<() => void>());

  const safeSetCurrentIndex = useCallback(
    (value: number | ((prev: number) => number)) => {
      if (mountedRef.current && !cleanupExecutedRef.current) {
        setCurrentIndex(value);
      }
    },
    []
  );

  const safeSetModalVisible = useCallback((value: boolean) => {
    if (mountedRef.current && !cleanupExecutedRef.current) {
      setModalVisible(value);
    }
  }, []);

  const safeSetSelectedCard = useCallback((value: any) => {
    if (mountedRef.current && !cleanupExecutedRef.current) {
      setSelectedCard(value);
    }
  }, []);

  const safeSetDisplayedProductsCount = useCallback(
    (value: number | ((prev: number) => number)) => {
      if (mountedRef.current && !cleanupExecutedRef.current) {
        setDisplayedProductsCount(value);
      }
    },
    []
  );

  const safeSetIsLoadingMore = useCallback((value: boolean) => {
    if (mountedRef.current && !cleanupExecutedRef.current) {
      setIsLoadingMore(value);
    }
  }, []);

  const safeStartAnimation = useCallback(
    (
      animation: Animated.CompositeAnimation,
      callback?: (result: any) => void
    ) => {
      if (!mountedRef.current || cleanupExecutedRef.current) {
        return;
      }

      activeAnimationsRef.current.add(animation);

      const wrappedCallback = (result: any) => {
        
        activeAnimationsRef.current.delete(animation);

        if (mountedRef.current && !cleanupExecutedRef.current && callback) {
          try {
            callback(result);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Animation callback error:', error);
          }
        }
      };

      try {
        animation.start(wrappedCallback);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Animation start error:', error);
        activeAnimationsRef.current.delete(animation);
      }
    },
    []
  );

  const safeSetInterval = useCallback((callback: () => void, delay: number) => {
    if (!mountedRef.current || cleanupExecutedRef.current) {
      return null;
    }

    const wrappedCallback = () => {
      if (mountedRef.current && !cleanupExecutedRef.current) {
        try {
          callback();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Interval callback error:', error);
        }
      }
    };

    const interval = setInterval(wrappedCallback, delay);
    activeIntervalsRef.current.add(interval);

    return interval;
  }, []);

  const {
    enhancedData,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
    dataSources,
    sourceErrors,
  } = useProductsEnhanced({
    dataSource: dataSource,
    fallbackToMock: true,
    activeOnly: true,
  });

  const productsData = enhancedData
    ? {
        success: enhancedData.success,
        message: enhancedData.message,
        data: enhancedData.data.products, 
        total: enhancedData.data.total,
        page: enhancedData.data.page,
        totalPages: enhancedData.data.totalPages,
      }
    : undefined;

  const loadMoreProducts = useCallback(() => {
    if (!mountedRef.current || cleanupExecutedRef.current || isLoadingMore)
      return;

    const allProducts = productsData?.data || [];
    const currentCount = displayedProductsCount;
    const remainingProducts = allProducts.length - currentCount;

    if (remainingProducts <= 0) return;

    safeSetIsLoadingMore(true);

    setTimeout(() => {
      if (mountedRef.current && !cleanupExecutedRef.current) {
        const newCount = Math.min(
          currentCount + PRODUCTS_PER_LOAD,
          allProducts.length
        );
        safeSetDisplayedProductsCount(newCount);
        safeSetIsLoadingMore(false);
      }
    }, 500);
  }, [
    displayedProductsCount,
    productsData?.data,
    isLoadingMore,
    safeSetDisplayedProductsCount,
    safeSetIsLoadingMore,
  ]);

  const handleScroll = useCallback(
    (event: any) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const paddingToBottom = 100; 

      if (
        contentOffset.y + layoutMeasurement.height + paddingToBottom >=
        contentSize.height
      ) {
        loadMoreProducts();
      }
    },
    [loadMoreProducts]
  );

  useEffect(() => {
    if (!mountedRef.current) return;

    if (enhancedData) {
      // eslint-disable-next-line no-console
      console.log('📦 Enhanced Products Data Fetched:', {
        success: enhancedData.success,
        message: enhancedData.message,
        dataCount: enhancedData.data.products.length,
        sources: dataSources,
        componentId: componentIdRef.current,
      });

      if (enhancedData.data.products.length > 0) {
        // eslint-disable-next-line no-console
        console.log('📋 First Product Details:', enhancedData.data.products[0]);
      }
    }

    if (productsError) {
      // eslint-disable-next-line no-console
      console.error('❌ Products Error:', productsError);
    }

    if (sourceErrors) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Source Errors:', sourceErrors);
    }
  }, [enhancedData, productsError, sourceErrors, dataSources]);

  const debouncedRefetch = useMemo(
    () =>
      debounce(() => {
        if (mountedRef.current && !cleanupExecutedRef.current) {
          refetchProducts();
        }
      }, 500),
    [refetchProducts]
  );

  const navigationItems = useMemo(
    () => [
      {
        icon: '🏠',
        title: 'Home',
        desc: 'Overview and status',
        gradient: ['#667eea', '#764ba2'],
        color: '#667eea',
        features: [
          '📊 Real-time dashboard',
          '🔄 Auto-refresh data',
          '📈 Performance metrics',
          '🎯 Quick actions',
        ],
        longDesc:
          'The Home screen provides a comprehensive overview of your application with real-time data, performance metrics, and quick access to essential features.',
      },
      {
        icon: '👥',
        title: 'Users',
        desc: 'User management',
        gradient: ['#f093fb', '#f5576c'],
        color: '#f093fb',
        features: [
          '👤 User profiles',
          '🔐 Access control',
          '📝 User registration',
          '📊 Activity tracking',
        ],
        longDesc:
          'Manage all user accounts, permissions, and activities. Create, edit, and monitor user profiles with advanced security features.',
      },
      {
        icon: '🔢',
        title: 'Counter',
        desc: 'Counter example',
        gradient: ['#4facfe', '#00f2fe'],
        color: '#4facfe',
        features: [
          '➕ Increment values',
          '➖ Decrement values',
          '🔄 Reset functionality',
          '💾 State persistence',
        ],
        longDesc:
          'A simple yet powerful counter demonstration showcasing state management, persistence, and interactive controls with smooth animations.',
      },
      {
        icon: '⚙️',
        title: 'Settings',
        desc: 'App settings',
        gradient: ['#43e97b', '#38f9d7'],
        color: '#43e97b',
        features: [
          '🎨 Theme customization',
          '🔔 Notifications',
          '🌐 Language settings',
          '🔒 Privacy controls',
        ],
        longDesc:
          'Customize your app experience with theme options, notification preferences, language settings, and privacy controls.',
      },
    ],
    []
  );

  useEffect(() => {
    if (!mountedRef.current || cleanupExecutedRef.current) return;

    const interval = safeSetInterval(() => {
      safeSetCurrentIndex(prevIndex => {
        if (!mountedRef.current || cleanupExecutedRef.current) return prevIndex;

        const nextIndex = (prevIndex + 1) % navigationItems.length;

        const animation = Animated.sequence([
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0.7,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.95,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]);

        safeStartAnimation(animation);
        return nextIndex;
      });
    }, 3000);

    return () => {
      if (interval) {
        clearInterval(interval);
        activeIntervalsRef.current.delete(interval);
      }
    };
  }, [
    fadeAnim,
    scaleAnim,
    navigationItems.length,
    safeSetInterval,
    safeStartAnimation,
    safeSetCurrentIndex,
  ]);

  const handleCardPress = useCallback(
    (index: number) => {
      if (!mountedRef.current || cleanupExecutedRef.current) return;

      safeSetCurrentIndex(index);
      safeSetSelectedCard(navigationItems[index]);
      safeSetModalVisible(true);

      try {
        modalAnim.setValue(0);
        modalScaleAnim.setValue(0.8);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Modal animation reset error:', error);
        return;
      }

      const animation = Animated.parallel([
        Animated.timing(modalAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(modalScaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]);

      safeStartAnimation(animation);
    },
    [
      navigationItems,
      modalAnim,
      modalScaleAnim,
      safeStartAnimation,
      safeSetCurrentIndex,
      safeSetSelectedCard,
      safeSetModalVisible,
    ]
  );

  const closeModal = useCallback(() => {
    if (!mountedRef.current || cleanupExecutedRef.current) return;

    const animation = Animated.parallel([
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalScaleAnim, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
    ]);

    safeStartAnimation(animation, () => {
      if (mountedRef.current && !cleanupExecutedRef.current) {
        safeSetModalVisible(false);
        safeSetSelectedCard(null);
        try {
          modalAnim.setValue(0);
          modalScaleAnim.setValue(0.8);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Modal close animation error:', error);
        }
      }
    });
  }, [
    modalAnim,
    modalScaleAnim,
    safeStartAnimation,
    safeSetModalVisible,
    safeSetSelectedCard,
  ]);

  useLayoutEffect(() => {
    return () => {
      
      mountedRef.current = false;

      if (cleanupExecutedRef.current) return;
      cleanupExecutedRef.current = true;

      // eslint-disable-next-line no-console
      console.log(
        `🧹 Cleaning up HomeScreen component ${componentIdRef.current}`
      );

      const animationsToStop = Array.from(activeAnimationsRef.current);
      animationsToStop.forEach(animation => {
        try {
          animation.stop();
        } catch (error) {
          
        }
      });
      activeAnimationsRef.current.clear();

      const intervalsToStop = Array.from(activeIntervalsRef.current);
      intervalsToStop.forEach(interval => {
        try {
          clearInterval(interval);
        } catch (error) {
          
        }
      });
      activeIntervalsRef.current.clear();

      const callbacksToExecute = Array.from(animationCallbacksRef.current);
      callbacksToExecute.forEach(callback => {
        try {
          callback();
        } catch (error) {
          
        }
      });
      animationCallbacksRef.current.clear();

      const animatedValues = [
        fadeAnim,
        scaleAnim,
        modalAnim,
        modalScaleAnim,
        scrollY,
      ];
      animatedValues.forEach(animatedValue => {
        try {
          safeStopAnimation(animatedValue);
        } catch (error) {
          
        }
      });

      // eslint-disable-next-line no-console
      console.log(
        `✅ HomeScreen component ${componentIdRef.current} cleanup completed`
      );
    };
  }, [fadeAnim, scaleAnim, modalAnim, modalScaleAnim, scrollY]);

  if (!mountedRef.current || cleanupExecutedRef.current) {
    return null;
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Animated.ScrollView
          ref={scrollViewRef}
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
              listener: handleScroll,
            }
          )}
          scrollEventThrottle={16}
        >
          {}
          <ErrorBoundary>
            <ParallaxHero scrollY={scrollY}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Stock Flow Pro</Text>
                <Text style={styles.heroSubtitle}>
                  Inventory Management System
                </Text>
              </View>
            </ParallaxHero>
          </ErrorBoundary>

          <View style={styles.content}>
            {}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📦 Products</Text>
              </View>

              {productsLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.loadingText}>Loading products...</Text>
                </View>
              ) : productsError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    ❌ Error loading products: {productsError.message}
                  </Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={debouncedRefetch}
                  >
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : productsData?.success ? (
                <View style={styles.productsContainer}>
                  <View style={styles.productsHeader}>
                    <Text style={styles.productsCount}>
                      Showing{' '}
                      {Math.min(
                        displayedProductsCount,
                        productsData.data?.length || 0
                      )}{' '}
                      of {productsData.data?.length || 0} products
                    </Text>
                    <TouchableOpacity
                      style={styles.refreshButton}
                      onPress={debouncedRefetch}
                    >
                      <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={(productsData.data || []).slice(
                      0,
                      displayedProductsCount
                    )}
                    keyExtractor={(item: any, index: number) =>
                      item?.id || `empty-${index}`
                    }
                    renderItem={({
                      item,
                      index,
                    }: {
                      item: any;
                      index: number;
                    }) => {
                      if (!item) {
                        return null;
                      }

                      return (
                        <ProductCard
                          item={item}
                          index={index}
                          onPress={() => {
                            // eslint-disable-next-line no-console
                            console.log('Product pressed:', item.name);
                          }}
                        />
                      );
                    }}
                    ListEmptyComponent={() => (
                      <Text style={styles.noDataText}>
                        No products available
                      </Text>
                    )}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={5}
                    windowSize={10}
                  />

                  {}
                  {productsData.data &&
                    displayedProductsCount < productsData.data.length && (
                      <View style={styles.loadMoreContainer}>
                        {isLoadingMore ? (
                          <View style={styles.loadingMoreContainer}>
                            <ActivityIndicator
                              size="small"
                              color={colors.textSecondary}
                            />
                            <Text style={styles.loadingMoreText}>
                              Loading...
                            </Text>
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.loadMoreButton}
                            onPress={loadMoreProducts}
                          >
                            <Text style={styles.loadMoreButtonText}>
                              Load More
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}

                  {}
                  {productsData.data &&
                    displayedProductsCount >= productsData.data.length &&
                    productsData.data.length > INITIAL_PRODUCTS_COUNT && (
                      <View style={styles.completionContainer}>
                        <Text style={styles.completionText}>
                          ✅ All {productsData.data.length} products loaded
                        </Text>
                      </View>
                    )}
                </View>
              ) : (
                <Text style={styles.noDataText}>No product data available</Text>
              )}
            </View>

            {}
            <View style={styles.card}>
              {}
              <Text style={styles.infoText}>
                Explore the app using the modern tab navigation below:
              </Text>

              {}
              <View style={styles.carouselContainer}>
                <TouchableOpacity
                  style={styles.navCard}
                  onPress={() => handleCardPress(currentIndex)}
                  activeOpacity={0.8}
                >
                  <Animated.View
                    style={[
                      styles.navCardContent,
                      {
                        backgroundColor:
                          navigationItems[currentIndex].color + '15',
                        borderColor: navigationItems[currentIndex].color + '30',
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor:
                            navigationItems[currentIndex].color + '20',
                        },
                      ]}
                    >
                      <Text style={styles.navIcon}>
                        {navigationItems[currentIndex].icon}
                      </Text>
                    </View>
                    <View style={styles.cardTextContainer}>
                      <Text
                        style={[
                          styles.navTitle,
                          { color: navigationItems[currentIndex].color },
                        ]}
                      >
                        {navigationItems[currentIndex].title}
                      </Text>
                      <Text style={styles.navDesc}>
                        {navigationItems[currentIndex].desc}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.activeIndicator,
                        {
                          backgroundColor: navigationItems[currentIndex].color,
                        },
                      ]}
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>

              {}
              <View style={styles.paginationContainer}>
                {navigationItems.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.paginationDot,
                      {
                        backgroundColor:
                          currentIndex === index
                            ? navigationItems[currentIndex].color
                            : colors.textSecondary + '40',
                        width: currentIndex === index ? 24 : 8,
                      },
                    ]}
                    onPress={() => handleCardPress(index)}
                  />
                ))}
              </View>
            </View>
          </View>
        </Animated.ScrollView>

        {}
        {modalVisible && mountedRef.current && !cleanupExecutedRef.current && (
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="none"
            onRequestClose={closeModal}
          >
            <Pressable style={styles.modalOverlay} onPress={closeModal}>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    opacity: modalAnim,
                    transform: [{ scale: modalScaleAnim }],
                  },
                ]}
              >
                <Pressable onPress={(e: any) => e.stopPropagation()}>
                  {selectedCard && (
                    <View
                      style={[
                        styles.modalContent,
                        { borderTopColor: selectedCard.color },
                      ]}
                    >
                      {}
                      <View
                        style={[
                          styles.modalHeader,
                          { backgroundColor: selectedCard.color + '10' },
                        ]}
                      >
                        <View
                          style={[
                            styles.modalIconContainer,
                            { backgroundColor: selectedCard.color + '20' },
                          ]}
                        >
                          <Text style={styles.modalIcon}>
                            {selectedCard.icon}
                          </Text>
                        </View>
                        <View style={styles.modalHeaderText}>
                          <Text
                            style={[
                              styles.modalTitle,
                              { color: selectedCard.color },
                            ]}
                          >
                            {selectedCard.title}
                          </Text>
                          <Text style={styles.modalSubtitle}>
                            {selectedCard.desc}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={closeModal}
                        >
                          <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                      </View>

                      {}
                      <ScrollView
                        style={styles.modalBody}
                        showsVerticalScrollIndicator={false}
                      >
                        <Text style={styles.modalDescription}>
                          {selectedCard.longDesc}
                        </Text>

                        <Text style={styles.featuresTitle}>Key Features:</Text>
                        <View style={styles.featuresList}>
                          {selectedCard.features.map(
                            (feature: string, index: number) => (
                              <View key={index} style={styles.featureItem}>
                                <View
                                  style={[
                                    styles.featureBullet,
                                    { backgroundColor: selectedCard.color },
                                  ]}
                                />
                                <Text style={styles.featureText}>
                                  {feature}
                                </Text>
                              </View>
                            )
                          )}
                        </View>

                        {}
                        <View style={styles.modalActions}>
                          <TouchableOpacity
                            style={[
                              styles.primaryButton,
                              { backgroundColor: selectedCard.color },
                            ]}
                            onPress={() => {
                              closeModal();
                              
                            }}
                          >
                            <Text style={styles.primaryButtonText}>
                              Explore {selectedCard.title}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.secondaryButton,
                              { borderColor: selectedCard.color },
                            ]}
                            onPress={closeModal}
                          >
                            <Text
                              style={[
                                styles.secondaryButtonText,
                                { color: selectedCard.color },
                              ]}
                            >
                              Close
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </ScrollView>
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            </Pressable>
          </Modal>
        )}
      </View>
    </ErrorBoundary>
  );
};

export const HomeScreen = React.memo(HomeScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContainer: {
    flex: 1,
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  heroTitle: {
    ...typography.textStyles.h1,
    fontSize: 36,
    fontWeight: '800',
    color: colors.surface,
    textAlign: 'center',
    marginBottom: spacing.sm,
    // @ts-ignore - textShadow is valid for React Native Web
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  } as any,
  heroSubtitle: {
    ...typography.textStyles.body,
    fontSize: 16,
    color: colors.surface,
    textAlign: 'center',
    marginBottom: spacing.xl,
    opacity: 0.9,
    // @ts-ignore - textShadow is valid for React Native Web
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  } as any,
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.textStyles.h3,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.xs,
    flex: 1,
  },
  section: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  errorText: {
    ...typography.textStyles.body,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    ...typography.textStyles.button,
    color: colors.surface,
    fontWeight: '600',
  },
  productsContainer: {
    marginTop: spacing.md,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  productsCount: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  refreshButton: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  refreshButtonText: {
    ...typography.textStyles.caption,
    color: colors.primary,
    fontWeight: '600',
  },
    noDataText: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: spacing.xl,
  },
  
  loadMoreContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  loadingMoreText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    fontSize: 12,
  },
  loadMoreButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  loadMoreButtonText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 12,
  },
  completionContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.success + '10',
    borderRadius: borderRadius.sm,
  },
  completionText: {
    ...typography.textStyles.caption,
    color: colors.success,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 12,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
    shadowColor: colors.shadowMedium,
  },
  cardTitle: {
    ...typography.textStyles.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoText: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  carouselContainer: {
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  navCard: {
    height: 160,
    width: CARD_WIDTH,
  },
  navCardContent: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    position: 'relative',
    justifyContent: 'flex-start',
    ...shadows.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  cardTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 28,
  },
  navTitle: {
    ...typography.textStyles.h4,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  navDesc: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderTopWidth: 4,
    overflow: 'hidden',
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  modalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  modalIcon: {
    fontSize: 24,
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    ...typography.textStyles.h3,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modalBody: {
    padding: spacing.lg,
    maxHeight: 400,
  },
  modalDescription: {
    ...typography.textStyles.body,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  featuresTitle: {
    ...typography.textStyles.h4,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  featuresList: {
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.md,
  },
  featureText: {
    ...typography.textStyles.body,
    color: colors.textPrimary,
    flex: 1,
  },
  modalActions: {
    gap: spacing.md,
  },
  primaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  primaryButtonText: {
    ...typography.textStyles.button,
    color: colors.surface,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    ...typography.textStyles.button,
    fontWeight: '600',
  },
});
