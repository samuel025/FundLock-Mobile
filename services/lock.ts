import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface LockRequest {
  amountLocked: string;
  category_id: string;
  expiresAt: string;
  pin: string;
}

export interface Lock {
  LockDetails: string;
  Category: string;
}

export interface LockResponse {
  status: string;
  message: string;
  data: Lock;
}

export async function postLock(data: LockRequest): Promise<string> {
  try {
    const response = await API.post<LockResponse>(
      "/api/v1/fundlock/lockfunds",
      data
    );
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (!axiosError.response) {
        console.error("Network error while posting lock");
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again."
        );
        customError.status = 0;
        throw customError;
      }

      const errorMessage =
        axiosError.response?.data?.message || "Failed to post lock";

      console.error("Failed to post lock:", errorMessage);
      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
