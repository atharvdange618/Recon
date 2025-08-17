import CustomPicker from "@/components/CustomPicker";
import { FormStepper } from "@/components/FormStepper";
import { Card } from "@/components/Helpers";
import { StyledTextInput } from "@/components/StyledTextInput";
import {
  priorityOptions,
  resolutionOptions,
  severityOptions,
  statusOptions,
} from "@/lib/options";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { addBug, Bug } from "../lib/database";
import { COLORS, FONTS, SIZES } from "../lib/theme";

const formSteps = [
  "Summary",
  "Classification",
  "Assignment",
  "Details",
  "Tracking",
];

export default function AddBugScreen() {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [severity, setSeverity] = useState("Major");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Reported");
  const [assignee, setAssignee] = useState("");
  const [reporter, setReporter] = useState("");
  const [environment, setEnvironment] = useState("");
  const [resolution, setResolution] = useState<Bug["resolution"] | "">("");
  const [requirementNumber, setRequirementNumber] = useState("");
  const [testCaseName, setTestCaseName] = useState("");

  const handleSave = async () => {
    if (!summary.trim()) {
      Alert.alert("Validation Error", "Summary is required.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const newBug: Bug = {
      summary,
      description,
      steps_to_reproduce: steps,
      expected_result: expected,
      actual_result: actual,
      severity: severity as Bug["severity"],
      priority: priority as Bug["priority"],
      status: status as Bug["status"],
      assignee_name: assignee,
      reporter_name: reporter,
      environment,
      resolution: resolution ? (resolution as Bug["resolution"]) : undefined,
      requirement_number: requirementNumber,
      test_case_name: testCaseName,
    };

    await addBug(newBug);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const handleStepPress = (index: number) => {
    pagerRef.current?.setPage(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return summary.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      pagerRef.current?.setPage(currentStep + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      pagerRef.current?.setPage(currentStep - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const getStepTitle = (step: number) => {
    const titles = [
      "What's the issue?",
      "How should we categorize this?",
      "Who should handle this?",
      "Tell us more details",
      "Additional tracking info",
    ];
    return titles[step] || "";
  };

  const getStepSubtitle = (step: number) => {
    const subtitles = [
      "Provide a clear, concise summary of the bug",
      "Set priority, severity, and current status",
      "Assign team members and specify environment",
      "Describe the bug behavior and reproduction steps",
      "Link to requirements and test cases",
    ];
    return subtitles[step] || "";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Create Bug Report</Text>
            <Text style={styles.headerSubtitle}>
              Step {currentStep + 1} of {formSteps.length}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            style={[styles.headerButton, styles.saveButton]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="check" size={20} color={COLORS.background} />
          </TouchableOpacity>
        </View>

        {/* Progress Stepper */}
        <View style={styles.stepperContainer}>
          <FormStepper
            steps={formSteps}
            currentStep={currentStep}
            onStepPress={handleStepPress}
          />
        </View>

        {/* Step Content */}
        <View style={styles.contentContainer}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>{getStepTitle(currentStep)}</Text>
            <Text style={styles.stepSubtitle}>
              {getStepSubtitle(currentStep)}
            </Text>
          </View>

          <PagerView
            ref={pagerRef}
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={(e) => setCurrentStep(e.nativeEvent.position)}
          >
            {/* Page 1: Summary */}
            <View key="1" style={styles.page}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.pageContent}
              >
                <Card style={styles.card}>
                  <StyledTextInput
                    label="Bug Summary *"
                    value={summary}
                    onChangeText={setSummary}
                    placeholder="e.g., Login button unresponsive on Android devices"
                    maxLength={100}
                    autoFocus
                  />
                  <Text style={styles.helpText}>
                    Keep it concise but descriptive. This will be the main
                    identifier for your bug report.
                  </Text>
                </Card>
              </ScrollView>
            </View>

            {/* Page 2: Classification */}
            <View key="2" style={styles.page}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.pageContent}
              >
                <Card style={styles.card}>
                  <CustomPicker
                    label="Status"
                    options={statusOptions}
                    selectedValue={status}
                    onValueChange={setStatus}
                  />
                  <CustomPicker
                    label="Priority"
                    options={priorityOptions}
                    selectedValue={priority}
                    onValueChange={setPriority}
                  />
                  <CustomPicker
                    label="Severity"
                    options={severityOptions}
                    selectedValue={severity}
                    onValueChange={setSeverity}
                  />
                </Card>
              </ScrollView>
            </View>

            {/* Page 3: Assignment */}
            <View key="3" style={styles.page}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.pageContent}
              >
                <Card style={styles.card}>
                  <StyledTextInput
                    label="Assignee"
                    value={assignee}
                    onChangeText={setAssignee}
                    placeholder="e.g., John Smith"
                  />
                  <StyledTextInput
                    label="Reporter"
                    value={reporter}
                    onChangeText={setReporter}
                    placeholder="Your name"
                  />
                  <StyledTextInput
                    label="Environment"
                    value={environment}
                    onChangeText={setEnvironment}
                    placeholder="e.g., Production, iOS 17.2, iPhone 14"
                  />
                </Card>
              </ScrollView>
            </View>

            {/* Page 4: Details */}
            <View key="4" style={styles.page}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.pageContent}
              >
                <Card style={styles.card}>
                  <StyledTextInput
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Provide a detailed description of the issue..."
                    multiline
                    maxLength={500}
                  />
                  <StyledTextInput
                    label="Steps to Reproduce"
                    value={steps}
                    onChangeText={setSteps}
                    placeholder="1. Open the app&#10;2. Navigate to login screen&#10;3. Enter credentials&#10;4. Tap login button"
                    multiline
                    maxLength={500}
                  />
                  <StyledTextInput
                    label="Expected Result"
                    value={expected}
                    onChangeText={setExpected}
                    placeholder="User should be successfully logged in and redirected to dashboard"
                    multiline
                    maxLength={250}
                  />
                  <StyledTextInput
                    label="Actual Result"
                    value={actual}
                    onChangeText={setActual}
                    placeholder="Login button becomes unresponsive, no feedback provided to user"
                    multiline
                    maxLength={250}
                  />
                </Card>
              </ScrollView>
            </View>

            {/* Page 5: Tracking */}
            <View key="5" style={styles.page}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.pageContent}
              >
                <Card style={styles.card}>
                  <CustomPicker
                    label="Resolution"
                    options={resolutionOptions}
                    selectedValue={resolution}
                    onValueChange={(value) =>
                      setResolution(value as Bug["resolution"])
                    }
                  />
                  <StyledTextInput
                    label="Requirement Number"
                    value={requirementNumber}
                    onChangeText={setRequirementNumber}
                    placeholder="e.g., REQ-AUTH-001"
                  />
                  <StyledTextInput
                    label="Test Case Name"
                    value={testCaseName}
                    onChangeText={setTestCaseName}
                    placeholder="e.g., TC-LOGIN-MOBILE"
                  />
                </Card>
              </ScrollView>
            </View>
          </PagerView>
        </View>

        {/* Navigation Footer */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={handlePrevious}
            style={[
              styles.navButton,
              styles.prevButton,
              currentStep === 0 && styles.navButtonDisabled,
            ]}
            disabled={currentStep === 0}
          >
            <Feather
              name="chevron-left"
              size={20}
              color={currentStep === 0 ? COLORS.textSecondary : COLORS.text}
            />
            <Text
              style={[
                styles.navButtonText,
                currentStep === 0 && styles.navButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <View style={styles.progressDots}>
            {formSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentStep && styles.progressDotActive,
                  index < currentStep && styles.progressDotCompleted,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.navButton,
              styles.nextButton,
              (currentStep === formSteps.length - 1 || !canGoNext()) &&
                styles.navButtonDisabled,
            ]}
            disabled={currentStep === formSteps.length - 1 || !canGoNext()}
          >
            <Text
              style={[
                styles.navButtonText,
                (currentStep === formSteps.length - 1 || !canGoNext()) &&
                  styles.navButtonTextDisabled,
              ]}
            >
              Next
            </Text>
            <Feather
              name="chevron-right"
              size={20}
              color={
                currentStep === formSteps.length - 1 || !canGoNext()
                  ? COLORS.textSecondary
                  : COLORS.text
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    padding: SIZES.xs,
    borderRadius: SIZES.radius,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.sm,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    ...FONTS.h4,
    fontWeight: "600",
    color: COLORS.text,
  },
  headerSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  stepperContainer: {
    backgroundColor: COLORS.background,
    paddingBottom: SIZES.sm,
  },
  contentContainer: {
    flex: 1,
  },
  stepHeader: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.background,
  },
  stepTitle: {
    ...FONTS.h3,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.xs / 2,
  },
  stepSubtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  pageContent: {
    padding: SIZES.md,
    flexGrow: 1,
  },
  card: {
    marginBottom: SIZES.md,
  },
  helpText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
    lineHeight: 16,
    fontStyle: "italic",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.radius,
    minWidth: 80,
  },
  prevButton: {
    justifyContent: "flex-start",
  },
  nextButton: {
    justifyContent: "flex-end",
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    ...FONTS.body,
    color: COLORS.text,
    marginHorizontal: SIZES.xs / 2,
  },
  navButtonTextDisabled: {
    color: COLORS.textSecondary,
  },
  progressDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 3,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressDotCompleted: {
    backgroundColor: COLORS.primary,
    opacity: 0.6,
  },
});
