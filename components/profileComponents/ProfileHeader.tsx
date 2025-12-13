import { useTheme } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function ProfileHeader({
  initials,
  firstName,
  lastName,
  email,
  subtitle,
}: {
  initials: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  subtitle?: string | null;
}) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  const mono = (initials || "U").slice(0, 2).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {/* Outer gradient ring */}
        <LinearGradient
          colors={
            isDark
              ? ["rgba(255,255,255,0.25)", "rgba(255,255,255,0.08)"]
              : [theme.colors.primary, theme.colors.accent]
          }
          style={styles.avatarOuterRing}
        >
          {/* Inner subtle ring */}
          <View
            style={[
              styles.avatarInnerRing,
              {
                borderColor: isDark
                  ? "rgba(255,255,255,0.18)"
                  : theme.colors.border,
                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#FFFFFF",
              },
            ]}
          >
            {/* Monogram circle */}
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.06)"]
                  : ["#F7FAFC", "#EDF2F7"]
              }
              style={styles.avatar}
            >
              <Text
                style={[
                  styles.initials,
                  { color: isDark ? "#FFFFFF" : theme.colors.text },
                ]}
              >
                {mono}
              </Text>
            </LinearGradient>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.name, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {name || "—"}
        </Text>
        {email ? (
          <Text
            style={[styles.email, { color: theme.colors.muted }]}
            numberOfLines={1}
          >
            {email}
          </Text>
        ) : null}
        {subtitle ? (
          <Text
            style={[styles.subtitle, { color: theme.colors.muted }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const AVATAR_SIZE = 56;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  avatarWrapper: {
    width: AVATAR_SIZE + 10,
    height: AVATAR_SIZE + 10,
    borderRadius: (AVATAR_SIZE + 10) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOuterRing: {
    width: AVATAR_SIZE + 10,
    height: AVATAR_SIZE + 10,
    borderRadius: (AVATAR_SIZE + 10) / 2,
    padding: 2,
  },
  avatarInnerRing: {
    borderWidth: 1,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    padding: 2,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  initials: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  email: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    marginTop: 2,
  },
});
