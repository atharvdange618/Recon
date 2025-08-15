import { Feather } from "@expo/vector-icons";
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
import { COLORS, FONTS, SIZES } from "../lib/theme";

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
        <Feather name="chevron-down" size={20} color={COLORS.textSecondary} />
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
  container: { marginBottom: SIZES.sm, width: "100%" },
  label: { ...FONTS.body, color: COLORS.textSecondary, marginBottom: SIZES.xs },
  pickerButton: {
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    padding: SIZES.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerButtonText: { ...FONTS.body, color: COLORS.text },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: SIZES.radius_lg,
    borderTopRightRadius: SIZES.radius_lg,
    padding: SIZES.sm,
    maxHeight: "70%",
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SIZES.md,
    textAlign: "center",
  },
  optionButton: {
    padding: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionText: { ...FONTS.h4, color: COLORS.text, textAlign: "center" },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.sm,
    marginTop: SIZES.md,
  },
  closeButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default CustomPicker;
