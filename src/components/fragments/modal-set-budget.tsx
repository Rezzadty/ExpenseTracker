// Fragment modal dialog for setting daily spending budget.
import { AnimatedModal, Input, ThemedText } from "@/components/elements";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { CURRENCY_OPTIONS } from "@/utils/format";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export type ModalSetBudgetProps = {
  visible: boolean;
  initialBudget?: number;
  onClose: () => void;
  onSave: (budget: number) => void;
};

export default function ModalSetBudget({
  visible,
  initialBudget = 200000,
  onClose,
  onSave,
}: ModalSetBudgetProps) {
  const { currency } = useExpenses();
  const symbol = CURRENCY_OPTIONS[currency]?.symbol || "Rp";
  const [budget, setBudget] = useState("");

  const handleSave = () => {
    const amt = parseInt(budget || String(initialBudget), 10);
    if (isNaN(amt) || amt < 0) return;
    onSave(amt);
    setBudget("");
    onClose();
  };

  const handleClose = () => {
    setBudget("");
    onClose();
  };

  return (
    <AnimatedModal visible={visible} onClose={handleClose}>
      <View style={styles.content}>
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
            Set Budget
          </ThemedText>
          <Pressable onPress={handleClose} hitSlop={12}>
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
          {`Daily Budget (${symbol})`}
        </ThemedText>
        <Input
          placeholder={`Current: ${initialBudget}`}
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
          style={{ marginBottom: Spacing.base }}
        />

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <ThemedText
            type="body"
            color="textOnAccent"
            style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
          >
            Save Budget
          </ThemedText>
        </Pressable>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
    marginTop: Spacing.lg,
  },
});
