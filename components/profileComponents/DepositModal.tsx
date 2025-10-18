import React from "react";
import { Controller } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import { WebView } from "react-native-webview";

export function DepositModal({
  visible,
  onClose,
  control,
  handleSubmit,
  onGenerate,
  isGenerating,
  depositLink,
}: {
  visible: boolean;
  onClose: () => void;
  control: any;
  handleSubmit: any;
  onGenerate: (data: any) => void;
  isGenerating: boolean;
  depositLink?: string | null;
}) {
  const [showWebView, setShowWebView] = React.useState(false);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Generate Deposit Link</Text>

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

            {/* show generated link if available */}
            {depositLink ? (
              <View style={styles.linkBox}>
                <Text style={styles.linkLabel}>Deposit link</Text>
                <TouchableOpacity
                  onPress={() => setShowWebView(true)}
                  accessibilityRole="link"
                >
                  <Text style={styles.linkText}>{depositLink}</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                <Text style={styles.modalButtonTextSecondary}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleSubmit(onGenerate)}
                disabled={isGenerating}
              >
                <Text style={styles.modalButtonTextPrimary}>
                  {isGenerating ? "Generating..." : "Generate link"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* WebView modal */}
      <Modal
        visible={showWebView}
        animationType="slide"
        onRequestClose={() => setShowWebView(false)}
      >
        <View style={styles.webviewContainer}>
          <View style={styles.webviewHeader}>
            <TouchableOpacity
              onPress={() => setShowWebView(false)}
              style={styles.webviewClose}
            >
              <Text style={styles.webviewCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: depositLink ?? "about:blank" }}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.webviewLoader}>
                <ActivityIndicator size="large" color="#38B2AC" />
              </View>
            )}
            onError={() => {
              // fallback: close webview if it errors
              setShowWebView(false);
            }}
          />
        </View>
      </Modal>
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
  linkBox: {
    backgroundColor: "#F8FBFA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  linkLabel: {
    fontFamily: "Poppins_500Medium",
    color: "#415A77",
    marginBottom: 6,
  },
  linkText: { color: "#1B63A8", textDecorationLine: "underline" },
  webviewContainer: { flex: 1, backgroundColor: "#fff" },
  webviewHeader: {
    // make header respect status bar / safe area and give more vertical space
    paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight ?? 12,
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
    alignItems: "flex-end",
  },
  webviewClose: {
    // larger touch target
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignSelf: "flex-end",
  },
  webviewCloseText: {
    color: "#38B2AC",
    fontFamily: "Poppins_600SemiBold",
  },
  webviewLoader: { flex: 1, justifyContent: "center", alignItems: "center" },
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
