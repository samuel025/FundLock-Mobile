import { AuthGuard } from "@/components/RouteGuard";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#38B2AC", // teal color matching your theme
          tabBarInactiveTintColor: "#8B9DC3",
          tabBarStyle: {
            backgroundColor: "#1B263B", // dark background
            borderTopWidth: 1,
            borderTopColor: "rgba(56, 178, 172, 0.25)", // teal border
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
      
          tabBarLabelStyle: {
            fontSize: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            headerShown: false,
            tabBarLabel: "Wallet",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
