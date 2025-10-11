import { AuthState } from "@/types/Response";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoadingUser: false,
  accessToken: null,
  refreshToken: null,
  setUser: (user) => set({ user }),
  setIsLoadingUser: (loading) => set({ isLoadingUser: loading }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
}));
