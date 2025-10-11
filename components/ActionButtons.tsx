import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionButtonsProps {
  onAddMoney: () => void;
  onWithdraw: () => void;
}

export default function ActionButtons({
  onAddMoney,
  onWithdraw,
}: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onAddMoney}>
        <View style={styles.iconContainer}>
          <Ionicons name="add" size={24} color="white" />
        </View>
        <Text style={styles.buttonText}>Add Money</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onWithdraw}>
        <View style={styles.iconContainer}>
          <Ionicons name="arrow-up-outline" size={22} color="white" />
        </View>
        <Text style={styles.buttonText}>Withdraw</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "92%",
    paddingHorizontal: 5,
    paddingBottom: 25,
    alignSelf: "center",
    marginTop: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(72, 202, 228, 0.15)", // aqua
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: "48%", // Almost half of the container width with some spacing
    borderWidth: 1,
    borderColor: "rgba(56, 178, 172, 0.25)", // teal border
    shadowColor: "#1B263B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 7,
  },
  iconContainer: {
    backgroundColor: "rgba(56, 178, 172, 0.18)", // teal
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 0.8,
    borderColor: "#38B2AC", // teal
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
});
