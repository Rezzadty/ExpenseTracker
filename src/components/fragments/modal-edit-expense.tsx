// Fragment modal for editing existing expense details.
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
import type { Expense } from "@/types/expense";
import { CURRENCY_OPTIONS } from "@/utils/format";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export type ModalEditExpenseProps = {
  visible: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSave: (data: {
    id: string;
    amount: number;
    category: Category;
    note: string;
    date: string;
  }) => void;
};

export default function ModalEditExpense({
  visible,
  expense,
  onClose,
  onSave,
}: ModalEditExpenseProps) {
  const { currency, colors, categories } = useExpenses();
  const symbol = CURRENCY_OPTIONS[currency]?.symbol || "Rp";

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [prevExpense, setPrevExpense] = useState<Expense | null>(null);
  const [prevVisible, setPrevVisible] = useState(false);

  if (visible !== prevVisible || expense !== prevExpense) {
    setPrevVisible(visible);
    setPrevExpense(expense);
    if (expense) {
      setAmount(expense.amount.toString());
      setNote(expense.note);
      setDate(expense.date);
      setCategory(expense.category);
    } else {
      setAmount("");
      setNote("");
      setDate("");
      setCategory("Food");
    }
  }

  const handleSave = () => {
    if (!expense) return;
    const raw = amount.replace(/,/g, ".");
    const amt = parseFloat(raw);
    if (isNaN(amt) || amt <= 0 || !note.trim()) return;

    onSave({
      id: expense.id,
      amount: amt,
      category,
      note: note.trim(),
      date: date.trim() || expense.date,
    });
    onClose();
  };

  return (
    <AnimatedModal visible={visible} onClose={onClose}>
      <View style={[styles.content, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <View>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: colors.edit + "20" },
                ]}
              >
                <ThemedText
                  type="caption"
                  style={{
                    color: colors.edit,
                    fontFamily: Fonts.sansSemiBold,
                    fontWeight: "600",
                    fontSize: 11,
                  }}
                >
                  EDIT MODE
                </ThemedText>
              </View>
            </View>
            <ThemedText
              type="body"
              color="textPrimary"
              style={{
                fontFamily: Fonts.sansBold,
                fontWeight: "700",
                fontSize: 18,
                marginTop: 2,
              }}
            >
              Edit Expense
            </ThemedText>
          </View>
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
          Date
        </ThemedText>
        <Input
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
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
              selected={category === c.name}
              onPress={() => setCategory(c.name)}
            />
          ))}
        </View>

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
            style={[styles.saveBtn, { backgroundColor: colors.edit }]}
            onPress={handleSave}
          >
            <ThemedText
              type="body"
              style={{
                color: "#FFFFFF",
                fontFamily: Fonts.sansSemiBold,
                fontWeight: "600",
              }}
            >
              Save Changes
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
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: Spacing.xs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.chip,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.base,
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
    boxShadow: "0px 4px 12px rgba(37,99,235,0.3)",
  },
});
