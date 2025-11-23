/* eslint-disable react/no-unescaped-entities */
import { BugCard } from "@/components/BugCard";
import {
  DashboardStats,
  FetchedBug,
  getBugs,
  getDashboardStats,
} from "@/lib/database";
import { Feather } from "@expo/vector-icons";
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

const PriorityLegend = () => {
  const priorities = [
    { name: "Critical", color: COLORS.error },
    { name: "High", color: COLORS.warning },
    { name: "Medium", color: COLORS.primary },
    { name: "Low", color: COLORS.success },
  ];

  return (
    <View style={legendStyles.container}>
      {priorities.map((p) => (
        <View key={p.name} style={legendStyles.item}>
          <View style={[legendStyles.dot, { backgroundColor: p.color }]} />
          <Text style={legendStyles.text}>{p.name}</Text>
        </View>
      ))}
    </View>
  );
};

const StatusBar = ({ stats }: { stats: DashboardStats }) => {
  return (
    <View style={styles.statusBarContainer}>
      <View style={styles.statusItem}>
        <Text style={[styles.statusCount, { color: COLORS.error }]}>
          {stats.reported}
        </Text>
        <Text style={styles.statusLabel}>Reported</Text>
      </View>
      <View style={styles.statusItem}>
        <Text style={[styles.statusCount, { color: COLORS.primary }]}>
          {stats.inProgress}
        </Text>
        <Text style={styles.statusLabel}>In Progress</Text>
      </View>
      <View style={styles.statusItem}>
        <Text style={[styles.statusCount, { color: COLORS.success }]}>
          {stats.resolved}
        </Text>
        <Text style={styles.statusLabel}>Resolved</Text>
      </View>
    </View>
  );
};

const UrgencyMatrix = ({ stats }: { stats: DashboardStats }) => {
  return (
    <View style={styles.statusBarContainer}>
      <View style={styles.statusItem}>
        <Text style={[styles.statusCount, { color: COLORS.error }]}>
          {stats.criticalBugs}
        </Text>
        <Text style={styles.statusLabel}>Critical Bugs</Text>
      </View>
      <View style={styles.statusItem}>
        <Text style={[styles.statusCount, { color: COLORS.warning }]}>
          {stats.overdue}
        </Text>
        <Text style={styles.statusLabel}>Overdue</Text>
      </View>
      <View style={styles.statusItem}>
        <Text style={[styles.statusCount, { color: COLORS.accent }]}>
          {stats.dueSoon}
        </Text>
        <Text style={styles.statusLabel}>Due Soon</Text>
      </View>
      <View style={styles.statusItem}>
        <Text style={[styles.statusCount, { color: COLORS.textSecondary }]}>
          {stats.unassigned}
        </Text>
        <Text style={styles.statusLabel}>Unassigned</Text>
      </View>
    </View>
  );
};

const EmptyState = () => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}>
      <Text style={styles.title}>Recon</Text>
      <Link href="/add" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </Link>
    </View>
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Bugs Reported</Text>
      <Text style={styles.emptySubText}>
        Tap the '+' button to create your first bug report and start tracking.
      </Text>
    </View>
  </SafeAreaView>
);

export default function DashboardScreen() {
  const router = useRouter();

  const [bugs, setBugs] = useState<FetchedBug[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const [fetchedBugs, fetchedStats] = await Promise.all([
            getBugs(),
            getDashboardStats(),
          ]);
          setBugs(fetchedBugs);
          setStats(fetchedStats);
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          setBugs([]);
          setStats({
            reported: 0,
            inProgress: 0,
            resolved: 0,
            criticalBugs: 0,
            newToday: 0,
            unassigned: 0,
            dueSoon: 0,
            overdue: 0,
          });
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }, [])
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (bugs.length === 0) {
    return <EmptyState />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Recon</Text>
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Feather name="plus" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </Link>
      </View>

      {stats && (
        <>
          <StatusBar stats={stats} />
          <UrgencyMatrix stats={stats} />
        </>
      )}

      <PriorityLegend />

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: SIZES.xl }}
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
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={<View style={{ height: SIZES.md }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: SIZES.xl,
    height: SIZES.xl,
    borderRadius: SIZES.xl / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.lg,
    marginTop: -SIZES.xl,
  },
  emptyText: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SIZES.sm,
  },
  emptySubText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  statusBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.card,
    padding: SIZES.sm,
    borderRadius: SIZES.radius_lg,
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.sm,
  },
  statusItem: {
    alignItems: "center",
  },
  statusCount: {
    ...FONTS.h1,
    fontWeight: "bold",
  },
  statusLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs / 2,
  },
});

const legendStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    marginHorizontal: SIZES.md,
    padding: SIZES.sm,
    marginBottom: SIZES.xs,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    margin: SIZES.xs / 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SIZES.xs,
  },
  text: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
});
