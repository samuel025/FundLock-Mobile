import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface GradientButtonProps {
  onPress: () => void;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  colors?: [string, string];
}

export function GradientButton({
  onPress,
  label,
  icon,
  disabled = false,
  colors = ["#38B2AC", "#2C9A92"],
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradient colors={colors} style={styles.gradient}>
        <Text style={styles.label}>{label}</Text>
        {icon && <Ionicons name={icon} size={18} color="#fff" />}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  disabled: {
    opacity: 0.6,
  },
  gradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
  },
  label: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
});
