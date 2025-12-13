import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeHeader({
  firstName,
  onPressProfile,
}: {
  firstName?: string;
  onPressProfile?: () => void;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.greeting, { color: theme.colors.muted }]}>
          Good Morning
        </Text>
        <Text style={[styles.userName, { color: theme.colors.text }]}>
          {firstName ?? ""}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={onPressProfile}
        accessibilityLabel="Open profile"
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primary]}
          style={styles.profileGradient}
        >
          <Ionicons name="person" size={24} color={theme.colors.balanceText} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: (StatusBar.currentHeight || 0) + 5,
    }),
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  userName: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginTop: 4,
  },
  profileButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  profileGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
