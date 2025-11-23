import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS, SIZES } from "../lib/theme";
import CustomPicker from "./CustomPicker";

interface ReminderToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  daysBefore: number;
  onDaysChange: (days: number) => void;
}

const reminderDaysOptions = [
  { label: "1 day before", value: "1" },
  { label: "2 days before", value: "2" },
  { label: "3 days before", value: "3" },
  { label: "5 days before", value: "5" },
  { label: "7 days before", value: "7" },
];

export const ReminderToggle: React.FC<ReminderToggleProps> = ({
  enabled,
  onToggle,
  daysBefore,
  onDaysChange,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleContainer}
        onPress={() => onToggle(!enabled)}
      >
        <View style={styles.labelContainer}>
          <Feather
            name="bell"
            size={16}
            color={enabled ? COLORS.primary : COLORS.textSecondary}
          />
          <Text style={[styles.label, enabled && styles.labelActive]}>
            Enable Reminder
          </Text>
        </View>
        <View style={[styles.toggle, enabled && styles.toggleActive]}>
          <View
            style={[styles.toggleThumb, enabled && styles.toggleThumbActive]}
          />
        </View>
      </TouchableOpacity>

      {enabled && (
        <View style={styles.daysContainer}>
          <CustomPicker
            label="Remind me"
            options={reminderDaysOptions}
            selectedValue={daysBefore.toString()}
            onValueChange={(value) => onDaysChange(parseInt(value))}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.base,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body.fontFamily,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base / 2,
  },
  labelActive: {
    color: COLORS.text,
    fontWeight: "600",
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignSelf: "flex-start",
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
  daysContainer: {
    marginTop: SIZES.base,
  },
});
