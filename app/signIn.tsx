import { AuthPageGuard } from "@/components/RouteGuard";
import { authActions } from "@/lib/authContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export type SignInFormData = yup.InferType<typeof schema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const { registered } = useLocalSearchParams();

  useEffect(() => {
    if (registered === "true") {
      setShowSuccessMessage(true);
      // Auto-hide success message after 10 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [registered]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setSignInError(null);
      setShowSuccessMessage(false); // Hide success message when attempting to sign in
      const response = await authActions.signIn(data.email, data.password);

      if (response.success) {
        router.replace("/(tabs)");
      } else {
        setSignInError(response.error || "Invalid email or password");
      }
    } catch (error) {
      setSignInError("Failed to sign in. Please try again.");
    }
  };

  return (
    <AuthPageGuard>
      <LinearGradient
        colors={["#35ae84ff", "#09A674"]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.body}>
              <View style={styles.box}>
                <FontAwesome name="lock" size={45} color="#09A674" />
              </View>
              <View style={styles.titleTextContainer}>
                <Text style={styles.titleText}>FundLock</Text>
                <Text style={styles.subTitleText}>
                  Financial Discipline Made Simple
                </Text>
              </View>

              <View style={styles.formBox}>
                <Text style={styles.signUpText}>Log In</Text>

                {showSuccessMessage && (
                  <View style={styles.successContainer}>
                    <FontAwesome
                      name="check-circle"
                      size={18}
                      color="#059669"
                    />
                    <Text style={styles.successMessage}>
                      Account created successfully! Please log in with your new
                      email and password.
                    </Text>
                  </View>
                )}

                {signInError && (
                  <View style={styles.errorContainer}>
                    <FontAwesome
                      name="exclamation-circle"
                      size={18}
                      color="#DC2626"
                    />
                    <Text style={styles.errorMessage}>{signInError}</Text>
                  </View>
                )}

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label="Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="Email Address"
                        mode="outlined"
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          setSignInError(null);
                        }}
                        onBlur={onBlur}
                        error={!!errors.email}
                        theme={{
                          roundness: 15,
                          colors: {
                            outline: "transparent",
                          },
                        }}
                        style={styles.textInput}
                      />
                      {errors.email && (
                        <Text style={styles.errorText}>
                          {errors.email.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label="Password"
                        autoCapitalize="none"
                        keyboardType="default"
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        mode="outlined"
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          setSignInError(null);
                        }}
                        onBlur={onBlur}
                        error={!!errors.password}
                        theme={{
                          roundness: 15,
                          colors: {
                            outline: "transparent",
                          },
                        }}
                        right={
                          <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            size={20}
                            onPress={() => setShowPassword(!showPassword)}
                          />
                        }
                        style={styles.textInput}
                      />
                      {errors.password && (
                        <Text style={styles.errorText}>
                          {errors.password.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  loading={isSubmitting}
                  disabled={isSubmitting || !isValid}
                  style={[
                    styles.submitButton,
                    (!isValid || isSubmitting) && styles.disabledButton,
                  ]}
                  buttonColor={isValid && !isSubmitting ? "#09A674" : "#A0A0A0"}
                >
                  Sign In
                </Button>
                <TouchableOpacity onPress={() => router.replace("/signUp")}>
                  <Text
                    style={{
                      margin: 10,
                      textAlign: "center",
                      fontSize: 14,
                      color: "#09A674",
                      fontWeight: "bold",
                    }}
                  >
                    Dont have an account? Register
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </AuthPageGuard>
  );
}

const styles = StyleSheet.create({
  body: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    minHeight: "100%",
    marginTop: 20,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  box: {
    backgroundColor: "white",
    borderRadius: 40,
    padding: 30,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  formBox: {
    backgroundColor: "white",
    borderRadius: 40,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    margin: 30,
  },
  titleText: {
    fontWeight: "700",
    fontSize: 40,
    color: "white",
  },
  titleTextContainer: {
    alignItems: "center",
  },
  subTitleText: {
    fontSize: 17,
    color: "#e7e5e5ff",
  },
  signUpText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 22,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    marginBottom: 10,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 10,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    gap: 10,
  },
  errorMessage: {
    flex: 1,
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "500",
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    borderLeftWidth: 4,
    borderLeftColor: "#059669",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    gap: 10,
  },
  successMessage: {
    flex: 1,
    color: "#059669",
    fontSize: 14,
    fontWeight: "500",
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
