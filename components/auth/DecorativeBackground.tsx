import { useTheme } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export function DecorativeBackground() {
  const { scheme } = useTheme();
  const isDark = scheme === "dark";

  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createFloatingAnimation = (
      animValue: Animated.Value,
      duration: number,
      delay: number
    ) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    createFloatingAnimation(floatAnim1, 4000, 0);
    createFloatingAnimation(floatAnim2, 5000, 500);
    createFloatingAnimation(floatAnim3, 4500, 1000);
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      {/* Large circle - Top Right */}
      <Animated.View
        style={[
          styles.circle,
          styles.circle1,
          {
            opacity: floatAnim1.interpolate({
              inputRange: [0, 1],
              outputRange: isDark ? [0.3, 0.5] : [0.4, 0.7],
            }),
            transform: [
              { rotate: isDark ? rotateInterpolate : "0deg" },
              {
                translateY: floatAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
              {
                scale: floatAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(6, 182, 212, 0.15)", "rgba(139, 92, 246, 0.08)"]
              : ["rgba(56, 178, 172, 0.15)", "rgba(56, 178, 172, 0.05)"]
          }
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Medium circle - Left Side */}
      <Animated.View
        style={[
          styles.circle,
          styles.circle2,
          {
            opacity: floatAnim2.interpolate({
              inputRange: [0, 1],
              outputRange: isDark ? [0.25, 0.45] : [0.3, 0.6],
            }),
            transform: [
              { rotate: isDark ? rotateInterpolate : "0deg" },
              {
                translateX: floatAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 15],
                }),
              },
              {
                scale: floatAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.15],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(139, 92, 246, 0.12)", "rgba(6, 182, 212, 0.06)"]
              : ["rgba(79, 70, 229, 0.12)", "rgba(79, 70, 229, 0.04)"]
          }
          style={StyleSheet.absoluteFillObject}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* Small circle - Bottom Right */}
      <Animated.View
        style={[
          styles.circle,
          styles.circle3,
          {
            opacity: floatAnim3.interpolate({
              inputRange: [0, 1],
              outputRange: isDark ? [0.28, 0.48] : [0.35, 0.65],
            }),
            transform: [
              { rotate: isDark ? rotateInterpolate : "0deg" },
              {
                translateY: floatAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 25],
                }),
              },
              {
                scale: floatAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(52, 211, 153, 0.11)", "rgba(251, 191, 36, 0.05)"]
              : ["rgba(245, 158, 11, 0.13)", "rgba(245, 158, 11, 0.03)"]
          }
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {/* Dark mode orbs */}
      {isDark && (
        <>
          <Animated.View
            style={[
              styles.orb,
              styles.orb1,
              {
                opacity: floatAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.15, 0.3],
                }),
                transform: [
                  {
                    scale: floatAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(6, 182, 212, 0.2)", "transparent"]}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.orb,
              styles.orb2,
              {
                opacity: floatAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.12, 0.25],
                }),
                transform: [
                  {
                    scale: floatAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.4],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(139, 92, 246, 0.18)", "transparent"]}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: "absolute",
    borderRadius: 9999,
    overflow: "hidden",
  },
  circle1: {
    width: width * 0.7,
    height: width * 0.7,
    top: -width * 0.35,
    right: -width * 0.25,
  },
  circle2: {
    width: width * 0.5,
    height: width * 0.5,
    top: height * 0.25,
    left: -width * 0.2,
  },
  circle3: {
    width: width * 0.4,
    height: width * 0.4,
    bottom: height * 0.1,
    right: -width * 0.1,
  },
  orb: {
    position: "absolute",
    borderRadius: 9999,
    overflow: "hidden",
  },
  orb1: {
    width: width * 0.9,
    height: width * 0.9,
    top: -width * 0.5,
    left: -width * 0.4,
  },
  orb2: {
    width: width * 0.8,
    height: width * 0.8,
    bottom: -width * 0.4,
    left: width * 0.1,
  },
});
