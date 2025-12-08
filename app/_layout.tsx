import { AnimatedSplash } from "@/components/AnimatedSplash";
import { authActions } from "@/lib/authContext";
import {
  initializeNotificationListeners,
  registerForPushNotificationsAsync,
} from "@/lib/pushNotifications";
import { useAuthStore } from "@/lib/useAuthStore";
import { registerExpoPushToken } from "@/services/push";
import { ThemeProvider } from "@/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

// Prevent the native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize auth - this checks tokens and user data
        await authActions.initializeAuth();

        // Add minimum splash duration for branding
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn("Error during app initialization:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const subs = initializeNotificationListeners();
    return () => subs.forEach((s) => s.remove());
  }, []);

  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { token } = await registerForPushNotificationsAsync();
      if (token) {
        await registerExpoPushToken(token);
      }
    })();
  }, [user]);

  const handleSplashComplete = () => {
    setSplashComplete(true);
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {!splashComplete && (
          <AnimatedSplash
            isReady={appIsReady}
            onAnimationComplete={handleSplashComplete}
          />
        )}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="signUp" />
          <Stack.Screen name="signIn" />
          <Stack.Screen name="index" />
          <Stack.Screen name="budget" />
          <Stack.Screen name="createPin" />
          <Stack.Screen name="spendByOrgId" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
