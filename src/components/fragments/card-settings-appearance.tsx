// Fragment card for appearance and notification settings.
import { Card, Chip, ThemedText } from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses, type ThemeMode } from "@/hooks/use-expenses";
import { StyleSheet, Switch, View } from "react-native";

const THEMES: { label: string; value: ThemeMode }[] = [
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
  { label: "System", value: "system" },
];

const REMINDER_TIMES = ["19:00", "20:00", "21:00", "22:00"];

export default function CardSettingsAppearance() {
  const {
    themeMode,
    setThemeMode,
    colors,
    reminderEnabled,
    setReminderEnabled,
    reminderTime,
    setReminderTime,
  } = useExpenses();

  return (
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
  );
}

const styles = StyleSheet.create({
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
});
