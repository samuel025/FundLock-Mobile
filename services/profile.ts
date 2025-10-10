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

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL!;

export async function getProfile(token: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/fundlock/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error: any = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const result: ProfileResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }
}
