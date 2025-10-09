export interface AuthResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export type LoginResponse = {
  status: string;
  message: string;
  data: {
    loginResponse: {
      email: string;
      accessToken: string;
      refreshToken: string;
      role: string;
    };
  };
};
