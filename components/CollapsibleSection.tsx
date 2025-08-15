import React, { useState } from "react";
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../lib/theme";

export const CollapsibleSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Feather 
          name={isExpanded ? "chevron-down" : "chevron-right"} 
          size={24} 
          color={COLORS.textSecondary} 
        />
      </TouchableOpacity>
      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    marginBottom: SIZES.sm,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.sm,
  },
  title: {
    ...FONTS.h4,
    color: COLORS.text,
    fontWeight: "bold",
  },
  content: {
    padding: SIZES.sm,
    paddingTop: 0,
  },
});
