// Fragment displaying single expense item row with category badge and optional delete action.
import { ThemedText } from "@/components/elements";
import {
  DEFAULT_CATEGORY_COLORS,
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
  onEdit?: (item: Expense) => void;
};

export default function CardExpenseItem({
  item,
  onDelete,
  onEdit,
}: CardExpenseItemProps) {
  const { formatAmount, colors, categoryColorMap } = useExpenses();
  const catColor =
    categoryColorMap[item.category] ||
    DEFAULT_CATEGORY_COLORS[item.category] ||
    colors.accent;
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <View style={[styles.expenseRow, { backgroundColor: colors.surface }]}>
      <View
        style={[styles.categoryBadge, { backgroundColor: catColor + "20" }]}
      >
        <ThemedText
          type="caption"
          style={{
            color: catColor,
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
      <View
        style={[
          styles.rightCol,
          { alignItems: hasActions ? "center" : "flex-end" },
        ]}
      >
        <ThemedText
          type="body"
          style={{
            fontFamily: Fonts.sansSemiBold,
            fontWeight: "600",
            textAlign: hasActions ? "center" : "right",
          }}
        >
          {formatAmount(item.amount)}
        </ThemedText>
        {hasActions && (
          <View style={styles.actions}>
            {onEdit && (
              <Pressable
                onPress={() => onEdit(item)}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.actionBtn,
                  {
                    backgroundColor: colors.edit + (pressed ? "28" : "14"),
                    borderColor: colors.edit + "40",
                  },
                ]}
              >
                <ThemedText
                  type="caption"
                  style={{
                    color: colors.edit,
                    fontFamily: Fonts.sansSemiBold,
                    fontWeight: "600",
                    fontSize: 10,
                  }}
                >
                  Edit
                </ThemedText>
              </Pressable>
            )}
            {onDelete && (
              <Pressable
                onPress={() => onDelete(item.id)}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.actionBtn,
                  {
                    backgroundColor: colors.danger + (pressed ? "28" : "14"),
                    borderColor: colors.danger + "40",
                  },
                ]}
              >
                <ThemedText
                  type="caption"
                  style={{
                    color: colors.danger,
                    fontFamily: Fonts.sansSemiBold,
                    fontWeight: "600",
                    fontSize: 10,
                  }}
                >
                  Delete
                </ThemedText>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
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
  rightCol: {
    justifyContent: "center",
    gap: 3,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.chip,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
