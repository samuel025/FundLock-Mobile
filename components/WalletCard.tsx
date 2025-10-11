import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface WalletCardProps {
  totalBalance: string;
  availableBalance: string;
  lockedBalance: string;
}

export default function WalletCard({
  totalBalance = "₦1000",
  availableBalance = "500.00",
  lockedBalance = "500.00",
}: WalletCardProps) {
  return (
    <View style={styles.mainSubWalletDetailsBox}>
      <View style={styles.walletBlock}>
        <View style={styles.balanceDetails}>
          <Text style={[styles.textFeint]}>Total Wallet Balance</Text>
          <Text style={styles.text}>{totalBalance}</Text>
        </View>
        <View style={styles.walletBox}>
          <FontAwesome5 name="wallet" size={23} color="#FEFFFE" />
        </View>
      </View>

      <View style={styles.walletBlock}>
        <View style={styles.subWalletDetailsBox}>
          <View style={styles.balanceDetails}>
            <Text style={[styles.textFeintSub]}>Available</Text>
            <Text style={styles.textSub}>{availableBalance}</Text>
          </View>
        </View>

        <View style={styles.subWalletDetailsBox}>
          <View style={styles.balanceDetails}>
            <Text style={[styles.textFeintSub]}>Locked</Text>
            <Text style={styles.textSub}>{lockedBalance}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#FEFFFE",
    fontSize: 30,
    fontFamily: "Poppins_600SemiBold",
  },
  textFeint: {
    paddingTop: 2,
    fontSize: 13,
    color: "#8ECAE6",
    fontFamily: "Poppins_400Regular",
  },
  textSub: {
    color: "#FEFFFE",
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
  },
  textFeintSub: {
    paddingTop: 2,
    fontSize: 13,
    color: "#8ECAE6",
    fontFamily: "Poppins_400Regular",
  },
  mainSubWalletDetailsBox: {
    backgroundColor: "rgba(72, 202, 228, 0.1)", // aqua
    alignSelf: "center",
    borderRadius: 17,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(56, 178, 172, 0.25)", // teal border
    borderStyle: "solid",
    borderWidth: 1,
    width: "90%",
    alignContent: "center",
    marginBottom: 16,
    shadowColor: "#1B263B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  subWalletDetailsBox: {
    backgroundColor: "rgba(142, 202, 230, 0.1)", // lighter aqua
    borderRadius: 17,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 50,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(72, 202, 228, 0.2)", // aqua border
    borderStyle: "solid",
    borderWidth: 0.5,
  },
  walletBox: {
    backgroundColor: "rgba(56, 178, 172, 0.18)", // teal
    borderRadius: 14,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    borderColor: "#38B2AC", // teal
    borderStyle: "solid",
    borderWidth: 0.8,
    shadowColor: "#38B2AC", // teal
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  balanceDetails: {},
  walletBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "85%",
    marginBottom: 10,
  },
});
