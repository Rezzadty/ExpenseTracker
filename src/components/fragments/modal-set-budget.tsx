// Fragment modal dialog for setting daily spending budget.
import {
  AnimatedModal,
  Input,
  ThemedText,
} from "@/components/elements";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export type ModalSetBudgetProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ModalSetBudget({
  visible,
  onClose,
}: ModalSetBudgetProps) {
  const [budget, setBudget] = useState("");

  return (
    <AnimatedModal visible={visible} onClose={onClose}>
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
          Daily Budget (Rp)
        </ThemedText>
        <Input
          placeholder="e.g. 200000"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
          style={{ marginBottom: Spacing.base }}
        />

        <Pressable style={styles.saveBtn} onPress={onClose}>
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
