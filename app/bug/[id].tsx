import { AddEventModal } from "@/components/AddEventModal";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { DetailItem } from "@/components/Helpers";
import { SacredTimeline } from "@/components/SacredTimeline";
import { Tooltip } from "@/components/Tooltip";
import {
  addTimelineEvent,
  FetchedBug,
  FetchedTimelineEvent,
  getBugById,
  getTimelineEvents,
  TimelineEvent,
} from "@/lib/database";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES } from "../../lib/theme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function BugDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [bug, setBug] = useState<FetchedBug | null>(null);
  const [timeline, setTimeline] = useState<FetchedTimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeEvent, setActiveEvent] = useState<FetchedTimelineEvent | null>(
    null
  );
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const bugId = Number(id);

  const loadData = useCallback(() => {
    if (bugId) {
      setIsLoading(true);
      const fetchedBug = getBugById(bugId);
      const fetchedTimeline = getTimelineEvents(bugId);
      setBug(fetchedBug);
      setTimeline(fetchedTimeline.reverse());
      setIsLoading(false);
    }
  }, [bugId]);

  useFocusEffect(loadData);

  const handleEventPress = (event: any, x: any, y: any) => {
    setActiveEvent(event);
    setTooltipPosition({ x: x - 75, y: y - 80 });
  };

  const handleSaveEvent = (event: TimelineEvent) => {
    addTimelineEvent(event);
    setModalVisible(false);
    loadData();
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />;
  }

  if (!bug) {
    return (
      <View>
        <Text style={styles.errorText}>Bug not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{"< Dashboard"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          BUG-{String(bug.id).padStart(3, "0")}
        </Text>
        <TouchableOpacity onPress={() => router.push(`/edit/${bug.id}`)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>{bug.summary}</Text>
          <View style={styles.detailsGrid}>
            <DetailItem label="Status" value={bug.status} />
            <DetailItem label="Priority" value={bug.priority} />
            <DetailItem label="Severity" value={bug.severity} />
            <DetailItem label="Assignee" value={bug.assignee_name || "N/A"} />
            <DetailItem label="Reporter" value={bug.reporter_name || "N/A"} />
            <DetailItem label="Environment" value={bug.environment || "N/A"} />
          </View>
        </View>

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

        <View>
          <Text style={styles.sectionTitle}>Sacred Timeline</Text>
          <TouchableOpacity
            style={styles.addEventButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addEventButtonText}>+ Add Timeline Event</Text>
          </TouchableOpacity>

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
  container: { padding: SIZES.padding, paddingBottom: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
  },
  backButton: { ...FONTS.body3, color: COLORS.primary },
  headerTitle: { ...FONTS.h3, color: COLORS.text, fontWeight: "bold" },
  editButton: { ...FONTS.body3, color: COLORS.primary },
  errorText: { ...FONTS.h3, color: COLORS.error, textAlign: "center", marginTop: 50 },
  summaryCard: {
    backgroundColor: COLORS.card,
    padding: SIZES.padding * 0.8,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding * 1.2,
  },
  summaryText: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: "bold",
    marginBottom: SIZES.padding,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: "bold",
    marginBottom: SIZES.padding * 0.8,
  },
  addEventButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.base * 1.5,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginBottom: SIZES.padding,
  },
  addEventButtonText: { ...FONTS.h4, color: COLORS.white, fontWeight: "bold" },
  sectionText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    lineHeight: 22,
    paddingTop: SIZES.base,
  },
  timelineCanvasContainer: {
    alignItems: "center",
    marginTop: SIZES.padding,
  },
  noEventsText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingVertical: 40,
  },
});
