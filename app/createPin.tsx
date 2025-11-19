import { Ionicons } from "@expo/vector-icons";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
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
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native-paper";
import * as yup from "yup";
import { useWallet } from "@/hooks/useWallet";
import { useCreatePin } from "@/hooks/useCreatePin";

const schema = yup.object({
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be exactly 4 digits")
    .required("PIN is required"),
  confirmPin: yup
    .string()
    .oneOf([yup.ref("pin")], "PINs must match")
    .required("Please confirm PIN"),
});

type FormData = yup.InferType<typeof schema>;

export default function CreatePin() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { hasPin } = useWallet();
  const { createPin, isCreating, pinError, pinMessage } = useCreatePin();

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { pin: "", confirmPin: "" },
  });

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (hasPin) {
      router.replace("/(tabs)");
    }
  }, [hasPin]);

  const onSubmit = (data: FormData) => {
    createPin(data.pin);
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={["#0D1B2A", "#1B263B", "#415A77"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS === "ios" ? 0 : (StatusBar.currentHeight ?? 0)
        }
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Branding */}
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={["#38B2AC", "#2C9A8F"]}
                style={styles.logoCircle}
              >
                <Ionicons name="shield-checkmark" size={40} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.brandName}>FundLock</Text>
              <Text style={styles.tagline}>Secure Your Wallet</Text>
            </View>

            {/* Feedback banners */}
            {pinMessage && (
              <View style={[styles.banner, styles.bannerSuccess]}>
                <Ionicons name="checkmark-circle" size={20} color="#38B2AC" />
                <Text style={styles.bannerText}>{pinMessage}</Text>
                <TouchableOpacity
                  onPress={() => {
                    reset({ pin: "", confirmPin: "" });
                    router.replace("/(tabs)");
                  }}
                >
                  <Ionicons name="arrow-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            )}
            {pinError && (
              <View style={[styles.banner, styles.bannerError]}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <Text style={styles.bannerText}>{pinError}</Text>
                <TouchableOpacity onPress={() => reset()}>
                  <Ionicons name="refresh" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            )}

            {/* Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Create Your PIN</Text>
              <Text style={styles.cardSubtitle}>
                This 4-digit PIN will be required for locking funds, spending,
                and deposits.
              </Text>

              <Controller
                control={control}
                name="pin"
                render={({ field: { onChange, value }, fieldState }) => (
                  <View style={styles.inputGroup}>
                    <TextInput
                      label="PIN"
                      mode="outlined"
                      value={value}
                      onChangeText={(t) =>
                        onChange(t.replace(/[^0-9]/g, "").slice(0, 4))
                      }
                      keyboardType="number-pad"
                      secureTextEntry
                      maxLength={4}
                      theme={{
                        roundness: 12,
                        colors: {
                          primary: "#38B2AC",
                          outline: fieldState.error ? "#DC2626" : "#E9ECEF",
                        },
                        fonts: {
                          regular: { fontFamily: "Poppins_500Medium" },
                        },
                      }}
                      style={styles.input}
                      outlineStyle={styles.inputOutline}
                    />
                    {fieldState.error && (
                      <Text style={styles.inputError}>
                        {fieldState.error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="confirmPin"
                render={({ field: { onChange, value }, fieldState }) => (
                  <View style={styles.inputGroup}>
                    <TextInput
                      label="Confirm PIN"
                      mode="outlined"
                      value={value}
                      onChangeText={(t) =>
                        onChange(t.replace(/[^0-9]/g, "").slice(0, 4))
                      }
                      keyboardType="number-pad"
                      secureTextEntry
                      maxLength={4}
                      theme={{
                        roundness: 12,
                        colors: {
                          primary: "#38B2AC",
                          outline: fieldState.error ? "#DC2626" : "#E9ECEF",
                        },
                        fonts: {
                          regular: { fontFamily: "Poppins_500Medium" },
                        },
                      }}
                      style={styles.input}
                      outlineStyle={styles.inputOutline}
                    />
                    {fieldState.error && (
                      <Text style={styles.inputError}>
                        {fieldState.error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  (!isValid || isCreating) && styles.actionButtonDisabled,
                ]}
                disabled={!isValid || isCreating}
                onPress={handleSubmit(onSubmit)}
              >
                <LinearGradient
                  colors={
                    isValid && !isCreating
                      ? ["#38B2AC", "#2C9A8F"]
                      : ["#8B9DC3", "#778DA9"]
                  }
                  style={styles.actionGradient}
                >
                  <Text style={styles.actionText}>
                    {isCreating ? "Creating..." : "Save PIN"}
                  </Text>
                  <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 36,
  },
  logoCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  brandName: {
    fontSize: 30,
    fontFamily: "Poppins_700Bold",
    color: "#FFFFFF",
    marginTop: 16,
    lineHeight: 44,
    includeFontPadding: false,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#8B9DC3",
    marginTop: 6,
    lineHeight: 20,
    includeFontPadding: false,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  bannerSuccess: {
    backgroundColor: "rgba(56,178,172,0.15)",
    borderLeftWidth: 4,
    borderLeftColor: "#38B2AC",
  },
  bannerError: {
    backgroundColor: "rgba(220,38,38,0.15)",
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: "#E7F6F2",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#1B263B",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: { marginBottom: 20 },
  input: { backgroundColor: "#F8F9FA", fontSize: 14 },
  inputOutline: { borderWidth: 1.4 },
  inputError: {
    color: "#DC2626",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: 6,
    marginLeft: 4,
    lineHeight: 18,
    includeFontPadding: false,
  },
  actionButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 8,
  },
  actionButtonDisabled: { opacity: 0.6 },
  actionGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});
