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

export interface Recipient {
  id: number;
  categoryId: number;
  categoryType: "SYSTEM" | "CUSTOM";
  vendorName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
}

export interface RedeemToRecipientRequest {
  recipientId: number;
  amount: number;
  pin: string;
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

export async function getRecipients(
  categoryId: string | number,
  categoryType: "SYSTEM" | "CUSTOM",
): Promise<Recipient[]> {
  try {
    const response = await API.get<any>(
      `/api/v1/fundlock/recipients?categoryId=${categoryId}&categoryType=${categoryType}`,
    );
    const payload = response?.data?.data ?? {};
    let list: any[] = [];
    if (Array.isArray(payload)) list = payload;
    else if (Array.isArray(payload.recipients)) list = payload.recipients;
    else list = [];
    return list.map((r: any) => ({
      id: r.id,
      categoryId: r.categoryId,
      categoryType: r.categoryType,
      vendorName: r.vendorName,
      accountNumber: r.accountNumber,
      bankCode: r.bankCode,
      bankName: r.bankName,
      accountName: r.accountName,
    }));
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
        axiosError.response?.data?.message || "Failed to fetch recipients";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}

export async function redeemToRecipient(
  data: RedeemToRecipientRequest,
): Promise<string> {
  try {
    const response = await API.post<any>(
      "/api/v1/fundlock/recipients/redeem",
      data,
    );
    return response.data.message;
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
        axiosError.response?.data?.message ||
        "Failed to send funds to recipient";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
