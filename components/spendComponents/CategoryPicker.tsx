import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CategoryPicker({
  categories,
  selected,
  onSelect,
  styles,
}: {
  categories: { id: string; name: string }[] | undefined;
  selected: string | null;
  onSelect: (id: string) => void;
  styles: any;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Category</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.pickerText}>
          {categories && selected
            ? categories.find((c) => c.id === selected)?.name
            : "Select category"}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#778DA9" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={100}
            style={{ flex: 1, justifyContent: "flex-end" }}
          >
            <View style={styles.modalLarge}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Select Category</Text>
              <FlatList
                data={categories}
                keyExtractor={(i) => i.id}
                ItemSeparatorComponent={() => (
                  <View style={styles.itemSeparator} />
                )}
                contentContainerStyle={{ paddingBottom: 24 }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      onSelect(item.id);
                      setVisible(false);
                    }}
                    style={({ pressed }) => [
                      styles.modalItem,
                      pressed && { backgroundColor: "rgba(0,0,0,0.03)" },
                    ]}
                  >
                    <View style={styles.catIcon} />
                    <Text style={styles.modalItemText}>{item.name}</Text>
                  </Pressable>
                )}
              />
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
