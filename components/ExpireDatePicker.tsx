import { useTheme } from "@/theme";
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
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  function formatDate(date?: string | Date | null) {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          { color: isDark ? theme.colors.balanceLabel : "#415A77" },
        ]}
      >
        Expire At
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: isDark ? "rgba(255,255,255,0.5)" : "#778DA9" },
        ]}
      >
        Note that this will be ignored if there is an existing budget in the
        category you choose and your money will be added to the existing budget.
      </Text>
      <TouchableOpacity
        style={[
          styles.datePickerButton,
          {
            backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#FFFFFF",
            borderColor: isDark ? "rgba(255,255,255,0.2)" : "#E9ECEF",
          },
        ]}
        onPress={() => setShowDatePicker(true)}
      >
        <View style={styles.datePickerContent}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={isDark ? "rgba(255,255,255,0.6)" : "#778DA9"}
          />
          <Text
            style={[
              styles.datePickerText,
              {
                color: value
                  ? isDark
                    ? theme.colors.text
                    : "#1B263B"
                  : isDark
                  ? "rgba(255,255,255,0.5)"
                  : "#778DA9",
              },
            ]}
          >
            {value ? formatDate(value) : "Select expiration date"}
          </Text>
        </View>
        <Ionicons
          name="chevron-down"
          size={20}
          color={isDark ? "rgba(255,255,255,0.6)" : "#778DA9"}
        />
      </TouchableOpacity>
      {error && (
        <Text style={[styles.inputError, { color: theme.colors.danger }]}>
          {error}
        </Text>
      )}

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
            themeVariant={isDark ? "dark" : "light"}
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
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#415A77",
    marginBottom: 4,
    lineHeight: 22,
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 19,
    includeFontPadding: false,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#E9ECEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  datePickerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  datePickerText: {
    fontFamily: "Poppins_500Medium",
    color: "#1B263B",
    fontSize: 15,
    lineHeight: 22,
    includeFontPadding: false,
  },
  datePickerDone: {
    backgroundColor: "#38B2AC",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  datePickerDoneText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    lineHeight: 22,
    includeFontPadding: false,
  },
  inputError: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 8,
    marginLeft: 4,
    fontFamily: "Poppins_500Medium",
    lineHeight: 18,
    includeFontPadding: false,
  },
});
