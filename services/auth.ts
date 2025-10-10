import { SignInFormData } from "@/app/signIn";
import { signUpFormData } from "@/app/signUp";
import { LoginResponse } from "@/types/Response";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL!;

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
    const response = await fetch(`${BASE_URL}/api/v1/fundlock/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      const errorMessage =
        errorData.message || `HTTP error! status: ${response.status}`;
      const error: any = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    const result: LoginResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function signUpUser(
  data: signUpFormData
): Promise<SignUpResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/fundlock/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        pin: data.pin,
        phoneNumber: data.phoneNumber,
      }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      const error: any = new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
      error.status = response.status;
      throw error;
    }

    const result: SignUpResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Sign up failed:", error);
    throw error;
  }
}
