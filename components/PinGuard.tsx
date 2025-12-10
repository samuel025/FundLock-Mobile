import { useWallet } from "@/hooks/useWallet";
import { walletStore } from "@/lib/walletStore";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export function PinGuard({ children }: { children: React.ReactNode }) {
  const { hasPin, balance, isCheckingPin } = useWallet();
  const isLoading = walletStore((s) => s.isLoading);

  if (isCheckingPin || (isLoading && balance === null)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#38B2AC" />
      </View>
    );
  }

  if (!hasPin) {
    return <Redirect href="/createPin" />;
  }

  return <>{children}</>;
}
