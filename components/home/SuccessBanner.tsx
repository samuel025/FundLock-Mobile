import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SuccessBanner({
  message,
  onCleared,
}: {
  message: string | null | undefined;
  onCleared: () => void;
}) {
  const { theme } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isRendered, setIsRendered] = useState(false);

  const text = useMemo(() => (message ? String(message) : ""), [message]);

  useEffect(() => {
    if (!message) return;

    setIsRendered(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => dismiss(), 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const dismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setIsRendered(false);
      onCleared();
    });
  };

  if (!isRendered || !message) return null;

  return (
    <Animated.View
      style={[
        styles.successBanner,
        {
          opacity: fadeAnim,
          backgroundColor: theme.colors.card,
          shadowColor: theme.colors.success,
        },
      ]}
    >
      <View
        style={[
          styles.successBannerContent,
          {
            backgroundColor: theme.colors.successBannerBg,
            borderLeftColor: theme.colors.successBannerBorder,
          },
        ]}
      >
        <View style={styles.successBannerIconWrapper}>
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={theme.colors.success}
          />
        </View>

        <Text
          style={[
            styles.successBannerText,
            { color: theme.colors.successBannerText },
          ]}
        >
          {text}
        </Text>

        <TouchableOpacity
          onPress={dismiss}
          style={styles.successBannerClose}
          accessibilityLabel="Dismiss message"
        >
          <Ionicons name="close" size={20} color={theme.colors.success} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  successBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  successBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderLeftWidth: 4,
  },
  successBannerIconWrapper: {
    marginRight: 12,
  },
  successBannerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    lineHeight: 20,
  },
  successBannerClose: {
    padding: 4,
    marginLeft: 8,
  },
});
