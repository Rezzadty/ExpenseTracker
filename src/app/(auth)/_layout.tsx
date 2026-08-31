// Auth group layout — no tabs, plain stack for login/register screens.
import { Stack } from "expo-router";

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
