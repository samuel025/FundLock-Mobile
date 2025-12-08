import { useTheme } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DecorativeBackground } from "./DecorativeBackground";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { scheme } = useTheme();
  const isDark = scheme === "dark";

  const gradientColors = useMemo(
    () =>
      isDark
        ? ([
            "#050B1A",
            "#0B1020",
            "#0D1428",
            "#1A0B2E",
            "#0F1724",
            "#0B1020",
          ] as const)
        : ([
            "#FAFBFC",
            "#F0F9FF",
            "#EFF6FF",
            "#F5F3FF",
            "#FAF5FF",
            "#FEFCE8",
            "#FEF3F2",
            "#FAFBFC",
          ] as const),
    [isDark]
  );

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <DecorativeBackground />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {!isDark && <View style={styles.vignette} pointerEvents="none" />}

      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          keyboardVerticalOffset={
            Platform.OS === "ios" ? 0 : StatusBar.currentHeight ?? 0
          }
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
});
