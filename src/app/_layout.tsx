// Root layout — loads DM Sans fonts, holds splash screen until ready, sets dark status bar.
import { Colors, Fonts } from "@/constants/theme";
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
  analytics: require("@/assets/icons/analytics_icon.png"),
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
          tabBarShowLabel: true,
          tabBarPosition: "bottom",
          tabBarLabelPosition: "below-icon",
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            height: 70,
            paddingTop: 8,
            paddingBottom: 8,
            elevation: 8,
          },
          animation: "fade",
          transitionSpec: {
            animation: "timing",
            config: { duration: 300 },
          },
          tabBarActiveTintColor: Colors.accent,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: {
            fontFamily: Fonts.sans,
            fontSize: 11,
            marginTop: 2,
          },
          sceneStyle: { backgroundColor: Colors.background },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarLabel: "Dashboard",
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
            tabBarLabel: "Expenses",
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
          name="analytics"
          options={{
            title: "Analytics",
            tabBarLabel: "Analytics",
            tabBarIcon: ({ color }) => (
              <Image
                source={icons.analytics}
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
            tabBarLabel: "Settings",
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
