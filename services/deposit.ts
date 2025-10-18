import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface DepositRequest {
  amount: string;
  pin: string;
}

export interface authorizationURL {
  authorization_url: string;
}

export interface DepositResponse {
  status: string;
  message: string;
  data: authorizationURL;
}

export async function postDeposit(
  data: DepositRequest
): Promise<authorizationURL> {
  try {
    const response = await API.post<DepositResponse>(
      "/api/v1/fundlock/deposit-paystack",
      data
    );
    return response.data.data;
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
        axiosError.response?.data?.message || "Failed to post lock";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
