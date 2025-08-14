import { useState } from "react";
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity onPress={toggleExpand} style={styles.collapsibleHeader}>
        <Text style={styles.collapsibleTitle}>{title}</Text>
        <Text style={styles.collapsibleIcon}>{isExpanded ? "−" : "+"}</Text>
      </TouchableOpacity>
      {isExpanded && <View style={styles.collapsibleContent}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  collapsibleContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base * 1.5,
    overflow: "hidden",
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.base * 2,
  },
  collapsibleTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: "bold",
  },
  collapsibleIcon: {
    ...FONTS.h2,
    color: COLORS.textSecondary,
    fontWeight: "bold",
  },
  collapsibleContent: {
    paddingHorizontal: SIZES.base * 2,
    paddingBottom: SIZES.base * 2,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
