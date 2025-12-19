import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiText, MotiView } from "moti";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Secure Your Funds",
    description:
      "Lock your savings with military-grade encryption and build financial discipline.",
    icon: "shield-checkmark-outline",
  },
  {
    id: "2",
    title: "Smart Budgeting",
    description:
      "Create custom budgets and track your spending habits with real-time insights.",
    icon: "pie-chart-outline",
  },
  {
    id: "3",
    title: "Financial Freedom",
    description:
      "Take control of your future. Join thousands of users securing their dreams today.",
    icon: "rocket-outline",
  },
];

export default function Onboarding() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const router = useRouter();

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/signIn");
    }
  };

  const skip = () => {
    router.replace("/signIn");
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={isDark ? ["#050B1A", "#0D1428"] : ["#F8F9FA", "#E9ECEF"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative background blobs */}
      <View
        style={[
          styles.blob,
          {
            backgroundColor: theme.colors.primary,
            opacity: 0.08,
            top: -100,
            right: -100,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            backgroundColor: "#38B2AC",
            opacity: 0.08,
            bottom: -100,
            left: -100,
          },
        ]}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={skip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: theme.colors.muted }]}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 3 }}>
          <FlatList
            data={slides}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <MotiView
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                  }}
                  style={[
                    styles.iconContainer,
                    {
                      borderColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(255,255,255,0.5)",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.iconInner,
                      {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(255,255,255,0.8)",
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={80}
                      color={theme.colors.primary}
                    />
                  </View>
                </MotiView>

                <MotiText
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 200, type: "timing", duration: 600 }}
                  style={[styles.title, { color: theme.colors.text }]}
                >
                  {item.title}
                </MotiText>

                <MotiText
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 400, type: "timing", duration: 600 }}
                  style={[styles.description, { color: theme.colors.muted }]}
                >
                  {item.description}
                </MotiText>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: false,
              }
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.indicatorContainer}>
            {slides.map((_, i) => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 32, 8],
                extrapolate: "clamp",
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });
              return (
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      opacity,
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  key={i.toString()}
                />
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={scrollTo}
          >
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
            <Ionicons
              name={
                currentIndex === slides.length - 1
                  ? "rocket-outline"
                  : "arrow-forward"
              }
              size={20}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blob: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  description: {
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    paddingHorizontal: 10,
    fontSize: 15,
    lineHeight: 24,
  },
  footer: {
    height: height * 0.2,
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === "ios" ? 20 : 40,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
});
