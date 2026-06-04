import { Recipient } from "@/services/recipient";
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

function maskAccount(acc: string): string {
  if (!acc || acc.length < 4) return acc;
  return "••••" + acc.slice(-4);
}

export default function RecipientPicker({
  recipients,
  selected,
  onSelect,
  styles,
}: {
  recipients: Recipient[];
  selected: number | null;
  onSelect: (id: number) => void;
  styles: any;
}) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

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
      ]).start();
    });
  };

  const close = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslate, {
        toValue: 40,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setRenderModal(false);
    });
  };

  const selectedItem = useMemo(
    () => recipients.find((r) => r.id === selected) ?? null,
    [recipients, selected],
  );

  return (
    <>
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
          <Ionicons name="person" size={16} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 4 }}>
          <Text style={styles.pickerText}>
            {selectedItem
              ? selectedItem.vendorName || selectedItem.accountName
              : "Select Recipient"}
          </Text>
          {selectedItem && (
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 12,
                color: theme.colors.muted,
                marginTop: 1,
              }}
            >
              {selectedItem.bankName} • {maskAccount(selectedItem.accountNumber)}
            </Text>
          )}
        </View>
        <Ionicons
          name="chevron-down"
          size={18}
          color={theme.colors.muted}
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>

      {renderModal && (
        <Modal transparent visible={renderModal} animationType="none">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <Animated.View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.45)",
                opacity: overlayOpacity,
                justifyContent: "flex-end",
              }}
            >
              <Pressable
                style={{ flex: 1 }}
                onPress={close}
                accessible={false}
              />
              <Animated.View
                style={{
                  backgroundColor: isDark ? "#1B263B" : "#fff",
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  maxHeight: "70%",
                  paddingBottom: 24,
                  transform: [{ translateY: sheetTranslate }],
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 4,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.2)"
                      : "#E2E8F0",
                    borderRadius: 2,
                    alignSelf: "center",
                    marginTop: 12,
                    marginBottom: 4,
                  }}
                />
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 17,
                    color: theme.colors.text,
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  Select Recipient
                </Text>

                <FlatList
                  data={recipients}
                  keyExtractor={(i) => String(i.id)}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={() => (
                    <View
                      style={{
                        alignItems: "center",
                        paddingVertical: 40,
                        paddingHorizontal: 20,
                      }}
                    >
                      <Ionicons
                        name="person-outline"
                        size={48}
                        color={
                          isDark ? "rgba(255,255,255,0.3)" : "#CBD5E1"
                        }
                      />
                      <Text
                        style={{
                          fontFamily: "Poppins_500Medium",
                          fontSize: 15,
                          color: isDark
                            ? "rgba(255,255,255,0.5)"
                            : "#64748B",
                          marginTop: 12,
                          textAlign: "center",
                        }}
                      >
                        No recipients found
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: 13,
                          color: isDark
                            ? "rgba(255,255,255,0.35)"
                            : "#94A3B8",
                          marginTop: 4,
                          textAlign: "center",
                        }}
                      >
                        Add recipients from the Budget page to send funds
                        directly to their bank account.
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
                            name="person"
                            size={18}
                            color={active ? "#fff" : theme.colors.primary}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              localStyles.itemName,
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
                            {item.vendorName || item.accountName}
                          </Text>
                          <Text
                            style={[
                              localStyles.itemSub,
                              {
                                color: isDark
                                  ? "rgba(255,255,255,0.5)"
                                  : "#94A3B8",
                              },
                            ]}
                          >
                            {item.bankName} •{" "}
                            {maskAccount(item.accountNumber)}
                          </Text>
                        </View>
                        {active && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={theme.colors.primary}
                            style={{ marginLeft: "auto", marginRight: 8 }}
                          />
                        )}
                      </Pressable>
                    );
                  }}
                />
                <TouchableOpacity
                  style={localStyles.closeButton}
                  onPress={close}
                >
                  <Text
                    style={[
                      localStyles.closeText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </>
  );
}

const localStyles = StyleSheet.create({
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
  itemName: {
    fontSize: 15,
  },
  itemSub: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 12,
  },
  closeText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },
});
