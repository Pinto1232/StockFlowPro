import React, { useEffect, useRef, useState, useCallback, useMemo, useLayoutEffect } from 'react';
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
import { useDashboardStats } from '../hooks';
import { useProductsEnhanced } from '../hooks/useProductsEnhanced';
import { ProductDataSourceSelector } from '../components/ProductDataSourceSelector';
import {
  safeStopAnimation,
  debounce,
} from '../utils/platformUtils';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - spacing.lg * 4;

// Enhanced component with bulletproof lifecycle management and dual data sources
const HomeScreenComponent: React.FC = () => {
  // Component state tracking with multiple layers of protection
  const mountedRef = useRef(true);
  const componentIdRef = useRef(Math.random().toString(36).substr(2, 9));
  const cleanupExecutedRef = useRef(false);
  
  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // State with safe setters
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showDataSourceSelector, setShowDataSourceSelector] = useState(false);
  const [dataSource, setDataSource] = useState<'mock' | 'api' | 'both'>('api');
  
  // Animation values with proper initialization
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;
  
  // Animation and interval tracking with WeakSet for better memory management
  const activeAnimationsRef = useRef(new Set<Animated.CompositeAnimation>());
  const activeIntervalsRef = useRef(new Set<NodeJS.Timeout>());
  const animationCallbacksRef = useRef(new Set<() => void>());

  // Safe state setters that check mount status
  const safeSetCurrentIndex = useCallback((value: number | ((prev: number) => number)) => {
    if (mountedRef.current && !cleanupExecutedRef.current) {
      setCurrentIndex(value);
    }
  }, []);

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

  // Enhanced animation helper with better error handling
  const safeStartAnimation = useCallback((
    animation: Animated.CompositeAnimation, 
    callback?: (result: any) => void
  ) => {
    if (!mountedRef.current || cleanupExecutedRef.current) {
      return;
    }
    
    // Add to tracking
    activeAnimationsRef.current.add(animation);
    
    // Wrap callback to ensure cleanup
    const wrappedCallback = (result: any) => {
      // Remove from tracking
      activeAnimationsRef.current.delete(animation);
      
      // Only execute callback if component is still mounted
      if (mountedRef.current && !cleanupExecutedRef.current && callback) {
        try {
          callback(result);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Animation callback error:', error);
        }
      }
    };

    // Start animation with error handling
    try {
      animation.start(wrappedCallback);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Animation start error:', error);
      activeAnimationsRef.current.delete(animation);
    }
  }, []);

  // Enhanced interval helper
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

  // Enhanced data fetching with dual sources
  const {
    enhancedData,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
    switchDataSource,
    currentDataSource,
    dataSources,
    sourceErrors,
  } = useProductsEnhanced({
    dataSource: dataSource,
    fallbackToMock: true,
    activeOnly: true,
  });

  // Backward compatible data structure
  const productsData = enhancedData ? {
    success: enhancedData.success,
    message: enhancedData.message,
    data: {
      products: enhancedData.data.products,
      total: enhancedData.data.total,
      page: enhancedData.data.page,
      totalPages: enhancedData.data.totalPages,
    }
  } : undefined;

  const { data: dashboardData, error: dashboardError } = useDashboardStats();

  // Console logging for data
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

  useEffect(() => {
    if (!mountedRef.current) return;

    if (dashboardData) {
      // eslint-disable-next-line no-console
      console.log('📈 Dashboard Data Fetched:', {
        success: dashboardData.success,
        message: dashboardData.message,
        stats: dashboardData.data,
        componentId: componentIdRef.current,
      });
    }

    if (dashboardError) {
      // eslint-disable-next-line no-console
      console.error('❌ Dashboard Error:', dashboardError);
    }
  }, [dashboardData, dashboardError]);

  // Debounced refetch with mount check
  const debouncedRefetch = useMemo(
    () => debounce(() => {
      if (mountedRef.current && !cleanupExecutedRef.current) {
        refetchProducts();
      }
    }, 500),
    [refetchProducts]
  );

  // Handle data source changes
  const handleDataSourceChange = useCallback((source: 'mock' | 'api' | 'both') => {
    if (mountedRef.current && !cleanupExecutedRef.current) {
      setDataSource(source);
      switchDataSource(source);
      // eslint-disable-next-line no-console
      console.log(`🔄 Switched data source to: ${source}`);
    }
  }, [switchDataSource]);

  // Memoized navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(() => [
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
  ], []);

  // Auto-slide functionality with bulletproof cleanup
  useEffect(() => {
    if (!mountedRef.current || cleanupExecutedRef.current) return;

    const interval = safeSetInterval(() => {
      safeSetCurrentIndex(prevIndex => {
        if (!mountedRef.current || cleanupExecutedRef.current) return prevIndex;
        
        const nextIndex = (prevIndex + 1) % navigationItems.length;

        // Create transition animation with proper cleanup
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

    // Return cleanup function
    return () => {
      if (interval) {
        clearInterval(interval);
        activeIntervalsRef.current.delete(interval);
      }
    };
  }, [fadeAnim, scaleAnim, navigationItems.length, safeSetInterval, safeStartAnimation, safeSetCurrentIndex]);

  // Modal handlers with enhanced safety
  const handleCardPress = useCallback((index: number) => {
    if (!mountedRef.current || cleanupExecutedRef.current) return;
    
    safeSetCurrentIndex(index);
    safeSetSelectedCard(navigationItems[index]);
    safeSetModalVisible(true);

    // Reset animation values safely
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
  }, [navigationItems, modalAnim, modalScaleAnim, safeStartAnimation, safeSetCurrentIndex, safeSetSelectedCard, safeSetModalVisible]);

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
  }, [modalAnim, modalScaleAnim, safeStartAnimation, safeSetModalVisible, safeSetSelectedCard]);

  // Enhanced cleanup with multiple safety layers
  useLayoutEffect(() => {
    return () => {
      // Mark as unmounted immediately
      mountedRef.current = false;
      
      // Prevent multiple cleanup executions
      if (cleanupExecutedRef.current) return;
      cleanupExecutedRef.current = true;
      
      // eslint-disable-next-line no-console
      console.log(`🧹 Cleaning up HomeScreen component ${componentIdRef.current}`);
      
      // Stop all active animations with error handling
      const animationsToStop = Array.from(activeAnimationsRef.current);
      animationsToStop.forEach(animation => {
        try {
          animation.stop();
        } catch (error) {
          // Silently ignore cleanup errors
        }
      });
      activeAnimationsRef.current.clear();
      
      // Clear all intervals with error handling
      const intervalsToStop = Array.from(activeIntervalsRef.current);
      intervalsToStop.forEach(interval => {
        try {
          clearInterval(interval);
        } catch (error) {
          // Silently ignore cleanup errors
        }
      });
      activeIntervalsRef.current.clear();
      
      // Execute any registered callbacks
      const callbacksToExecute = Array.from(animationCallbacksRef.current);
      callbacksToExecute.forEach(callback => {
        try {
          callback();
        } catch (error) {
          // Silently ignore cleanup errors
        }
      });
      animationCallbacksRef.current.clear();
      
      // Stop animated values with error handling
      const animatedValues = [fadeAnim, scaleAnim, modalAnim, modalScaleAnim, scrollY];
      animatedValues.forEach(animatedValue => {
        try {
          safeStopAnimation(animatedValue);
        } catch (error) {
          // Silently ignore cleanup errors
        }
      });
      
      // eslint-disable-next-line no-console
      console.log(`✅ HomeScreen component ${componentIdRef.current} cleanup completed`);
    };
  }, [fadeAnim, scaleAnim, modalAnim, modalScaleAnim, scrollY]);

  // Early return if component is unmounted or cleanup executed
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
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {/* Parallax Hero Section */}
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
            {/* Data Source Selector */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔄 Data Source Configuration</Text>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setShowDataSourceSelector(!showDataSourceSelector)}
                >
                  <Text style={styles.toggleButtonText}>
                    {showDataSourceSelector ? '🔼 Hide' : '🔽 Show'} Settings
                  </Text>
                </TouchableOpacity>
              </View>
              
              {showDataSourceSelector && (
                <ProductDataSourceSelector
                  onDataSourceChange={handleDataSourceChange}
                  showHealthStatus={true}
                  showProductCount={true}
                />
              )}
            </View>

            {/* Products Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📦 Products</Text>
                <Text style={styles.sectionSubtitle}>
                  Data from: {dataSources.length > 0 ? dataSources.join(' + ') : 'Loading...'}
                  {currentDataSource === 'api' && ' (Backend: http://localhost:5131/api/products)'}
                </Text>
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
                      {productsData.data?.products?.length || 0} products found
                    </Text>
                    <TouchableOpacity
                      style={styles.refreshButton}
                      onPress={debouncedRefetch}
                    >
                      <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={productsData.data?.products || []}
                    keyExtractor={(item: any, index: number) => item?.id || `empty-${index}`}
                    renderItem={({ item }: { item: any }) => {
                      if (!item) {
                        return null;
                      }

                      return (
                        <View style={styles.productCard}>
                          <View style={styles.productHeader}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <View
                              style={[
                                styles.statusBadge,
                                {
                                  backgroundColor: item.isActive
                                    ? colors.success
                                    : colors.error,
                                },
                              ]}
                            >
                              <Text style={styles.statusText}>
                                {item.isActive ? 'Active' : 'Inactive'}
                              </Text>
                            </View>
                          </View>

                          {item.description && (
                            <Text style={styles.productDescription}>
                              {item.description}
                            </Text>
                          )}

                          <View style={styles.productDetails}>
                            <View style={styles.productDetailItem}>
                              <Text style={styles.productDetailLabel}>
                                Price:
                              </Text>
                              <Text style={styles.productDetailValue}>
                                {item.formattedPrice || `${item.price?.toFixed(2) || '0.00'}`}
                              </Text>
                            </View>
                            <View style={styles.productDetailItem}>
                              <Text style={styles.productDetailLabel}>
                                Stock:
                              </Text>
                              <Text
                                style={[
                                  styles.productDetailValue,
                                  {
                                    color: item.isLowStock 
                                      ? colors.error
                                      : item.isInStock 
                                        ? colors.success
                                        : colors.textPrimary,
                                  },
                                ]}
                              >
                                {item.stockDisplay || `${item.stockQuantity || 0} units`}
                              </Text>
                            </View>
                          </View>

                          {/* Additional backend info */}
                          {(item.stockStatus || item.priceRange) && (
                            <View style={styles.productExtraInfo}>
                              {item.stockStatus && (
                                <View style={[
                                  styles.statusBadge,
                                  {
                                    backgroundColor: item.stockStatusBadge === 'danger' 
                                      ? colors.error
                                      : item.stockStatusBadge === 'warning'
                                        ? colors.warning
                                        : colors.success,
                                  },
                                ]}>
                                  <Text style={styles.statusText}>
                                    {item.stockStatus}
                                  </Text>
                                </View>
                              )}
                              {item.priceRange && (
                                <Text style={styles.priceRangeText}>
                                  {item.priceRange}
                                </Text>
                              )}
                            </View>
                          )}

                          <View style={styles.productMeta}>
                            <Text style={styles.productMetaText}>
                              Created:{' '}
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                            </Text>
                            <Text style={styles.productMetaText}>
                              Updated:{' '}
                              {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'}
                            </Text>
                          </View>
                        </View>
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
                </View>
              ) : (
                <Text style={styles.noDataText}>No product data available</Text>
              )}
            </View>

            {/* Dashboard Stats Section */}
            {dashboardData?.success && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>📊 Dashboard Stats</Text>
                  <Text style={styles.sectionSubtitle}>
                    Overview statistics
                  </Text>
                </View>

                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {dashboardData.data?.totalProducts || 0}
                    </Text>
                    <Text style={styles.statLabel}>Total Products</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {dashboardData.data?.totalCategories || 0}
                    </Text>
                    <Text style={styles.statLabel}>Categories</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={[styles.statValue, { color: colors.error }]}>
                      {dashboardData.data?.lowStockItems || 0}
                    </Text>
                    <Text style={styles.statLabel}>Low Stock</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={[styles.statValue, { color: colors.success }]}>
                      ${dashboardData.data?.totalValue?.toFixed(2) || '0.00'}
                    </Text>
                    <Text style={styles.statLabel}>Total Value</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Navigation Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Navigation</Text>
              <Text style={styles.infoText}>
                Explore the app using the modern tab navigation below:
              </Text>

              {/* Auto-sliding Navigation Cards */}
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

              {/* Pagination Dots */}
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

        {/* Enhanced Modal Popup with conditional rendering */}
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
                      {/* Header */}
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

                      {/* Content */}
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
                                <Text style={styles.featureText}>{feature}</Text>
                              </View>
                            )
                          )}
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.modalActions}>
                          <TouchableOpacity
                            style={[
                              styles.primaryButton,
                              { backgroundColor: selectedCard.color },
                            ]}
                            onPress={() => {
                              closeModal();
                              // Here you could navigate to the actual screen
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

// Export memoized component to prevent unnecessary re-renders
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
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    ...typography.textStyles.body,
    fontSize: 16,
    color: colors.surface,
    textAlign: 'center',
    marginBottom: spacing.xl,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
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
  sectionSubtitle: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  toggleButton: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  toggleButtonText: {
    ...typography.textStyles.caption,
    color: colors.primary,
    fontWeight: '600',
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
  productCard: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  productName: {
    ...typography.textStyles.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.md,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typography.textStyles.caption,
    color: colors.surface,
    fontWeight: '600',
    fontSize: 10,
  },
  productDescription: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  productDetailItem: {
    flex: 1,
  },
  productDetailLabel: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  productDetailValue: {
    ...typography.textStyles.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  productExtraInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  priceRangeText: {
    ...typography.textStyles.caption,
    color: colors.primary,
    fontWeight: '600',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  productMetaText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
  },
  noDataText: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statValue: {
    ...typography.textStyles.h3,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    textAlign: 'center',
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