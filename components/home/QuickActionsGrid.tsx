import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Action = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  onPress: () => void;
};

export default function QuickActionsGrid({
  actions,
  title = "Quick Actions",
}: {
  actions: Action[];
  title?: string;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.quickActions}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>

      <View style={styles.actionsRow}>
        {actions.map((a) => (
          <TouchableOpacity
            key={a.key}
            style={styles.actionCard}
            onPress={a.onPress}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: a.iconBg }]}>
              <Ionicons name={a.icon} size={24} color={a.iconColor} />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.muted }]}>
              {a.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  actionCard: {
    width: "30%",
    alignItems: "center",
    marginRight: "3.33%",
    marginBottom: 12,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
  },
});
