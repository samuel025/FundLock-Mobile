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

  const selectedItem = useMemo(() => {
    if (!categories || !selected) return null;
    return categories.find((c) => c.id === selected);
  }, [categories, selected]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Category</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={open}>
        <View
          style={[
            styles.catIcon,
            {
              backgroundColor: isDark
                ? "rgba(56,178,172,0.15)"
                : theme.colors.actionIconLockBg,
            },
          ]}
        >
          <Ionicons name="pricetag" size={16} color={theme.colors.primary} />
        </View>
        <Text style={styles.pickerText}>
          {selectedItem?.name ?? "Select category"}
        </Text>
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
                backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)",
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
                  style={[localStyles.modalTitle, { color: theme.colors.text }]}
                >
                  Select Category
                </Text>
                <FlatList
                  data={categories}
                  keyExtractor={(i) => i.id}
                  ItemSeparatorComponent={() => (
                    <View
                      style={[
                        localStyles.separator,
                        {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.08)"
                            : "#F1F5F9",
                        },
                      ]}
                    />
                  )}
                  contentContainerStyle={{ paddingBottom: 24 }}
                  renderItem={({ item }) => {
                    const active = selected === item.id;
                    return (
                      <Pressable
                        onPress={() => {
                          onSelect(item.id);
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
                                ? theme.colors.primary
                                : isDark
                                  ? "rgba(255,255,255,0.08)"
                                  : "#F1F5F9",
                            },
                          ]}
                        >
                          <Ionicons
                            name="pricetag"
                            size={18}
                            color={active ? "#fff" : theme.colors.primary}
                          />
                        </View>
                        <Text
                          style={[
                            localStyles.itemText,
                            {
                              color: active
                                ? theme.colors.primary
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
                            color={theme.colors.primary}
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
  separator: {
    height: 1,
    marginHorizontal: 20,
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
