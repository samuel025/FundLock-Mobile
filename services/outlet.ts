import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface Outlets {
  id: string;
  name: string;
  // optional metadata (may be undefined depending on API)
  companyId?: string;
  companyName?: string;
}

// now accepts optional companyId and optional categoryId
export async function getOutlets(
  companyId?: string,
  categoryId?: string
): Promise<Outlets[]> {
  try {
    const url = companyId
      ? `/api/v1/fundlock/companies/outlets/${companyId}`
      : `/api/v1/fundlock/outlets/${categoryId}`;

    const response = await API.get<any>(url);
    const payload = response?.data?.data ?? {};

    let list: any[] = [];
    if (Array.isArray(payload)) list = payload;
    else if (Array.isArray((payload as any).outlets))
      list = (payload as any).outlets;
    else if (Array.isArray((payload as any).data)) list = (payload as any).data;
    else list = [];

    return list.map((it) => ({
      id: String(it.id),
      name: it.name,
      companyId:
        it.companyId != null
          ? String(it.companyId)
          : it.company?.id != null
          ? String(it.company.id)
          : undefined,
      companyName: it.companyName ?? it.company?.name,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (!axiosError.response) {
        console.error("Network error while fetching outlets");
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again."
        );
        customError.status = 0;
        throw customError;
      }
      const errorMessage =
        axiosError.response?.data?.message || "Failed to fetch outlets";
      console.error("Failed to fetch outlets:", errorMessage);
      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
