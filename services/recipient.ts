import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface SaveRecipientRequest {
  categoryId: number | string;
  categoryType: "SYSTEM" | "CUSTOM";
  vendorName: string;
  accountNumber: string;
  bankCode: string;
}

export async function saveRecipient(data: SaveRecipientRequest): Promise<any> {
  try {
    const response = await API.post("/api/v1/fundlock/recipients", data);
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
        axiosError.response?.data?.message || "Failed to save vendor account";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
