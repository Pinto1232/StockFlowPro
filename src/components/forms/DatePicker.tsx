import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  initialDate?: string;
  minAge?: number;
  maxAge?: number;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  visible,
  onClose,
  onDateSelect,
  initialDate,
  minAge = 13,
  maxAge = 120,
}) => {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - maxAge;
  const maxYear = currentYear - minAge;

  const parseInitialDate = () => {
    if (initialDate && initialDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = initialDate.split('-').map(Number);
      return { year, month, day };
    }
    return {
      year: currentYear - 25, 
      month: 1,
      day: 1,
    };
  };

  const initial = parseInitialDate();
  const [selectedYear, setSelectedYear] = useState(initial.year);
  const [selectedMonth, setSelectedMonth] = useState(initial.month);
  const [selectedDay, setSelectedDay] = useState(initial.day);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
  const days = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1);

  const handleConfirm = () => {
    const formattedDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    onDateSelect(formattedDate);
    onClose();
  };

  const handleCancel = () => {
    
    setSelectedYear(initial.year);
    setSelectedMonth(initial.month);
    setSelectedDay(initial.day);
    onClose();
  };

  // Adjust day if it's invalid for the selected month/year
  React.useEffect(() => {
    const maxDays = getDaysInMonth(selectedYear, selectedMonth);
    if (selectedDay > maxDays) {
      setSelectedDay(maxDays);
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  const renderPicker = (
    items: (string | number)[],
    selectedValue: string | number,
    onSelect: (value: any) => void,
    title: string
  ) => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>{title}</Text>
      <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.pickerItem,
              selectedValue === item && styles.pickerItemSelected,
            ]}
            onPress={() => onSelect(item)}
          >
            <Text
              style={[
                styles.pickerItemText,
                selectedValue === item && styles.pickerItemTextSelected,
              ]}
            >
              {typeof item === 'string' ? item : item.toString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Date of Birth</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.dateDisplay}>
            <Text style={styles.selectedDateText}>
              {months[selectedMonth - 1]} {selectedDay}, {selectedYear}
            </Text>
          </View>

          <View style={styles.pickersContainer}>
            {renderPicker(months, months[selectedMonth - 1], (month) => {
              const monthIndex = months.indexOf(month) + 1;
              setSelectedMonth(monthIndex);
            }, 'Month')}

            {renderPicker(days, selectedDay, setSelectedDay, 'Day')}

            {renderPicker(years, selectedYear, setSelectedYear, 'Year')}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: height * 0.7,
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
  headerTitle: {
    ...typography.textStyles.h3,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  closeButton: {
    padding: spacing.xs,
  },
  dateDisplay: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  selectedDateText: {
    ...typography.textStyles.h2,
    color: colors.primary,
    fontWeight: '600',
  },
  pickersContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  pickerTitle: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  pickerScroll: {
    maxHeight: 150,
  },
  pickerItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    marginVertical: 1,
  },
  pickerItemSelected: {
    backgroundColor: colors.primary,
  },
  pickerItemText: {
    ...typography.textStyles.body,
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 16,
  },
  pickerItemTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.textStyles.button,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  confirmButtonText: {
    ...typography.textStyles.button,
    color: colors.white,
    fontWeight: '600',
  },
});