import { SignInFormData } from "@/app/signIn";
import { signUpFormData } from "@/app/signUp";
import { LoginResponse } from "@/types/Response";

// Update the response types to match your API
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

export async function loginUser(data: SignInFormData): Promise<LoginResponse> {
  try {
    const response = await fetch(
      `https://4315e57d4ac1.ngrok-free.app/api/v1/fundlock/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: LoginResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function signUpUser(
  data: signUpFormData
): Promise<SignUpResponse> {
  try {
    const response = await fetch(
      `https://4315e57d4ac1.ngrok-free.app/api/v1/fundlock/register`,
      {
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
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: SignUpResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Sign up failed:", error);
    throw error;
  }
}
