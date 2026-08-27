// Fragment composite component containing full expense list with top summary, search input, filter chips, and custom delete modal.
import {
  AnimatedListItem,
  Chip,
  Input,
  ThemedText,
  ThemedView,
} from "@/components/elements";
import CardExpenseItem from "@/components/fragments/card-expense-item";
import ModalConfirmDelete from "@/components/fragments/modal-confirm-delete";
import {
  Fonts,
  Radius,
  Spacing,
  type Category,
} from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import type { Expense } from "@/types/expense";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Food",
  "Transport",
  "Shopping",
  "Health",
  "Bills",
  "Fun",
  "Other",
];

export type CardExpensesSectionProps = {
  expenses: Expense[];
  onDelete: (id: string) => void;
};

export default function CardExpensesSection({
  expenses,
  onDelete,
}: CardExpensesSectionProps) {
  const { formatAmount } = useExpenses();
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [search, setSearch] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (pendingDeleteId) {
      onDelete(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  const filtered = useMemo(() => {
    let result = expenses;
    if (filter !== "All") result = result.filter((e) => e.category === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.note.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q),
      );
    }
    return result;
  }, [expenses, filter, search]);

  const total = useMemo(
    () => filtered.reduce((s, e) => s + e.amount, 0),
    [filtered],
  );

  return (
    <>
      <ThemedView surface="surface" style={styles.summaryCard}>
        <ThemedText type="caption" color="textSecondary">
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </ThemedText>
        <ThemedText
          type="body"
          color="textPrimary"
          style={{
            fontFamily: Fonts.sansBold,
            fontWeight: "700",
            fontSize: 20,
          }}
        >
          {formatAmount(total)}
        </ThemedText>
      </ThemedView>

      <Input
        placeholder="Search expenses..."
        value={search}
        onChangeText={setSearch}
        style={{ marginBottom: Spacing.base }}
      />

      <View style={styles.chipRow}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={c}
            selected={filter === c}
            onPress={() => setFilter(c)}
          />
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <ThemedText type="body" color="textMuted">
            No expenses found
          </ThemedText>
        </View>
      ) : (
        filtered.map((item, i) => (
          <AnimatedListItem key={item.id} index={i}>
            <CardExpenseItem item={item} onDelete={(id) => setPendingDeleteId(id)} />
          </AnimatedListItem>
        ))
      )}

      <ModalConfirmDelete
        visible={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  empty: {
    paddingVertical: Spacing.xxl,
    alignItems: "center",
  },
});
