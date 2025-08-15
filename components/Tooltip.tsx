import { FetchedTimelineEvent } from "@/lib/database";
import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { COLORS, FONTS, SIZES } from "../lib/theme";
import { formatDateTime } from "./Helpers";

type TooltipProps = {
  event: FetchedTimelineEvent | null;
  position: { x: number; y: number };
};

export const Tooltip = ({ event, position }: TooltipProps) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    if (event) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.95, { duration: 150 });
    }
  }, [event, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!event) return null;

  return (
    <Animated.View
      style={[
        styles.tooltipContainer,
        { top: position.y, left: position.x },
        animatedStyle,
      ]}
    >
      <Text style={styles.tooltipAuthor}>{event.author}</Text>
      <Text style={styles.tooltipComment}>{event.comment}</Text>
      <Text style={styles.tooltipDate}>{formatDateTime(event.event_at)}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    position: "absolute",
    backgroundColor: COLORS.card,
    padding: SIZES.sm,
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
    color: COLORS.text,
    fontWeight: "bold",
  },
  tooltipComment: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginVertical: SIZES.xs,
  },
  tooltipDate: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
});
