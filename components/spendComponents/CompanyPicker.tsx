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
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const [visible, setVisible] = useState(false);
  const [renderModal, setRenderModal] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslate = useRef(new Animated.Value(40)).current;

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
      <Text style={[styles.sectionTitle, { color: theme.colors.muted }]}>
        Company
      </Text>
      <TouchableOpacity style={styles.pickerButton} onPress={open}>
        <Text style={styles.pickerText}>
          {selected
            ? companies.find((c) => c.id === selected)?.name
            : "Select company"}
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
                  Select Company
                </Text>
                <FlatList
                  data={companies}
                  keyExtractor={(i) => i.id}
                  ListEmptyComponent={() => (
                    <View
                      style={{
                        alignItems: "center",
                        paddingVertical: 40,
                        paddingHorizontal: 20,
                      }}
                    >
                      <Ionicons
                        name="business-outline"
                        size={48}
                        color={isDark ? "rgba(255,255,255,0.3)" : "#CBD5E1"}
                      />
                      <Text
                        style={{
                          fontFamily: "Poppins_500Medium",
                          fontSize: 15,
                          color: isDark ? "rgba(255,255,255,0.5)" : "#64748B",
                          marginTop: 12,
                          textAlign: "center",
                        }}
                      >
                        No companies available
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: 13,
                          color: isDark ? "rgba(255,255,255,0.35)" : "#94A3B8",
                          marginTop: 4,
                          textAlign: "center",
                        }}
                      >
                        Try selecting a different category
                      </Text>
                    </View>
                  )}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "#F1F5F9",
                        marginLeft: 20,
                      }}
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
                          styles.modalItem,
                          pressed && {
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.06)"
                              : "rgba(0,0,0,0.03)",
                          },
                        ]}
                      >
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            marginRight: 12,
                            backgroundColor: isDark
                              ? "rgba(56,178,172,0.18)"
                              : "#E7F6F2",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Ionicons
                            name="briefcase-outline"
                            size={18}
                            color={theme.colors.primary}
                          />
                        </View>
                        <Text
                          style={[
                            styles.modalItemText,
                            { color: theme.colors.text, flex: 1 },
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
                />
                <TouchableOpacity
                  onPress={close}
                  style={styles.modalClose}
                  accessibilityLabel="Close company picker"
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
