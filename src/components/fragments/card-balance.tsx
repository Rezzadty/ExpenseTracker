// Fragment composite card showing today total spending and date.
import { Card, ThemedText } from "@/components/elements";
import { Radius, Spacing } from "@/constants/theme";
import { formatDate, formatMoney } from "@/utils/format";
import { StyleSheet, View } from "react-native";

export type CardBalanceProps = {
  todaySpent: number;
};

export default function CardBalance({ todaySpent }: CardBalanceProps) {
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
          {formatMoney(todaySpent)}
        </ThemedText>
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
});
