import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";

export interface UpdateBvnRequest {
  bvn: string;
}

export interface BvnResponse {
  status: string;
  message: string;
  data: {};
}

type ErrorResponse = {
  status: string;
  message: string;
  data: {
    error: string;
  };
};

export async function updateBvn(bvn: string): Promise<BvnResponse> {
  try {
    const response = await API.post<BvnResponse>("/api/v1/fundlock/setBvn", {
      bvn,
    });
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
        axiosError.response?.data?.message || "Failed to update BVN";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
