import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface Companies {
  id: string;
  name: string;
}

export async function getCompanies(id: string): Promise<Companies[]> {
  try {
    const response = await API.get<any>("/api/v1/fundlock/companies/" + id);
    const payload = response?.data?.data ?? {};

    let list: any[] = [];
    if (Array.isArray(payload)) list = payload;
    else if (Array.isArray((payload as any).companies))
      list = (payload as any).companies;
    else if (Array.isArray((payload as any).data)) list = (payload as any).data;
    else list = [];
    return list.map((it) => ({ id: String(it.id), name: it.name }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (!axiosError.response) {
        console.error("Network error while fetching companies");
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again."
        );
        customError.status = 0;
        throw customError;
      }

      const errorMessage =
        axiosError.response?.data?.message || "Failed to fetch companies";

      console.error("Failed to fetch companies:", errorMessage);
      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
