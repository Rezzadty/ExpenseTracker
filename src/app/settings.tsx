// Settings screen providing preferences, appearance & notifications, and about / version info.
import {
  AnimatedScreen,
  Button,
  Card,
  Chip,
  ThemedText,
  ThemedView,
} from "@/components/elements";
import { Navbar } from "@/components/fragments";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses, type ThemeMode } from "@/hooks/use-expenses";
import {
  type CurrencyCode,
  type SeparatorStyle,
} from "@/utils/format";
import * as Linking from "expo-linking";
import { ScrollView, StyleSheet, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CURRENCIES: { label: string; value: CurrencyCode }[] = [
  { label: "IDR (Rp)", value: "IDR" },
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
  { label: "JPY (¥)", value: "JPY" },
];

const SEPARATORS: { label: string; value: SeparatorStyle }[] = [
  { label: "100.000 (Dot)", value: "dot" },
  { label: "100,000 (Comma)", value: "comma" },
];

const THEMES: { label: string; value: ThemeMode }[] = [
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
  { label: "System", value: "system" },
];

const REMINDER_TIMES = ["19:00", "20:00", "21:00", "22:00"];

export default function SettingsScreen() {
  const {
    currency,
    setCurrency,
    separatorStyle,
    setSeparatorStyle,
    expenses,
    formatAmount,
    rates,
    isRatesLive,
    themeMode,
    setThemeMode,
    colors,
    reminderEnabled,
    setReminderEnabled,
    reminderTime,
    setReminderTime,
  } = useExpenses();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Navbar title="Settings" />
        <AnimatedScreen>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Currency & Locale Section */}
            <ThemedText
              type="sectionTitle"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              Currency & Locale
            </ThemedText>

            <Card style={styles.card}>
              <ThemedText
                type="caption"
                color="textMuted"
                style={{ marginBottom: Spacing.xs }}
              >
                Select Currency
              </ThemedText>
              <View style={styles.chipRow}>
                {CURRENCIES.map((c) => (
                  <Chip
                    key={c.value}
                    label={c.label}
                    selected={currency === c.value}
                    onPress={() => setCurrency(c.value)}
                  />
                ))}
              </View>

              <ThemedText
                type="caption"
                color="textMuted"
                style={{ marginTop: Spacing.md, marginBottom: Spacing.xs }}
              >
                Number Format Separator
              </ThemedText>
              <View style={styles.chipRow}>
                {SEPARATORS.map((s) => (
                  <Chip
                    key={s.value}
                    label={s.label}
                    selected={separatorStyle === s.value}
                    onPress={() => setSeparatorStyle(s.value)}
                  />
                ))}
              </View>

              <View style={[styles.previewBox, { borderTopColor: colors.border }]}>
                <View>
                  <ThemedText type="caption" color="textSecondary">
                    Preview (250k IDR):
                  </ThemedText>
                  <ThemedText type="caption" color="textMuted">
                    {isRatesLive ? "Rates: Live API" : "Rates: Default/Cached"}
                  </ThemedText>
                </View>
                <ThemedText
                  type="body"
                  color="accent"
                  style={{ fontFamily: Fonts.sansBold, fontWeight: "700" }}
                >
                  {formatAmount(
                    currency === "IDR"
                      ? 250000
                      : (250000 / rates.IDR) * rates[currency],
                  )}
                </ThemedText>
              </View>
            </Card>

            {/* Appearance & Notifications Section */}
            <ThemedText
              type="sectionTitle"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              Appearance & Notifications
            </ThemedText>

            <Card style={styles.card}>
              <ThemedText
                type="caption"
                color="textMuted"
                style={{ marginBottom: Spacing.xs }}
              >
                Theme Mode
              </ThemedText>
              <View style={styles.chipRow}>
                {THEMES.map((t) => (
                  <Chip
                    key={t.value}
                    label={t.label}
                    selected={themeMode === t.value}
                    onPress={() => setThemeMode(t.value)}
                  />
                ))}
              </View>

              <View style={[styles.infoRow, { marginTop: Spacing.md, borderBottomWidth: 0 }]}>
                <View>
                  <ThemedText
                    type="body"
                    color="textPrimary"
                    style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
                  >
                    Daily Reminder
                  </ThemedText>
                  <ThemedText type="caption" color="textMuted">
                    Prompt to log daily expenses
                  </ThemedText>
                </View>
                <Switch
                  value={reminderEnabled}
                  onValueChange={setReminderEnabled}
                  trackColor={{ false: colors.track, true: colors.accent }}
                  thumbColor={colors.textPrimary}
                />
              </View>

              {reminderEnabled && (
                <View style={{ marginTop: Spacing.md }}>
                  <ThemedText
                    type="caption"
                    color="textMuted"
                    style={{ marginBottom: Spacing.xs }}
                  >
                    Reminder Schedule Time
                  </ThemedText>
                  <View style={styles.chipRow}>
                    {REMINDER_TIMES.map((time) => (
                      <Chip
                        key={time}
                        label={time}
                        selected={reminderTime === time}
                        onPress={() => setReminderTime(time)}
                      />
                    ))}
                  </View>
                </View>
              )}
            </Card>

            {/* About & Version Section */}
            <ThemedText
              type="sectionTitle"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              About & Version
            </ThemedText>

            <Card style={styles.card}>
              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <ThemedText type="caption" color="textMuted">
                  App Name
                </ThemedText>
                <ThemedText
                  type="body"
                  color="textPrimary"
                  style={styles.infoValue}
                >
                  ExpenseTracker
                </ThemedText>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <ThemedText type="caption" color="textMuted">
                  Version
                </ThemedText>
                <ThemedText
                  type="body"
                  color="textPrimary"
                  style={styles.infoValue}
                >
                  1.0.0 (Build 1)
                </ThemedText>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <ThemedText type="caption" color="textMuted">
                  Total Records
                </ThemedText>
                <ThemedText
                  type="body"
                  color="textPrimary"
                  style={styles.infoValue}
                >
                  {expenses.length} transaction
                  {expenses.length !== 1 ? "s" : ""}
                </ThemedText>
              </View>

              <View style={styles.buttonRow}>
                <Button
                  onPress={() => handleOpenLink("https://github.com")}
                  style={[styles.docButton, { borderColor: colors.accent }]}
                >
                  <ThemedText
                    type="body"
                    color="accent"
                    style={{
                      fontFamily: Fonts.sansSemiBold,
                      fontWeight: "600",
                    }}
                  >
                    Documentation & Terms
                  </ThemedText>
                </Button>
              </View>
            </Card>
          </ScrollView>
        </AnimatedScreen>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 100 },
  sectionHeader: {
    marginBottom: Spacing.sm,
    marginTop: Spacing.base,
  },
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  previewBox: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  infoValue: {
    fontFamily: Fonts.sansSemiBold,
    fontWeight: "600",
  },
  buttonRow: {
    marginTop: Spacing.lg,
    flexDirection: "row",
  },
  docButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});



