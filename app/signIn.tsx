import { AuthPageGuard } from "@/components/RouteGuard";
import { authActions } from "@/lib/authContext";
import { useAuthStore } from "@/lib/useAuthStore";
import { loginUser } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .test("is-valid-email", "Please enter a valid email address", (value) =>
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(value || "")
    )
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export type SignInFormData = yup.InferType<typeof schema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const { registered } = useLocalSearchParams();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    if (registered === "true") {
      setShowSuccessMessage(true);

      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [registered]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      const { accessToken, refreshToken } = data.data.loginResponse;

      // Store tokens in SecureStore
      await SecureStore.setItemAsync("auth_token", accessToken);
      await SecureStore.setItemAsync("refresh_token", refreshToken);

      const { setTokens } = useAuthStore.getState();
      setTokens(accessToken, refreshToken);

      // Fetch and cache user data
      await authActions.getUser();
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      setSignInError(error.message || "Invalid email or password");
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setSignInError(null);
    setShowSuccessMessage(false);
    signInMutation.mutate(data);
  };

  return (
    <AuthPageGuard>
      <LinearGradient
        colors={["#0D1B2A", "#1B263B", "#415A77"]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              {/* Logo Section */}
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={["#38B2AC", "#2C9A8F"]}
                  style={styles.logoCircle}
                >
                  <Ionicons name="lock-closed" size={40} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.brandName}>FundLock</Text>
                <Text style={styles.tagline}>
                  Financial Discipline Made Simple
                </Text>
              </View>

              {/* Success Message */}
              {showSuccessMessage && (
                <View style={styles.successBanner}>
                  <Ionicons name="checkmark-circle" size={20} color="#38B2AC" />
                  <Text style={styles.successText}>
                    Account created! Please sign in.
                  </Text>
                </View>
              )}

              {/* Error Message */}
              {signInError && (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={20} color="#DC2626" />
                  <Text style={styles.errorText}>{signInError}</Text>
                </View>
              )}

              {/* Form Card */}
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Welcome Back</Text>
                <Text style={styles.formSubtitle}>
                  Sign in to continue managing your finances
                </Text>

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <TextInput
                        label="Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="Enter your email"
                        mode="outlined"
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          setSignInError(null);
                        }}
                        onBlur={onBlur}
                        error={!!errors.email}
                        left={
                          <TextInput.Icon
                            icon={() => (
                              <Ionicons
                                name="mail-outline"
                                size={20}
                                color="#778DA9"
                              />
                            )}
                          />
                        }
                        theme={{
                          roundness: 12,
                          colors: {
                            primary: "#38B2AC",
                            outline: errors.email ? "#DC2626" : "#E9ECEF",
                          },
                        }}
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                      />
                      {errors.email && (
                        <Text style={styles.inputError}>
                          {errors.email.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <TextInput
                        label="Password"
                        autoCapitalize="none"
                        placeholder="Enter your password"
                        secureTextEntry={!showPassword}
                        mode="outlined"
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          setSignInError(null);
                        }}
                        onBlur={onBlur}
                        error={!!errors.password}
                        left={
                          <TextInput.Icon
                            icon={() => (
                              <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#778DA9"
                              />
                            )}
                          />
                        }
                        right={
                          <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            onPress={() => setShowPassword(!showPassword)}
                          />
                        }
                        theme={{
                          roundness: 12,
                          colors: {
                            primary: "#38B2AC",
                            outline: errors.password ? "#DC2626" : "#E9ECEF",
                          },
                        }}
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                      />
                      {errors.password && (
                        <Text style={styles.inputError}>
                          {errors.password.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.signInButton,
                    (!isValid || signInMutation.isPending) &&
                      styles.signInButtonDisabled,
                  ]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={signInMutation.isPending || !isValid}
                >
                  <LinearGradient
                    colors={
                      isValid && !signInMutation.isPending
                        ? ["#38B2AC", "#2C9A8F"]
                        : ["#8B9DC3", "#778DA9"]
                    }
                    style={styles.signInButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {signInMutation.isPending ? (
                      <Text style={styles.signInButtonText}>Signing in...</Text>
                    ) : (
                      <>
                        <Text style={styles.signInButtonText}>Sign In</Text>
                        <Ionicons
                          name="arrow-forward"
                          size={20}
                          color="#FFFFFF"
                        />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.signUpLink}
                  onPress={() => router.replace("/signUp")}
                >
                  <Text style={styles.signUpLinkText}>
                    Don&apos;t have an account?{" "}
                    <Text style={styles.signUpLinkBold}>Sign Up</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </AuthPageGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  brandName: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: "#FFFFFF",
    marginTop: 16,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#8B9DC3",
    marginTop: 8,
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(56, 178, 172, 0.15)",
    borderLeftWidth: 4,
    borderLeftColor: "#38B2AC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  successText: {
    flex: 1,
    color: "#E7F6F2",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(220, 38, 38, 0.15)",
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  errorText: {
    flex: 1,
    color: "#FEE2E2",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: "#1B263B",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F8F9FA",
    fontSize: 14,
  },
  inputOutline: {
    borderWidth: 1.5,
  },
  inputError: {
    color: "#DC2626",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#38B2AC",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  signInButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E9ECEF",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#778DA9",
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
  },
  signUpLink: {
    alignItems: "center",
  },
  signUpLinkText: {
    color: "#778DA9",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  signUpLinkBold: {
    color: "#38B2AC",
    fontFamily: "Poppins_600SemiBold",
  },
});
