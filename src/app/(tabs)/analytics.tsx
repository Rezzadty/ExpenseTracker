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
import { Radius, Spacing, Fonts, type Category } from "@/constants/theme";
import { useAnalytics, type Timeframe } from "@/hooks/use-analytics";
import { useExpenses } from "@/hooks/use-expenses";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
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

function formatMonthKey(key: string): string {
  const [year, month] = key.split("-").map(Number);
  const monthNames = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];
  return `${monthNames[month - 1]} ${year}`;
}

export default function AnalyticsScreen() {
  const { formatAmount, colors } = useExpenses();
  const {
    timeframe,
    setTimeframe,
    periodKey,
    setPeriodKey,
    canGoPrev,
    canGoNext,
    filteredExpenses,
    totalSpent,
    previousMonthTotal,
    changePercent,
    byCategory,
    slices,
    maxCategory,
  } = useAnalytics();

  const isMonthly = timeframe === "monthly";
  const periodLabel = isMonthly && periodKey
    ? formatMonthKey(periodKey)
    : PERIOD_LABELS[timeframe];

  const handlePrevMonth = () => {
    if (!periodKey || !canGoPrev) return;
    const [year, month] = periodKey.split("-").map(Number);
    const date = new Date(year, month - 2, 1); // previous month
    setPeriodKey(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  };

  const handleNextMonth = () => {
    if (!periodKey || !canGoNext) return;
    const [year, month] = periodKey.split("-").map(Number);
    const date = new Date(year, month, 1); // next month
    setPeriodKey(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  };

  const getChangeColorKey = (pct: number) => (pct >= 0 ? "accent" : "danger");
  const getChangePrefix = (pct: number) => (pct >= 0 ? "+" : "");

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

            {isMonthly && periodKey && (
              <View style={styles.monthPickerRow}>
                <Pressable
                  style={[
                    styles.monthNavBtn,
                    { backgroundColor: canGoPrev ? colors.surface : colors.surfaceRaised },
                  ]}
                  onPress={handlePrevMonth}
                  disabled={!canGoPrev}
                  accessibilityLabel="Previous month"
                >
                  <ThemedText type="body" color={canGoPrev ? "accent" : "textMuted"} style={{ fontSize: 20 }}>
                    ‹
                  </ThemedText>
                </Pressable>
                <ThemedText
                  type="sectionTitle"
                  color="textPrimary"
                  style={styles.monthPickerLabel}
                >
                  {formatMonthKey(periodKey)}
                </ThemedText>
                <Pressable
                  style={[
                    styles.monthNavBtn,
                    { backgroundColor: canGoNext ? colors.surface : colors.surfaceRaised },
                  ]}
                  onPress={handleNextMonth}
                  disabled={!canGoNext}
                  accessibilityLabel="Next month"
                >
                  <ThemedText type="body" color={canGoNext ? "accent" : "textMuted"} style={{ fontSize: 20 }}>
                    ›
                  </ThemedText>
                </Pressable>
              </View>
            )}

            <View style={[styles.totalCard, { backgroundColor: colors.surface }]}>
              <ThemedText type="sectionTitle" color="textSecondary">
                {periodLabel}
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
              {isMonthly && periodKey && previousMonthTotal > 0 && totalSpent > 0 && (
                <ThemedText
                  type="caption"
                  color={getChangeColorKey(changePercent)}
                  style={{
                    marginTop: Spacing.xs,
                    fontFamily: Fonts.sansSemiBold,
                    fontWeight: "600",
                  }}
                >
                  {getChangePrefix(changePercent)}{changePercent.toFixed(1)}% vs last month
                </ThemedText>
              )}
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

            {timeframe !== "daily" && (
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
            )}
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
  monthPickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  monthNavBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.chip,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  monthPickerLabel: {
    minWidth: 100,
    textAlign: "center",
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
