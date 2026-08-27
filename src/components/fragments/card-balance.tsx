// Fragment composite card showing today total spending, daily budget, and remaining balance.
import { Card, ProgressBar, ThemedText } from "@/components/elements";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { formatDate } from "@/utils/format";
import { StyleSheet, View } from "react-native";

export type CardBalanceProps = {
  todaySpent: number;
  dailyBudget: number;
};

export default function CardBalance({
  todaySpent,
  dailyBudget,
}: CardBalanceProps) {
  const { formatAmount } = useExpenses();
  const percentage =
    dailyBudget > 0 ? Math.min((todaySpent / dailyBudget) * 100, 100) : 0;
  const remaining = dailyBudget - todaySpent;
  const isOverBudget = remaining < 0;
  const barColor = isOverBudget ? Colors.danger : Colors.accent;

  return (
    <Card style={styles.spendingCard}>
      <ThemedText type="sectionTitle" color="accent">
        {formatDate()}
      </ThemedText>
      <ThemedText
        type="body"
        color="textSecondary"
        style={{ marginTop: Spacing.sm }}
      >
        Today Spending
      </ThemedText>
      <View style={styles.spendingRow}>
        <ThemedText type="money" color="textPrimary">
          {formatAmount(todaySpent)}
        </ThemedText>
      </View>

      <View style={styles.budgetRow}>
        <View>
          <ThemedText type="caption" color="textMuted">
            Daily Budget
          </ThemedText>
          <ThemedText
            type="body"
            color="textSecondary"
            style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
          >
            {formatAmount(dailyBudget)}
          </ThemedText>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <ThemedText type="caption" color="textMuted">
            {isOverBudget ? "Over Budget" : "Remaining"}
          </ThemedText>
          <ThemedText
            type="body"
            color={isOverBudget ? "danger" : "accent"}
            style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
          >
            {formatAmount(Math.abs(remaining))}
          </ThemedText>
        </View>
      </View>

      <View style={styles.progressWrapper}>
        <ProgressBar percentage={percentage} color={barColor} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  spendingCard: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    boxShadow: "0px 8px 16px rgba(0,0,0,0.35)",
  },
  spendingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  progressWrapper: {
    marginTop: Spacing.md,
  },
});
