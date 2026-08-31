// Analytics screen displaying period filters, total spend, donut breakdown, category bars, and trend chart.
import {
  AnimatedScreen,
  Chip,
  ThemedText,
  ThemedView,
} from "@/components/elements";
import {
  CardAnalyticsDonut,
  CardAnalyticsTrend,
  CardCategoryProgress,
  Navbar,
} from "@/components/fragments";
import { Radius, Spacing, type Category } from "@/constants/theme";
import { useAnalytics, type Timeframe } from "@/hooks/use-analytics";
import { useExpenses } from "@/hooks/use-expenses";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const PERIOD_LABELS: Record<Timeframe, string> = {
  daily: "Today Spending",
  weekly: "This Week Spending",
  monthly: "This Month Spending",
};

export default function AnalyticsScreen() {
  const { formatAmount, colors } = useExpenses();
  const {
    timeframe,
    setTimeframe,
    filteredExpenses,
    totalSpent,
    byCategory,
    slices,
    maxCategory,
  } = useAnalytics();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Navbar />
        <AnimatedScreen>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.timeframeRow}>
              {TIMEFRAMES.map((t) => (
                <Chip
                  key={t.value}
                  label={t.label}
                  selected={timeframe === t.value}
                  onPress={() => setTimeframe(t.value)}
                />
              ))}
            </View>

            <View style={[styles.totalCard, { backgroundColor: colors.surface }]}>
              <ThemedText type="sectionTitle" color="textSecondary">
                {PERIOD_LABELS[timeframe]}
              </ThemedText>
              <ThemedText
                type="money"
                color="textPrimary"
                style={{ fontSize: 32, marginTop: Spacing.sm }}
              >
                {formatAmount(totalSpent)}
              </ThemedText>
              <ThemedText
                type="caption"
                color="textMuted"
                style={{ marginTop: Spacing.xs }}
              >
                {filteredExpenses.length} transactions
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
              {slices.length === 0 ? (
                <View style={styles.empty}>
                  <ThemedText type="body" color="textMuted">
                    No data for this period
                  </ThemedText>
                </View>
              ) : (
                <CardAnalyticsDonut data={slices} total={totalSpent} />
              )}
            </ThemedView>

            <ThemedView surface="surface" style={styles.card}>
              <ThemedText
                type="sectionTitle"
                color="textSecondary"
                style={{ marginBottom: Spacing.base }}
              >
                Category Details
              </ThemedText>
              {Object.keys(byCategory).length === 0 ? (
                <View style={styles.empty}>
                  <ThemedText type="body" color="textMuted">
                    No transactions
                  </ThemedText>
                </View>
              ) : (
                (Object.entries(byCategory) as [Category, number][]).map(
                  ([cat, amt]) => (
                    <CardCategoryProgress
                      key={cat}
                      category={cat}
                      amount={amt}
                      max={maxCategory}
                    />
                  ),
                )
              )}
            </ThemedView>

            <ThemedView surface="surface" style={styles.card}>
              <ThemedText
                type="sectionTitle"
                color="textSecondary"
                style={{ marginBottom: Spacing.base }}
              >
                {timeframe === "monthly" ? "Monthly Breakdown" : "Daily Trend"}
              </ThemedText>
              <CardAnalyticsTrend
                expenses={filteredExpenses}
                timeframe={timeframe}
              />
            </ThemedView>
          </ScrollView>
        </AnimatedScreen>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 100 },
  timeframeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  totalCard: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    boxShadow: "0px 8px 16px rgba(0,0,0,0.15)",
  },
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  empty: {
    paddingVertical: Spacing.lg,
    alignItems: "center",
  },
});
