import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS, SIZES } from "../lib/theme";

interface FormStepperProps {
  steps: string[];
  currentStep: number;
  onStepPress: (index: number) => void;
}

export const FormStepper: React.FC<FormStepperProps> = ({
  steps,
  currentStep,
  onStepPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentStep + 1) / steps.length) * 100}%` },
          ]}
        />
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = index < currentStep;
          const isAccessible = index <= currentStep;

          return (
            <TouchableOpacity
              key={step}
              style={[styles.step, !isAccessible && styles.stepDisabled]}
              onPress={() => isAccessible && onStepPress(index)}
              disabled={!isAccessible}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.stepNumber,
                  isActive && styles.stepNumberActive,
                  isCompleted && styles.stepNumberCompleted,
                ]}
              >
                {isCompleted ? (
                  <Feather name="check" size={12} color={COLORS.background} />
                ) : (
                  <Text
                    style={[
                      styles.stepNumberText,
                      isActive && styles.stepNumberTextActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              <Text
                style={[
                  styles.stepText,
                  isActive && styles.stepTextActive,
                  isCompleted && styles.stepTextCompleted,
                  !isAccessible && styles.stepTextDisabled,
                ]}
              >
                {step}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    marginHorizontal: SIZES.md,
    borderRadius: SIZES.radius_lg,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    marginBottom: SIZES.xs,
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressBar: {
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: SIZES.md,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  step: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: SIZES.xs / 2,
  },
  stepDisabled: {
    opacity: 0.5,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.xs / 2,
  },
  stepNumberActive: {
    backgroundColor: COLORS.primary,
  },
  stepNumberCompleted: {
    backgroundColor: COLORS.primary,
  },
  stepNumberText: {
    ...FONTS.caption,
    fontWeight: "600",
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  stepNumberTextActive: {
    color: COLORS.background,
  },
  stepText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontSize: 11,
    lineHeight: 14,
  },
  stepTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  stepTextCompleted: {
    color: COLORS.text,
    fontWeight: "500",
  },
  stepTextDisabled: {
    color: COLORS.textSecondary,
    opacity: 0.6,
  },
});
