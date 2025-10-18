import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function ProfileHeader({
  initials,
  firstName,
  lastName,
  email,
}: {
  initials: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.profileInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.name}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  profileInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
  },
  avatarText: { fontFamily: "Poppins_700Bold", color: "#1B263B", fontSize: 26 },
  name: { fontFamily: "Poppins_600SemiBold", color: "#1B263B", fontSize: 16 },
  email: {
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    fontSize: 13,
    marginTop: 4,
  },
});
