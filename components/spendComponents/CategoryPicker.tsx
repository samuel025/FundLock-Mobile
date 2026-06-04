import { UnifiedCategory } from "@/lib/categoryStore";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
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
  View,
} from "react-native";

export default function CategoryPicker({
  categories,
  selected,
  onSelect,
  styles,
}: {
  categories: UnifiedCategory[] | undefined;
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

  const selectedItem = useMemo(() => {
    if (!categories || !selected) return null;
    return categories.find((c) => `${c.type}-${c.id}` === selected);
  }, [categories, selected]);

  // Separate system and custom for rendering with section headers
  const systemCats = useMemo(
    () => (categories ?? []).filter((c) => c.type === "SYSTEM"),
    [categories],
  );
  const customCats = useMemo(
    () => (categories ?? []).filter((c) => c.type === "CUSTOM"),
    [categories],
  );

  const isCustom = selectedItem?.type === "CUSTOM";

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Category</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={open}>
        <View
          style={[
            styles.catIcon,
            {
              backgroundColor: isDark
                ? isCustom
                  ? "rgba(167,139,250,0.15)"
                  : "rgba(56,178,172,0.15)"
                : isCustom
                  ? "#F3F0FF"
                  : theme.colors.actionIconLockBg,
            },
          ]}
        >
          <Ionicons
            name={isCustom ? "create" : "pricetag"}
            size={16}
            color={isCustom ? "#8B5CF6" : theme.colors.primary}
          />
        </View>
        <Text style={styles.pickerText}>
          {selectedItem?.name ?? "Select category"}
        </Text>
        {selectedItem?.type === "CUSTOM" && (
          <View
            style={[
              localStyles.badge,
              {
                backgroundColor: isDark
                  ? "rgba(167,139,250,0.2)"
                  : "#F3F0FF",
              },
            ]}
          >
            <Text style={localStyles.badgeText}>Custom</Text>
          </View>
        )}
        <Ionicons
          name="chevron-down"
          size={20}
          color={theme.colors.muted}
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>

      {renderModal && (
        <Modal transparent animationType="none" visible>
          <Animated.View
            style={[
              localStyles.modalOverlay,
              {
                opacity: overlayOpacity,
                backgroundColor: isDark
                  ? "rgba(0,0,0,0.6)"
                  : "rgba(0,0,0,0.4)",
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
                  localStyles.modalSheet,
                  {
                    transform: [{ translateY: sheetTranslate }],
                    backgroundColor: isDark
                      ? "#1B263B"
                      : theme.colors.background,
                  },
                ]}
              >
                <View
                  style={[
                    localStyles.handle,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.1)",
                    },
                  ]}
                />
                <Text
                  style={[
                    localStyles.modalTitle,
                    { color: theme.colors.text },
                  ]}
                >
                  Select Category
                </Text>

                <FlatList
                  data={[
                    ...(systemCats.length > 0
                      ? [
                          { __type: "header", label: "System Categories" },
                          ...systemCats,
                        ]
                      : []),
                    ...(customCats.length > 0
                      ? [
                          { __type: "header", label: "Custom Categories" },
                          ...customCats,
                        ]
                      : []),
                  ]}
                  keyExtractor={(i: any, idx) =>
                    i.__type === "header" ? `header-${idx}` : `${i.type}-${i.id}`
                  }
                  contentContainerStyle={{ paddingBottom: 24 }}
                  renderItem={({ item }: { item: any }) => {
                    // Section header
                    if (item.__type === "header") {
                      return (
                        <View style={localStyles.sectionHeader}>
                          <Text
                            style={[
                              localStyles.sectionHeaderText,
                              { color: theme.colors.muted },
                            ]}
                          >
                            {item.label}
                          </Text>
                        </View>
                      );
                    }

                    const compositeKey = `${item.type}-${item.id}`;
                    const active = selected === compositeKey;
                    const isCust = item.type === "CUSTOM";
                    return (
                      <Pressable
                        onPress={() => {
                          onSelect(compositeKey);
                          close();
                        }}
                        style={({ pressed }) => [
                          localStyles.item,
                          pressed && {
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.06)"
                              : "#F8FAFC",
                          },
                        ]}
                      >
                        <View
                          style={[
                            localStyles.itemIcon,
                            {
                              backgroundColor: active
                                ? isCust
                                  ? "#8B5CF6"
                                  : theme.colors.primary
                                : isDark
                                  ? "rgba(255,255,255,0.08)"
                                  : isCust
                                    ? "#F3F0FF"
                                    : "#F1F5F9",
                            },
                          ]}
                        >
                          <Ionicons
                            name={isCust ? "create" : "pricetag"}
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
                            localStyles.itemText,
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
                            name="checkmark-circle"
                            size={20}
                            color={
                              isCust ? "#8B5CF6" : theme.colors.primary
                            }
                            style={{ marginLeft: "auto" }}
                          />
                        )}
                      </Pressable>
                    );
                  }}
                />
                <TouchableOpacity
                  onPress={close}
                  style={localStyles.closeButton}
                  accessibilityLabel="Close category picker"
                >
                  <Text
                    style={[
                      localStyles.closeButtonText,
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

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 32,
    maxHeight: "70%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemText: {
    fontSize: 15,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Poppins_500Medium",
    color: "#8B5CF6",
  },
  closeButton: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 12,
  },
  closeButtonText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },
});
