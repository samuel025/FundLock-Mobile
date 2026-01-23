import { useTheme } from "@/theme";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface AnimatedSplashProps {
  isReady: boolean;
  onAnimationComplete: () => void;
}

// Floating orb component
function FloatingOrb({
  delay,
  startX,
  startY,
  size,
  color,
  duration,
}: {
  delay: number;
  startX: number;
  startY: number;
  size: number;
  color: string;
  duration: number;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -50,
            duration: duration / 2,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: 30,
            duration: duration / 2,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: duration / 2,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          left: startX,
          top: startY,
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ translateY }, { translateX }, { scale }],
        },
      ]}
    >
      <LinearGradient
        colors={[color, "transparent"]}
        style={styles.orbGradient}
      />
    </Animated.View>
  );
}

// Animated ring pulse
function PulseRing({ delay, isDark }: { delay: number; isDark: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.8,
          duration: 2000,
          delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2000,
          delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start(() => {
      scale.setValue(1);
      opacity.setValue(1);
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.pulseRing,
        {
          borderColor: isDark
            ? "rgba(56, 178, 172, 0.6)"
            : "rgba(56, 178, 172, 0.4)",
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
}

// Progress bar component
function ProgressBar({ isDark }: { isDark: boolean }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        styles.progressContainer,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)",
        },
      ]}
    >
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressWidth,
            backgroundColor: "#38B2AC",
          },
        ]}
      />
    </View>
  );
}

export function AnimatedSplash({
  isReady,
  onAnimationComplete,
}: AnimatedSplashProps) {
  const { scheme } = useTheme();
  const isDark = scheme === "dark";

  // Main animation values
  const fadeOut = useRef(new Animated.Value(1)).current;
  const contentScale = useRef(new Animated.Value(0.9)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // Logo animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoGlow = useRef(new Animated.Value(0)).current;

  // Text animations
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(20)).current;

  // Background animation
  const bgGradientPosition = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [animationStarted, setAnimationStarted] = useState(false);

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (fontsLoaded && !animationStarted) {
      setAnimationStarted(true);
      hideSplash();
      startEntryAnimation();
    }
  }, [fontsLoaded, animationStarted]);

  useEffect(() => {
    if (isReady && animationStarted) {
      startExitAnimation();
    }
  }, [isReady, animationStarted]);

  const startEntryAnimation = () => {
    // Background gradient animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgGradientPosition, {
          toValue: 1,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bgGradientPosition, {
          toValue: 0,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Content fade in
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(contentScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo entrance with dramatic effect
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Logo glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoGlow, {
          toValue: 0.3,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Tagline entrance
    Animated.sequence([
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(taglineTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const startExitAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete();
    });
  };

  const glowOpacity = logoGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  if (!fontsLoaded) return null;

  // Orb configurations
  const orbs = [
    {
      delay: 100,
      startX: width * 0.1,
      startY: height * 0.15,
      size: 120,
      color: "rgba(56, 178, 172, 0.15)",
      duration: 4000,
    },
    {
      delay: 300,
      startX: width * 0.7,
      startY: height * 0.2,
      size: 80,
      color: "rgba(45, 212, 191, 0.12)",
      duration: 3500,
    },
    {
      delay: 500,
      startX: width * 0.15,
      startY: height * 0.7,
      size: 100,
      color: "rgba(56, 178, 172, 0.1)",
      duration: 4500,
    },
    {
      delay: 200,
      startX: width * 0.75,
      startY: height * 0.65,
      size: 140,
      color: "rgba(20, 184, 166, 0.08)",
      duration: 5000,
    },
    {
      delay: 400,
      startX: width * 0.5,
      startY: height * 0.1,
      size: 60,
      color: "rgba(56, 178, 172, 0.18)",
      duration: 3000,
    },
  ];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeOut,
          backgroundColor: isDark ? "#0A1929" : "#FFFFFF",
        },
      ]}
    >
      {/* Animated background gradient */}
      <Animated.View
        style={[
          styles.bgOverlay,
          {
            opacity: bgGradientPosition.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 0.6, 0.3],
            }),
          },
        ]}
      >
        <LinearGradient
          colors={
            isDark
              ? [
                  "rgba(56, 178, 172, 0.05)",
                  "transparent",
                  "rgba(56, 178, 172, 0.08)",
                ]
              : [
                  "rgba(56, 178, 172, 0.03)",
                  "transparent",
                  "rgba(56, 178, 172, 0.05)",
                ]
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Floating orbs */}
      {orbs.map((orb, index) => (
        <FloatingOrb key={index} {...orb} />
      ))}

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentOpacity,
            transform: [{ scale: contentScale }],
          },
        ]}
      >
        {/* Logo and pulse rings container */}
        <View style={styles.logoSection}>
          {/* Pulse rings */}
          <View style={styles.pulseContainer}>
            <PulseRing delay={0} isDark={isDark} />
            <PulseRing delay={700} isDark={isDark} />
            <PulseRing delay={1400} isDark={isDark} />
          </View>

          {/* Logo container with glow */}
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            {/* Outer glow */}
            <Animated.View
              style={[
                styles.logoOuterGlow,
                {
                  opacity: glowOpacity,
                  shadowOpacity: isDark ? 0.8 : 0.4,
                },
              ]}
            />

            {/* Logo with name */}
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/Strixt-logo-bare.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
        </View>

        {/* Tagline */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslateY }],
            },
          ]}
        >
          <View style={styles.taglineWrapper}>
            <Text
              style={[
                styles.tagline,
                { color: isDark ? "#94A3B8" : "#64748B" },
              ]}
            >
              Secure your spending, unlock your goals
            </Text>
            <View
              style={[
                styles.taglineLine,
                {
                  backgroundColor: isDark
                    ? "rgba(56, 178, 172, 0.5)"
                    : "rgba(56, 178, 172, 0.4)",
                },
              ]}
            />
          </View>
        </Animated.View>

        {/* Progress bar */}
        <ProgressBar isDark={isDark} />
      </Animated.View>

      {/* Bottom branding */}
      <Animated.View
        style={[
          styles.bottomBranding,
          {
            opacity: taglineOpacity,
          },
        ]}
      >
        <Text
          style={[styles.bottomText, { color: isDark ? "#475569" : "#94A3B8" }]}
        >
          POWERED BY STRIXT
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  orb: {
    position: "absolute",
    overflow: "hidden",
  },
  orbGradient: {
    width: "100%",
    height: "100%",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  pulseContainer: {
    position: "absolute",
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  logoOuterGlow: {
    position: "absolute",
    width: 320,
    height: 160,
    borderRadius: 40,
    backgroundColor: "transparent",
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 40,
    elevation: 20,
  },
  logoContainer: {
    width: 280,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  taglineContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  taglineWrapper: {
    alignItems: "center",
  },
  tagline: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  taglineLine: {
    width: 60,
    height: 3,
    borderRadius: 2,
    marginTop: 12,
  },
  progressContainer: {
    width: 200,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 40,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  bottomBranding: {
    position: "absolute",
    bottom: 50,
  },
  bottomText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
