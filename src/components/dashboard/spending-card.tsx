import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { formatDate, formatMoney } from "@/utils/format";

export function SpendingCard({ todaySpent }: { todaySpent: number }) {
  return (
    <Animated.View entering={FadeInUp.duration(400).springify().damping(18)} style={styles.spendingCard}>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  spendingCard: {
    backgroundColor: Colors.surface,
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
