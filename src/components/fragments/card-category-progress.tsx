// Fragment component displaying category spending with label, formatted amount, and animated progress bar.
import { ProgressBar, ThemedText } from "@/components/elements";
import { CategoryColors, Spacing, type Category } from "@/constants/theme";
import { formatMoney } from "@/utils/format";
import { StyleSheet, View } from "react-native";

export type CardCategoryProgressProps = {
  category: Category;
  amount: number;
  max: number;
};

export default function CardCategoryProgress({
  category,
  amount,
  max,
}: CardCategoryProgressProps) {
  const percentage = max > 0 ? (amount / max) * 100 : 0;
  const color = CategoryColors[category];

  return (
    <View style={styles.categoryRow}>
      <View style={styles.categoryLabelRow}>
        <View style={[styles.categoryDot, { backgroundColor: color }]} />
        <ThemedText type="body" style={{ flex: 1 }}>
          {category}
        </ThemedText>
        <ThemedText type="body" color="textSecondary">
          {formatMoney(amount)}
        </ThemedText>
      </View>
      <ProgressBar percentage={percentage} color={color} />
    </View>
  );
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
