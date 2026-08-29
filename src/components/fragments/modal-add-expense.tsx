// Fragment modal dialog for adding new expense records with category selection.
import {
  AnimatedModal,
  Chip,
  Input,
  ThemedText,
} from "@/components/elements";
import {
  Fonts,
  Radius,
  Spacing,
  type Category,
} from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { CURRENCY_OPTIONS } from "@/utils/format";
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
  const { currency, colors, categories } = useExpenses();
  const symbol = CURRENCY_OPTIONS[currency]?.symbol || "Rp";

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const activeCategory =
    (selectedCategory && categories.some((c) => c.name === selectedCategory)
      ? selectedCategory
      : categories[0]?.name) || "Food";

  const handleSave = () => {
    const raw = amount.replace(/,/g, '.');
    const amt = parseFloat(raw);
    if (isNaN(amt) || amt <= 0 || !note.trim()) return;
    onSave({
      amount: amt,
      category: activeCategory,
      note: note.trim(),
      date: new Date().toISOString().slice(0, 10),
    });
    setAmount("");
    setNote("");
    setSelectedCategory(null);
    onClose();
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
          {`Amount (${symbol})`}
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
          {categories.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              selected={activeCategory === c.name}
              onPress={() => setSelectedCategory(c.name)}
            />
          ))}
        </View>

        <Pressable style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={handleSave}>
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
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
    marginTop: Spacing.lg,
  },
});
