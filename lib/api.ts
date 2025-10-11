import axios from "axios";

export const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
});

API.interceptors.request.use((config) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { accessToken } = require("./useAuthStore").useAuthStore.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
