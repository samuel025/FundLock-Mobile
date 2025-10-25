import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface LockRequest {
  amount: string;
  outletId: string;
  pin: string;
}

export interface Details {
  categoryId: string;
  amountLocked: string;
  amountRedeemed: string;
  expiresAt: string;
  receiverWallet: string;
}

export interface SpendResponse {
  status: string;
  message: string;
  data: Details;
}

export async function postSpend(data: LockRequest): Promise<string> {
  try {
    const response = await API.post<SpendResponse>(
      "/api/v1/fundlock/redeem-locked-funds",
      data
    );
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (!axiosError.response) {
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again."
        );
        customError.status = 0;
        throw customError;
      }

      const errorMessage =
        axiosError.response?.data?.message || "Failed to spend funds";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
