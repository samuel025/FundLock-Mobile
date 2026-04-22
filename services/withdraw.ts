import { API } from "@/lib/api";
import { AxiosError, isAxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface WithdrawRequest {
  amount: string;
  pin: string;
}

export interface WithdrawResponse {
  status: string;
  message: string;
  data: {};
}

interface WithdrawRequestOptions {
  idempotencyKey?: string;
}

export async function postWithdraw(
  data: WithdrawRequest,
  options?: WithdrawRequestOptions,
): Promise<WithdrawResponse> {
  try {
    const response = await API.post<WithdrawResponse>(
      "/api/v1/fundlock/withdraw",
      data,
      {
        headers: options?.idempotencyKey
          ? { "Idempotency-Key": options.idempotencyKey }
          : undefined,
      },
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (!axiosError.response) {
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again.",
        );
        customError.status = 0;
        throw customError;
      }

      const errorMessage =
        axiosError.response?.data?.message || "Failed to make withdrawal";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
