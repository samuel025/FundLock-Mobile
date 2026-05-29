import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface LockRequest {
  amountLocked: string;
  category_id: string;
  expiresAt: string;
  pin: string;
  recipients?: {
    vendorName: string;
    accountNumber: string;
    bankCode: string;
  }[];
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
        axiosError.response?.data?.message || "Failed to post lock";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}

export interface Locks {
  categoryName: string;
  amount: string;
  expiresAt: string;
}

export interface GetLocksResponse {
  status: string;
  message: string;
  data: Locks[];
}

export async function getLocks(): Promise<Locks[]> {
  try {
    const response = await API.get<any>("/api/v1/fundlock/locks");
    const payload = response?.data?.data ?? {};
    let list: any[] = [];
    if (Array.isArray(payload)) list = payload;
    else if (Array.isArray((payload as any).locks))
      list = (payload as any).locks;
    else if (Array.isArray((payload as any).data)) list = (payload as any).data;
    else list = [];
    return list.map((it) => ({
      categoryName: String(it.categoryName),
      amount: it.amount,
      expiresAt: it.expiresAt,
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
        axiosError.response?.data?.message || "Failed to post lock";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
