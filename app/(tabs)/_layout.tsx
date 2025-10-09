import { AuthGuard } from "@/components/RouteGuard";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <AuthGuard>
      <Tabs>
        <Tabs.Screen name="index" />
      </Tabs>
    </AuthGuard>
  );
}
