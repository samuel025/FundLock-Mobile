import { resendOtp, verifyOtp } from "@/services/auth";
import { useTheme } from "@/theme";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

type Props = {
  visible: boolean;
  email: string;
  onClose: () => void;
  onVerified: () => void;
};

const RESEND_COOLDOWN_SECONDS = 120;

function formatCountdown(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function OtpVerifyModal({ visible, email, onClose, onVerified }: Props) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // Start (or restart) countdown whenever the modal is shown or email changes
  useEffect(() => {
    if (!visible) return;

    setLocalError(null);
    setOtp("");
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
  }, [visible, email]);

  // Tick countdown
  useEffect(() => {
    if (!visible) return;
    if (resendCooldown <= 0) return;

    const id = setInterval(() => {
      setResendCooldown((s) => Math.max(0, s - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [visible, resendCooldown]);

  const canSubmit = useMemo(
    () => otp.length === 7 && /^\d{7}$/.test(otp),
    [otp],
  );

  const verifyMutation = useMutation({
    mutationFn: () => verifyOtp({ email, otpCode: otp }),
    onMutate: () => setLocalError(null),
    onSuccess: () => {
      setOtp("");
      onVerified();
    },
    onError: (e: any) => setLocalError(e?.message || "Failed to verify OTP"),
  });

  const resendMutation = useMutation({
    mutationFn: () => resendOtp(email),
    onMutate: () => setLocalError(null),
    onSuccess: () => {
      // Restart the 2-min cooldown after a resend
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    },
    onError: (e: any) => setLocalError(e?.message || "Failed to resend OTP"),
  });

  const onChangeOtp = (text: string) => {
    setLocalError(null);
    const digitsOnly = text.replace(/\D/g, "").slice(0, 7);
    setOtp(digitsOnly);
  };

  const resendDisabled =
    resendCooldown > 0 || resendMutation.isPending || verifyMutation.isPending;

  const resendLabel = resendMutation.isPending
    ? "Resending..."
    : resendCooldown > 0
      ? `Resend in ${formatCountdown(resendCooldown)}`
      : "Resend OTP";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[styles.card, { backgroundColor: theme.colors.background }]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Verify your email
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
            Enter the 7-digit OTP sent to {email}
          </Text>

          <TextInput
            label="OTP (7 digits)"
            value={otp}
            onChangeText={onChangeOtp}
            keyboardType="number-pad"
            autoCapitalize="none"
            mode="outlined"
            style={[
              styles.input,
              {
                backgroundColor: isDark
                  ? theme.colors.surface
                  : theme.colors.background,
              },
            ]}
            textColor={theme.colors.text}
            outlineColor={
              isDark ? "rgba(255,255,255,0.15)" : theme.colors.border
            }
            activeOutlineColor={theme.colors.primary}
            placeholderTextColor={theme.colors.muted}
            theme={{
              colors: {
                onSurfaceVariant: theme.colors.muted, // Label color
                background: isDark
                  ? theme.colors.surface
                  : theme.colors.background,
                text: theme.colors.text,
                primary: theme.colors.primary,
                outline: isDark
                  ? "rgba(255,255,255,0.15)"
                  : theme.colors.border,
              },
            }}
            error={!!localError}
          />

          {localError ? (
            <Text style={[styles.error, { color: theme.colors.danger }]}>
              {localError}
            </Text>
          ) : null}

          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                if (resendDisabled) return;
                resendMutation.mutate();
              }}
              disabled={resendDisabled}
            >
              <Text
                style={[
                  styles.link,
                  {
                    color: resendDisabled
                      ? theme.colors.muted
                      : theme.colors.primary,
                  },
                ]}
              >
                {resendLabel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              disabled={verifyMutation.isPending}
            >
              <Text style={[styles.link, { color: theme.colors.muted }]}>
                Not now
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: canSubmit
                  ? theme.colors.primary
                  : theme.colors.border,
              },
            ]}
            disabled={!canSubmit || verifyMutation.isPending}
            onPress={() => verifyMutation.mutate()}
          >
            {verifyMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: "700" },
  subtitle: { marginTop: 6, marginBottom: 12 },
  input: { marginTop: 8 },
  error: { marginTop: 8 },
  row: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  link: { fontWeight: "600" },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
});
