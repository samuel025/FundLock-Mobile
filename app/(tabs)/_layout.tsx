import { AuthGuard } from "@/components/RouteGuard";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { useTheme } from "@/theme";

export default function RootLayout() {
  const { theme } = useTheme();

  return (
    <AuthGuard>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.muted,
            tabBarStyle: {
              backgroundColor: theme.colors.card,
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
              overflow: "hidden", // ensures rounded edges clip correctly
            },
            tabBarItemStyle: {
              width: 75,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              textAlign: "center",
              fontFamily: "Poppins_500Medium",
              includeFontPadding: Platform.OS === "android",
            },
            headerShown: false,
            sceneContainerStyle: {
              backgroundColor: theme.colors.background,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <Ionicons name="home" size={20} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="wallet"
            options={{
              title: "Wallet",
              tabBarIcon: ({ color }) => (
                <Ionicons name="wallet" size={20} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="spend"
            options={{
              title: "Spend",
              tabBarIcon: ({ color }) => (
                <Ionicons name="card" size={20} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="budgets"
            options={{
              title: "Budget",
              tabBarIcon: ({ color }) => (
                <Ionicons name="pie-chart" size={20} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color }) => (
                <Ionicons name="person" size={20} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </AuthGuard>
  );
}
