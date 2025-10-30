import { AuthGuard } from "@/components/RouteGuard";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#38B2AC",
          tabBarInactiveTintColor: "#94A3B8",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
            elevation: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            height: 70,
            paddingBottom: 8,
            paddingTop: 8,
            borderRadius: 16,
          },
          tabBarLabelStyle: {
            fontFamily: "Poppins_500Medium",
            fontSize: 10,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Wallet",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="locks"
          options={{
            title: "Lock",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="lock-closed" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="spend"
          options={{
            title: "Spend",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="card" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
