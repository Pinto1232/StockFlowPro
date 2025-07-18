import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';

interface WidgetTemplate {
  id: string;
  type: 'weather' | 'stats' | 'news' | 'clock' | 'calendar' | 'music';
  title: string;
  description: string;
  icon: string;
  color: string;
  defaultSize: { width: number; height: number };
  category: 'productivity' | 'entertainment' | 'information' | 'utilities';
}

interface WidgetMarketplaceProps {
  visible: boolean;
  onClose: () => void;
  onAddWidget: (template: WidgetTemplate) => void;
}

const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    id: 'weather-1',
    type: 'weather',
    title: 'Weather',
    description: 'Current weather conditions and forecast',
    icon: '☀️',
    color: '#4ECDC4',
    defaultSize: { width: 160, height: 160 },
    category: 'information',
  },
  {
    id: 'stats-1',
    type: 'stats',
    title: 'App Stats',
    description: 'Real-time application statistics',
    icon: '📊',
    color: '#667eea',
    defaultSize: { width: 160, height: 80 },
    category: 'productivity',
  },
  {
    id: 'news-1',
    type: 'news',
    title: 'News Feed',
    description: 'Latest news and updates',
    icon: '📰',
    color: '#f093fb',
    defaultSize: { width: 160, height: 120 },
    category: 'information',
  },
  {
    id: 'clock-1',
    type: 'clock',
    title: 'Digital Clock',
    description: 'Current time display',
    icon: '🕐',
    color: '#43e97b',
    defaultSize: { width: 80, height: 80 },
    category: 'utilities',
  },
  {
    id: 'calendar-1',
    type: 'calendar',
    title: 'Calendar',
    description: 'Upcoming events and schedule',
    icon: '📅',
    color: '#FF6B6B',
    defaultSize: { width: 160, height: 160 },
    category: 'productivity',
  },
  {
    id: 'music-1',
    type: 'music',
    title: 'Music Player',
    description: 'Now playing music controls',
    icon: '🎵',
    color: '#A8E6CF',
    defaultSize: { width: 240, height: 80 },
    category: 'entertainment',
  },
];

export const WidgetMarketplace: React.FC<WidgetMarketplaceProps> = ({
  visible,
  onClose,
  onAddWidget,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery] = useState('');
  const modalAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(modalAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const categories = [
    { id: 'all', title: 'All', icon: '📱' },
    { id: 'productivity', title: 'Productivity', icon: '⚡' },
    { id: 'entertainment', title: 'Entertainment', icon: '🎮' },
    { id: 'information', title: 'Information', icon: '📊' },
    { id: 'utilities', title: 'Utilities', icon: '🔧' },
  ];

  const filteredWidgets = WIDGET_TEMPLATES.filter(widget => {
    const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
    const matchesSearch = widget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddWidget = (template: WidgetTemplate) => {
    onAddWidget(template);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: modalAnim,
              transform: [
                {
                  scale: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {}
          <View style={styles.header}>
            <Text style={styles.title}>Widget Marketplace</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {}
          <ScrollView style={styles.widgetGrid} showsVerticalScrollIndicator={false}>
            <View style={styles.widgetRow}>
              {filteredWidgets.map(widget => (
                <TouchableOpacity
                  key={widget.id}
                  style={[styles.widgetCard, { borderColor: widget.color }]}
                  onPress={() => handleAddWidget(widget)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.widgetPreview, { backgroundColor: widget.color }]}>
                    <Text style={styles.widgetIcon}>{widget.icon}</Text>
                  </View>
                  <View style={styles.widgetInfo}>
                    <Text style={styles.widgetTitle}>{widget.title}</Text>
                    <Text style={styles.widgetDescription}>{widget.description}</Text>
                    <View style={styles.widgetMeta}>
                      <Text style={styles.widgetSize}>
                        {Math.round(widget.defaultSize.width / 80)}×{Math.round(widget.defaultSize.height / 80)}
                      </Text>
                      <Text style={[styles.widgetCategory, { color: widget.color }]}>
                        {widget.category}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.textStyles.h3,
    color: colors.textPrimary,
    fontWeight: '700',
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
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  categoryText: {
    ...typography.textStyles.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.surface,
  },
  widgetGrid: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  widgetRow: {
    paddingBottom: spacing.lg,
  },
  widgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  widgetPreview: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  widgetIcon: {
    fontSize: 24,
  },
  widgetInfo: {
    flex: 1,
  },
  widgetTitle: {
    ...typography.textStyles.h4,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  widgetDescription: {
    ...typography.textStyles.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  widgetMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widgetSize: {
    ...typography.textStyles.caption,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  widgetCategory: {
    ...typography.textStyles.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: colors.surface,
    fontWeight: 'bold',
  },
});