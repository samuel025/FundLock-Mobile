import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./wallet";

export interface Outlets {
  id: string;
  name: string;
  orgId?: string;
}

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
      orgId: it.orgId,
    }));
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
        axiosError.response?.data?.message || "Failed to fetch outlets";
      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}

export interface OutletByOrgId {
  id: string;
  name: string;
  address: string;
  state: string;
}

type OutletByOrgIdResponse = {
  status: string;
  message: string;
  data: OutletByOrgId;
};

export async function getOutletByOrgId(orgId: string): Promise<OutletByOrgId> {
  try {
    const url = `/api/v1/fundlock/outlet/${orgId}`;
    const response = await API.get<OutletByOrgIdResponse>(url);
    return response.data.data;
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
        axiosError.response?.data?.message || "Failed to fetch outlet";
      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again");
  }
}
