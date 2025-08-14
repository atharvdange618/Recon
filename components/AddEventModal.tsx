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
import { COLORS, FONTS, SIZES } from "../lib/theme";
import { Feather } from "@expo/vector-icons";

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
            placeholderTextColor={COLORS.gray}
            value={author}
            onChangeText={setAuthor}
          />
          <TextInput
            style={[modalStyles.input, { height: 100 }]}
            placeholder="Comment..."
            placeholderTextColor={COLORS.gray}
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
              <Feather name="x" size={20} color={COLORS.white} />
              <Text style={modalStyles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonSave]}
              onPress={handleSave}
            >
              <Feather name="save" size={20} color={COLORS.white} />
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
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    width: "90%",
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SIZES.padding,
  },
  input: {
    ...FONTS.body3,
    backgroundColor: COLORS.darkGray,
    width: "100%",
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.8,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SIZES.base * 2,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: SIZES.padding,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: SIZES.radius / 2,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: COLORS.primary },
  checkboxCheck: { color: COLORS.white, fontWeight: "bold" },
  checkboxLabel: { ...FONTS.body3, color: COLORS.text, marginLeft: SIZES.base * 1.5 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    elevation: 2,
    flex: 1,
    marginHorizontal: SIZES.base / 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonClose: { backgroundColor: COLORS.darkGray },
  buttonSave: { backgroundColor: COLORS.primary },
  textStyle: { ...FONTS.h4, color: "white", fontWeight: "bold", textAlign: "center", marginLeft: SIZES.base / 2 },
});
