import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS, SIZES } from "../lib/theme";

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
    backgroundColor: COLORS.card,
    padding: SIZES.base * 1.5,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: 150,
    zIndex: 10,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  tooltipAuthor: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: "bold",
  },
  tooltipComment: {
    ...FONTS.body4,
    color: COLORS.lightGray,
    marginVertical: SIZES.base / 2,
  },
  tooltipDate: {
    ...FONTS.body5,
    color: COLORS.gray,
  },
});
