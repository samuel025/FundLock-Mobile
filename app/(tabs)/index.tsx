import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
import { router } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Index() {
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const [refreshing, setRefreshing] = useState(false);

  const handleSignOut = async () => {
    await authActions.signOut();
    router.replace("/signIn");
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

  if (isLoadingUser && !user) {
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
          colors={["#09A674"]} // Android
          tintColor="#09A674" // iOS
        />
      }
    >
      <View style={styles.container}>
        {user ? (
          <>
            <Text variant="headlineMedium" style={styles.welcomeText}>
              Welcome, {user.firstName}!
            </Text>
            <Text variant="bodyLarge" style={styles.infoText}>
              Email: {user.email}
            </Text>
            <Text variant="bodyLarge" style={styles.infoText}>
              Phone: {user.phone_number}
            </Text>
            <Button
              mode="contained"
              onPress={handleSignOut}
              style={styles.button}
              buttonColor="#09A674"
            >
              Sign Out
            </Button>
          </>
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
    padding: 16,
    justifyContent: "center",
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
});
