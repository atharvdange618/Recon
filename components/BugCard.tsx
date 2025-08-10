import { FetchedBug } from "@/lib/database";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type BugCardProps = {
  bug: FetchedBug;
  onPress: () => void;
};

// Helper to get color based on priority
const getPriorityColor = (priority: FetchedBug["priority"]) => {
  switch (priority) {
    case "Critical":
      return "#ff453a"; // Red
    case "High":
      return "#ff9f0a"; // Orange
    case "Medium":
      return "#32ade6"; // Blue
    case "Low":
      return "#30d158"; // Green
    default:
      return "#8e8e93"; // Gray
  }
};

export const BugCard: React.FC<BugCardProps> = ({ bug, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.bugId}>BUG-{String(bug.id).padStart(3, "0")}</Text>
        <View
          style={[
            styles.tag,
            { backgroundColor: getPriorityColor(bug.priority) },
          ]}
        >
          <Text style={styles.tagText}>{bug.priority}</Text>
        </View>
      </View>
      <Text style={styles.summary}>{bug.summary}</Text>
      <View style={styles.bottomRow}>
        <View style={[styles.tag, { backgroundColor: "#8e8e93" }]}>
          <Text style={styles.tagText}>{bug.status}</Text>
        </View>
        <Text style={styles.assignee}>
          To: {bug.assignee_name || "Unassigned"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2c2c2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bugId: {
    color: "#a0a0a0",
    fontSize: 14,
    fontWeight: "600",
  },
  summary: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  assignee: {
    color: "#a0a0a0",
    fontSize: 14,
  },
});
