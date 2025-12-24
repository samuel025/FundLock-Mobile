import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export function OfflineBanner() {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const { theme, scheme } = useTheme();
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const isOffline = isConnected === false || isInternetReachable === false;
  const isDark = scheme === "dark";

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOffline ? 0 : -60,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOffline, slideAnim]);

  if (!isOffline) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          backgroundColor: isDark ? "#7F1D1D" : "#FEE2E2",
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name="cloud-offline-outline"
          size={18}
          color={isDark ? "#FECACA" : "#991B1B"}
        />
        <Text style={[styles.text, { color: isDark ? "#FECACA" : "#991B1B" }]}>
          No internet connection
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: Platform.select({
      ios: 50,
      android: (StatusBar.currentHeight || 0) + 8,
    }),
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },
});
