// Root layout — loads fonts, holds splash screen, redirects based on auth state.
import { auth } from "@/lib/firebase";
import { ExpensesProvider, useExpenses } from "@/hooks/use-expenses";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { onAuthStateChanged } from "firebase/auth";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

function RootContent() {
  const { isDark } = useExpenses();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isLoggedIn === null) return;
    const inAuth = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuth) {
      router.replace("/(auth)/login");
    }
  }, [isLoggedIn, segments, router]);

  if (isLoggedIn === null) return null;

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
