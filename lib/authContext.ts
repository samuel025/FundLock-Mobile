import { SignInFormData } from "@/app/signIn";
import { signUpFormData } from "@/app/signUp";
import { loginUser, signUpUser } from "@/services/auth";
import { getProfile } from "@/services/profile";
import { User } from "@/types/userType";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "./useAuthStore";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_DATA_KEY = "user_data";

export const authActions = {
  initializeAuth: async () => {
    const { setIsLoadingUser, setTokens, setUser } = useAuthStore.getState();
    try {
      setIsLoadingUser(true);
      const accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const cachedUserData = await SecureStore.getItemAsync(USER_DATA_KEY);

      if (accessToken) {
        setTokens(accessToken, refreshToken);

        // Load cached user data first
        if (cachedUserData) {
          const userData: User = JSON.parse(cachedUserData);
          setUser(userData);
        }

        try {
          // Try to fetch fresh user data
          await authActions.getUser();
        } catch (error: any) {
          // Only clear auth on 401 (unauthorized) - token is invalid
          if (error?.status === 401) {
            console.error("Token expired or invalid, signing out");
            await authActions.signOut();
          } else {
            console.error(
              "Failed to fetch user profile, using cached data:",
              error
            );
            // User is already set from cache, so no redirect will happen
          }
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    } finally {
      setIsLoadingUser(false);
    }
  },

  getUser: async () => {
    const { setUser, setIsLoadingUser } = useAuthStore.getState();
    try {
      setIsLoadingUser(true);
      const response = await getProfile();
      const userData: User = {
        id: response.data.Profile.id.toString(),
        email: response.data.Profile.email,
        firstName: response.data.Profile.firstName,
        lastName: response.data.Profile.lastName,
        phone_number: response.data.Profile.phoneNumber,
      };

      // Cache user data in SecureStore
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));

      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Failed to get user:", error);
      throw error;
    } finally {
      setIsLoadingUser(false);
    }
  },

  signIn: async (email: string, password: string) => {
    const { setTokens } = useAuthStore.getState();
    try {
      const signInData: SignInFormData = { email, password };
      const response = await loginUser(signInData);

      const { accessToken, refreshToken } = response.data.loginResponse;

      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

      setTokens(accessToken, refreshToken);
      await authActions.getUser();

      return { success: true, data: response };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to sign in" };
    }
  },

  signOut: async () => {
    const { setUser, setTokens } = useAuthStore.getState();
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);

      setUser(null);
      setTokens(null, null);
    } catch (error) {
      console.error("Signout error:", error);
    }
  },

  signUp: async (data: signUpFormData) => {
    try {
      return await signUpUser(data);
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to sign in" };
    }
  },
};
