import { useTheme } from "@/theme";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Fade in
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Floating animation
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -30,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 30,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: 20,
            duration: duration * 1.3,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -20,
            duration: duration * 1.3,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
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
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    >
      <LinearGradient
        colors={[color, "transparent"]}
        style={[styles.orbGradient, { borderRadius: size / 2 }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
    </Animated.View>
  );
}

// Animated ring pulse
function PulseRing({ delay, isDark }: { delay: number; isDark: boolean }) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 2.5,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.4,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1800,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.pulseRing,
        {
          borderColor: isDark
            ? "rgba(56, 178, 172, 0.5)"
            : "rgba(56, 178, 172, 0.3)",
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
}

// Shimmer line component
function ShimmerLine({ isDark }: { isDark: boolean }) {
  const translateX = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 100,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(translateX, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.shimmerContainer}>
      <Animated.View
        style={[
          styles.shimmerLine,
          {
            backgroundColor: isDark
              ? "rgba(56, 178, 172, 0.3)"
              : "rgba(56, 178, 172, 0.2)",
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            "transparent",
            isDark ? "rgba(56, 178, 172, 0.6)" : "rgba(56, 178, 172, 0.4)",
            "transparent",
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

// Progress bar component
function ProgressBar({ isDark }: { isDark: boolean }) {
  const progress = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.delay(300),
      ])
    ).start();
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View style={[styles.progressContainer, { opacity }]}>
      <View
        style={[
          styles.progressTrack,
          {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.08)",
          },
        ]}
      >
        <Animated.View style={[styles.progressBar, { width: progressWidth }]}>
          <LinearGradient
            colors={["#38B2AC", "#2DD4BF", "#38B2AC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      <Animated.Text
        style={[
          styles.loadingText,
          { color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" },
        ]}
      >
        Loading your experience...
      </Animated.Text>
    </Animated.View>
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
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoGlow = useRef(new Animated.Value(0)).current;
  const iconBounce = useRef(new Animated.Value(0)).current;

  // Text animations
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const letterSpacing = useRef(new Animated.Value(20)).current;
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
      ])
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
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
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
      ])
    ).start();

    // Icon bounce effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconBounce, {
          toValue: -5,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(iconBounce, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Title entrance with letter spacing animation
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Tagline entrance
    Animated.sequence([
      Animated.delay(600),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
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
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 1.15,
        duration: 500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete();
    });
  };

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-180deg", "0deg"],
  });

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
      color: "rgba(56, 178, 172, 0.2)",
      duration: 3000,
    },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      {/* Background gradient */}
      <LinearGradient
        colors={
          isDark
            ? ["#0A1628", "#0D1B2A", "#1B263B", "#0D1B2A"]
            : ["#FFFFFF", "#F0FDFA", "#CCFBF1", "#F0FDFA"]
        }
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated background overlay */}
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
        {/* Pulse rings behind logo */}
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
              transform: [
                { scale: logoScale },
                { rotate: logoRotateInterpolate },
              ],
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

          {/* Logo background */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={["#38B2AC", "#2DD4BF", "#14B8A6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              {/* Inner shine */}
              <View style={styles.logoShine} />

              {/* Lock icon with bounce */}
              <Animated.View
                style={[
                  styles.iconContainer,
                  { transform: [{ translateY: iconBounce }] },
                ]}
              >
                <Ionicons name="lock-closed" size={52} color="#FFFFFF" />
              </Animated.View>
            </LinearGradient>
          </View>

          {/* Shimmer effect on logo */}
          <ShimmerLine isDark={isDark} />
        </Animated.View>

        {/* Brand name */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          <Text
            style={[styles.title, { color: isDark ? "#FFFFFF" : "#1B263B" }]}
          >
            Str
            <Text style={styles.titleAccent}>ixt</Text>
          </Text>
        </Animated.View>

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
          style={[
            styles.bottomText,
            { color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)" },
          ]}
        >
          Financial Discipline Made Simple
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
  pulseContainer: {
    position: "absolute",
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  logoOuterGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 40,
    backgroundColor: "transparent",
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 40,
    elevation: 20,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  logoGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  shimmerContainer: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 32,
    overflow: "hidden",
  },
  shimmerLine: {
    position: "absolute",
    width: 60,
    height: "100%",
  },
  titleContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 42,
    fontFamily: "Poppins_700Bold",
    letterSpacing: -1,
  },
  titleAccent: {
    color: "#38B2AC",
  },
  taglineContainer: {
    marginBottom: 48,
  },
  taglineWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  taglineLine: {
    width: 24,
    height: 2,
    borderRadius: 1,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    letterSpacing: 0.5,
  },
  progressContainer: {
    alignItems: "center",
    width: width * 0.5,
  },
  progressTrack: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    letterSpacing: 0.3,
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
