import { AddEventModal } from "@/components/AddEventModal";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { Card, DetailItem, formatDateTime } from "@/components/Helpers";
import { SacredTimeline } from "@/components/SacredTimeline";
import { Tooltip } from "@/components/Tooltip";
import { exportBugToCSV } from "@/lib/csvExport";
import {
  addTimelineEvent,
  FetchedBug,
  FetchedTimelineEvent,
  getBugById,
  getTimelineEvents,
  TimelineEvent,
} from "@/lib/database";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES } from "../../lib/theme";

export default function BugDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [bug, setBug] = useState<FetchedBug | null>(null);
  const [timeline, setTimeline] = useState<FetchedTimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeEvent, setActiveEvent] = useState<FetchedTimelineEvent | null>(
    null
  );
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const bugId = Number(id);

  const loadData = useCallback(async () => {
    if (bugId) {
      setIsLoading(true);
      const fetchedBug = await getBugById(bugId);
      const fetchedTimeline = await getTimelineEvents(bugId);
      setBug(fetchedBug);
      setTimeline(fetchedTimeline.reverse());
      setIsLoading(false);
    }
  }, [bugId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleEventPress = (event: any, x: any, y: any) => {
    setActiveEvent(event);
    setTooltipPosition({ x: x - 75, y: y - 80 });
  };

  const handleSaveEvent = async (event: TimelineEvent) => {
    await addTimelineEvent(event);
    setModalVisible(false);
    loadData();
  };

  const handleCSVExport = async () => {
    if (!bug) return;

    setIsExporting(true);

    try {
      await exportBugToCSV({ bug, timeline });
      Alert.alert(
        "Export Successful",
        "Bug report exported to CSV successfully!",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Export failed:", error);
      Alert.alert(
        "Export Failed",
        "Failed to export bug report. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ flex: 1, backgroundColor: COLORS.background }}
      />
    );
  }

  if (!bug) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Bug not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Feather name="chevron-left" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          BUG-{String(bug.id).padStart(3, "0")}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleCSVExport}
            style={[styles.headerButton, styles.exportButton]}
            disabled={isExporting}
          >
            <Feather
              name="download"
              size={20}
              color={isExporting ? COLORS.textSecondary : COLORS.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/edit/${bug.id}`)}
            style={styles.headerButton}
          >
            <Feather name="edit-2" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Card>
          <Text style={styles.summaryText}>{bug.summary}</Text>
        </Card>

        <Card title="Details">
          <DetailItem icon="info" label="Status" value={bug.status} />
          <DetailItem icon="flag" label="Priority" value={bug.priority} />
          <DetailItem icon="shield" label="Severity" value={bug.severity} />
          <DetailItem
            icon="monitor"
            label="Environment"
            value={bug.environment || "N/A"}
          />
          <DetailItem
            icon="check-square"
            label="Resolution"
            value={bug.resolution || "N/A"}
          />
          <DetailItem
            icon="hash"
            label="Requirement #"
            value={bug.requirement_number || "N/A"}
          />
          <DetailItem
            icon="file-text"
            label="Test Case"
            value={bug.test_case_name || "N/A"}
          />
          <DetailItem
            icon="clock"
            label="Created At"
            value={formatDateTime(bug.created_at)}
          />
        </Card>

        <Card title="Assignment">
          <DetailItem
            icon="user"
            label="Assignee"
            value={bug.assignee_name || "N/A"}
          />
          <DetailItem
            icon="user-plus"
            label="Reporter"
            value={bug.reporter_name || "N/A"}
          />
        </Card>

        {bug.description && (
          <CollapsibleSection title="Description">
            <Text style={styles.sectionText}>{bug.description}</Text>
          </CollapsibleSection>
        )}
        {bug.steps_to_reproduce && (
          <CollapsibleSection title="Steps to Reproduce">
            <Text style={styles.sectionText}>{bug.steps_to_reproduce}</Text>
          </CollapsibleSection>
        )}
        {bug.expected_result && (
          <CollapsibleSection title="Expected Result">
            <Text style={styles.sectionText}>{bug.expected_result}</Text>
          </CollapsibleSection>
        )}
        {bug.actual_result && (
          <CollapsibleSection title="Actual Result">
            <Text style={styles.sectionText}>{bug.actual_result}</Text>
          </CollapsibleSection>
        )}

        <View style={styles.timelineSection}>
          <View style={styles.timelineHeader}>
            <Text style={styles.sectionTitle}>Sacred Timeline</Text>
            <TouchableOpacity
              style={styles.addEventButton}
              onPress={() => setModalVisible(true)}
            >
              <Feather name="plus" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.timelineCanvasContainer}>
            {timeline.length > 0 ? (
              <SacredTimeline
                events={timeline}
                onEventPress={handleEventPress}
              />
            ) : (
              <Text style={styles.noEventsText}>No timeline events yet.</Text>
            )}
            <Tooltip event={activeEvent} position={tooltipPosition} />
          </View>
        </View>
      </ScrollView>
      <AddEventModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveEvent}
        bugId={bugId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: {
    marginTop: SIZES.md,
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    padding: SIZES.xs,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.xs,
  },
  exportButton: {
    borderRadius: SIZES.radius,
    padding: SIZES.sm,
  },
  headerTitle: { ...FONTS.h3, color: COLORS.text, fontWeight: "bold" },
  errorText: {
    ...FONTS.h2,
    color: COLORS.error,
    textAlign: "center",
    marginTop: SIZES.xl,
  },
  summaryText: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: "bold",
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: "bold",
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.sm,
    marginTop: SIZES.lg,
  },
  addEventButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.xs,
    borderRadius: SIZES.radius,
  },
  sectionText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  timelineSection: {
    marginTop: SIZES.md,
  },
  timelineCanvasContainer: {
    alignItems: "center",
    padding: SIZES.sm,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
  },
  noEventsText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingVertical: SIZES.lg,
  },
});
