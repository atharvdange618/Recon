import { TimelineEvent } from "@/lib/database";
import { Feather } from "@expo/vector-icons";
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
            placeholderTextColor={COLORS.textSecondary}
            value={author}
            onChangeText={setAuthor}
          />
          <TextInput
            style={[
              modalStyles.input,
              { minHeight: 100, textAlignVertical: "top" },
            ]}
            placeholder="Comment..."
            placeholderTextColor={COLORS.textSecondary}
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
              {isNexus && (
                <Feather name="check" size={16} color={COLORS.white} />
              )}
            </View>
            <Text style={modalStyles.checkboxLabel}>Mark as Nexus Event</Text>
          </TouchableOpacity>

          <View style={modalStyles.buttonRow}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonClose]}
              onPress={onClose}
            >
              <Feather name="x" size={20} color={COLORS.text} />
              <Text style={modalStyles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonSave]}
              onPress={handleSave}
            >
              <Feather name="save" size={20} color={COLORS.white} />
              <Text style={[modalStyles.textStyle, { color: COLORS.white }]}>
                Save
              </Text>
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
    borderRadius: SIZES.radius_lg,
    padding: SIZES.md,
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
    marginBottom: SIZES.md,
  },
  input: {
    ...FONTS.body,
    backgroundColor: COLORS.input,
    width: "100%",
    borderRadius: SIZES.radius,
    padding: SIZES.sm,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: SIZES.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.sm,
  },
  checkboxChecked: { backgroundColor: COLORS.primary },
  checkboxLabel: { ...FONTS.body, color: COLORS.text },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: SIZES.radius,
    padding: SIZES.sm,
    elevation: 2,
    flex: 1,
    marginHorizontal: SIZES.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonClose: { backgroundColor: COLORS.input },
  buttonSave: { backgroundColor: COLORS.primary },
  textStyle: {
    ...FONTS.h4,
    color: COLORS.text,
    fontWeight: "bold",
    marginLeft: SIZES.xs,
  },
});
