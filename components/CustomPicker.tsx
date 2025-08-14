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
  container: { marginBottom: SIZES.padding * 0.8 },
  label: { ...FONTS.body3, color: COLORS.textSecondary, marginBottom: SIZES.base },
  pickerButton: {
    backgroundColor: COLORS.darkGray,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pickerButtonText: { ...FONTS.body3, color: COLORS.text },
  arrow: { color: COLORS.textSecondary },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: SIZES.radius * 1.5,
    borderTopRightRadius: SIZES.radius * 1.5,
    padding: SIZES.padding,
    maxHeight: "70%",
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SIZES.padding,
    textAlign: "center",
  },
  optionButton: {
    padding: SIZES.padding * 0.8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionText: { ...FONTS.h4, color: COLORS.text, textAlign: "center" },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.8,
    marginTop: SIZES.padding,
  },
  closeButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default CustomPicker;
