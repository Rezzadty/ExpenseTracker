// Root layout — loads DM Sans fonts, holds splash screen until ready, provides dynamic theme and tabs.
import { Fonts } from "@/constants/theme";
import { ExpensesProvider, useExpenses } from "@/hooks/use-expenses";
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

function RootNavigator() {
  const { colors, isDark } = useExpenses();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarPosition: "bottom",
          tabBarLabelPosition: "below-icon",
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            height: 70,
            paddingTop: 8,
            paddingBottom: 8,
            elevation: 8,
          },
          animation: "fade",
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontFamily: Fonts.sans,
            fontSize: 11,
            marginTop: 2,
          },
          sceneStyle: { backgroundColor: colors.background },
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
      <RootNavigator />
    </ExpensesProvider>
  );
}
