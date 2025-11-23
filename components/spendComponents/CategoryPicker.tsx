import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
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
  const [renderModal, setRenderModal] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslate = useRef(new Animated.Value(40)).current;
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const open = () => {
    setRenderModal(true);
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslate, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(true));
    });
  };

  const close = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslate, {
        toValue: 40,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      setRenderModal(false);
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Category</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={open}>
        <Text style={styles.pickerText}>
          {categories && selected
            ? categories.find((c) => c.id === selected)?.name
            : "Select category"}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={isDark ? "rgba(255,255,255,0.6)" : "#778DA9"}
        />
      </TouchableOpacity>

      {renderModal && (
        <Modal transparent animationType="none" visible>
          <Animated.View
            style={[
              styles.modalOverlay,
              {
                backgroundColor: overlayOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    "rgba(0,0,0,0.0)",
                    isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)",
                  ],
                }),
              },
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={100}
              style={{ flex: 1, justifyContent: "flex-end" }}
            >
              <Animated.View
                style={[
                  styles.modalLarge,
                  {
                    transform: [{ translateY: sheetTranslate }],
                    backgroundColor: isDark
                      ? "rgba(30,41,59,0.92)"
                      : theme.colors.surface,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  },
                ]}
              >
                <View
                  style={[
                    styles.modalHandle,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(0,0,0,0.12)",
                    },
                  ]}
                />
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  Select Category
                </Text>
                <FlatList
                  data={categories}
                  keyExtractor={(i) => i.id}
                  ItemSeparatorComponent={() => (
                    <View
                      style={[
                        styles.itemSeparator,
                        {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.08)"
                            : "#F1F5F9",
                        },
                      ]}
                    />
                  )}
                  contentContainerStyle={{ paddingBottom: 24 }}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        onSelect(item.id);
                        close();
                      }}
                      style={({ pressed }) => [
                        styles.modalItem,
                        pressed && {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.03)",
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.catIcon,
                          {
                            backgroundColor: isDark
                              ? "rgba(56,178,172,0.18)"
                              : theme.colors.actionIconLockBg ?? "#E7F6F2",
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.modalItemText,
                          { color: theme.colors.text },
                        ]}
                      >
                        {item.name}
                      </Text>
                      {selected === item.id && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={theme.colors.primary}
                        />
                      )}
                    </Pressable>
                  )}
                />
                <TouchableOpacity
                  onPress={close}
                  style={styles.modalClose}
                  accessibilityLabel="Close category picker"
                >
                  <Text
                    style={[
                      styles.modalCloseText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </KeyboardAvoidingView>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
}
