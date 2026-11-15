// Fragment component displaying category spending with label, formatted amount, and animated progress bar.
import { ProgressBar, ThemedText } from "@/components/elements";
import {
  DEFAULT_CATEGORY_COLORS,
  Fonts,
  Radius,
  Spacing,
  type Category,
} from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { Pressable, StyleSheet, View } from "react-native";

export type CardCategoryProgressProps = {
  category: Category;
  amount: number;
  max: number;
  selected?: boolean;
  onPress?: () => void;
};

export default function CardCategoryProgress({
  category,
  amount,
  max,
  selected = false,
  onPress,
}: CardCategoryProgressProps) {
  const { formatAmount, categoryColorMap, colors } = useExpenses();
  const percentage = max > 0 ? (amount / max) * 100 : 0;
  const color = categoryColorMap[category] || DEFAULT_CATEGORY_COLORS[category] || colors.accent;

  const row = (
    <View
      style={[
        styles.categoryRow,
        selected && {
          backgroundColor: color + "14",
          borderRadius: Radius.chip,
          padding: Spacing.xs,
          marginHorizontal: -Spacing.xs,
        },
      ]}
    >
      <View style={styles.categoryLabelRow}>
        <View style={[styles.categoryDot, { backgroundColor: color }]} />
        <ThemedText
          type="body"
          style={[
            { flex: 1 },
            selected && { fontFamily: Fonts.sansBold, fontWeight: "700" },
          ]}
        >
          {category}
        </ThemedText>
        <ThemedText type="body" color="textSecondary">
          {formatAmount(amount)}
        </ThemedText>
      </View>
      <ProgressBar percentage={percentage} color={color} />
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} hitSlop={4}>
        {row}
      </Pressable>
    );
  }

  return row;
}

const styles = StyleSheet.create({
  categoryRow: { marginBottom: Spacing.md },
  categoryLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
});
