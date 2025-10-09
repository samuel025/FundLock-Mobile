import { useAuthStore } from "@/lib/authContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

  if (isLoadingUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#09A674" />
      </View>
    );
  }

  return <Redirect href={user ? "/(tabs)" : "/signIn"} />;
}
