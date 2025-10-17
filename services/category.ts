import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface Categories {
  id: string;
  name: string;
}

export async function getCategories(): Promise<Categories[]> {
  try {
    const response = await API.get<any>("/api/v1/fundlock/categories");
    const payload = response?.data?.data ?? {};

    //explain
    let list: any[] = [];
    if (Array.isArray(payload)) list = payload;
    else if (Array.isArray(payload.categoryId)) list = payload.categoryId;
    else if (Array.isArray(payload.data)) list = payload.data;
    else list = [];
    return list.map((it) => ({ id: String(it.id), name: it.name }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (!axiosError.response) {
        console.error("Network error while fetching transactions");
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again."
        );
        customError.status = 0;
        throw customError;
      }

      const errorMessage =
        axiosError.response?.data?.message || "Failed to fetch transactions";

      console.error("Failed to fetch transactions:", errorMessage);
      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
