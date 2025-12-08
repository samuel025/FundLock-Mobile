import { useTheme } from "@/theme";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface GlassProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  radius?: number;
}

export function Glass({ children, style, radius = 12 }: GlassProps) {
  const { scheme } = useTheme();
  const isDark = scheme === "dark";

  if (!isDark) {
    return <View style={style}>{children}</View>;
  }

  return (
    <View
      style={[
        style,
        {
          position: "relative",
          overflow: "hidden",
          borderRadius: radius,
          backgroundColor: "rgba(255,255,255,0.05)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.10)",
        },
      ]}
    >
      <BlurView
        intensity={30}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </View>
  );
}
