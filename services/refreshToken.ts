import axios, { AxiosError } from "axios";

interface RefreshTokenResponse {
  status: string;
  message: string;
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  try {
    const response = await axios.post<RefreshTokenResponse>(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/fundlock/refresh-token`,
      { refreshToken }
    );
    console.log(response.data);
    return response.data.data.tokens;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to refresh token";
      console.error("Token refresh failed:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred during token refresh");
  }
}
