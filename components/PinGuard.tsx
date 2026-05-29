import { useWallet } from "@/hooks/useWallet";
import { walletStore } from "@/lib/walletStore";
import { useTheme } from "@/theme";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export function PinGuard({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { hasPin, balance, isCheckingPin } = useWallet();
  const isLoading = walletStore((s) => s.isLoading);

  if (isCheckingPin || (isLoading && balance === null)) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color="#38B2AC" />
      </View>
    );
  }

  if (!hasPin) {
    return <Redirect href="/createPin" />;
  }

  return <>{children}</>;
}
