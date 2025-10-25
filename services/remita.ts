import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface VirtualAccountDetails {
  account_number: string;
  bank_name: string;
}

export interface RemitaGetVirtualAccountResponse {
  status: string;
  message: string;
  data: VirtualAccountDetails;
}

export async function getVirtualAccountDetails(): Promise<VirtualAccountDetails> {
  try {
    const response = await API.get<RemitaGetVirtualAccountResponse>(
      "/api/v1/fundlock/remitaVirtualAccountDetails"
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
        axiosError.response?.data?.message || "Failed to get details";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}

export async function createRemitaVirtualAccount(): Promise<VirtualAccountDetails> {
  try {
    const response = await API.post<RemitaGetVirtualAccountResponse>(
      "/api/v1/fundlock/createRemitaVirtualAccount"
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
        axiosError.response?.data?.message ||
        "Failed to create virtual account";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
