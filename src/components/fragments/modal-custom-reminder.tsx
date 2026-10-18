// Fragment modal for manually customizing daily reminder time.
import {
  AnimatedModal,
  Input,
  ThemedText,
} from "@/components/elements";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export type ModalCustomReminderProps = {
  visible: boolean;
  initialTime?: string;
  onClose: () => void;
  onSave: (time: string) => void;
};

export default function ModalCustomReminder({
  visible,
  initialTime = "20:00",
  onClose,
  onSave,
}: ModalCustomReminderProps) {
  const { colors } = useExpenses();
  const [time, setTime] = useState(initialTime);
  const [error, setError] = useState<string | null>(null);
  const [prevVisible, setPrevVisible] = useState(false);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setTime(initialTime);
      setError(null);
    }
  }

  const handleSave = () => {
    const trimmed = time.trim().replace(".", ":");
    const parts = trimmed.split(":");

    if (parts.length === 2) {
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (!isNaN(h) && !isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59) {
        const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        setError(null);
        onSave(formatted);
        onClose();
        return;
      }
    } else if (parts.length === 1 && trimmed.length >= 3 && trimmed.length <= 4) {
      const h = parseInt(trimmed.slice(0, trimmed.length - 2), 10);
      const m = parseInt(trimmed.slice(-2), 10);
      if (!isNaN(h) && !isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59) {
        const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        setError(null);
        onSave(formatted);
        onClose();
        return;
      }
    }

    setError("Enter a valid 24h time (e.g. 08:30, 21:15)");
  };

  return (
    <AnimatedModal visible={visible} onClose={onClose}>
      <View style={[styles.content, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <ThemedText
            type="body"
            color="textPrimary"
            style={{
              fontFamily: Fonts.sansBold,
              fontWeight: "700",
              fontSize: 18,
            }}
          >
            Custom Reminder
          </ThemedText>
          <Pressable onPress={onClose} hitSlop={12}>
            <ThemedText type="body" color="textMuted" style={{ fontSize: 22 }}>
              ✕
            </ThemedText>
          </Pressable>
        </View>

        <ThemedText
          type="caption"
          color="textSecondary"
          style={{ marginBottom: Spacing.xs }}
        >
          Reminder Time (24-Hour)
        </ThemedText>
        <Input
          placeholder="e.g. 08:30 or 21:00"
          value={time}
          onChangeText={(val) => {
            setTime(val);
            if (error) setError(null);
          }}
          keyboardType="numbers-and-punctuation"
          style={{ marginBottom: error ? Spacing.xs : Spacing.base }}
        />

        {error && (
          <ThemedText
            type="caption"
            color="danger"
            style={{ marginBottom: Spacing.base, fontSize: 12 }}
          >
            {error}
          </ThemedText>
        )}

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.cancelBtn,
              { backgroundColor: colors.surfaceRaised },
            ]}
            onPress={onClose}
          >
            <ThemedText
              type="body"
              color="textSecondary"
              style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
            >
              Cancel
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.saveBtn, { backgroundColor: colors.accent }]}
            onPress={handleSave}
          >
            <ThemedText
              type="body"
              color="textOnAccent"
              style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
            >
              Set Time
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  content: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  footer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  cancelBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
  },
  saveBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
  },
});
