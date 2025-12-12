import { AuthGuard } from "@/components/RouteGuard";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate proper tab bar height accounting for navigation bar
  const tabBarHeight = 70 + (Platform.OS === "android" ? insets.bottom : 0);
  const tabBarPaddingBottom =
    8 + (Platform.OS === "android" ? insets.bottom : 0);

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
              height: tabBarHeight,
              paddingBottom: tabBarPaddingBottom,
              paddingTop: 8,
              borderRadius: 16,
              overflow: "hidden",
            },
            tabBarItemStyle: {
              width: 90,
            },
            tabBarLabelStyle: {
              fontSize: 9,
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
                <Ionicons name="home" size={18} color={color} />
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
            name="budgets"
            options={{
              title: "Budget",
              tabBarIcon: ({ color }) => (
                <Ionicons name="pie-chart" size={20} color={color} />
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
            name="profile"
            options={{
              title: "My Account",
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
