import { API } from "@/lib/api";
import { AxiosError, isAxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface SpendRequest {
  amount: string;
  outletId: string;
  pin: string;
}

export interface SpendByOrgIdRequest {
  amount: number;
  orgId: string;
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

interface IdempotencyRequestOptions {
  idempotencyKey?: string;
}

export async function postSpend(
  data: SpendRequest,
  options?: IdempotencyRequestOptions,
): Promise<string> {
  try {
    const response = await API.post<SpendResponse>(
      "/api/v1/fundlock/redeem-locked-funds",
      data,
      {
        headers: options?.idempotencyKey
          ? { "Idempotency-Key": options.idempotencyKey }
          : undefined,
      },
    );
    return response.data.message;
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
        axiosError.response?.data?.message || "Failed to spend funds";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}

export async function postSpendByOrgId(
  data: SpendByOrgIdRequest,
  options?: IdempotencyRequestOptions,
): Promise<string> {
  try {
    const response = await API.post<SpendResponse>(
      "/api/v1/fundlock/redeemFundsByOrgId",
      data,
      {
        headers: options?.idempotencyKey
          ? { "Idempotency-Key": options.idempotencyKey }
          : undefined,
      },
    );
    return response.data.message;
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
        axiosError.response?.data?.message || "Failed to spend funds";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
