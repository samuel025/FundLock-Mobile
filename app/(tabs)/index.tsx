import ActionButtons from "@/components/ActionButtons";
import WalletCard from "@/components/WalletCard";
import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Index() {
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const [refreshing, setRefreshing] = useState(false);

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
    // Navigate to add money screen or open modal
    // router.push("/addMoney");
  };

  const handleWithdraw = () => {
    console.log("Withdraw pressed");
    // Navigate to withdraw screen or open modal
    // router.push("/withdraw");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await authActions.getUser();
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
          colors={["#38B2AC"]} // Android
          tintColor="#38B2AC" // iOS
        />
      }
    >
      <View style={styles.container}>
        {user ? (
          // <>
          //   <Text variant="headlineMedium" style={styles.welcomeText}>
          //     Welcome, {user.firstName}!
          //   </Text>
          //   <Text variant="bodyLarge" style={styles.infoText}>
          //     Email: {user.email}
          //   </Text>
          //   <Text variant="bodyLarge" style={styles.infoText}>
          //     Phone: {user.phone_number}
          //   </Text>
          //   <Button
          //     mode="contained"
          //     onPress={handleSignOut}
          //     style={styles.button}
          //     buttonColor="#09A674"
          //   >
          //     Sign Out
          //   </Button>
          // </>
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

              <WalletCard
                totalBalance="₦1000"
                availableBalance="₦500.00"
                lockedBalance="₦500.00"
              />

              <ActionButtons
                onAddMoney={handleAddMoney}
                onWithdraw={handleWithdraw}
              />
            </LinearGradient>

            <View style={styles.elevatedBox}>
              <Text style={styles.elevatedBoxTitle}>Quick Actions</Text>
              <View style={styles.quickActionsContainer}>
                <View style={styles.actionItem}>
                  <Ionicons name="send" size={24} color="#1B263B" />
                  <Text style={styles.actionText}>Send</Text>
                </View>
                <View style={styles.actionItem}>
                  <Ionicons name="trending-up" size={24} color="#1B263B" />
                  <Text style={styles.actionText}>Invest</Text>
                </View>
                <View style={styles.actionItem}>
                  <Ionicons name="card" size={24} color="#1B263B" />
                  <Text style={styles.actionText}>Cards</Text>
                </View>
              </View>

              <Button
                mode="contained"
                onPress={handleSignOut}
                style={styles.button}
                buttonColor="#38B2AC" // teal
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
  },
  welcomeText: {
    marginBottom: 20,
    fontWeight: "bold",
  },
  infoText: {
    marginBottom: 10,
  },
  button: {
    marginTop: 30,
    paddingVertical: 4,
  },
  topBox: {
    backgroundColor: "#1B263B",
    width: "100%",
    position: "relative", // Important for absolute positioning
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
    backgroundColor: "rgba(56, 178, 172, 0.18)", // teal
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
    paddingBottom: 20, // Increase padding to make room for overlapping box
  },
  elevatedBox: {
    position: "absolute",
    left: "5%",
    right: "5%",
    bottom: -190,
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
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
    borderColor: "rgba(56, 178, 172, 0.25)", // teal border
  },
  elevatedBoxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1B263B",
    fontFamily: "Poppins_600SemiBold",
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionItem: {
    flex: 1,
    alignItems: "center",
  },
  actionText: {
    marginTop: 5,
    color: "#415A77",
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
});
