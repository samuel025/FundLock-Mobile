import { User } from "./userType";

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

export interface AuthState {
  user: User | null;
  isLoadingUser: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User | null) => void;
  setIsLoadingUser: (loading: boolean) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
}
