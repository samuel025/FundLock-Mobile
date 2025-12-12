import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";

export interface NetworkProvider {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

export interface DataBundle {
  id: string;
  name: string;
  amount: string;
  validity: string;
  networkCode: string;
}

export interface NetworkProvidersResponse {
  status: string;
  message: string;
  data: NetworkProvider[];
}

export interface DataBundlesResponse {
  status: string;
  message: string;
  data: DataBundle[];
}

export interface PurchaseAirtimeRequest {
  amount: string;
  phoneNumber: string;
  networkCode: string;
  pin: string;
  categoryId: string;
}

export interface PurchaseDataRequest {
  bundleId: string;
  phoneNumber: string;
  networkCode: string;
  pin: string;
  categoryId: string;
}

export interface PurchaseResponse {
  status: string;
  message: string;
  data: {
    transactionId: string;
    amount: string;
    phoneNumber: string;
    networkProvider: string;
    timestamp: string;
  };
}

interface ErrorResponse {
  status: string;
  message: string;
  data: {
    error: string;
  };
}

export async function getNetworkProviders(): Promise<NetworkProvider[]> {
  try {
    const response = await axios.get<NetworkProvidersResponse>(
      `${API}/bill-payment/networks`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.data?.error ||
        "Failed to fetch network providers";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getDataBundles(
  networkCode: string
): Promise<DataBundle[]> {
  try {
    const response = await axios.get<DataBundlesResponse>(
      `${API}/bill-payment/data-bundles/${networkCode}`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.data?.error ||
        "Failed to fetch data bundles";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function purchaseAirtime(
  request: PurchaseAirtimeRequest
): Promise<PurchaseResponse> {
  try {
    const response = await axios.post<PurchaseResponse>(
      `${API}/bill-payment/airtime`,
      request,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.data?.error ||
        "Failed to purchase airtime";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function purchaseData(
  request: PurchaseDataRequest
): Promise<PurchaseResponse> {
  try {
    const response = await axios.post<PurchaseResponse>(
      `${API}/bill-payment/data`,
      request,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.data?.error ||
        "Failed to purchase data";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
}
