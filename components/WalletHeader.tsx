import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ActionButtons from "./ActionButtons";
import WalletCard from "./WalletCard";

interface WalletHeaderProps {
  balance: string | null;
  totalRedeemedAmount: string | null;
  totalLockedAmount: string | null;
  isLoading: boolean;
  onAddMoney: () => void;
  onWithdraw: () => void;
}

export default function WalletHeader({
  balance,
  totalRedeemedAmount,
  totalLockedAmount,
  isLoading,
  onAddMoney,
  onWithdraw,
}: WalletHeaderProps) {
  return (
    <View style={styles.topBox}>
      <LinearGradient
        colors={["#1B263B", "#415A77"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.h1}>My Wallet </Text>
          <View style={styles.notificationBox}>
            <Ionicons name="notifications" size={23} color="#FEFFFE" />
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading wallet...</Text>
          </View>
        ) : (
          <WalletCard
            totalBalance={balance ? `₦${balance}` : "₦0.00"}
            totalRedeemed={
              totalRedeemedAmount ? `₦${totalRedeemedAmount}` : "₦0.00"
            }
            lockedBalance={
              totalLockedAmount ? `₦${totalLockedAmount}` : "₦0.00"
            }
          />
        )}

        <ActionButtons onAddMoney={onAddMoney} onWithdraw={onWithdraw} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  topBox: {
    backgroundColor: "#1B263B",
    width: "100%",
  },
  h1: {
    color: "#FEFFFE",
    fontSize: 25,
    paddingTop: 7,
    fontFamily: "Poppins_500Medium",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  notificationBox: {
    backgroundColor: "rgba(56, 178, 172, 0.18)",
    borderRadius: 12,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderColor: "#38B2AC",
    borderStyle: "solid",
    borderWidth: 1,
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  gradient: {
    width: "100%",
    paddingBottom: 20,
  },
  loadingContainer: {
    backgroundColor: "rgba(72, 202, 228, 0.1)",
    alignSelf: "center",
    borderRadius: 17,
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(56, 178, 172, 0.25)",
    borderStyle: "solid",
    borderWidth: 1,
    width: "90%",
    marginBottom: 16,
    height: 120,
  },
  loadingText: {
    color: "#FEFFFE",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
});
