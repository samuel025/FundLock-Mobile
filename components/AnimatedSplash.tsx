import { useTheme } from "@/theme";
import {
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

export function AnimatedSplash({
  isReady,
  onAnimationComplete,
}: AnimatedSplashProps) {
  const { scheme } = useTheme();
  const isDark = scheme === "dark";

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(15)).current;
  const ringScale = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0.8)).current;
  const ring2Scale = useRef(new Animated.Value(0)).current;
  const ring2Opacity = useRef(new Animated.Value(0.6)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;
  const contentScale = useRef(new Animated.Value(1)).current;

  // Particles for dark mode
  const particles = useRef(
    Array.from({ length: 6 }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
    }))
  ).current;

  const [fontsLoaded] = useFonts({
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
    // Logo entrance with bounce
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
      // Expanding rings
      Animated.parallel([
        Animated.timing(ringScale, {
          toValue: 2.5,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Second ring with delay
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(ring2Scale, {
          toValue: 2.5,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ring2Opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Text entrance
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Tagline entrance
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
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

    // Loader appearance
    Animated.sequence([
      Animated.delay(700),
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Particle animations for dark mode
    if (isDark) {
      particles.forEach((particle, index) => {
        Animated.sequence([
          Animated.delay(400 + index * 100),
          Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 0.6,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.loop(
            Animated.sequence([
              Animated.timing(particle.y, {
                toValue: Math.random() * height,
                duration: 3000 + Math.random() * 2000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(particle.y, {
                toValue: Math.random() * height,
                duration: 3000 + Math.random() * 2000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ])
          ),
        ]).start();
      });
    }
  };

  const startExitAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 1.1,
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete();
    });
  };

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-180deg", "0deg"],
  });

  if (!fontsLoaded) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      <LinearGradient
        colors={
          isDark
            ? ["#0A1628", "#0D1B2A", "#1B263B"]
            : ["#FFFFFF", "#F0FDFA", "#CCFBF1"]
        }
        style={StyleSheet.absoluteFillObject}
      />

      {/* Floating particles for dark mode */}
      {isDark &&
        particles.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y },
                  { scale: particle.scale },
                ],
                opacity: particle.opacity,
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(56, 178, 172, 0.4)", "rgba(56, 178, 172, 0)"]}
              style={styles.particleGradient}
            />
          </Animated.View>
        ))}

      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: contentScale }],
          },
        ]}
      >
        {/* Expanding rings */}
        <Animated.View
          style={[
            styles.ring,
            {
              transform: [{ scale: ringScale }],
              opacity: ringOpacity,
              borderColor: isDark
                ? "rgba(56, 178, 172, 0.3)"
                : "rgba(56, 178, 172, 0.2)",
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            {
              transform: [{ scale: ring2Scale }],
              opacity: ring2Opacity,
              borderColor: isDark
                ? "rgba(56, 178, 172, 0.2)"
                : "rgba(56, 178, 172, 0.15)",
            },
          ]}
        />

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }, { rotate: rotateInterpolate }],
              opacity: logoOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={["#38B2AC", "#2C9A8F"]}
            style={styles.logoGradient}
          >
            <View style={styles.lockIconContainer}>
              <Ionicons name="lock-closed" size={48} color="#FFFFFF" />
            </View>
          </LinearGradient>

          {/* Glow effect */}
          <View
            style={[
              styles.glow,
              {
                shadowColor: "#38B2AC",
                shadowOpacity: isDark ? 0.8 : 0.4,
              },
            ]}
          />
        </Animated.View>

        {/* Brand name */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text
            style={[
              styles.brandName,
              { color: isDark ? "#FFFFFF" : "#1B263B" },
            ]}
          >
            Str
            <Text style={styles.brandNameAccent}>ixt</Text>
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
          <Text
            style={[styles.tagline, { color: isDark ? "#94A3B8" : "#64748B" }]}
          >
            Secure your spending, unlock your goals
          </Text>
        </Animated.View>

        {/* Loading indicator */}
        <Animated.View
          style={[styles.loaderContainer, { opacity: loaderOpacity }]}
        >
          <LoadingDots isDark={isDark} />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

// Animated loading dots component
function LoadingDots({ isDark }: { isDark: boolean }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, []);

  const dotStyle = (anim: Animated.Value) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.4],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
  });

  return (
    <View style={styles.dotsContainer}>
      {[dot1, dot2, dot3].map((dot, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            dotStyle(dot),
            { backgroundColor: isDark ? "#38B2AC" : "#2C9A8F" },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  lockIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    elevation: 0,
  },
  textContainer: {
    marginTop: 24,
  },
  brandName: {
    fontSize: 36,
    fontFamily: "Poppins_700Bold",
    letterSpacing: -0.5,
  },
  brandNameAccent: {
    color: "#38B2AC",
  },
  taglineContainer: {
    marginTop: 8,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  loaderContainer: {
    marginTop: 48,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  particle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  particleGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 3,
  },
});
