import { FetchedBug } from "@/lib/database";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS, SIZES } from "../lib/theme";

type BugCardProps = {
  bug: FetchedBug;
  onPress: () => void;
};

const InfoChip = ({
  icon,
  text,
}: {
  icon: keyof typeof Feather.glyphMap;
  text: string;
}) => (
  <View style={styles.infoChip}>
    <Feather name={icon} size={12} color={COLORS.textSecondary} />
    <Text style={styles.infoChipText}>{text}</Text>
  </View>
);

export const BugCard: React.FC<BugCardProps> = ({ bug, onPress }) => {
  const priorityColor =
    {
      Critical: COLORS.error,
      High: COLORS.warning,
      Medium: COLORS.primary,
      Low: COLORS.success,
    }[bug.priority] || COLORS.textSecondary;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />

      <View style={styles.cardContent}>
        <View style={styles.topRow}>
          <Text style={styles.bugId}>
            BUG-{String(bug.id).padStart(3, "0")}
          </Text>
          <View style={[styles.tag, { backgroundColor: COLORS.input }]}>
            <Text style={styles.tagText}>{bug.status}</Text>
          </View>
        </View>

        <Text style={styles.summary} numberOfLines={2}>
          {bug.summary}
        </Text>

        <View style={styles.bottomRow}>
          <InfoChip icon="shield" text={bug.severity} />
          <InfoChip icon="user" text={bug.assignee_name || "Unassigned"} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.sm,
    flexDirection: "row",
    overflow: "hidden",

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  priorityBar: {
    width: 6,
  },
  cardContent: {
    padding: SIZES.sm,
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.xs,
  },
  bugId: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  summary: {
    ...FONTS.h4,
    color: COLORS.text,
    fontWeight: "bold",
    marginBottom: SIZES.sm,
  },
  tag: {
    borderRadius: SIZES.radius / 2,
    paddingHorizontal: SIZES.xs,
    paddingVertical: SIZES.xs / 2,
  },
  tagText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: "bold",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.xs,
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SIZES.sm,
  },
  infoChipText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: SIZES.xs / 2,
  },
});
