/* eslint-disable react/no-unescaped-entities */
import { BugCard } from "@/components/BugCard";
import { FetchedBug, getBugs } from "@/lib/database";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES } from "../lib/theme";

export default function DashboardScreen() {
  const [bugs, setBugs] = useState<FetchedBug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      console.log("Dashboard focused, fetching bugs...");
      setIsLoading(true);
      const fetchedBugs = getBugs();
      setBugs(fetchedBugs);
      setIsLoading(false);
    }, [])
  );

  const renderEmptyState = () => (
    <View style={dashboardStyles.emptyContainer}>
      <Text style={dashboardStyles.emptyText}>No bugs yet.</Text>
      <Text style={dashboardStyles.emptySubText}>
        Tap '+' to add your first bug.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={dashboardStyles.safeArea}>
      <View style={dashboardStyles.header}>
        <Text style={dashboardStyles.title}>Recon</Text>
        <Link href="/add" asChild>
          <TouchableOpacity style={dashboardStyles.addButton}>
            <Text style={dashboardStyles.addButtonText}>+</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={bugs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BugCard
              bug={item}
              onPress={() => router.push(`/bug/${item.id}`)}
            />
          )}
          contentContainerStyle={dashboardStyles.listContent}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
}

const dashboardStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 28,
    lineHeight: 34,
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "40%",
  },
  emptyText: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: "bold",
  },
  emptySubText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginTop: SIZES.base,
  },
});
