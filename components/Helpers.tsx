import { StyleSheet, Text, View } from "react-native";

export const DetailItem = ({ label, value }: any) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  detailItem: { width: "48%", marginBottom: 12 },
  detailLabel: { color: "#a0a0a0", fontSize: 14, marginBottom: 4 },
  detailValue: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
