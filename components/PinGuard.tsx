import { walletStore } from "@/lib/walletStore";
import { Redirect } from "expo-router";
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useWallet } from "@/hooks/useWallet";

export function PinGuard({ children }: { children: React.ReactNode }) {
  const { hasPin, balance } = useWallet();
  const isLoading = walletStore((s) => s.isLoading);

  if (isLoading && balance === null) {
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
