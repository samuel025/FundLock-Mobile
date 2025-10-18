import React from "react";
import { Controller } from "react-hook-form";
import {
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
}: {
  visible: boolean;
  onClose: () => void;
  control: any;
  handleSubmit: any;
  onWithdraw: (data: any) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Withdraw</Text>

            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value }, fieldState }) => (
                <>
                  <TextInput
                    mode="outlined"
                    label="Amount"
                    value={value !== undefined ? String(value) : ""}
                    onChangeText={(t) => onChange(t.replace(/[^0-9.]/g, ""))}
                    keyboardType="numeric"
                    style={{ marginBottom: 8 }}
                    theme={{
                      fonts: { regular: { fontFamily: "Poppins_500Medium" } },
                    }}
                  />
                  {fieldState.error && (
                    <Text style={styles.inputError}>
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
                    style={{ marginBottom: 12 }}
                    theme={{
                      fonts: { regular: { fontFamily: "Poppins_500Medium" } },
                    }}
                  />
                  {fieldState.error && (
                    <Text style={styles.inputError}>
                      {fieldState.error.message}
                    </Text>
                  )}
                </>
              )}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleSubmit(onWithdraw)}
              >
                <Text style={styles.modalButtonTextPrimary}>
                  Request Withdraw
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    marginBottom: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonTextSecondary: {
    fontFamily: "Poppins_600SemiBold",
    color: "#415A77",
  },
  modalButtonPrimary: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#38B2AC",
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonTextPrimary: { fontFamily: "Poppins_600SemiBold", color: "#fff" },
  inputError: {
    fontFamily: "Poppins_400Regular",
    color: "#D9534F",
    marginTop: 4,
    fontSize: 12,
  },
});
