import { authActions } from "@/lib/authContext";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // Initialize auth state from SecureStore when app starts
    authActions.initializeAuth();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="signUp" options={{ headerShown: false }} />
      <Stack.Screen name="signIn" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
