import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const [renderModal, setRenderModal] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslate = useRef(new Animated.Value(40)).current;

  // open / close animation driven by visible prop
  useEffect(() => {
    if (visible) {
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
        ]).start();
      });
    } else if (renderModal) {
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
      ]).start(() => setRenderModal(false));
    }
  }, [visible, renderModal, overlayOpacity, sheetTranslate]);

  if (!renderModal) return null;

  return (
    <Modal visible transparent animationType="none">
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
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <Animated.View
            style={[
              styles.modal,
              {
                transform: [{ translateY: sheetTranslate }],
                backgroundColor: isDark
                  ? "rgba(30,41,59,0.92)"
                  : theme.colors.surface,
              },
            ]}
          >
            <View
              style={[
                styles.handle,
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
              renderItem={({ item }) => {
                const active = selectedCategoryId === item.id;
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item.id);
                      onClose();
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
                        styles.categoryIcon,
                        {
                          backgroundColor: isDark
                            ? "rgba(56,178,172,0.18)"
                            : "#E7F6F2",
                        },
                      ]}
                    >
                      <Ionicons
                        name="pricetag-outline"
                        size={18}
                        color={theme.colors.primary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.modalItemText,
                        { color: theme.colors.text },
                      ]}
                    >
                      {item.name}
                    </Text>
                    {active && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={theme.colors.primary}
                      />
                    )}
                  </Pressable>
                );
              }}
              contentContainerStyle={{ paddingBottom: 18 }}
            />
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalClose}
              accessibilityLabel="Close category picker"
            >
              <Text
                style={[styles.modalCloseText, { color: theme.colors.primary }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modal: {
    maxHeight: "60%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 8,
  },
  handle: {
    width: 46,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 10,
  },
  modalItemText: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    flex: 1,
  },
  modalClose: { marginTop: 12, alignItems: "center" },
  modalCloseText: { fontFamily: "Poppins_600SemiBold" },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemSeparator: {
    height: 1,
    marginLeft: 52,
  },
});
