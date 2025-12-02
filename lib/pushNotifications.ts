import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

export async function registerForPushNotificationsAsync() {
  // Android: ensure a channel exists
  if (Device.osName === "Android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  let status = (await Notifications.getPermissionsAsync()).status;
  if (status !== "granted") {
    status = (await Notifications.requestPermissionsAsync()).status;
  }
  if (status !== "granted") {
    console.warn("Push notification permission not granted");
    return { token: null, status };
  }

  // SDK 49+: projectId may be required in dev/builds
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId ??
    undefined;

  const tokenResp = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined
  );

  const token = tokenResp.data;
  console.log("Expo push token:", token);
  return { token, status };
}

export function initializeNotificationListeners() {
  const receivedSub = Notifications.addNotificationReceivedListener((n) => {
    console.log("Notification received:", n.request.content);
  });
  const responseSub = Notifications.addNotificationResponseReceivedListener(
    (resp) => {
      console.log("Notification response:", resp);
    }
  );
  return [receivedSub, responseSub];
}