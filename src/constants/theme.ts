// "Midnight Mint" design system — all color, typography, spacing, and shape tokens for the app.
import { Platform } from 'react-native';

// Core palette — every UI color must come from here.
export const Colors = {
  background: '#0B0F0E',
  surface: '#131917',
  surfaceRaised: '#1B2320',
  border: 'rgba(235,255,249,0.08)',
  textPrimary: '#EDF4F1',
  textSecondary: '#93A39D',
  textMuted: '#5F6E68',
  accent: '#00D9A3',
  accentSoft: 'rgba(0,217,163,0.12)',
  textOnAccent: '#04241B',
  danger: '#FF6B6B',
  warning: '#FFC24D',
  track: 'rgba(255,255,255,0.08)',
} as const;

// Per-category accent colors — used in chips, bars, badges.
export const CategoryColors = {
  Food: '#FFB454',
  Transport: '#5AB8FF',
  Shopping: '#FF7AC3',
  Health: '#4ADE80',
  Bills: '#B197FC',
  Fun: '#FF8A7A',
  Other: '#9AA6A1',
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
  ios: { sans: 'DMSans-Regular', sansBold: 'DMSans-Bold', sansSemiBold: 'DMSans-SemiBold' },
  android: { sans: 'DMSans-Regular', sansBold: 'DMSans-Bold', sansSemiBold: 'DMSans-SemiBold' },
  default: { sans: 'DMSans-Regular', sansBold: 'DMSans-Bold', sansSemiBold: 'DMSans-SemiBold' },
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 32,
    elevation: 24,
  },
} as const;
