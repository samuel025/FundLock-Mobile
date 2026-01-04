import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";

// Response types following your app conventions
export interface Companies {
  id: string;
  name: string;
}

export interface Outlets {
  id: string;
  name: string;
  orgId?: string;
}

export interface SearchCompaniesResponse {
  status: string;
  message: string;
  data: Companies[];
}

export interface SearchOutletsResponse {
  status: string;
  message: string;
  data: Outlets[];
}

interface ErrorResponse {
  status: string;
  message: string;
  data: {
    error: string;
  };
}

export async function searchCompanies(
  categoryId: string,
  query: string
): Promise<Companies[]> {
  try {
    const response = await API.get<SearchCompaniesResponse>(
      "/api/v1/fundlock/companies/search",
      {
        params: {
          categoryId,
          q: query,
        },
      }
    );

    // Handle various response structures
    const payload = response?.data?.data ?? [];
    if (Array.isArray(payload)) {
      return payload.map((item: any) => ({
        id: String(item.id),
        name: item.name,
      }));
    }
    return [];
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
        axiosError.response?.data?.data?.error ||
        "Failed to search companies";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
}

export async function searchOutlets(
  query: string,
  categoryId?: string,
  companyId?: string
): Promise<Outlets[]> {
  try {
    const params: Record<string, string> = { q: query };
    if (categoryId) params.categoryId = categoryId;
    if (companyId) params.companyId = companyId;

    const response = await API.get<SearchOutletsResponse>(
      "/api/v1/fundlock/outlets/search",
      {
        params,
      }
    );

    // Handle various response structures
    const payload = response?.data?.data ?? [];
    if (Array.isArray(payload)) {
      return payload.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        orgId: item.orgId,
      }));
    }
    return [];
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
        axiosError.response?.data?.data?.error ||
        "Failed to search outlets";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
