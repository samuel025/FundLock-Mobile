import { useAuthStore } from "@/lib/useAuthStore";
import { refreshAccessToken } from "@/services/refreshToken";
import axios, { AxiosResponse } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const REFRESH_TOKEN_KEY = "refresh_token";

export const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  timeout: 15000,
});

const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [1000, 3000, 8000];

function isRetryableError(error: any): boolean {

  const method = (error?.config?.method ?? "").toUpperCase();
  if (method !== "GET") return false;

  if (error?.response?.status === 401) return false;
  if (error?.response?.status && error.response.status < 500 && error.response.status !== 408) return false;
  return (
    !error.response ||
    error?.code === "ECONNABORTED" ||
    error?.code === "ERR_NETWORK" ||
    error?.response?.status >= 500
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let isRefreshing = false;
let failedQueue: {
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: any) => void;
  config: any;
}[] = [];

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

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || !isRetryableError(error)) {
      return Promise.reject(error);
    }

    config._retryCount = config._retryCount ?? 0;
    if (config._retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    config._retryCount += 1;
    const delay = RETRY_DELAYS_MS[config._retryCount - 1] ?? 8000;
    await sleep(delay);
    return API(config);
  }
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
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
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      const tokens = await refreshAccessToken(refreshToken);
      await SecureStore.setItemAsync("auth_token", tokens.accessToken);
      await SecureStore.setItemAsync("refresh_token", tokens.refreshToken);

      const { setTokens } = useAuthStore.getState();
      setTokens(tokens.accessToken, tokens.refreshToken);

      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

      const queueToProcess = [...failedQueue];
      failedQueue = [];

      queueToProcess.forEach(async (queuedRequest) => {
        try {
          queuedRequest.config.headers.Authorization = `Bearer ${tokens.accessToken}`;
          const response = await API(queuedRequest.config);
          queuedRequest.resolve(response);
        } catch (retryError) {
          queuedRequest.reject(retryError);
        }
      });
      return API(originalRequest);
    } catch (refreshError: any) {
      failedQueue.forEach((queuedRequest) => {
        queuedRequest.reject(new Error("Token refresh failed"));
      });
      failedQueue = [];

      const isNetworkError =
        !refreshError?.response &&
        (refreshError?.code === "ECONNABORTED" ||
          refreshError?.code === "ERR_NETWORK" ||
          refreshError?.message?.includes("timeout") ||
          refreshError?.message?.includes("Network Error"));
      if (!isNetworkError) {
        const { setUser, setTokens } = useAuthStore.getState();
        setUser(null);
        setTokens(null, null);

        try {
          await SecureStore.deleteItemAsync("auth_token");
          await SecureStore.deleteItemAsync("refresh_token");
          await SecureStore.deleteItemAsync("user_data");
        } catch (storageError) {
        }

        router.replace("/signIn");
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
