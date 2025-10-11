import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";

type ProfileData = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

type ProfileResponse = {
  status: string;
  message: string;
  data: {
    Profile: ProfileData;
  };
};

type ErrorResponse = {
  status: string;
  message: string;
  data: {
    error: string;
  };
};

export async function getProfile(): Promise<ProfileResponse> {
  try {
    const response = await API.get<ProfileResponse>("/api/v1/fundlock/profile");

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Network error (no response from server)
      if (!axiosError.response) {
        console.error("Network error while fetching profile");
        const customError: any = new Error(
          "Network error. Please check your internet connection and try again."
        );
        customError.status = 0;
        throw customError;
      }

      // Server responded with an error
      const errorMessage =
        axiosError.response?.data?.message || "Failed to fetch profile";

      console.error("Failed to fetch profile:", errorMessage);
      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }

    console.error("Failed to fetch profile:", error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
