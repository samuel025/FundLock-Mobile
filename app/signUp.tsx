import { AuthPageGuard } from "@/components/RouteGuard";
import { authActions } from "@/lib/authContext";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
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
    .required("Email is required"),
  firstName: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  password: yup.string().required("Password is required"),
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be exactly 4 digits")
    .required("PIN is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10,15}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
});

export type signUpFormData = yup.InferType<typeof schema>;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<signUpFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      pin: "",
    },
  });

  const onSubmit = async (data: signUpFormData) => {
    try {
      await authActions.signUp(data);
      router.replace("/signIn?registered=true");
    } catch (error: any) {
      console.error("Sign up error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to create account. Please try again."
      );
    }
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
                  <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.brandName}>Join FundLock</Text>
                <Text style={styles.tagline}>
                  Start your journey to financial discipline
                </Text>
              </View>

              {/* Form Card */}
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Create Account</Text>
                <Text style={styles.formSubtitle}>
                  Fill in your details to get started
                </Text>

                <View style={styles.formRow}>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={[styles.inputContainer, styles.halfWidth]}>
                        <TextInput
                          label="First Name"
                          autoCapitalize="words"
                          placeholder="John"
                          mode="outlined"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          error={!!errors.firstName}
                          theme={{
                            roundness: 12,
                            colors: {
                              primary: "#38B2AC",
                              outline: errors.firstName ? "#DC2626" : "#E9ECEF",
                            },
                          }}
                          style={styles.input}
                          outlineStyle={styles.inputOutline}
                        />
                        {errors.firstName && (
                          <Text style={styles.inputError}>
                            {errors.firstName.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={[styles.inputContainer, styles.halfWidth]}>
                        <TextInput
                          label="Last Name"
                          autoCapitalize="words"
                          placeholder="Doe"
                          mode="outlined"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          error={!!errors.lastName}
                          theme={{
                            roundness: 12,
                            colors: {
                              primary: "#38B2AC",
                              outline: errors.lastName ? "#DC2626" : "#E9ECEF",
                            },
                          }}
                          style={styles.input}
                          outlineStyle={styles.inputOutline}
                        />
                        {errors.lastName && (
                          <Text style={styles.inputError}>
                            {errors.lastName.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <TextInput
                        label="Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="[email protected]"
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
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
                  name="phoneNumber"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <TextInput
                        label="Phone Number"
                        keyboardType="phone-pad"
                        placeholder="08012345678"
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={!!errors.phoneNumber}
                        left={
                          <TextInput.Icon
                            icon={() => (
                              <Ionicons
                                name="call-outline"
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
                            outline: errors.phoneNumber ? "#DC2626" : "#E9ECEF",
                          },
                        }}
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                      />
                      {errors.phoneNumber && (
                        <Text style={styles.inputError}>
                          {errors.phoneNumber.message}
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
                        placeholder="Enter password"
                        secureTextEntry={!showPassword}
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
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

                <Controller
                  control={control}
                  name="pin"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <TextInput
                        label="4-Digit PIN"
                        keyboardType="numeric"
                        placeholder="0000"
                        secureTextEntry={!showPin}
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={!!errors.pin}
                        maxLength={4}
                        left={
                          <TextInput.Icon
                            icon={() => (
                              <Ionicons
                                name="keypad-outline"
                                size={20}
                                color="#778DA9"
                              />
                            )}
                          />
                        }
                        right={
                          <TextInput.Icon
                            icon={showPin ? "eye-off" : "eye"}
                            onPress={() => setShowPin(!showPin)}
                          />
                        }
                        theme={{
                          roundness: 12,
                          colors: {
                            primary: "#38B2AC",
                            outline: errors.pin ? "#DC2626" : "#E9ECEF",
                          },
                        }}
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                      />
                      {errors.pin && (
                        <Text style={styles.inputError}>
                          {errors.pin.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <TouchableOpacity
                  style={[
                    styles.signUpButton,
                    (!isValid || isSubmitting) && styles.signUpButtonDisabled,
                  ]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting || !isValid}
                >
                  <LinearGradient
                    colors={
                      isValid && !isSubmitting
                        ? ["#38B2AC", "#2C9A8F"]
                        : ["#8B9DC3", "#778DA9"]
                    }
                    style={styles.signUpButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isSubmitting ? (
                      <Text style={styles.signUpButtonText}>
                        Creating Account...
                      </Text>
                    ) : (
                      <>
                        <Text style={styles.signUpButtonText}>
                          Create Account
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={20}
                          color="#FFFFFF"
                        />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.signInLink}
                  onPress={() => router.replace("/signIn")}
                >
                  <Text style={styles.signInLinkText}>
                    Already have an account?{" "}
                    <Text style={styles.signInLinkBold}>Sign In</Text>
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
    paddingVertical: 30,
  },
  content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#38B2AC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  brandName: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    color: "#FFFFFF",
    marginTop: 12,
  },
  tagline: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#8B9DC3",
    marginTop: 4,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#1B263B",
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#778DA9",
    marginBottom: 20,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
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
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
    marginLeft: 4,
  },
  signUpButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 16,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  signInLink: {
    alignItems: "center",
  },
  signInLinkText: {
    color: "#778DA9",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  signInLinkBold: {
    color: "#38B2AC",
    fontFamily: "Poppins_600SemiBold",
  },
});
