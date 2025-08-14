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
    return <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />;
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

const cosmicColors = {
  primaryGlow: "#00f7ff",
  nexusGlow: "#ffb400",
  bgDark: "rgba(10,10,20,0.85)",
};

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#121212" },
  container: { padding: 20, paddingBottom: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: { color: "#007AFF", fontSize: 17 },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  editButton: { color: "#007AFF", fontSize: 17 },
  errorText: { color: "red", textAlign: "center", marginTop: 50, fontSize: 18 },
  summaryCard: {
    backgroundColor: "#2c2c2e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  addEventButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addEventButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  timelineContainer: {},
  timelineNode: { flexDirection: "row" },
  timelineGutter: { alignItems: "center" },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#8e8e93",
  },
  nexusDot: {
    backgroundColor: "#ff9f0a",
    shadowColor: "#ff9f0a",
    shadowRadius: 8,
    shadowOpacity: 0.8,
  },
  sectionText: {
    color: "#e0e0e0",
    fontSize: 15,
    lineHeight: 22,
    paddingTop: 10,
  },
  timelineLine: {
    flex: 1,
    width: 3,
    backgroundColor: cosmicColors.primaryGlow,
    shadowColor: cosmicColors.primaryGlow,
    shadowRadius: 12,
    shadowOpacity: 1,
  },
  nexusLineGlow: {
    backgroundColor: cosmicColors.nexusGlow,
    shadowColor: cosmicColors.nexusGlow,
    shadowRadius: 16,
    shadowOpacity: 1,
  },
  timelineContent: { flex: 1, marginLeft: 16, paddingBottom: 24 },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  eventAuthor: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  eventDate: { color: "#a0a0a0", fontSize: 12 },
  eventComment: { color: "#e0e0e0", fontSize: 15 },
  timelineCanvasContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noEventsText: {
    color: "#a0a0a0",
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 40,
  },
  eventText: {
    position: "absolute",
    color: "#e0e0e0",
    fontSize: 15,
    width: 150,
    textAlign: "right",
  },
  eventTextContainer: {
    position: "absolute",
    width: 150,
  },
});
