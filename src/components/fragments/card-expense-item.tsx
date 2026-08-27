// Fragment displaying single expense item row with category badge and optional delete action.
import { ThemedText } from "@/components/elements";
import {
  CategoryColors,
  Colors,
  Fonts,
  Radius,
  Spacing,
} from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import type { Expense } from "@/types/expense";
import { Pressable, StyleSheet, View } from "react-native";

export type CardExpenseItemProps = {
  item: Expense;
  onDelete?: (id: string) => void;
};

export default function CardExpenseItem({
  item,
  onDelete,
}: CardExpenseItemProps) {
  const { formatAmount } = useExpenses();

  return (
    <View style={styles.expenseRow}>
      <View
        style={[
          styles.categoryBadge,
          { backgroundColor: CategoryColors[item.category] + "20" },
        ]}
      >
        <ThemedText
          type="caption"
          style={{
            color: CategoryColors[item.category],
            fontFamily: Fonts.sansSemiBold,
            fontWeight: "600",
          }}
        >
          {item.category.slice(0, 3).toUpperCase()}
        </ThemedText>
      </View>
      <View style={{ flex: 1, marginLeft: Spacing.md }}>
        <ThemedText type="body">{item.note}</ThemedText>
        <ThemedText type="caption" color="textMuted">
          {item.date}
        </ThemedText>
      </View>
      <View style={{ alignItems: "flex-end", gap: Spacing.xs }}>
        <ThemedText
          type="body"
          style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
        >
          {formatAmount(item.amount)}
        </ThemedText>
        {onDelete && (
          <Pressable onPress={() => onDelete(item.id)} hitSlop={8}>
            <ThemedText type="caption" color="danger">
              Delete
            </ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.listRow,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.listRow,
    alignItems: "center",
    justifyContent: "center",
  },
});
