// Root layout — loads DM Sans fonts, holds splash screen until ready, sets dark status bar.
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { ExpensesProvider } from "@/hooks/use-expenses";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Image } from "react-native";

SplashScreen.preventAutoHideAsync();

const icons = {
  dashboard: require("@/assets/icons/dasboard_icon.png"),
  expenses: require("@/assets/icons/expense_icon.png"),
  statistics: require("@/assets/icons/statistics_icon.png"),
  settings: require("@/assets/icons/settings_icon.png"),
};

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
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            paddingBottom: 28,
            paddingTop: Spacing.sm,
          },
          tabBarActiveTintColor: Colors.accent,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: {
            fontFamily: Fonts.sans,
            fontSize: 12,
          },
          sceneStyle: { backgroundColor: Colors.background },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <Image
                source={icons.dashboard}
                style={{ width: 20, height: 20 }}
                tintColor={color}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: "Expenses",
            tabBarIcon: ({ color }) => (
              <Image
                source={icons.expenses}
                style={{ width: 20, height: 20 }}
                tintColor={color}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            title: "Statistics",
            tabBarIcon: ({ color }) => (
              <Image
                source={icons.statistics}
                style={{ width: 20, height: 20 }}
                tintColor={color}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Image
                source={icons.settings}
                style={{ width: 20, height: 20 }}
                tintColor={color}
                resizeMode="contain"
              />
            ),
          }}
        />
      </Tabs>
    </ExpensesProvider>
  );
}
