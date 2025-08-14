import { FetchedBug } from "@/lib/database";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS, SIZES } from "../lib/theme";

type BugCardProps = {
  bug: FetchedBug;
  onPress: () => void;
};

// Helper to get color based on priority
const getPriorityColor = (priority: FetchedBug["priority"]) => {
  switch (priority) {
    case "Critical":
      return COLORS.error;
    case "High":
      return COLORS.warning;
    case "Medium":
      return COLORS.primary;
    case "Low":
      return COLORS.success;
    default:
      return COLORS.gray;
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
        <View style={[styles.tag, { backgroundColor: COLORS.darkGray }]}>
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
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base * 1.5,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.base,
  },
  bugId: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  summary: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: "bold",
    marginBottom: SIZES.base * 1.5,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    borderRadius: SIZES.radius / 2,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
  },
  tagText: {
    ...FONTS.body5,
    color: COLORS.white,
    fontWeight: "bold",
  },
  assignee: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
});
