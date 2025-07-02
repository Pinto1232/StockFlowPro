import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, PanResponder } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const { width: screenWidth } = Dimensions.get('window');
const GRID_SIZE = 4;
const WIDGET_SIZE = (screenWidth - spacing.lg * 2 - spacing.sm * (GRID_SIZE - 1)) / GRID_SIZE;

export interface Widget {
  id: string;
  type: 'weather' | 'stats' | 'news' | 'clock' | 'calendar' | 'music';
  title: string;
  size: { width: number; height: number };
  position: { x: number; y: number };
  data?: any;
  color: string;
}

interface WidgetGridProps {
  widgets: Widget[];
  onWidgetMove?: (widgetId: string, newPosition: { x: number; y: number }) => void;
  onWidgetResize?: (widgetId: string, newSize: { width: number; height: number }) => void;
  editable?: boolean;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  onWidgetMove,
  editable = false,
}) => {
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  
  // Create refs for all widgets at the top level
  const widgetRefs = useRef<{ [key: string]: {
    translateX: Animated.Value;
    translateY: Animated.Value;
    scale: Animated.Value;
    opacity: Animated.Value;
  } }>({});

  // Initialize refs for new widgets and update positions
  useEffect(() => {
    widgets.forEach(widget => {
      if (!widgetRefs.current[widget.id]) {
        widgetRefs.current[widget.id] = {
          translateX: new Animated.Value(widget.position.x),
          translateY: new Animated.Value(widget.position.y),
          scale: new Animated.Value(1),
          opacity: new Animated.Value(1),
        };
      } else {
        // Update position if widget moved
        widgetRefs.current[widget.id].translateX.setValue(widget.position.x);
        widgetRefs.current[widget.id].translateY.setValue(widget.position.y);
      }
    });

    // Clean up refs for removed widgets
    const currentWidgetIds = widgets.map(w => w.id);
    Object.keys(widgetRefs.current).forEach(id => {
      if (!currentWidgetIds.includes(id)) {
        delete widgetRefs.current[id];
      }
    });
  }, [widgets]);

  const snapToGrid = (value: number): number => {
    return Math.round(value / (WIDGET_SIZE + spacing.sm)) * (WIDGET_SIZE + spacing.sm);
  };

  const isValidPosition = (x: number, y: number, width: number, height: number, excludeId?: string): boolean => {
    const gridX = Math.round(x / (WIDGET_SIZE + spacing.sm));
    const gridY = Math.round(y / (WIDGET_SIZE + spacing.sm));
    const gridWidth = Math.ceil(width / (WIDGET_SIZE + spacing.sm));
    const gridHeight = Math.ceil(height / (WIDGET_SIZE + spacing.sm));

    // Check bounds
    if (gridX < 0 || gridY < 0 || gridX + gridWidth > GRID_SIZE) {
      return false;
    }

    // Check collision with other widgets
    for (const widget of widgets) {
      if (widget.id === excludeId) continue;
      
      const otherGridX = Math.round(widget.position.x / (WIDGET_SIZE + spacing.sm));
      const otherGridY = Math.round(widget.position.y / (WIDGET_SIZE + spacing.sm));
      const otherGridWidth = Math.ceil(widget.size.width / (WIDGET_SIZE + spacing.sm));
      const otherGridHeight = Math.ceil(widget.size.height / (WIDGET_SIZE + spacing.sm));

      if (
        gridX < otherGridX + otherGridWidth &&
        gridX + gridWidth > otherGridX &&
        gridY < otherGridY + otherGridHeight &&
        gridY + gridHeight > otherGridY
      ) {
        return false;
      }
    }

    return true;
  };

  const renderWidget = (widget: Widget) => {
    // Get refs for this widget
    const refs = widgetRefs.current[widget.id];
    if (!refs) return null;

    const { translateX, translateY, scale, opacity } = refs;

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => editable,
      onPanResponderGrant: () => {
        setDraggedWidget(widget.id);
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1.1,
            useNativeDriver: true,
          }),
          Animated.spring(opacity, {
            toValue: 0.8,
            useNativeDriver: true,
          }),
        ]).start();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: translateX, dy: translateY }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        const newX = snapToGrid(widget.position.x + gestureState.dx);
        const newY = snapToGrid(widget.position.y + gestureState.dy);

        if (isValidPosition(newX, newY, widget.size.width, widget.size.height, widget.id)) {
          // Valid position - animate to snapped position
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: newX,
              useNativeDriver: false,
            }),
            Animated.spring(translateY, {
              toValue: newY,
              useNativeDriver: false,
            }),
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true,
            }),
            Animated.spring(opacity, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onWidgetMove?.(widget.id, { x: newX, y: newY });
          });
        } else {
          // Invalid position - animate back to original
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: widget.position.x,
              useNativeDriver: false,
            }),
            Animated.spring(translateY, {
              toValue: widget.position.y,
              useNativeDriver: false,
            }),
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true,
            }),
            Animated.spring(opacity, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start();
        }

        setDraggedWidget(null);
      },
    });

    return (
      <Animated.View
        key={widget.id}
        style={[
          styles.widget,
          {
            width: widget.size.width,
            height: widget.size.height,
            backgroundColor: widget.color,
            transform: [
              { translateX },
              { translateY },
              { scale },
            ],
            opacity,
            zIndex: draggedWidget === widget.id ? 1000 : 1,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {renderWidgetContent(widget)}
      </Animated.View>
    );
  };

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'weather':
        return <WeatherWidget data={widget.data} />;
      case 'stats':
        return <StatsWidget data={widget.data} />;
      case 'news':
        return <NewsWidget data={widget.data} />;
      case 'clock':
        return <ClockWidget />;
      case 'calendar':
        return <CalendarWidget data={widget.data} />;
      case 'music':
        return <MusicWidget data={widget.data} />;
      default:
        return <DefaultWidget title={widget.title} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {widgets.map(renderWidget)}
      </View>
    </View>
  );
};

