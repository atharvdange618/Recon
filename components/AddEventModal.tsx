import { TimelineEvent } from "@/lib/database";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const AddEventModal = ({ visible, onClose, onSave, bugId }: any) => {
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
