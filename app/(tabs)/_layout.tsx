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
          tabBarItemStyle: {
            width: 75,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            textAlign: "center",
            fontFamily: "Poppins_500Medium",
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Wallet",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="spend"
          options={{
            title: "Spend",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="card" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="budgets"
          options={{
            title: "Budget",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="pie-chart" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={20} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
