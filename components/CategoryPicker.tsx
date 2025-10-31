import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function CategoryPicker({
  visible,
  categories,
  selectedCategoryId,
  onSelect,
  onClose,
}: {
  visible: boolean;
  categories: { id: string; name: string }[];
  selectedCategoryId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={categories}
              keyExtractor={(i) => i.id}
              ItemSeparatorComponent={() => (
                <View style={styles.itemSeparator} />
              )}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.modalItem,
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  <View style={styles.categoryIcon}>
                    {/* You can add icon/color here if needed */}
                  </View>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  {selectedCategoryId === item.id && (
                    <Ionicons name="checkmark" size={18} color="#38B2AC" />
                  )}
                </Pressable>
              )}
            />
            <TouchableOpacity onPress={onClose} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#fff",
    maxHeight: "60%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  modalItemText: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#1B263B",
    flex: 1,
  },
  modalClose: { marginTop: 12, alignItems: "center" },
  modalCloseText: { color: "#38B2AC", fontFamily: "Poppins_600SemiBold" },
  categoryIcon: {
    width: 35,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemSeparator: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 56 },
});
