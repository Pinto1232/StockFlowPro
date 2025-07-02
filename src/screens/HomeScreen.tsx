import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Animated, TouchableOpacity, Modal, Pressable } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { ParallaxHero } from '../components/parallax';
import { WidgetGrid, WidgetMarketplace, Widget } from '../components/widgets';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - (spacing.lg * 4); // Full width minus container and card padding

// Single Responsibility Principle - This screen only handles home display
export const HomeScreen: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [marketplaceVisible, setMarketplaceVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: '1',
      type: 'weather',
      title: 'Weather',
      size: { width: 160, height: 160 },
      position: { x: 0, y: 0 },
      color: '#4ECDC4',
    },
    {
      id: '2',
      type: 'clock',
      title: 'Clock',
      size: { width: 80, height: 80 },
      position: { x: 180, y: 0 },
      color: '#43e97b',
    },
    {
      id: '3',
      type: 'stats',
      title: 'Stats',
      size: { width: 160, height: 80 },
      position: { x: 0, y: 180 },
      color: '#667eea',
    },
  ]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;

  const navigationItems = [
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
        '🎯 Quick actions'
      ],
      longDesc: 'The Home screen provides a comprehensive overview of your application with real-time data, performance metrics, and quick access to essential features.'
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
        '📊 Activity tracking'
      ],
      longDesc: 'Manage all user accounts, permissions, and activities. Create, edit, and monitor user profiles with advanced security features.'
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
        '💾 State persistence'
      ],
      longDesc: 'A simple yet powerful counter demonstration showcasing state management, persistence, and interactive controls with smooth animations.'
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
        '🔒 Privacy controls'
      ],
      longDesc: 'Customize your app experience with theme options, notification preferences, language settings, and privacy controls.'
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % navigationItems.length;
        
        // Animate transition
        Animated.sequence([
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
        ]).start();

        // No need to scroll since we're showing one card at a time
        
        return nextIndex;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [fadeAnim, scaleAnim]);

  const handleCardPress = (index: number) => {
    setCurrentIndex(index);
    setSelectedCard(navigationItems[index]);
    setModalVisible(true);
    
    // Animate modal entrance
    Animated.parallel([
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
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
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
    ]).start(() => {
      setModalVisible(false);
      setSelectedCard(null);
    });
  };

  // Widget management functions
  const handleWidgetMove = (widgetId: string, newPosition: { x: number; y: number }) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId ? { ...widget, position: newPosition } : widget
    ));
  };

  const handleWidgetResize = (widgetId: string, newSize: { width: number; height: number }) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId ? { ...widget, size: newSize } : widget
    ));
  };

  const handleAddWidget = (template: any) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: template.type,
      title: template.title,
      size: template.defaultSize,
      position: { x: 0, y: 0 }, // Will be positioned automatically
      color: template.color,
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
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
        <ParallaxHero scrollY={scrollY}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>NeonApp</Text>
            <Text style={styles.heroSubtitle}>Modern React Native Architecture</Text>
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={[styles.heroButton, styles.heroPrimaryButton]}
                onPress={() => setMarketplaceVisible(true)}
              >
                <Text style={styles.heroButtonText}>Add Widgets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.heroButton, styles.heroSecondaryButton]}
                onPress={toggleEditMode}
              >
                <Text style={[styles.heroButtonText, { color: colors.primary }]}>
                  {editMode ? 'Done' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ParallaxHero>

        <View style={styles.content}>
          {/* Smart Widget Grid */}
          <View style={styles.widgetSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Smart Widgets</Text>
              <Text style={styles.sectionSubtitle}>
                {editMode ? 'Drag to rearrange widgets' : 'Tap to add more widgets'}
              </Text>
            </View>
            <View style={styles.widgetContainer}>
              <WidgetGrid
                widgets={widgets}
                onWidgetMove={handleWidgetMove}
                onWidgetResize={handleWidgetResize}
                editable={editMode}
              />
            </View>
          </View>

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
                      backgroundColor: navigationItems[currentIndex].color + '15',
                      borderColor: navigationItems[currentIndex].color + '30',
                      opacity: fadeAnim,
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <View style={[styles.iconContainer, { backgroundColor: navigationItems[currentIndex].color + '20' }]}>
                    <Text style={styles.navIcon}>{navigationItems[currentIndex].icon}</Text>
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.navTitle, { color: navigationItems[currentIndex].color }]}>
                      {navigationItems[currentIndex].title}
                    </Text>
                    <Text style={styles.navDesc}>{navigationItems[currentIndex].desc}</Text>
                  </View>
                  <View style={[styles.activeIndicator, { backgroundColor: navigationItems[currentIndex].color }]} />
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
                      backgroundColor: currentIndex === index 
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

      {/* Enhanced Modal Popup */}
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
            <Pressable onPress={(e) => e.stopPropagation()}>
              {selectedCard && (
                <View style={[styles.modalContent, { borderTopColor: selectedCard.color }]}>
                  {/* Header */}
                  <View style={[styles.modalHeader, { backgroundColor: selectedCard.color + '10' }]}>
                    <View style={[styles.modalIconContainer, { backgroundColor: selectedCard.color + '20' }]}>
                      <Text style={styles.modalIcon}>{selectedCard.icon}</Text>
                    </View>
                    <View style={styles.modalHeaderText}>
                      <Text style={[styles.modalTitle, { color: selectedCard.color }]}>
                        {selectedCard.title}
                      </Text>
                      <Text style={styles.modalSubtitle}>{selectedCard.desc}</Text>
                    </View>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                      <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Content */}
                  <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                    <Text style={styles.modalDescription}>
                      {selectedCard.longDesc}
                    </Text>

                    <Text style={styles.featuresTitle}>Key Features:</Text>
                    <View style={styles.featuresList}>
                      {selectedCard.features.map((feature: string, index: number) => (
                        <View key={index} style={styles.featureItem}>
                          <View style={[styles.featureBullet, { backgroundColor: selectedCard.color }]} />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.modalActions}>
                      <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: selectedCard.color }]}
                        onPress={() => {
                          closeModal();
                          // Here you could navigate to the actual screen
                        }}
                      >
                        <Text style={styles.primaryButtonText}>Explore {selectedCard.title}</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.secondaryButton, { borderColor: selectedCard.color }]}
                        onPress={closeModal}
                      >
                        <Text style={[styles.secondaryButtonText, { color: selectedCard.color }]}>
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

      {/* Widget Marketplace */}
      <WidgetMarketplace
        visible={marketplaceVisible}
        onClose={() => setMarketplaceVisible(false)}
        onAddWidget={handleAddWidget}
      />
    </View>
  );
};

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
  heroActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  heroButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 120,
    alignItems: 'center',
  },
  heroPrimaryButton: {
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  heroSecondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  heroButtonText: {
    ...typography.textStyles.button,
    fontWeight: '600',
    color: colors.surface,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100, // Account for tab bar
  },
  widgetSection: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.textStyles.h3,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  widgetContainer: {
    height: 300,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
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
    height: 160, // Increased height for better content display
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
  // Modal Styles
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