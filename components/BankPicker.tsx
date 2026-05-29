import { Bank } from "@/services/bank";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface BankPickerProps {
  visible: boolean;
  banks: Bank[];
  onSelect: (bank: Bank) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function BankPicker({
  visible,
  banks,
  onSelect,
  onClose,
  isLoading,
}: BankPickerProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBanks = useMemo(() => {
    if (!searchQuery.trim()) return banks;
    const query = searchQuery.toLowerCase();
    return banks.filter((b) => b.name.toLowerCase().includes(query));
  }, [banks, searchQuery]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: isDark
                ? theme.colors.surface
                : theme.colors.background,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Select Bank
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.muted}
              style={styles.searchIcon}
            />
            <TextInput
              style={[
                styles.searchInput,
                {
                  color: theme.colors.text,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "#F1F5F9",
                },
              ]}
              placeholder="Search banks"
              placeholderTextColor={theme.colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={{ color: theme.colors.muted }}>
                Loading banks...
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredBanks}
              keyExtractor={(item) => item.code}
              contentContainerStyle={{ padding: 16 }}
              maxToRenderPerBatch={15}
              windowSize={5}
              keyboardShouldPersistTaps="handled"
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    styles.bankSeparator,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "#E2E8F0",
                    },
                  ]}
                />
              )}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.bankItem,
                    pressed && {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "#F8FAFC",
                    },
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setSearchQuery("");
                  }}
                >
                  <View style={styles.bankIconContainer}>
                    <Ionicons
                      name="business"
                      size={20}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={[styles.bankName, { color: theme.colors.text }]}>
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: Platform.OS === "ios" ? "85%" : "80%",
    paddingTop: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  closeBtn: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchIcon: {
    position: "absolute",
    left: 28,
    top: 28,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 16,
    fontFamily: "Poppins_400Regular",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bankItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  bankIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(56, 178, 172, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bankName: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    flex: 1,
  },
  bankSeparator: {
    height: 1,
    marginVertical: 4,
  },
});
