// Root layout — loads fonts, holds splash screen, redirects based on auth state.
import { ExpensesProvider, useExpenses } from "@/hooks/use-expenses";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

function RootContent() {
  const { isDark } = useExpenses();
  // ponytail: replace with onAuthStateChanged listener when Firebase is wired
  const [isLoggedIn] = useState(false);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuth = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuth) {
      router.replace("/(auth)/login");
    } else if (isLoggedIn && inAuth) {
      router.replace("/(tabs)/index");
    }
  }, [isLoggedIn, segments, router]);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "DMSans-Regular": DMSans_400Regular,
    "DMSans-Medium": DMSans_500Medium,
    "DMSans-SemiBold": DMSans_600SemiBold,
    "DMSans-Bold": DMSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <ExpensesProvider>
      <RootContent />
    </ExpensesProvider>
  );
}
