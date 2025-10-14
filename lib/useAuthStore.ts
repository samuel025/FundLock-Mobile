import { User } from "@/types/userType";
import { create } from "zustand";

export interface AuthState {
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
