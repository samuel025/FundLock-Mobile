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

export async function getProfile(token: string) {
  try {
    const response = await fetch(
      `https://4315e57d4ac1.ngrok-free.app/api/v1/fundlock/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authentication header if needed
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ProfileResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }
}
