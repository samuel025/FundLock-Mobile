import { authActions, useAuthStore } from "@/lib/authContext";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Index() {
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

  const handleSignOut = async () => {
    await authActions.signOut();
    router.replace("/signIn");
  };

  if (isLoadingUser) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>Welcome, {user.firstName}!</Text>
          <Text>Email: {user.email}</Text>
          <Text>Phone: {user.phone_number}</Text>
          <Button mode="contained" onPress={handleSignOut}>
            Sign Out
          </Button>
        </>
      ) : (
        <Text>Please sign in</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
