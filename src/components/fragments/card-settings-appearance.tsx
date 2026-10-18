// Fragment card for appearance and notification settings.
import { Card, Chip, ThemedText } from "@/components/elements";
import ModalCustomReminder from "@/components/fragments/modal-custom-reminder";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses, type ThemeMode } from "@/hooks/use-expenses";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";

const THEMES: { label: string; value: ThemeMode }[] = [
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
  { label: "System", value: "system" },
];

const DEFAULT_REMINDER_TIMES = ["19:00", "20:00", "21:00", "22:00"];

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

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTimes, setCustomTimes] = useState<string[]>(() =>
    DEFAULT_REMINDER_TIMES.includes(reminderTime) ? [] : [reminderTime],
  );

  const allReminderTimes = useMemo(() => {
    const list = [...DEFAULT_REMINDER_TIMES];
    for (const t of customTimes) {
      if (!list.includes(t)) list.push(t);
    }
    if (!list.includes(reminderTime)) list.push(reminderTime);
    return list;
  }, [customTimes, reminderTime]);

  const handleSaveCustomTime = (newTime: string) => {
    setReminderTime(newTime);
    setCustomTimes((prev) => (prev.includes(newTime) ? prev : [...prev, newTime]));
  };

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
            {allReminderTimes.map((time) => (
              <Chip
                key={time}
                label={time}
                selected={reminderTime === time}
                onPress={() => setReminderTime(time)}
              />
            ))}
            <Pressable
              style={({ pressed }) => [
                styles.customChip,
                {
                  borderColor: colors.border,
                  backgroundColor: pressed ? colors.accentSoft : colors.surfaceRaised,
                },
              ]}
              onPress={() => setShowCustomModal(true)}
            >
              <ThemedText
                type="caption"
                color="accent"
                style={{
                  fontFamily: Fonts.sansSemiBold,
                  fontWeight: "600",
                }}
              >
                + Custom
              </ThemedText>
            </Pressable>
          </View>
        </View>
      )}

      <ModalCustomReminder
        visible={showCustomModal}
        initialTime={reminderTime}
        onClose={() => setShowCustomModal(false)}
        onSave={handleSaveCustomTime}
      />
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
    alignItems: "center",
  },
  customChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.chip,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
});
