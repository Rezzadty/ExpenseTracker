// Fragment modal dialog for adding new expense records with category selection.
import {
  AnimatedModal,
  Chip,
  Input,
  ThemedText,
} from "@/components/elements";
import {
  CategoryColors,
  Colors,
  Fonts,
  Radius,
  Spacing,
  type Category,
} from "@/constants/theme";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export type ModalAddExpenseProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    amount: number;
    category: Category;
    note: string;
    date: string;
  }) => void;
};

export default function ModalAddExpense({
  visible,
  onClose,
  onSave,
}: ModalAddExpenseProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<Category>("Food");

  const handleSave = () => {
    const amt = parseInt(amount, 10);
    if (!amt || !note.trim()) return;
    onSave({
      amount: amt,
      category,
      note: note.trim(),
      date: new Date().toISOString().slice(0, 10),
    });
    setAmount("");
    setNote("");
    setCategory("Food");
    onClose();
  };

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
            Add Expense
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
          Amount (Rp)
        </ThemedText>
        <Input
          placeholder="e.g. 50000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={{ marginBottom: Spacing.base }}
        />

        <ThemedText
          type="caption"
          color="textSecondary"
          style={{ marginBottom: Spacing.xs }}
        >
          Note
        </ThemedText>
        <Input
          placeholder="What was it for?"
          value={note}
          onChangeText={setNote}
          style={{ marginBottom: Spacing.base }}
        />

        <ThemedText
          type="caption"
          color="textSecondary"
          style={{ marginBottom: Spacing.xs }}
        >
          Category
        </ThemedText>
        <View style={styles.chipRow}>
          {(Object.keys(CategoryColors) as Category[]).map((c) => (
            <Chip
              key={c}
              label={c}
              selected={category === c}
              onPress={() => setCategory(c)}
            />
          ))}
        </View>

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <ThemedText
            type="body"
            color="textOnAccent"
            style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
          >
            Save Expense
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
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
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
