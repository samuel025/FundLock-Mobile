import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface MonthPickerProps {
  selectedMonth: number;
  selectedYear: number;
  onSelect: (month: number, year: number) => void;
}

export function MonthPicker({
  selectedMonth,
  selectedYear,
  onSelect,
}: MonthPickerProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const [visible, setVisible] = useState(false);
  const [tempYear, setTempYear] = useState(selectedYear);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslate = useRef(new Animated.Value(100)).current;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const open = () => {
    setTempYear(selectedYear);
    setVisible(true);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(sheetTranslate, {
        toValue: 0,
        tension: 65,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const close = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslate, {
        toValue: 100,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  const handleSelect = (month: number) => {
    onSelect(month, tempYear);
    close();
  };

  const handlePrevYear = () => {
    if (tempYear > currentYear - 5) {
      setTempYear(tempYear - 1);
    }
  };

  const handleNextYear = () => {
    if (tempYear < currentYear) {
      setTempYear(tempYear + 1);
    }
  };

  const isMonthDisabled = (month: number) => {
    if (tempYear < currentYear) return false;
    return month > currentMonth;
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.08)"
              : theme.colors.card,
            borderColor: isDark
              ? "rgba(255,255,255,0.12)"
              : theme.colors.border,
          },
        ]}
        onPress={open}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${theme.colors.primary}20` },
          ]}
        >
          <Ionicons name="calendar" size={20} color={theme.colors.primary} />
        </View>
        <Text style={[styles.pickerText, { color: theme.colors.text }]}>
          {MONTHS[selectedMonth]} {selectedYear}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.colors.muted} />
      </TouchableOpacity>

      <Modal transparent visible={visible} onRequestClose={close}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={close}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: isDark ? "#1B263B" : theme.colors.background,
              transform: [{ translateY: sheetTranslate }],
            },
          ]}
        >
          <View
            style={[
              styles.handle,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
              },
            ]}
          />

          {/* Year Selector */}
          <View style={styles.yearSelector}>
            <TouchableOpacity
              onPress={handlePrevYear}
              disabled={tempYear <= currentYear - 5}
              style={[
                styles.yearButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "#F1F5F9",
                },
              ]}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={
                  tempYear <= currentYear - 5
                    ? theme.colors.muted
                    : theme.colors.text
                }
              />
            </TouchableOpacity>
            <Text style={[styles.yearText, { color: theme.colors.text }]}>
              {tempYear}
            </Text>
            <TouchableOpacity
              onPress={handleNextYear}
              disabled={tempYear >= currentYear}
              style={[
                styles.yearButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "#F1F5F9",
                },
              ]}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={
                  tempYear >= currentYear
                    ? theme.colors.muted
                    : theme.colors.text
                }
              />
            </TouchableOpacity>
          </View>

          {/* Months Grid */}
          <View style={styles.monthsGrid}>
            {MONTHS.map((month, index) => {
              const isSelected =
                index === selectedMonth && tempYear === selectedYear;
              const disabled = isMonthDisabled(index);

              return (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthItem,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary
                        : isDark
                          ? "rgba(255,255,255,0.06)"
                          : "#F8FAFC",
                      opacity: disabled ? 0.4 : 1,
                    },
                  ]}
                  onPress={() => !disabled && handleSelect(index)}
                  disabled={disabled}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.monthText,
                      {
                        color: isSelected ? "#fff" : theme.colors.text,
                        fontFamily: isSelected
                          ? "Poppins_600SemiBold"
                          : "Poppins_500Medium",
                      },
                    ]}
                  >
                    {month.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={[styles.closeButton]} onPress={close}>
            <Text
              style={[styles.closeButtonText, { color: theme.colors.primary }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  yearSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 20,
  },
  yearButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  yearText: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    minWidth: 80,
    textAlign: "center",
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  monthItem: {
    width: "30%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  monthText: {
    fontSize: 14,
  },
  closeButton: {
    marginTop: 24,
    alignItems: "center",
    paddingVertical: 14,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});
