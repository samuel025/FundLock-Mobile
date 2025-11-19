import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface CreatePinRequest {
  pin: string;
}

export interface CreatePinResponse {
  status: string | number;
  message: string;
  data: {};
}

export async function createWalletPin(
  data: CreatePinRequest,
): Promise<CreatePinResponse> {
  try {
    const response = await API.post<CreatePinResponse>(
      "/api/v1/fundlock/setPin",
      data,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (!axiosError.response) {
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again.",
        );
        customError.status = 0;
        throw customError;
      }
      const errorMessage =
        axiosError.response?.data?.message || "Failed to create PIN";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
