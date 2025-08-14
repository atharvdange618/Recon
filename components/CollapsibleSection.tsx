import { useState } from "react";
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    backgroundColor: "#2c2c2e",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  collapsibleTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  collapsibleIcon: {
    color: "#a0a0a0",
    fontSize: 22,
    fontWeight: "bold",
  },
  collapsibleContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#3a3a3c",
  },
});
