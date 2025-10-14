import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";

export interface ErrorResponse {
  status: string;
  message: string;
  data: {
    error: string;
  };
}

export interface WalletDetails {
  balance: string;
  totalLockedAmount: string;
  totalRedeemedAmount: string;
  walletNumber: string;
}

export interface ApiResponse<T> {
  status: string | number;
  message: string;
  data: T;
}

export async function getWalletDetails(): Promise<WalletDetails> {
  try {
    const response = await API.get<ApiResponse<WalletDetails>>(
      "/api/v1/fundlock/wallet-details"
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (!axiosError.response) {
        console.error("Network error while fetching profile");
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again."
        );
        customError.status = 0;
        throw customError;
      }

      const errorMessage =
        axiosError.response?.data?.message || "Failed to fetch wallet details";

      console.error("Failed to fetch wallet details:", errorMessage);
      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}

export interface Transaction {
  entryType: string;
  createdAt: string;
  recipientWalletNumber: string;
  amount: number;
  transactionReference: string;
  type: string;
  status: string;
  recipientName: string;
}

export interface WalletData {
  currentPage: number;
  totalElements: number;
  hasNext: boolean;
  totalPages: number;
  size: number;
  walletNumber: string;
  hasPrevious: boolean;
  transactions: Transaction[];
}

export interface WalletResponse {
  status: string;
  message: string;
  data: WalletData;
}

export async function getWalletTransactions(): Promise<Transaction[]> {
  try {
    const response = await API.get<ApiResponse<WalletData>>(
      "api/v1/fundlock/wallet-transactions"
    );
    return response.data.data.transactions;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (!axiosError.response) {
        console.error("Network error while fetching transactions");
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again."
        );
        customError.status = 0;
        throw customError;
      }

      const errorMessage =
        axiosError.response?.data?.message || "Failed to fetch transactions";

      console.error("Failed to fetch transactions:", errorMessage);
      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
