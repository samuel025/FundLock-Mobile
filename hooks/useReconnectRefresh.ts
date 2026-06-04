import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef } from "react";

/**
 * Fires `onReconnect` once whenever the device transitions from
 * offline → online. Ignores the initial state on mount so it does
 * not double-fire alongside the normal focus-based fetch.
 *
 * @param onReconnect - callback to invoke when connectivity is restored
 */
export function useReconnectRefresh(onReconnect: () => void) {
  // Track the previous connectivity state so we can detect a real transition
  const wasOfflineRef = useRef<boolean | null>(null);
  // Stable ref so the NetInfo listener always calls the latest version
  const callbackRef = useRef(onReconnect);
  callbackRef.current = onReconnect;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline =
        state.isConnected === true && state.isInternetReachable !== false;

      // First event — just record state, don't trigger
      if (wasOfflineRef.current === null) {
        wasOfflineRef.current = !isOnline;
        return;
      }

      // Transition: was offline, now online → refresh
      if (wasOfflineRef.current && isOnline) {
        callbackRef.current();
      }

      wasOfflineRef.current = !isOnline;
    });

    return () => unsubscribe();
  }, []);
}
