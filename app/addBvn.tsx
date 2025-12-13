import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
import { updateBvn } from "@/services/bvn";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

export default function AddBvn() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const user = useAuthStore((state) => state.user);

  const [bvn, setBvn] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBvnChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, 11);
    setBvn(cleaned);
    setError("");
  };

  const validateBvn = () => {
    if (!bvn) {
      setError("BVN is required");
      return false;
    }
    if (bvn.length !== 11) {
      setError("BVN must be exactly 11 digits");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateBvn()) return;
    setIsSubmitting(true);
    try {
      await updateBvn(bvn);
      // Refresh user data to get updated profile
      await authActions.getUser();
      Alert.alert("Success", "Your BVN has been added successfully", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/accountActions"),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to update BVN");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputTheme = {
    roundness: 12,
    colors: {
      primary: theme.colors.primary,
      outline: theme.colors.border,
      placeholder: theme.colors.muted,
      text: theme.colors.text,
      onSurfaceVariant: theme.colors.muted,
      background: theme.colors.surface,
      onSurface: theme.colors.text,
    },
  };

  return (
    <LinearGradient
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      style={styles.container}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={[
                  styles.backButton,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>

            {/* Icon and Title */}
            <View style={styles.titleSection}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.accent]}
                  style={styles.iconGradient}
                >
                  <Ionicons name="shield-checkmark" size={40} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Add Your BVN
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
                Your Bank Verification Number helps us verify your identity and
                keep your account secure.
              </Text>
            </View>

            {/* Info Card */}
            <View
              style={[
                styles.infoCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <View style={styles.infoRow}>
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.infoText, { color: theme.colors.muted }]}>
                  Your BVN is safe with us and will not be shared with third
                  parties.
                </Text>
              </View>
            </View>

            {/* Form Card */}
            <View
              style={[
                styles.formCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text style={[styles.formTitle, { color: theme.colors.text }]}>
                Bank Verification Number
              </Text>

              <TextInput
                mode="outlined"
                label="Enter 11-digit BVN"
                value={bvn}
                onChangeText={handleBvnChange}
                keyboardType="number-pad"
                maxLength={11}
                style={styles.input}
                theme={inputTheme}
                error={!!error}
                left={
                  <TextInput.Icon
                    icon="shield-account"
                    color={theme.colors.primary}
                  />
                }
              />

              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : (
                <Text
                  style={[styles.helperText, { color: theme.colors.muted }]}
                >
                  Dial *565*0# to get your BVN if you don&apos;t know it
                </Text>
              )}

              {/* Current BVN Status */}
              {user?.bvn && (
                <View style={styles.statusCard}>
                  <View style={styles.statusRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={theme.colors.success}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: theme.colors.success },
                      ]}
                    >
                      BVN already linked
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!bvn || bvn.length !== 11 || isSubmitting) &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!bvn || bvn.length !== 11 || isSubmitting}
            >
              <LinearGradient
                colors={
                  !bvn || bvn.length !== 11 || isSubmitting
                    ? ["#CBD5E1", "#94A3B8"]
                    : [theme.colors.primary, theme.colors.accent]
                }
                style={styles.submitButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isSubmitting ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.submitButtonText}>Updating...</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Add BVN</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Security Note */}
            <View style={styles.securityNote}>
              <Ionicons
                name="lock-closed"
                size={16}
                color={theme.colors.muted}
              />
              <Text
                style={[styles.securityText, { color: theme.colors.muted }]}
              >
                All data is encrypted and secure
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: (StatusBar.currentHeight || 0) + 16,
    }),
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  iconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  infoCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    lineHeight: 20,
  },
  formCard: {
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    backgroundColor: "transparent",
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#DC2626",
    marginTop: 8,
  },
  helperText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: 8,
    lineHeight: 18,
  },
  statusCard: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  statusSubtext: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginLeft: 28,
  },
  submitButton: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    shadowOpacity: 0.05,
    elevation: 1,
  },
  submitButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },
  securityNote: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  securityText: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
  },
});
