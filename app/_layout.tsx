import { authActions } from "@/lib/authContext";
import { ThemeProvider } from "@/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
// NEW: import auth store and helpers
import {
  initializeNotificationListeners,
  registerForPushNotificationsAsync,
} from "@/lib/pushNotifications";
import { useAuthStore } from "@/lib/useAuthStore";
import { registerExpoPushToken } from "@/services/push";
// NEW: set a global handler so alerts appear in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    authActions.initializeAuth();
  }, []);

  // NEW: attach listeners (logs incoming notifications)
  useEffect(() => {
    const subs = initializeNotificationListeners();
    return () => subs.forEach((s) => s.remove());
  }, []);

  // NEW: when the user is available, request permissions and register token
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { token } = await registerForPushNotificationsAsync();
      if (token) {
        // Persist token in backend (placeholder endpoint)
        await registerExpoPushToken(token);
      }
    })();
  }, [user]);

  return (
    <>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="signUp" options={{ headerShown: false }} />
            <Stack.Screen name="signIn" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="budget" options={{ headerShown: false }} />
            <Stack.Screen
              name="spendByOrgId"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="createPin" options={{ headerShown: false }} />
            <Stack.Screen name="addBvn" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="addBankDetails"
              options={{ headerShown: false }}
            />
          </Stack>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
