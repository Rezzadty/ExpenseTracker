import "dotenv/config";

export default {
  expo: {
    name: "ExpenseTracker",
    slug: "ExpenseTracker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/icon.png",
    scheme: "expensetracker",
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/icons/icon.png",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#000000",
        foregroundImage: "./assets/icons/icon.png",
        backgroundImage: "./assets/icons/icon.png",
        monochromeImage: "./assets/icons/icon.png",
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/icons/icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#000000",
          image: "./assets/icons/icon.png",
          imageWidth: 76,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
