import CustomPicker from "@/components/CustomPicker";
import { archiveBug, Bug, getBugById, updateBug } from "@/lib/database";
import {
  priorityOptions,
  resolutionOptions,
  severityOptions,
  statusOptions,
} from "@/lib/options";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, FONTS, SIZES } from "../../lib/theme";

export default function EditBugScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const bugId = Number(id);

  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (bugId) {
      const bug = getBugById(bugId);
      if (bug) {
        setSummary(bug.summary);
        setDescription(bug.description || "");
        setSteps(bug.steps_to_reproduce || "");
        setExpected(bug.expected_result || "");
        setActual(bug.actual_result || "");
        setSeverity(bug.severity);
        setPriority(bug.priority);
        setStatus(bug.status);
        setAssignee(bug.assignee_name || "");
        setReporter(bug.reporter_name || "");
        setEnvironment(bug.environment || "");
        setResolution(bug.resolution || "");
        setRequirementNumber(bug.requirement_number || "");
        setTestCaseName(bug.test_case_name || "");
      }
      setIsLoading(false);
    }
  }, [bugId]);

  const handleUpdate = () => {
    if (!summary.trim()) {
      Alert.alert("Validation Error", "Summary is required.");
      return;
    }

    const updatedBug: Partial<Bug> = {
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

    const success = updateBug(bugId, updatedBug);

    if (success) {
      router.back();
    } else {
      Alert.alert("Error", "Failed to update the bug. Please try again.");
    }
  };

  const handleArchive = () => {
    Alert.alert(
      "Archive Bug",
      "Are you sure you want to archive this bug? You cannot undo this action.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Archive",
          onPress: () => {
            const success = archiveBug(bugId);
            if (success) {
              router.replace("/");
            } else {
              Alert.alert("Error", "Failed to archive the bug.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ flex: 1, backgroundColor: COLORS.background }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="x" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Bug</Text>
          <TouchableOpacity onPress={handleUpdate}>
            <Feather name="save" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Summary</Text>
            <TextInput
              style={styles.input}
              value={summary}
              onChangeText={setSummary}
              placeholder="e.g., User login fails on Android"
              placeholderTextColor={COLORS.gray}
            />
          </View>

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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Assignee</Text>
            <TextInput
              style={styles.input}
              value={assignee}
              onChangeText={setAssignee}
              placeholder="e.g., John Doe"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reporter</Text>
            <TextInput
              style={styles.input}
              value={reporter}
              onChangeText={setReporter}
              placeholder="Your name"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Environment</Text>
            <TextInput
              style={styles.input}
              value={environment}
              onChangeText={setEnvironment}
              placeholder="e.g., Production, iOS v2.3"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={description}
              onChangeText={setDescription}
              placeholder="High-level overview of the bug"
              placeholderTextColor={COLORS.gray}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Steps to Reproduce</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={steps}
              onChangeText={setSteps}
              placeholder="1. Go to Login screen..."
              placeholderTextColor={COLORS.gray}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expected Result</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={expected}
              onChangeText={setExpected}
              placeholder="User should be logged in successfully."
              placeholderTextColor={COLORS.gray}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Actual Result</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={actual}
              onChangeText={setActual}
              placeholder="App crashes or shows an error."
              placeholderTextColor={COLORS.gray}
              multiline
            />
          </View>

          <CustomPicker
            label="Resolution"
            options={resolutionOptions}
            selectedValue={resolution}
            onValueChange={(value) => setResolution(value as Bug["resolution"])}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Requirement Number</Text>
            <TextInput
              style={styles.input}
              value={requirementNumber}
              onChangeText={setRequirementNumber}
              placeholder="e.g., REQ-123"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Test Case Name</Text>
            <TextInput
              style={styles.input}
              value={testCaseName}
              onChangeText={setTestCaseName}
              placeholder="e.g., TC-456"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <TouchableOpacity
            style={styles.archiveButton}
            onPress={handleArchive}
          >
            <Text style={styles.archiveButtonText}>Archive Bug</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: StatusBar.currentHeight,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SIZES.padding,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  header: {
    ...FONTS.h3,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeButton: { ...FONTS.body3, color: COLORS.primary },
  saveButtonTextHeader: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  inputGroup: { marginBottom: SIZES.padding * 0.8 },
  label: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  input: {
    ...FONTS.body3,
    backgroundColor: COLORS.darkGray,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.8,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  archiveButton: {
    marginTop: SIZES.padding * 2,
    paddingVertical: SIZES.base * 1.8,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.error,
    alignItems: "center",
  },
  archiveButtonText: {
    ...FONTS.h4,
    color: COLORS.error,
    fontWeight: "600",
  },
});
