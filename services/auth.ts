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

type ErrorResponse = {
  status: string;
  message: string;
  data: {
    error: string;
  };
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

      // Network error (no response from server)
      if (!axiosError.response) {
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again.",
        );
        customError.status = 0;
        throw customError;
      }

      // Server responded with an error
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.data?.error ||
        "An error occurred during login";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }

    // Non-Axios error
    throw new Error("An unexpected error occurred. Please try again.");
  }
}

export async function signUpUser(
  data: signUpFormData,
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
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Network error (no response from server)
      if (!axiosError.response) {
        console.error("Network error during sign up");
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again.",
        );
        customError.status = 0;
        throw customError;
      }

      // Server responded with an error
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.data?.error ||
        "An error occurred during sign up";

      console.error("Sign up failed:", errorMessage);
      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }

    console.error("Sign up failed:", error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
