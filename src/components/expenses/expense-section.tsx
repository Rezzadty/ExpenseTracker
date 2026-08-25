import { ExpenseRow } from "@/components/dashboard/expense-row";
import { AnimatedListItem } from "@/components/ui/animated-list-item";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import {
  Colors,
  Fonts,
  Radius,
  Spacing,
  type Category,
} from "@/constants/theme";
import type { Expense } from "@/types/expense";
import { formatMoney } from "@/utils/format";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

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

type Props = {
  expenses: Expense[];
  onDelete: (id: string) => void;
};

export function ExpenseSection({ expenses, onDelete }: Props) {
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [search, setSearch] = useState("");

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
      <TextInput
        style={styles.searchInput}
        placeholderTextColor={Colors.textMuted}
        placeholder="Search expenses..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.chipRow}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            onPress={() => setFilter(c)}
            style={[
              styles.chip,
              filter === c ? styles.chipSelected : styles.chipUnselected,
            ]}
          >
            <ThemedText
              type="caption"
              color={filter === c ? "accent" : "textSecondary"}
              style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
            >
              {c}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedView surface="surface" style={styles.summaryCard}>
        <ThemedText type="caption" color="textSecondary">
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </ThemedText>
        <ThemedText
          type="body"
          color="textPrimary"
          style={{ fontFamily: Fonts.sansBold, fontWeight: "700", fontSize: 20 }}
        >
          {formatMoney(total)}
        </ThemedText>
      </ThemedView>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <ThemedText type="body" color="textMuted">
            No expenses found
          </ThemedText>
        </View>
      ) : (
        filtered.map((item, i) => (
          <AnimatedListItem key={item.id} index={i}>
            <ExpenseRow item={item} onDelete={onDelete} />
          </AnimatedListItem>
        ))
      )}
    </>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.base,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.chip,
  },
  chipSelected: { backgroundColor: Colors.accentSoft },
  chipUnselected: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  empty: {
    paddingVertical: Spacing.xxl,
    alignItems: "center",
  },
});
