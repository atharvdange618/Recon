import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { COLORS, FONTS, SIZES } from "../lib/theme";

interface StyledTextInputProps extends TextInputProps {
  label: string;
  maxLength?: number;
  error?: string;
  helperText?: string;
}

export const StyledTextInput: React.FC<StyledTextInputProps> = ({
  label,
  maxLength,
  error,
  helperText,
  value,
  multiline,
  ...props
}) => {
  const characterCount = String(value || "").length;
  const hasError = !!error;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          hasError && styles.inputError,
        ]}
        placeholderTextColor={COLORS.textSecondary}
        maxLength={maxLength}
        multiline={multiline}
        value={value}
        {...props}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.messageContainer}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : helperText ? (
            <Text style={styles.helperText}>{helperText}</Text>
          ) : null}
        </View>

        {maxLength && (
          <Text
            style={[
              styles.charCounter,
              characterCount > maxLength * 0.9 && styles.charCounterWarning,
              characterCount >= maxLength && styles.charCounterError,
            ]}
          >
            {characterCount} / {maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
    width: "100%",
  },
  label: {
    ...FONTS.body,
    marginBottom: SIZES.xs,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  labelError: {
    color: COLORS.error,
  },
  input: {
    ...FONTS.body,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius_lg,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.sm,
    color: COLORS.text,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    fontSize: 16,
    minHeight: 52,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.background,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: SIZES.sm,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: SIZES.xs,
    minHeight: 16,
  },
  messageContainer: {
    flex: 1,
    marginRight: SIZES.xs,
  },
  errorText: {
    ...FONTS.caption,
    color: COLORS.error,
    fontSize: 12,
  },
  helperText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  charCounter: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: "right",
  },
  charCounterWarning: {
    color: COLORS.warning || COLORS.primary,
  },
  charCounterError: {
    color: COLORS.error,
    fontWeight: "600",
  },
});
