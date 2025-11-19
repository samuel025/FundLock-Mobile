import { create } from "zustand";

export interface WalletState {
  balance: string | null;
  totalLockedAmount: string | null;
  totalRedeemedAmount: string | null;
  walletNumber: string | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setBalance: (balance: string | null) => void;
  setTotalLockedAmount: (totalLockedAmount: string | null) => void;
  setTotalRedeemedAmount: (totalRedeemedAmount: string | null) => void;
  setWalletNumber: (walletNumber: string | null) => void;
  hasPin: boolean;
  setHasPin: (hasPin: boolean) => void;
}

export const walletStore = create<WalletState>((set) => ({
  balance: null,
  totalLockedAmount: null,
  totalRedeemedAmount: null,
  walletNumber: null,
  isLoading: false,
  hasPin: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  setBalance: (balance) => set({ balance }),
  setTotalLockedAmount: (totalLockedAmount) => set({ totalLockedAmount }),
  setTotalRedeemedAmount: (totalRedeemedAmount) => set({ totalRedeemedAmount }),
  setWalletNumber: (walletNumber) => set({ walletNumber }),
  setHasPin: (hasPin) => set({ hasPin }),
}));
