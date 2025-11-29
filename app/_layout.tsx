import { authActions } from "@/lib/authContext";
import { ThemeProvider } from "@/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    authActions.initializeAuth();
  }, []);

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
