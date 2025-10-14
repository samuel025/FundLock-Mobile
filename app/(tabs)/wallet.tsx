import TransactionList from "@/components/TransactionList";
import WalletHeader from "@/components/WalletHeader";
import { useWallet } from "@/hooks/useWallet";
import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Wallet() {
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const [refreshing, setRefreshing] = useState(false);

  const {
    balance,
    totalLockedAmount,
    totalRedeemedAmount,
    isLoadingWallet,
    transactions,
    isLoadingTransactions,
    fetchWalletData,
  } = useWallet();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleSignOut = async () => {
    await authActions.signOut();
    router.replace("/signIn");
  };

  const handleAddMoney = () => {
    console.log("Add Money pressed");
  };

  const handleWithdraw = () => {
    console.log("Withdraw pressed");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await authActions.getUser();
      fetchWalletData();
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (!fontsLoaded || (isLoadingUser && !user)) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#38B2AC"]}
          tintColor="#38B2AC"
        />
      }
    >
      <View style={styles.container}>
        {user ? (
          <View style={styles.contentContainer}>
            <WalletHeader
              balance={balance}
              totalRedeemedAmount={totalRedeemedAmount}
              totalLockedAmount={totalLockedAmount}
              isLoading={isLoadingWallet}
              onAddMoney={handleAddMoney}
              onWithdraw={handleWithdraw}
            />

            <View style={styles.elevatedBox}>
              <Text style={styles.elevatedBoxTitle}>Transactions</Text>

              <ScrollView
                style={styles.transactionScrollView}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <TransactionList
                  transactions={transactions}
                  isLoading={isLoadingTransactions}
                />
              </ScrollView>

              <Button
                mode="contained"
                onPress={handleSignOut}
                style={styles.button}
                buttonColor="#38B2AC"
              >
                Sign Out
              </Button>
            </View>
          </View>
        ) : (
          <Text>Please sign in</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  contentContainer: {
    width: "100%",
    paddingBottom: 380,
  },
  button: {
    marginTop: 30,
    paddingVertical: 4,
  },
  elevatedBox: {
    position: "absolute",
    left: "5%",
    right: "5%",
    top: "95%",
    backgroundColor: "#F8F9FA",
    borderRadius: 30,
    padding: 20,
    shadowColor: "#1B263B",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 2,
    borderColor: "rgba(56, 178, 172, 0.25)",
    height: 400, // Fixed height instead of minHeight
  },
  elevatedBoxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1B263B",
    fontFamily: "Poppins_600SemiBold",
  },
  transactionScrollView: {
    flex: 1, // Takes remaining space between title and button
    marginBottom: 10,
  },
});
