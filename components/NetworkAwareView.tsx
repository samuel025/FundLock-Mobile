import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useTheme } from "@/theme";
import React, { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { NetworkError } from "./NetworkError";

interface NetworkAwareViewProps {
  children: ReactNode;
  onRetry?: () => void;
  showOfflineWarning?: boolean;
}

export function NetworkAwareView({
  children,
  onRetry,
  showOfflineWarning = true,
}: NetworkAwareViewProps) {
  const { isConnected, isInternetReachable, isLoading } = useNetworkStatus();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Show network error if no connection or internet is not reachable
  if (
    showOfflineWarning &&
    (isConnected === false || isInternetReachable === false)
  ) {
    return <NetworkError onRetry={onRetry} isFullScreen={true} />;
  }

  return <>{children}</>;
}
