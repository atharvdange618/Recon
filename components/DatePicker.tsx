import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, FONTS, SIZES } from '../lib/theme';
import { Feather } from '@expo/vector-icons';

interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select date"
}) => {
  const showDatePicker = () => {
    Alert.prompt(
      "Set Due Date",
      "Enter date in MM/DD/YYYY format:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Set",
          onPress: (dateString) => {
            if (dateString) {
              const date = new Date(dateString);
              if (!isNaN(date.getTime()) && date >= new Date()) {
                onChange(date);
              } else {
                Alert.alert("Invalid Date", "Please enter a valid future date.");
              }
            }
          }
        }
      ],
      "plain-text",
      value ? value.toLocaleDateString() : ""
    );
  };

  const clearDate = () => {
    onChange(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.dateButton} 
        onPress={showDatePicker}
      >
        <Text style={[styles.dateText, !value && styles.placeholderText]}>
          {value ? value.toLocaleDateString() : placeholder}
        </Text>
        <View style={styles.iconContainer}>
          {value && (
            <TouchableOpacity onPress={clearDate} style={styles.clearButton}>
              <Feather name="x" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
          <Feather name="calendar" size={16} color={COLORS.textSecondary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.base,
  },
  label: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body.fontFamily,
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body.fontFamily,
    color: COLORS.text,
    flex: 1,
  },
  placeholderText: {
    color: COLORS.textSecondary,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base / 2,
  },
  clearButton: {
    padding: 2,
  },
});