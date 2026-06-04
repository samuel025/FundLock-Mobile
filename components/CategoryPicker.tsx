import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  categories: { id: string; name: string; type?: "SYSTEM" | "CUSTOM" }[];
  selectedCategoryId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const [renderModal, setRenderModal] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslate = useRef(new Animated.Value(40)).current;

  // Separate system and custom categories
  const systemCats = useMemo(
    () => (categories ?? []).filter((c) => !c.type || c.type === "SYSTEM"),
    [categories],
  );
  const customCats = useMemo(
    () => (categories ?? []).filter((c) => c.type === "CUSTOM"),
    [categories],
  );

  // Build flat list with section headers
  const flatData = useMemo(() => {
    const items: any[] = [];
    if (systemCats.length > 0) {
      items.push({ __type: "header", label: "System Categories" });
      items.push(...systemCats);
    }
    if (customCats.length > 0) {
      items.push({ __type: "header", label: "Your Custom Categories" });
      items.push(...customCats);
    }
    return items;
  }, [systemCats, customCats]);

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
              data={flatData}
              keyExtractor={(i: any, idx) =>
                i.__type === "header"
                  ? `header-${idx}`
                  : `${i.type || "SYSTEM"}-${i.id}`
              }
              contentContainerStyle={{ paddingBottom: 18 }}
              renderItem={({ item }: { item: any }) => {
                // Section header
                if (item.__type === "header") {
                  return (
                    <View style={styles.sectionHeader}>
                      <Text
                        style={[
                          styles.sectionHeaderText,
                          { color: theme.colors.muted },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                  );
                }

                const isCust = item.type === "CUSTOM";
                const compositeKey = `${item.type || "SYSTEM"}-${item.id}`;
                const active = selectedCategoryId === compositeKey;

                return (
                  <Pressable
                    onPress={() => {
                      onSelect(compositeKey);
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
                          backgroundColor: active
                            ? isCust
                              ? "#8B5CF6"
                              : theme.colors.primary
                            : isDark
                              ? isCust
                                ? "rgba(167,139,250,0.18)"
                                : "rgba(56,178,172,0.18)"
                              : isCust
                                ? "#F3F0FF"
                                : "#E7F6F2",
                        },
                      ]}
                    >
                      <Ionicons
                        name={isCust ? "create-outline" : "pricetag-outline"}
                        size={18}
                        color={
                          active
                            ? "#fff"
                            : isCust
                              ? "#8B5CF6"
                              : theme.colors.primary
                        }
                      />
                    </View>
                    <Text
                      style={[
                        styles.modalItemText,
                        {
                          color: active
                            ? isCust
                              ? "#8B5CF6"
                              : theme.colors.primary
                            : theme.colors.text,
                          fontFamily: active
                            ? "Poppins_600SemiBold"
                            : "Poppins_500Medium",
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                    {active && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={isCust ? "#8B5CF6" : theme.colors.primary}
                      />
                    )}
                  </Pressable>
                );
              }}
            />
            {/* Create new custom category button */}
            <TouchableOpacity
              onPress={() => {
                onSelect("custom");
                onClose();
              }}
              style={[
                styles.createCustomButton,
                {
                  borderColor: isDark
                    ? "rgba(139,92,246,0.3)"
                    : "rgba(139,92,246,0.2)",
                  backgroundColor: isDark
                    ? "rgba(139,92,246,0.08)"
                    : "#FAFAFF",
                },
              ]}
            >
              <Ionicons name="add-circle-outline" size={20} color="#8B5CF6" />
              <Text style={styles.createCustomText}>
                Create New Custom Category
              </Text>
            </TouchableOpacity>
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
    maxHeight: "70%",
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
  sectionHeader: {
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 6,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
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
  createCustomButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  createCustomText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#8B5CF6",
    fontSize: 14,
  },
});
