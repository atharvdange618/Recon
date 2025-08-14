import { StyleSheet, Text, View } from "react-native";

export const Tooltip = ({ event, position }: any) => {
  if (!event) return null;
  return (
    <View
      style={[styles.tooltipContainer, { top: position.y, left: position.x }]}
    >
      <Text style={styles.tooltipAuthor}>{event.author}</Text>
      <Text style={styles.tooltipComment}>{event.comment}</Text>
      <Text style={styles.tooltipDate}>
        {new Date(event.event_at).toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    position: "absolute",
    backgroundColor: "#1c1c1e",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    width: 150,
    zIndex: 10,
  },
  tooltipAuthor: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  tooltipComment: {
    color: "#e0e0e0",
    fontSize: 13,
    marginVertical: 4,
  },
  tooltipDate: {
    color: "#a0a0a0",
    fontSize: 10,
  },
});
