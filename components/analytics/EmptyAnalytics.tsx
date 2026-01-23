import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyAnalyticsProps {
  month: string;
  year: number;
}

export function EmptyAnalytics({ month, year }: EmptyAnalyticsProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.icon,
          { backgroundColor: theme.colors.actionIconLockBg },
        ]}
      >
        <Ionicons
          name="bar-chart-outline"
          size={48}
          color={theme.colors.muted}
        />
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        No Data Available
      </Text>
      <Text style={[styles.text, { color: theme.colors.muted }]}>
        You don&apos;t have any budget activity for {month} {year}. Start
        budgeting to see your analytics here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
});
