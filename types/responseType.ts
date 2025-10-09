export interface loginResponse {
  sataus: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}
