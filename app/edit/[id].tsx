import CustomPicker from "@/components/CustomPicker";
import { Bug, getBugById, updateBug } from "@/lib/database";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

export default function EditBugScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const bugId = Number(id);

  const [isLoading, setIsLoading] = useState(true);

  // State for all form fields
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
    };

    const success = updateBug(bugId, updatedBug);

    if (success) {
      router.back();
    } else {
      Alert.alert("Error", "Failed to update the bug. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#fff"
        style={{ flex: 1, backgroundColor: "#121212" }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Edit Bug</Text>
        <TouchableOpacity onPress={handleUpdate}>
          <Text style={styles.saveButtonTextHeader}>Save</Text>
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
        {/* ... other text inputs ... */}
      </ScrollView>
    </SafeAreaView>
  );
}

// Use the same styles as the Add screen, just rename to avoid conflicts
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#1c1c1e" },
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1c1c1e",
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3c",
  },
  header: { fontSize: 17, fontWeight: "bold", color: "#fff" },
  closeButton: { fontSize: 17, color: "#007AFF" },
  saveButtonTextHeader: { fontSize: 17, color: "#007AFF", fontWeight: "bold" },
  inputGroup: { marginBottom: 20 },
  label: { color: "#a0a0a0", marginBottom: 8, fontSize: 16 },
  input: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#555",
  },
  multiline: { minHeight: 100, textAlignVertical: "top" },
});
