import { useTheme } from "@/theme";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function VirtualAccountModal({
  visible,
  onClose,
  virtualAccount,
  onCreate,
  isLoading = false,
  isCreating = false,
}: {
  visible: boolean;
  onClose: () => void;
  virtualAccount: { accountNumber: string; bank: string } | null;
  onCreate: () => void;
  isLoading?: boolean;
  isCreating?: boolean;
}) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const [renderModal, setRenderModal] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslate = useRef(new Animated.Value(40)).current;

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
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslate, {
          toValue: 40,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => setRenderModal(false));
    }
  }, [visible, overlayOpacity, sheetTranslate]);

  if (!renderModal) return null;

  const sheetBg = isDark ? "rgba(30,41,59,0.92)" : theme.colors.surface;
  const cardBg = isDark ? "rgba(255,255,255,0.06)" : theme.colors.card;
  const cardBorder = isDark ? "rgba(255,255,255,0.12)" : theme.colors.border;

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
              backgroundColor: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)",
            },
          ]}
        />
      </TouchableOpacity>

      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ translateY: sheetTranslate }],
              backgroundColor: sheetBg,
              borderTopColor: isDark ? "rgba(255,255,255,0.10)" : "transparent",
            },
          ]}
        >
          <View
            style={[
              styles.modalHandle,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.20)"
                  : "rgba(0,0,0,0.12)",
              },
            ]}
          />

          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Bank Transfer
          </Text>
          <Text style={[styles.modalSubtitle, { color: theme.colors.muted }]}>
            Use these details to fund your wallet via bank transfer.
          </Text>

          <View
            style={[
              styles.detailsCard,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text
                  style={[styles.loadingText, { color: theme.colors.muted }]}
                >
                  Loading your bank transfer details...
                </Text>
              </View>
            ) : virtualAccount ? (
              <>
                <View style={styles.detailRow}>
                  <Text
                    style={[styles.detailLabel, { color: theme.colors.muted }]}
                  >
                    Bank
                  </Text>
                  <Text
                    style={[styles.detailValue, { color: theme.colors.text }]}
                  >
                    {virtualAccount.bank}
                  </Text>
                </View>

                <View
                  style={[
                    styles.divider,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.10)"
                        : theme.colors.border,
                    },
                  ]}
                />

                <View style={styles.detailRow}>
                  <Text
                    style={[styles.detailLabel, { color: theme.colors.muted }]}
                  >
                    Account Number
                  </Text>
                  <Text
                    style={[
                      styles.detailValueMono,
                      { color: theme.colors.text },
                    ]}
                  >
                    {virtualAccount.accountNumber}
                  </Text>
                </View>

                <Text style={[styles.hint, { color: theme.colors.muted }]}>
                  This is your personal funding account. Transfers may take a
                  few minutes to reflect.
                </Text>
              </>
            ) : (
              <>
                <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
                  You don’t have bank transfer details yet. Create them once,
                  then use the same details to deposit anytime.
                </Text>
              </>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalButtonSecondary,
                {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.18)"
                    : theme.colors.border,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                },
              ]}
              onPress={onClose}
            >
              <Text
                style={[
                  styles.modalButtonTextSecondary,
                  { color: theme.colors.text },
                ]}
              >
                Close
              </Text>
            </TouchableOpacity>

            {!virtualAccount && !isLoading ? (
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonPrimary,
                  { backgroundColor: theme.colors.primary },
                  isCreating && styles.modalButtonDisabled,
                ]}
                onPress={onCreate}
                disabled={isCreating}
              >
                {isCreating ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.balanceText}
                  />
                ) : (
                  <Text
                    style={[
                      styles.modalButtonTextPrimary,
                      { color: theme.colors.balanceText },
                    ]}
                  >
                    Create details
                  </Text>
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  modal: {
    maxHeight: "85%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.select({ ios: 24, android: 20 }),
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
    borderTopWidth: 1,
  },
  modalHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginVertical: 8,
  },
  modalTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },

  detailsCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  loadingText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    flex: 1,
  },

  detailRow: {
    gap: 6,
  },
  detailLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },
  detailValue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },
  detailValueMono: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  hint: {
    marginTop: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    lineHeight: 16,
  },
  emptyText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  modalButtonSecondary: {},
  modalButtonPrimary: {
    borderWidth: 0,
  },
  modalButtonTextSecondary: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  modalButtonTextPrimary: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
});
