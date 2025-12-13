import { useCreatePin } from "@/hooks/useCreatePin";
import { useWallet } from "@/hooks/useWallet";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
  useColorScheme,
} from "react-native";

type Step = "enter" | "confirm";

export default function CreatePin() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const { hasPin } = useWallet();
  const { createPin, isCreating, pinError, pinMessage } = useCreatePin();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [step, setStep] = useState<Step>("enter");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

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

  const currentPin = step === "enter" ? pin : confirmPin;
  const setCurrentPin = step === "enter" ? setPin : setConfirmPin;

  const handleNumberPress = (num: string) => {
    if (currentPin.length < 4) {
      const newPin = currentPin + num;
      setCurrentPin(newPin);
      setError("");

      // Auto-advance when 4 digits entered
      if (newPin.length === 4) {
        if (step === "enter") {
          setTimeout(() => {
            setStep("confirm");
          }, 300);
        } else {
          // Validate match
          if (newPin === pin) {
            createPin(pin);
          } else {
            setError("PINs don't match");
            shake();
            setTimeout(() => {
              setConfirmPin("");
              setError("");
            }, 1000);
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (currentPin.length > 0) {
      setCurrentPin(currentPin.slice(0, -1));
      setError("");
    }
  };

  const handleReset = () => {
    setPin("");
    setConfirmPin("");
    setStep("enter");
    setError("");
  };

  const shake = () => {
    Vibration.vibrate(100);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <LinearGradient
      colors={
        isDark
          ? ["#0A1628", "#0D1B2A", "#1B263B"]
          : ["#FFFFFF", "#F8F9FA", "#EFF3F8"]
      }
      style={styles.container}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <LinearGradient colors={["#38B2AC", "#2C9A8F"]} style={styles.logo}>
              <Ionicons name="lock-closed" size={28} color="#FFFFFF" />
            </LinearGradient>
          </View>

          <Text
            style={[styles.title, { color: isDark ? "#FFFFFF" : "#1B263B" }]}
          >
            {step === "enter" ? "Create Your PIN" : "Confirm Your PIN"}
          </Text>
          <Text
            style={[styles.subtitle, { color: isDark ? "#8B9DC3" : "#778DA9" }]}
          >
            {step === "enter"
              ? "You'll need to enter your PIN twice for confirmation"
              : "Enter your PIN again to confirm"}
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View
            style={[
              styles.progressLine,
              {
                backgroundColor:
                  step === "confirm"
                    ? "#38B2AC"
                    : isDark
                    ? "#415A77"
                    : "#E2E8F0",
              },
            ]}
          />
          <View
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  step === "confirm"
                    ? "#38B2AC"
                    : isDark
                    ? "#1B263B"
                    : "#F1F5F9",
                borderColor:
                  step === "confirm"
                    ? "#38B2AC"
                    : isDark
                    ? "#415A77"
                    : "#CBD5E1",
              },
              step === "confirm" && styles.progressDotActive,
            ]}
          />
        </View>

        {/* Success/Error Messages */}
        {pinMessage && (
          <Animated.View
            style={[
              styles.messageBox,
              {
                backgroundColor: isDark
                  ? "rgba(16, 185, 129, 0.15)"
                  : "rgba(16, 185, 129, 0.1)",
                borderLeftColor: "#10B981",
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text
              style={[
                styles.successText,
                { color: isDark ? "#D1FAE5" : "#065F46" },
              ]}
            >
              {pinMessage}
            </Text>
          </Animated.View>
        )}

        {error && (
          <Animated.View
            style={[
              styles.messageBox,
              {
                backgroundColor: isDark
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(239, 68, 68, 0.1)",
                borderLeftColor: "#EF4444",
                transform: [{ translateX: shakeAnim }],
              },
            ]}
          >
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text
              style={[
                styles.errorText,
                { color: isDark ? "#FECACA" : "#991B1B" },
              ]}
            >
              {error}
            </Text>
          </Animated.View>
        )}

        {pinError && (
          <Animated.View
            style={[
              styles.messageBox,
              {
                backgroundColor: isDark
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(239, 68, 68, 0.1)",
                borderLeftColor: "#EF4444",
              },
            ]}
          >
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text
              style={[
                styles.errorText,
                { color: isDark ? "#FECACA" : "#991B1B" },
              ]}
            >
              {pinError}
            </Text>
          </Animated.View>
        )}

        {/* PIN Dots Display */}
        <View style={styles.pinDotsContainer}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < currentPin.length;
            const isActive = index === currentPin.length;

            return (
              <Animated.View
                key={index}
                style={[
                  styles.pinDot,
                  {
                    backgroundColor: isDark ? "#1B263B" : "#F1F5F9",
                    borderColor: error
                      ? "#EF4444"
                      : isFilled
                      ? "#38B2AC"
                      : isDark
                      ? "#415A77"
                      : "#CBD5E1",
                  },
                  isFilled && styles.pinDotFilled,
                  isActive && styles.pinDotActive,
                  error && styles.pinDotError,
                ]}
              >
                {isFilled && (
                  <View
                    style={[
                      styles.pinDotInner,
                      {
                        backgroundColor: isDark ? "#FFFFFF" : "#1B263B",
                      },
                    ]}
                  />
                )}
              </Animated.View>
            );
          })}
        </View>

        {/* Keypad */}
        <View style={styles.keypad}>
          <View style={styles.keypadRow}>
            {["1", "2", "3"].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.keypadButton,
                  {
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "#FFFFFF",
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "#E2E8F0",
                  },
                ]}
                onPress={() => handleNumberPress(num)}
                disabled={isCreating}
              >
                <Text
                  style={[
                    styles.keypadNumber,
                    {
                      color: isDark ? "#FFFFFF" : "#1B263B",
                    },
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            {["4", "5", "6"].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.keypadButton,
                  {
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "#FFFFFF",
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "#E2E8F0",
                  },
                ]}
                onPress={() => handleNumberPress(num)}
                disabled={isCreating}
              >
                <Text
                  style={[
                    styles.keypadNumber,
                    {
                      color: isDark ? "#FFFFFF" : "#1B263B",
                    },
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            {["7", "8", "9"].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.keypadButton,
                  {
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "#FFFFFF",
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "#E2E8F0",
                  },
                ]}
                onPress={() => handleNumberPress(num)}
                disabled={isCreating}
              >
                <Text
                  style={[
                    styles.keypadNumber,
                    {
                      color: isDark ? "#FFFFFF" : "#1B263B",
                    },
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={[
                styles.keypadButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "#FFFFFF",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0",
                  opacity:
                    isCreating || (step === "enter" && pin.length === 0)
                      ? 0.4
                      : 1,
                },
              ]}
              onPress={handleReset}
              disabled={isCreating || (step === "enter" && pin.length === 0)}
            >
              <Ionicons name="refresh" size={24} color="#778DA9" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.keypadButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "#FFFFFF",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0",
                },
              ]}
              onPress={() => handleNumberPress("0")}
              disabled={isCreating}
            >
              <Text
                style={[
                  styles.keypadNumber,
                  {
                    color: isDark ? "#FFFFFF" : "#1B263B",
                  },
                ]}
              >
                0
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.keypadButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "#FFFFFF",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0",
                  opacity: isCreating || currentPin.length === 0 ? 0.4 : 1,
                },
              ]}
              onPress={handleDelete}
              disabled={isCreating || currentPin.length === 0}
            >
              <Ionicons name="backspace-outline" size={24} color="#778DA9" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer hint */}
        <View style={styles.footer}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#778DA9"
          />
          <Text
            style={[
              styles.footerText,
              { color: isDark ? "#778DA9" : "#64748B" },
            ]}
          >
            Your PIN is encrypted and stored securely
          </Text>
        </View>

        {/* Loading Overlay */}
        {isCreating && (
          <View
            style={[
              styles.loadingOverlay,
              {
                backgroundColor: isDark
                  ? "rgba(10, 22, 40, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
              },
            ]}
          >
            <View style={styles.loadingBox}>
              <Ionicons name="lock-closed" size={32} color="#38B2AC" />
              <Text
                style={[
                  styles.loadingText,
                  {
                    color: isDark ? "#FFFFFF" : "#1B263B",
                  },
                ]}
              >
                Securing your PIN...
              </Text>
            </View>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoWrapper: {
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontFamily: "Poppins_700Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  progressDotActive: {
    backgroundColor: "#38B2AC",
    borderColor: "#38B2AC",
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  progressLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    gap: 10,
    borderLeftWidth: 3,
  },
  successText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },
  pinDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 48,
    gap: 20,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  pinDotFilled: {
    borderColor: "#38B2AC",
  },
  pinDotActive: {
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 4,
  },
  pinDotError: {
    borderColor: "#EF4444",
  },
  pinDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  keypad: {
    gap: 16,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  keypadButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  keypadNumber: {
    fontSize: 28,
    fontFamily: "Poppins_600SemiBold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBox: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});
