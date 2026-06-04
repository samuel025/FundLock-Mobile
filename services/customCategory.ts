import { API } from "@/lib/api";
import axios from "axios";
import { LockRequest } from "./lock";
import { Recipient } from "./recipient";

export interface CustomCategoryWithRecipients {
  id: number;
  name: string;
  recipients: Recipient[];
  createdAt: string;
}

export async function createCustomCategory(
  name: string,
  recipients?: any[],
): Promise<{ id: string; name: string }> {
  try {
    const response = await API.post<any>("/api/v1/fundlock/custom-categories", {
      name,
      recipients,
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to create custom category",
      );
    }
    throw new Error("An unexpected error occurred.");
  }
}

export async function getMyCustomCategories(): Promise<
  CustomCategoryWithRecipients[]
> {
  try {
    const response = await API.get<any>("/api/v1/fundlock/custom-categories");
    const payload = response?.data?.data ?? {};
    let list: any[] = [];
    if (Array.isArray(payload)) list = payload;
    else if (Array.isArray(payload.customCategories))
      list = payload.customCategories;
    else if (Array.isArray(payload.data)) list = payload.data;
    else list = [];
    return list.map((c: any) => ({
      id: c.id,
      name: c.name,
      recipients: Array.isArray(c.recipients) ? c.recipients : [],
      createdAt: c.createdAt,
    }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch custom categories",
      );
    }
    throw new Error("An unexpected error occurred.");
  }
}

export async function lockCustomFunds(
  data: Omit<LockRequest, "category_id"> & { customCategoryId: string },
): Promise<string> {
  try {
    const response = await API.post<any>(
      "/api/v1/fundlock/custom-categories/lock",
      data,
    );
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data.message || "Failed to lock custom funds";
      const customError: any = new Error(errorMessage);
      customError.status = error.response.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred.");
  }
}
