# ExpenseTracker

A personal expense tracking mobile app to help you monitor daily spending, set budgets, categorize expenses, and analyze spending trends.

## Features

- **Daily Expense Tracking**: Add, browse, and delete expenses with amount, category, note, and date.
- **Budget Management**: Set and track daily spending limits with progress status.
- **Analytics & Trends**: Timeframe filters (Day, Week, Month, Year), category breakdowns, custom donut chart, and trend comparisons.
- **Expense History**: Category filtering, sorting by date/amount, and confirmation modal for deletions.
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

Custom dark theme **"Midnight Mint"**:

- Dark background (`#0B0F0E`) with layered surface cards
- Accent color: mint green (`#00D9A3`)
- 7 distinct category colors for visual clarity
- DM Sans typography throughout
- 4px base spacing grid, modern rounded cards, pill-shaped chips

## Project Structure

```
src/
  app/                 # File-based routes (Home, Expenses, Analytics, Settings)
  components/
    elements/          # Atomic reusable UI components (Button, Card, Input, Chip, etc.)
    fragments/         # Feature-specific composite cards and modals
  constants/           # Theme colors, category definitions, spacing tokens
  hooks/               # Context store and custom hooks (expenses, dashboard, analytics)
  types/               # TypeScript type definitions
  utils/               # Formatting utilities
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

**In development** — Core user flows (Dashboard, Expenses, Analytics, Settings, Budgeting, Category breakdown) are functional with shared React Context state. Remote database and cloud sync planned next.
