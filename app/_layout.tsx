import { AnimatedSplash } from "@/components/AnimatedSplash";
import { authActions } from "@/lib/authContext";
import {
  initializeNotificationListeners,
  registerForPushNotificationsAsync,
} from "@/lib/pushNotifications";
import { useAuthStore } from "@/lib/useAuthStore";
import { registerExpoPushToken } from "@/services/push";
import { ThemeProvider, useTheme } from "@/theme";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  const isLoadingUser = useAuthStore((s) => s.isLoadingUser);

  useEffect(() => {
    async function prepare() {
      try {
        await authActions.initializeAuth();
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

  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render anything until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (splashComplete && isLoadingUser) {
    return (
      <ThemeProvider>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#09A674" />
        </View>
      </ThemeProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ThemeAwareStatusBar />
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
            <Stack.Screen name="profileDetails" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function ThemeAwareStatusBar() {
  const { scheme } = useTheme();

  return (
    <StatusBar
      barStyle={scheme === "dark" ? "light-content" : "dark-content"}
      backgroundColor="transparent"
      translucent
    />
  );
}
