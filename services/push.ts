import { API } from "@/lib/api";

export async function registerExpoPushToken(token: string) {
  try {
    await API.post("/api/v1/fundlock/notifications/register", { token });
  } catch (e) {
    console.warn("Failed to register push token:", e);
  }
}
