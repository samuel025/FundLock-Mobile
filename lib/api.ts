import { useAuthStore } from "@/lib/useAuthStore";
import { refreshAccessToken } from "@/services/auth";
import axios, { AxiosResponse } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
});

// Track if we're currently refreshing to prevent multiple refreshes
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue: {
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: any) => void;
  config: any;
}[] = [];

// Request interceptor - add auth token
API.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    const { accessToken } = state;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If we're already refreshing, add this request to queue
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
          config: originalRequest,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Get current refresh token
      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Attempt to refresh the token
      const tokens = await refreshAccessToken(refreshToken);

      // Update tokens in secure storage and state
      await SecureStore.setItemAsync("auth_token", tokens.accessToken);
      await SecureStore.setItemAsync("refresh_token", tokens.refreshToken);

      const { setTokens } = useAuthStore.getState();
      setTokens(tokens.accessToken, tokens.refreshToken);

      // Update authorization header for the original request
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

      // Process all queued requests with the new token
      const queueToProcess = [...failedQueue];
      failedQueue = []; // Clear queue immediately

      // Retry all queued requests
      queueToProcess.forEach(async (queuedRequest) => {
        try {
          queuedRequest.config.headers.Authorization = `Bearer ${tokens.accessToken}`;
          const response = await API(queuedRequest.config);
          queuedRequest.resolve(response);
        } catch (retryError) {
          queuedRequest.reject(retryError);
        }
      });

      // Retry the original request
      return API(originalRequest);
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);

      // Reject all queued requests
      failedQueue.forEach((queuedRequest) => {
        queuedRequest.reject(new Error("Token refresh failed"));
      });
      failedQueue = [];

      // Clear tokens and redirect to sign in
      const { setUser, setTokens } = useAuthStore.getState();
      setUser(null);
      setTokens(null, null);

      try {
        await SecureStore.deleteItemAsync("auth_token");
        await SecureStore.deleteItemAsync("refresh_token");
        await SecureStore.deleteItemAsync("user_data");
      } catch (storageError) {
        console.error("Failed to clear storage:", storageError);
      }

      // Redirect to sign in page
      router.replace("/signIn");

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
