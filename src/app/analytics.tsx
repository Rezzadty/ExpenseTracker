// Analytics screen displaying total spend, donut breakdown, category bars, and 7-day trend.
import { AnimatedScreen, ThemedText, ThemedView } from "@/components/elements";
import {
  CardAnalyticsDonut,
  CardAnalyticsTrend,
  CardCategoryProgress,
  Navbar,
} from "@/components/fragments";
import { Colors, Radius, Spacing, type Category } from "@/constants/theme";
import { useAnalytics } from "@/hooks/use-analytics";
import { formatMoney } from "@/utils/format";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalyticsScreen() {
  const { expenses, totalSpent, byCategory, slices, maxCategory } =
    useAnalytics();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Navbar />
        <AnimatedScreen>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.totalCard}>
              <ThemedText type="sectionTitle" color="textSecondary">
                Total Spending
              </ThemedText>
              <ThemedText
                type="money"
                color="textPrimary"
                style={{ fontSize: 32, marginTop: Spacing.sm }}
              >
                {formatMoney(totalSpent)}
              </ThemedText>
              <ThemedText
                type="caption"
                color="textMuted"
                style={{ marginTop: Spacing.xs }}
              >
                {expenses.length} transactions
              </ThemedText>
            </View>

            <ThemedView surface="surface" style={styles.card}>
              <ThemedText
                type="sectionTitle"
                color="textSecondary"
                style={{ marginBottom: Spacing.base }}
              >
                Spending Breakdown
              </ThemedText>
              <CardAnalyticsDonut data={slices} total={totalSpent} />
            </ThemedView>

            <ThemedView surface="surface" style={styles.card}>
              <ThemedText
                type="sectionTitle"
                color="textSecondary"
                style={{ marginBottom: Spacing.base }}
              >
                Category Details
              </ThemedText>
              {(Object.entries(byCategory) as [Category, number][]).map(
                ([cat, amt]) => (
                  <CardCategoryProgress
                    key={cat}
                    category={cat}
                    amount={amt}
                    max={maxCategory}
                  />
                ),
              )}
            </ThemedView>

            <ThemedView surface="surface" style={styles.card}>
              <ThemedText
                type="sectionTitle"
                color="textSecondary"
                style={{ marginBottom: Spacing.base }}
              >
                Daily Trend
              </ThemedText>
              <CardAnalyticsTrend expenses={expenses} />
            </ThemedView>
          </ScrollView>
        </AnimatedScreen>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 100 },
  totalCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    boxShadow: "0px 8px 16px rgba(0,0,0,0.35)",
  },
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});
