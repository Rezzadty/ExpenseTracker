# ExpenseTracker

A personal expense tracking mobile app to help you monitor daily spending, set budgets, categorize expenses, and analyze spending trends.

## Features

- **Daily Expense Tracking**: Add, browse, and delete expenses with amount, category, note, and date.
- **Budget Management**: Set and track daily spending limits with progress status.
- **Category Customization**: Add, edit, or remove custom expense categories and choose color accents.
- **Analytics & Trends**: Timeframe filters (Day, Week, Month), category breakdowns, custom donut chart, and trend comparisons.
- **Currency & Locale**: Multi-currency conversion (IDR, USD, EUR, GBP, JPY) with live API rates and customizable number separators.
- **Theme & Notifications**: Dark, Light, and System appearance modes with customizable daily reminder schedules.
- **Expense History**: Category filtering, keyword search, and confirmation modal for deletions.
- **Bottom Tab Navigation**: Quick navigation across Home, Expenses, Analytics, and Settings screens.
- **Micro-interactions**: Fluid screen transitions, animated list items, and modal popups using React Native Reanimated.

## Tech Stack

| Layer      | Technology                                                                            |
| ---------- | ------------------------------------------------------------------------------------- |
| Framework  | [Expo](https://expo.dev) (SDK 57)                                                     |
| Language   | TypeScript                                                                            |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)        |
| UI         | React Native (0.86)                                                                   |
| Font       | [DM Sans](https://fonts.google.com/specimen/DM+Sans) via `@expo-google-fonts/dm-sans` |
| Animations | React Native Reanimated                                                               |
| Gestures   | React Native Gesture Handler                                                          |
| Linting    | ESLint with `eslint-config-expo`                                                      |

## Design System

Adaptive dual-theme palette:

- **Dark Theme ("Midnight Mint")**: `#0B0F0E` background with mint green accent (`#00D9A3`)
- **Light Theme**: `#F5F8F6` background with emerald accent (`#00B386`)
- Dynamic category color accents with preset palettes
- DM Sans typography throughout
- 4px base spacing grid, modern rounded cards, pill-shaped chips

## Project Structure

```
src/
  app/                 # File-based routes (Home, Expenses, Analytics, Settings)
  components/
    elements/          # Atomic reusable UI components (Button, Card, Input, Chip, etc.)
    fragments/         # Feature-specific composite cards, modals, navigation bars
  constants/           # Theme colors, category tokens, spacing, fonts
  hooks/               # Context store and custom hooks (expenses, dashboard, analytics)
  services/            # External services and APIs (live exchange rates)
  types/               # TypeScript type definitions (expense, categories)
  utils/               # Formatting and currency utilities
```

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Open on your device using:
   - [Expo Go](https://expo.dev/go)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Development build](https://docs.expo.dev/develop/development-builds/introduction/)

## Scripts

| Command           | Description           |
| ----------------- | --------------------- |
| `npm start`       | Start Expo dev server |
| `npm run android` | Start on Android      |
| `npm run ios`     | Start on iOS          |
| `npm run web`     | Start on web          |
| `npm run lint`    | Run ESLint            |

## Current Status

**In development** — Core user flows (Dashboard, Expenses, Analytics, Settings, Category Customization, Multi-Currency, Theme Switching) are functional with shared React Context state. Remote database and cloud sync planned next.
