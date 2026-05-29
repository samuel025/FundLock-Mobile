import { API } from "@/lib/api";
import axios from "axios";
import { LockRequest } from "./lock";

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
