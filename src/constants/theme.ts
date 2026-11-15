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
  edit: string;
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
  edit: "#4C85E6",
};

export const LightColors: ColorTheme = {
  background: "#F2F5F3",
  surface: "#FFFFFF",
  surfaceRaised: "#E8EFEA",
  border: "#D1DCD6",
  textPrimary: "#0D1412",
  textSecondary: "#45544E",
  textMuted: "#667770",
  accent: "#008765",
  accentSoft: "rgba(0,135,101,0.12)",
  textOnAccent: "#FFFFFF",
  danger: "#D93838",
  warning: "#C26200",
  track: "rgba(0,0,0,0.06)",
  edit: "#1D4ED8",
};

// Default export is dark colors for backwards-compatibility
export const Colors = DarkColors;

// Per-category accent colors — default presets used in chips, bars, badges.
export const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  Food: "#FFB454",
  Transport: "#5AB8FF",
  Shopping: "#FF7AC3",
  Health: "#4ADE80",
  Bills: "#B197FC",
  Fun: "#FF8A7A",
  Other: "#9AA6A1",
};

export const LIGHT_CATEGORY_COLORS: Record<string, string> = {
  Food: "#D97706",
  Transport: "#0284C7",
  Shopping: "#DB2777",
  Health: "#16A34A",
  Bills: "#7C3AED",
  Fun: "#EA580C",
  Other: "#64748B",
};

export const CategoryColors = DEFAULT_CATEGORY_COLORS;

export type Category = string;

export interface CategoryItem {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "cat-1", name: "Food", color: "#FFB454", icon: "utensils" },
  { id: "cat-2", name: "Transport", color: "#5AB8FF", icon: "car" },
  { id: "cat-3", name: "Shopping", color: "#FF7AC3", icon: "shopping-bag" },
  { id: "cat-4", name: "Health", color: "#4ADE80", icon: "heart-pulse" },
  { id: "cat-5", name: "Bills", color: "#B197FC", icon: "receipt" },
  { id: "cat-6", name: "Fun", color: "#FF8A7A", icon: "gamepad" },
  { id: "cat-7", name: "Other", color: "#9AA6A1", icon: "ellipsis" },
];

// Border radii per component type.
export const Radius = {
  card: 20,
  button: 14,
  input: 14,
  chip: 999,
  listRow: 12,
} as const;

// Google Sans Flex variable font (loaded in _layout.tsx).
export const Fonts = Platform.select({
  ios: {
    sans: "GoogleSansFlex",
    sansBold: "GoogleSansFlex",
    sansSemiBold: "GoogleSansFlex",
  },
  android: {
    sans: "GoogleSansFlex",
    sansBold: "GoogleSansFlex",
    sansSemiBold: "GoogleSansFlex",
  },
  default: {
    sans: "GoogleSansFlex",
    sansBold: "GoogleSansFlex",
    sansSemiBold: "GoogleSansFlex",
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
