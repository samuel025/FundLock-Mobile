import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function ExpireDatePicker({
  value,
  onChange,
  error,
}: {
  value: string | Date | null;
  onChange: (date: string) => void;
  error?: string;
}) {
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  function formatDate(date?: string | Date | null) {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Expire At</Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <View style={styles.datePickerContent}>
          <Ionicons name="calendar-outline" size={20} color="#778DA9" />
          <Text style={styles.datePickerText}>
            {value ? formatDate(value) : "Select expiration date"}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color="#778DA9" />
      </TouchableOpacity>
      {error && <Text style={styles.inputError}>{error}</Text>}

      {showDatePicker && (
        <>
          <DateTimePicker
            value={value ? new Date(value) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            minimumDate={new Date()}
            onChange={(_, selected) => {
              if (Platform.OS === "android") {
                setShowDatePicker(false);
              }
              if (selected) {
                onChange(selected.toISOString());
              }
            }}
          />
          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={styles.datePickerDone}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.datePickerDoneText}>Done</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#415A77",
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  datePickerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  datePickerText: {
    fontFamily: "Poppins_500Medium",
    color: "#1B263B",
    fontSize: 15,
  },
  datePickerDone: {
    backgroundColor: "#38B2AC",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  datePickerDoneText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  inputError: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Poppins_500Medium",
  },
});
