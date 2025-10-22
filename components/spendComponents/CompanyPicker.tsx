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

export default function CompanyPicker({
  companies,
  selected,
  onSelect,
  styles,
}: {
  companies: { id: string; name: string }[];
  selected: string | null;
  onSelect: (id: string) => void;
  styles: any;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Company</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.pickerText}>
          {selected
            ? companies.find((c) => c.id === selected)?.name
            : "Select company"}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#778DA9" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={100}
          >
            <View style={styles.modalLarge}>
              <Text style={styles.modalTitle}>Select Company</Text>
              <FlatList
                data={companies}
                keyExtractor={(i) => i.id}
                contentContainerStyle={{ paddingBottom: 24 }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      onSelect(item.id);
                      setVisible(false);
                    }}
                    style={({ pressed }) => [
                      styles.modalItem,
                      pressed && { opacity: 0.6 },
                    ]}
                  >
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
