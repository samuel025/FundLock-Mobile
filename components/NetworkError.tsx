import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
  isFullScreen?: boolean;
}

export function NetworkError({
  onRetry,
  message = "Please check your internet connection and try again.",
  isFullScreen = true,
}: NetworkErrorProps) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const content = (
    <View style={styles.content}>
      {/* Icon Container */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDark
              ? "rgba(239, 68, 68, 0.15)"
              : "rgba(239, 68, 68, 0.1)",
          },
        ]}
      >
        <Ionicons
          name="cloud-offline-outline"
          size={64}
          color={theme.colors.danger}
        />
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: theme.colors.text }]}>
        No Internet Connection
      </Text>

      {/* Message */}
      <Text style={[styles.message, { color: theme.colors.muted }]}>
        {message}
      </Text>

      {/* Tips */}
      <View
        style={[
          styles.tipsContainer,
          {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.03)",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.05)",
          },
        ]}
      >
        <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
          Try these steps:
        </Text>
        <View style={styles.tipItem}>
          <Ionicons name="wifi" size={16} color={theme.colors.muted} />
          <Text style={[styles.tipText, { color: theme.colors.muted }]}>
            Check your Wi-Fi or mobile data
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="airplane" size={16} color={theme.colors.muted} />
          <Text style={[styles.tipText, { color: theme.colors.muted }]}>
            Turn off Airplane mode
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="refresh" size={16} color={theme.colors.muted} />
          <Text style={[styles.tipText, { color: theme.colors.muted }]}>
            Restart your router or device
          </Text>
        </View>
      </View>

      {/* Retry Button */}
      {onRetry && (
        <TouchableOpacity
          style={[
            styles.retryButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (!isFullScreen) {
    return <View style={styles.inlineContainer}>{content}</View>;
  }

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
      {content}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.select({
      ios: 60,
      android: (StatusBar.currentHeight || 0) + 20,
    }),
  },
  inlineContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  tipsContainer: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    flex: 1,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});