// Widget Components
const WeatherWidget: React.FC<{ data?: any }> = () => (
  <View style={styles.widgetContent}>
    <Animated.Text style={styles.widgetIcon}>☀️</Animated.Text>
    <Animated.Text style={styles.widgetTitle}>Weather</Animated.Text>
    <Animated.Text style={styles.widgetValue}>24°C</Animated.Text>
  </View>
);

const StatsWidget: React.FC<{ data?: any }> = () => (
  <View style={styles.widgetContent}>
    <Animated.Text style={styles.widgetIcon}>📊</Animated.Text>
    <Animated.Text style={styles.widgetTitle}>Stats</Animated.Text>
    <Animated.Text style={styles.widgetValue}>+12%</Animated.Text>
  </View>
);

const NewsWidget: React.FC<{ data?: any }> = () => (
  <View style={styles.widgetContent}>
    <Animated.Text style={styles.widgetIcon}>📰</Animated.Text>
    <Animated.Text style={styles.widgetTitle}>News</Animated.Text>
    <Animated.Text style={styles.widgetValue}>5 new</Animated.Text>
  </View>
);

const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.widgetContent}>
      <Animated.Text style={styles.widgetIcon}>🕐</Animated.Text>
      <Animated.Text style={styles.widgetTitle}>Time</Animated.Text>
      <Animated.Text style={styles.widgetValue}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Animated.Text>
    </View>
  );
};

const CalendarWidget: React.FC<{ data?: any }> = () => (
  <View style={styles.widgetContent}>
    <Animated.Text style={styles.widgetIcon}>📅</Animated.Text>
    <Animated.Text style={styles.widgetTitle}>Calendar</Animated.Text>
    <Animated.Text style={styles.widgetValue}>3 events</Animated.Text>
  </View>
);

const MusicWidget: React.FC<{ data?: any }> = () => (
  <View style={styles.widgetContent}>
    <Animated.Text style={styles.widgetIcon}>🎵</Animated.Text>
    <Animated.Text style={styles.widgetTitle}>Music</Animated.Text>
    <Animated.Text style={styles.widgetValue}>Playing</Animated.Text>
  </View>
);

const DefaultWidget: React.FC<{ title: string }> = ({ title }) => (
  <View style={styles.widgetContent}>
    <Animated.Text style={styles.widgetIcon}>📱</Animated.Text>
    <Animated.Text style={styles.widgetTitle}>{title}</Animated.Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  grid: {
    flex: 1,
    position: 'relative',
  },
  widget: {
    position: 'absolute',
    borderRadius: borderRadius.lg,
    ...shadows.md,
    shadowColor: colors.shadowMedium,
  },
  widgetContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
  },
  widgetIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  widgetTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.surface,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  widgetValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.surface,
    textAlign: 'center',
  },
});