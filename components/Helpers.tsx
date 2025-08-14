import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS, SIZES } from "../lib/theme";

export const DetailItem = ({ label, value }: any) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  detailItem: { width: "48%", marginBottom: SIZES.base * 1.5 },
  detailLabel: { ...FONTS.body4, color: COLORS.textSecondary, marginBottom: SIZES.base / 2 },
  detailValue: { ...FONTS.h4, color: COLORS.text, fontWeight: "600" },
});
