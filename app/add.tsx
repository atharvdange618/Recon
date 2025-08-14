import CustomPicker from "@/components/CustomPicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addBug, Bug } from "../lib/database";

const severityOptions = [
  { label: "Blocker", value: "Blocker" },
  { label: "Critical", value: "Critical" },
  { label: "Major", value: "Major" },
  { label: "Minor", value: "Minor" },
];

const priorityOptions = [
  { label: "Critical", value: "Critical" },
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

const statusOptions = [
  { label: "Reported", value: "Reported" },
  { label: "In Progress", value: "In Progress" },
  { label: "On Hold", value: "On Hold" },
  { label: "Resolved", value: "Resolved" },
  { label: "Closed", value: "Closed" },
];

const resolutionOptions = [
  { label: "None", value: "" },
  { label: "Fixed", value: "Fixed" },
  { label: "Won't Fix", value: "Won't Fix" },
  { label: "Duplicate", value: "Duplicate" },
  { label: "Cannot Reproduce", value: "Cannot Reproduce" },
  { label: "Done", value: "Done" },
];

export default function AddBugScreen() {
  const router = useRouter();
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

  const handleSave = () => {
    if (!summary.trim()) {
      Alert.alert("Validation Error", "Summary is required.");
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

    const newBugId = addBug(newBug);

    if (newBugId) {
      router.back();
    } else {
      Alert.alert("Error", "Failed to save the bug. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.header}>Create New Bug</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Summary</Text>
          <TextInput
            style={styles.input}
            value={summary}
            onChangeText={setSummary}
            placeholder="e.g., User login fails on Android"
            placeholderTextColor="#777"
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
            placeholderTextColor="#777"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reporter</Text>
          <TextInput
            style={styles.input}
            value={reporter}
            onChangeText={setReporter}
            placeholder="Your name"
            placeholderTextColor="#777"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Environment</Text>
          <TextInput
            style={styles.input}
            value={environment}
            onChangeText={setEnvironment}
            placeholder="e.g., Production, iOS v2.3"
            placeholderTextColor="#777"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="High-level overview of the bug"
            placeholderTextColor="#777"
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
            placeholderTextColor="#777"
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
            placeholderTextColor="#777"
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
            placeholderTextColor="#777"
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
            placeholderTextColor="#777"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Test Case Name</Text>
          <TextInput
            style={styles.input}
            value={testCaseName}
            onChangeText={setTestCaseName}
            placeholder="e.g., TC-456"
            placeholderTextColor="#777"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Bug</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: StatusBar.currentHeight,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#a0a0a0",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#555",
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
