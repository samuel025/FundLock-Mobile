import { SignInFormData } from "@/app/signIn";
import { signUpFormData } from "@/app/signUp";
import { API } from "@/lib/api";
import { LoginResponse } from "@/types/Response";
import axios, { AxiosError } from "axios";

type UserData = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

type SignUpResponse = {
  status: string;
  message: string;
  data: {
    User: UserData;
  };
};

// Broaden to match backend error payloads like: { status: "90", message: "...", data: null }
type ErrorResponse = {
  status?: string; // backend "status" (e.g. "90")
  message?: string;
  data?: any;
};

export type VerifyOtpRequest = {
  email: string;
  otpCode: string; // 7 digits
};

export type BasicApiResponse = {
  status: string;
  message: string;
  data: any;
};

export async function loginUser(data: SignInFormData): Promise<LoginResponse> {
  try {
    const response = await API.post<LoginResponse>("/api/v1/fundlock/login", {
      email: data.email,
      password: data.password,
    });

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

      const apiStatus = axiosError.response?.data?.status; // e.g. "90"
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.data?.error ||
        "An error occurred during login";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status; // HTTP status code
      customError.apiStatus = apiStatus; // backend "status" string like "90"
      throw customError;
    }

    throw new Error("An unexpected error occurred. Please try again.");
  }
}

export async function signUpUser(
  data: signUpFormData
): Promise<SignUpResponse> {
  try {
    const response = await API.post<SignUpResponse>(
      "/api/v1/fundlock/register",
      {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (!axiosError.response) {
        console.error("Network error during sign up");
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again."
        );
        customError.status = 0;
        throw customError;
      }

      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.data?.error ||
        "An error occurred during sign up";

      console.error("Sign up failed:", errorMessage);
      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      customError.apiStatus = axiosError.response?.data?.status;
      throw customError;
    }

    console.error("Sign up failed:", error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
}

// Verify OTP
export async function verifyOtp(
  payload: VerifyOtpRequest
): Promise<BasicApiResponse> {
  try {
    const response = await API.post<BasicApiResponse>(
      "/api/v1/fundlock/verifyOtp",
      payload
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
        axiosError.response?.data?.message ||
        axiosError.response?.data?.data?.error ||
        "Failed to verify OTP";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      customError.apiStatus = axiosError.response?.data?.status;
      throw customError;
    }

    throw new Error("An unexpected error occurred. Please try again.");
  }
}

// Resend OTP
export async function resendOtp(email: string): Promise<BasicApiResponse> {
  try {
    // backend: /api/v1/fundlock/resendOtp/{email}
    const response = await API.post<BasicApiResponse>(
      `/api/v1/fundlock/resendOtp/${encodeURIComponent(email)}`,
      {}
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
        axiosError.response?.data?.message ||
        axiosError.response?.data?.data?.error ||
        "Failed to resend OTP";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      customError.apiStatus = axiosError.response?.data?.status;
      throw customError;
    }

    throw new Error("An unexpected error occurred. Please try again.");
  }
}
