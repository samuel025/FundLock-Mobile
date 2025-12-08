import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function EmptyBudgets() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.icon,
          { backgroundColor: theme.colors.actionIconLockBg },
        ]}
      >
        <Ionicons
          name="pie-chart-outline"
          size={40}
          color={theme.colors.muted}
        />
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        No Active Budgets
      </Text>
      <Text style={[styles.text, { color: theme.colors.muted }]}>
        Start budgeting by creating your first category allocation
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/budget")}
      >
        <LinearGradient
          colors={[theme.colors.primary, "#2C9A92"]}
          style={styles.buttonGradient}
        >
          <Ionicons name="add-circle-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Create Budget</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    maxWidth: 240,
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },
});
