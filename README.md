# ExpenseTracker

A personal expense tracking mobile app to help you monitor daily spending, categorize expenses, and understand where your money goes.

## Purpose

This app is built as a personal finance tool to:

- Track daily expenses with amount, category, and notes
- View today's spending at a glance
- Break down spending by category (Food, Transport, Shopping, Health, Bills, Fun, Other)
- Filter and browse expense history
- Visualize spending distribution with progress bars

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

### Not yet integrated (planned)

- **PostgreSQL** — for cloud database and data persistence
- **Charts library** — for spending trends and analytics

## Design System

The app uses a custom dark theme called **"Midnight Mint"**:

- Dark background (`#0B0F0E`) with layered surfaces for depth
- Accent color: mint green (`#00D9A3`)
- 7 distinct category colors for visual clarity
- DM Sans typography throughout
- 4px base spacing grid, 20px card radius, pill-shaped chips

## Project Structure

```
src/
  app/              # Screens (file-based routing)
    _layout.tsx      # Root layout — font loading, splash screen
    index.tsx        # Dashboard screen
  components/       # Reusable UI components
    themed-text.tsx  # Text with typography presets
    themed-view.tsx  # View with surface depth layers
  constants/
    theme.ts         # All design tokens (colors, fonts, spacing, radii, shadows)
  store/
    expenses.ts      # In-memory expense state (hook-based)
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

**In development** — Dashboard screen is functional with in-memory data. Persistence, additional screens, and navigation are coming next.
