import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { COLORS, FONTS, SIZES } from "../lib/theme";

export const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.detailItemContainer}>
    <View style={styles.labelContainer}>
      <Feather name={icon as any} size={SIZES.h4} color={COLORS.primary} />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue} numberOfLines={2} ellipsizeMode="tail">
      {value}
    </Text>
  </View>
);

export const Card = ({
  title,
  children,
  style,
}: {
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => (
  <View style={[styles.card, style]}>
    {title && <Text style={styles.cardTitle}>{title}</Text>}
    <View style={styles.cardContent}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  detailItemContainer: {
    flexBasis: "48%",
    marginBottom: SIZES.sm,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.xs,
  },
  detailLabel: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginLeft: SIZES.xs,
  },
  detailValue: {
    ...FONTS.h4,
    color: COLORS.text,
    fontWeight: "600",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.sm,
    marginBottom: SIZES.md,
  },
  cardTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: "bold",
    marginBottom: SIZES.sm,
  },
  cardContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  let daySuffix;
  if (day > 3 && day < 21) {
    daySuffix = "th";
  } else {
    switch (day % 10) {
      case 1:
        daySuffix = "st";
        break;
      case 2:
        daySuffix = "nd";
        break;
      case 3:
        daySuffix = "rd";
        break;
      default:
        daySuffix = "th";
    }
  }

  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours || 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  return `${day}${daySuffix} ${month} ${year}, ${hours}:${minutesStr} ${ampm}`;
};

