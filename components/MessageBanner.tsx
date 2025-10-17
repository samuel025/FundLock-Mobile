import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function MessageBanner({
  message,
  type = "info",
  onClose,
}: {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}) {
  if (!message) return null;
  return (
    <View
      style={[
        styles.banner,
        type === "success"
          ? styles.success
          : type === "error"
          ? styles.error
          : styles.info,
      ]}
    >
      <Text style={styles.text}>{message}</Text>
      {onClose && (
        <Text style={styles.close} onPress={onClose}>
          ×
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  success: { backgroundColor: "#E7F6F2" },
  error: { backgroundColor: "#FEE2E2" },
  info: { backgroundColor: "#E0E7FF" },
  text: {
    fontFamily: "Poppins_500Medium",
    color: "#1B263B",
    fontSize: 15,
    flex: 1,
  },
  close: {
    marginLeft: 12,
    fontSize: 18,
    color: "#415A77",
    fontWeight: "bold",
    paddingHorizontal: 8,
  },
});
