import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ExpensesProvider, useExpenses } from "@/hooks/use-expenses";
import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

function RootContent() {
  const { isDark } = useExpenses();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)/login");
    }
  }, [loading, user, router]);

  if (loading) return null;

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "GoogleSansFlex": require("../../assets/fonts/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <AuthProvider>
      <ExpensesProvider>
        <RootContent />
      </ExpensesProvider>
    </AuthProvider>
  );
}
