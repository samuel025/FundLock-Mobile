import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
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
      "Fundlock provides the most secure way to manage and lock your savings with military-grade encryption.",
    backgroundColor: "#4F46E5",
  },
  {
    id: "2",
    title: "Smart Savings",
    description:
      "Set goals and watch your wealth grow with our automated tools and high-yield locks.",
    backgroundColor: "#10B981",
  },
  {
    id: "3",
    title: "Financial Freedom",
    description:
      "Take control of your future today. Join thousands of users securing their dreams.",
    backgroundColor: "#7C3AED",
  },
];

export default function Onboarding() {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          renderItem={({ item }) => (
            <View
              style={[styles.slide, { backgroundColor: item.backgroundColor }]}
            >
              <View style={styles.imagePlaceholder} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
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
              outputRange: [10, 25, 10],
              extrapolate: "clamp",
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                style={[styles.dot, { width: dotWidth, opacity }]}
                key={i.toString()}
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={scrollTo}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 100,
    marginBottom: 40,
  },
  title: {
    fontWeight: "800",
    fontSize: 32,
    marginBottom: 15,
    color: "#fff",
    textAlign: "center",
  },
  description: {
    fontWeight: "400",
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 20,
    fontSize: 18,
    lineHeight: 24,
    opacity: 0.9,
  },
  footer: {
    height: height * 0.2,
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4F46E5",
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
