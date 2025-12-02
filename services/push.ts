import { API } from "@/lib/api";

export async function registerExpoPushToken(token: string) {
  // Adjust to your backend route and payload shape
  // Example: POST /notifications/register { token }
  try {
    await API.post("/notifications/register", { token });
  } catch (e) {
    console.warn("Failed to register push token:", e);
  }
}
