import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface Bank {
  name: string;
  slug: string;
  code: string;
  nibss_bank_code: string;
  country: string;
}

export interface BankListData {
  status: boolean;
  message: string;
  data: Bank[];
}

export interface BankListResponse {
  status: string;
  message: string;
  data: {
    "Bank-List": BankListData;
  };
}

export interface SaveBankDetailsRequest {
  bankCode: string;
  bankAccountNumber: string;
}

export interface SaveBankDetailsResponse {
  status: string;
  message: string;
  data: {};
}

export interface VerifyAccountRequest {
  bank: string;
  account: string;
}

export interface VerifyAccountResponse {
  status: boolean;
  message: string;
  data: {
    bank_name: string;
    bank_code: string;
    account_number: string;
    account_name: string;
  };
}

export async function getKoraBankList(): Promise<Bank[]> {
  try {
    const response = await API.get<BankListResponse>(
      "/api/v1/fundlock/koraBankList"
    );
    return response.data.data["Bank-List"].data;
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
        axiosError.response?.data?.message || "Failed to fetch bank list";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}

export async function saveBankDetails(
  data: SaveBankDetailsRequest
): Promise<SaveBankDetailsResponse> {
  try {
    const response = await API.post<SaveBankDetailsResponse>(
      "/api/v1/fundlock/saveBankDetails",
      data
    );
    return response.data;
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
        axiosError.response?.data?.message || "Failed to save bank details";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}

export async function verifyKoraBankAccount(
  data: VerifyAccountRequest
): Promise<string> {
  try {
    const response = await axios.post<VerifyAccountResponse>(
      "https://api.korapay.com/merchant/api/v1/misc/banks/resolve",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.account_name;
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
        axiosError.response?.data?.message || "Failed to verify account";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
