import { SignInFormData } from "@/app/signIn";
import { signUpFormData } from "@/app/signUp";
import { loginUser, signUpUser } from "@/services/auth";
import { getProfile } from "@/services/profile";
import { User } from "@/types/userType";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

interface AuthState {
  user: User | null;
  isLoadingUser: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User | null) => void;
  setIsLoadingUser: (loading: boolean) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoadingUser: false,
  accessToken: null,
  refreshToken: null,
  setUser: (user) => set({ user }),
  setIsLoadingUser: (loading) => set({ isLoadingUser: loading }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
}));

export const authActions = {
  // Initialize auth state from SecureStore on app start
  initializeAuth: async () => {
    const { setIsLoadingUser, setTokens } = useAuthStore.getState();
    try {
      setIsLoadingUser(true);
      const accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (accessToken) {
        setTokens(accessToken, refreshToken);
        await authActions.getUser(accessToken);
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    } finally {
      setIsLoadingUser(false);
    }
  },

  getUser: async (token: string) => {
    const { setUser, setIsLoadingUser } = useAuthStore.getState();
    try {
      setIsLoadingUser(true);
      const response = await getProfile(token);
      const userData: User = {
        id: response.data.Profile.id.toString(),
        email: response.data.Profile.email,
        firstName: response.data.Profile.firstName,
        lastName: response.data.Profile.lastName,
        phone_number: response.data.Profile.phoneNumber,
      };
      setUser(userData);
      return userData;
    } catch (error) {
      console.error(error);
      setUser(null);
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

      // Save tokens to SecureStore
      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

      setTokens(accessToken, refreshToken);
      await authActions.getUser(accessToken);

      console.log(response);
      return response;
    } catch (error) {
      console.error("Signin error:", error);
      return null;
    }
  },

  signOut: async () => {
    const { setUser, setTokens } = useAuthStore.getState();
    try {
      // Clear tokens from SecureStore
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

      setUser(null);
      setTokens(null, null);
    } catch (error) {
      console.error("Signout error:", error);
    }
  },

  signUp: async (data: signUpFormData) => {
    try {
      return await signUpUser(data);
    } catch (error) {
      console.error("Signup error:", error);
      return null;
    }
  },
};
