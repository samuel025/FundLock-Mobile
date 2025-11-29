import { useTheme } from "@/theme";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

export function WithdrawModal({
  visible,
  onClose,
  control,
  handleSubmit,
  onWithdraw,
  isWithdrawing,
  availableBalance,
  formState,
}: {
  visible: boolean;
  onClose: () => void;
  control: any;
  handleSubmit: any;
  onWithdraw: (data: any) => void;
  isWithdrawing?: boolean;
  availableBalance: number;
  formState?: any;
}) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const [renderModal, setRenderModal] = useState(false);
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;
  const sheetTranslate = React.useRef(new Animated.Value(40)).current;

  const formatWithCommas = (val: string) => {
    if (!val || val === "" || val === ".") return val;
    const parts = val.split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  };

  React.useEffect(() => {
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
      ]).start(() => {
        setRenderModal(false);
      });
    }
  }, [visible, overlayOpacity, sheetTranslate]);

  if (!renderModal) return null;

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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
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
              styles.modalHandle,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.12)",
              },
            ]}
          />

          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Withdraw Funds
          </Text>

          <View
            style={[
              styles.balanceBox,
              {
                backgroundColor: isDark
                  ? "rgba(56, 178, 172, 0.15)"
                  : "#F8FBFA",
              },
            ]}
          >
            <Text style={[styles.balanceLabel, { color: theme.colors.muted }]}>
              Available Balance
            </Text>
            <Text
              style={[styles.balanceAmount, { color: theme.colors.primary }]}
            >
              ₦{(availableBalance || 0).toLocaleString()}
            </Text>
          </View>

          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <TextInput
                  mode="outlined"
                  label="Amount to withdraw"
                  value={formatWithCommas(
                    value !== undefined ? String(value) : ""
                  )}
                  onChangeText={(t) => {
                    const cleaned = t
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*)\./g, "$1");

                    const numeric = parseFloat(cleaned);
                    if (!isNaN(numeric) && numeric > (availableBalance || 0)) {
                      onChange(String(availableBalance || 0));
                    } else {
                      onChange(cleaned);
                    }
                  }}
                  keyboardType={
                    Platform.OS === "ios" ? "decimal-pad" : "numeric"
                  }
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <Text
                          style={[
                            styles.currency,
                            { color: theme.colors.primary },
                          ]}
                        >
                          ₦
                        </Text>
                      )}
                    />
                  }
                  outlineColor={
                    isDark ? "rgba(255,255,255,0.2)" : theme.colors.border
                  }
                  activeOutlineColor={theme.colors.primary}
                  textColor={theme.colors.text}
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : theme.colors.surface,
                    },
                  ]}
                  outlineStyle={{ borderRadius: 12 }}
                  theme={{
                    fonts: { regular: { fontFamily: "Poppins_500Medium" } },
                    colors: {
                      primary: theme.colors.primary,
                      placeholder: isDark
                        ? "rgba(255,255,255,0.5)"
                        : theme.colors.muted,
                      text: theme.colors.text,
                      onSurfaceVariant: isDark
                        ? "rgba(255,255,255,0.6)"
                        : theme.colors.muted,
                      background: isDark
                        ? theme.colors.background
                        : theme.colors.surface,
                      onSurface: theme.colors.text,
                      outline: isDark
                        ? "rgba(255,255,255,0.2)"
                        : theme.colors.border,
                      surfaceVariant: isDark
                        ? theme.colors.background
                        : theme.colors.surface,
                    },
                  }}
                />
                {fieldState.error && (
                  <Text
                    style={[styles.inputError, { color: theme.colors.danger }]}
                  >
                    {fieldState.error.message}
                  </Text>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name="pin"
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <TextInput
                  mode="outlined"
                  label="4-digit PIN"
                  value={value}
                  onChangeText={(t) =>
                    onChange(t.replace(/[^0-9]/g, "").slice(0, 4))
                  }
                  keyboardType="number-pad"
                  secureTextEntry
                  outlineColor={
                    isDark ? "rgba(255,255,255,0.2)" : theme.colors.border
                  }
                  activeOutlineColor={theme.colors.primary}
                  textColor={theme.colors.text}
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : theme.colors.surface,
                      marginTop: 12,
                    },
                  ]}
                  outlineStyle={{ borderRadius: 12 }}
                  theme={{
                    fonts: { regular: { fontFamily: "Poppins_500Medium" } },
                    colors: {
                      primary: theme.colors.primary,
                      placeholder: isDark
                        ? "rgba(255,255,255,0.5)"
                        : theme.colors.muted,
                      text: theme.colors.text,
                      onSurfaceVariant: isDark
                        ? "rgba(255,255,255,0.6)"
                        : theme.colors.muted,
                      background: isDark
                        ? theme.colors.background
                        : theme.colors.surface,
                      onSurface: theme.colors.text,
                      outline: isDark
                        ? "rgba(255,255,255,0.2)"
                        : theme.colors.border,
                      surfaceVariant: isDark
                        ? theme.colors.background
                        : theme.colors.surface,
                    },
                  }}
                />
                {fieldState.error && (
                  <Text
                    style={[styles.inputError, { color: theme.colors.danger }]}
                  >
                    {fieldState.error.message}
                  </Text>
                )}
              </>
            )}
          />

          <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.2)"
                    : theme.colors.border,
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
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButtonPrimary,
                {
                  backgroundColor: theme.colors.primary,
                },
                (isWithdrawing || !formState?.isValid) &&
                  styles.modalButtonDisabled,
              ]}
              onPress={handleSubmit(onWithdraw)}
              disabled={isWithdrawing || !formState?.isValid}
            >
              <Text style={styles.modalButtonTextPrimary}>
                {isWithdrawing ? "Processing..." : "Withdraw"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
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
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
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
    marginBottom: 16,
  },
  balanceBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  balanceLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
  },
  input: {
    fontSize: 16,
  },
  currency: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonTextSecondary: {
    fontFamily: "Poppins_600SemiBold",
  },
  modalButtonPrimary: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonTextPrimary: {
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  inputError: {
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
    fontSize: 12,
  },
});
