import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PickerOption = {
  label: string;
  value: string;
};

type CustomPickerProps = {
  label: string;
  options: PickerOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
};

const CustomPicker: React.FC<CustomPickerProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || "Select...";

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={pickerStyles.container}>
      <Text style={pickerStyles.label}>{label}</Text>

      <TouchableOpacity
        style={pickerStyles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={pickerStyles.pickerButtonText}>{selectedLabel}</Text>
        <Text style={pickerStyles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={pickerStyles.modalContainer}>
          <View style={pickerStyles.modalContent}>
            <Text style={pickerStyles.modalTitle}>{`Select ${label}`}</Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={pickerStyles.optionButton}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={pickerStyles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={pickerStyles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={pickerStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const pickerStyles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { color: "#a0a0a0", marginBottom: 8, fontSize: 16 },
  pickerButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  pickerButtonText: { color: "#fff", fontSize: 16 },
  arrow: { color: "#a0a0a0" },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "#222",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  optionText: { color: "#fff", fontSize: 18, textAlign: "center" },
  closeButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CustomPicker;
