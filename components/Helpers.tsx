import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS, SIZES } from "../lib/theme";

export const DetailItem = ({ icon, label, value }: any) => (
  <View style={styles.detailItemContainer}>
    <View style={styles.labelContainer}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export const Card = ({ title, children }: any) => (
  <View style={styles.card}>
    {title && <Text style={styles.cardTitle}>{title}</Text>}
    <View style={styles.cardContent}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  detailItemContainer: {
    width: "48%",
    marginBottom: SIZES.padding,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.base,
  },
  icon: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginRight: SIZES.base,
  },
  detailLabel: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  detailValue: {
    ...FONTS.h4,
    color: COLORS.text,
    fontWeight: "600",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: "bold",
    marginBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SIZES.base,
  },
  cardContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});