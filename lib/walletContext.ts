import { getWalletDetails, WalletDetails } from "@/services/wallet";
import { walletStore } from "./walletStore";

export const walletActions = {
  getwalletDetails: async () => {
    const {
      setBalance,
      setIsLoading,
      setTotalLockedAmount,
      setWalletNumber,
      setTotalRedeemedAmount,
    } = walletStore.getState();
    try {
      setIsLoading(true);
      const response = await getWalletDetails();
      const walletdata: WalletDetails = {
        balance: response.balance.toString(),
        totalLockedAmount: response.totalLockedAmount.toString(),
        totalRedeemedAmount: response.totalRedeemedAmount.toString(),
        walletNumber: response.walletNumber,
        hasPin: response.hasPin,
      };
      setBalance(walletdata.balance);
      setTotalLockedAmount(walletdata.totalLockedAmount);
      setWalletNumber(walletdata.walletNumber);
      setTotalRedeemedAmount(walletdata.totalRedeemedAmount);
      return walletdata;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  },
};
