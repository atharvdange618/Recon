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
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddEventModal = ({ visible, onClose, onSave, bugId }: any) => {
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [isNexus, setIsNexus] = useState(false);

  const handleSave = () => {
    if (!author.trim() || !comment.trim()) {
      Alert.alert("Validation Error", "Author and Comment are required.");
      return;
    }
    const newEvent: TimelineEvent = {
      bug_id: bugId,
      author,
      comment,
      is_nexus_event: isNexus,
    };
    onSave(newEvent);
    setAuthor("");
    setComment("");
    setIsNexus(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>Add Timeline Event</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Author (e.g., John Doe)"
            placeholderTextColor="#777"
            value={author}
            onChangeText={setAuthor}
          />
          <TextInput
            style={[modalStyles.input, { height: 100 }]}
            placeholder="Comment..."
            placeholderTextColor="#777"
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity
            style={modalStyles.checkboxContainer}
            onPress={() => setIsNexus(!isNexus)}
          >
            <View
              style={[
                modalStyles.checkbox,
                isNexus && modalStyles.checkboxChecked,
              ]}
            >
              {isNexus && <Text style={modalStyles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={modalStyles.checkboxLabel}>Mark as Nexus Event</Text>
          </TouchableOpacity>

          <View style={modalStyles.buttonRow}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonClose]}
              onPress={onClose}
            >
              <Text style={modalStyles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonSave]}
              onPress={handleSave}
            >
              <Text style={modalStyles.textStyle}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function BugDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [bug, setBug] = useState<FetchedBug | null>(null);
  const [timeline, setTimeline] = useState<FetchedTimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const bugId = Number(id);

  const loadData = useCallback(() => {
    if (bugId) {
      setIsLoading(true);
      const fetchedBug = getBugById(bugId);
      const fetchedTimeline = getTimelineEvents(bugId);
      setBug(fetchedBug);
      setTimeline(fetchedTimeline);
      setIsLoading(false);
    }
  }, [bugId]);

  useFocusEffect(loadData);

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
        <TouchableOpacity
          onPress={() => {
            console.log("Edit bug functionality not implemented yet.");
          }}
        >
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
          </View>
        </View>

        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Sacred Timeline</Text>
          <TouchableOpacity
            style={styles.addEventButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addEventButtonText}>+ Add Timeline Event</Text>
          </TouchableOpacity>

          <View style={styles.timelineContainer}>
            {timeline.map((event, index) => (
              <TimelineNode
                key={event.id}
                event={event}
                isLast={index === timeline.length - 1}
              />
            ))}
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

// --- Helper Components for Detail Screen ---
const DetailItem = ({ label, value }: any) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const TimelineNode = ({ event, isLast }: any) => (
  <View style={styles.timelineNode}>
    <View style={styles.timelineGutter}>
      <View
        style={[styles.timelineDot, event.is_nexus_event && styles.nexusDot]}
      />
      {!isLast && (
        <View
          style={[
            styles.timelineLine,
            event.is_nexus_event && styles.nexusLineGlow,
          ]}
        />
      )}
    </View>
    <View style={styles.timelineContent}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventAuthor}>{event.author}</Text>
        <Text style={styles.eventDate}>
          {new Date(event.event_at).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.eventComment}>{event.comment}</Text>
    </View>
  </View>
);

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
  detailItem: { width: "48%", marginBottom: 12 },
  detailLabel: { color: "#a0a0a0", fontSize: 14, marginBottom: 4 },
  detailValue: { color: "#fff", fontSize: 16, fontWeight: "600" },
  timelineSection: {},
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
  timelineLine: { flex: 1, width: 2, backgroundColor: "#444" },
  nexusLineGlow: {
    backgroundColor: "#00d8ff",
    shadowColor: "#00d8ff",
    shadowRadius: 5,
    shadowOpacity: 0.7,
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
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#2c2c2e",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#333",
    width: "100%",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#555",
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#007AFF" },
  checkboxCheck: { color: "#fff", fontWeight: "bold" },
  checkboxLabel: { color: "#fff", marginLeft: 12, fontSize: 16 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonClose: { backgroundColor: "#555" },
  buttonSave: { backgroundColor: "#007AFF" },
  textStyle: { color: "white", fontWeight: "bold", textAlign: "center" },
});
