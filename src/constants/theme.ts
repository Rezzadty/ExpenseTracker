// Design system — color palettes, typography, spacing, and shape tokens.
import { Platform } from "react-native";

export interface ColorTheme {
  background: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  textOnAccent: string;
  danger: string;
  warning: string;
  track: string;
}

export const DarkColors: ColorTheme = {
  background: "#0B0F0E",
  surface: "#131917",
  surfaceRaised: "#1B2320",
  border: "rgba(235,255,249,0.08)",
  textPrimary: "#EDF4F1",
  textSecondary: "#93A39D",
  textMuted: "#5F6E68",
  accent: "#00D9A3",
  accentSoft: "rgba(0,217,163,0.12)",
  textOnAccent: "#04241B",
  danger: "#FF6B6B",
  warning: "#FFC24D",
  track: "rgba(255,255,255,0.08)",
};

export const LightColors: ColorTheme = {
  background: "#F5F8F6",
  surface: "#FFFFFF",
  surfaceRaised: "#EDF3F0",
  border: "rgba(4,36,27,0.08)",
  textPrimary: "#0F1715",
  textSecondary: "#52605B",
  textMuted: "#8C9B95",
  accent: "#00B386",
  accentSoft: "rgba(0,179,134,0.10)",
  textOnAccent: "#FFFFFF",
  danger: "#E54848",
  warning: "#D97706",
  track: "rgba(0,0,0,0.06)",
};

// Default export is dark colors for backwards-compatibility
export const Colors = DarkColors;


// Per-category accent colors — used in chips, bars, badges.
export const CategoryColors = {
  Food: "#FFB454",
  Transport: "#5AB8FF",
  Shopping: "#FF7AC3",
  Health: "#4ADE80",
  Bills: "#B197FC",
  Fun: "#FF8A7A",
  Other: "#9AA6A1",
} as const;

export type Category = keyof typeof CategoryColors;

// Border radii per component type.
export const Radius = {
  card: 20,
  button: 14,
  input: 14,
  chip: 999,
  listRow: 12,
} as const;

// DM Sans font family references (loaded in _layout.tsx).
export const Fonts = Platform.select({
  ios: {
    sans: "DMSans-Regular",
    sansBold: "DMSans-Bold",
    sansSemiBold: "DMSans-SemiBold",
  },
  android: {
    sans: "DMSans-Regular",
    sansBold: "DMSans-Bold",
    sansSemiBold: "DMSans-SemiBold",
  },
  default: {
    sans: "DMSans-Regular",
    sansBold: "DMSans-Bold",
    sansSemiBold: "DMSans-SemiBold",
  },
})!;

// 4px base grid spacing scale.
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

// Shadow presets — only used on modals.
export const Shadow = {
  modal: {
    boxShadow: "0px 12px 32px rgba(0,0,0,0.45)",
  },
} as const;
